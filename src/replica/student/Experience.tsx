import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
   ArrowRight,
   Bell,
   BookOpen,
   CalendarDays,
   Check,
   CheckCircle2,
   ChevronDown,
   ChevronRight,
   FilePenLine,
   Files,
   Clock3,
   ExternalLink,
   FileCheck2,
   GraduationCap,
   MapPin,
   QrCode,
   ReceiptText,
   Search,
   TriangleAlert,
} from "lucide-react";
import { useDemo } from "../../cx/state";
import { disciplines, external, normalize } from "../../cx/data";
import type { Overlay } from "../Dialogs";
import { academicEvents, chargesFor, currency, formation, formatDate, recentNotices, today } from "./model";
import { DestinationList, SectionNavigation } from "./Navigation";

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string; downlink?: number };

/** Decorative, muted inline loops; load only while visible and respect reduced motion/data saving. */
export function AmbientVideo({ name }: { name: "study-notes" | "study-desk" | "student-guidance" }) {
   const { state } = useDemo();
   const video = useRef<HTMLVideoElement>(null);
   const container = useRef<HTMLDivElement>(null);
   const [eligible, setEligible] = useState(false);
   const [visible, setVisible] = useState(false);
   const [active, setActive] = useState(!document.hidden);
   const [failed, setFailed] = useState(false);
   const [playing, setPlaying] = useState(false);
   useEffect(() => {
      const motion = matchMedia("(prefers-reduced-motion: reduce)");
      const nav = navigator as Navigator & { connection?: Connection };
      const connection = nav.connection;
      const sync = () =>
         setEligible(
            !motion.matches &&
               !state.reducedMotion &&
               !connection?.saveData &&
               !["slow-2g", "2g"].includes(connection?.effectiveType || ""),
         );
      sync();
      motion.addEventListener("change", sync);
      connection?.addEventListener("change", sync);
      return () => {
         motion.removeEventListener("change", sync);
         connection?.removeEventListener("change", sync);
      };
   }, [state.reducedMotion]);
   useEffect(() => {
      if (!container.current || !window.IntersectionObserver) return;
      const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { threshold: 0.2 });
      observer.observe(container.current);
      const sync = () => setActive(!document.hidden);
      document.addEventListener("visibilitychange", sync);
      return () => {
         observer.disconnect();
         document.removeEventListener("visibilitychange", sync);
      };
   }, []);
   useEffect(() => {
      if (!video.current) return;
      if (eligible && visible && active && !failed) {
         video.current.play().catch(() => setFailed(true));
      } else video.current.pause();
   }, [eligible, visible, active, failed]);
   return (
      <div className={"cx-ambient " + name} ref={container}>
         <img src={`/media/${name}.webp`} alt="" width="960" height="540" loading="lazy" />
         {eligible && visible && !failed && (
            <video
               ref={video}
               src={`/media/${name}.mp4`}
               muted
               loop
               playsInline
               autoPlay
               preload="metadata"
               aria-hidden="true"
               onPlaying={() => setPlaying(true)}
               onPause={() => setPlaying(false)}
               onError={() => setFailed(true)}
            />
         )}
         <span className="sr-only">{playing ? "Vídeo decorativo em reprodução" : "Imagem de uma mesa de estudo"}</span>
      </div>
   );
}

export function ContextBanner({
   title,
   children,
   media = "study-notes",
   action,
}: {
   title: string;
   children: ReactNode;
   media?: "study-notes" | "study-desk" | "student-guidance";
   action: ReactNode;
}) {
   return (
      <section className="cx-context-banner">
         <div>
            <h2>{title}</h2>
            <p>{children}</p>
            {action}
         </div>
         <AmbientVideo name={media} />
      </section>
   );
}

