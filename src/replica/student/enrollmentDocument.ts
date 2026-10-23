export const enrollment = {
   ra: "20260001",
   course: "Ciências Contábeis",
   semester: "2026/2",
   period: "2º período",
};

/** The local portal has no document issuing API. Never imply official certification. */
export async function buildEnrollmentPdf(studentName: string, issuedAt = new Date()) {
   const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
   const pdf = await PDFDocument.create();
   pdf.setTitle("Atestado de matrícula — prévia");
   pdf.setSubject("Prévia de interface. Sem validade acadêmica.");
   pdf.setCreationDate(issuedAt);
   const regular = await pdf.embedFont(StandardFonts.Helvetica);
   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
   const page = pdf.addPage([595.28, 841.89]);
   const blue = rgb(0.08, 0.2, 0.51);
   const ink = rgb(0.1, 0.15, 0.23);
   const muted = rgb(0.36, 0.41, 0.48);
   const text = (value: string, y: number, size = 11, strong = false, color = ink) => {
      const font = strong ? bold : regular;
      // Standard PDF fonts cover Portuguese. Replace unsupported glyphs without failing the download.
      const safe = Array.from(value.replace(/[\r\n\t]/g, " "))
         .map(char => {
            try {
               font.encodeText(char);
               return char;
            } catch {
               return "?";
            }
         })
         .join("");
      const words = safe.split(/\s+/);
      let line = "";
      for (const word of words) {
         const next = line ? `${line} ${word}` : word;
         if (font.widthOfTextAtSize(next, size) > 475 && line) {
            page.drawText(line, { x: 60, y, size, font, color });
            y -= size * 1.6;
            line = word;
         } else line = next;
      }
      page.drawText(line, { x: 60, y, size, font, color });
      return y - size * 1.6;
   };
   page.drawRectangle({ x: 0, y: 831.89, width: 595.28, height: 10, color: blue });
   text("GRUPO ANCHIETA", 775, 12, true, blue);
   text("Aluno Online · Prévia acadêmica", 753, 10, false, muted);
   text("Atestado de matrícula", 690, 24, true, blue);
   text("Dados de matrícula do semestre", 664, 11, false, muted);
   let y = 610;
   for (const [label, value] of [
      ["ALUNO(A)", studentName],
      ["REGISTRO ACADÊMICO", enrollment.ra],
      ["CURSO", enrollment.course],
      ["SEMESTRE / PERÍODO", `${enrollment.semester} · ${enrollment.period}`],
   ]) {
      text(label, y, 9, false, muted);
      y = text(value, y - 23, 13, true) - 23;
   }
   const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(issuedAt);
   text(`Arquivo gerado em ${date}.`, y - 12, 10, false, muted);
   page.drawLine({ start: { x: 60, y: 135 }, end: { x: 535, y: 135 }, thickness: 0.7, color: rgb(0.85, 0.88, 0.92) });
   text("PRÉVIA · SEM VALIDADE ACADÊMICA", 112, 10, true, blue);
   text("Documento com dados de exemplo para avaliação da interface.", 91, 9, false, muted);
   text("O atestado oficial deve ser emitido pelo sistema da instituição.", 75, 9, false, muted);
   return pdf.save();
}

export async function downloadEnrollmentPdf(studentName: string) {
   const bytes = await buildEnrollmentPdf(studentName);
   const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
   const link = document.createElement("a");
   link.href = url;
   link.download = `atestado-de-matricula-${enrollment.semester.replace("/", "-")}.pdf`;
   document.body.append(link);
   link.click();
   link.remove();
   // Allow mobile browsers time to consume the file before releasing its URL.
   setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
