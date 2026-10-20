import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
   ArrowRight,
   Bell,
   BookOpen,
   CalendarDays,
   ChevronDown,
   ChevronRight,
   CircleHelp,
   CreditCard,
   ExternalLink,
   GraduationCap,
   Headphones,
   Home as HomeIcon,
   LayoutGrid,
   LogOut,
   Menu,
   MessageCircle,
   Moon,
   Search,
   Send,
   Settings2,
   ShieldCheck,
   Sun,
   UserRound,
   X,
} from "lucide-react";
import { Toaster } from "sonner";
import { DemoProvider, useDemo } from "./state";
import { curriculum, disciplines, external, normalize, notices, routes, services } from "./data";
import { Empty, Modal, PageHead, Pill, SearchField } from "./ui";
import Home from "./Home";
import "./styles.css";
const Academic = lazy(() => import("./Academic"));
const Secretariat = lazy(() => import("./Services"));
const Finance = lazy(() => import("./Finance"));
const Personal = lazy(() => import("./Personal"));
const Communication = lazy(() => import("./Communication"));
const Calendar = lazy(() => import("./Academic").then(m => ({ default: m.CalendarPage })));
const mainNav = [
   { to: "/", label: "Início", short: "Início", icon: HomeIcon },
   { to: "/academico", label: "Minha vida acadêmica", short: "Estudos", icon: GraduationCap },
   { to: "/secretaria", label: "Secretaria virtual", short: "Secretaria", icon: Headphones },
   { to: "/financeiro", label: "Meu financeiro", short: "Financeiro", icon: CreditCard },
   { to: "/meus-dados", label: "Meus dados", short: "Perfil", icon: UserRound },
];
const navChildren: Record<string, { to: string; label: string }[]> = {
   "/academico": [
      { to: "/academico/disciplinas", label: "Minhas disciplinas" },
      { to: "/academico/notas", label: "Notas e faltas" },
      { to: "/academico/horarios", label: "Meus horários" },
      { to: "/academico/jornada", label: "Minha jornada" },
      { to: "/academico/horas", label: "Horas complementares" },
      { to: "/academico/estagio", label: "Estágio, TCC e PI" },
      { to: "/academico/extensao", label: "Prática extensionista" },
      { to: "/academico/eletivas", label: "Eletivas" },
      { to: "/academico/avaliacoes", label: "Avaliar minhas aulas" },
      { to: "/academico/institucional", label: "Avaliação institucional" },
   ],
   "/secretaria": [
      { to: "/secretaria/servicos", label: "Encontrar um serviço" },
      { to: "/secretaria/solicitacoes", label: "Minhas solicitações" },
      { to: "/secretaria/compensacao", label: "Compensar faltas" },
      { to: "/secretaria/dispensa", label: "Aproveitar disciplinas" },
      { to: "/secretaria/laboratorios", label: "Reservar laboratório" },
      { to: "/secretaria/contratos", label: "Meus contratos" },
      { to: "/secretaria/formatura", label: "Minha formatura" },
      { to: "/secretaria/biblioteca", label: "Biblioteca" },
      { to: "/secretaria/monitoria", label: "Monitoria" },
      { to: "/secretaria/cpic", label: "Iniciação científica" },
      { to: "/secretaria/atendimento", label: "Falar com o Anchieta" },
   ],
   "/financeiro": [
      { to: "/financeiro/extrato", label: "Extrato e comprovantes" },
      { to: "/financeiro/vencimento", label: "Dia de vencimento" },
      { to: "/financeiro/responsavel", label: "Responsável financeiro" },
      { to: "/financeiro/informes", label: "Informes de rendimentos" },
   ],
   "/meus-dados": [
      { to: "/meus-dados/documentos", label: "Meus documentos" },
      { to: "/meus-dados/carteirinha", label: "Minha carteirinha" },
      { to: "/meus-dados/certificados", label: "Meus certificados" },
      { to: "/meus-dados/preferencias", label: "Preferências" },
   ],
};
export default function App() {
   return (
      <ErrorBoundary>
         <BrowserRouter>
            <DemoProvider>
               <Routes>
                  <Route path="/entrar" element={<DemoLogin />} />
                  <Route path="*" element={<Shell />} />
               </Routes>
            </DemoProvider>
         </BrowserRouter>
      </ErrorBoundary>
   );
}
class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
   state = { error: false };
   static getDerivedStateFromError() {
      return { error: true };
   }
   render() {
      return this.state.error ? (
         <div className="fatal-error">
            <h1>Vamos tentar de novo?</h1>
            <p>Não foi possível abrir esta parte da demonstração. Seus dados locais permanecem salvos.</p>
            <button className="button primary" onClick={() => window.location.assign("/")}>
               Voltar ao início
            </button>
         </div>
      ) : (
         this.props.children
      );
   }
}
function Shell() {
   const { state, update, storageError } = useDemo();
   const location = useLocation();
   const nav = useNavigate();
   const [search, setSearch] = useState(false);
   const [menu, setMenu] = useState(false);
   const [chat, setChat] = useState(false);
   const [course, setCourse] = useState(false);
   const [collapse, setCollapse] = useState(false);
   const [unavailable, setUnavailable] = useState(false);
   const unread = notices.filter(n => !state.read.includes(n.id)).length;
   const route = routes.find(r => r.path === location.pathname);
   const discipline = location.pathname.startsWith("/academico/disciplinas/")
      ? disciplines.find(d => d.id === location.pathname.split("/").pop())
      : undefined;
   const service = location.pathname.startsWith("/secretaria/servicos/")
      ? services.find(s => s.code === location.pathname.split("/").pop())
      : undefined;
   const parts = location.pathname.split("/");
   const matrixUnit = location.pathname.startsWith("/academico/matriz/") ? curriculum[Number(parts[3]) - 1]?.[Number(parts[4])] : undefined;
   const title =
      matrixUnit?.name ||
      discipline?.name ||
      service?.name ||
      route?.title ||
      (location.pathname.startsWith("/secretaria/solicitacoes/")
         ? "Detalhes do pedido"
         : location.pathname.startsWith("/avisos/")
           ? "Detalhes do aviso"
           : "Página não encontrada");
   useEffect(() => {
      setMenu(false);
      setUnavailable(false);
      document.title = title + " | Aluno Online · Anchieta CX";
      if (location.hash) {
         requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ block: "start" }));
      } else {
         window.scrollTo({ top: 0, behavior: "instant" });
         requestAnimationFrame(() => document.getElementById("page-title")?.focus({ preventScroll: true }));
      }
   }, [location.pathname, location.hash, title]);
   useEffect(() => {
      const handler = (e: KeyboardEvent) => {
         if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            setSearch(v => !v);
         }
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
   }, []);
   const side = <Sidebar close={() => setMenu(false)} openSearch={() => setSearch(true)} openCourse={() => setCourse(true)} />;
   return (
      <div className={`app-shell ${collapse ? "collapsed-nav" : ""}`}>
         <a href="#main-content" className="skip-link">
            Pular para o conteúdo
         </a>
         <aside className="desktop-sidebar" aria-label="Navegação e acessos">
            {side}
         </aside>
         <div className="workspace">
            <header className="topbar">
               <div className="topbar-left">
                  <button
                     className="icon-button nav-trigger"
                     aria-label="Alternar menu"
                     onClick={() => (window.innerWidth < 1000 ? setMenu(true) : setCollapse(!collapse))}
                  >
                     <Menu size={20} />
                  </button>
                  <nav aria-label="Localização" className="breadcrumbs">
                     <Link to="/">Aluno Online</Link>
                     {location.pathname !== "/" && (
                        <>
                           <ChevronRight size={14} />
                           <span>{route?.group || "Meu portal"}</span>
                        </>
                     )}
                  </nav>
               </div>
               <button className="header-search" aria-label="Buscar em todo o portal" onClick={() => setSearch(true)}>
                  <Search size={17} />
                  <span>O que você precisa encontrar?</span>
                  <kbd>Ctrl K</kbd>
               </button>
               <div className="topbar-actions">
                  <button
                     className="icon-button"
                     aria-label={state.theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
                     onClick={() => update(s => ({ ...s, theme: s.theme === "light" ? "dark" : "light" }))}
                  >
                     {state.theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
                  </button>
                  <Link to="/avisos" className="icon-button notification-button" aria-label={`Meus avisos, ${unread} não lidos`}>
                     <Bell size={20} />
                     {unread > 0 && <span />}
                  </Link>
                  <Link className="header-profile" to="/meus-dados">
                     <span className="avatar-small">{state.profile.name.slice(0, 1)}</span>
                     <span>{state.profile.name.split(" ")[0]}</span>
                     <ChevronDown size={14} />
                  </Link>
               </div>
            </header>
            <div className="prototype-bar" role="region" aria-label="Informações da demonstração">
               <span>
                  <span className="prototype-dot" />
                  Protótipo navegável <span className="optional-text">· Dados fictícios · Sem alterações no portal real</span>
               </span>
               <details className="scenario-popover">
                  <summary>
                     <Settings2 size={14} />
                     Explorar cenários
                     <ChevronDown size={13} />
                  </summary>
                  <div>
                     <label>
                        Cenário
                        <select
                           value={state.scenario}
                           onChange={e => update(s => ({ ...s, scenario: e.target.value as typeof s.scenario }))}
                        >
                           <option value="base">Semestre em curso</option>
                           <option value="dp">Disciplina em dependência</option>
                           <option value="financeiro">Cobrança pendente</option>
                           <option value="vazio">Sem solicitações</option>
                        </select>
                     </label>
                     <button className="button secondary" onClick={() => setUnavailable(true)}>
                        Simular indisponibilidade
                     </button>
                     <Link to="/meus-dados/preferencias">
                        Preferências e reinício
                        <ArrowRight size={15} />
                     </Link>
                  </div>
               </details>
            </div>
            {storageError && (
               <div role="alert" className="storage-warning">
                  Este navegador não permite salvar a demonstração. Suas ações ficam disponíveis apenas enquanto esta página estiver aberta.
               </div>
            )}
            <main id="main-content" className="main-content">
               {location.pathname !== "/" && (
                  <PageHead title={title} description={route?.description || "Informações e próximos passos para você."} />
               )}
               <Suspense fallback={<Loading />}>
                  {unavailable ? (
                     <Empty
                        title="Não conseguimos carregar agora"
                        action={
                           <button className="button primary" onClick={() => setUnavailable(false)}>
                              Tentar novamente
                           </button>
                        }
                     >
                        Este é um erro simulado. Suas informações locais continuam salvas.
                     </Empty>
                  ) : (
                     <ContentRoutes />
                  )}
               </Suspense>
               <footer className="page-footer">
                  <span>Grupo Anchieta · Aluno Online</span>
                  <span>Conceito de experiência do aluno · 2026</span>
                  <Link to="/ajuda">Preciso de ajuda</Link>
               </footer>
            </main>
         </div>
         <nav className="bottom-nav" aria-label="Navegação do celular">
            {mainNav.map(({ to, short, icon: Icon }) => (
               <NavLink to={to} end={to === "/"} key={to}>
                  <Icon size={21} />
                  <span>{short}</span>
               </NavLink>
            ))}
         </nav>
         <button
            className={`ana-launcher ${chat ? "is-open" : ""}`}
            aria-label={chat ? "Fechar guia Ana" : "Abrir guia Ana"}
            aria-expanded={chat}
            onClick={() => setChat(!chat)}
         >
            {chat ? (
               <X size={22} />
            ) : (
               <>
                  <span className="ana-initial">
                     <Headphones size={21} />
                  </span>
                  <span>Conte com a Ana</span>
                  <MessageCircle size={17} />
               </>
            )}
         </button>
         {chat && <Ana close={() => setChat(false)} />}
         <Modal open={menu} onClose={() => setMenu(false)} title="Navegar pelo portal" description="Todas as áreas do Aluno Online.">
            <div className="mobile-menu-content">{side}</div>
         </Modal>
         <GlobalSearch open={search} onClose={() => setSearch(false)} />
         <Modal
            open={course}
            onClose={() => setCourse(false)}
            title="Seu curso"
            description="Vínculo ilustrativo para demonstrar a identificação do curso."
         >
            <div className="course-option">
               <GraduationCap size={28} />
               <div>
                  <h3>Ciências Contábeis</h3>
                  <p>2º período · 2026/2 · RA 20260001</p>
                  <Pill tone="green">Curso do exemplo</Pill>
               </div>
            </div>
            <p className="muted">A seleção de múltiplos vínculos depende da integração acadêmica. Esta demonstração possui um curso.</p>
            <button
               className="button primary"
               onClick={() => {
                  setCourse(false);
                  nav("/academico");
               }}
            >
               Acompanhar meu curso
            </button>
         </Modal>
         <Toaster richColors position="top-center" closeButton />
      </div>
   );
}
function Sidebar({ close, openSearch, openCourse }: { close: () => void; openSearch: () => void; openCourse: () => void }) {
   const { state } = useDemo();
   const { pathname } = useLocation();
   return (
      <div className="sidebar-inner">
         <Link className="brand" to="/" onClick={close}>
            <img src="/brand/anchieta.png" alt="Anchieta" width={40} height={40} />
            <div>
               <strong>Aluno Online</strong>
               <span>GRUPO ANCHIETA</span>
            </div>
         </Link>
         <button className="course-switch" onClick={openCourse}>
            <span className="course-icon">
               <GraduationCap size={20} />
            </span>
            <span>
               <strong>Ciências Contábeis</strong>
               <small>2º período · 2026/2</small>
            </span>
            <ChevronDown size={16} />
         </button>
         <button className="sidebar-search" onClick={openSearch}>
            <Search size={17} />
            <span>Buscar no portal</span>
            <kbd>Ctrl K</kbd>
         </button>
         <nav className="main-navigation" aria-label="Menu principal">
            {mainNav.map(({ to, label, icon: Icon }) => (
               <div className="nav-group" key={to}>
                  <NavLink to={to} end={to === "/"} className="main-nav-link" onClick={close} title={label}>
                     <Icon size={20} />
                     <span>{label}</span>
                     {to === "/secretaria" && state.requests.some(r => r.status === "Em análise") && <i className="nav-dot" />}
                  </NavLink>
                  {to !== "/" && pathname.startsWith(to) && (
                     <div className="subnav">
                        {navChildren[to]?.map(r => (
                           <NavLink key={r.to} to={r.to} end onClick={close}>
                              {r.label}
                           </NavLink>
                        ))}
                     </div>
                  )}
               </div>
            ))}
         </nav>
         <div className="sidebar-secondary">
            <span className="sidebar-label">NO SEU DIA A DIA</span>
            <NavLink to="/avisos" onClick={close}>
               <Bell size={18} />
               <span>Meus avisos</span>
            </NavLink>
            <NavLink to="/calendario" onClick={close}>
               <CalendarDays size={18} />
               <span>Calendário acadêmico</span>
            </NavLink>
            <NavLink to="/mural" onClick={close}>
               <LayoutGrid size={18} />
               <span>Mural do Anchieta</span>
            </NavLink>
            <a href={external.ava} target="_blank" rel="noreferrer">
               <BookOpen size={18} />
               <span>Ambiente de aprendizagem</span>
               <ExternalLink size={13} />
            </a>
         </div>
         <div className="sidebar-bottom">
            <Link to="/ajuda" onClick={close} className="sidebar-help">
               <span className="help-circle">
                  <CircleHelp size={20} />
               </span>
               <div>
                  <strong>Estamos com você</strong>
                  <span>Encontre ajuda e orientações</span>
               </div>
               <ChevronRight size={15} />
            </Link>
            <Link className="exit-demo" to="/entrar" onClick={close}>
               <LogOut size={16} />
               <span>Sair da demonstração</span>
            </Link>
            <p>Feito para sua vida acadêmica.</p>
         </div>
      </div>
   );
}
function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
   const [q, setQ] = useState("");
   const nav = useNavigate();
   const query = normalize(q);
   const results = [
      ...routes.map(r => ({ path: r.path, title: r.title, description: r.group, text: r.title + " " + r.description + " " + r.keywords })),
      ...services.map(s => ({
         path: "/secretaria/servicos/" + s.code,
         title: s.name,
         description: "Secretaria · " + s.code,
         text: s.name + " " + s.original + " " + s.keywords,
      })),
   ]
      .filter(r => !query || normalize(r.text).includes(query))
      .slice(0, q ? 16 : 7);
   return (
      <Modal
         open={open}
         onClose={onClose}
         title="Encontre seu próximo passo"
         description="Busque por uma necessidade, uma disciplina ou um serviço."
      >
         <SearchField value={q} onChange={setQ} placeholder="Ex.: boleto, matrícula, DP, documentos" label="Busca em todo o portal" />
         <div className="search-results">
            {results.map(r => (
               <button
                  key={r.path}
                  onClick={() => {
                     nav(r.path);
                     onClose();
                     setQ("");
                  }}
               >
                  <Search size={16} />
                  <span>
                     <strong>{r.title}</strong>
                     <small>{r.description}</small>
                  </span>
                  <ArrowRight size={17} />
               </button>
            ))}
            {!results.length && <p role="status">Nenhum resultado. Tente “matrícula”, “notas” ou “documentos”.</p>}
         </div>
      </Modal>
   );
}
function Ana({ close }: { close: () => void }) {
   const [q, setQ] = useState("");
   const [asked, setAsked] = useState("");
   const matches = routes.filter(r => normalize(r.title + " " + r.description + " " + r.keywords).includes(normalize(asked))).slice(0, 4);
   const suggestions = [
      { to: "/meus-dados/documentos", label: "Quero entregar documentos" },
      { to: "/secretaria/servicos/CSA_150", label: "Preciso de um atestado de matrícula" },
      { to: "/academico/jornada", label: "Preciso cursar uma DP" },
      { to: "/financeiro", label: "Quero ver minhas mensalidades" },
   ];
   return (
      <section className="ana-panel" aria-label="Guia de navegação Ana">
         <div className="ana-header">
            <span className="ana-initial">
               <Headphones size={22} />
            </span>
            <div>
               <strong>Ana</strong>
               <span>Seu guia no portal · demonstração</span>
            </div>
            <button className="icon-button" aria-label="Fechar conversa" onClick={close}>
               <X size={19} />
            </button>
         </div>
         <div className="ana-body">
            <p className="ana-bubble">Oi! Vamos encontrar o que você precisa? Sou um guia por assuntos nesta demonstração.</p>
            {asked && (
               <>
                  <p className="user-bubble">{asked}</p>
                  <p className="ana-bubble">
                     {matches.length
                        ? "Estes caminhos podem te ajudar:"
                        : "Não encontrei esse assunto. Você pode consultar a ajuda ou falar com o Anchieta."}
                  </p>
               </>
            )}
            {(asked && matches.length ? matches.map(r => ({ to: r.path, label: r.title })) : suggestions).map(s => (
               <Link to={s.to} key={s.to} onClick={close}>
                  {s.label}
                  <ArrowRight size={16} />
               </Link>
            ))}
            <Link to="/ajuda" onClick={close}>
               Ver todas as orientações
               <ArrowRight size={16} />
            </Link>
         </div>
         <form
            onSubmit={e => {
               e.preventDefault();
               if (q.trim()) {
                  setAsked(q.trim());
                  setQ("");
               }
            }}
         >
            <input
               aria-label="Assunto para o guia Ana"
               value={q}
               onChange={e => setQ(e.target.value)}
               placeholder="Digite um assunto…"
               maxLength={150}
            />
            <button className="icon-button" aria-label="Encontrar assunto" disabled={!q.trim()}>
               <Send size={19} />
            </button>
         </form>
      </section>
   );
}
function ContentRoutes() {
   return (
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/academico/matriz/:period/:index" element={<Academic />} />
         <Route path="/academico/disciplinas/:id" element={<Academic />} />
         <Route path="/secretaria/servicos/:code" element={<Secretariat />} />
         <Route path="/secretaria/solicitacoes/:id" element={<Secretariat />} />
         <Route path="/academico/*" element={<Academic />} />
         <Route path="/secretaria/*" element={<Secretariat />} />
         <Route path="/financeiro/*" element={<Finance />} />
         <Route path="/meus-dados/*" element={<Personal />} />
         <Route path="/avisos" element={<Communication />} />
         <Route path="/avisos/:id" element={<Communication />} />
         <Route path="/mural" element={<Communication />} />
         <Route path="/ajuda" element={<Communication />} />
         <Route path="/calendario" element={<Calendar />} />
         <Route path="*" element={<LegacyOrMissing />} />
      </Routes>
   );
}
function LegacyOrMissing() {
   const { pathname } = useLocation();
   const map: Record<string, string> = {
      "/inicio": "/",
      "/horarios": "/academico/horarios",
      "/jornada-academica": "/academico/jornada",
      "/notificacoes": "/avisos",
      "/solicitacao-servicos": "/secretaria",
      "/solicitacao-servicos/solicitar": "/secretaria/servicos",
      "/solicitacao-servicos/compensacao-faltas": "/secretaria/compensacao",
      "/solicitacao-servicos/dispensa-disciplinas": "/secretaria/dispensa",
      "/solicitacao-servicos/agendamento-laboratorios": "/secretaria/laboratorios",
      "/contratos": "/secretaria/contratos",
      "/meu-estagio": "/academico/estagio",
      "/meu-estagio/relatorios": "/academico/estagio/relatorios",
      "/avaliar-disciplinas": "/academico/avaliacoes",
      "/avaliacao-institucional": "/academico/institucional",
      "/perfil/visao-geral": "/meus-dados",
      "/perfil/visao-geral/carteirinha": "/meus-dados/carteirinha",
      "/perfil/documentos": "/meus-dados/documentos",
      "/perfil/notas-e-faltas": "/academico/notas",
      "/perfil/horas-complementares": "/academico/horas",
      "/perfil/certificados": "/meus-dados/certificados",
      "/perfil/colacao-de-grau": "/secretaria/formatura",
   };
   const target = map[pathname.replace(/^\/aluno-online/, "")];
   return target ? (
      <Navigate to={target} replace />
   ) : (
      <Empty
         title="Vamos encontrar outro caminho?"
         action={
            <Link className="button primary" to="/">
               Voltar ao início
            </Link>
         }
      >
         Esta página não existe na demonstração. Você também pode usar a busca do portal.
      </Empty>
   );
}
function Loading() {
   return (
      <div className="loading-state" role="status" aria-label="Carregando conteúdo">
         <span className="skeleton-line" />
         <span className="skeleton-line" />
         <span className="skeleton-block" />
         <span className="sr-only">Carregando conteúdo…</span>
      </div>
   );
}
function DemoLogin() {
   return (
      <div className="login-page">
         <section>
            <Link className="brand" to="/">
               <img src="/brand/anchieta.png" alt="Anchieta" />
               <strong>Aluno Online</strong>
            </Link>
            <Pill tone="blue">Conceito de experiência · demonstração</Pill>
            <h1>
               Sua vida acadêmica,
               <br />
               em um só lugar.
            </h1>
            <p>Entre no protótipo para conhecer uma experiência pensada para o aluno, do primeiro acesso ao próximo passo.</p>
            <div className="login-note">
               <ShieldCheck size={22} />
               <span>Dados fictícios. Nenhuma conexão com o sistema acadêmico.</span>
            </div>
         </section>
         <section className="login-form">
            <h2>Vamos conhecer o novo caminho?</h2>
            <p>Você não precisa de RA ou senha para explorar.</p>
            <Link className="button primary full" to="/">
               Entrar na demonstração
               <ArrowRight size={18} />
            </Link>
            <p className="muted">Os exemplos ficam salvos somente neste navegador.</p>
            <Link className="text-link" to="/ajuda">
               Conhecer os primeiros passos
               <ArrowRight size={16} />
            </Link>
         </section>
      </div>
   );
}
