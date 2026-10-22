import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const root = path.resolve(import.meta.dirname, ".."),
   out = path.join(root, "docs/screenshots/v5");
const bin =
   process.env.AGENT_BROWSER_BIN ||
   "C:/Users/victor.pansonato/AppData/Local/npm-cache/_npx/6de2aa2fded2970c/node_modules/agent-browser/bin/agent-browser-win32-x64.exe";
const run = (...args) =>
   execFileSync(bin, ["--session", "anchieta-flows-v5", ...args], { encoding: "utf8", timeout: 45000, maxBuffer: 5e6, windowsHide: true });
const ev = code => JSON.parse(run("eval", code, "--json")).data.result;
const ready = () => run("wait", "--fn", "!!document.querySelector('#conteudo-principal h1')&&!document.querySelector('.replica-loading')");
const settle = () =>
   ev(
      "document.fonts.ready.then(()=>Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))))",
   );
const open = route => {
   run("open", "http://127.0.0.1:5173" + route);
   ready();
   settle();
};
const click = name => run("find", "role", "button", "click", "--name", name, "--exact");
const check = (name, code) => {
   const result = ev(code);
   report.checks.push({ name, passed: !!result, detail: result });
   if (!result) throw Error(name);
};
const shot = name => {
   settle();
   run("screenshot", path.join(out, name + ".png"));
};
const report = {
   date: new Date().toISOString(),
   scope: "Local UI interaction; simulated device constraints explicitly recorded",
   checks: [],
   audits: [],
};
execFileSync(bin, ["--session", "anchieta-flows-v5", "open", "http://127.0.0.1:5173/inicio"], {
   stdio: "ignore",
   timeout: 45000,
   windowsHide: true,
});
ev("localStorage.removeItem('anchieta-cx-demo-v1');localStorage.setItem('anchieta-navigation-v3','connected')");
try {
   run("set", "viewport", "1280", "900");
   open("/inicio");
   for (const [label, route] of [
      ["Meus estudos", "/meus-estudos"],
      ["Secretaria virtual", "/secretaria-virtual"],
      ["Financeiro", "/financeiro"],
      ["Calendário", "/calendario-academico"],
      ["Meus dados", "/perfil/visao-geral"],
      ["Início", "/inicio"],
   ]) {
      run("find", "first", `.student-sidebar > ul a[href='${route}']`, "click");
      ready();
      check(
         "primary navigation " + label,
         `location.pathname===${JSON.stringify(route)}&&!!document.querySelector('#conteudo-principal h1')`,
      );
   }
   click("Alternar menu de navegação");
   run("wait", "--fn", "!!document.querySelector('.replica-collapsed')");
   shot("menu-recolhido-1280");
   check(
      "collapsed links keep accessible names",
      "[...document.querySelectorAll('.student-sidebar a')].every(a=>!!a.getAttribute('aria-label'))",
   );
   report.audits.push({ name: "collapsed", ...JSON.parse(run("a11y", "--json")).data });
   click("Alternar menu de navegação");
   // Real playback, explicit pause, and no background playback when scrolled out.
   open("/inicio");
   ev(
      "Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:false,effectiveType:'4g',downlink:10,addEventListener(){},removeEventListener(){}}})",
   );
   run("find", "first", ".student-sidebar > ul a[href='/meus-estudos']", "click");
   ready();
   run(
      "wait",
      "--fn",
      "!!document.querySelector('video')&&!document.querySelector('video').paused&&document.querySelector('video').currentTime>.2",
   );
   check("desktop video decodes and plays", "document.querySelector('video').readyState>=3&&document.querySelector('video').muted");
   click("Pausar vídeo de estudo");
   check("pause control stops video", "document.querySelector('video').paused");
   click("Reproduzir vídeo de estudo");
   run("wait", "--fn", "!document.querySelector('video').paused");
   ev("document.querySelector('[data-replica-scroll]').scrollTop=10000");
   run("wait", "--fn", "!document.querySelector('video')||document.querySelector('video').paused");
   check("offscreen video stops", "!document.querySelector('video')||document.querySelector('video').paused");
   open("/inicio");
   ev(
      "Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true,addEventListener(){},removeEventListener(){}}})",
   );
   run("find", "first", ".student-sidebar > ul a[href='/meus-estudos']", "click");
   ready();
   check(
      "simulated Save-Data prevents MP4 source",
      "!!document.querySelector('.cx-ambient img')&&!document.querySelector('.cx-ambient video')",
   );
   // A fresh full navigation removes the simulated connection property.
   open("/secretaria-virtual");
   run("find", "role", "searchbox", "fill", "--name", "Buscar na secretaria", "xyz-sem-servico");
   check("secretariat empty search has recovery", `!!document.querySelector('.student-empty a[href*="busca="]')`);
   shot("secretaria-busca-vazia-1280");
   open("/ajuda");
   run("find", "role", "searchbox", "fill", "--name", "Buscar uma orientação", "atestado");
   run("find", "text", "Preciso de um atestado ou histórico.", "click", "--exact");
   check("help answer opens with contextual next step", `!!document.querySelector('details[open] a[href*="busca=declara"]')`);
   shot("ajuda-resposta-1280");
   open("/inicio");
   run("find", "role", "link", "click", "--name", "Conferir e pagar", "--exact");
   ready();
   check(
      "home selects its charge in financial",
      "!!document.querySelector('.student-charge input:checked')&&location.search.includes('DEMO-MENSALIDADE-202611')",
   );
   run("find", "role", "link", "click", "--name", "Continuar para Pix", "--exact");
   ready();
   click("Já realizei o pagamento");
   run("wait", "--fn", "document.querySelector('h1')?.textContent==='Pagamento informado'");
   shot("pix-informado-1280");
   run("find", "role", "link", "click", "--name", "Voltar ao início", "--exact");
   ready();
   check("payment updates related home state", "document.body.innerText.includes('Nenhum pagamento pendente')");
   // Separate test scenarios, persisted solely in this isolated browser profile.
   ev("localStorage.removeItem('anchieta-cx-demo-v1')");
   run("set", "viewport", "390", "844");
   open("/inicio");
   click("Alternar menu de navegação");
   run("wait", "--fn", "!!document.querySelector('.replica-mobile-menu')");
   shot("menu-390");
   check(
      "mobile menu retains six groups and card",
      "document.querySelectorAll('.replica-mobile-menu ul[aria-label=\"Destinos principais\"] a').length===6&&!!document.querySelector('.replica-mobile-menu .cx-sidebar-card')",
   );
   report.audits.push({ name: "mobile-menu", ...JSON.parse(run("a11y", "--json")).data });
   click("Fechar menu");
   click("Abrir chat da Ana");
   run("wait", "--fn", "!!document.querySelector('.replica-ana-dialog')");
   shot("ana-390");
   check(
      "Ana remains only a floating sphere",
      "!document.querySelector('.replica-assistance-space')&&!!document.querySelector('.replica-ana-dialog')",
   );
   open("/inicio");
   ev(
      "const s=JSON.parse(localStorage.getItem('anchieta-cx-demo-v1'));s.theme='dark';s.scenario='dp';localStorage.setItem('anchieta-cx-demo-v1',JSON.stringify(s))",
   );
   open("/inicio");
   shot("inicio-escuro-390");
   report.audits.push({ name: "home-dark", ...JSON.parse(run("a11y", "--json")).data });
   open("/jornada-academica#disciplinas-regularizar");
   check(
      "DP and adaptation keep enrollment links",
      `document.querySelectorAll('#disciplinas-regularizar a[href*="matricula_dp_adap"]').length>=2`,
   );
   shot("jornada-dp-390");
   ev(
      "const s=JSON.parse(localStorage.getItem('anchieta-cx-demo-v1'));s.theme='light';s.reducedMotion=true;s.largeText=true;localStorage.setItem('anchieta-cx-demo-v1',JSON.stringify(s))",
   );
   open("/inicio");
   shot("inicio-texto-maior-390");
   check("large text keeps document inside viewport", "document.documentElement.scrollWidth<=innerWidth+1");
   open("/financeiro/pix?cobranca=missing");
   check("invalid charge offers recovery", `!!document.querySelector('.student-empty a[href="/financeiro"]')`);
   open("/calendario-academico");
   click("Mês seguinte");
   check("calendar month changes", "document.querySelector('.student-month-controls h2').textContent.includes('novembro')");
   ev("localStorage.removeItem('anchieta-cx-demo-v1')");
   open("/inicio");
   check("mobile requests no MP4", "performance.getEntriesByType('resource').every(r=>!r.name.endsWith('.mp4'))");
} finally {
   fs.writeFileSync(path.join(root, "docs/refinement-flows-v5.json"), JSON.stringify(report, null, 2));
   console.log(
      JSON.stringify({
         checks: report.checks.length,
         failed: report.checks.filter(c => !c.passed),
         audits: report.audits.map(a => ({ name: a.name, violations: a.counts.violations })),
      }),
   );
}
if (report.checks.some(c => !c.passed) || report.audits.some(a => a.counts.violations)) process.exitCode = 1;
