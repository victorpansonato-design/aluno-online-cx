import { Link } from "react-router-dom";
import {
   ArrowRight,
   ArrowUpRight,
   BookOpen,
   CalendarDays,
   Check,
   CheckCircle2,
   ChevronRight,
   Clock3,
   FileText,
   GraduationCap,
   Headphones,
   MapPin,
   MessagesSquare,
   ShieldCheck,
   Sparkles,
   UserRound,
} from "lucide-react";
import { useDemo } from "./state";
import { disciplines, external, notices } from "./data";
import { Ext, NextLink, Pill, RowLink, SectionHead } from "./ui";

export default function Home() {
   const { state } = useDemo();
   const docs = 6 - Object.values(state.docs).filter(d => d.status !== "Reenviar").length;
   const pending = state.requests.filter(r => r.status === "Em análise");
   return (
      <>
         <div className="welcome">
            <div>
               <h1 id="page-title" tabIndex={-1}>
                  Olá, {state.profile.name.split(" ")[0]}{" "}
                  <span className="greeting-mark" aria-hidden="true">
                     .
                  </span>
               </h1>
               <p>Vamos cuidar do seu próximo passo?</p>
            </div>
            <span className="today">
               <CalendarDays size={17} />
               Terça-feira, 20 de outubro
            </span>
         </div>
         <div className="home-top">
            <section className="next-class">
               <h2>
                  Bases da Administração
                  <br className="desktop-br" /> Moderna
               </h2>
               <div className="next-top">
                  <span>
                     <span className="live-dot" /> Sua próxima aula
                  </span>
                  <span className="onblue-tag">Hoje</span>
               </div>
               <div className="class-info">
                  <span>
                     <Clock3 size={16} />
                     21:00 – 22:40
                  </span>
                  <span>
                     <MapPin size={16} />
                     Aula on-line
                  </span>
               </div>
               <p className="teacher">
                  <UserRound size={15} />
                  Rômulo Prezotto
               </p>
               <div className="next-bottom">
                  <Ext href={disciplines[0].ava} className="button yellow">
                     Entrar na aula
                  </Ext>
                  <Link to="/academico/horarios">
                     Meus horários <ArrowRight size={16} />
                  </Link>
               </div>
               <div className="class-decoration" aria-hidden="true">
                  <BookOpen />
                  <div className="orbit orbit-one" />
                  <div className="orbit orbit-two" />
               </div>
            </section>
            <section className="tasks panel">
               <SectionHead title="O que precisa de você" />
               <div className="task-list">
                  {docs > 0 ? (
                     <Link to="/meus-dados/documentos" className="task">
                        <span className="task-icon warning">
                           <FileText size={19} />
                        </span>
                        <div>
                           <strong>Complete seus documentos</strong>
                           <p>
                              {docs} {docs === 1 ? "documento para enviar" : "documentos para enviar"}
                           </p>
                        </div>
                        <ChevronRight size={17} />
                     </Link>
                  ) : (
                     <Link to="/meus-dados/documentos" className="task">
                        <span className="task-icon success">
                           <Check size={19} />
                        </span>
                        <div>
                           <strong>Documentos enviados</strong>
                           <p>Acompanhe a conferência</p>
                        </div>
                        <ChevronRight size={17} />
                     </Link>
                  )}
                  {state.scenario === "dp" && (
                     <Link to="/academico/jornada" className="task">
                        <span className="task-icon warning">
                           <GraduationCap size={19} />
                        </span>
                        <div>
                           <strong>Confira DP e adaptação</strong>
                           <p>Veja as opções de inscrição</p>
                        </div>
                        <ChevronRight size={17} />
                     </Link>
                  )}
                  <Link to="/financeiro" className="task">
                     <span className={`task-icon ${state.scenario === "financeiro" ? "warning" : "success"}`}>
                        <ShieldCheck size={19} />
                     </span>
                     <div>
                        <strong>{state.scenario === "financeiro" ? "Uma cobrança para conferir" : "Seu financeiro está em dia"}</strong>
                        <p>{state.scenario === "financeiro" ? "Consulte os detalhes" : "Nenhuma cobrança pendente"}</p>
                     </div>
                     <ChevronRight size={17} />
                  </Link>
               </div>
               <p className="quiet-note">
                  <ShieldCheck size={14} />
                  Cada passo fica registrado por aqui.
               </p>
            </section>
         </div>
         <section className="quick-section">
            <SectionHead title="O que você precisa fazer?" />
            <div className="quick-links">
               {[
                  { to: "/academico/notas", title: "Ver notas e faltas", icon: GraduationCap },
                  { to: "/secretaria/servicos", title: "Pedir um serviço", icon: MessagesSquare },
                  { to: "/financeiro", title: "Ver mensalidades", icon: ShieldCheck },
                  { to: "/meus-dados/carteirinha", title: "Minha carteirinha", icon: UserRound },
               ].map(({ to, title, icon: Icon }) => (
                  <Link to={to} key={to}>
                     <Icon size={21} />
                     <span>{title}</span>
                     <ArrowUpRight size={16} />
                  </Link>
               ))}
            </div>
         </section>
         <div className="home-middle">
            <section className="panel">
               <SectionHead title="Seu semestre, de perto" to="/academico/jornada" action="Minha jornada" />
               <div className="semester-progress">
                  <div className="progress-caption">
                     <span>Ciências Contábeis</span>
                     <strong>2º de 8 períodos</strong>
                  </div>
                  <div className="semester-track" role="img" aria-label="2º de 8 períodos">
                     {Array.from({ length: 8 }, (_, i) => (
                        <span className={i === 0 ? "done" : i === 1 ? "current" : ""} key={i} />
                     ))}
                  </div>
                  <div className="semester-numbers">
                     <div>
                        <span className="number">
                           12<span>%</span>
                        </span>
                        <span>do curso concluído</span>
                     </div>
                     <div>
                        <span className="number">8,8</span>
                        <span>média ilustrativa</span>
                     </div>
                     <div>
                        <span className="number">
                           26<span> / 160h</span>
                        </span>
                        <span>horas complementares</span>
                     </div>
                  </div>
               </div>
               <div className="panel-bottom">
                  <BookOpen size={17} />
                  <span>Seu curso acontece um passo de cada vez.</span>
                  <Link to="/academico/disciplinas" aria-label="Ver minhas disciplinas">
                     <ArrowRight size={18} />
                  </Link>
               </div>
            </section>
            <section className="panel">
               <SectionHead title="Seus pedidos" to="/secretaria/solicitacoes" action="Acompanhar" />
               {state.scenario === "vazio" ? (
                  <div className="compact-empty">
                     <CheckCircle2 />
                     <p>Quando você pedir um serviço, acompanhe aqui.</p>
                  </div>
               ) : pending.length ? (
                  pending.slice(0, 2).map(r => (
                     <Link className="request-preview" to={"/secretaria/solicitacoes/" + r.id} key={r.id}>
                        <div className="row-between">
                           <Pill tone="blue">Em análise</Pill>
                           <span className="muted">19 out</span>
                        </div>
                        <h3>{r.name}</h3>
                        <p>{r.id}</p>
                        <div className="mini-timeline">
                           <span className="complete" />
                           <i />
                           <span className="active" />
                           <i />
                           <span />
                        </div>
                        <div className="row-between">
                           <span className="muted">Com a secretaria</span>
                           <ChevronRight size={17} />
                        </div>
                     </Link>
                  ))
               ) : (
                  <div className="compact-empty">
                     <CheckCircle2 />
                     <p>Tudo acompanhado. Nenhum pedido em análise.</p>
                  </div>
               )}
            </section>
         </div>
         <div className="home-lower">
            <section>
               <SectionHead title="Fique por dentro" to="/avisos" action="Todos os avisos" />
               <div className="news-list">
                  {notices.slice(1, 3).map(n => (
                     <Link to={"/avisos/" + n.id} key={n.id}>
                        <span className="news-date">{n.date}</span>
                        <div>
                           <Pill>{n.category}</Pill>
                           <h3>{n.title}</h3>
                        </div>
                        <ArrowUpRight size={19} />
                     </Link>
                  ))}
               </div>
            </section>
            <aside className="support-block">
               <span className="support-avatar">
                  <Headphones size={24} />
               </span>
               <div>
                  <h2>Você não precisa descobrir tudo só.</h2>
                  <p>Encontre respostas e caminhos para resolver o que precisa.</p>
                  <NextLink to="/ajuda">Conte com a gente</NextLink>
               </div>
            </aside>
         </div>
         <section className="first-steps">
            <Sparkles size={20} />
            <div>
               <strong>Chegou agora no Anchieta?</strong>
               <span>Conheça o caminho para começar bem.</span>
            </div>
            <Link to="/ajuda?guia=primeiros-passos" className="button secondary">
               Primeiros passos <ArrowRight size={16} />
            </Link>
         </section>
      </>
   );
}

