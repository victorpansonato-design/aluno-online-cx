import { external } from "../../cx/data";

/** Overlay the requested example statuses on the captured, original period layout. */
export function prepareJourney(d: Document, period: number) {
   d.querySelectorAll<HTMLElement>(".replica-period-content [style]").forEach(el => {
      if (el.style.opacity) el.style.opacity = "1";
      if (el.style.transform.includes("translate")) el.style.removeProperty("transform");
   });
   const disciplineSummary = d.querySelector('[aria-labelledby="discipline-summary-title"]');
   const counts: Record<string, number> = { Aprovado: 3, Adaptação: 1, Dependência: 1 };
   disciplineSummary?.querySelectorAll("li").forEach(row => {
      const label = row.querySelector("span.flex > span")?.textContent || "";
      const value = row.querySelector(".tabular");
      if (value && label in counts) value.textContent = String(counts[label]);
   });
   const statusBar = disciplineSummary?.querySelector('[role="img"]');
   statusBar?.setAttribute("aria-label", "Disciplinas por status: 3 aprovadas, 1 adaptação, 6 cursando, 33 a cursar e 1 dependência.");
   if (statusBar?.firstElementChild)
      statusBar.firstElementChild.innerHTML = [
         [3, "aprovado"],
         [1, "adaptacao"],
         [6, "cursando"],
         [33, "a-cursar"],
         [1, "dependencia"],
      ]
         .map(([n, key]) => `<span class="h-full" style="width:${(Number(n) / 44) * 100}%;background:var(--status-dot-${key})"></span>`)
         .join("");
   const progress = d.querySelector('[aria-labelledby="academic-summary-title"]');
   if (progress) {
      const walker = d.createTreeWalker(progress, NodeFilter.SHOW_TEXT);
      const replacements: Record<string, string> = {
         "12%": "8%",
         "8,80": "8,00",
         "280": "180",
         "1800": "1900",
         "280 de 2400": "180 de 2400",
      };
      while (walker.nextNode()) {
         const text = walker.currentNode.textContent || "";
         if (text in replacements) walker.currentNode.textContent = replacements[text];
      }
      progress.querySelector('svg[role="img"]')?.setAttribute("aria-label", "Progresso do curso: 8% concluído.");
      const ring = progress.querySelector("circle[stroke-dasharray]");
      if (ring) ring.setAttribute("stroke-dashoffset", String(Number(ring.getAttribute("stroke-dasharray")) * (1 - 180 / 2400)));
      const credits = d.querySelector('[aria-labelledby="credit-summary-title"] [role="img"]');
      credits?.setAttribute("aria-label", "Carga horária: 180 horas concluídas, 320 cursando e 1900 a cursar.");
      credits?.querySelectorAll<HTMLElement>("span").forEach((bar, i) => {
         bar.style.width = `${([180, 320, 1900][i] / 2400) * 100}%`;
      });
   }
   d.querySelectorAll('[data-slot="carousel-content"] > div').forEach(track => {
      (track as HTMLElement).style.transform = "none";
   });
   d.querySelectorAll<HTMLButtonElement>('button[aria-label^="1º período"]').forEach(button => {
      button.setAttribute("aria-label", "1º período. 5 disciplinas: 3 aprovadas, 1 reprovada e 1 adaptação.");
      button.classList.add("cx-period-pending");
      const bubble = button.querySelector('span[style*="width: 44px"]');
      if (bubble) {
         bubble.textContent = "1";
         bubble.classList.add("cx-period-bubble");
      }
      button.querySelectorAll<HTMLElement>('[style*="status-dot-aprovado"]').forEach((dot, i) => {
         if (i < 2) dot.style.backgroundColor = i ? "var(--warning)" : "var(--destructive)";
      });
   });
   if (period === 1)
      d.querySelectorAll("h3").forEach(heading => {
         if (heading.textContent !== "1º Período") return;
         const header = heading.closest("header");
         const summary = header?.querySelector("p");
         if (summary) summary.textContent = "3 aprovadas · 1 reprovada · 1 adaptação";
         const list = header?.nextElementSibling;
         if (list?.tagName !== "UL") return;
         Array.from(list.children)
            .slice(0, 2)
            .forEach((row, i) => {
               row.classList.add("cx-journey-pending-row");
               const details = row.lastElementChild!;
               details.className = "cx-journey-row-actions";
               details.innerHTML = `<span class="cx-journey-status ${i ? "adaptation" : "failed"}">${i ? "Adaptação" : "Reprovada · nota 4,0"}</span><a class="replica-button" href="${external.dp}" target="_blank" rel="noopener noreferrer">${i ? "Inscrever em adaptação" : "Inscrever em DP"} <span aria-hidden="true">↗</span></a>`;
               const icon = row.firstElementChild as HTMLElement;
               icon.style.color = i ? "var(--warning-foreground)" : "var(--destructive)";
               icon.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${i ? "sync_alt" : "error"}</span>`;
            });
      });
   const trail = Array.from(d.querySelectorAll("h2")).find(h => h.textContent === "Sua trilha");
   if (trail && period !== 1) {
      const prompt = d.createElement("div");
      prompt.className = "cx-journey-pending-note";
      prompt.innerHTML =
         '<span><strong>2 disciplinas para regularizar</strong><small>Uma reprovação e uma adaptação no 1º período.</small></span><button class="replica-button secondary" data-open-period="1">Ver disciplinas <span aria-hidden="true">→</span></button>';
      trail.parentElement?.after(prompt);
   }
   const note = Array.from(d.querySelectorAll("p")).find(p => p.textContent?.includes("não entram automaticamente na matrícula"));
   if (note) {
      const actions = d.createElement("div");
      actions.className = "cx-journey-enrollment";
      actions.innerHTML = `<a class="replica-button" href="${external.dp}" target="_blank" rel="noopener noreferrer">Inscrever em DP ou adaptação ↗</a><a href="${external.dpEdital}" target="_blank" rel="noopener noreferrer">Consultar disciplinas e edital ↗</a>`;
      note.after(actions);
   }
}