export function FormationSummary({ compact = false }: { compact?: boolean }) {
   return (
      <section className={"student-formation-summary cx-formation" + (compact ? " cx-formation-compact" : "")} aria-label="Minha formação">
         <div className="student-section-heading">
            <h2>Minha formação</h2>
            <Link to="/meus-estudos/atividades" aria-label="Ver atividades e horas">
               <ArrowRight size={16} />
            </Link>
         </div>
         <div className="cx-hours-grid">
            {[
               {
                  label: "Complementares",
                  full: "Horas complementares",
                  ...formation.complementary,
                  href: "/perfil/horas-complementares",
                  kind: "complementary",
               },
               { label: "Extensão", full: "Horas de extensão", ...formation.extension, href: external.extensao, kind: "extension" },
            ].map(item => (
               <a
                  className={`student-hours-row student-hours-${item.kind}`}
                  href={item.href}
                  target={item.kind === "extension" ? "_blank" : undefined}
                  rel={item.kind === "extension" ? "noopener noreferrer" : undefined}
                  key={item.kind}
                  aria-label={`${item.full}: ${item.done} de ${item.total} horas. Ver detalhes`}
               >
                  <span>
                     <strong>{item.label}</strong>
                     <ArrowRight size={14} />
                  </span>
                  <div className="cx-hours-value">
                     <b>
                        {Math.round((item.done / item.total) * 100)}
                        <small>%</small>
                     </b>
                     <span>
                        <strong>{item.done}h</strong> de {item.total}h
                     </span>
                  </div>
                  <div
                     className="student-hours-track"
                     role="progressbar"
                     aria-label={item.full}
                     aria-valuenow={item.done}
                     aria-valuemin={0}
                     aria-valuemax={item.total}
                  >
                     <span style={{ width: `${(item.done / item.total) * 100}%` }} />
                     <span style={{ width: `${(1 - item.done / item.total) * 100}%` }} />
                  </div>
                  <small className="cx-hours-remaining">
                     Faltam {item.total - item.done}h <span>para completar</span>
                  </small>
               </a>
            ))}
         </div>
      </section>
   );
}

function NextClass() {
   return (
      <section className="student-next-class cx-next-class" aria-labelledby="home-next-class">
         <div>
            <div className="student-class-time">
               <Clock3 size={15} />
               <strong>Sua próxima aula · hoje, 21h</strong>
            </div>
            <h2 id="home-next-class">
               <Link
                  to={`/perfil/notas-e-faltas?disciplina=${disciplines[0].id}`}
                  aria-label="Ver situação de Bases da Administração Moderna"
               >
                  Bases da Administração Moderna
               </Link>
            </h2>
            <p>
               <MapPin size={14} /> On-line <span>·</span> Rômulo Prezotto <span className="cx-class-end">· até 22h40</span>
            </p>
            <div className="student-class-actions">
               <a className="replica-button" href={disciplines[0].ava} target="_blank" rel="noopener noreferrer">
                  Entrar na aula <ExternalLink size={15} />
               </a>
               <Link to="/horarios">
                  Meus horários <ArrowRight size={14} />
               </Link>
            </div>
         </div>
         <img src="/replica/workspace.svg" alt="" width="190" height="140" />
      </section>
   );
}

export function AcademicPulse() {
   const [mode, setMode] = useState<"grades" | "misses">("grades");
   return (
      <section className="cx-academic-pulse" aria-labelledby="pulse-title">
         <div className="student-section-heading">
            <div>
               <h2 id="pulse-title">Como estou nas disciplinas?</h2>
               <p className="student-muted">Um olhar para o seu semestre.</p>
            </div>
            <Link to="/perfil/notas-e-faltas" aria-label="Ver todas as notas e faltas">
               <ArrowRight size={17} />
            </Link>
         </div>
         <div className="cx-segmented" role="group" aria-label="Indicador das disciplinas">
            <button aria-pressed={mode === "grades"} onClick={() => setMode("grades")}>
               Notas
            </button>
            <button aria-pressed={mode === "misses"} onClick={() => setMode("misses")}>
               Faltas
            </button>
         </div>
         <p className="cx-chart-description" aria-live="polite">
            {mode === "grades" ? "Nota registrada, na escala de 0 a 10." : "Faltas registradas em relação ao limite de cada disciplina."}
         </p>
         <div className="cx-discipline-bars">
            {disciplines.slice(0, 5).map(subject => {
               const percent = mode === "grades" ? (subject.grade || 0) * 10 : (subject.misses / subject.limit) * 100;
               return (
                  <Link
                     key={subject.id}
                     to={`/perfil/notas-e-faltas?disciplina=${subject.id}`}
                     className={mode === "misses" && percent >= 60 ? "attention" : ""}
                  >
                     <span>{subject.name}</span>
                     <strong>
                        {mode === "grades"
                           ? subject.grade === null
                              ? "Aguardando"
                              : subject.grade.toLocaleString("pt-BR")
                           : `${subject.misses} / ${subject.limit}`}
                     </strong>
                     <span className="cx-subject-track" aria-hidden="true">
                        <i style={{ width: `${Math.min(100, percent)}%` }} />
                     </span>
                  </Link>
               );
            })}
         </div>
         <a className="student-text-link" href={external.criterios} target="_blank" rel="noopener noreferrer">
            Entender notas e frequência <ExternalLink size={14} />
         </a>
      </section>
   );
}

