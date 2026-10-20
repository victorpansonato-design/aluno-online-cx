import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import App from "../../src/replica/App";
import { loadScreen, loadServiceForm, preparePage, reference } from "../../src/replica/reference";
import { initialState } from "../../src/cx/state";
import { prepareMonth } from "../../src/replica/calendar";

beforeEach(() => {
   localStorage.clear();
   localStorage.setItem("anchieta-navigation-v3", "original");
   window.history.replaceState({}, "", "/inicio");
   vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
         matches: false,
         addListener: vi.fn(),
         removeListener: vi.fn(),
         addEventListener: vi.fn(),
         removeEventListener: vi.fn(),
         dispatchEvent: vi.fn(),
      })),
   );
   Element.prototype.animate = vi.fn(() => ({
      cancel: vi.fn(),
      finished: Promise.resolve(),
   })) as unknown as typeof Element.prototype.animate;
   Element.prototype.scrollIntoView = vi.fn();
   Element.prototype.scrollBy = vi.fn();
});
const main = () => document.querySelector("#conteudo-principal") as HTMLElement;
async function open(path: string) {
   window.history.replaceState({}, "", path);
   render(<App />);
   await waitFor(() => expect(main()?.querySelector(".replica-reference-content") || main()?.querySelector(".replica-hub")).not.toBeNull());
}
describe("Clone de referência", () => {
   it("recalcula a grade mensal e a seleção sem inventar aulas fora do mês capturado", async () => {
      const html = await loadScreen("horarios-mes-dia-2");
      const february = new DOMParser().parseFromString(prepareMonth(html, -8, 28), "text/html");
      expect(february.querySelectorAll("[data-month-day]")).toHaveLength(28);
      expect(february.querySelector("[aria-pressed=true][data-month-day]")?.getAttribute("data-month-day")).toBe("28");
      expect(february.body.textContent).toContain("fevereiro de 2026");
      expect(february.body.textContent).toContain("Não há aulas de demonstração cadastradas neste mês");
   });
   it("preserva os 40 formulários próprios e seus campos, sem executar o sistema original", async () => {
      expect(Object.keys(reference.serviceForms)).toHaveLength(40);
      for (const code of Object.keys(reference.serviceForms)) {
         const form = await loadServiceForm(code);
         expect(form.html).not.toMatch(/<script|<iframe|[?&](?:token|senha|password)=/i);
         const d = new DOMParser().parseFromString(form.html, "text/html");
         expect(d.querySelector("form")).not.toBeNull();
         for (const field of form.fields) expect(d.querySelector('[name="' + field.name + '"]')).not.toBeNull();
      }
      expect((await loadServiceForm("CSA_030")).fields.map(f => f.label)).toEqual(["Turno"]);
      expect((await loadServiceForm("CSA_114")).fields.some(f => f.label === "Tipo prova")).toBe(true);
   });
   it("preserva os oito períodos corretos, sem reutilizar a seleção anterior", async () => {
      for (let period = 1; period <= 8; period++) {
         const html = await loadScreen("jornada-" + period);
         const d = new DOMParser().parseFromString(html, "text/html");
         expect(Array.from(d.querySelectorAll("h3")).some(h => h.textContent === period + "º Período")).toBe(true);
      }
   });
   it("mantém os ativos de cada tela locais e exclui scripts e identificadores de autenticação", async () => {
      const names = [...Object.values(reference.pages).map(x => x.name), ...Object.keys(reference.variants)];
      for (const name of new Set(names)) {
         const html = await loadScreen(name);
         expect(html).not.toMatch(/<script|<iframe|student\/picture|[?&](?:token|password|senha|account)=/i);
         const sources = [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
         expect(sources.every(src => src.startsWith("/replica/") || src.startsWith("data:"))).toBe(true);
      }
   });
   it("insere dados editados como texto e preserva as conexões entre áreas", async () => {
      const state = structuredClone(initialState);
      state.profile.name = "<img src=x onerror=alert(1)>";
      const html = preparePage("/perfil/documentos", await loadScreen("documentos"), true, state, 2);
      const d = new DOMParser().parseFromString(html, "text/html");
      expect(d.querySelector("[onerror]")).toBeNull();
      expect(d.body.textContent).toContain(state.profile.name);
      expect(d.querySelector('a[href="/solicitacao-servicos/solicitar"]')).not.toBeNull();
   });
});
describe("Percursos do clone ativo", () => {
   it("preserva escolhas e observações ao voltar da conferência de um serviço", async () => {
      await open("/solicitacao-servicos/solicitar/CSA_009");
      const turno = await screen.findByRole("combobox", { name: /Turno/ });
      const curso = screen.getByRole("combobox", { name: /Curso/ }) as HTMLSelectElement;
      const courseValue = curso.options[1].value;
      fireEvent.change(turno, { target: { value: "D - Diurno" } });
      fireEvent.change(curso, { target: { value: courseValue } });
      fireEvent.change(screen.getByRole("textbox", { name: /Observação/ }), {
         target: { value: "Conferir opção fictícia sem perder o preenchimento." },
      });
      fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
      await screen.findByRole("button", { name: "Concluir demonstração" });
      fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
      expect(await screen.findByRole("combobox", { name: /Turno/ })).toHaveValue("D - Diurno");
      expect(screen.getByRole("combobox", { name: /Curso/ })).toHaveValue(courseValue);
      expect(screen.getByRole("textbox", { name: /Observação/ })).toHaveValue("Conferir opção fictícia sem perder o preenchimento.");
   });
   it("converte apenas as quebras escapadas das instruções em parágrafos legíveis", async () => {
      await open("/solicitacao-servicos/solicitar/CSA_048_A");
      await screen.findByRole("combobox");
      const form = document.querySelector("[role=dialog] form")!;
      expect(form.textContent).not.toMatch(/<br\s*\/?\s*>/i);
      expect(form.querySelectorAll("[role=note] p")).toHaveLength(3);
      expect(form.textContent).toContain("Esse prazo pode sofrer variações");
   });
   it("abre as notas da disciplina a partir da home e mantém o painel original", async () => {
      await open("/inicio");
      const button = Array.from(main().querySelectorAll("button")).find(b => b.textContent === "Notas e faltas")!;
      fireEvent.click(button);
      const dialog = await screen.findByRole("dialog");
      expect(dialog).toHaveClass("replica-native-dialog");
      expect(within(dialog).getByText("N1 - Nota um")).toBeInTheDocument();
      expect(within(dialog).getByText("8,8")).toBeInTheDocument();
   });
   it("troca o período da jornada e apresenta as disciplinas correspondentes", async () => {
      await open("/jornada-academica");
      fireEvent.click(main().querySelector('button[aria-label^="8º período"]')!);
      await waitFor(() => expect(Array.from(main().querySelectorAll("h3")).some(h => h.textContent === "8º Período")).toBe(true));
   });
   it("envia somente metadados do documento e atualiza o acompanhamento local", async () => {
      await open("/perfil/documentos");
      fireEvent.click(Array.from(main().querySelectorAll("button")).find(b => b.textContent?.startsWith("CPF do aluno"))!);
      const dialog = await screen.findByRole("dialog");
      const file = new File(["conteudo-privado-nao-deve-ser-guardado"], "cpf-ficticio.pdf", { type: "application/pdf" });
      fireEvent.change(within(dialog).getByLabelText("Escolher arquivo"), { target: { files: [file] } });
      fireEvent.click(within(dialog).getByRole("button", { name: "Enviar documento na demonstração" }));
      await waitFor(() => expect(JSON.parse(localStorage.getItem("anchieta-cx-demo-v1") || "{}").docs["0"].status).toBe("Em conferência"));
      expect(localStorage.getItem("anchieta-cx-demo-v1")).not.toContain("conteudo-privado-nao-deve-ser-guardado");
   });
   it("liga um serviço pago ao financeiro e ao mesmo protocolo após a simulação", async () => {
      await open("/solicitacao-servicos/solicitar/CSA_030");
      const dialog = await screen.findByRole("dialog");
      const turno = await within(dialog).findByRole("combobox", { name: /Turno/ });
      fireEvent.change(turno, { target: { value: "D - Diurno" } });
      fireEvent.click(within(dialog).getByRole("button", { name: /Continuar/ }));
      fireEvent.click(await screen.findByRole("button", { name: "Concluir demonstração" }));
      fireEvent.click(await screen.findByRole("button", { name: "Ir para o financeiro" }));
      await waitFor(() => expect(main()?.textContent).toContain("Cobranças de demonstração"));
      expect(main().querySelector("[data-local-request]")).not.toBeNull();
      fireEvent.click(main().querySelector("[data-pay-demo]")!);
      await waitFor(() => expect(JSON.parse(localStorage.getItem("anchieta-cx-demo-v1") || "{}").requests[0].status).toBe("Em análise"));
   });
   it("habilita recurso, data e horários do laboratório conforme a seleção", async () => {
      await open("/solicitacao-servicos/agendamento-laboratorios");
      const local = main().querySelector("#lab-local") as HTMLSelectElement;
      const resource = main().querySelector("#lab-recurso") as HTMLSelectElement;
      expect(resource).toBeDisabled();
      fireEvent.change(local, { target: { value: "v1" } });
      expect(resource).not.toBeDisabled();
      fireEvent.change(resource, { target: { value: "v1" } });
      expect(main().querySelector("#lab-data")).not.toBeDisabled();
      expect(main().querySelector("#lab-inicio")).not.toBeDisabled();
   });
   it("permite selecionar várias disciplinas sem perder o formulário de dispensa", async () => {
      await open("/solicitacao-servicos/dispensa-disciplinas");
      fireEvent.click(main().querySelector("[data-select-subjects]")!);
      const dialog = await screen.findByRole("dialog");
      fireEvent.click(within(dialog).getAllByRole("checkbox")[0]);
      fireEvent.click(within(dialog).getAllByRole("checkbox")[1]);
      fireEvent.click(within(dialog).getByRole("button", { name: "Confirmar seleção" }));
      await waitFor(() => expect(main().querySelector("[data-subject-selection]")).not.toBeNull());
      expect((main().querySelector("[data-subject-selection]") as HTMLInputElement).value.split(" | ")).toHaveLength(2);
   });
});
