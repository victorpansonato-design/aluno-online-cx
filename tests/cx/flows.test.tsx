import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { DemoProvider, useDemo } from "../../src/cx/state";
import { curriculum, documentTypes, external, normalize, routes, services } from "../../src/cx/data";
import Services from "../../src/cx/Services";
import Personal from "../../src/cx/Personal";
import Academic from "../../src/cx/Academic";

beforeEach(() => {
   localStorage.clear();
   vi.stubGlobal("scrollTo", vi.fn());
});

describe("Estados terminais e navegação", () => {
   it("encerra a trilha ao cancelar um pedido local", async () => {
      const { container } = render(
         <MemoryRouter initialEntries={["/secretaria/solicitacoes/DEMO-1042"]}>
            <DemoProvider>
               <Routes>
                  <Route path="/secretaria/solicitacoes/:id" element={<Services />} />
               </Routes>
               <StateView />
            </DemoProvider>
         </MemoryRouter>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Cancelar pedido local" }));
      fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Cancelar pedido local" }));
      await screen.findByText("Pedido cancelado");
      expect(container.querySelector(".tracking .current")).toBeNull();
      expect(screen.queryByText("O retorno aparece aqui quando a análise termina.")).toBeNull();
      expect(current().requests[0].status).toBe("Cancelado");
   });
   it("abre o calendário mensal ao escolher Mês nos horários", () => {
      const { container } = render(
         <MemoryRouter initialEntries={["/academico/horarios"]}>
            <DemoProvider>
               <Academic />
            </DemoProvider>
         </MemoryRouter>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Mês" }));
      expect(container.querySelector(".month-grid")).not.toBeNull();
      expect(container.querySelector(".days-tabs")).toBeNull();
   });
});
function StateView() {
   const { state } = useDemo();
   return <output data-testid="state">{JSON.stringify(state)}</output>;
}
function current() {
   return JSON.parse(screen.getByTestId("state").textContent || "{}");
}
describe("Inventário e navegação", () => {
   it("mantém os 40 serviços observados sem códigos duplicados", () => {
      expect(services).toHaveLength(40);
      expect(new Set(services.map(s => s.code)).size).toBe(40);
      expect(services.filter(s => s.auto)).toHaveLength(12);
   });
   it("preserva todos os destinos externos com HTTPS e sem identificador privado", () => {
      for (const href of Object.values(external)) {
         expect(new URL(href).protocol).toBe("https:");
         expect(href).not.toMatch(/aluno=|token=|password=|senha=/i);
      }
   });
   it("oferece rotas distintas e os seis documentos de matrícula", () => {
      expect(new Set(routes.map(r => r.path)).size).toBe(routes.length);
      expect(documentTypes).toHaveLength(6);
      expect(curriculum.flat()).toHaveLength(44);
      expect(curriculum.flat().reduce((sum, d) => sum + d.hours, 0)).toBe(2400);
   });
   it("permite pesquisa sem acentos e mantém a linguagem do catálogo", () => {
      expect(normalize("Matrícula, Adaptação e Frequência")).toBe("matricula, adaptacao e frequencia");
      expect(services.find(s => s.code === "CSA_114")?.original).toContain("48h");
   });
});
describe("Serviço até o acompanhamento", () => {
   it("exige revisão e confirmação e gera protocolo local de emissão automática", async () => {
      render(
         <MemoryRouter initialEntries={["/secretaria/servicos/CSA_150"]}>
            <DemoProvider>
               <Routes>
                  <Route path="/secretaria/servicos/:code" element={<Services />} />
                  <Route path="/secretaria/solicitacoes/:id" element={<Services />} />
               </Routes>
               <StateView />
            </DemoProvider>
         </MemoryRouter>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
      fireEvent.click(screen.getByRole("button", { name: /Revisar pedido/ }));
      expect(screen.getByRole("button", { name: "Confirmar pedido de demonstração" })).toBeDisabled();
      fireEvent.click(screen.getByRole("checkbox"));
      fireEvent.click(screen.getByRole("button", { name: "Confirmar pedido de demonstração" }));
      await screen.findByText("Pedido concluído no exemplo");
      expect(current().requests[0]).toMatchObject({ code: "CSA_150", status: "Concluído" });
      expect(current().requests[0].id).toMatch(/^DEMO-/);
      await waitFor(() => expect(JSON.parse(localStorage.getItem("anchieta-cx-demo-v1") || "{}").requests[0].code).toBe("CSA_150"));
   });
   it("encaminha serviço pago à etapa financeira sem efetuar pagamento", async () => {
      render(
         <MemoryRouter initialEntries={["/secretaria/servicos/CSA_030"]}>
            <DemoProvider>
               <Routes>
                  <Route path="/secretaria/servicos/:code" element={<Services />} />
                  <Route path="/secretaria/solicitacoes/:id" element={<Services />} />
               </Routes>
               <StateView />
            </DemoProvider>
         </MemoryRouter>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
      fireEvent.change(screen.getByRole("textbox"), { target: { value: "Quero testar uma mudança de turno." } });
      fireEvent.click(screen.getByRole("button", { name: /Revisar pedido/ }));
      fireEvent.click(screen.getByRole("checkbox"));
      fireEvent.click(screen.getByRole("button", { name: "Confirmar pedido de demonstração" }));
      await screen.findByText("Aguardando etapa financeira");
      expect(current().requests[0]).toMatchObject({ price: 30, status: "Aguardando pagamento" });
   });
   it("recupera dados inválidos do armazenamento sem quebrar a tela", () => {
      localStorage.setItem("anchieta-cx-demo-v1", "{broken");
      render(
         <DemoProvider>
            <StateView />
         </DemoProvider>,
      );
      expect(current().profile.name).toBe("Marina Costa");
   });
});
describe("Documentos pessoais", () => {
   it("valida o arquivo, simula o envio e guarda somente metadados", async () => {
      render(
         <MemoryRouter initialEntries={["/meus-dados/documentos"]}>
            <DemoProvider>
               <Personal />
               <StateView />
            </DemoProvider>
         </MemoryRouter>,
      );
      fireEvent.click(screen.getByRole("button", { name: /CPF do aluno/ }));
      const input = screen.getByLabelText("Escolher documento de teste");
      fireEvent.change(input, { target: { files: [new File(["bad"], "script.exe", { type: "application/octet-stream" })] } });
      expect(screen.getByRole("alert")).toHaveTextContent("PDF, JPG ou PNG");
      expect(screen.getByRole("button", { name: "Simular envio do documento" })).toBeDisabled();
      fireEvent.change(input, {
         target: { files: [new File(["TEST CONTENT NEVER SAVED"], "cpf-exemplo.pdf", { type: "application/pdf" })] },
      });
      fireEvent.click(screen.getByRole("button", { name: "Simular envio do documento" }));
      await waitFor(() => expect(current().docs.cpf).toEqual({ name: "cpf-exemplo.pdf", status: "Em conferência" }));
      expect(localStorage.getItem("anchieta-cx-demo-v1")).not.toContain("TEST CONTENT NEVER SAVED");
   });
   it("restaura preferências e estados após remontagem", () => {
      const saved = {
         version: 1,
         profile: { name: "Aluno Exemplo", email: "aluno@example.com", phone: "000000000", address: "Exemplo" },
         docs: { cpf: { name: "teste.pdf", status: "Validado" } },
         requests: [],
         scenario: "dp",
         theme: "dark",
      };
      localStorage.setItem("anchieta-cx-demo-v1", JSON.stringify(saved));
      render(
         <DemoProvider>
            <StateView />
         </DemoProvider>,
      );
      expect(current().docs.cpf.status).toBe("Validado");
      expect(current().scenario).toBe("dp");
      expect(document.documentElement).toHaveClass("dark");
   });
});