export function SemesterTimeline() {
   const events = academicEvents
      .filter(event => event.start > today)
      .sort((a, b) => a.start.localeCompare(b.start))
      .slice(0, 3);
   return (
      <section className="cx-semester-agenda" aria-labelledby="semester-agenda-title">
         <div className="student-section-heading">
            <div>
               <h2 id="semester-agenda-title">O que vem pela frente</h2>
               <p className="student-muted">Seus próximos compromissos, em ordem.</p>
            </div>
            <Link to="/calendario-academico">
               Calendário <ArrowRight size={15} />
            </Link>
         </div>
         <ol>
            {events.map((event, index) => (
               <li key={event.id}>
                  <Link to={`/calendario-academico?evento=${event.id}`}>
                     <time dateTime={event.start}>
                        <strong>{formatDate(event.start, { day: "2-digit" })}</strong>
                        <span>{formatDate(event.start, { month: "short" }).replace(".", "")}</span>
                     </time>
                     <span>
                        <small>
                           {index === 0 ? "Próximo · " : ""}
                           {event.category}
                        </small>
                        <strong>{event.title}</strong>
                        {event.end !== event.start && <small>Até {formatDate(event.end)}</small>}
                     </span>
                     <ArrowRight size={17} />
                  </Link>
               </li>
            ))}
         </ol>
      </section>
   );
}

export function CourseJourney() {
   const pending = true;
   return (
      <section className="cx-course-journey">
         <div className="student-section-heading">
            <h2>Minha jornada no curso</h2>
            <GraduationCap size={19} />
         </div>
         <p>
            <strong>2º período</strong>
            <span>de 8 períodos</span>
         </p>
         <div
            className="cx-period-track"
            role="img"
            aria-label={`${pending ? "Primeiro período com disciplinas para regularizar" : "Primeiro período concluído"}. Segundo período em andamento. Oito períodos no curso.`}
         >
            {Array.from({ length: 8 }, (_, i) => (
               <span key={i} className={i === 0 ? (pending ? "pending" : "done") : i === 1 ? "current" : ""} aria-hidden="true">
                  {i === 0 ? pending ? <TriangleAlert size={12} /> : <Check size={12} /> : i + 1}
               </span>
            ))}
         </div>
         <Link to={pending ? "/jornada-academica?periodo=1" : "/jornada-academica"} className="student-text-link">
            Ver disciplinas e próximos passos <ArrowRight size={14} />
         </Link>
      </section>
   );
}

