import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { PDFDocument } from "pdf-lib";
import App from "../../src/replica/App";
import { buildEnrollmentPdf } from "../../src/replica/student/enrollmentDocument";

beforeEach(() => {
   localStorage.clear();
   window.history.replaceState({}, "", "/inicio");
   vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
   );
   Element.prototype.scrollIntoView = vi.fn();
   Element.prototype.animate = vi.fn(() => ({
      finished: Promise.resolve(),
      cancel: vi.fn(),
   })) as unknown as typeof Element.prototype.animate;
});

describe("Atestado de matrícula", () => {
   it("produz um PDF A4 válido com identificação explícita de prévia", async () => {
      const bytes = await buildEnrollmentPdf("Marina de Assunção D'Ávila 🧑", new Date("2026-10-23T12:00:00Z"));
      const pdf = await PDFDocument.load(bytes);
      expect(pdf.getPageCount()).toBe(1);
      expect(pdf.getPage(0).getWidth()).toBeCloseTo(595.28);
      expect(pdf.getTitle()).toBe("Atestado de matrícula — prévia");
      expect(pdf.getSubject()).toContain("Sem validade acadêmica");
   });

   it("baixa um PDF em dois cliques pela home, sem criar pedidos duplicados", async () => {
      const createUrl = vi.fn((_file: Blob) => "blob:atestado");
      vi.stubGlobal("URL", Object.assign(URL, { createObjectURL: createUrl, revokeObjectURL: vi.fn() }));
      const clicked: HTMLAnchorElement[] = [];
      const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
         clicked.push(this);
      });
      try {
         render(<App />);
         const card = await screen.findByRole("region", { name: "Atestado de matrícula" });
         const requests = JSON.parse(localStorage.getItem("anchieta-cx-demo-v1")!).requests;
         const opener = within(card).getByRole("button", { name: "Baixar PDF" });
         opener.focus();
         fireEvent.click(opener);
         const dialog = await screen.findByRole("dialog", { name: "Atestado de matrícula" });
         expect(dialog).toHaveTextContent("Marina Costa");
         fireEvent.click(within(dialog).getByRole("button", { name: "Baixar PDF" }));
         await waitFor(() => expect(clicked).toHaveLength(1));
         expect(clicked[0].download).toBe("atestado-de-matricula-2026-2.pdf");
         expect(createUrl.mock.calls[0][0]).toMatchObject({ type: "application/pdf" });
         expect(within(dialog).getByRole("status")).toHaveTextContent("PDF baixado");
         expect(JSON.parse(localStorage.getItem("anchieta-cx-demo-v1")!).requests).toEqual(requests);
         fireEvent.keyDown(dialog, { key: "Escape" });
         await waitFor(() => expect(opener).toHaveFocus());
      } finally {
         click.mockRestore();
      }
   });
});
