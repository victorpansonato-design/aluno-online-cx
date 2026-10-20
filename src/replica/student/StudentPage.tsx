import { Link } from "react-router-dom";
import {
   ArrowRight,
   Bell,
   CalendarDays,
   CheckCircle2,
   Clock3,
   ExternalLink,
   FileCheck2,
   GraduationCap,
   MapPin,
   QrCode,
   ReceiptText,
   TriangleAlert,
} from "lucide-react";
import { useDemo } from "../../cx/state";
import { disciplines, external } from "../../cx/data";
import type { Overlay } from "../Dialogs";
import Financial, { PixPayment } from "./Financial";
import AcademicCalendar, { CalendarPreview } from "./AcademicCalendar";
import { DestinationList, SectionNavigation } from "./Navigation";
import { academicEvents, chargesFor, currency, formation, formatDate, supportLinks, today } from "./model";

type Props = { path: string; showOverlay: (overlay: Overlay) => void };
export default function StudentPage({ path, showOverlay }: Props) {
   if (path === "/inicio") return <StudentHome showOverlay={showOverlay} />;
   if (path === "/financeiro") return <Financial />;
   if (path === "/financeiro/pix") return <PixPayment />;
   if (path === "/calendario-academico") return <AcademicCalendar />;
   if (path === "/meus-estudos/atividades" || path === "/meus-estudos/extensao")
      return <Formation extensionOnly={path.endsWith("/extensao")} />;
   if (path === "/comunicados") return <Communications />;
   return <Studies />;
}
function FormationSummary() {
   return (
      <section className="student-formation-summary" aria-labelledby="formation-summary-title">
         <div className="student-section-heading">
            <h2 id="formation-summary-title">Minha formação</h2>
            <GraduationCap size={19} />
         </div>
         <p className="student-muted">Suas horas, sempre por perto.</p>
         {[
            { label: "Horas complementares", ...formation.complementary, href: "/perfil/horas-complementares", example: false },
            { label: "Horas de extensão", ...formation.extension, href: "/meus-estudos/extensao", example: true },
         ].map(item => (
            <Link className="student-hours-row" to={item.href} key={item.label}>
               <span>
                  <strong>{item.label}</strong>
                  <ArrowRight size={15} />
               </span>
               <div>
                  <b>{item.done}h</b>
                  <small>
                     {" "}
                     de {item.total}h{item.example ? " · exemplo" : ""}
                  </small>
               </div>
               <progress value={item.done} max={item.total} aria-label={`${item.label}: ${item.done} de ${item.total} horas`} />
               <small>Faltam {item.total - item.done}h</small>
            </Link>
         ))}
         <Link className="student-text-link" to="/meus-estudos/atividades">
            Entender e registrar minhas horas <ArrowRight size={14} />
         </Link>
      </section>
   );
}
function NextClass({ compact = false }: { compact?: boolean }) {
   return (
      <section
         className={"student-next-class" + (compact ? " compact" : "")}
         aria-labelledby={compact ? "study-next-class" : "home-next-class"}
      >
         <div>
            <div className="student-class-time">
               <Clock3 size={16} />
               <strong>Hoje, 21h às 22h40</strong>
            </div>
            <h2 id={compact ? "study-next-class" : "home-next-class"}>Bases da Administração Moderna</h2>
            <p>
               <MapPin size={15} />
               Aula on-line <span>·</span> Rômulo Prezotto
            </p>
            <div className="student-class-actions">
               <a className="replica-button" href={disciplines[0].ava} target="_blank" rel="noopener noreferrer">
                  Entrar na aula <ExternalLink size={15} />
               </a>
               <Link to="/horarios">
                  Ver meus horários <ArrowRight size={14} />
               </Link>
            </div>
         </div>
         {!compact && <img src="/replica/workspace.svg" alt="" />}
      </section>
   );
}
function StudentHome({ showOverlay }: { showOverlay: Props["showOverlay"] }) {
   const { state } = useDemo();
   const charge = chargesFor(state).find(item => !item.paid);
   const missing = Math.max(0, 6 - Object.keys(state.docs).length);
   const requests = state.requests.filter(item => ["Em análise", "Aguardando pagamento"].includes(item.status));
   const notice = disciplines.find(item => item.misses >= item.limit * 0.6);
   return (
      <div className="student-page student-home" data-student-ui>
         <header className="student-home-heading">
            <div>
               <h1>Olá, {state.profile.name.split(" ")[0]}.</h1>
               <p>
                  Ciências Contábeis <span>·</span> 2º período <span>·</span> Semestre em andamento
               </p>
            </div>
            <span className="student-today">
               <CalendarDays size={16} />
               Terça, 20 de outubro
            </span>
         </header>
         <div className="student-home-priorities">
            <NextClass />
            <section className="student-next-payment" aria-labelledby="next-payment-title">
               <div className="student-section-heading">
                  <h2 id="next-payment-title">Próximo pagamento</h2>
                  <ReceiptText size={19} />
               </div>
               {charge ? (
                  <>
                     <strong className="student-payment-amount">{currency(charge.amount)}</strong>
                     <p>{charge.name}</p>
                     <div className="student-payment-due">
                        <CalendarDays size={16} />
                        <span>
                           {charge.due < today ? "Venceu em " : "Vence em "}
                           <strong>{formatDate(charge.due, { day: "2-digit", month: "long" })}</strong>
                        </span>
                        {charge.due < today && <span className="student-overdue">Vencida</span>}
                     </div>
                     <Link className="replica-button" to={"/financeiro?cobranca=" + encodeURIComponent(charge.id)}>
                        <QrCode size={17} />
                        Conferir e pagar <ArrowRight size={15} />
                     </Link>
                     <small className="student-data-note">Valor de exemplo · pagamento simulado</small>
                  </>
               ) : (
                  <div className="student-payment-clear">
                     <CheckCircle2 size={28} />
                     <strong>Nenhum pagamento pendente</strong>
                     <p>Você pode consultar o extrato e seus comprovantes.</p>
                     <Link className="student-text-link" to="/financeiro">
                        Abrir financeiro <ArrowRight size={15} />
                     </Link>
                  </div>
               )}
            </section>
         </div>
         <div className="student-home-body">
            <div className="student-home-main">
               <section className="student-attention" aria-labelledby="home-attention-title">
                  <div className="student-section-heading">
                     <h2 id="home-attention-title">O que precisa da sua atenção</h2>
                     <span className="student-count">{(missing ? 1 : 0) + (notice ? 1 : 0) + (state.scenario === "dp" ? 1 : 0)}</span>
                  </div>
                  <div className="student-attention-list">
                     {missing ? (
                        <Link to="/perfil/documentos#documentos-matricula">
                           <FileCheck2 size={20} />
                           <span>
                              <strong>{missing === 1 ? "Falta enviar 1 documento" : `Faltam enviar ${missing} documentos`}</strong>
                              <small>Complete seus documentos de matrícula e acompanhe a conferência.</small>
                           </span>
                           <ArrowRight size={17} />
                        </Link>
                     ) : (
                        <Link to="/perfil/documentos">
                           <CheckCircle2 size={20} />
                           <span>
                              <strong>Documentos enviados</strong>
                              <small>Acompanhe a conferência da secretaria.</small>
                           </span>
                           <ArrowRight size={17} />
                        </Link>
                     )}
                     {notice && (
                        <Link to={"/perfil/notas-e-faltas?disciplina=" + notice.id}>
                           <TriangleAlert size={20} />
                           <span>
                              <strong>Confira suas faltas em Contabilidade</strong>
                              <small>
                                 {notice.misses} de {notice.limit} faltas toleradas em {notice.name}.
                              </small>
                           </span>
                           <ArrowRight size={17} />
                        </Link>
                     )}
                     {state.scenario === "dp" && (
                        <Link to="/jornada-academica#disciplinas-regularizar">
                           <GraduationCap size={20} />
                           <span>
                              <strong>Há disciplinas para regularizar</strong>
                              <small>Veja suas opções de DP e adaptação na jornada.</small>
                           </span>
                           <ArrowRight size={17} />
                        </Link>
                     )}
                  </div>
               </section>

               <CalendarPreview />
               <section className="student-home-requests">
                  <div className="student-section-heading">
                     <h2>Acompanhe seus pedidos</h2>
                     <Link to="/solicitacao-servicos">
                        Ver todos <ArrowRight size={14} />
                     </Link>
                  </div>
                  {requests.length ? (
                     requests.slice(0, 2).map(request => (
                        <button
                           className="student-request-row"
                           key={request.id}
                           onClick={() => showOverlay({ kind: "request", id: request.id })}
                        >
                           <span>
                              <strong>{request.name}</strong>
                              <small>{request.id}</small>
                           </span>
                           <span className="student-status">{request.status}</span>
                           <ArrowRight size={15} />
                        </button>
                     ))
                  ) : (
                     <p className="student-muted">
                        Você não tem pedidos em andamento. <Link to="/secretaria-virtual">Acessar secretaria virtual</Link>
                     </p>
                  )}
               </section>
            </div>
            <aside className="student-home-aside">
               <FormationSummary />
               <section className="student-course-summary">
                  <h2>Minha jornada no curso</h2>
                  <p>
                     <strong>2º de 8 períodos</strong>
                     <span>12% do curso concluído</span>
                  </p>
                  <progress value={12} max={100} aria-label="12% do curso concluído" />
                  <Link className="student-text-link" to="/jornada-academica">
                     Ver disciplinas e próximos passos <ArrowRight size={14} />
                  </Link>
               </section>
               <section className="student-home-communications">
                  <Bell size={21} />
                  <h2>Avisos e comunicados</h2>
                  <p>Retornos dos seus pedidos, informações acadêmicas e assuntos que você escolheu acompanhar.</p>
                  <Link className="student-text-link" to="/comunicados">
                     Ver meus avisos <ArrowRight size={14} />
                  </Link>
               </section>
            </aside>
         </div>
      </div>
   );
}
function Studies() {
   return (
      <div className="student-page" data-student-ui>
         <header className="student-page-heading">
            <div>
               <h1>Meus estudos</h1>
               <p>Aulas, desempenho e atividades da sua formação, juntos.</p>
            </div>
            <a className="replica-button" href={external.ava} target="_blank" rel="noopener noreferrer">
               Acessar o AVA <ExternalLink size={16} />
            </a>
         </header>
         <SectionNavigation path="/meus-estudos" />
         <NextClass compact />
         <div className="student-studies-columns">
            <div>
               <section>
                  <h2>Aulas e desempenho</h2>
                  <DestinationList
                     items={[
                        {
                           label: "Notas e faltas",
                           href: "/perfil/notas-e-faltas",
                           icon: "history_edu",
                           description: "Veja suas notas, frequência e o que fazer em cada disciplina.",
                        },
                        {
                           label: "Meus horários",
                           href: "/horarios",
                           icon: "schedule",
                           description: "Saiba quando, onde e como será sua próxima aula.",
                        },
                        {
                           label: "Minha jornada no curso",
                           href: "/jornada-academica",
                           icon: "hiking",
                           description: "Entenda o que já concluiu, o que falta e suas opções de DP/adaptação.",
                        },
                        {
                           label: "Avaliar minhas aulas",
                           href: "/avaliar-disciplinas",
                           icon: "rate_review",
                           description: "Dê sua opinião sobre as disciplinas.",
                        },
                        {
                           label: "Avaliação da instituição",
                           href: "/avaliacao-institucional",
                           icon: "school",
                           description: "Participe da avaliação institucional.",
                        },
                     ]}
                  />
               </section>
               <section>
                  <h2>Atividades da minha formação</h2>
                  <DestinationList
                     items={[
                        {
                           label: "Atividades e horas",
                           href: "/meus-estudos/atividades",
                           icon: "hourglass_bottom",
                           description: "Acompanhe horas complementares e de extensão e saiba como registrá-las.",
                        },
                        {
                           label: "Estágio, TCC e Projeto Integrador",
                           href: "/meu-estagio",
                           icon: "work",
                           description: "Encontre regras, relatórios e orientações para sua etapa do curso.",
                        },
                        {
                           label: "Meus certificados",
                           href: "/perfil/certificados",
                           icon: "workspace_premium",
                           description: "Consulte comprovantes das atividades realizadas.",
                        },
                     ]}
                  />
               </section>
            </div>
            <aside>
               <section>
                  <h2>Apoio e escolhas para estudar</h2>
                  <DestinationList items={supportLinks} />
               </section>
               <section className="student-related-guide">
                  <h3>Preciso resolver algo sobre uma disciplina</h3>
                  <p>Comece pela informação que você está consultando. O próximo passo fica junto dela.</p>
                  <Link to="/perfil/notas-e-faltas">
                     Ver nota ou frequência <ArrowRight size={15} />
                  </Link>
                  <Link to="/solicitacao-servicos/compensacao-faltas">
                     Tive um afastamento <ArrowRight size={15} />
                  </Link>
                  <Link to="/solicitacao-servicos/solicitar/CSA_165">
                     Pedir revisão de nota <ArrowRight size={15} />
                  </Link>
                  <Link to="/solicitacao-servicos/dispensa-disciplinas">
                     Já cursei essa disciplina <ArrowRight size={15} />
                  </Link>
               </section>
            </aside>
         </div>
      </div>
   );
}
function Formation({ extensionOnly }: { extensionOnly: boolean }) {
   return (
      <div className="student-page" data-student-ui>
         <header className="student-page-heading">
            <div>
               <h1>{extensionOnly ? "Minhas atividades de extensão" : "Atividades e horas"}</h1>
               <p>Entenda o que faz parte da sua formação e acompanhe cada tipo de atividade.</p>
            </div>
         </header>
         <SectionNavigation path={extensionOnly ? "/meus-estudos/extensao" : "/meus-estudos/atividades"} />
         <div className="student-formation-overview">
            <FormationSummary />
            <section>
               <h2>Qual atividade eu preciso acompanhar?</h2>
               <DestinationList
                  items={[
                     {
                        label: "Horas complementares",
                        href: "/perfil/horas-complementares",
                        icon: "hourglass_bottom",
                        description: "Palestras, cursos, eventos e outras atividades previstas no regulamento.",
                     },
                     {
                        label: "Atividades de extensão",
                        href: "/meus-estudos/extensao",
                        icon: "diversity_3",
                        description: "Projetos e atividades que aproximam sua formação da comunidade.",
                     },
                     {
                        label: "Meus certificados",
                        href: "/perfil/certificados",
                        icon: "workspace_premium",
                        description: "Encontre comprovantes das atividades realizadas.",
                     },
                  ]}
               />
               <p className="student-data-note">
                  Confira em qual atividade suas horas foram registradas. Os requisitos da extensão abaixo são ilustrativos.
               </p>
            </section>
         </div>
         {extensionOnly && (
            <section className="student-extension-records">
               <div className="student-section-heading">
                  <h2>Registros de extensão</h2>
                  <a className="replica-button" href={external.extensao} target="_blank" rel="noopener noreferrer">
                     Acessar sistema de extensão <ExternalLink size={16} />
                  </a>
               </div>
               <p className="student-muted">
                  Exemplos de atividades para avaliar a navegação. Consulte os registros oficiais no sistema de extensão.
               </p>
               {[
                  { name: "Educação financeira para a comunidade", hours: 24, date: "2026-09-18" },
                  { name: "Projeto de orientação financeira", hours: 16, date: "2026-10-09" },
               ].map(activity => (
                  <article className="student-extension-record" key={activity.name}>
                     <div>
                        <h3>{activity.name}</h3>
                        <p>{formatDate(activity.date, { dateStyle: "long" })} · registro de exemplo</p>
                     </div>
                     <strong>{activity.hours}h</strong>
                     <span className="student-status">Validado · exemplo</span>
                  </article>
               ))}
            </section>
         )}
         <section className="student-formation-actions">
            <h2>O que você quer fazer agora?</h2>
            <DestinationList
               items={[
                  {
                     label: extensionOnly ? "Inscrever ou acompanhar uma atividade de extensão" : "Registrar uma atividade complementar",
                     href: extensionOnly ? external.extensao : external.horas,
                     icon: "add_circle",
                     description: "Acesse o sistema responsável pelo registro e acompanhamento.",
                  },
                  {
                     label: "Ver regulamento das atividades complementares",
                     href: external.horasEdital,
                     icon: "menu_book",
                     description: "Confira quais atividades são aceitas e a documentação necessária.",
                  },
                  {
                     label: "Encontrar cursos de extensão",
                     href: external.cursos,
                     icon: "search",
                     description: "Consulte oportunidades de participação.",
                  },
                  {
                     label: "Conferir minha jornada",
                     href: "/jornada-academica",
                     icon: "hiking",
                     description: "Veja como as atividades se relacionam à conclusão do curso.",
                  },
               ]}
            />
         </section>
      </div>
   );
}
function Communications() {
   const { state, update } = useDemo();
   const topics = ["Acadêmico", "Serviços", "Vagas e estágio", "Cursos e eventos", "English Lab"];
   return (
      <div className="student-page student-communications" data-student-ui>
         <header className="student-page-heading">
            <div>
               <h1>Avisos e comunicados</h1>
               <p>Encontre informações do seu semestre e escolha os assuntos extras que quer acompanhar.</p>
            </div>
            <Link className="replica-button secondary" to="/notificacoes">
               Ver todos os 89 avisos <ArrowRight size={16} />
            </Link>
         </header>
         <SectionNavigation path="/comunicados" />
         <div className="student-communications-layout">
            <section>
               <h2>Importantes para a minha rotina</h2>
               <DestinationList
                  items={academicEvents
                     .filter(event => event.start > today)
                     .slice(0, 2)
                     .map(event => ({
                        label: event.title,
                        description: formatDate(event.start) + (event.example ? " · exemplo" : ""),
                        href: "/calendario-academico?evento=" + event.id,
                        icon: "calendar_month",
                     }))}
               />
               <DestinationList
                  items={[
                     {
                        label: "Acompanhar meus pedidos",
                        href: "/solicitacao-servicos",
                        icon: "assignment",
                        description: "Consulte respostas, etapas e documentos das solicitações.",
                     },
                     {
                        label: "Mural e documentos da instituição",
                        href: "/mural",
                        icon: "push_pin",
                        description: "Manuais, regulamentos e comunicados publicados para você.",
                     },
                  ]}
               />
               {state.notificationTopics.includes("Vagas e estágio") && (
                  <DestinationList
                     items={[
                        {
                           label: "Oportunidades de estágio",
                           href: "/notificacoes/76149709",
                           icon: "work",
                           description: "Assunto que você escolheu acompanhar.",
                        },
                     ]}
                  />
               )}
               <p className="student-data-note">
                  Todos os avisos continuam disponíveis. Esta seleção organiza a demonstração e não altera e-mails ou notificações da
                  instituição.
               </p>
            </section>
            <aside className="student-topic-preferences">
               <Bell size={24} />
               <h2>O que eu quero acompanhar</h2>
               <p>Acadêmico e retornos de serviços ficam sempre acessíveis. Escolha os assuntos adicionais.</p>
               {topics.map((topic, i) => (
                  <label key={topic}>
                     <input
                        type="checkbox"
                        checked={i < 2 || state.notificationTopics.includes(topic)}
                        disabled={i < 2}
                        onChange={event =>
                           update(s => ({
                              ...s,
                              notificationTopics: event.target.checked
                                 ? [...s.notificationTopics, topic]
                                 : s.notificationTopics.filter(value => value !== topic),
                           }))
                        }
                     />
                     <span>
                        {topic}
                        <small>{i < 2 ? "Essencial para acompanhar sua vida acadêmica" : "Assunto opcional"}</small>
                     </span>
                  </label>
               ))}
               <CheckCircle2 size={16} />
               <small>Preferências salvas somente neste navegador.</small>
            </aside>
         </div>
      </div>
   );
}
