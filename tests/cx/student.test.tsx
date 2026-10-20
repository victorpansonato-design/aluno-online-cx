import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import App from "../../src/replica/App";
import { initialState } from "../../src/cx/state";
import { navigationHtml } from "../../src/replica/reference";
import { sectionFor } from "../../src/replica/student/model";
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
const main = () => document.querySelector("#conteudo-principal") as HTMLElement;
async function open(path = "/inicio") {
   window.history.replaceState({}, "", path);
   render(<App />);
   await waitFor(() => expect(main()?.querySelector(".student-page")).toBeTruthy());
}
describe("Simplificação por intenção do aluno", () => {
   it("tem seis destinos principais e mantém os assuntos antigos relacionados às áreas corretas", () => {
      const d = new DOMParser().parseFromString(navigationHtml(true), "text/html");
      expect(
         [...d.querySelectorAll('ul[aria-label="Destinos principais"] a')].map(a => a.textContent?.replace(/^[a-z_]+/, "")),
      ).toHaveLength(6);
      expect(d.querySelector("[data-nav-group]")).toBeNull();
      expect(sectionFor("/perfil/notas-e-faltas")?.label).toBe("Meus estudos");
      expect(sectionFor("/perfil/documentos")?.label).toBe("Meus dados");
      expect(sectionFor("/perfil/colacao-de-grau")?.label).toBe("Secretaria virtual");
      expect(sectionFor("/solicitacao-servicos/compensacao-faltas")?.label).toBe("Secretaria virtual");
   });
   it("abre o financeiro com a cobrança da home selecionada e conclui somente a simulação", async () => {
      await open();
      fireEvent.click(screen.getByRole("link", { name: /Conferir e pagar/ }));
      const checkbox = await screen.findByRole("checkbox", { name: /Selecionar Mensalidade/ });
      expect(checkbox).toBeChecked();
      expect(window.location.search).toContain("cobranca=DEMO-MENSALIDADE-202611");
      fireEvent.click(screen.getByRole("link", { name: /Continuar para Pix/ }));
      expect(await screen.findByRole("heading", { name: "Pagar por Pix" })).toBeInTheDocument();
      expect(
         screen.getByText("O QR Code e o código abaixo são ilustrativos e não podem ser usados para pagar.", { exact: false }),
      ).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Simular confirmação do pagamento" }));
      expect(await screen.findByRole("heading", { name: "Pagamento simulado confirmado" })).toBeInTheDocument();
      fireEvent.click(screen.getByRole("link", { name: "Voltar ao início" }));
      expect(await screen.findByText("Nenhum pagamento pendente")).toBeInTheDocument();
      expect(JSON.parse(localStorage.getItem("anchieta-cx-demo-v1") || "{}").chargesPaid).toContain("DEMO-MENSALIDADE-202611");
   });
   it("mantém somente a Ana flutuante no canto, sem faixa de assistência", async () => {
      await open();
      expect(document.querySelector(".replica-ana-launcher")).not.toBeNull();
      expect(document.querySelector(".replica-assistance-space")).toBeNull();
      fireEvent.click(screen.getByRole("button", { name: "Abrir chat da Ana" }));
      expect(await screen.findByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toHaveTextContent("Ana");
   });
   it("a confirmação de um serviço atualiza só aquele protocolo, mantendo a mensalidade em aberto", async () => {
      const state = structuredClone(initialState);
      state.requests.unshift({
         id: "DEMO-PEDIDO-PAGO",
         code: "CSA_030",
         name: "Troca de turno de exemplo",
         status: "Aguardando pagamento",
         date: "2026-10-20",
         detail: "Exemplo",
         price: 25,
      });
      localStorage.setItem("anchieta-cx-demo-v1", JSON.stringify(state));
      await open("/financeiro/pix?cobranca=DEMO-PEDIDO-PAGO");
      fireEvent.click(screen.getByRole("button", { name: "Simular confirmação do pagamento" }));
      await waitFor(() => expect(JSON.parse(localStorage.getItem("anchieta-cx-demo-v1") || "{}").requests[0].status).toBe("Em análise"));
      expect(JSON.parse(localStorage.getItem("anchieta-cx-demo-v1") || "{}").chargesPaid).not.toContain("DEMO-MENSALIDADE-202611");
   });
   it("filtra datas, favorita um evento e mantém um próximo passo contextual", async () => {
      await open("/calendario-academico");
      fireEvent.click(screen.getByRole("button", { name: "Avaliações" }));
      fireEvent.change(screen.getByRole("searchbox", { name: "Buscar no calendário" }), { target: { value: "P1" } });
      fireEvent.click(screen.getByRole("button", { name: "Favoritar: Prova substitutiva da P1" }));
      fireEvent.click(screen.getByRole("button", { name: "Meus favoritos" }));
      expect(screen.getByRole("status")).toHaveTextContent("1 evento encontrado");
      fireEvent.click(screen.getByRole("button", { name: /17 de out.*Prova substitutiva da P1/ }));
      expect(await screen.findByRole("heading", { name: "Prova substitutiva da P1" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Consultar minhas notas" })).toHaveAttribute("href", "/perfil/notas-e-faltas");
      expect(JSON.parse(localStorage.getItem("anchieta-cx-demo-v1") || "{}").favoriteDates).toContain("substitutiva-p1");
   });
   it("mantém todos os avisos disponíveis e permite escolher os assuntos opcionais", async () => {
      await open("/comunicados");
      expect(screen.getByRole("link", { name: "Ver todos os 89 avisos" })).toHaveAttribute("href", "/notificacoes");
      expect(screen.getByRole("checkbox", { name: /Vagas e estágio/ })).not.toBeChecked();
      fireEvent.click(screen.getByRole("checkbox", { name: /Vagas e estágio/ }));
      expect(screen.getByRole("link", { name: /Oportunidades de estágio/ })).toBeInTheDocument();
      expect(screen.getByRole("checkbox", { name: /Acadêmico/ })).toBeDisabled();
   });
   it("mostra a disciplina ligada ao aviso de faltas da home", async () => {
      await open();
      fireEvent.click(screen.getByRole("link", { name: /Confira suas faltas em Contabilidade/ }));
      await waitFor(() => expect(main().querySelector(".student-highlighted-unit")).not.toBeNull());
      expect(main().querySelector(".student-highlighted-unit")).toHaveTextContent("Bases da Contabilidade Business");
   });
   it("chega ao catálogo da secretaria com o assunto escolhido e oferece todos os serviços na busca limpa", async () => {
      window.history.replaceState({}, "", "/secretaria-virtual");
      render(<App />);
      fireEvent.click(await screen.findByRole("button", { name: /Declarações e comprovantes/ }));
      const dialog = await screen.findByRole("dialog");
      const input = within(dialog).getByRole("searchbox");
      expect(input).toHaveValue("declara");
      fireEvent.change(input, { target: { value: "" } });
      expect(within(dialog).getAllByRole("radio")).toHaveLength(40);
   });
});
