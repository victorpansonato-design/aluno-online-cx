import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const bin =
   "C:/Users/victor.pansonato/AppData/Local/npm-cache/_npx/6de2aa2fded2970c/node_modules/agent-browser/bin/agent-browser-win32-x64.exe";
const run = (...a) =>
   execFileSync(bin, ["--session", "anchieta-v9", ...a], { encoding: "utf8", windowsHide: true, timeout: 45000, maxBuffer: 5e6 });
const ev = c => JSON.parse(run("eval", "-b", Buffer.from(c).toString("base64"), "--json")).data.result;
const ready = () => {
   run("wait", "--fn", "!!document.querySelector('.student-page h1')&&!document.querySelector('.replica-loading')");
   ev(
      "document.fonts.ready.then(()=>Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))))",
   );
};
const open = p => {
   run("open", "http://127.0.0.1:5173" + p);
   ready();
};
const out = path.resolve("docs/screenshots/v11");
fs.mkdirSync(out, { recursive: true });
const report = { surfaces: [], checks: [], audits: [] };
const check = (name, c) => {
   const detail = ev(c);
   report.checks.push({ name, passed: !!detail, detail });
   if (!detail) throw Error(name);
};
try {
   for (const width of [1440, 768, 390, 320]) {
      run("set", "viewport", String(width), "940");
      for (const route of ["/secretaria-virtual", "/meus-estudos/atividades"]) {
         open(route);
         const info = ev(
            "(()=>{const s=document.querySelector('[data-replica-scroll]');return {overflow:s.scrollWidth>s.clientWidth+2||document.documentElement.scrollWidth>innerWidth+1,top:s.scrollTop}})()",
         );
         if (width < 768 && route === "/meus-estudos/atividades")
            check(
               "banner content stays above video at " + width,
               "(()=>{const b=document.querySelector('.cx-context-banner'),t=b.firstElementChild.getBoundingClientRect(),v=b.querySelector('.cx-ambient').getBoundingClientRect();return t.bottom<=v.top+1})()",
            );
         report.surfaces.push({ width, route, ...info });
         if (info.overflow || info.top > 2) throw Error(JSON.stringify(info));
         if (width === 1440 || width === 390) {
            if (route === "/secretaria-virtual")
               run("wait", "--fn", "(()=>{const v=document.querySelector('video');return v&&v.videoWidth===1280&&!v.paused})()");
            run("screenshot", path.join(out, route.slice(1).replaceAll("/", "-") + "-" + width + ".png"));
         }
      }
   }
   for (const width of [1440, 390]) {
      run("set", "viewport", String(width), "940");
      open("/secretaria-virtual");
      run("wait", "--fn", "(()=>{const v=document.querySelector('video');return v&&v.readyState>=2&&!v.paused})()");
      check(
         "new source is muted inline loop at " + width,
         "(()=>{const v=document.querySelector('video');return v.src.includes('secretariat-documents')&&v.loop&&v.muted&&v.playsInline&&v.videoWidth===1280&&v.videoHeight===720&&v.duration>7.4&&v.duration<7.7})()",
      );
      run("wait", "--fn", "document.querySelector('video').currentTime>6.8");
      run("wait", "--fn", "document.querySelector('video').currentTime<1.5");
      check("actual loop wraps at " + width, "document.querySelector('video').currentTime<2&&!document.querySelector('video').paused");
      ev("(()=>{const s=document.querySelector('[data-replica-scroll]');s.scrollTop=s.scrollHeight})()");
      run("wait", "--fn", "document.querySelector('video')?.paused===true||!document.querySelector('video')");
      check("offscreen video stops at " + width, "!document.querySelector('video')||document.querySelector('video').paused");
   }
   run("set", "viewport", "1440", "940");
   open("/meus-estudos");
   run("click", 'a[href="/meus-estudos/atividades#eletivas"]');
   ready();
   check(
      "studies lands on Eletivas inside Activities",
      "location.pathname==='/meus-estudos/atividades'&&location.hash==='#eletivas'&&!!document.querySelector('#eletivas')",
   );
   check(
      "official elective link with active section",
      "document.querySelector('#eletivas').href==='https://app.anchieta.br/Eletivas/'&&document.querySelector('#eletivas').target==='_blank'&&document.querySelector('.student-section-nav [aria-current=page]').textContent==='Atividades e horas'",
   );
   for (const route of ["/academico/eletivas", "/meus-estudos/eletivas", "/eletivas", "/aluno-online/academico/eletivas"]) {
      open(route);
      run("wait", "--fn", "location.pathname==='/meus-estudos/atividades'&&location.hash==='#eletivas'");
      check("redirect " + route, "document.querySelectorAll('#eletivas').length===1");
   }
   for (const width of [1440, 390]) {
      run("set", "viewport", String(width), "940");
      open("/meus-estudos/atividades");
      report.audits.push({ width, route: "activities", ...JSON.parse(run("a11y", "--json")).data });
   }
   console.log(
      JSON.stringify(
         {
            surfaces: report.surfaces,
            checks: report.checks,
            audits: report.audits.map(a => ({ width: a.width, violations: a.violations?.length })),
         },
         null,
         2,
      ),
   );
} finally {
   fs.writeFileSync("docs/refinement-browser-v11.json", JSON.stringify(report, null, 2));
}
