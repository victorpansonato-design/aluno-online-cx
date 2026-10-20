import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const bin = process.env.AGENT_BROWSER_BIN || "agent-browser";
const root = path.resolve(import.meta.dirname, "..");
const run = (...args) =>
   execFileSync(bin, ["--session", "anchieta-clone-qa", ...args], { encoding: "utf8", timeout: 45000, maxBuffer: 12e6, windowsHide: true });
const ev = s => JSON.parse(run("eval", s, "--json")).data.result;
const checks = [];
const a11y = [];
const origin = "http://127.0.0.1:5173";
const open = p => {
   run("open", origin + p);
   run("wait", "--fn", '!!document.querySelector(".replica-reference-content")');
};
const check = (name, condition) => {
   checks.push({ name, passed: !!condition });
   if (!condition) throw Error(name);
};
run("set", "viewport", "390", "844");
open("/horarios");
run("find", "role", "button", "click", "--name", "Mês", "--exact");
run("wait", "--fn", 'document.querySelectorAll("[data-month-day]").length===31');
ev(`document.querySelector('[data-month-day="21"]').click()`);
run("wait", "--fn", `document.querySelector('[aria-pressed=true][data-month-day="21"]')`);
check(
   "Selecionar dia no mês atualiza detalhe e seleção",
   ev(`document.querySelector('#conteudo-principal').textContent.includes('21 de outubro de 2026')`),
);
run("find", "role", "button", "click", "--name", "Mês seguinte", "--exact");
run("wait", "--fn", 'document.querySelectorAll("[data-month-day]").length===30');
check(
   "Avançar mês recalcula dias e mostra o estado vazio correto",
   ev(
      `document.querySelector('#conteudo-principal').textContent.includes('novembro de 2026')&&document.querySelector('#conteudo-principal').textContent.includes('Não há aulas de demonstração')`,
   ),
);
run("find", "role", "button", "click", "--name", "Mês anterior", "--exact");
run("wait", "--fn", 'document.querySelectorAll("[data-month-day]").length===31');
check("Voltar mês restaura a grade", true);
open("/inicio");
run("press", "Control+k");
run("wait", "--fn", '!!document.querySelector(".replica-search-dialog")');
check("Ctrl K abre busca", true);
run("press", "Escape");
run("wait", "--fn", '!document.querySelector("[role=dialog]")');
run("find", "role", "button", "click", "--name", "Alternar menu de navegação", "--exact");
run("wait", "--fn", '!!document.querySelector(".replica-mobile-menu")');
check("Menu móvel abre", true);
run("press", "Escape");
run("wait", "--fn", '!document.querySelector("[role=dialog]")');
check(
   "Um único destino ativo na sidebar",
   ev(`document.querySelectorAll('nav[aria-label="Navegação principal"] a[aria-current=page]').length===1`),
);
for (const width of [1280, 390]) {
   run("set", "viewport", String(width), String(width === 390 ? 844 : 720));
   for (const route of [
      "/inicio",
      "/perfil/documentos",
      "/perfil/notas-e-faltas",
      "/jornada-academica",
      "/solicitacao-servicos/solicitar/CSA_030",
      "/secretaria-virtual",
   ]) {
      run("open", origin + route);
      run(
         "wait",
         "--fn",
         route.includes("/solicitar/")
            ? '!!document.querySelector("[role=dialog] form")'
            : '!!document.querySelector(".replica-reference-content,.replica-hub")',
      );
      ev(
         `Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})))`,
      );
      const audit = JSON.parse(run("a11y", "--json")).data;
      a11y.push({ width, route, ...audit });
      console.log("a11y", width, route, JSON.stringify(audit.counts));
   }
}
fs.writeFileSync(
   path.join(root, "docs/clone-smoke-report.json"),
   JSON.stringify({ date: new Date().toISOString(), checks, a11y }, null, 2),
);
console.log(checks.length, "smoke checks passed");
