import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const root = path.resolve(import.meta.dirname, ".."),
   out = path.join(root, "docs/screenshots/v5");
fs.mkdirSync(out, { recursive: true });
const bin =
   process.env.AGENT_BROWSER_BIN ||
   "C:/Users/victor.pansonato/AppData/Local/npm-cache/_npx/6de2aa2fded2970c/node_modules/agent-browser/bin/agent-browser-win32-x64.exe";
const run = (...args) =>
   execFileSync(bin, ["--session", "anchieta-refine-v5", ...args], { encoding: "utf8", timeout: 45000, maxBuffer: 8e6, windowsHide: true });
const ev = code => {
   const r = JSON.parse(run("eval", code, "--json"));
   if (!r.success) throw Error(r.error);
   return r.data.result;
};
const open = route => {
   run("open", "http://127.0.0.1:5173" + route);
   run("wait", "--fn", "!!document.querySelector('#conteudo-principal h1')&&!document.querySelector('.replica-loading')");
   ev(
      "document.fonts.ready.then(()=>Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))))",
   );
};
const report = {
   date: new Date().toISOString(),
   scope: "Local frontend only; no institutional actions",
   screens: [],
   audits: [],
   routes: [],
   forms: [],
   links: [],
   checks: [],
};
const save = () => fs.writeFileSync(path.join(root, "docs/refinement-browser-v5.json"), JSON.stringify(report, null, 2));
open("/inicio");
ev("localStorage.removeItem('anchieta-cx-demo-v1');localStorage.setItem('anchieta-navigation-v3','connected')");
const targets = [
   ["inicio", "/inicio"],
   ["estudos", "/meus-estudos"],
   ["secretaria", "/secretaria-virtual"],
   ["financeiro", "/financeiro?cobranca=DEMO-MENSALIDADE-202611"],
   ["ajuda", "/ajuda"],
   ["atividades", "/meus-estudos/atividades"],
];
const geometry = () =>
   ev(
      `(()=>{const main=document.querySelector('#conteudo-principal'),s=document.querySelector('[data-replica-scroll]');const leaks=[...main.querySelectorAll('a,button,input,summary')].filter(e=>e.checkVisibility()).filter(e=>e.getBoundingClientRect().right>main.getBoundingClientRect().right+3||e.getBoundingClientRect().left<main.getBoundingClientRect().left-3).map(e=>e.textContent.trim().slice(0,80));return {title:document.title,heading:main.querySelector('h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth+1||s.scrollWidth>s.clientWidth+2,leaks,badImages:[...document.images].filter(i=>i.checkVisibility()&&i.complete&&!i.naturalWidth).map(i=>i.src),disclaimers:/dados fictícios|demonstração|pagamento simulado|meta ilustrativa/i.test(main.innerText),videos:[...document.querySelectorAll('video')].map(v=>({src:v.getAttribute('src'),playing:!v.paused,ready:v.readyState})),controls:main.querySelectorAll('a,button,input,select,summary').length}})()`,
   );
for (const width of [1440, 1280, 1024, 768, 390, 320]) {
   run("set", "viewport", String(width), String(width < 768 ? 844 : 1000));
   for (const [name, route] of targets) {
      open(route);
      const g = geometry();
      run("screenshot", path.join(out, `${name}-${width}.png`));
      report.screens.push({ name, width, ...g });
      for (const a of ev(
         `Array.from(document.querySelectorAll('#conteudo-principal a[href]')).map(a=>({label:a.textContent.trim(),href:a.getAttribute('href'),target:a.getAttribute('target')}))`,
      ))
         report.links.push({ route, width, ...a });
      if ([1440, 390].includes(width)) {
         const r = JSON.parse(run("a11y", "--json")).data;
         report.audits.push({ route, width, ...r });
         ev("document.querySelector('[data-replica-scroll]').scrollTop=document.querySelector('[data-replica-scroll]').scrollHeight");
         run("screenshot", path.join(out, `${name}-${width}-below.png`));
      }
      console.log(name, width, g.overflow ? "OVERFLOW" : "ok", g.videos.length ? "video" : "poster");
      save();
   }
}
// All captured routes, new hubs and routed dialogs; repeated notice pages share handlers.
const ref = JSON.parse(fs.readFileSync(path.join(root, "src/replica/reference.json"), "utf8"));
const routes = [
   ...new Set([
      ...Object.keys(ref.pages),
      ...targets.map(t => t[1]),
      "/calendario-academico",
      "/comunicados",
      "/meus-estudos/extensao",
      "/preferencias",
      "/financeiro/pix?cobranca=DEMO-MENSALIDADE-202611",
      "/financeiro/alteracao-vencimento",
      "/financeiro/alteracao-responsavel",
      "/perfil/visao-geral/carteirinha",
   ]),
];
run("set", "viewport", "1280", "1000");
for (const route of routes) {
   open(route);
   const g = geometry();
   report.routes.push({ route, ...g });
   if (report.routes.length % 20 === 0) {
      console.log("routes", report.routes.length, "/", routes.length);
      save();
   }
}
// Every service form renders its own field schema, without submitting any institutional request.
for (const code of Object.keys(ref.serviceForms)) {
   open("/solicitacao-servicos/solicitar/" + code);
   run("wait", "--fn", "!!document.querySelector('[role=dialog] form')");
   report.forms.push({
      code,
      ...ev(
         `(()=>{const d=document.querySelector('[role=dialog]');return {title:d.querySelector('h2')?.textContent,fields:d.querySelectorAll('[data-service-field]').length,close:!!d.querySelector('[aria-label=Fechar]'),overflow:d.scrollWidth>d.clientWidth+2}})()`,
      ),
   });
   run("find", "role", "button", "click", "--name", "Fechar", "--exact");
   if (report.forms.length % 10 === 0) console.log("forms", report.forms.length);
}
save();
console.log("Batched review complete", report.screens.length, "captures", report.routes.length, "routes", report.forms.length, "forms");
