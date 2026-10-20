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
const open = route => {
   run("open", "http://127.0.0.1:5173" + route);
   run("wait", "--fn", '!!document.querySelector("#conteudo-principal h1")&&!document.querySelector(".replica-loading")');
   ev("document.fonts.ready.then(()=>true)");
};
const measure = () =>
   ev(
      `(()=>{const a=Array.from(document.querySelectorAll('nav[aria-label="Navegação principal"] a[data-sidebar="menu-button"]')).find(a=>a.checkVisibility());const c=getComputedStyle(a),r=a.getBoundingClientRect(),icon=a.querySelector('.material-symbols-outlined'),ic=getComputedStyle(icon);const avatar=document.querySelector('.replica-ana-launcher'),ar=avatar.getBoundingClientRect();return {link:{x:r.x,width:r.width,height:r.height,fontSize:c.fontSize,fontWeight:c.fontWeight,padding:c.padding,gap:c.gap,radius:c.borderRadius,shadow:c.boxShadow,iconSize:ic.fontSize},avatar:{width:ar.width,height:ar.height,right:innerWidth-ar.right,bottom:innerHeight-ar.bottom,position:getComputedStyle(avatar).position},assistanceBlock:!!document.querySelector('.replica-assistance-space')};})()`,
   );
run("set", "viewport", "1280", "900");
open("/inicio");
ev("localStorage.setItem('anchieta-navigation-v3','connected')");
open("/inicio");
const connected = measure();
ev("localStorage.setItem('anchieta-navigation-v3','original')");
open("/inicio");
const original = measure();
ev("localStorage.setItem('anchieta-navigation-v3','connected')");
run("set", "viewport", "390", "844");
open("/inicio");
const mobileAvatar = ev(
   `(()=>{const r=document.querySelector('.replica-ana-launcher').getBoundingClientRect();return{right:innerWidth-r.right,bottom:innerHeight-r.bottom,width:r.width,height:r.height}})()`,
);
run("find", "role", "button", "click", "--name", "Alternar menu de navegação", "--exact");
const mobileDrawer = ev("document.querySelector('.replica-mobile-menu').getBoundingClientRect().width");
open("/calendario-academico");
ev("document.querySelector('.student-calendar-day:last-child').focus()");
run(
   "wait",
   "--fn",
   "document.querySelector('.student-calendar-day:last-child').getBoundingClientRect().bottom<document.querySelector('.replica-ana-launcher').getBoundingClientRect().top",
);
const focusClear = ev(
   "document.querySelector('.student-calendar-day:last-child').getBoundingClientRect().bottom<document.querySelector('.replica-ana-launcher').getBoundingClientRect().top",
);
open("/inicio");
const compared = ["x", "width", "height", "fontSize", "fontWeight", "padding", "gap", "radius", "shadow", "iconSize"];
const checks = [
   ...compared.map(key => ({ name: "sidebar " + key, passed: connected.link[key] === original.link[key] })),
   { name: "only floating Ana, no assistance block", passed: !connected.assistanceBlock && connected.avatar.position === "fixed" },
   { name: "mobile drawer 18rem", passed: mobileDrawer === 288 },
   { name: "focused calendar date stays above Ana", passed: focusClear },
];
const report = {
   date: new Date().toISOString(),
   scope: "Local frontend only. Original mode uses sanitized original sidebar markup; no institutional APIs.",
   connected,
   original,
   mobileAvatar,
   mobileDrawer,
   checks,
};
fs.writeFileSync(path.join(root, "docs/student-geometry-report-v4.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (checks.some(c => !c.passed)) process.exitCode = 1;
