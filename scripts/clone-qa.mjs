import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const bin = process.env.AGENT_BROWSER_BIN || "agent-browser";
const session = "anchieta-clone-qa";
const root = path.resolve(import.meta.dirname, "..");
const run = (...args) =>
   execFileSync(bin, ["--session", session, ...args], { encoding: "utf8", timeout: 30000, maxBuffer: 8e6, windowsHide: true });
const ev = s => JSON.parse(run("eval", s, "--json")).data.result;
const settle = () =>
   ev(
      `document.fonts.ready.then(()=>Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))))`,
   );
const origin = "http://127.0.0.1:5173";
const out = path.join(root, "docs", "screenshots", "v2");
fs.mkdirSync(out, { recursive: true });
const visits = [];
const pages = [
   ["home", "/inicio"],
   ["documentos", "/perfil/documentos"],
   ["notas", "/perfil/notas-e-faltas"],
   ["jornada", "/jornada-academica"],
   ["servicos", "/solicitacao-servicos"],
   ["financeiro", "/financeiro"],
   ["horarios", "/horarios"],
   ["mural", "/mural"],
];
for (const width of [1280, 390]) {
   run("set", "viewport", String(width), String(width === 390 ? 844 : 720));
   for (const [name, p] of pages) {
      run("open", origin + p);
      run("wait", "--fn", '!!document.querySelector(".replica-reference-content")');
      settle();
      const state = ev(
         `({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth,content:document.querySelector('#conteudo-principal').textContent.length,images:Array.from(document.querySelectorAll('img')).filter(x=>!x.complete||!x.naturalWidth).map(x=>x.getAttribute('src'))})`,
      );
      run("screenshot", path.join(out, name + "-" + width + ".png"));
      visits.push({ page: p, width, ...state });
      console.log(name, width, state.content, state.overflow ? "OVERFLOW" : "ok");
   }
   run("open", origin + "/inicio");
   run("wait", "--fn", '!!document.querySelector(".replica-reference-content")');
   ev(`Array.from(document.querySelectorAll('#conteudo-principal button')).find(b=>b.textContent==='Notas e faltas').click()`);
   run("wait", "--fn", '!!document.querySelector(".replica-native-dialog")');
   ev(
      'Promise.all(document.getAnimations().filter(a=>a.playState==="running"&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})))',
   );
   run("screenshot", path.join(out, "notas-painel-" + width + ".png"));
   run("open", origin + "/secretaria-virtual");
   ev('localStorage.setItem("anchieta-replica-nav","connected")');
   run("open", origin + "/secretaria-virtual");
   run("wait", "--fn", '!!document.querySelector(".replica-hub")');
   run("screenshot", path.join(out, "secretaria-conectada-" + width + ".png"));
   ev('localStorage.setItem("anchieta-replica-nav","original")');
   for (const [name, code] of [
      ["historico-formulario", "CSA_048_A"],
      ["substitutiva-formulario", "CSA_114"],
   ]) {
      run("open", origin + "/solicitacao-servicos/solicitar/" + code);
      run("wait", "--fn", '!!document.querySelector("[role=dialog] form")');
      settle();
      run("screenshot", path.join(out, name + "-" + width + ".png"));
   }
   run("open", origin + "/horarios");
   run("wait", "--fn", '!!document.querySelector(".replica-reference-content")');
   run("find", "role", "button", "click", "--name", "Mês", "--exact");
   run("wait", "--fn", 'document.querySelectorAll("[data-month-day]").length===31');
   settle();
   run("screenshot", path.join(out, "horarios-mes-" + width + ".png"));
}
run("set", "viewport", "981", "884");
for (const [name, p] of pages.slice(0, 2)) {
   run("open", origin + p);
   run("wait", "--fn", '!!document.querySelector(".replica-reference-content")');
   settle();
   run("screenshot", path.join(out, name + "-981.png"));
}
fs.writeFileSync(
   path.join(root, "docs", "clone-browser-report.json"),
   JSON.stringify({ date: new Date().toISOString(), source: "Only localhost and fictional data", visits }, null, 2),
);
console.log("Saved", visits.length, "page checks and 28 screenshots");