export function AcademicHome() {
   return (
      <>
         <div className="feature-strip">
            <GraduationCap size={36} />
            <div>
               <h2>Um lugar para acompanhar sua evolução.</h2>
               <p>Da aula de hoje até o diploma. Saiba onde está e qual é o próximo passo.</p>
            </div>
            <Link className="button primary" to="/academico/jornada">
               Ver minha jornada
               <ArrowRight size={17} />
            </Link>
         </div>
         <div className="columns">
            <section className="panel">
               <SectionHead title="Meu semestre" />
               {[
                  {
                     to: "/academico/disciplinas",
                     title: "Minhas disciplinas",
                     description: "Acesse conteúdos e conheça seus professores.",
                  },
                  { to: "/academico/notas", title: "Notas e faltas", description: "Seu desempenho com orientações para seguir." },
                  { to: "/academico/horarios", title: "Meus horários", description: "Dia, horário e local de cada aula." },
                  { to: "/calendario", title: "Calendário acadêmico", description: "Planeje-se para as datas importantes." },
               ].map(i => (
                  <RowLink key={i.to} {...i} icon={<BookOpen size={19} />} />
               ))}
            </section>
            <section className="panel">
               <SectionHead title="Minha formação" />
               {[
                  {
                     to: "/academico/horas",
                     title: "Horas complementares",
                     description: "Registre atividades e acompanhe sua carga horária.",
                  },
                  { to: "/academico/estagio", title: "Estágio, TCC e PI", description: "Orientações, documentos e relatórios." },
                  { to: "/academico/extensao", title: "Prática extensionista", description: "Sua formação em conexão com a comunidade." },
                  { to: "/academico/eletivas", title: "Disciplinas eletivas", description: "Escolha caminhos para sua formação." },
               ].map(i => (
                  <RowLink key={i.to} {...i} icon={<GraduationCap size={19} />} />
               ))}
            </section>
         </div>
         <div className="columns">
            <RowLink
               to="/academico/avaliacoes"
               title="Como foi sua aula?"
               description="Sua experiência ajuda a melhorar o ensino."
               icon={<MessagesSquare size={22} />}
            />
            <RowLink
               to="/academico/institucional"
               title="Avaliação institucional"
               description="Participe quando um questionário estiver disponível."
               icon={<CheckCircle2 size={22} />}
            />
         </div>
         <div className="row-between wrap">
            <Ext href={external.ava}>Abrir ambiente de aprendizagem (AVA)</Ext>
            <NextLink to="/secretaria">Precisa resolver algo? Vá à secretaria</NextLink>
         </div>
      </>
   );
}
