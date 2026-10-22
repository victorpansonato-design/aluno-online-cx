import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "docs/screenshots/v6");
fs.mkdirSync(out, { recursive: true });
const bin =
   process.env.AGENT_BROWSER_BIN ||
   "C:/Users/victor.pansonato/AppData/Local/npm-cache/_npx/6de2aa2fded2970c/node_modules/agent-browser/bin/agent-browser-win32-x64.exe";
const run = (...args) =>
   execFileSync(bin, ["--session", "anchieta-v6", ...args], { encoding: "utf8", timeout: 45000, maxBuffer: 5e6, windowsHide: true });
const ev = code => JSON.parse(run("eval", "-b", Buffer.from(code).toString("base64"), "--json")).data.result;
const settle = () =>
   ev(
      "document.fonts.ready.then(()=>Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))))",
   );
const ready = () => {
   run("wait", "--fn", "!!document.querySelector('#conteudo-principal h1')&&!document.querySelector('.replica-loading')");
   settle();
};
const open = route => {
   run("open", "http://127.0.0.1:5173" + route);
   ready();
};
const report = { date: new Date().toISOString(), surfaces: [], checks: [], audits: [] };
const check = (name, code) => {
   const passed = !!ev(code);
   report.checks.push({ name, passed });
   if (!passed) throw Error(name);
};
try {
   open("/inicio");
   for (const width of [1440, 768, 390, 320]) {
      run("set", "viewport", String(width), "940");
      for (const route of [
         "/inicio",
         "/meus-estudos",
         "/horarios",
         "/perfil/notas-e-faltas",
         "/solicitacao-servicos",
         "/secretaria-virtual",
         "/financeiro",
         "/jornada-academica",
         "/perfil/documentos",
         "/ajuda",
         "/meus-estudos/atividades",
         "/notificacoes/76149709",
      ]) {
         open(route);
         const info = ev(
            `(()=>{const s=document.querySelector('[data-replica-scroll]'),h=document.querySelector('#conteudo-principal h1');return {title:h.textContent,font:getComputedStyle(h).fontSize,top:Math.round(h.getBoundingClientRect().top-s.getBoundingClientRect().top),scroll:s.scrollTop,overflow:document.documentElement.scrollWidth>innerWidth+1||s.scrollWidth>s.clientWidth+2,footer:!!document.querySelector('.replica-footer'),ana:!!document.querySelector('.replica-ana-launcher')}})()`,
         );
         report.surfaces.push({ width, route, ...info });
         if (info.overflow || info.scroll > 2 || info.font !== (width < 768 ? "24px" : "30px"))
            throw Error(JSON.stringify({ width, route, ...info }));
         if ([1440, 390].includes(width) && ["/inicio", "/horarios", "/solicitacao-servicos", "/meus-estudos"].includes(route))
            run("screenshot", path.join(out, route.replaceAll("/", "_") + "-" + width + ".png"));
      }
      console.log("Checked 12 pages at " + width + "px");
   }
   run("set", "viewport", "1440", "940");
   open("/inicio");
   check(
      "two latest notice links precede formation",
      "document.querySelectorAll('.cx-notice-preview>a').length===2&&!!(document.querySelector('.cx-notice-preview').compareDocumentPosition(document.querySelector('.cx-formation'))&Node.DOCUMENT_POSITION_FOLLOWING)",
   );
   check(
      "sidebar card and header ombudsman",
      "!!document.querySelector('.cx-sidebar-credential')&&!document.querySelector('.student-sidebar-course')&&document.querySelector('header a[data-ombudsman]').target==='_blank'",
   );
   run("find", "first", ".cx-next-class h2 a", "click");
   run("wait", "--fn", "!!document.querySelector('[role=dialog]')");
   check(
      "next class title opens its situation",
      "document.querySelector('[role=dialog]').textContent.includes('Bases da Administração Moderna')",
   );
   run("press", "Escape");
   run("wait", "--fn", "!document.querySelector('[role=dialog]')");
   open("/inicio");
   run("find", "first", ".cx-notice-preview>a", "click");
   ready();
   check(
      "notice preview opens exact publication",
      "location.pathname==='/notificacoes/76149709'&&document.querySelector('#conteudo-principal').textContent.includes('Tem vaga nova pra você!')",
   );
   open("/inicio");
   run("find", "first", ".cx-discipline-bars a[href*='contabilidade']", "click");
   run("wait", "--fn", "!!document.querySelector('[role=dialog]')");
   settle();
   check(
      "subject opens the requested side panel",
      "location.search.includes('contabilidade')&&document.querySelector('[role=dialog]').textContent.includes('Bases da Contabilidade Business')&&document.querySelector('[role=dialog]').textContent.includes('7,2')",
   );
   run("screenshot", path.join(out, "disciplina-painel-1440.png"));
   run("press", "Escape");
   run("wait", "--fn", "!document.querySelector('[role=dialog]')");
   check("closing clears subject query", "!location.search.includes('disciplina')");
   ev("document.querySelector('[data-replica-scroll]').scrollTop=10000");
   run("find", "first", ".student-sidebar > ul a[href='/financeiro']", "click");
   ready();
   check("new route always starts at top", "document.querySelector('[data-replica-scroll]').scrollTop===0");
   ev("document.querySelector('[data-replica-scroll]').scrollTop=10000");
   run("find", "first", ".student-sidebar > ul a[href='/meus-estudos']", "click");
   ready();
   check("revisited route starts at top", "document.querySelector('[data-replica-scroll]').scrollTop===0");
   check("media has no overlay control", "!!document.querySelector('.cx-ambient img')&&!document.querySelector('.cx-video-control')");
   open("/solicitacao-servicos");
   check(
      "summary includes recent requests",
      "document.querySelector('[aria-label=\"Resumo das suas solicitações\"] p .tabular').textContent==='21'&&document.querySelector('[aria-label=\"Resumo das suas solicitações\"] li .tabular').textContent==='1'",
   );
   check("requests are near top", "document.querySelector('.cx-inline-requests').getBoundingClientRect().top<400");
   run("find", "first", "[data-local-request]", "click");
   run("wait", "--fn", "!!document.querySelector('[role=dialog]')");
   check("request detail remains functional", "document.querySelector('[role=dialog]').textContent.includes('Histórico escolar')");
   run("press", "Escape");
   run("wait", "--fn", "!document.querySelector('[role=dialog]')");
   for (const route of ["/inicio", "/meus-estudos", "/solicitacao-servicos", "/secretaria-virtual"]) {
      open(route);
      if (route === "/secretaria-virtual") run("screenshot", path.join(out, "secretaria-1440.png"));
      report.audits.push({ route, width: 1440, ...JSON.parse(run("a11y", "--json")).data });
   }
   run("set", "viewport", "390", "844");
   open("/inicio");
   check(
      "mobile notices visually precede hours",
      "document.querySelector('.cx-notice-preview').getBoundingClientRect().top<document.querySelector('.cx-formation').getBoundingClientRect().top",
   );
   check("mobile stays poster only", "!document.querySelector('video')");
   report.audits.push({ route: "/inicio", width: 390, ...JSON.parse(run("a11y", "--json")).data });
   run("find", "role", "button", "click", "--name", "Alternar menu de navegação", "--exact");
   run("wait", "--fn", "!!document.querySelector('.replica-mobile-menu')");
   check("mobile menu keeps digital card", "!!document.querySelector('.replica-mobile-menu .cx-sidebar-credential')");
   run("screenshot", path.join(out, "menu-390.png"));
   run("press", "Escape");
   run("find", "first", ".cx-discipline-bars a[href*='contabilidade']", "click");
   run("wait", "--fn", "!!document.querySelector('[role=dialog]')");
   settle();
   check(
      "mobile subject panel keeps selected discipline",
      "document.querySelector('[role=dialog]').textContent.includes('Bases da Contabilidade Business')",
   );
   run("screenshot", path.join(out, "disciplina-painel-390.png"));
   run("press", "Escape");
   run("wait", "--fn", "!document.querySelector('[role=dialog]')");
   run("set", "viewport", "1440", "940");
   open("/meus-estudos");
   run("scrollintoview", ".student-studies-columns");
   settle();
   check(
      "destination groups keep semantic colors",
      "(()=>{const a=[...document.querySelectorAll('.student-studies-columns .student-destinations>a')];const tones=['academic','formation','support','feedback'];return tones.every(t=>a.some(e=>e.dataset.tone===t))&&new Set(a.map(e=>getComputedStyle(e).backgroundColor)).size===4&&new Set(a.filter(e=>e.dataset.tone==='formation').map(e=>getComputedStyle(e.querySelector('.material-symbols-outlined')).color)).size===1})()",
   );
   run("screenshot", path.join(out, "estudos-categorias-1440.png"));
   open("/inicio");
} finally {
   fs.writeFileSync(path.join(root, "docs/refinement-browser-v6.json"), JSON.stringify(report, null, 2));
   console.log(JSON.stringify({ surfaces: report.surfaces.length, checks: report.checks, audits: report.audits.length }));
}
