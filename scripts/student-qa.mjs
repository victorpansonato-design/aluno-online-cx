import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const bin = process.env.AGENT_BROWSER_BIN || "agent-browser";
const root = path.resolve(import.meta.dirname, ".."),
   out = path.join(root, "docs/screenshots/v3");
fs.mkdirSync(out, { recursive: true });
const run = (...args) =>
   execFileSync(bin, ["--session", "anchieta-student-qa", ...args], {
      encoding: "utf8",
      timeout: 45000,
      maxBuffer: 12e6,
      windowsHide: true,
   });
const ev = s => JSON.parse(run("eval", s, "--json")).data.result;
const origin = "http://127.0.0.1:5173";
const ready = () => run("wait", "--fn", `!!document.querySelector('#conteudo-principal h1')&&!document.querySelector('.replica-loading')`);
const settle = () =>
   ev(
      `document.fonts.ready.then(()=>Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))))`,
   );
const open = route => {
   run("open", origin + route);
   ready();
   settle();
};
execFileSync(bin, ["--session", "anchieta-student-qa", "open", origin + "/inicio"], { stdio: "ignore", timeout: 45000, windowsHide: true });
ev(`localStorage.removeItem('anchieta-cx-demo-v1');localStorage.setItem('anchieta-navigation-v3','connected')`);
const targets = [
   ["inicio", "/inicio"],
   ["estudos", "/meus-estudos"],
   ["secretaria", "/secretaria-virtual"],
   ["financeiro", "/financeiro?cobranca=DEMO-MENSALIDADE-202611"],
   ["pix", "/financeiro/pix?cobranca=DEMO-MENSALIDADE-202611"],
   ["calendario", "/calendario-academico?evento=avaliacoes-outubro"],
   ["horas", "/meus-estudos/atividades"],
   ["comunicados", "/comunicados"],
   ["notas-foco", "/perfil/notas-e-faltas?disciplina=contabilidade"],
   ["documentos", "/perfil/documentos"],
   ["extrato", "/financeiro/extrato"],
];
const checks = [],
   audits = [];
for (const width of [1280, 390]) {
   run("set", "viewport", String(width), String(width === 390 ? 844 : 900));
   for (const [name, route] of targets) {
      open(route);
      const result = ev(
         `({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth+1,content:document.querySelector('#conteudo-principal').textContent.length,badImages:Array.from(document.images).filter(i=>i.checkVisibility()&&i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),apiResources:performance.getEntriesByType('resource').filter(r=>r.name.includes('app.anchieta.br')||r.name.includes('app-grupo-anchieta/api')).map(r=>r.name)})`,
      );
      run("screenshot", path.join(out, name + "-" + width + ".png"));
      checks.push({ width, route, ...result });
      if (!["notas-foco", "extrato"].includes(name)) {
         const audit = JSON.parse(run("a11y", "--json")).data;
         audits.push({ width, route, ...audit });
         console.log(name, width, result.overflow ? "OVERFLOW" : "ok", "axe", audit.counts.violations);
      }
   }
}
for (const width of [981, 320]) {
   run("set", "viewport", String(width), String(width === 981 ? 884 : 844));
   open("/inicio");
   run("screenshot", path.join(out, "inicio-" + width + ".png"));
   checks.push({ width, route: "/inicio", overflow: ev("document.documentElement.scrollWidth>innerWidth+1") });
}
run("set", "viewport", "390", "844");
open("/meus-estudos/extensao");
run("screenshot", path.join(out, "extensao-390.png"));
open("/financeiro/pix?cobranca=DEMO-MENSALIDADE-202611");
run("find", "role", "button", "click", "--name", "Simular confirmação do pagamento", "--exact");
run("wait", "--fn", `document.querySelector('h1').textContent.includes('Pagamento simulado confirmado')`);
settle();
run("screenshot", path.join(out, "pix-confirmado-390.png"));
open("/inicio");
ev(
   `const s=JSON.parse(localStorage.getItem('anchieta-cx-demo-v1'));s.theme='dark';s.scenario='dp';s.chargesPaid=[];localStorage.setItem('anchieta-cx-demo-v1',JSON.stringify(s))`,
);
for (const width of [1280, 390]) {
   run("set", "viewport", String(width), String(width === 390 ? 844 : 900));
   open("/inicio");
   run("screenshot", path.join(out, "inicio-escuro-" + width + ".png"));
}
ev(
   `const s=JSON.parse(localStorage.getItem('anchieta-cx-demo-v1'));s.theme='light';localStorage.setItem('anchieta-cx-demo-v1',JSON.stringify(s))`,
);
open("/jornada-academica#disciplinas-regularizar");
run("screenshot", path.join(out, "jornada-dp-390.png"));
ev(`localStorage.removeItem('anchieta-cx-demo-v1')`);
fs.writeFileSync(
   path.join(root, "docs/student-browser-report.json"),
   JSON.stringify({ date: new Date().toISOString(), scope: "Only localhost and fictional data", checks, audits }, null, 2),
);
console.log("Saved", fs.readdirSync(out).filter(n => n.endsWith(".png")).length, "captures");
