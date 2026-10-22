import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const root = path.resolve(import.meta.dirname, ".."),
   out = path.join(root, "docs/screenshots/v7");
fs.mkdirSync(out, { recursive: true });
const bin =
   process.env.AGENT_BROWSER_BIN ||
   "C:/Users/victor.pansonato/AppData/Local/npm-cache/_npx/6de2aa2fded2970c/node_modules/agent-browser/bin/agent-browser-win32-x64.exe";
const run = (...a) =>
   execFileSync(bin, ["--session", "anchieta-v7", ...a], { encoding: "utf8", timeout: 45000, maxBuffer: 5e6, windowsHide: true });
const ev = c => JSON.parse(run("eval", "-b", Buffer.from(c).toString("base64"), "--json")).data.result;
const settle = () =>
   ev(
      "document.fonts.ready.then(()=>Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))))",
   );
const ready = () => {
   run("wait", "--fn", "!!document.querySelector('#conteudo-principal h1')&&!document.querySelector('.replica-loading')");
   settle();
};
const open = p => {
   run("open", "http://127.0.0.1:5173" + p);
   ready();
};
const shot = n => {
   settle();
   run("screenshot", path.join(out, n + ".png"));
};
const report = { date: new Date().toISOString(), surfaces: [], checks: [], audits: [] };
const check = (name, code) => {
   const detail = ev(code);
   report.checks.push({ name, passed: !!detail, detail });
   if (!detail) throw Error(name);
};
try {
   open("/inicio");
   ev("localStorage.removeItem('anchieta-cx-demo-v1')");
   for (const width of [1440, 768, 390, 320]) {
      run("set", "viewport", String(width), "940");
      for (const route of [
         "/inicio",
         "/financeiro",
         "/secretaria-virtual",
         "/meus-estudos",
         "/meus-estudos/atividades",
         "/jornada-academica",
      ]) {
         open(route);
         const info = ev(
            "(()=>{const s=document.querySelector('[data-replica-scroll]');return {overflow:s.scrollWidth>s.clientWidth+2||document.documentElement.scrollWidth>innerWidth+1,top:s.scrollTop}})()",
         );
         report.surfaces.push({ width, route, ...info });
         if (info.overflow || info.top > 2) throw Error(JSON.stringify({ width, route, ...info }));
         if (width === 1440 || width === 390) shot(route.slice(1).replaceAll("/", "-") + "-" + width);
      }
      console.log("6 pages at " + width + "px");
   }
   run("set", "viewport", "1440", "940");
   open("/financeiro");
   check(
      "finance has six open charges and four history rows",
      "document.querySelectorAll('.student-charge').length===6&&document.querySelectorAll('.student-paid-row').length===4",
   );
   check(
      "finance top nav has only main two sections",
      "[...document.querySelectorAll('.student-financial-nav a')].map(a=>a.textContent).join('|')==='Cobranças e pagamentos|Extrato e bolsas'",
   );
   run("click", ".student-charge:first-child input");
   run("wait", "--fn", "location.search.includes('202611')");
   run("find", "first", ".student-payment-selection a", "click");
   ready();
   check(
      "charge selection carries through to Pix",
      "location.pathname==='/financeiro/pix'&&location.search.includes('202611')&&document.querySelector('.student-pix-page').textContent.includes('890,00')",
   );
   open("/secretaria-virtual");
   run("find", "first", ".student-section-nav a[href='/solicitacao-servicos/solicitar']", "click");
   run("wait", "--fn", "!!document.querySelector('[role=dialog]')");
   check(
      "service catalog selects service tab",
      "document.querySelector('.student-section-nav a[aria-current=page]').getAttribute('href')==='/solicitacao-servicos/solicitar'",
   );
   run("press", "Escape");
   run("wait", "--fn", "!document.querySelector('[role=dialog]')");
   open("/jornada-academica");
   check(
      "first period is inside visible viewport",
      "(()=>{const b=document.querySelector('[data-slot=carousel] button[aria-label^=\"1º período\"]'),v=document.querySelector('.replica-carousel');return b.getBoundingClientRect().left>=v.getBoundingClientRect().left-1})()",
   );
   run("find", "first", 'button[data-open-period="1"]', "click");
   run("wait", "--text", "Reprovada");
   settle();
   check(
      "failed and adaptation actions live in subject rows",
      "document.querySelectorAll('.cx-journey-pending-row a[href=\"https://app.anchieta.br/matricula_dp_adap/index.php\"]').length>=2",
   );
   check(
      "journey aggregate statuses agree with subject rows",
      "document.querySelector('[aria-labelledby=discipline-summary-title] [role=img]').getAttribute('aria-label').includes('3 aprovadas, 1 adaptação')",
   );
   run("scrollintoview", ".cx-journey-pending-row");
   shot("journey-actions-1440");
   run("find", "first", 'button[aria-label^="8º período"]', "click");
   run("wait", "--text", "8º Período");
   check("eighth period remains reachable", "[...document.querySelectorAll('h3')].some(h=>h.textContent==='8º Período')");
   open("/inicio");
   check(
      "extension is direct external link",
      "document.querySelector('.student-hours-extension').href==='https://app.anchieta.br/sistema_pratica_extensionista/minhas_praticas.php'&&document.querySelector('.student-hours-extension').target==='_blank'",
   );
   ev(
      "window.themeAnimations=[];window.savedThemeAnimate=Element.prototype.animate;Element.prototype.animate=function(k,o){if(o?.pseudoElement)window.themeAnimations.push({k,o});return window.savedThemeAnimate.call(this,k,o)}",
   );
   run("find", "role", "button", "click", "--name", "Alternar tema", "--exact");
   run("wait", "--fn", "window.themeAnimations.length>0");
   settle();
   check(
      "theme matches measured original reveal",
      "window.themeAnimations[0].o.duration===650&&window.themeAnimations[0].o.easing==='cubic-bezier(.87,.12,0,.78)'&&window.themeAnimations[0].k.clipPath[0].startsWith('circle(0px')&&document.documentElement.classList.contains('dark')",
   );
   shot("theme-dark-1440");
   run("find", "role", "button", "click", "--name", "Alternar tema", "--exact");
   run("wait", "--fn", "!document.documentElement.classList.contains('dark')");
   settle();
   run("set", "viewport", "390", "844");
   open("/financeiro");
   check(
      "mobile financial management is visible without swiping",
      "(()=>{const a=document.querySelector('.student-financial-mobile-actions');return getComputedStyle(a).display==='grid'&&a.getBoundingClientRect().top<450&&a.scrollWidth===a.clientWidth})()",
   );
   open("/secretaria-virtual");
   run(
      "wait",
      "--fn",
      "!!document.querySelector('video')&&!document.querySelector('video').paused&&document.querySelector('video').currentTime>.3",
   );
   check(
      "new full HD secretary video plays inline on mobile",
      "(()=>{const v=document.querySelector('video');return v.src.includes('student-guidance')&&v.loop&&v.muted&&v.playsInline&&v.videoWidth===1920})()",
   );
   run("wait", "--fn", "document.querySelector('video').currentTime>6.5");
   run("wait", "--fn", "document.querySelector('video').currentTime<2");
   check("mobile video completed an actual loop", "document.querySelector('video').currentTime<2&&!document.querySelector('video').paused");
   shot("secretary-video-mobile-playing");
   ev("document.querySelector('[data-replica-scroll]').scrollTop=10000");
   run("wait", "--fn", "!document.querySelector('video')||document.querySelector('video').paused");
   check("offscreen playback stops", "!document.querySelector('video')||document.querySelector('video').paused");
   open("/meus-estudos");
   run("wait", "--fn", "!!document.querySelector('video')&&!document.querySelector('video').paused");
   check("studies video also plays on mobile", "document.querySelector('video').src.includes('study-notes')");
   open("/meus-estudos/atividades");
   run("wait", "--fn", "!!document.querySelector('video')&&!document.querySelector('video').paused");
   check("hours video differs from secretary and plays on mobile", "document.querySelector('video').src.includes('study-desk')");
   open("/jornada-academica");
   run("find", "first", 'button[data-open-period="1"]', "click");
   run("wait", "--text", "Reprovada");
   run("scrollintoview", ".replica-period-content .cx-journey-pending-row");
   shot("journey-actions-390");
   check(
      "mobile subject actions fit the viewport",
      "(()=>{const r=document.querySelector('.replica-period-content .cx-journey-pending-row'),s=document.querySelector('[data-replica-scroll]');return getComputedStyle(r).opacity==='1'&&r.getBoundingClientRect().top<innerHeight&&s.scrollWidth<=s.clientWidth+2})()",
   );
   for (const [width, route] of [
      [1440, "/financeiro"],
      [390, "/financeiro"],
      [390, "/jornada-academica"],
      [390, "/secretaria-virtual"],
   ]) {
      run("set", "viewport", String(width), "940");
      open(route);
      report.audits.push({ width, route, ...JSON.parse(run("a11y", "--json")).data });
   }
   run("set", "viewport", "1440", "940");
   open("/inicio");
} finally {
   fs.writeFileSync(path.join(root, "docs/refinement-browser-v7.json"), JSON.stringify(report, null, 2));
   console.log(
      JSON.stringify({
         surfaces: report.surfaces.length,
         checks: report.checks.map(c => ({ name: c.name, passed: c.passed })),
         audits: report.audits.length,
      }),
   );
}
