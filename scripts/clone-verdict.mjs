import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const bin = process.env.AGENT_BROWSER_BIN || "agent-browser";
const root = path.resolve(import.meta.dirname, "..");
const run = (...args) =>
   execFileSync(bin, ["--session", "anchieta-clone-qa", ...args], { encoding: "utf8", timeout: 45000, maxBuffer: 12e6, windowsHide: true });
const ev = s => JSON.parse(run("eval", s, "--json")).data.result;
const origin = "http://127.0.0.1:5173";
const checks = [];
for (const width of [1280, 390]) {
   run("set", "viewport", String(width), String(width === 390 ? 844 : 720));
   run("open", origin + "/solicitacao-servicos/solicitar/CSA_009");
   run("wait", "--fn", '!!document.querySelector("[role=dialog] form")');
   const before = ev(
      `(()=>{const form=document.querySelector('[role=dialog] form');const fields=Array.from(form.querySelectorAll('[data-service-field]'));for(const field of fields){if(field.tagName==='SELECT')field.selectedIndex=1;else if(field.tagName==='TEXTAREA')field.value='Pedido fictício para avaliar o retorno da conferência.';}return fields.filter(f=>f.type!=='file').map(f=>({name:f.name,value:f.value}));})()`,
   );
   run("find", "role", "button", "click", "--name", "Continuar", "--exact");
   run("wait", "--fn", `document.querySelector('[role=dialog]')?.textContent.includes('Confira antes de concluir')`);
   run("find", "role", "button", "click", "--name", "Voltar", "--exact");
   run("wait", "--fn", '!!document.querySelector("[role=dialog] form")');
   const after = ev(
      `Array.from(document.querySelectorAll('[role=dialog] [data-service-field]')).filter(f=>f.type!=='file').map(f=>({name:f.name,value:f.value}))`,
   );
   if (JSON.stringify(before) !== JSON.stringify(after)) throw Error("Form values lost");
   ev(`document.querySelector('[role=dialog]').querySelector('textarea').scrollIntoView({block:'nearest',behavior:'instant'})`);
   ev(
      `Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})))`,
   );
   run("screenshot", path.join(root, "docs/screenshots/v2/servico-retorno-" + width + ".png"));
   checks.push({ width, test: "Multiple fields restored after review/back", passed: true, fields: after });
}
run("set", "viewport", "390", "844");
run("open", origin + "/perfil/documentos");
run("wait", "--fn", '!!document.querySelector(".replica-reference-content")');
const active = ev(
   `(()=>{const nav=document.querySelector('nav[aria-label="Seções do perfil"]'),tab=nav.querySelector('[aria-current=page]'),a=tab.getBoundingClientRect(),n=nav.getBoundingClientRect();return{label:tab.textContent,visible:a.left>=n.left&&a.right<=n.right,scrollTop:document.querySelector('[data-replica-scroll]').scrollTop};})()`,
);
if (!active.visible || active.scrollTop !== 0) throw Error("Active tab not revealed without vertical scrolling");
checks.push({ test: "Active mobile Documentos tab visible at vertical top", passed: true, ...active });
fs.writeFileSync(path.join(root, "docs/clone-verdict-checks.json"), JSON.stringify({ date: new Date().toISOString(), checks }, null, 2));
console.log(checks.length, "review corrections verified");
