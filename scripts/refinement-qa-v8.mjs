import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const bin =
   "C:/Users/victor.pansonato/AppData/Local/npm-cache/_npx/6de2aa2fded2970c/node_modules/agent-browser/bin/agent-browser-win32-x64.exe";
const run = (...a) =>
   execFileSync(bin, ["--session", "anchieta-v8", ...a], { encoding: "utf8", timeout: 45000, windowsHide: true, maxBuffer: 5e6 });
const ev = c => JSON.parse(run("eval", "-b", Buffer.from(c).toString("base64"), "--json")).data.result;
const ready = () => {
   run("wait", "--fn", "!!document.querySelector('#conteudo-principal h1')&&!document.querySelector('.replica-loading')");
   ev(
      "document.fonts.ready.then(()=>Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))))",
   );
};
const root = process.cwd(),
   out = path.join(root, "docs/screenshots/v8");
fs.mkdirSync(out, { recursive: true });
const report = { surfaces: [], checks: [], audits: [] };
const check = (name, c) => {
   const passed = !!ev(c);
   report.checks.push({ name, passed });
   if (!passed) throw Error(name);
};
const open = p => {
   run("open", "http://127.0.0.1:5173" + p);
   ready();
};
const shot = n => run("screenshot", path.join(out, n + ".png"));
try {
   open("/inicio");
   ev("localStorage.removeItem('anchieta-cx-demo-v1')");
   for (const width of [1440, 768, 390, 320]) {
      run("set", "viewport", String(width), "940");
      for (const route of ["/inicio", "/financeiro"]) {
         open(route);
         const info = ev(
            "(()=>{const s=document.querySelector('[data-replica-scroll]');return {overflow:s.scrollWidth>s.clientWidth+2||document.documentElement.scrollWidth>innerWidth+1,top:s.scrollTop}})()",
         );
         report.surfaces.push({ width, route, ...info });
         if (info.overflow || info.top > 2) throw Error(JSON.stringify(info));
         if (width === 1440 || width === 390) shot(route.slice(1) + "-" + width);
      }
   }
   run("set", "viewport", "1440", "940");
   open("/inicio");
   check(
      "home clock and stage shortcut",
      "document.querySelector('.cx-home-quick-links a[href=\"/horarios\"]').textContent.includes('schedule')&&!!document.querySelector('.cx-home-quick-links a[href=\"/meu-estagio\"]')",
   );
   check(
      "AVA yellow bulb",
      "getComputedStyle(document.querySelector('.student-sidebar-ava .material-symbols-outlined')).color==='rgb(180, 122, 0)'",
   );
   run("click", '.cx-home-quick-links a[href="/meu-estagio"]');
   ready();
   check(
      "stage destination opens",
      "location.pathname==='/meu-estagio'&&document.querySelector('#conteudo-principal h1').textContent.includes('Estágio')",
   );
   open("/inicio");
   run("click", '.cx-status-card[href="/jornada-academica?periodo=1"]');
   ready();
   run("wait", "--text", "Reprovada");
   check(
      "DP opens pending first period",
      "location.search.includes('periodo=1')&&document.querySelectorAll('.cx-journey-pending-row').length>=2",
   );
   open("/financeiro");
   run("click", ".student-charge:first-child input");
   run("click", ".cx-charge-responsibles > button:nth-of-type(3)");
   check(
      "filter shows four invoices and retains hidden selection",
      "document.querySelectorAll('.student-charge').length===4&&document.querySelector('.student-payment-selection').textContent.includes('fora deste filtro')",
   );
   check(
      "shared invoice displays 60/40",
      "document.querySelector('.student-charge').textContent.includes('60%')&&document.querySelector('.student-charge').textContent.includes('40%')",
   );
   run("click", ".student-charge:first-child input");
   shot("financeiro-filter-1440");
   run("click", ".student-payment-selection a");
   ready();
   check(
      "two full invoices forwarded to Pix",
      "location.pathname==='/financeiro/pix'&&document.querySelector('.student-pix-summary').textContent.includes('1.780,00')",
   );
   open("/financeiro/alteracao-responsavel");
   run("wait", "[role=dialog]");
   run("fill", "#responsible-name", "Carla Costa");
   check(
      "native effective date is valid",
      "document.querySelector('#responsible-date').value==='2027-01-01'&&document.querySelector('#responsible-date').checkValidity()",
   );
   run("click", "[role=dialog] form button[type=submit]");
   run("wait", "--text", "Alteração agendada.");
   check(
      "change scheduled; charge owners retain identities",
      "(()=>{const s=JSON.parse(localStorage.getItem('anchieta-cx-demo-v1'));return s.financialPlan.scheduled[0].name==='Carla Costa'&&s.financialPlan.people.find(p=>p.id==='student').name==='Marina Costa'})()",
   );
   shot("responsaveis-1440");
   report.audits.push({ surface: "responsible-dialog-desktop", ...JSON.parse(run("a11y", "--json")).data });
   run("set", "viewport", "390", "844");
   shot("responsaveis-390");
   report.audits.push({ surface: "responsible-dialog-mobile", ...JSON.parse(run("a11y", "--json")).data });
   run("click", ".cx-responsible-scheduled button");
   run("press", "Escape");
   open("/financeiro");
   report.audits.push({ surface: "finance-mobile", ...JSON.parse(run("a11y", "--json")).data });
   open("/inicio");
   ev("document.querySelector('.cx-academic-status').scrollIntoView({block:'start'})");
   shot("situacao-390");
   ev("document.querySelector('.cx-free-courses').scrollIntoView({block:'center'})");
   shot("cursos-390");
   open("/inicio");
   run("set", "viewport", "1440", "940");
   console.log(
      JSON.stringify(
         {
            surfaces: report.surfaces,
            checks: report.checks,
            audits: report.audits.map(a => ({ surface: a.surface, violations: a.violations?.length })),
         },
         null,
         2,
      ),
   );
} finally {
   fs.writeFileSync(path.join(root, "docs/refinement-browser-v8.json"), JSON.stringify(report, null, 2));
}
