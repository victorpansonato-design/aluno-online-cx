import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const bin = process.env.AGENT_BROWSER_BIN || "agent-browser";
const root = path.resolve(import.meta.dirname, "..");
const run = (...args) =>
   execFileSync(bin, ["--session", "anchieta-clone-qa", ...args], { encoding: "utf8", timeout: 45000, maxBuffer: 12e6, windowsHide: true });
const ev = s => JSON.parse(run("eval", s, "--json")).data.result;
const audits = [],
   production = [];
for (const width of [1280, 390]) {
   run("set", "viewport", String(width), "844");
   for (const route of ["/perfil/documentos", "/solicitacao-servicos/solicitar/CSA_048_A", "/solicitacao-servicos/solicitar/CSA_009"]) {
      run("open", "http://127.0.0.1:5173" + route);
      run(
         "wait",
         "--fn",
         route.includes("/solicitar/")
            ? '!!document.querySelector("[role=dialog] form")'
            : '!!document.querySelector(".replica-reference-content")',
      );
      ev(
         `Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})))`,
      );
      const audit = JSON.parse(run("a11y", "--json")).data;
      audits.push({ width, route, ...audit });
   }
}
for (const route of ["/inicio", "/perfil/documentos", "/solicitacao-servicos/solicitar/CSA_030", "/notificacoes/76149709"]) {
   run("open", "http://127.0.0.1:4173" + route);
   run(
      "wait",
      "--fn",
      route.includes("/solicitar/")
         ? '!!document.querySelector("[role=dialog] form")'
         : '!!document.querySelector(".replica-reference-content")',
   );
   const result = ev(
      `({title:document.title,content:document.querySelector('#conteudo-principal').textContent.length,overflow:document.documentElement.scrollWidth>innerWidth+1,apiResources:performance.getEntriesByType('resource').filter(r=>r.name.includes('app-grupo-anchieta/api')||r.name.includes('app.anchieta.br')).map(r=>r.name)})`,
   );
   production.push({ route, ...result });
}
fs.writeFileSync(
   path.join(root, "docs/clone-final-checks.json"),
   JSON.stringify({ date: new Date().toISOString(), audits, production }, null, 2),
);
console.log(
   JSON.stringify({ a11y: audits.map(a => ({ width: a.width, route: a.route, violations: a.counts.violations })), production }, null, 2),
);
if (audits.some(a => a.counts.violations) || production.some(p => p.overflow || !p.content || p.apiResources.length)) process.exitCode = 1;
