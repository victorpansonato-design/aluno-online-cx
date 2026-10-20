import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const root = path.resolve(import.meta.dirname, "..");
const bin = process.env.AGENT_BROWSER_BIN || "agent-browser";
const run = (...args) =>
   execFileSync(bin, ["--session", "anchieta-student-qa", ...args], {
      encoding: "utf8",
      timeout: 45000,
      maxBuffer: 8e6,
      windowsHide: true,
   });
const ev = s => JSON.parse(run("eval", s, "--json")).data.result;
const settle = () =>
   ev(
      `document.fonts.ready.then(()=>Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))))`,
   );
const out = path.join(root, "docs/screenshots/v3");
const ready = () => run("wait", "--fn", '!!document.querySelector("#conteudo-principal h1")&&!document.querySelector(".replica-loading")');
const open = route => {
   run("open", "http://127.0.0.1:5173" + route);
   ready();
};
const report = { date: new Date().toISOString(), scope: "Only localhost and fictional data", checks: [], audits: [] };
run("set", "viewport", "1280", "900");
open("/inicio");
run("find", "role", "button", "click", "--name", "Alternar menu de navegação", "--exact");
run("wait", "--fn", '!!document.querySelector(".replica-collapsed")');
settle();
run("screenshot", path.join(out, "menu-recolhido-1280.png"));
report.checks.push({
   name: "collapsed links named",
   passed: ev('Array.from(document.querySelectorAll(".student-sidebar a")).every(a=>!!a.getAttribute("aria-label"))'),
});
report.audits.push({ name: "collapsed", ...JSON.parse(run("a11y", "--json")).data });
run("set", "viewport", "390", "844");
open("/inicio");
run("find", "role", "button", "click", "--name", "Alternar menu de navegação", "--exact");
run("wait", "--fn", '!!document.querySelector(".replica-mobile-menu")');
settle();
run("screenshot", path.join(out, "menu-390.png"));
report.checks.push({
   name: "mobile six destinations and course footer",
   passed: ev(
      'document.querySelectorAll(".replica-mobile-menu .student-sidebar > ul a").length===6&&!!document.querySelector(".replica-mobile-menu .student-sidebar-course")',
   ),
});
report.audits.push({ name: "mobile-menu", ...JSON.parse(run("a11y", "--json")).data });
run("find", "role", "button", "click", "--name", "Abrir chat da Ana", "--exact");
run("wait", "--fn", "!!document.querySelector('.replica-ana-dialog')");
report.checks.push({
   name: "mobile Ana opens after closing navigation",
   passed: ev("!document.querySelector('.replica-mobile-menu')&&!!document.querySelector('.replica-ana-dialog')"),
});
open("/financeiro/pix?cobranca=missing");
report.checks.push({
   name: "invalid charge recovery",
   passed: ev(
      'document.body.innerText.includes("Escolha uma cobrança para continuar")&&!!document.querySelector(".student-empty a[href] ")',
   ),
});
open("/calendario-academico");
run("find", "role", "button", "click", "--name", "Mês seguinte", "--exact");
report.checks.push({
   name: "calendar next month",
   passed: ev('document.querySelector(".student-month-controls h2").textContent.includes("novembro")'),
});
open("/inicio");
fs.writeFileSync(path.join(root, "docs/student-smoke-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (report.checks.some(c => !c.passed) || report.audits.some(a => a.counts.violations)) process.exitCode = 1;