export function HomeDashboard({ showOverlay }: { showOverlay: (overlay: Overlay) => void }) {
   const { state } = useDemo();
   const charge = chargesFor(state).find(item => !item.paid);
   const missing = Math.max(0, 6 - Object.keys(state.docs).length);
   const paymentsToReview = chargesFor(state).filter(item => !item.paid && (item.due < today || item.request));
   const pendingPayment = paymentsToReview.length;
   const paymentTarget = paymentsToReview[0] || charge;
   const requests = state.requests.filter(item => ["Em análise", "Aguardando pagamento"].includes(item.status));
   return (
      <div className="student-page student-home cx-home" data-student-ui>
         <header className="student-home-heading">
            <div>
               <h1>
                  Olá, {state.profile.name.split(" ")[0]}
                  <span className="cx-greeting-dot">.</span>
               </h1>
               <p className="cx-home-course">
                  <GraduationCap size={15} /> Ciências Contábeis <span>·</span> 2º período <span>·</span> 2026/2
               </p>
            </div>
            <span className="student-today">
               <CalendarDays size={15} />
               {formatDate(today, { weekday: "long", day: "numeric", month: "long" })}
            </span>
         </header>
         <div className="student-home-priorities">
            <NextClass />
            <section className="student-next-payment cx-next-payment" aria-labelledby="next-payment-title">
               <div className="student-section-heading">
                  <h2 id="next-payment-title">Próximo pagamento</h2>
                  <ReceiptText size={18} />
               </div>
               {charge ? (
                  <>
                     <div className="cx-payment-info">
                        <strong className="student-payment-amount">{currency(charge.amount)}</strong>
                        <p>{charge.name}</p>
                     </div>
                     <div className="student-payment-due">
                        <CalendarDays size={14} />
                        <span>
                           {charge.due < today ? "Venceu em " : "Vence em "}
                           <strong>{formatDate(charge.due, { day: "2-digit", month: "long" })}</strong>
                        </span>
                        {charge.due < today && <span className="student-overdue">Vencida</span>}
                     </div>
                     <Link className="replica-button" to={`/financeiro?cobranca=${encodeURIComponent(charge.id)}`}>
                        <QrCode size={16} />
                        Conferir e pagar <ArrowRight size={15} />
                     </Link>
                  </>
               ) : (
                  <div className="student-payment-clear">
                     <CheckCircle2 size={25} />
                     <strong>Nenhum pagamento pendente</strong>
                     <Link className="student-text-link" to="/financeiro">
                        Abrir financeiro <ArrowRight size={14} />
                     </Link>
                  </div>
               )}
            </section>
         </div>
         <div className="cx-home-quick-links" role="navigation" aria-label="Atalhos da sua rotina">
            {[
               { label: "Notas e faltas", to: "/perfil/notas-e-faltas", icon: "history_edu", color: "blue" },
               { label: "Estágio", to: "/meu-estagio", icon: "work_outline", color: "amber" },
               { label: "Pedir um serviço", to: "/solicitacao-servicos/solicitar", icon: "support_agent", color: "teal" },
               { label: "Meus horários", to: "/horarios", icon: "schedule", color: "violet" },
            ].map(item => (
               <Link key={item.to} to={item.to}>
                  <span className={`cx-icon-tile ${item.color}`}>
                     <span className="material-symbols-outlined" aria-hidden="true">
                        {item.icon}
                     </span>
                  </span>
                  <span>{item.label}</span>
                  <ArrowRight size={14} />
               </Link>
            ))}
         </div>
         <section className="cx-academic-status" aria-labelledby="academic-status-title">
            <h2 id="academic-status-title">Situação acadêmica</h2>
            <div className="cx-academic-status-grid">
               <Link to="/contratos" className="cx-status-card is-clear">
                  <span className="cx-status-card-icon">
                     <FilePenLine size={22} strokeWidth={1.7} />
                  </span>
                  <span className="cx-status-card-copy">
                     <strong>Assinar contrato</strong>
                     <small>
                        <CheckCircle2 size={13} /> Nada pendente
                     </small>
                  </span>
                  <ChevronRight size={17} />
               </Link>
               <Link
                  to={paymentTarget ? `/financeiro?cobranca=${encodeURIComponent(paymentTarget.id)}` : "/financeiro"}
                  className={`cx-status-card ${pendingPayment ? "is-pending" : "is-clear"}`}
               >
                  <span className="cx-status-card-icon">
                     <ReceiptText size={22} strokeWidth={1.7} />
                  </span>
                  <span className="cx-status-card-copy">
                     <strong>Realizar pagamento</strong>
                     <small>
                        {!pendingPayment && <CheckCircle2 size={13} />}
                        {pendingPayment ? `${pendingPayment} pagamento${pendingPayment > 1 ? "s" : ""} para conferir` : "Sem pendências"}
                     </small>
                  </span>
                  <ChevronRight size={17} />
               </Link>
               <Link to="/perfil/documentos#documentos-matricula" className={`cx-status-card ${missing ? "is-pending" : "is-clear"}`}>
                  <span className="cx-status-card-icon">
                     <Files size={22} strokeWidth={1.7} />
                  </span>
                  <span className="cx-status-card-copy">
                     <strong>Entrega de documentos</strong>
                     <small>
                        {!missing && <CheckCircle2 size={13} />}
                        {missing ? `Faltam ${missing} de 6` : "Todos enviados"}
                     </small>
                  </span>
                  <ChevronRight size={17} />
               </Link>
               <Link to="/jornada-academica?periodo=1" className="cx-status-card is-pending">
                  <span className="cx-status-card-icon">
                     <GraduationCap size={22} strokeWidth={1.7} />
                  </span>
                  <span className="cx-status-card-copy">
                     <strong>DP/ADAP</strong>
                     <small>2 disciplinas para regularizar</small>
                  </span>
                  <ChevronRight size={17} />
               </Link>
            </div>
         </section>
         <div className="cx-home-dashboard">
            <div className="cx-home-main">
               <SemesterTimeline />
               <AcademicPulse />
            </div>
            <aside className="cx-home-side">
               <CommunicationsPreview />
               <FormationSummary compact />
               <CourseJourney />
               <section className="cx-free-courses" aria-labelledby="free-courses-title">
                  <span className="cx-icon-tile violet">
                     <span className="material-symbols-outlined" aria-hidden="true">
                        auto_stories
                     </span>
                  </span>
                  <div>
                     <span className="cx-course-eyebrow">Amplie seu conhecimento</span>
                     <h2 id="free-courses-title">Cursos Livres</h2>
                     <p>Descubra novos assuntos e aprenda no seu ritmo.</p>
                     <a href={external.cursosLivres} target="_blank" rel="noopener noreferrer">
                        Explorar cursos <ExternalLink size={14} />
                     </a>
                  </div>
               </section>
               <section className="cx-request-preview">
                  <div className="student-section-heading">
                     <h2>Meus pedidos</h2>
                     <Link to="/solicitacao-servicos" aria-label="Ver todos os meus pedidos">
                        <ArrowRight size={16} />
                     </Link>
                  </div>
                  {requests.length ? (
                     requests.slice(0, 2).map(request => (
                        <button key={request.id} onClick={() => showOverlay({ kind: "request", id: request.id })}>
                           <span>
                              <strong>{request.name}</strong>
                              <small>{request.status}</small>
                           </span>
                           <ArrowRight size={15} />
                        </button>
                     ))
                  ) : (
                     <p className="student-muted">
                        Nenhum pedido em andamento. <Link to="/secretaria-virtual">Conhecer os serviços</Link>
                     </p>
                  )}
               </section>
            </aside>
         </div>
      </div>
   );
}

