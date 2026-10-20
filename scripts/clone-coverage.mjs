import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const bin = process.env.AGENT_BROWSER_BIN || "agent-browser";
const root = path.resolve(import.meta.dirname, "..");
const ref = JSON.parse(fs.readFileSync(path.join(root, "src/replica/reference.json"), "utf8"));
const origin = "http://127.0.0.1:5173";
const run = (...args) =>
   execFileSync(bin, ["--session", "anchieta-clone-qa", ...args], { encoding: "utf8", timeout: 30000, maxBuffer: 8e6, windowsHide: true });
const ev = s => JSON.parse(run("eval", s, "--json")).data.result;
const base = Object.keys(ref.pages).filter(p => !/^\/notificacoes\/\d+$/.test(p));
const all = [
   ...Object.keys(ref.pages),
   ...Object.keys(ref.serviceForms).map(c => "/solicitacao-servicos/solicitar/" + c),
   "/secretaria-virtual",
   "/preferencias",
   "/ajuda",
];
const previous = process.argv.includes("--retry")
   ? JSON.parse(fs.readFileSync(path.join(root, "docs/clone-coverage-report.json"), "utf8"))
   : null;
const retry = previous?.failures || [];
const checks = previous ? previous.checks.filter(c => !retry.some(r => r.route === c.route && r.width === c.width)) : [];
const failures = [];
for (const width of [1280, 390, 320, 768]) {
   run("set", "viewport", String(width), String(width < 768 ? 844 : 900));
   for (const route of previous ? retry.filter(r => r.width === width).map(r => r.route) : width === 1280 || width === 390 ? all : base) {
      try {
         run("open", origin + route);
         run(
            "wait",
            "--fn",
            route.includes("/solicitar/")
               ? '!!document.querySelector("[role=dialog] form")'
               : '!!document.querySelector(".replica-reference-content,.replica-hub,.replica-preferences,.replica-help")',
         );
         const result = ev(
            `({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth+1,content:document.querySelector('#conteudo-principal')?.textContent.length||0,form:!!document.querySelector('[role=dialog] form'),fatal:/Não foi possível abrir|Serviço não encontrado/.test(document.body.innerText),badImages:Array.from(document.images).filter(i=>i.checkVisibility()&&i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src'))})`,
         );
         checks.push({ route, width, ...result });
         if (result.overflow || result.fatal || !result.content || result.badImages.length) failures.push({ route, width, ...result });
      } catch (error) {
         failures.push({ route, width, error: String(error.message).slice(0, 350) });
      }
   }
   console.log("Width", width, "complete;", checks.length, "visits;", failures.length, "failures");
}
fs.writeFileSync(
   path.join(root, "docs/clone-coverage-report.json"),
   JSON.stringify(
      { date: new Date().toISOString(), scope: "Only localhost, fictional data; route rendering and document overflow", checks, failures },
      null,
      2,
   ),
);
if (failures.length) process.exitCode = 1;
