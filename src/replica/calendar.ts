/** Calendar calculations stay local; only October 2026 contains captured example classes. */
export function prepareMonth(html: string, offset: number, day: number) {
   const d = new DOMParser().parseFromString(html, "text/html");
   const buttons = Array.from(d.querySelectorAll<HTMLButtonElement>("button")).filter(b => b.className.includes("min-h-24"));
   if (!buttons.length) return html;
   const month = new Date(2026, 9 + offset, 1);
   const last = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
   const selected = new Date(month.getFullYear(), month.getMonth(), Math.min(day, last));
   const grid = buttons[0].parentElement!.parentElement!;
   const detail = grid.nextElementSibling;
   const normal = buttons.find(b => !b.getAttribute("aria-current") && !b.className.includes("ring-inset"))!;
   const normalClass = normal.className.replace("opacity-70", "");
   const heading = Array.from(d.querySelectorAll("span,p")).find(x => x.children.length === 0 && x.textContent === "outubro de 2026");
   if (heading) heading.textContent = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(month);
   const templates = new Map(buttons.map(b => [Number(b.querySelector("span>span")?.textContent), b]));
   const rows = Array.from(grid.children).slice(1);
   rows.forEach(x => x.remove());
   const total = Math.ceil((month.getDay() + last) / 7) * 7;
   let row: HTMLElement | undefined;
   for (let i = 0; i < total; i++) {
      if (i % 7 === 0) {
         row = d.createElement("div");
         row.className = "grid grid-cols-7";
         grid.append(row);
      }
      const value = i - month.getDay() + 1;
      if (value < 1 || value > last) {
         const cell = d.createElement("div");
         cell.className = "min-h-24 border-b border-s border-border bg-muted/20 first:border-s-0";
         row!.append(cell);
         continue;
      }
      const button = (offset === 0 ? templates.get(value) : normal)!.cloneNode(true) as HTMLButtonElement;
      if (offset !== 0)
         Array.from(button.children)
            .slice(1)
            .forEach(x => x.remove());
      const number = button.querySelector("span>span")!;
      number.textContent = String(value);
      number.className = "tabular grid size-6 place-items-center rounded-md text-xs font-semibold text-foreground";
      button.querySelectorAll("span").forEach(x => {
         if (x.textContent === "Hoje") x.remove();
      });
      button.className = normalClass;
      button.removeAttribute("aria-current");
      button.dataset.monthDay = String(value);
      button.setAttribute(
         "aria-label",
         new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" }).format(new Date(month.getFullYear(), month.getMonth(), value)),
      );
      if (value === selected.getDate()) {
         button.className += " bg-primary-soft/50 ring-2 ring-primary/50 ring-inset";
         button.setAttribute("aria-pressed", "true");
         number.className += " bg-primary text-primary-foreground";
      } else button.setAttribute("aria-pressed", "false");
      row!.append(button);
   }
   if (detail) {
      const date = Array.from(detail.querySelectorAll("span")).find(x => /^\d+ de outubro de 2026$/.test(x.textContent || ""));
      if (date) date.textContent = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(selected);
      const number = detail.querySelector(".tabular");
      if (number) number.textContent = String(selected.getDate());
      const weekday = detail.querySelector(".capitalize");
      if (weekday) weekday.textContent = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(selected);
      if (offset !== 0) {
         const message = "Não há aulas cadastradas neste mês. Consulte outubro de 2026 para explorar a agenda.";
         const list = detail.querySelector("ul");
         if (list) list.innerHTML = '<li class="p-4 text-sm text-muted-foreground">' + message + "</li>";
         else {
            const empty = Array.from(detail.querySelectorAll("p,span,div")).find(
               x => x.children.length === 0 && x.textContent === "Nenhuma aula neste dia.",
            );
            if (empty) empty.textContent = message;
         }
      }
      if (offset !== 0 || day !== 20)
         detail.querySelectorAll("span").forEach(x => {
            if (x.textContent === "Hoje") x.remove();
         });
   }
   return d.body.innerHTML;
}