function CommunicationsPreview() {
   return (
      <section className="cx-notice-preview" aria-labelledby="home-notices-title">
         <div className="student-section-heading">
            <h2 id="home-notices-title">
               <Bell size={17} /> Avisos e comunicados
            </h2>
            <Link to="/comunicados" aria-label="Ver todos os avisos">
               <ArrowRight size={16} />
            </Link>
         </div>
         {recentNotices.map(notice => (
            <Link key={notice.href} to={notice.href}>
               <span className="cx-notice-category">{notice.category}</span>
               <strong>{notice.title}</strong>
               <span className="cx-notice-meta">
                  <time dateTime={notice.date}>{formatDate(notice.date)}</time>
                  <ArrowRight size={14} />
               </span>
            </Link>
         ))}
      </section>
   );
}

const serviceAreas = [
   {
      label: "Declarações e comprovantes",
      href: "/solicitacao-servicos/solicitar?busca=declara",
      icon: "description",
      description: "Atestados, histórico e documentos acadêmicos.",
      group: "Documentos",
      color: "blue",
   },
   {
      label: "Meus contratos",
      href: "/contratos",
      icon: "contract",
      description: "Documentos do seu vínculo com a faculdade.",
      group: "Documentos",
      color: "violet",
   },
   {
      label: "Tive um afastamento",
      href: "/solicitacao-servicos/compensacao-faltas",
      icon: "medical_information",
      description: "Entenda e solicite a compensação de faltas.",
      group: "Vida acadêmica",
      color: "rose",
   },
   {
      label: "Aproveitar disciplinas que já cursei",
      href: "/solicitacao-servicos/dispensa-disciplinas",
      icon: "library_books",
      description: "Peça a análise dos seus estudos anteriores.",
      group: "Vida acadêmica",
      color: "teal",
   },
   {
      label: "Reservar um laboratório",
      href: "/solicitacao-servicos/agendamento-laboratorios",
      icon: "science",
      description: "Recursos e espaços para suas atividades.",
      group: "Vida acadêmica",
      color: "blue",
   },
   {
      label: "Formatura e colação de grau",
      href: "/perfil/colacao-de-grau",
      icon: "school",
      description: "Requisitos e próximos passos até a conclusão.",
      group: "Vida acadêmica",
      color: "amber",
   },
   {
      label: "Atendimento e orientação",
      href: "/ajuda",
      icon: "forum",
      description: "Encontre respostas e o caminho para resolver.",
      group: "Atendimento",
      color: "teal",
   },
   {
      label: "Ouvidoria",
      href: external.ouvidoria,
      icon: "record_voice_over",
      description: "Acesse o canal institucional de ouvidoria.",
      group: "Atendimento",
      color: "violet",
   },
];
export function SecretariatHub() {
   const { state } = useDemo();
   const go = useNavigate();
   const [query, setQuery] = useState("");
   const [group, setGroup] = useState("Todos");
   const items = serviceAreas.filter(
      item => (group === "Todos" || item.group === group) && normalize(item.label + " " + item.description).includes(normalize(query)),
   );
   const active = state.requests.filter(item => ["Em análise", "Aguardando pagamento"].includes(item.status));
   return (
      <div className="student-page cx-secretariat" data-student-ui>
         <header className="student-page-heading">
            <div>
               <h1>Secretaria virtual</h1>
               <p>Resolva, acompanhe e siga em frente.</p>
            </div>
         </header>
         <SectionNavigation path="/secretaria-virtual" />
         <section className="cx-secretariat-banner">
            <div>
               <h2>O que você precisa resolver?</h2>
               <p>Dos documentos à formatura, a secretaria está por aqui.</p>
               <Link className="replica-button" to="/solicitacao-servicos/solicitar">
                  Nova solicitação <ArrowRight size={16} />
               </Link>
            </div>
            <AmbientVideo name="student-guidance" />
         </section>
         <div className="cx-service-progress">
            <Link to="/solicitacao-servicos">
               <strong>{active.length}</strong>
               <span>{active.length === 1 ? "pedido em andamento" : "pedidos em andamento"}</span>
               <ArrowRight size={16} />
            </Link>
            <ol aria-label="Etapas de uma solicitação">
               <li>
                  <CheckCircle2 size={16} />
                  Pedido recebido
               </li>
               <li>
                  <Clock3 size={16} />
                  Em análise
               </li>
               <li>
                  <FileCheck2 size={16} />
                  Retorno disponível
               </li>
            </ol>
         </div>
         <div className="cx-hub-columns">
            <section aria-labelledby="services-heading">
               <div className="student-section-heading">
                  <h2 id="services-heading">Encontre pelo que precisa</h2>
                  <Link to="/solicitacao-servicos/solicitar">
                     Todos os serviços <ArrowRight size={14} />
                  </Link>
               </div>
               <label className="cx-search">
                  <Search size={17} />
                  <input
                     type="search"
                     aria-label="Buscar na secretaria"
                     placeholder="Ex.: histórico, atestado, faltas…"
                     value={query}
                     onChange={event => setQuery(event.target.value)}
                  />
               </label>
               <div className="cx-topic-filters" role="group" aria-label="Tipos de serviço">
                  {["Todos", "Documentos", "Vida acadêmica", "Atendimento"].map(value => (
                     <button key={value} aria-pressed={group === value} onClick={() => setGroup(value)}>
                        {value}
                     </button>
                  ))}
               </div>
               <div className="cx-service-grid">
                  {items.map(item => (
                     <button
                        key={item.href}
                        className="cx-service-card"
                        onClick={() =>
                           item.href.startsWith("https:") ? window.open(item.href, "_blank", "noopener,noreferrer") : go(item.href)
                        }
                     >
                        <span className={`cx-icon-tile ${item.color}`}>
                           <span className="material-symbols-outlined" aria-hidden="true">
                              {item.icon}
                           </span>
                        </span>
                        <span>
                           <strong>{item.label}</strong>
                           <small>{item.description}</small>
                        </span>
                        {item.href.startsWith("https:") ? <ExternalLink size={15} /> : <ArrowRight size={15} />}
                     </button>
                  ))}
               </div>
               {!items.length && (
                  <div className="student-empty">
                     <Search size={25} />
                     <h3>Não encontrou por esse nome?</h3>
                     <p>O catálogo reúne todos os serviços da secretaria.</p>
                     <Link className="replica-button" to={`/solicitacao-servicos/solicitar?busca=${encodeURIComponent(query)}`}>
                        Buscar no catálogo <ArrowRight size={15} />
                     </Link>
                     <button
                        className="student-text-link"
                        onClick={() => {
                           setGroup("Todos");
                           setQuery("");
                        }}
                     >
                        Limpar busca e filtros
                     </button>
                  </div>
               )}
            </section>
            <aside>
               <section className="cx-request-preview">
                  <div className="student-section-heading">
                     <h2>Acompanhe seus pedidos</h2>
                     <ReceiptText size={19} />
                  </div>
                  <p className="student-muted">Veja respostas, documentos e o próximo passo de cada solicitação.</p>
                  <Link className="replica-button secondary" to="/solicitacao-servicos">
                     Consultar meus pedidos <ArrowRight size={15} />
                  </Link>
               </section>
               <section className="cx-personal-documents">
                  <span className="cx-icon-tile amber">
                     <FileCheck2 size={23} />
                  </span>
                  <h2>Seus documentos são seus.</h2>
                  <p>RG, histórico escolar e anexos de matrícula ficam junto dos seus dados.</p>
                  <Link className="student-text-link" to="/perfil/documentos">
                     Ir para meus documentos <ArrowRight size={14} />
                  </Link>
               </section>
               <DestinationList
                  items={[
                     {
                        label: "Ainda tenho uma dúvida",
                        href: "/ajuda",
                        icon: "help",
                        description: "Encontre uma orientação antes de abrir um pedido.",
                     },
                  ]}
               />
            </aside>
         </div>
      </div>
   );
}

