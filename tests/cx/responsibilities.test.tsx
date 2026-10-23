import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import App from "../../src/replica/App";
import { initialState } from "../../src/cx/state";
import { ownersForCharge } from "../../src/cx/financialResponsibility";
import { chargesFor, today } from "../../src/replica/student/model";

beforeEach(() => {
   localStorage.clear();
   window.history.replaceState({}, "", "/inicio");
   vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
   );
   Element.prototype.animate = vi.fn(() => ({
      finished: Promise.resolve(),
      cancel: vi.fn(),
   })) as unknown as typeof Element.prototype.animate;
   Element.prototype.scrollIntoView = vi.fn();
});
async function open(path: string) {
   window.history.replaceState({}, "", path);
   render(<App />);
   await waitFor(() => expect(document.querySelector(".student-page[data-student-ui]")).not.toBeNull());
}
describe("Home e responsabilidades financeiras", () => {
   it("abre com uma parcela vencida e migra o exemplo anterior sem apagar pagamentos", async () => {
      expect(chargesFor(initialState).filter(charge => !charge.paid && charge.due < today)).toHaveLength(1);
      const old: Record<string, unknown> = { ...structuredClone(initialState), scenario: "base", chargesPaid: ["DEMO-MENSALIDADE-202611"] };
      delete old.exampleRevision;
      localStorage.setItem("anchieta-cx-demo-v1", JSON.stringify(old));
      await open("/financeiro");
      const summary = screen.getByRole("region", { name: "Resumo financeiro" }).firstElementChild!;
      expect(summary).toHaveTextContent("890,00");
      expect(summary).toHaveTextContent("1 cobrança vencida em aberto");
      const saved = JSON.parse(localStorage.getItem("anchieta-cx-demo-v1")!);
      expect(saved.chargesPaid).toContain("DEMO-MENSALIDADE-202611");
      expect(saved.exampleRevision).toBe(10);
   });

   it.each([
      { scenario: "base" as const, paid: false, value: "0,00", hasOverdue: false },
      { scenario: "financeiro" as const, paid: false, value: "890,00", hasOverdue: true },
      { scenario: "financeiro" as const, paid: true, value: "0,00", hasOverdue: false },
   ])("soma só vencidas em aberto: $scenario, outubro pago=$paid", async ({ scenario, paid, value, hasOverdue }) => {
      const state = { ...structuredClone(initialState), scenario, chargesPaid: paid ? ["DEMO-MENSALIDADE-202610"] : [] };
      localStorage.setItem("anchieta-cx-demo-v1", JSON.stringify(state));
      await open("/financeiro");
      const summary = screen.getByRole("region", { name: "Resumo financeiro" }).firstElementChild!;
      expect(summary).toHaveTextContent("Vencidas");
      expect(summary.querySelector("strong")).toHaveTextContent(value);
      expect(summary).toHaveAttribute("data-has-overdue", String(hasOverdue));
      expect(summary).toHaveTextContent(hasOverdue ? "1 cobrança vencida em aberto" : "Nenhuma cobrança vencida em aberto");
      expect(screen.getAllByRole("checkbox").length).toBeGreaterThanOrEqual(6);
   });

   it("leva os atalhos ao estágio e às disciplinas pendentes, com relógio nos horários", async () => {
      await open("/inicio");
      expect(screen.queryByRole("link", { name: /Realizar pagamento/ })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Conferir e pagar/ })).toBeInTheDocument();
      const quick = screen.getByRole("navigation", { name: "Atalhos da sua rotina" });
      expect(within(quick).getByRole("link", { name: "Estágio" })).toHaveAttribute("href", "/meu-estagio");
      expect(within(quick).getByRole("link", { name: "Meus horários" })).toHaveTextContent("schedule");
      expect(screen.getByRole("link", { name: /DP\/ADAP/ })).toHaveAttribute("href", "/jornada-academica?periodo=1");
      expect(screen.getByRole("link", { name: "Explorar cursos" })).toHaveAttribute(
         "href",
         "https://www.cursoslivres.anchieta.br/collections",
      );
   });
   it("mantém o valor integral da cobrança compartilhada e a seleção ao filtrar", async () => {
      await open("/financeiro");
      fireEvent.click(screen.getByRole("checkbox", { name: /Selecionar Mensalidade · novembro/ }));
      const filters = screen.getByRole("group", { name: "Filtrar cobranças por responsável" });
      fireEvent.click(within(filters).getByRole("button", { name: "Paulo Costa" }));
      expect(screen.getAllByRole("checkbox")).toHaveLength(4);
      expect(screen.queryByRole("checkbox", { name: /Selecionar Mensalidade · novembro/ })).not.toBeInTheDocument();
      expect(screen.getByText(/1 cobrança selecionada fora deste filtro/)).toBeInTheDocument();
      const january = screen.getByRole("checkbox", { name: /Selecionar Mensalidade · janeiro/ });
      const row = january.closest("label")!;
      expect(row).toHaveTextContent("60%");
      expect(row).toHaveTextContent("40%");
      expect(row).toHaveTextContent("valor integral");
      fireEvent.click(january);
      expect(document.querySelector(".student-payment-selection")).toHaveTextContent("1.780,00");
      fireEvent.click(within(filters).getByRole("button", { name: "Todos" }));
      expect(screen.getByRole("checkbox", { name: /Selecionar Mensalidade · novembro/ })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: /Selecionar Mensalidade · janeiro/ })).toBeChecked();
   });
   it("agenda a substituição sem reatribuir cobranças emitidas ou histórico", async () => {
      await open("/financeiro/alteracao-responsavel");
      const dialog = await screen.findByRole("dialog");
      expect(dialog).toHaveTextContent("Joana Costa");
      fireEvent.change(within(dialog).getByLabelText("Nome do novo responsável"), { target: { value: "Carla Costa" } });
      fireEvent.change(within(dialog).getByLabelText("Válido para novas emissões a partir de"), { target: { value: "2027-01-01" } });
      fireEvent.click(within(dialog).getByRole("button", { name: "Agendar alteração" }));
      expect(within(dialog).getByRole("status")).toHaveTextContent("histórico das cobranças foi preservado");
      const saved = JSON.parse(localStorage.getItem("anchieta-cx-demo-v1")!);
      expect(saved.financialPlan.scheduled).toEqual([{ targetId: "student", name: "Carla Costa", effectiveFrom: "2027-01-01" }]);
      expect(ownersForCharge("DEMO-MENSALIDADE-202611", saved)[0].name).toBe("Marina Costa");
      expect(ownersForCharge("DEMO-MENSALIDADE-202608", saved)[0].name).toBe("Joana Costa");
      fireEvent.click(within(dialog).getByRole("button", { name: "Cancelar agendamento de Carla Costa" }));
      expect(JSON.parse(localStorage.getItem("anchieta-cx-demo-v1")!).financialPlan.scheduled).toHaveLength(0);
   });
   it("atribui 100% por cobrança em todos os cenários e preserva um único pagamento compartilhado", () => {
      for (const scenario of ["base", "dp", "financeiro", "vazio"] as const) {
         const state = { ...structuredClone(initialState), scenario };
         for (const charge of chargesFor(state)) expect(ownersForCharge(charge.id, state).reduce((sum, p) => sum + p.share, 0)).toBe(100);
      }
   });
   it("migra o responsável salvo antes da nova divisão sem perder os pedidos", async () => {
      const old: Record<string, unknown> = { ...structuredClone(initialState), responsible: "Carlos Costa (aluno)" };
      delete old.financialPlan;
      localStorage.setItem("anchieta-cx-demo-v1", JSON.stringify(old));
      await open("/financeiro");
      expect(screen.getByRole("group", { name: "Filtrar cobranças por responsável" })).toHaveTextContent("Carlos Costa");
      expect(JSON.parse(localStorage.getItem("anchieta-cx-demo-v1")!).requests).toHaveLength(2);
   });
});
