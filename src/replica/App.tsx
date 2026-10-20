import { lazy, Suspense, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { Dialog } from "radix-ui";
import { ArrowRight, Check, ChevronDown, ExternalLink, HelpCircle, LogOut, Menu, Moon, Search, Settings2, Sun, X } from "lucide-react";
import { Toaster, toast } from "sonner";
import { DemoProvider, useDemo } from "../cx/state";
import { disciplines, external, normalize } from "../cx/data";
import OverlayView, { type Overlay } from "./Dialogs";
import { prepareMonth } from "./calendar";
import { aliases, docNames, escapeHtml, loadScreen, navigationHtml, preparePage, reference, routePath, titleFor } from "./reference";
import { sectionFor, studentRoutes } from "./student/model";
import { SectionNavigation } from "./student/Navigation";
import "./original.css";
import "./replica.css";
import "./student/student.css";
const StudentPage = lazy(() => import("./student/StudentPage"));

export default function App() {
   return (
      <BrowserRouter>
         <DemoProvider>
            <Replica />
         </DemoProvider>
      </BrowserRouter>
   );
}
const ReferenceContent = memo(function ReferenceContent({ html }: { html: string }) {
   return <div className="replica-reference-content" dangerouslySetInnerHTML={{ __html: html }} />;
});
function Replica() {
   const { state, update } = useDemo();
   const location = useLocation();
   const nav = useNavigate();
   const [host, setHost] = useState<HTMLDivElement | null>(null);
   const [connected, setConnected] = useState(() => localStorage.getItem("anchieta-navigation-v3") !== "original");
   const [collapsed, setCollapsed] = useState(false);
   const [menu, setMenu] = useState(false);
   const [account, setAccount] = useState(false);
   const [overlay, setOverlay] = useState<Overlay | null>(null);
   const [period, setPeriod] = useState(2);
   const [calendarMonth, setCalendarMonth] = useState(false);
   const [calendarDay, setCalendarDay] = useState(1);
   const [monthOffset, setMonthOffset] = useState(0);
   const [monthDay, setMonthDay] = useState(20);
   const [stage, setStage] = useState("Estágio");
   const [loaded, setLoaded] = useState({ name: "", html: "" });
   const [loadError, setLoadError] = useState(false);
   const contentRef = useRef<HTMLDivElement>(null);
   const scrollPositions = useRef(new Map<string, number>());
   const closeTimer = useRef<number | undefined>(undefined);
   const rawPath = routePath(location.pathname);
   const routedOverlay: Overlay | null = rawPath.startsWith("/solicitacao-servicos/solicitar/")
      ? { kind: "service", code: rawPath.split("/").pop() }
      : rawPath === "/solicitacao-servicos/solicitar"
        ? { kind: "catalog", detail: new URLSearchParams(location.search).get("busca") || "" }
        : rawPath === "/financeiro/alteracao-vencimento"
          ? { kind: "due" }
          : rawPath === "/financeiro/alteracao-responsavel"
            ? { kind: "responsible" }
            : rawPath.endsWith("/carteirinha")
              ? { kind: "card" }
              : null;
   const page = routedOverlay
      ? rawPath.includes("/financeiro/")
         ? "/financeiro"
         : rawPath.endsWith("/carteirinha")
           ? "/perfil/visao-geral"
           : "/solicitacao-servicos"
      : rawPath;
   const title = titleFor(page);
   const customStudentPage = studentRoutes.has(page) || (connected && ["/inicio", "/financeiro"].includes(page));
   const bindHost = useCallback((node: HTMLDivElement | null) => {
      if (node && !node.dataset.replicaMounted) {
         node.innerHTML = reference.shell;
         const sidebar = node.querySelector("[data-slot=sidebar]");
         sidebar?.setAttribute("role", "complementary");
         sidebar?.setAttribute("aria-label", "Menu do Aluno Online");
         const rail = node.querySelector("[role=separator]");
         rail?.setAttribute("aria-valuemin", "224");
         rail?.setAttribute("aria-valuemax", "400");
         node.dataset.replicaMounted = "true";
      }
      setHost(node);
   }, []);
   const sourceNav = useMemo(() => navigationHtml(connected), [connected]);
   const variant =
      page === "/jornada-academica"
         ? "jornada-" + period
         : page === "/horarios"
           ? calendarMonth
              ? "horarios-mes-dia-" + new Date(2026, 9 + monthOffset, monthDay).getDay()
              : "horarios-dia-" + calendarDay
           : page.includes("agendamento-laboratorios") && stage.includes("Minhas")
             ? "laboratorios-minhas"
             : page.includes("agendamento-laboratorios") && stage.includes("Confirmação")
               ? "laboratorios-confirmacao"
               : page.includes("agendamento-laboratorios") && stage.includes("Calendário")
                 ? "laboratorios-calendario"
                 : page.includes("compensacao-faltas") && stage.includes("Minhas")
                   ? "compensacao-minhas"
                   : page === "/meu-estagio" && stage.includes("TCC")
                     ? "estagio-tcc"
                     : undefined;
   const screenName = customStudentPage
      ? undefined
      : (variant && reference.variants[variant]?.name) || reference.pages[page === "/financeiro/extrato" ? "/financeiro" : page]?.name;
   const source = loaded.name === screenName ? loaded.html : undefined;
   const pageHTML = useMemo(() => {
      if (!source) return "";
      const html = preparePage(page, source, connected, state, period);
      return page === "/horarios" && calendarMonth ? prepareMonth(html, monthOffset, monthDay) : html;
   }, [page, source, connected, state, period, calendarMonth, monthOffset, monthDay]);
   const go = useCallback(
      (path: string) => {
         if (/^https?:/.test(path)) {
            window.open(path, "_blank", "noopener,noreferrer");
            return;
         }
         setOverlay(null);
         setMenu(false);
         setAccount(false);
         const scroller = host?.querySelector("[data-replica-scroll]");
         if (scroller) scrollPositions.current.set(page, scroller.scrollTop);
         nav(routePath(path));
      },
      [host, page, nav],
   );
   const close = () => {
      if (closeTimer.current) return;
      document.querySelectorAll(".replica-overlay,[role=dialog]").forEach(el => el.classList.add("replica-closing"));
      const duration =
         overlay?.kind === "search" || state.reducedMotion || matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 200;
      closeTimer.current = window.setTimeout(() => {
         closeTimer.current = undefined;
         setOverlay(null);
         if (routedOverlay) go(page);
      }, duration);
   };
   useEffect(() => () => window.clearTimeout(closeTimer.current), []);
   useEffect(() => {
      if (aliases[location.pathname] && location.pathname !== rawPath) nav(rawPath, { replace: true });
   }, [location.pathname, rawPath, nav]);
   useEffect(() => {
      document.title = title + " | Aluno Online Anchieta · Demonstração";
   }, [title]);
   useEffect(() => {
      setStage("Estágio");
   }, [page]);
   useEffect(() => {
      if (!screenName) return;
      let stale = false;
      setLoadError(false);
      loadScreen(screenName)
         .then(html => {
            if (!stale) setLoaded({ name: screenName, html });
         })
         .catch(() => {
            if (!stale) setLoadError(true);
         });
      return () => {
         stale = true;
      };
   }, [screenName]);
   useEffect(() => {
      localStorage.setItem("anchieta-navigation-v3", connected ? "connected" : "original");
   }, [connected]);
   useLayoutEffect(() => {
      if (!host) return;
      const navEl = host.querySelector('nav[aria-label="Navegação principal"]');
      if (navEl) navEl.innerHTML = sourceNav;
      host.classList.toggle("replica-student-mode", connected);
   }, [host, sourceNav, connected]);
   useLayoutEffect(() => {
      if (!host) return;
      host.classList.toggle("replica-collapsed", collapsed);
      const sidebar = host.querySelector<HTMLElement>("[data-slot=sidebar]");
      sidebar?.setAttribute("data-state", collapsed ? "collapsed" : "expanded");
      sidebar?.setAttribute("data-collapsible", collapsed ? "icon" : "");
      const shell = host.querySelector<HTMLElement>("[data-slot=sidebar-wrapper]");
      shell?.style.setProperty("--sidebar-width", collapsed ? "48px" : "272px");
      host
         .querySelectorAll<HTMLElement>("[data-slot=sidebar-container],[data-slot=sidebar-gap]")
         .forEach(e => (e.style.width = collapsed ? "48px" : "272px"));
   }, [collapsed, host]);
   useLayoutEffect(() => {
      if (!host) return;
      const main = host.querySelector<HTMLElement>("#conteudo-principal");
      const scroll = main?.parentElement?.parentElement;
      scroll?.setAttribute("data-replica-scroll", "true");
      const crumbs = host.querySelector("[aria-label=breadcrumb] ol");
      if (crumbs) {
         if (!connected && reference.pages[page]?.crumbs) crumbs.innerHTML = reference.pages[page].crumbs;
         else {
            crumbs.innerHTML = '<li><a href="/inicio">Início</a></li>';
            if (page !== "/inicio") {
               const sep = document.createElement("li");
               sep.textContent = "›";
               sep.setAttribute("aria-hidden", "true");
               crumbs.append(sep);
               const group = connected
                  ? sectionFor(page)
                  : page.startsWith("/perfil/") && !page.includes("notas") && !page.includes("horas") && !page.includes("colacao")
                    ? { label: "Meus dados", href: "/perfil/visao-geral" }
                    : page.includes("solicitacao") || page === "/contratos" || page.includes("colacao")
                      ? { label: "Secretaria virtual", href: "/secretaria-virtual" }
                      : null;
               if (group && group.href !== page) {
                  const li = document.createElement("li");
                  const a = document.createElement("a");
                  a.href = group.href;
                  a.textContent = group.label;
                  li.append(a);
                  crumbs.append(li);
                  const sep2 = document.createElement("li");
                  sep2.textContent = "›";
                  sep2.setAttribute("aria-hidden", "true");
                  crumbs.append(sep2);
               }
               const item = document.createElement("li");
               item.textContent = title;
               item.setAttribute("aria-current", "page");
               crumbs.append(item);
            }
         }
         crumbs.querySelectorAll(":scope > li[role=presentation]").forEach(li => li.removeAttribute("role"));
      }
      host.querySelectorAll('nav[aria-label="Navegação principal"] a').forEach(a => {
         const href = a.getAttribute("href");
         const active =
            href === (connected ? sectionFor(page)?.href : page) ||
            (!connected && page.startsWith("/notificacoes/") && href === "/notificacoes");
         a.classList.remove("bg-canvas!", "text-primary!", "shadow-xs", "hover:bg-canvas!", "hover:text-primary!");
         a.querySelectorAll(":scope > span.absolute").forEach(el => el.remove());
         if (href === "/inicio")
            a.querySelector(":scope > span[aria-hidden=true]")?.classList.replace("text-primary", "text-muted-foreground");
         a.setAttribute("data-active", String(active));
         a.classList.toggle("replica-active", active);
         if (active) a.setAttribute("aria-current", "page");
         else a.removeAttribute("aria-current");
      });
      const profile = Array.from(host.querySelectorAll("header button")).find(b => b.textContent?.includes("RA:"));
      const notices = host.querySelector<HTMLAnchorElement>('header a[aria-label="Avisos"]');
      if (notices) notices.href = connected ? "/comunicados" : "/notificacoes";
      if (profile) {
         profile.setAttribute("aria-label", "Abrir menu da conta e opções da demonstração");
         profile.setAttribute("data-account", "true");
      }
      host.querySelectorAll("button").forEach(b => {
         if (b.textContent?.includes("O que achou dessa experiência?")) b.remove();
      });
   }, [host, page, title, sourceNav, connected]);
   useLayoutEffect(() => {
      if (!host) return;
      const theme = host.querySelector('button[aria-label="Alternar tema"]');
      if (theme) {
         theme.setAttribute("aria-pressed", String(state.theme === "dark"));
         theme.innerHTML =
            state.theme === "dark"
               ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20.9 13a9 9 0 0 1-9.9-9.9 9 9 0 1 0 9.9 9.9Z"/></svg>'
               : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>';
      }
   }, [host, state.theme]);
   useLayoutEffect(() => {
      const scroller = host?.querySelector("[data-replica-scroll]");
      if (!scroller) return;
      scroller.scrollTop = location.hash ? scroller.scrollTop : scrollPositions.current.get(page) || 0;
      if (location.hash) requestAnimationFrame(() => host?.querySelector(location.hash)?.scrollIntoView({ block: "start" }));
      if (!state.reducedMotion && !matchMedia("(prefers-reduced-motion: reduce)").matches && contentRef.current)
         contentRef.current.animate(
            [
               { opacity: 0.65, transform: "translateY(6px)" },
               { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 200, easing: "cubic-bezier(.23,1,.32,1)" },
         );
   }, [page, host, location.hash, state.reducedMotion, loaded.name]);
   useLayoutEffect(() => {
      const tabs = contentRef.current?.querySelector<HTMLElement>('nav[aria-label="Seções do perfil"]');
      const active = tabs?.querySelector<HTMLElement>("[aria-current=page]");
      if (!tabs || !active) return;
      const reveal = () => {
         if (tabs.scrollWidth <= tabs.clientWidth) return;
         const bounds = tabs.getBoundingClientRect(),
            selected = active.getBoundingClientRect();
         tabs.style.scrollBehavior = "auto";
         tabs.scrollLeft += selected.left - bounds.left - (tabs.clientWidth - selected.width) / 2;
         tabs.setAttribute("data-fade-start", String(tabs.scrollLeft > 2));
         tabs.setAttribute("data-fade-end", String(tabs.scrollLeft + tabs.clientWidth < tabs.scrollWidth - 2));
         requestAnimationFrame(() => tabs.style.removeProperty("scroll-behavior"));
      };
      reveal();
      const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(reveal) : null;
      observer?.observe(tabs);
      return () => observer?.disconnect();
   }, [pageHTML]);
   useLayoutEffect(() => {
      const id = new URLSearchParams(location.search).get("disciplina");
      if (!id || !connected) return;
      const unit = disciplines.find(d => d.id === id);
      if (!unit) return;
      const heading = Array.from(contentRef.current?.querySelectorAll("h3,h4") || []).find(
         h => normalize(h.textContent || "") === normalize(unit.name),
      );
      const row = heading?.closest("li,article");
      if (row) {
         row.classList.add("student-highlighted-unit");
         const scroller = host?.querySelector<HTMLElement>("[data-replica-scroll]");
         if (scroller) {
            scroller.scrollTop +=
               row.getBoundingClientRect().top -
               scroller.getBoundingClientRect().top -
               Math.max(24, (scroller.clientHeight - row.getBoundingClientRect().height) / 2);
         }
      }
   }, [loaded.name, location.search, connected, host]);
   useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
         if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            setOverlay(v => (v?.kind === "search" ? null : { kind: "search" }));
         }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
   }, []);
   useEffect(() => {
      if (!connected || !host) return;
      let frame = 0;
      const revealFocus = (event: FocusEvent) => {
         const target = event.target;
         if (!(target instanceof HTMLElement)) return;
         const scroller = target.closest<HTMLElement>("[data-replica-scroll]");
         if (!scroller) return;
         cancelAnimationFrame(frame);
         frame = requestAnimationFrame(() => {
            const avatar = document.querySelector<HTMLElement>(".replica-ana-launcher");
            if (!avatar || getComputedStyle(avatar).visibility === "hidden") return;
            const a = avatar.getBoundingClientRect(),
               t = target.getBoundingClientRect();
            if (t.right > a.left - 12 && t.left < a.right && t.bottom > a.top - 12 && t.top < a.bottom) {
               scroller.scrollTop += t.bottom - a.top + 12;
            }
         });
      };
      host.addEventListener("focusin", revealFocus);
      return () => {
         host.removeEventListener("focusin", revealFocus);
         cancelAnimationFrame(frame);
      };
   }, [connected, host]);
   const activeOverlay = overlay || routedOverlay;
   const currentContentHost = host?.querySelector("#conteudo-principal");
   function handleClick(event: MouseEvent<HTMLElement>) {
      if ((event.target as HTMLElement).closest("[data-student-ui]")) return;
      const target = (event.target as HTMLElement).closest<HTMLElement>("a,button,[role=radio],[role=tab]");
      if (!target) return;
      const text = target.textContent?.trim() || "";
      const label = target.getAttribute("aria-label") || "";
      if (target instanceof HTMLAnchorElement) {
         if (target.dataset.demoDocument || target.hash === "#documento-demonstrativo") {
            event.preventDefault();
            setOverlay({ kind: "download", title: text || "Documento acadêmico" });
            return;
         }
         const href = target.getAttribute("href") || "";
         if (href.startsWith("#")) return;
         const url = new URL(target.href);
         if (url.origin === window.location.origin) {
            event.preventDefault();
            go(url.pathname + url.search + url.hash);
         }
         return;
      }
      if (target.hasAttribute("disabled")) return;
      if (target.getAttribute("role") === "switch") {
         const checked = target.getAttribute("aria-checked") !== "true";
         target.setAttribute("aria-checked", String(checked));
         target.setAttribute("data-state", checked ? "checked" : "unchecked");
         target.querySelector("[data-slot=switch-thumb]")?.setAttribute("data-state", checked ? "checked" : "unchecked");
         return;
      }
      if (target.matches("[data-slot=sidebar-trigger]") || label === "Alternar menu de navegação") {
         if (innerWidth < 768) setMenu(true);
         else setCollapsed(v => !v);
         return;
      }
      if (label === "Alternar tema") {
         update(s => ({ ...s, theme: s.theme === "light" ? "dark" : "light" }));
         return;
      }
      if (label === "Buscar menus" || text.includes("Buscar menus, páginas")) {
         setMenu(false);
         setOverlay({ kind: "search" });
         return;
      }
      if (target.dataset.account === "true" || (target.closest("header") && text.includes("RA:"))) {
         setAccount(v => !v);
         return;
      }
      if (label === "Sair" || text === "Sair") {
         go("/entrar");
         return;
      }
      if (target.hasAttribute("data-nav-group") || target.closest('nav[aria-label="Navegação principal"]')) {
         const ul = target.nextElementSibling;
         if (ul) {
            const open = target.getAttribute("aria-expanded") !== "false";
            target.setAttribute("aria-expanded", String(!open));
            (ul as HTMLElement).hidden = open;
            target.parentElement?.setAttribute("data-state", open ? "closed" : "open");
         }
         return;
      }
      if (target.hasAttribute("data-copy")) {
         navigator.clipboard?.writeText(target.dataset.copy || "").then(() => toast.success("Protocolo de demonstração copiado"));
         return;
      }
      if (target.hasAttribute("data-select-subjects")) {
         const field = contentRef.current?.querySelector<HTMLInputElement>("[data-subject-selection]");
         setOverlay({
            kind: "subjects",
            selectedSubjects: field?.value ? field.value.split(" | ") : [],
            onSubjects: items => {
               if (!target.isConnected) return;
               const input = field || document.createElement("input");
               input.type = "hidden";
               input.dataset.subjectSelection = "true";
               input.value = items.join(" | ");
               if (!field) target.after(input);
               target.textContent = `${items.length} disciplina${items.length === 1 ? "" : "s"} selecionada${items.length === 1 ? "" : "s"}`;
               const heading = Array.from(contentRef.current?.querySelectorAll("h2,h3,p") || []).find(
                  e => e.textContent === "Disciplinas selecionadas",
               );
               const empty = Array.from(contentRef.current?.querySelectorAll("p,span,div") || []).find(
                  e => e.textContent === "Nenhuma disciplina selecionada",
               );
               if (empty) empty.textContent = items.join(" · ");
               else if (heading) {
                  const p = document.createElement("p");
                  p.className = "replica-selected-subjects";
                  p.textContent = items.join(" · ");
                  heading.after(p);
               }
               setOverlay(null);
            },
         });
         return;
      }
      if (target.dataset.localRequest) {
         setOverlay({ kind: "request", id: target.dataset.localRequest });
         return;
      }
      if (target.dataset.payDemo) {
         const id = target.dataset.payDemo;
         if (id === "DEMO-MENSALIDADE") update(s => ({ ...s, scenario: "base" }));
         else update(s => ({ ...s, requests: s.requests.map(r => (r.id === id ? { ...r, status: "Em análise" } : r)) }));
         toast.success("Pagamento confirmado somente na demonstração");
         return;
      }
      if (text === "Notas e faltas") {
         const card = target.closest("[data-slot=carousel-item],li,article");
         const unit = card?.querySelector("h3,h4")?.textContent;
         setOverlay({ kind: "grades", title: unit || "Bases da Administração Moderna" });
         return;
      }
      const doc = docNames.findIndex(n => text.startsWith(n));
      if (doc >= 0 && page === "/perfil/documentos") {
         setOverlay({ kind: "document", index: doc });
         return;
      }
      if (page === "/jornada-academica" && /^\dº período/i.test(label)) {
         setPeriod(Number(label[0]));
         return;
      }
      if (page === "/jornada-academica" && label.includes("histórico")) {
         if (connected) go("/solicitacao-servicos/solicitar/CSA_048_A");
         else setOverlay({ kind: "download", title: "Histórico Simples" });
         return;
      }
      if (page === "/jornada-academica" && label.includes("ementa")) {
         if (connected) go("/solicitacao-servicos/solicitar/CSA_042");
         else setOverlay({ kind: "download", title: "Conteúdo Programático / Ementa / Plano de Ensino" });
         return;
      }
      if (
         text === "Next slide" ||
         text === "Previous slide" ||
         label.includes("próximos períodos") ||
         label.includes("períodos anteriores")
      ) {
         const carousel = target.closest("[data-slot=carousel]") || target.parentElement?.parentElement;
         const viewport = carousel?.querySelector(".replica-carousel");
         if (viewport) {
            viewport.scrollBy({
               left:
                  (text === "Previous slide" || label.includes("anteriores") ? -1 : 1) *
                  (viewport.querySelector("[data-slot=carousel-item]")?.getBoundingClientRect().width || viewport.clientWidth * 0.8),
               behavior: state.reducedMotion ? "instant" : "smooth",
            });
            carousel?.querySelectorAll("button").forEach(b => b.removeAttribute("disabled"));
         }
         return;
      }
      if (page === "/horarios" && (text === "Semana" || text === "Mês")) {
         setCalendarMonth(text === "Mês");
         return;
      }
      if (
         page === "/horarios" &&
         (/^(Dia|Semana|Mês) (anterior|seguinte)|Voltar para hoje|Hoje$/.test(label) ||
            /semana anterior|próxima semana|mês anterior|próximo mês/i.test(label))
      ) {
         setMonthOffset(n => n + (label.includes("anterior") ? -1 : 1));
         setMonthDay(1);
         return;
      }
      if (target.dataset.monthDay) {
         setMonthDay(Number(target.dataset.monthDay));
         return;
      }
      if (label === "Abrir calendário") {
         const input = target.parentElement?.querySelector<HTMLInputElement>("input[type=date]");
         if (input) {
            input.focus();
            input.showPicker?.();
         }
         return;
      }
      if (text.includes("Nova solicitação") && target.getAttribute("role") !== "tab") {
         go("/solicitacao-servicos/solicitar");
         return;
      }
      if (label.startsWith("Detalhes da solicitação")) {
         const card = target.closest("li,article");
         setOverlay({
            kind: "request",
            id: label.split(" ").pop(),
            title: card?.querySelector("h3")?.textContent || "Solicitação",
            detail: card?.textContent?.includes("Cancelado") ? "Cancelado" : "Concluído",
         });
         return;
      }
      if (text.includes("Prazos e retorno")) {
         setOverlay({ kind: "download", title: "Prazos e retorno dos serviços" });
         return;
      }
      if (text === "Mais pedidos") {
         go("/solicitacao-servicos/solicitar");
         return;
      }
      if (text.startsWith("Carregar mais")) {
         target.style.display = "none";
         toast.info("Todos os itens da demonstração já estão disponíveis. Use a busca para localizar.");
         return;
      }
      if (page.startsWith("/financeiro") && text.includes("CSV")) {
         exportStatement();
         return;
      }
      if (text.toLowerCase().includes("imprimir") || label.toLowerCase().includes("imprimir")) {
         window.print();
         return;
      }
      if (text.includes("Exportar mês")) {
         exportCalendar();
         return;
      }
      if (page.startsWith("/financeiro") && (text === "Meses anteriores" || text === "Próximos meses" || label === "Meses anteriores")) {
         const h = contentRef.current?.querySelector("h2");
         const heading = Array.from(contentRef.current?.querySelectorAll("h2") || []).find(h => h.textContent?.startsWith("Meses de"));
         if (heading) heading.textContent = text.includes("anteriores") ? "Meses de 2025" : "Meses de 2026";
         void h;
         return;
      }
      if (target.getAttribute("role") === "radio" || target.getAttribute("role") === "tab") {
         target.parentElement?.querySelectorAll("[role=radio],[role=tab]").forEach(e => {
            e.setAttribute("aria-checked", String(e === target));
            e.setAttribute("aria-selected", String(e === target));
            e.setAttribute("data-state", e === target ? "active" : "inactive");
         });
         if (page === "/horarios" && target.getAttribute("role") === "tab") {
            const i = Array.from(target.parentElement?.querySelectorAll("[role=tab]") || []).indexOf(target);
            if (i >= 0) setCalendarDay(i);
            return;
         }
         if (page === "/meu-estagio" || page.includes("agendamento-laboratorios") || page.includes("compensacao-faltas")) {
            setStage(text);
            return;
         }
         filterLocalRows(text);
         return;
      }
      if (text.includes("Avaliar aula") || text.includes("Editar avaliação")) {
         setOverlay({ kind: "rating", title: "Bases da Administração Moderna" });
         return;
      }
      if (target.dataset.editProfile || label.includes("foto de perfil")) {
         setOverlay({ kind: "profile", title: target.dataset.editProfile || "Foto e dados do perfil" });
         return;
      }
      if (target.getAttribute("data-slot") === "accordion-trigger") {
         toggleProfileAccordion(target, state.profile);
         return;
      }
      if (page === "/perfil/horas-complementares" && text.length > 30) {
         setOverlay({ kind: "source", id: "horas-detalhe", title: text.split("2026/")[0] });
         return;
      }
      if (page === "/perfil/certificados" && text.startsWith("Certificado")) {
         setOverlay({ kind: "source", id: "certificado-detalhe" });
         return;
      }
      if (text === "Regras do curso") {
         setOverlay({ kind: "source", id: "estagio-regras" });
         return;
      }
      if (text.startsWith("Vale para")) {
         setOverlay({
            kind: "info",
            title: "Disciplinas contempladas",
            detail: "Confira a frequência das disciplinas do semestre. Os exemplos abaixo não substituem a análise acadêmica.",
         });
         return;
      }
      if (text === "Regras") {
         setOverlay({ kind: "rules" });
         return;
      }
      if (label.includes("Aviso Importante") || text.includes("Regras da compensação") || text.includes("Aviso importante")) {
         setOverlay({ kind: "rules" });
         return;
      }
      if (
         text === "Verificar Datas" ||
         text === "Confirmar solicitação" ||
         text === "Revisar e enviar" ||
         text.includes("Solicitar Compensação") ||
         text.includes("Cadastrar relatório") ||
         text.includes("Novo relatório")
      ) {
         const form = target.closest("form");
         if (form && !form.reportValidity()) return;
         if (page.includes("dispensa") && !contentRef.current?.querySelector<HTMLInputElement>("[data-subject-selection]")?.value) {
            toast.error("Selecione as disciplinas para solicitar dispensa.");
            return;
         }
         const inputs = Array.from(
            (form || contentRef.current)?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
               "input,select,textarea",
            ) || [],
         ).filter(i => !i.disabled && i.type !== "hidden" && i.type !== "checkbox");
         const fields = inputs.map(i => ({
            label:
               i.getAttribute("aria-label") ||
               i.closest("label")?.textContent ||
               contentRef.current?.querySelector(`label[for="${i.id}"]`)?.textContent ||
               i.name ||
               "Informação",
            value:
               i instanceof HTMLInputElement && i.type === "file"
                  ? i.files?.[0]?.name || "Sem anexo"
                  : i instanceof HTMLSelectElement
                    ? i.selectedOptions[0]?.textContent || ""
                    : i.value,
         }));
         const selection = contentRef.current?.querySelector<HTMLInputElement>("[data-subject-selection]")?.value;
         if (selection) fields.unshift({ label: "Disciplinas selecionadas", value: selection });
         setOverlay({
            kind: "form",
            fields,
            title: page.includes("laboratorios")
               ? "Agendamento de laboratório"
               : page.includes("dispensa")
                 ? "Dispensa de disciplinas"
                 : page.includes("compensacao")
                   ? "Compensação de faltas"
                   : "Relatório de estágio",
         });
         return;
      }
      if (
         text.includes("Criar um Agendamento") ||
         text.includes("Minhas Solicitações") ||
         text.includes("Confirmação de Uso") ||
         text.includes("Calendário de Agendamentos")
      ) {
         setStage(text);
         return;
      }
      if (text === "Limpar filtros") {
         contentRef.current?.querySelectorAll<HTMLElement>("li[hidden]").forEach(e => (e.hidden = false));
         contentRef.current?.querySelectorAll<HTMLInputElement>("input[type=search]").forEach(e => (e.value = ""));
         return;
      }
      if (text === "Mais recentes" || text === "Mais antigos" || text === "Recentes" || text === "Antigos") {
         target.textContent =
            text === "Mais recentes" ? "Mais antigos" : text === "Recentes" ? "Antigos" : text === "Antigos" ? "Recentes" : "Mais recentes";
         contentRef.current?.querySelectorAll("ul").forEach(ul => {
            const items = Array.from(ul.children);
            if (items.some(li => li.querySelector("h3")) || page === "/notificacoes") items.reverse().forEach(li => ul.append(li));
         });
         return;
      }
      if (text.includes("Baixar") || text.includes("Visualizar") || text.includes("Ver documento") || text.includes("Abrir contrato")) {
         setOverlay({ kind: "download", title: target.closest("li,article")?.querySelector("h3")?.textContent || text });
         return;
      }
      if (
         text.includes("Selecionar arquivo") ||
         text.includes("Selecione o arquivo") ||
         text.includes("Escolher arquivo") ||
         text.includes("Toque para anexar")
      ) {
         const file =
            target.parentElement?.querySelector<HTMLInputElement>("input[type=file]") ||
            contentRef.current?.querySelector<HTMLInputElement>("input[type=file]");
         if (file) {
            file.dataset.replicaFilenameTarget = "true";
            file.click();
         }
         return;
      }
      if (page.includes("compensacao") && /^(Atestado médico|Certidão de)/.test(text)) {
         target.parentElement?.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b === target)));
         toast.info("Tipo de documento selecionado: " + text);
         return;
      }
      if (text === "Cancelar") {
         go("/solicitacao-servicos");
         return;
      }
      if (target.getAttribute("aria-haspopup") || target.getAttribute("aria-expanded") === "false") {
         const node = target.closest("li,article");
         setOverlay({ kind: "download", title: node?.querySelector("h3")?.textContent || text || label || "Detalhes" });
         return;
      }
   }
   function filterLocalRows(text: string) {
      if (!page.startsWith("/financeiro")) return;
      const cutoff = text === "30 dias" ? "OUTUBRO" : text === "90 dias" ? "AGOSTO" : "";
      contentRef.current?.querySelectorAll<HTMLElement>("[aria-labelledby^=extrato-]").forEach((el, i) => {
         el.hidden = !!cutoff && (text === "30 dias" ? i > 2 : i > 4);
      });
   }
   function onInput(e: React.FormEvent<HTMLDivElement>) {
      if ((e.target as HTMLElement).closest("[data-student-ui]")) return;
      const input = e.target as HTMLInputElement;
      if (!input.matches("input[type=search],[data-page-search]")) return;
      const q = normalize(input.value);
      contentRef.current?.querySelectorAll<HTMLElement>("li").forEach(li => {
         if (li.querySelector("h3") || page === "/notificacoes") {
            li.hidden = !!q && !normalize(li.textContent || "").includes(q);
         }
      });
   }
   const onChange = useCallback((e: Event) => {
      const target = e.target;
      if (target instanceof HTMLInputElement && target.type === "file") {
         const file = target.files?.[0];
         if (file) {
            const button = target.parentElement?.querySelector("button");
            if (button) {
               const label = button.querySelector("span,p,strong") || button;
               label.textContent = file.name;
            }
            toast.success("Arquivo selecionado localmente. Nenhum envio foi realizado.");
         }
         return;
      }
      if (!(target instanceof HTMLSelectElement)) return;
      if (target.id === "lab-local") {
         const resource = contentRef.current?.querySelector<HTMLSelectElement>("#lab-recurso");
         if (resource) resource.disabled = !target.value;
      }
      if (target.id === "lab-recurso") {
         contentRef.current
            ?.querySelectorAll<HTMLInputElement>("#lab-data,#lab-inicio,#lab-fim")
            .forEach(x => (x.disabled = !target.value));
      }
      if (target.getAttribute("aria-label")?.toLowerCase().includes("situaç")) {
         const text = target.selectedOptions[0].textContent || "";
         contentRef.current?.querySelectorAll<HTMLElement>("li").forEach(li => {
            if (li.querySelector("h3")) li.hidden = text !== "Todas" && !normalize(li.textContent || "").includes(normalize(text));
         });
      }
   }, []);
   useEffect(() => {
      const element = contentRef.current;
      if (!element) return;
      const change = (event: Event) => {
         if ((event.target as HTMLElement).closest(".replica-reference-content")) onChange(event);
      };
      element.addEventListener("change", change);
      return () => element.removeEventListener("change", change);
   }, [host, onChange]);
   const content = (
      <div ref={contentRef} className="replica-page" onClick={handleClick} onInput={onInput} onSubmit={e => e.preventDefault()}>
         {customStudentPage ? (
            <Suspense
               fallback={
                  <div className="replica-loading" role="status">
                     <span>Carregando sua área…</span>
                     <div />
                  </div>
               }
            >
               <StudentPage path={page} showOverlay={setOverlay} />
            </Suspense>
         ) : source ? (
            <>
               {connected && <SectionNavigation path={page} />}
               <ReferenceContent html={pageHTML} />
            </>
         ) : screenName ? (
            <div className="replica-loading" aria-live="polite">
               {loadError ? (
                  <>
                     <h1>Não conseguimos abrir esta tela</h1>
                     <p>Recarregue para tentar novamente.</p>
                     <button className="replica-button" onClick={() => window.location.reload()}>
                        Tentar novamente
                     </button>
                  </>
               ) : (
                  <>
                     <span className="sr-only">Carregando conteúdo</span>
                     <div />
                     <div />
                     <div />
                  </>
               )}
            </div>
         ) : page === "/secretaria-virtual" ? (
            <Secretariat go={go} />
         ) : page === "/preferencias" ? (
            <Preferences connected={connected} setConnected={setConnected} />
         ) : page === "/ajuda" ? (
            <Help go={go} />
         ) : page === "/entrar" ? (
            <DemoEntrance go={go} />
         ) : (
            <div className="replica-empty">
               <h1>Página não encontrada</h1>
               <button className="replica-button" onClick={() => go("/inicio")}>
                  Voltar ao início
               </button>
            </div>
         )}
         <footer className="replica-footer">
            <span>Demonstração local · Dados fictícios · Sem conexão com o portal real</span>
            <button onClick={() => setAccount(true)}>
               {connected ? "Navegação conectada" : "Navegação original"} <ChevronDown size={13} />
            </button>
            <button onClick={() => go("/ajuda")}>Preciso de ajuda</button>
         </footer>
      </div>
   );
   return (
      <>
         <div
            className="replica-shell"
            ref={bindHost}
            onClick={handleClick}
            onPointerDown={e => {
               const t = (e.target as HTMLElement).closest("[role=separator]");
               if (!t || innerWidth < 768) return;
               const move = (p: PointerEvent) => {
                  const width = Math.min(400, Math.max(224, p.clientX));
                  host
                     ?.querySelectorAll<HTMLElement>("[data-slot=sidebar-gap],[data-slot=sidebar-container]")
                     .forEach(x => (x.style.width = width + "px"));
                  host?.querySelector<HTMLElement>("[data-slot=sidebar-wrapper]")?.style.setProperty("--sidebar-width", width + "px");
                  t.setAttribute("aria-valuenow", String(width));
               };
               const stop = () => {
                  window.removeEventListener("pointermove", move);
                  window.removeEventListener("pointerup", stop);
               };
               window.addEventListener("pointermove", move);
               window.addEventListener("pointerup", stop);
            }}
         />
         {currentContentHost && createPortal(content, currentContentHost)}
         <button className="replica-ana-launcher" aria-label="Abrir chat da Ana" onClick={() => setOverlay({ kind: "chat" })}>
            <img src="/replica/ana.webp" alt="" />
         </button>
         {menu && <MobileMenu html={sourceNav} close={() => setMenu(false)} onClick={handleClick} />}
         {account && <Account close={() => setAccount(false)} connected={connected} setConnected={setConnected} go={go} />}
         {activeOverlay && (
            <OverlayView
               key={activeOverlay.kind + (activeOverlay.code || "") + (activeOverlay.index || 0)}
               overlay={activeOverlay}
               close={close}
               go={go}
               connected={connected}
            />
         )}
         <Toaster richColors position="top-center" closeButton />
      </>
   );
}
function MobileMenu({ html, close, onClick }: { html: string; close: () => void; onClick: (e: MouseEvent<HTMLElement>) => void }) {
   return (
      <Dialog.Root
         open
         onOpenChange={v => {
            if (!v) close();
         }}
      >
         <Dialog.Portal>
            <Dialog.Overlay className="replica-overlay" />
            <Dialog.Content aria-describedby={undefined} className="replica-mobile-menu">
               <Dialog.Title className="sr-only">Menu de navegação</Dialog.Title>
               <div className="replica-mobile-brand">
                  <img src="/replica/logo-grupo-anchieta-3x-BOFhQ5AB.webp" alt="Grupo Anchieta" />
                  <div className="replica-mobile-brand-actions">
                     <button aria-label="Buscar menus" className="replica-icon-button" onClick={onClick}>
                        <Search size={16} />
                     </button>
                     <Dialog.Close aria-label="Fechar menu" className="replica-icon-button">
                        <X size={20} />
                     </Dialog.Close>
                  </div>
               </div>
               <nav aria-label="Navegação principal" onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
function Account({
   close,
   connected,
   setConnected,
   go,
}: {
   close: () => void;
   connected: boolean;
   setConnected: (v: boolean) => void;
   go: (p: string) => void;
}) {
   const { state, update } = useDemo();
   return (
      <Dialog.Root
         open
         modal={false}
         onOpenChange={v => {
            if (!v) close();
         }}
      >
         <Dialog.Portal>
            <Dialog.Content aria-describedby={undefined} className="replica-account">
               <Dialog.Title>
                  {state.profile.name}
                  <small>RA 20260001 · Demonstração</small>
               </Dialog.Title>
               <Dialog.Close aria-label="Fechar opções" className="replica-close">
                  <X size={16} />
               </Dialog.Close>
               <div className="replica-navigation-compare">
                  <p>Comparar navegação</p>
                  <button
                     aria-pressed={!connected}
                     onClick={() => {
                        setConnected(false);
                        close();
                     }}
                  >
                     <span>
                        Original<small>Estrutura e visual do portal atual</small>
                     </span>
                     {!connected && <Check size={16} />}
                  </button>
                  <button
                     aria-pressed={connected}
                     onClick={() => {
                        setConnected(true);
                        close();
                     }}
                  >
                     <span>
                        Conectada<small>Mesma identidade, áreas interligadas</small>
                     </span>
                     {connected && <Check size={16} />}
                  </button>
               </div>
               <button onClick={() => go("/perfil/visao-geral")}>
                  <Menu size={16} />
                  Meus dados
               </button>
               <button onClick={() => go("/preferencias")}>
                  <Settings2 size={16} />
                  Preferências e cenários
               </button>
               <button onClick={() => update(s => ({ ...s, theme: s.theme === "light" ? "dark" : "light" }))}>
                  {state.theme === "light" ? <Moon size={16} /> : <Sun size={16} />}Alternar tema
               </button>
               <button onClick={() => go("/ajuda")}>
                  <HelpCircle size={16} />
                  Ajuda e orientação
               </button>
               <button onClick={() => go("/entrar")}>
                  <LogOut size={16} />
                  Sair da demonstração
               </button>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
function Secretariat({ go }: { go: (p: string) => void }) {
   const { state } = useDemo();
   const areas = [
      [
         "Declarações e comprovantes",
         "Atestados, histórico, plano de ensino e outras declarações.",
         "/solicitacao-servicos/solicitar?busca=declara",
         "description",
      ],
      ["Minhas solicitações", "Veja o andamento e o retorno dos seus pedidos.", "/solicitacao-servicos", "assignment"],
      [
         "Tive um afastamento",
         "Compensação de faltas: confira as regras e solicite a análise.",
         "/solicitacao-servicos/compensacao-faltas",
         "person_add_disabled",
      ],
      [
         "Aproveitar disciplinas que já cursei",
         "Dispensa de disciplinas: solicite a análise dos seus estudos anteriores.",
         "/solicitacao-servicos/dispensa-disciplinas",
         "library_books",
      ],
      [
         "Reservar um laboratório",
         "Consulte os recursos e faça seu agendamento.",
         "/solicitacao-servicos/agendamento-laboratorios",
         "event_available",
      ],
      ["Meus contratos", "Consulte os documentos do seu vínculo acadêmico.", "/contratos", "document_scanner"],
      ["Formatura e colação de grau", "Acompanhe os requisitos para a conclusão do curso.", "/perfil/colacao-de-grau", "school"],
      ["Atendimento e orientação", "Encontre o caminho para resolver sua dúvida.", "/ajuda", "help"],
      ["Ouvidoria", "Acesse o canal institucional de ouvidoria.", external.ouvidoria, "forum"],
   ];
   return (
      <div className="replica-hub">
         <div className="replica-page-head">
            <h1>Secretaria virtual</h1>
            <p>Resolva o que precisa e acompanhe tudo pelo mesmo lugar.</p>
         </div>
         <div className="replica-hub-hero">
            <div>
               <h2>Como podemos ajudar?</h2>
               <p>Encontre serviços, envie uma solicitação e saiba onde acompanhar o retorno.</p>
               <button className="replica-button" onClick={() => go("/solicitacao-servicos/solicitar")}>
                  Nova solicitação <ArrowRight size={17} />
               </button>
            </div>
            <img src="/replica/team-assignment.svg" alt="" />
         </div>
         <div className="replica-hub-tabs">
            <span>Visão geral</span>
            <button onClick={() => go("/solicitacao-servicos/solicitar")}>Solicitar um serviço</button>
            <button onClick={() => go("/solicitacao-servicos")}>Minhas solicitações</button>
            <button onClick={() => go("/contratos")}>Contratos</button>
         </div>
         <div className="replica-hub-columns">
            <section>
               <h2>Serviços da secretaria</h2>
               <div className="replica-hub-list">
                  {areas.map(([title, desc, path, icon]) => (
                     <button key={path} onClick={() => go(path)}>
                        <span className="material-symbols-outlined" aria-hidden="true">
                           {icon}
                        </span>
                        <span>
                           <strong>{title}</strong>
                           <small>{desc}</small>
                        </span>
                        <ArrowRight size={17} />
                     </button>
                  ))}
               </div>
            </section>
            <aside>
               <h2>Acompanhe seus pedidos</h2>
               {state.requests.slice(0, 2).map(r => (
                  <button className="replica-hub-request" key={r.id} onClick={() => go("/solicitacao-servicos")}>
                     <strong>{r.name}</strong>
                     <span className="replica-status-pill">{r.status}</span>
                     <small>{r.id}</small>
                  </button>
               ))}
               {!state.requests.length && (
                  <div className="replica-personal-link">
                     <p>Os pedidos que você criar nesta demonstração aparecem aqui para acompanhamento.</p>
                     <button className="replica-text-button" onClick={() => go("/solicitacao-servicos")}>
                        Consultar histórico ilustrativo <ArrowRight size={16} />
                     </button>
                  </div>
               )}
               <div className="replica-personal-link">
                  <span className="material-symbols-outlined" aria-hidden="true">
                     folder
                  </span>
                  <h3>Precisa enviar seus documentos?</h3>
                  <p>Seus documentos pessoais ficam junto dos seus dados.</p>
                  <button className="replica-text-button" onClick={() => go("/perfil/documentos")}>
                     Ir para meus documentos <ArrowRight size={16} />
                  </button>
               </div>
               <div className="replica-personal-link">
                  <h3>Precisa de ajuda?</h3>
                  <p>Encontre o caminho certo antes de abrir um pedido.</p>
                  <button className="replica-text-button" onClick={() => go("/ajuda")}>
                     Ver orientações <ArrowRight size={16} />
                  </button>
               </div>
            </aside>
         </div>
      </div>
   );
}
function Preferences({ connected, setConnected }: { connected: boolean; setConnected: (v: boolean) => void }) {
   const { state, update, reset } = useDemo();
   return (
      <section className="replica-preferences">
         <div className="replica-page-head">
            <h1>Preferências e cenários</h1>
            <p>Ajuste a demonstração para explorar situações da vida do aluno.</p>
         </div>
         <label className="replica-field">
            Navegação
            <select value={connected ? "connected" : "original"} onChange={e => setConnected(e.target.value === "connected")}>
               <option value="original">Original · clonada do portal real</option>
               <option value="connected">Conectada · organização por intenção do aluno</option>
            </select>
         </label>
         <label className="replica-field">
            Cenário de demonstração
            <select
               value={state.scenario}
               onChange={e => {
                  update(s => ({ ...s, scenario: e.target.value as typeof s.scenario }));
                  if (e.target.value === "dp") setConnected(true);
               }}
            >
               <option value="base">Semestre em curso</option>
               <option value="dp">Dependência e adaptação fictícias</option>
               <option value="financeiro">Cobrança fictícia pendente</option>
               <option value="vazio">Sem mensalidade de exemplo</option>
            </select>
         </label>
         <label className="replica-switch">
            <input
               type="checkbox"
               checked={state.theme === "dark"}
               onChange={e => update(s => ({ ...s, theme: e.target.checked ? "dark" : "light" }))}
            />
            Tema escuro
         </label>
         <label className="replica-switch">
            <input type="checkbox" checked={state.largeText} onChange={e => update(s => ({ ...s, largeText: e.target.checked }))} />
            Texto maior
         </label>
         <label className="replica-switch">
            <input type="checkbox" checked={state.reducedMotion} onChange={e => update(s => ({ ...s, reducedMotion: e.target.checked }))} />
            Reduzir movimento
         </label>
         <div className="replica-callout">
            Os cenários representam situações fictícias. As informações da conta de teste e o portal real não são alterados.
         </div>
         <button
            className="replica-button secondary"
            onClick={() => {
               reset();
               toast.success("Demonstração reiniciada");
            }}
         >
            Reiniciar dados de demonstração
         </button>
      </section>
   );
}
function Help({ go }: { go: (p: string) => void }) {
   return (
      <section className="replica-help">
         <div className="replica-page-head">
            <h1>Como podemos ajudar?</h1>
            <p>Comece pelo que você precisa resolver.</p>
         </div>
         {[
            {
               q: "Cheguei agora. Por onde começo?",
               a: "Confira seus dados e documentos, veja o horário e o local das aulas e acesse o AVA para os conteúdos.",
               to: "/perfil/documentos",
               label: "Conferir meus documentos",
            },
            {
               q: "Onde vejo notas e faltas?",
               a: "Na sua vida acadêmica, consulte cada disciplina. O painel de notas também oferece caminhos para o AVA, horários e solicitações relacionadas.",
               to: "/perfil/notas-e-faltas",
               label: "Ver notas e faltas",
            },
            {
               q: "Preciso de um atestado ou histórico.",
               a: "A secretaria virtual reúne o catálogo de serviços e o acompanhamento de cada pedido.",
               to: "/secretaria-virtual",
               label: "Abrir secretaria virtual",
            },
            {
               q: "Reprovei em uma disciplina. O que faço?",
               a: "Na jornada acadêmica, confira a situação da disciplina e consulte a inscrição em DP/Adap e o edital. A oferta e o período de inscrição dependem das regras vigentes.",
               to: "/jornada-academica",
               label: "Ver minha jornada",
            },
            {
               q: "Preciso compensar faltas.",
               a: "Consulte as regras de compensação e as condições para solicitar análise. A decisão depende da instituição.",
               to: "/solicitacao-servicos/compensacao-faltas",
               label: "Conferir compensação de faltas",
            },
         ].map(i => (
            <details key={i.q} className="replica-faq">
               <summary>
                  {i.q}
                  <ChevronDown size={17} />
               </summary>
               <p>{i.a}</p>
               <button className="replica-text-button" onClick={() => go(i.to)}>
                  {i.label}
                  <ArrowRight size={16} />
               </button>
            </details>
         ))}
         <div className="replica-context">
            <a href={external.ouvidoria} target="_blank" rel="noopener noreferrer">
               Ouvidoria <ExternalLink size={14} />
            </a>
            <button onClick={() => go("/mural")}>Manuais e regulamentos</button>
         </div>
      </section>
   );
}
function DemoEntrance({ go }: { go: (p: string) => void }) {
   return (
      <div className="replica-entrance">
         <img src="/replica/logo-grupo-anchieta-3x-BOFhQ5AB.webp" alt="Grupo Anchieta" />
         <h1>Aluno Online</h1>
         <p>Clone de frontend para avaliação da experiência do aluno.</p>
         <button className="replica-button" onClick={() => go("/inicio")}>
            Entrar na demonstração <ArrowRight size={17} />
         </button>
         <p className="replica-note">Dados fictícios. A demonstração não precisa de RA ou senha.</p>
      </div>
   );
}
function toggleProfileAccordion(target: HTMLElement, profile: { name: string; email: string; phone: string; address: string }) {
   const item = target.closest("[data-slot=accordion-item]");
   const panel = item?.querySelector<HTMLElement>("[data-slot=accordion-content]");
   if (!panel) return;
   const open = target.getAttribute("aria-expanded") !== "true";
   target.setAttribute("aria-expanded", String(open));
   target.setAttribute("data-state", open ? "open" : "closed");
   item?.setAttribute("data-state", open ? "open" : "closed");
   panel.setAttribute("data-state", open ? "open" : "closed");
   if (!open) {
      panel.hidden = true;
      return;
   }
   const title = target.querySelector("span")?.textContent || "Dados cadastrais";
   const fields = title.startsWith("Informações")
      ? [
           ["Nome completo", profile.name],
           ["Data de nascimento", "01/02/2007 · exemplo"],
           ["Nacionalidade", "Brasileira"],
           ["E-mail", profile.email],
        ]
      : title.includes("residencial")
        ? [
             ["Endereço", profile.address],
             ["Cidade / UF", "Jundiaí / SP"],
             ["CEP", "00000-000"],
             ["Telefone", profile.phone],
             ["E-mail", profile.email],
          ]
        : title.includes("comercial")
          ? [
               ["Empresa", "Empresa de exemplo"],
               ["Endereço comercial", "Endereço fictício"],
               ["Telefone comercial", "(11) 0000-0000"],
            ]
          : [
               ["CPF", "000.000.000-00"],
               ["RG", "00.000.000-0"],
               ["Órgão emissor", "SSP / SP"],
            ];
   panel.innerHTML =
      '<div class="replica-profile-details"><dl>' +
      fields.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("") +
      `</dl><p class="replica-note">Dados fictícios da demonstração.</p><button class="replica-button secondary" data-edit-profile="${escapeHtml(title)}">Editar dados de exemplo</button></div>`;
   panel.hidden = false;
   panel.style.setProperty("--radix-accordion-content-height", panel.scrollHeight + "px");
}
function exportStatement() {
   const csv =
      "\uFEFFDocumento de demonstração;Sem validade\nMês;Descrição;Valor\nOutubro/2026;Mensalidade fictícia;0,00\nSetembro/2026;Mensalidade fictícia;0,00";
   const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
   const a = document.createElement("a");
   a.href = url;
   a.download = "extrato-demonstracao.csv";
   a.click();
   setTimeout(() => URL.revokeObjectURL(url), 1000);
   toast.success("Extrato de demonstração exportado");
}
function exportCalendar() {
   const ics =
      "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Anchieta CX//Demonstração//PT\r\nBEGIN:VEVENT\r\nUID:aula-demo-20261020@localhost\r\nDTSTAMP:20261020T120000Z\r\nDTSTART;TZID=America/Sao_Paulo:20261020T210000\r\nDTEND;TZID=America/Sao_Paulo:20261020T224000\r\nSUMMARY:DEMONSTRAÇÃO - Bases da Administração Moderna\r\nDESCRIPTION:Evento fictício para avaliação do frontend.\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n";
   const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
   const a = document.createElement("a");
   a.href = url;
   a.download = "aulas-demonstracao.ics";
   a.click();
   setTimeout(() => URL.revokeObjectURL(url), 1000);
   toast.success("Evento de demonstração exportado");
}
