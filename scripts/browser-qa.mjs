import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
const executable = process.env.AGENT_BROWSER_BIN;
if (!executable || !existsSync(executable)) throw new Error("Defina AGENT_BROWSER_BIN com o caminho do executável agent-browser.");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:5173";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error("Esta rotina de QA opera somente em localhost.");
const reportDir = path.resolve(process.env.QA_REPORT_DIR || "../../work/qa");
mkdirSync(reportDir, { recursive: true });
const source = ts.transpile(readFileSync("src/cx/data.ts", "utf8"), { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 });
const { routes, services, disciplines, curriculum } = await import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));
function browser(...args) {
   const out = execFileSync(executable, ["--session", "anchieta-cx-qa", "--json", ...args], {
      encoding: "utf8",
      windowsHide: true,
      timeout: 45000,
      maxBuffer: 8 * 1024 * 1024,
   });
   const result = JSON.parse(out);
   if (!result.success) throw new Error(JSON.stringify(result.error));
   return result.data;
}
const inspect = () =>
   JSON.parse(
      browser(
         "eval",
         `JSON.stringify({title:document.title,h1:document.querySelector('h1')?.innerText,overflow:document.documentElement.scrollWidth>innerWidth+1,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,fatal:document.body.innerText.includes('Não foi possível abrir esta parte'),missing:document.body.innerText.includes('Serviço não encontrado')||document.body.innerText.includes('Disciplina não encontrada'),links:[...document.querySelectorAll('main a[href]')].map(a=>a.getAttribute('href')),unnamed:[...document.querySelectorAll('button')].filter(b=>b.checkVisibility()&&!b.innerText.trim()&&!b.getAttribute('aria-label')).map(b=>b.outerHTML.slice(0,180))})`,
      ).result,
   );
const report = { started: new Date().toISOString(), checks: [], a11y: [], failures: [] };
const targets = [
   ...routes.map(r => r.path),
   ...disciplines.map(d => "/academico/disciplinas/" + d.id),
   ...services.map(s => "/secretaria/servicos/" + s.code),
   ...curriculum.flatMap((period, p) => period.map((_, i) => "/academico/matriz/" + (p + 1) + "/" + i)),
   "/secretaria/solicitacoes/DEMO-1042",
   "/avisos/documentos",
];
const baseTargets = routes.map(r => r.path);
const capturesOnly = process.argv.includes("--captures-only");
if (!capturesOnly) {
   for (const width of [1440, 390, 320, 768]) {
      browser("set", "viewport", String(width), "900");
      let count = 0;
      for (const target of width === 1440 ? targets : baseTargets) {
         try {
            browser("open", origin + target);
            browser("wait", "--fn", `Boolean(document.querySelector('h1'))&&!document.querySelector('[aria-label="Carregando conteúdo"]')`);
            const info = inspect();
            const item = { width, target, ...info };
            report.checks.push(item);
            if (!info.h1 || info.overflow || info.fatal || info.missing || info.unnamed.length) report.failures.push(item);
            count++;
            if (count % 15 === 0) console.log(`${width}px: ${count} rotas verificadas`);
         } catch (error) {
            report.failures.push({ width, target, error: String(error) });
         }
      }
      console.log(`${width}px: concluído (${count} rotas)`);
   }
}
for (const width of [1440, 390]) {
   browser("set", "viewport", String(width), "900");
   for (const target of ["/", "/secretaria", "/meus-dados/documentos", "/academico/notas", "/secretaria/servicos/CSA_150"]) {
      browser("open", origin + target);
      browser("wait", "--fn", `Boolean(document.querySelector('h1'))&&!document.querySelector('[aria-label="Carregando conteúdo"]')`);
      const name = (target === "/" ? "home" : target.replaceAll("/", "-").slice(1)) + "-" + width;
      browser("screenshot", path.join(reportDir, name + ".png"), "--full");
      const screenInfo = inspect();
      report.checks.push({ width, target, ...screenInfo });
      if (screenInfo.overflow || screenInfo.fatal || screenInfo.missing || screenInfo.unnamed.length)
         report.failures.push({ width, target, ...screenInfo });
      const audit = browser("a11y");
      report.a11y.push({ width, target, counts: audit.counts, violations: audit.violations, incomplete: audit.incomplete });
   }
}
report.finished = new Date().toISOString();
writeFileSync(path.join(reportDir, capturesOnly ? "capture-report.json" : "browser-report.json"), JSON.stringify(report, null, 2));
console.log(
   JSON.stringify(
      {
         checks: report.checks.length,
         routeFailures: report.failures.length,
         a11y: report.a11y.map(a => ({ width: a.width, target: a.target, violations: a.counts.violations })),
      },
      null,
      2,
   ),
);
if (report.failures.length || report.a11y.some(a => a.counts.violations)) process.exitCode = 1;
