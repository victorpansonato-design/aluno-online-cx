import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import App from "../../src/replica/App";
import { AmbientVideo } from "../../src/replica/student/Experience";
import { DemoProvider } from "../../src/cx/state";
import { initialState } from "../../src/cx/state";
import { loadScreen, preparePage } from "../../src/replica/reference";

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
async function open(route: string) {
   window.history.replaceState({}, "", route);
   render(<App />);
   await waitFor(() => expect(document.querySelector("[data-student-ui].student-page")).not.toBeNull());
}
describe("Refinamento da rotina e dos caminhos", () => {
   it("mantém reprovação e adaptação nas linhas do primeiro período também no acordeão móvel", async () => {
      const html = preparePage("/jornada-academica", await loadScreen("jornada-1"), true, initialState, 1);
      const d = new DOMParser().parseFromString(html, "text/html");
      const rows = d.querySelectorAll(".replica-period-content .cx-journey-pending-row");
      expect(rows).toHaveLength(2);
      expect(rows[0].textContent).toContain("Reprovada");
      expect(rows[1].textContent).toContain("Adaptação");
      rows.forEach(row => {
         expect(row.querySelector("a")?.getAttribute("href")).toBe("https://app.anchieta.br/matricula_dp_adap/index.php");
         expect((row as HTMLElement).style.opacity).toBe("1");
      });
      expect(d.querySelector('[aria-labelledby="discipline-summary-title"] [role="img"]')?.getAttribute("aria-label")).toContain(
         "3 aprovadas, 1 adaptação",
      );
   });
   it("mantém Solicitar um serviço selecionado quando o catálogo está aberto", async () => {
      window.history.replaceState({}, "", "/solicitacao-servicos/solicitar");
      render(<App />);
      await screen.findByRole("dialog");
      await waitFor(() =>
         expect(document.querySelector('.student-section-nav a[aria-current="page"]')).toHaveAttribute(
            "href",
            "/solicitacao-servicos/solicitar",
         ),
      );
   });
   it("não desloca a página quando um clique em área vazia foca o contêiner principal", async () => {
      await open("/inicio");
      const main = document.querySelector<HTMLElement>("#conteudo-principal")!;
      const scroller = document.querySelector<HTMLElement>("[data-replica-scroll]")!;
      const ana = document.querySelector<HTMLElement>(".replica-ana-launcher")!;
      vi.spyOn(main, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 80, 1200, 2000));
      vi.spyOn(ana, "getBoundingClientRect").mockReturnValue(new DOMRect(1100, 700, 88, 88));
      const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
         callback(0);
         return 1;
      });
      scroller.scrollTop = 0;
      fireEvent.focusIn(main);
      expect(scroller.scrollTop).toBe(0);
      raf.mockRestore();
   });
   it("ainda revela um controle focado pelo teclado quando ele fica atrás da Ana", async () => {
      await open("/inicio");
      const link = screen.getByRole("link", { name: /Conferir e pagar/ });
      const scroller = document.querySelector<HTMLElement>("[data-replica-scroll]")!;
      const ana = document.querySelector<HTMLElement>(".replica-ana-launcher")!;
      const nativeMatches = link.matches.bind(link);
      vi.spyOn(link, "matches").mockImplementation(selector => selector === ":focus-visible" || nativeMatches(selector));
      vi.spyOn(link, "getBoundingClientRect").mockReturnValue(new DOMRect(1110, 720, 80, 40));
      vi.spyOn(ana, "getBoundingClientRect").mockReturnValue(new DOMRect(1100, 700, 88, 88));
      const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
         callback(0);
         return 1;
      });
      scroller.scrollTop = 0;
      fireEvent.focusIn(link);
      expect(scroller.scrollTop).toBe(72);
      raf.mockRestore();
   });
   it("mostra dois avisos antes das horas e concentra a carteirinha na lateral", async () => {
      await open("/inicio");
      const preview = screen.getByRole("region", { name: "Avisos e comunicados" });
      expect(within(preview).getByRole("link", { name: /Tem vaga nova/ })).toHaveAttribute("href", "/notificacoes/76149709");
      expect(
         preview.compareDocumentPosition(screen.getByRole("region", { name: "Minha formação" })) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(document.querySelector(".student-sidebar-course")).toBeNull();
      expect(document.querySelector(".replica-footer")).toBeNull();
      expect(screen.getByRole("link", { name: /Ouvidoria \(abre/ })).toHaveAttribute("target", "_blank");
   });
   it("abre o painel da disciplina indicada no endereço e preserva seu contexto", async () => {
      window.history.replaceState({}, "", "/perfil/notas-e-faltas?disciplina=contabilidade");
      render(<App />);
      await waitFor(() => expect(screen.getByRole("dialog")).toHaveTextContent("Bases da Contabilidade Business"));
      expect(screen.getByRole("dialog")).toHaveTextContent("7,2");
      expect(document.querySelector(".student-highlighted-unit")).not.toBeNull();
   });
   it("mantém valores e ações das horas acessíveis sem mensagens de apresentação", async () => {
      await open("/inicio");
      expect(screen.getByRole("progressbar", { name: "Horas complementares" })).toHaveAttribute("aria-valuenow", "26");
      expect(screen.getByRole("progressbar", { name: "Horas de extensão" })).toHaveAttribute("aria-valuemax", "240");
      expect(screen.getByRole("link", { name: /Horas de extensão: 40 de 240/ })).toHaveAttribute(
         "href",
         "https://app.anchieta.br/sistema_pratica_extensionista/minhas_praticas.php",
      );
      expect(document.querySelector("#conteudo-principal")?.textContent).not.toMatch(
         /dados fictícios|demonstração|simulado|meta ilustrativa/i,
      );
   });
   it("troca a pergunta do gráfico sem misturar notas com limite de faltas", async () => {
      await open("/inicio");
      const chart = screen.getByRole("region", { name: "Como estou nas disciplinas?" });
      expect(chart).toHaveTextContent("Aguardando");
      fireEvent.click(within(chart).getByRole("button", { name: "Faltas" }));
      expect(chart).toHaveTextContent("9 / 15");
      expect(chart).not.toHaveTextContent("Aguardando");
      expect(within(chart).getByRole("link", { name: /Bases da Contabilidade Business/ })).toHaveAttribute(
         "href",
         "/perfil/notas-e-faltas?disciplina=contabilidade",
      );
   });
   it("filtra a secretaria e oferece recuperação quando busca e grupo não combinam", async () => {
      await open("/secretaria-virtual");
      fireEvent.click(screen.getByRole("button", { name: "Documentos" }));
      expect(screen.getByRole("button", { name: /Declarações e comprovantes/ })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /Reservar um laboratório/ })).not.toBeInTheDocument();
      fireEvent.change(screen.getByRole("searchbox", { name: "Buscar na secretaria" }), { target: { value: "laboratório" } });
      expect(screen.getByRole("link", { name: /Buscar no catálogo/ })).toHaveAttribute(
         "href",
         "/solicitacao-servicos/solicitar?busca=laborat%C3%B3rio",
      );
      fireEvent.click(screen.getByRole("button", { name: "Limpar busca e filtros" }));
      expect(screen.getByRole("button", { name: /Reservar um laboratório/ })).toBeInTheDocument();
   });
   it("encontra uma orientação e mantém o próximo passo no contexto da pergunta", async () => {
      await open("/ajuda");
      fireEvent.change(screen.getByRole("searchbox", { name: "Buscar uma orientação" }), { target: { value: "atestado" } });
      expect(screen.getByRole("status")).toHaveTextContent("1 orientação");
      fireEvent.click(screen.getByText("Preciso de um atestado ou histórico."));
      expect(screen.getByRole("link", { name: /Encontrar meu comprovante/ })).toHaveAttribute(
         "href",
         "/solicitacao-servicos/solicitar?busca=declara",
      );
   });
   it("reproduz MP4 em tela pequena quando a região fica visível", async () => {
      vi.stubGlobal(
         "IntersectionObserver",
         class {
            callback: (entries: { isIntersecting: boolean }[]) => void;
            constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
               this.callback = callback;
            }
            observe() {
               this.callback([{ isIntersecting: true }]);
            }
            disconnect() {}
         },
      );
      vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
      vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
      const { container } = render(
         <DemoProvider>
            <AmbientVideo name="study-notes" />
         </DemoProvider>,
      );
      await waitFor(() => expect(container.querySelector("img")).toHaveAttribute("src", "/media/study-notes.webp"));
      expect(container.querySelector("video")).toHaveAttribute("src", "/media/study-notes.mp4");
      expect(container.querySelector("video")).toHaveAttribute("loop");
   });
   it("não anexa MP4 quando a pessoa pede redução de movimento", async () => {
      vi.stubGlobal(
         "matchMedia",
         vi.fn((query: string) => ({
            matches: query.includes("min-width") || query.includes("reduced-motion"),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
         })),
      );
      const { container } = render(
         <DemoProvider>
            <AmbientVideo name="study-desk" />
         </DemoProvider>,
      );
      expect(container.querySelector("video")).toBeNull();
      expect(screen.queryByRole("button", { name: /Pausar vídeo/ })).not.toBeInTheDocument();
   });
});
