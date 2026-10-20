import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
const bin = process.env.AGENT_BROWSER_BIN;
if (!bin) throw new Error("Defina AGENT_BROWSER_BIN. Use uma sessão QA já inicializada.");
const checks = [];
const browser = (...args) => {
   const r = JSON.parse(
      execFileSync(bin, ["--session", "anchieta-cx-qa", "--json", ...args], {
         encoding: "utf8",
         windowsHide: true,
         timeout: 45000,
         maxBuffer: 4 * 1024 * 1024,
      }),
   );
   if (!r.success) throw new Error(JSON.stringify(r.error));
   return r.data;
};
const check = (name, expression) => {
   const value = browser("eval", expression).result;
   checks.push({ name, value });
   if (value !== true) throw new Error(name + ": " + JSON.stringify(value));
};
const open = route => {
   browser("open", "http://127.0.0.1:5173" + route);
   browser("wait", "--fn", `document.querySelector('h1')&&!document.querySelector('[aria-label="Carregando conteúdo"]')`);
};
browser("set", "viewport", "320", "900");
for (const route of ["/meus-dados/documentos", "/academico/notas", "/academico/horarios"]) {
   open(route);
   check("Sem overflow em " + route, "document.documentElement.scrollWidth <= innerWidth");
}
browser("find", "role", "button", "click", "--name", "Mês", "--exact");
check("Agenda abre o mês", 'Boolean(document.querySelector(".month-grid"))&&!document.querySelector(".days-tabs")');
browser("find", "role", "button", "click", "--name", "Alternar menu", "--exact");
browser("wait", "--text", "Navegar pelo portal");
check("Menu móvel tem navegação", 'Boolean(document.querySelector(".mobile-menu-content .main-navigation"))');
browser("press", "Escape");
browser("press", "Control+k");
browser("wait", "--text", "Encontre seu próximo passo");
browser("fill", 'input[aria-label="Busca em todo o portal"]', "documentos");
check(
   "Busca encontra documentos",
   '[...document.querySelectorAll(".search-results button")].some(b=>b.innerText.includes("Meus documentos"))',
);
browser("press", "Escape");
open("/meus-dados/preferencias");
browser("check", ".preferences .preference-row:first-of-type input");
check("Tema escuro aplicado", 'document.documentElement.classList.contains("dark")');
browser("uncheck", ".preferences .preference-row:first-of-type input");
check("Tema claro restaurado", '!document.documentElement.classList.contains("dark")');
writeFileSync("docs/smoke-report.json", JSON.stringify({ date: new Date().toISOString(), checks }, null, 2));
console.log(JSON.stringify({ passed: checks.length, checks }, null, 2));