const questions = [
   {
      q: "Cheguei agora. Por onde começo?",
      a: "Confira seus dados e documentos de matrícula. Depois, veja seu horário e local das aulas. O AVA reúne os conteúdos, atividades e orientações dos professores.",
      to: "/perfil/documentos",
      label: "Conferir meus documentos",
      group: "Começando",
      icon: "waving_hand",
   },
   {
      q: "Onde vejo minhas notas e faltas?",
      a: "Em Meus estudos, abra Notas e faltas e selecione uma disciplina. Você encontra as notas registradas, as faltas e o acesso ao conteúdo da matéria.",
      to: "/perfil/notas-e-faltas",
      label: "Ver notas e faltas",
      group: "Meus estudos",
      icon: "history_edu",
   },
   {
      q: "Preciso de um atestado ou histórico.",
      a: "Abra a secretaria e escolha Declarações e comprovantes. Consulte as instruções do serviço antes de solicitar. O andamento e o retorno ficam em Meus pedidos.",
      to: "/solicitacao-servicos/solicitar?busca=declara",
      label: "Encontrar meu comprovante",
      group: "Secretaria",
      icon: "description",
   },
   {
      q: "Reprovei em uma disciplina. O que faço?",
      a: "Na jornada do curso, confira a situação da disciplina e consulte a inscrição em dependência ou adaptação. Leia o edital: a oferta e o período de inscrição seguem as regras vigentes.",
      to: "/jornada-academica",
      label: "Ver minha jornada",
      group: "Meus estudos",
      icon: "school",
   },
   {
      q: "Preciso compensar faltas.",
      a: "Consulte as condições de compensação antes de abrir uma solicitação. Você poderá informar o período de afastamento e selecionar a documentação necessária para a análise da instituição.",
      to: "/solicitacao-servicos/compensacao-faltas",
      label: "Conferir compensação de faltas",
      group: "Secretaria",
      icon: "medical_information",
   },
   {
      q: "Como encontro meu boleto ou Pix?",
      a: "Na home, o próximo pagamento leva à cobrança já selecionada. Em Financeiro, você também pode escolher uma ou mais cobranças e continuar para o Pix.",
      to: "/financeiro",
      label: "Abrir meu financeiro",
      group: "Financeiro",
      icon: "payments",
   },
   {
      q: "Como acompanho minhas horas?",
      a: "Horas complementares e extensão têm registros próprios. Em Atividades e horas, veja o que já cumpriu, o que falta e o acesso ao sistema de registro de cada atividade.",
      to: "/meus-estudos/atividades",
      label: "Acompanhar minhas horas",
      group: "Meus estudos",
      icon: "hourglass_bottom",
   },
   {
      q: "Onde acompanho a resposta de um pedido?",
      a: "Em Meus pedidos, abra o protocolo para consultar a situação, o retorno e os documentos disponíveis. Se houver pagamento, o pedido também terá um caminho para o financeiro.",
      to: "/solicitacao-servicos",
      label: "Consultar meus pedidos",
      group: "Secretaria",
      icon: "assignment",
   },
];
export function HelpCenter({ showOverlay }: { showOverlay: (overlay: Overlay) => void }) {
   const [query, setQuery] = useState("");
   const [group, setGroup] = useState("Todos");
   const visible = questions.filter(
      item => (group === "Todos" || item.group === group) && normalize(item.q + " " + item.a).includes(normalize(query)),
   );
   return (
      <div className="student-page cx-help-center" data-student-ui>
         <header className="student-page-heading">
            <div>
               <h1>Como podemos ajudar?</h1>
               <p>Uma resposta clara. Um próximo passo.</p>
            </div>
         </header>
         <section className="cx-help-welcome">
            <div>
               <h2>Você não precisa conhecer todos os caminhos.</h2>
               <p>Conte com orientações para resolver o que precisa e seguir com seus estudos.</p>
               <label className="cx-search">
                  <Search size={18} />
                  <input
                     type="search"
                     aria-label="Buscar uma orientação"
                     placeholder="O que você precisa saber?"
                     value={query}
                     onChange={event => setQuery(event.target.value)}
                  />
               </label>
            </div>
            <img src="/replica/team-assignment.svg" alt="" width="260" height="180" />
         </section>
         <div className="cx-hub-columns">
            <section aria-labelledby="help-questions-title">
               <div className="student-section-heading">
                  <h2 id="help-questions-title">Encontre sua resposta</h2>
                  <span className="student-count" role="status">
                     {visible.length} {visible.length === 1 ? "orientação" : "orientações"}
                  </span>
               </div>
               <div className="cx-topic-filters" role="group" aria-label="Assuntos de ajuda">
                  {["Todos", "Começando", "Meus estudos", "Secretaria", "Financeiro"].map(value => (
                     <button key={value} aria-pressed={group === value} onClick={() => setGroup(value)}>
                        {value}
                     </button>
                  ))}
               </div>
               <div className="cx-faq-list">
                  {visible.map(item => (
                     <details key={item.q} className="cx-faq">
                        <summary>
                           <span className="material-symbols-outlined" aria-hidden="true">
                              {item.icon}
                           </span>
                           <span>{item.q}</span>
                           <ChevronDown size={17} />
                        </summary>
                        <div>
                           <p>{item.a}</p>
                           <Link className="student-text-link" to={item.to}>
                              {item.label} <ArrowRight size={15} />
                           </Link>
                        </div>
                     </details>
                  ))}
               </div>
               {!visible.length && (
                  <div className="student-empty">
                     <Search size={26} />
                     <h3>Vamos tentar de outro jeito?</h3>
                     <p>Use uma palavra como notas, documento ou pagamento.</p>
                     <button
                        className="replica-button secondary"
                        onClick={() => {
                           setQuery("");
                           setGroup("Todos");
                        }}
                     >
                        Mostrar todas as orientações
                     </button>
                  </div>
               )}
            </section>
            <aside>
               <section className="cx-start-guide">
                  <span className="cx-icon-tile blue">
                     <BookOpen size={23} />
                  </span>
                  <h2>Seu começo no Anchieta</h2>
                  <p>Três passos para se encontrar.</p>
                  <ol>
                     <li>
                        <Link to="/perfil/documentos">
                           <span>1</span>Confira seus documentos <ArrowRight size={14} />
                        </Link>
                     </li>
                     <li>
                        <Link to="/horarios">
                           <span>2</span>Encontre sua próxima aula <ArrowRight size={14} />
                        </Link>
                     </li>
                     <li>
                        <a href={external.ava} target="_blank" rel="noopener noreferrer">
                           <span>3</span>Conheça seu AVA <ExternalLink size={14} />
                        </a>
                     </li>
                  </ol>
               </section>
               <section className="cx-help-contact">
                  <h2>Prefere conversar?</h2>
                  <p>A Ana pode ajudar a encontrar o caminho.</p>
                  <button className="replica-button secondary" onClick={() => showOverlay({ kind: "chat" })}>
                     Conversar com a Ana <ArrowRight size={15} />
                  </button>
                  <Link className="student-text-link" to="/secretaria-virtual">
                     Atendimento da secretaria <ArrowRight size={14} />
                  </Link>
               </section>
               <div className="cx-help-resources">
                  <Link to="/mural">
                     Manuais e regulamentos <ArrowRight size={14} />
                  </Link>
                  <a href={external.ouvidoria} target="_blank" rel="noopener noreferrer">
                     Ouvidoria <ExternalLink size={14} />
                  </a>
               </div>
            </aside>
         </div>
      </div>
   );
}
