import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
   ArrowLeft,
   BookOpen,
   Check,
   ChevronDown,
   ChevronLeft,
   ChevronRight,
   Clock3,
   Download,
   GraduationCap,
   MapPin,
   Plus,
   Star,
   UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { curriculum, disciplines, external, normalize } from "./data";
import { useDemo } from "./state";
import { Callout, DocButton, Empty, Ext, NextLink, Pill, Related, RowLink, SearchField, SectionHead, downloadText } from "./ui";
import { AcademicHome } from "./Home";

export default function Academic() {
   const { pathname } = useLocation();
   if (pathname.startsWith("/academico/matriz/")) return <CurriculumDetail />;
   if (pathname === "/academico") return <AcademicHome />;
   if (pathname.startsWith("/academico/disciplinas/")) return <DisciplineDetail />;
   if (pathname.endsWith("/notas")) return <Grades />;
   if (pathname.endsWith("/horarios")) return <Schedule />;
   if (pathname.endsWith("/jornada")) return <Journey />;
   if (pathname.endsWith("/horas")) return <Hours />;
   if (pathname.includes("/estagio")) return <Internship reports={pathname.endsWith("/relatorios")} />;
   if (pathname.endsWith("/avaliacoes")) return <Evaluation />;
   if (pathname.endsWith("/institucional")) return <Institutional />;
   if (pathname.endsWith("/extensao")) return <ExternalAcademic extension />;
   if (pathname.endsWith("/eletivas")) return <ExternalAcademic />;
   return <Disciplines />;
}

function Disciplines() {
   const [q, setQ] = useState("");
   const [mode, setMode] = useState("Todas");
   const filtered = disciplines.filter(
      d => normalize(d.name + " " + d.teacher).includes(normalize(q)) && (mode === "Todas" || (mode === "EaD" ? d.day === 5 : d.day !== 5)),
   );
   return (
      <>
         <div className="toolbar">
            <SearchField value={q} onChange={setQ} placeholder="Busque uma disciplina ou professor" label="Buscar disciplinas" />
            <label className="select-field">
               <span>Modalidade</span>
               <select value={mode} onChange={e => setMode(e.target.value)}>
                  <option>Todas</option>
                  <option>Com horário</option>
                  <option>EaD</option>
               </select>
            </label>
            <Pill tone="blue">2026 · 2º semestre</Pill>
         </div>
         <div className="discipline-grid">
            {filtered.map(d => (
               <article className="discipline-card" key={d.id}>
                  <div className="row-between">
                     <span className="subject-icon">
                        <BookOpen size={22} />
                     </span>
                     <Pill tone={d.day === 5 ? "neutral" : "blue"}>{d.day === 5 ? "EaD" : "Com horário"}</Pill>
                  </div>
                  <Link to={"/academico/disciplinas/" + d.id}>
                     <h2>{d.name}</h2>
                  </Link>
                  <p className="with-icon">
                     <UserRound size={15} />
                     {d.teacher}
                  </p>
                  <p className="with-icon">
                     <Clock3 size={15} />
                     {d.time}
                  </p>
                  <div className="discipline-footer">
                     <NextLink to={"/academico/disciplinas/" + d.id}>Ver disciplina</NextLink>
                     <Ext href={d.ava} className="icon-link">
                        AVA
                     </Ext>
                  </div>
               </article>
            ))}
         </div>
         {!filtered.length && (
            <Empty
               title="Não encontramos essa disciplina"
               action={
                  <button
                     className="button secondary"
                     onClick={() => {
                        setQ("");
                        setMode("Todas");
                     }}
                  >
                     Limpar filtros
                  </button>
               }
            >
               Tente parte do nome ou o nome do professor.
            </Empty>
         )}
         <Related
            items={[
               { to: "/academico/jornada", title: "Consultar toda a grade do curso" },
               { to: "/secretaria/dispensa", title: "Pedir aproveitamento de uma disciplina" },
            ]}
         />
      </>
   );
}

function DisciplineDetail() {
   const { id } = useParams();
   const d = disciplines.find(d => d.id === id);
   if (!d)
      return (
         <Empty
            title="Disciplina não encontrada"
            action={
               <Link to="/academico/disciplinas" className="button primary">
                  Ver disciplinas
               </Link>
            }
         >
            Escolha uma disciplina do semestre para continuar.
         </Empty>
      );
   return (
      <>
         <Link to="/academico/disciplinas" className="back-link">
            <ArrowLeft size={16} />
            Minhas disciplinas
         </Link>
         <section className="subject-hero">
            <div>
               <Pill tone="blue">2026/2 · {d.hours} horas</Pill>
               <h2>{d.name}</h2>
               <p>{d.teacher}</p>
               <p className="with-icon">
                  <MapPin size={17} />
                  {d.room}
                  <span>·</span>
                  {d.time}
               </p>
            </div>
            <Ext href={d.ava} className="button primary">
               Acessar conteúdos no AVA
            </Ext>
         </section>
         <div className="columns">
            <section className="panel">
               <SectionHead title="Como você está" />
               <div className="metric-pair">
                  <div>
                     <span>Nota parcial</span>
                     <strong>
                        {d.grade?.toLocaleString("pt-BR") ?? "—"}
                        <small> / 10</small>
                     </strong>
                  </div>
                  <div>
                     <span>Faltas registradas</span>
                     <strong>
                        {d.misses}
                        <small> / {d.limit}</small>
                     </strong>
                  </div>
               </div>
               <p className="muted">Dados ilustrativos. A média final e a frequência oficial dependem dos lançamentos da instituição.</p>
               <NextLink to={"/academico/notas?disciplina=" + d.id}>Entender minhas notas e faltas</NextLink>
            </section>
            <section className="panel">
               <SectionHead title="Materiais e atividades" />
               <p className="muted">Seus materiais, entregas e avaliações ficam no ambiente de aprendizagem.</p>
               <Ext href={d.ava}>Abrir esta disciplina no AVA</Ext>
               <RowLink to="/academico/horarios" title="Ver meu próximo encontro" description="Confira o horário e o local da aula." />
            </section>
         </div>
         <Related
            items={[
               { to: "/secretaria/servicos/CSA_165?disciplina=" + d.id, title: "Preciso revisar uma nota" },
               { to: "/secretaria/compensacao?disciplina=" + d.id, title: "Preciso tratar uma ausência" },
               { to: "/academico/avaliacoes?disciplina=" + d.id, title: "Quero avaliar esta aula" },
            ]}
         />
      </>
   );
}

function Grades() {
   const [active, setActive] = useState(new URLSearchParams(useLocation().search).get("disciplina") || "");
   const [q, setQ] = useState("");
   const list = disciplines.filter(d => normalize(d.name).includes(normalize(q)));
   return (
      <>
         <Callout title="Sem precisar decifrar o boletim">
            Abra uma disciplina para entender cada lançamento. A nota parcial pode mudar até o fechamento. Os valores abaixo são exemplos.
         </Callout>
         <div className="toolbar">
            <SearchField value={q} onChange={setQ} placeholder="Encontrar uma disciplina" />
            <Pill tone="blue">Semestre 2026/2</Pill>
         </div>
         <div className="panel grade-panel">
            <div className="grade-header">
               <span>Disciplina</span>
               <span>Nota parcial</span>
               <span>Faltas / limite</span>
               <span />
            </div>
            {list.map(d => (
               <div className="grade-item" key={d.id}>
                  <button className="grade-row" aria-expanded={active === d.id} onClick={() => setActive(active === d.id ? "" : d.id)}>
                     <span>
                        <strong>{d.name}</strong>
                        <small>{d.teacher}</small>
                     </span>
                     <span className="grade-value">{d.grade?.toLocaleString("pt-BR") ?? "—"}</span>
                     <span>
                        <span className="grade-label">Faltas / limite</span>
                        <Pill tone={d.misses / d.limit >= 0.6 ? "amber" : "green"}>
                           {d.misses} / {d.limit}
                        </Pill>
                     </span>
                     <ChevronDown size={18} className={active === d.id ? "rotate" : ""} />
                  </button>
                  {active === d.id && (
                     <div className="grade-detail">
                        <div className="columns">
                           <section>
                              <h3>Lançamentos de notas</h3>
                              <div className="score-line">
                                 <span>
                                    Avaliação 1 <small>Exemplo</small>
                                 </span>
                                 <strong>{d.grade?.toLocaleString("pt-BR") ?? "Aguardando"}</strong>
                              </div>
                              <div className="score-line">
                                 <span>Avaliação 2</span>
                                 <span className="muted">Ainda não lançada</span>
                              </div>
                              <p className="muted">Um campo vazio significa que a nota ainda não foi lançada.</p>
                              <NextLink to={"/secretaria/servicos/CSA_165?disciplina=" + d.id}>Preciso revisar minha nota</NextLink>
                           </section>
                           <section>
                              <h3>Sua frequência</h3>
                              <p>
                                 {d.misses} faltas registradas de {d.limit} toleradas neste exemplo.
                              </p>
                              <progress value={d.misses} max={d.limit} aria-label={`Faltas: ${d.misses} de ${d.limit}`} />
                              <p className="muted">
                                 Faltas são contabilizadas por aula. Confirme os critérios oficiais antes de planejar uma ausência.
                              </p>
                              <NextLink to={"/secretaria/compensacao?disciplina=" + d.id}>Preciso tratar minhas faltas</NextLink>
                           </section>
                        </div>
                        <div className="row-between wrap">
                           <Ext href={d.ava}>Abrir conteúdos no AVA</Ext>
                           <NextLink to={"/academico/disciplinas/" + d.id}>Ver a disciplina</NextLink>
                        </div>
                     </div>
                  )}
               </div>
            ))}
         </div>
         {!list.length && <Empty title="Nenhum resultado">Tente outro nome de disciplina.</Empty>}
         <Related
            items={[
               { to: "/secretaria/servicos/CSA_114", title: "Perdi uma prova: conhecer a prova substitutiva" },
               { to: "/academico/jornada", title: "Ver dependências e adaptações na jornada" },
            ]}
         />
      </>
   );
}

function Schedule() {
   const [day, setDay] = useState(1);
   const [view, setView] = useState("semana");
   const [week, setWeek] = useState(0);
   const dates = Array.from({ length: 6 }, (_, i) => new Date(2026, 9, 19 + week * 7 + i));
   const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
   const list = disciplines.filter(d => d.day === day);
   const exportCalendar = () => {
      const events = disciplines
         .filter(d => d.day < 5)
         .map(d => {
            const date = dates[d.day].toISOString().slice(0, 10).replaceAll("-", "");
            return [
               "BEGIN:VEVENT",
               "UID:demo-" + d.id + "-" + date + "@anchieta-cx.local",
               "DTSTAMP:20261020T120000Z",
               "DTSTART;TZID=America/Sao_Paulo:" + date + "T" + d.time.split(" – ")[0].replace(":", "") + "00",
               "DTEND;TZID=America/Sao_Paulo:" + date + "T" + d.time.split(" – ")[1].replace(":", "") + "00",
               "SUMMARY:DEMONSTRAÇÃO - " + d.name,
               "DESCRIPTION:Agenda ilustrativa. Consulte os horários oficiais.",
               "END:VEVENT",
            ].join("\r\n");
         });
      downloadText(
         "horarios-demonstracao.ics",
         ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Anchieta CX//Demo//PT", ...events, "END:VCALENDAR"].join("\r\n"),
         "text/calendar",
      );
   };
   return (
      <>
         <div className="toolbar">
            <div className="segmented" aria-label="Visualização">
               <button aria-pressed={view === "semana"} onClick={() => setView("semana")}>
                  Semana
               </button>
               <button aria-pressed={view === "mes"} onClick={() => setView("mes")}>
                  Mês
               </button>
            </div>
            <div className="row-between">
               <button aria-label="Semana anterior" className="icon-button" onClick={() => setWeek(week - 1)}>
                  <ChevronLeft size={18} />
               </button>
               <strong>
                  {dates[0].toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} –{" "}
                  {dates[5].toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
               </strong>
               <button aria-label="Próxima semana" className="icon-button" onClick={() => setWeek(week + 1)}>
                  <ChevronRight size={18} />
               </button>
            </div>
            <button className="button secondary" onClick={exportCalendar}>
               <Download size={16} />
               Salvar na agenda
            </button>
         </div>
         {view === "mes" ? (
            <CalendarPage />
         ) : (
            <>
               <div className="days-tabs">
                  {dates.map((date, i) => (
                     <button key={i} aria-pressed={day === i} onClick={() => setDay(i)}>
                        <span>{weekdays[i]}</span>
                        <strong>{date.getDate()}</strong>
                        {i === 1 && week === 0 && <small>Hoje</small>}
                     </button>
                  ))}
               </div>
               <section className="schedule-list">
                  {list.length ? (
                     list.map(d => (
                        <div className="schedule-item" key={d.id}>
                           <div className="time-column">
                              <Clock3 size={18} />
                              <strong>{d.day === 5 ? "EaD" : d.time.split(" – ")[0]}</strong>
                              <span>{d.day === 5 ? "Livre" : d.time.split(" – ")[1]}</span>
                           </div>
                           <div className="schedule-copy">
                              <Pill tone="blue">{d.room}</Pill>
                              <h2>{d.name}</h2>
                              <p>{d.teacher}</p>
                              <div className="row-between wrap">
                                 <NextLink to={"/academico/disciplinas/" + d.id}>Ver disciplina</NextLink>
                                 <Ext href={d.ava}>Acessar aula</Ext>
                              </div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <Empty title="Sem aula com horário neste dia">Aproveite para consultar seus conteúdos assíncronos no AVA.</Empty>
                  )}
               </section>
               <section className="panel">
                  <SectionHead title="Para estudar no seu ritmo" />
                  <p className="muted">Disciplinas EaD não têm horário fixo nesta agenda. Consulte as datas de entrega no AVA.</p>
                  {disciplines
                     .filter(d => d.day === 5)
                     .map(d => (
                        <RowLink
                           key={d.id}
                           to={"/academico/disciplinas/" + d.id}
                           title={d.name}
                           description={d.teacher}
                           icon={<BookOpen size={19} />}
                        />
                     ))}
               </section>
               <Related
                  items={[
                     { to: "/calendario", title: "Consultar o calendário acadêmico" },
                     { to: "/academico/notas", title: "Conferir minhas faltas" },
                  ]}
               />
            </>
         )}
      </>
   );
}

function Journey() {
   const { state } = useDemo();
   const [period, setPeriod] = useState(Number(new URLSearchParams(useLocation().search).get("periodo")) || 2);
   const dp = state.scenario === "dp";
   return (
      <>
         <section className="journey-summary">
            <div>
               <GraduationCap size={30} />
               <h2>Seu caminho até o diploma</h2>
               <p>Ciências Contábeis · 2º de 8 períodos</p>
            </div>
            <div className="journey-percentage">
               <strong>
                  12<span>%</span>
               </strong>
               <span>do curso concluído</span>
            </div>
            <div>
               <p>280 de 2.400 horas concluídas</p>
               <progress value={280} max={2400} aria-label="280 de 2400 horas concluídas" />
               <p className="muted">Valores ilustrativos para navegação.</p>
            </div>
         </section>
         {dp && (
            <Callout title="Uma disciplina precisa de um novo passo" tone="warning">
               Neste cenário fictício, uma disciplina está em dependência. A inscrição é feita separadamente, conforme oferta e edital do
               semestre. <NextLink to="#dependencia">Ver disciplina em dependência</NextLink>
            </Callout>
         )}
         <div className="row-between wrap">
            <SectionHead title="Sua trilha, período a período" />
            <DocButton title="Histórico escolar" label="Baixar histórico de exemplo" />
         </div>
         <div className="periods">
            {Array.from({ length: 8 }, (_, i) => i + 1).map(n => (
               <section className={`period ${period === n ? "expanded" : ""}`} key={n}>
                  <button className="period-trigger" aria-expanded={period === n} onClick={() => setPeriod(period === n ? 0 : n)}>
                     <span className={`period-number ${n === 1 ? "done" : n === 2 ? "current" : ""}`}>
                        {n === 1 ? <Check size={18} /> : n}
                     </span>
                     <span>
                        <strong>{n}º período</strong>
                        <small>{n === 1 ? "Etapa concluída" : n === 2 ? "Você está aqui" : "Próxima etapa da sua formação"}</small>
                     </span>
                     <Pill tone={n === 1 ? "green" : n === 2 ? "blue" : "neutral"}>
                        {n === 1 ? "Concluído" : n === 2 ? "Em curso" : "A cursar"}
                     </Pill>
                     <ChevronDown size={18} />
                  </button>
                  {period === n && (
                     <div className="period-content">
                        {curriculum[n - 1].map((d, i) => (
                           <RowLink
                              to={d.currentId ? "/academico/disciplinas/" + d.currentId : "/academico/matriz/" + n + "/" + i}
                              title={d.name}
                              description={d.hours + " horas · ver detalhes e orientações"}
                              badge={
                                 <Pill tone={n === 1 ? "green" : n === 2 ? "blue" : "neutral"}>
                                    {n === 1 ? "Concluída" : n === 2 ? "Cursando" : "A cursar"}
                                 </Pill>
                              }
                              key={d.name}
                           />
                        ))}
                     </div>
                  )}
               </section>
            ))}
         </div>
         {dp && (
            <section className="panel" id="dependencia">
               <SectionHead title="Dependências e adaptações" />
               <div className="dp-discipline">
                  <div>
                     <Pill tone="amber">Dependência · exemplo fictício</Pill>
                     <h3>Fundamentos de Gestão</h3>
                     <p>Esta disciplina precisa ser cursada novamente.</p>
                  </div>
                  <Ext href={external.dp} className="button primary">
                     Inscrever-me em DP
                  </Ext>
               </div>
               <div className="dp-discipline adaptation-row">
                  <div>
                     <Pill tone="blue">Adaptação · exemplo fictício</Pill>
                     <h3>Contabilidade Introdutória</h3>
                     <p>Disciplina adicional para adequar a formação à matriz do curso.</p>
                  </div>
                  <Ext href={external.dp} className="button primary">
                     Inscrever-me em adaptação
                  </Ext>
               </div>
               <Ext href={external.dpEdital} className="text-link">
                  Consultar disciplinas ofertadas e orientações
               </Ext>
               <p className="muted">
                  A disponibilidade e os requisitos são confirmados no sistema de inscrição. O protótipo não garante vaga.
               </p>
            </section>
         )}
         <Related
            items={[
               { to: "/secretaria/dispensa", title: "Já cursei uma matéria: pedir aproveitamento" },
               { to: "/academico/horas", title: "Ver o que falta nas horas complementares" },
               { to: "/secretaria/formatura", title: "Entender os passos para a formatura" },
            ]}
         />
      </>
   );
}

function Hours() {
   return (
      <>
         <section className="panel">
            <SectionHead title="Seu progresso em atividades" />
            <div className="hours-summary">
               <strong>
                  26<span> de 160 horas</span>
               </strong>
               <Pill tone="blue">16% concluído</Pill>
            </div>
            <progress value={26} max={160} aria-label="26 de 160 horas complementares" />
            <p>Faltam 134 horas neste exemplo. Atividades precisam passar pela validação da instituição.</p>
            <div className="actions">
               <Ext href={external.horas} className="button primary">
                  <Plus size={16} />
                  Registrar atividade no sistema
               </Ext>
               <Ext href={external.horasEdital}>Consultar regulamento</Ext>
            </div>
         </section>
         <section className="panel">
            <SectionHead title="Atividades registradas" />
            <p className="muted">Histórico ilustrativo. Os registros abaixo não alteram sua situação real.</p>
            {[
               { name: "Encontro de Gestão e Negócios", h: 10, date: "22 set 2026" },
               { name: "The English Lab", h: 5, date: "23 set 2026" },
               { name: "Tecnologia e sociedade", h: 5, date: "1 abr 2026" },
               { name: "Conexões na era da IA", h: 5, date: "4 mar 2026" },
               { name: "Palestra de formação", h: 1, date: "19 mar 2026" },
            ].map(a => (
               <div className="activity-row" key={a.name}>
                  <span className="row-icon">
                     <Check size={18} />
                  </span>
                  <div>
                     <h3>{a.name}</h3>
                     <p>{a.date}</p>
                  </div>
                  <strong>{a.h}h</strong>
                  <Pill tone="green">Validada · exemplo</Pill>
               </div>
            ))}
         </section>
         <Related
            items={[
               { to: "/meus-dados/certificados", title: "Ver certificados de atividades concluídas" },
               { to: "/academico/extensao", title: "Conhecer a prática extensionista" },
               { to: "/mural", title: "Encontrar oportunidades e regulamentos" },
            ]}
         />
      </>
   );
}

function Internship({ reports }: { reports: boolean }) {
   const [show, setShow] = useState(false);
   const [sent, setSent] = useState(false);
   if (reports)
      return (
         <>
            <Callout title="Exemplo de entrega local">Esta demonstração não envia relatórios ao portal de estágios.</Callout>
            {sent ? (
               <Empty
                  title="Relatório registrado na demonstração"
                  action={
                     <Link to="/academico/estagio" className="button primary">
                        Voltar ao estágio
                     </Link>
                  }
               >
                  Seu arquivo não foi enviado nem armazenado. A entrega existe somente neste exemplo.
               </Empty>
            ) : (
               <section className="panel">
                  <SectionHead title="Meus relatórios" />
                  <Empty
                     title="Nenhum relatório por aqui"
                     action={
                        <button className="button primary" onClick={() => setShow(true)}>
                           <Plus size={16} />
                           Experimentar uma entrega
                        </button>
                     }
                  >
                     Quando seu curso tiver estágio, você poderá acompanhar suas entregas.
                  </Empty>
                  {show && (
                     <form
                        className="form-stack"
                        onSubmit={e => {
                           e.preventDefault();
                           setSent(true);
                           toast.success("Entrega simulada registrada");
                        }}
                     >
                        <label>
                           Título do relatório
                           <input required maxLength={100} placeholder="Ex.: Relatório mensal de atividades" />
                        </label>
                        <label>
                           Período de referência
                           <input required type="month" defaultValue="2026-10" />
                        </label>
                        <label>
                           Arquivo de exemplo
                           <input required type="file" accept=".pdf,.doc,.docx" />
                        </label>
                        <p className="muted">Utilize apenas um arquivo de teste, sem dados pessoais.</p>
                        <button className="button primary">Registrar entrega simulada</button>
                     </form>
                  )}
               </section>
            )}
         </>
      );
   return (
      <>
         <section className="feature-strip">
            <GraduationCap size={34} />
            <div>
               <h2>Teoria e prática, juntas.</h2>
               <p>Documentos de estágio, relatórios e orientação para TCC e Projeto Integrador.</p>
            </div>
         </section>
         <div className="columns">
            <section className="panel">
               <SectionHead title="Meu estágio" />
               <Empty title="Nenhum estágio na grade deste cenário">
                  Quando houver estágio previsto, seus componentes e requisitos aparecerão aqui.
               </Empty>
               <NextLink to="/academico/estagio/relatorios">Consultar relatórios de estágio</NextLink>
            </section>
            <section className="panel">
               <SectionHead title="TCC e Projeto Integrador" />
               <p>As orientações dependem do curso e do período. Procure a coordenação para confirmar requisitos, entregas e prazos.</p>
               <NextLink to="/secretaria/atendimento?assunto=estagio">Pedir orientação à coordenação</NextLink>
               <RowLink
                  to="/secretaria/servicos/CSA_117"
                  title="Preciso de uma carta de estágio"
                  description="Peça pela secretaria virtual."
               />
            </section>
         </div>
         <div className="actions">
            <Ext href={external.estagio} className="button primary">
               Acessar o Portal de Estágios
            </Ext>
            <Ext href={external.estagioManual}>Consultar manual de relatórios</Ext>
         </div>
         <Callout title="Acompanhe sua vida profissional">
            O acesso usa a entrada oficial de candidatos, observada em um aviso do portal. A autenticação acontece no sistema externo.
         </Callout>
         <Related
            items={[
               { to: "/secretaria/servicos?categoria=Estágio%20e%20extensão", title: "Encontrar documentos para estágio e extensão" },
               { to: "/academico/jornada", title: "Ver minha grade e os próximos períodos" },
            ]}
         />
      </>
   );
}

function ExternalAcademic({ extension = false }: { extension?: boolean }) {
   return (
      <>
         <section className="feature-strip">
            <BookOpen size={34} />
            <div>
               <h2>{extension ? "Aprender também é transformar." : "Sua formação pode seguir novos caminhos."}</h2>
               <p>
                  {extension
                     ? "Encontre suas práticas, acompanhe as atividades e consulte orientações no sistema dedicado."
                     : "Consulte a oferta, os requisitos e o período de escolha no sistema de eletivas."}
               </p>
            </div>
         </section>
         <section className="panel prose">
            <h2>{extension ? "Como acompanhar sua prática" : "Como escolher uma eletiva"}</h2>
            <ol>
               <li>Consulte as opções disponíveis para seu curso.</li>
               <li>Confira orientações, requisitos e prazos no sistema.</li>
               <li>Guarde a confirmação e acompanhe a atividade.</li>
            </ol>
            <Ext href={extension ? external.extensao : external.eletivas} className="button primary">
               {extension ? "Abrir minhas práticas" : "Consultar eletivas"}
            </Ext>
            <p className="muted">Você vai para outro sistema do Anchieta. Ele pode pedir sua autenticação.</p>
         </section>
         <Related
            items={
               extension
                  ? [
                       { to: "/secretaria/servicos/CSA_126", title: "Pedir carta para prática extensionista" },
                       { to: "/secretaria/servicos/CSA_110", title: "Pedir declaração de prática extensionista" },
                    ]
                  : [
                       { to: "/academico/disciplinas", title: "Ver minhas disciplinas do semestre" },
                       { to: "/secretaria/atendimento", title: "Tirar uma dúvida sobre a escolha" },
                    ]
            }
         />
      </>
   );
}

function Evaluation() {
   const { state, update } = useDemo();
   const [selected, setSelected] = useState(state.savedRating);
   const [comment, setComment] = useState("");
   const submitted = state.ratings["2026-10-20"];
   return submitted ? (
      <Empty
         title="Obrigado por compartilhar sua experiência"
         action={
            <Link to="/academico" className="button primary">
               Voltar para meus estudos
            </Link>
         }
      >
         Sua avaliação foi salva somente neste navegador. Nenhuma resposta foi enviada à instituição.
      </Empty>
   ) : (
      <>
         <Callout title="Sua experiência importa">
            No portal real, a avaliação de aula é apresentada como anônima. Aqui, as respostas ficam somente na demonstração local.
         </Callout>
         <section className="panel evaluation">
            <Pill tone="blue">Aula de 20 de outubro · exemplo</Pill>
            <h2>Bases da Administração Moderna</h2>
            <p>Rômulo Prezotto · 21:00 – 22:40</p>
            <form
               onSubmit={e => {
                  e.preventDefault();
                  update(s => ({ ...s, ratings: { ...s.ratings, "2026-10-20": selected } }));
                  toast.success("Avaliação salva na demonstração");
               }}
            >
               <fieldset>
                  <legend>Como foi sua aula?</legend>
                  <div className="rating-options">
                     {[1, 2, 3, 4, 5].map(n => (
                        <label key={n} className={selected === n ? "selected" : ""}>
                           <input
                              type="radio"
                              name="rating"
                              required
                              value={n}
                              checked={selected === n}
                              onChange={() => {
                                 setSelected(n);
                                 update(s => ({ ...s, savedRating: n }));
                              }}
                           />
                           <Star size={25} fill={n <= selected ? "currentColor" : "none"} />
                           <span>{n}</span>
                        </label>
                     ))}
                  </div>
                  <div className="row-between muted">
                     <span>Precisa melhorar</span>
                     <span>Foi excelente</span>
                  </div>
               </fieldset>
               <label>
                  Quer contar um pouco mais? <span className="muted">(opcional)</span>
                  <textarea
                     value={comment}
                     onChange={e => setComment(e.target.value)}
                     maxLength={1000}
                     rows={4}
                     placeholder="O que ajudou você a aprender? O que poderia melhorar?"
                  />
               </label>
               <button className="button primary">Salvar avaliação na demonstração</button>
            </form>
         </section>
      </>
   );
}

function Institutional() {
   const { state, update } = useDemo();
   const [show, setShow] = useState(false);
   const [score, setScore] = useState("");
   return (
      <>
         <Empty
            title="Nenhuma avaliação pendente"
            action={
               <button className="button secondary" onClick={() => setShow(!show)}>
                  Conhecer um questionário de exemplo
               </button>
            }
         >
            Quando uma avaliação institucional abrir para você, o acesso ficará disponível aqui.
         </Empty>
         {show && (
            <section className="panel">
               <h2>Questionário ilustrativo</h2>
               {state.ratings.institucional ? (
                  <p className="with-icon">
                     <Check />
                     Resposta salva localmente.
                  </p>
               ) : (
                  <form
                     className="form-stack"
                     onSubmit={e => {
                        e.preventDefault();
                        update(s => ({ ...s, ratings: { ...s.ratings, institucional: Number(score) } }));
                     }}
                  >
                     <label>
                        Como você avalia a facilidade de usar o portal?
                        <select required value={score} onChange={e => setScore(e.target.value)}>
                           <option value="">Selecione uma resposta</option>
                           {[1, 2, 3, 4, 5].map(n => (
                              <option key={n} value={n}>
                                 {n} — {["Muito difícil", "Difícil", "Regular", "Fácil", "Muito fácil"][n - 1]}
                              </option>
                           ))}
                        </select>
                     </label>
                     <p className="muted">Resposta restrita ao protótipo, sem envio.</p>
                     <button className="button primary">Salvar resposta local</button>
                  </form>
               )}
            </section>
         )}
         <Related
            items={[
               { to: "/academico/avaliacoes", title: "Avaliar uma aula específica" },
               { to: "/secretaria/atendimento", title: "Preciso de uma resposta individual" },
            ]}
         />
      </>
   );
}

export function CalendarPage() {
   const [month, setMonth] = useState(9);
   const [year, setYear] = useState(2026);
   const [selected, setSelected] = useState(20);
   const shift = (d: number) => {
      const date = new Date(year, month + d, 1);
      setMonth(date.getMonth());
      setYear(date.getFullYear());
      setSelected(1);
   };
   const start = (new Date(year, month, 1).getDay() + 6) % 7;
   const total = new Date(year, month + 1, 0).getDate();
   return (
      <>
         <Callout title="Calendário ilustrativo">
            Datas de aulas nesta demonstração ajudam a explorar a navegação. Para feriados, provas e prazos oficiais, consulte o calendário
            do seu curso.
         </Callout>
         <div className="columns calendar-layout">
            <section className="panel">
               <div className="row-between">
                  <button className="icon-button" aria-label="Mês anterior" onClick={() => shift(-1)}>
                     <ChevronLeft />
                  </button>
                  <h2 className="capitalize">{new Date(year, month, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</h2>
                  <button className="icon-button" aria-label="Próximo mês" onClick={() => shift(1)}>
                     <ChevronRight />
                  </button>
               </div>
               <div className="month-grid">
                  {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => (
                     <span key={"head" + i} className="weekday">
                        {d}
                     </span>
                  ))}
                  {Array.from({ length: start }, (_, i) => (
                     <span key={"blank" + i} />
                  ))}
                  {Array.from({ length: total }, (_, i) => i + 1).map(d => (
                     <button
                        key={d}
                        aria-label={`${d} de ${new Date(year, month, 1).toLocaleDateString("pt-BR", { month: "long" })}`}
                        aria-pressed={selected === d}
                        onClick={() => setSelected(d)}
                        className={selected === d ? "selected" : ""}
                     >
                        {d}
                        {new Date(year, month, d).getDay() === 2 && <i />}
                     </button>
                  ))}
               </div>
            </section>
            <section className="panel">
               <SectionHead title={`${selected} de ${new Date(year, month, 1).toLocaleDateString("pt-BR", { month: "long" })}`} />
               {new Date(year, month, selected).getDay() === 2 ? (
                  <>
                     <Pill tone="blue">Aula ilustrativa</Pill>
                     <h3>Bases da Administração Moderna</h3>
                     <p>21:00 – 22:40 · on-line</p>
                     <NextLink to="/academico/disciplinas/administracao">Ver disciplina</NextLink>
                  </>
               ) : (
                  <p>Nenhum evento ilustrativo neste dia. Consulte a agenda oficial para confirmar.</p>
               )}
               <div className="divider" />
               <Ext href={external.calendario}>Consultar calendário oficial</Ext>
               <p className="muted">Escolha o calendário correspondente ao seu curso e modalidade.</p>
            </section>
         </div>
         <Related
            items={[
               { to: "/academico/horarios", title: "Ver minha semana de aulas" },
               { to: "/mural", title: "Consultar editais e comunicados" },
            ]}
         />
      </>
   );
}

function CurriculumDetail() {
   const { period, index } = useParams();
   const p = Number(period);
   const d = curriculum[p - 1]?.[Number(index)];
   if (!d)
      return (
         <Empty
            title="Disciplina não encontrada"
            action={
               <Link to="/academico/jornada" className="button primary">
                  Voltar à jornada
               </Link>
            }
         >
            Escolha uma disciplina da sua matriz.
         </Empty>
      );
   return (
      <>
         <Link className="back-link" to={"/academico/jornada?periodo=" + p}>
            <ArrowLeft size={16} />
            Voltar ao {p}º período
         </Link>
         <section className="subject-hero">
            <div>
               <Pill tone={p === 1 ? "green" : "neutral"}>{p === 1 ? "Etapa concluída no exemplo" : "Disciplina de etapa futura"}</Pill>
               <h2>{d.name}</h2>
               <p>
                  {d.hours} horas · {p}º período · Ciências Contábeis
               </p>
            </div>
            <GraduationCap size={35} />
         </section>
         <section className="panel prose">
            <h2>{p === 1 ? "Uma conquista no seu caminho" : "Um próximo passo na sua formação"}</h2>
            <p>
               {p === 1
                  ? "Esta disciplina faz parte da etapa concluída no cenário ilustrativo. Consulte seu histórico para ver os lançamentos oficiais."
                  : "Esta disciplina pertence a um período futuro. Ofertas, horários e condições de matrícula são definidos pela instituição a cada semestre."}
            </p>
            <p>Precisa conhecer os conteúdos e o plano de ensino? A secretaria pode orientar sobre a emissão do conteúdo programático.</p>
            <div className="actions">
               <Link className="button primary" to="/secretaria/servicos/CSA_042">
                  Conhecer o serviço de plano de ensino
               </Link>
               <DocButton title={"Ementa de exemplo — " + d.name} />
            </div>
         </section>
         <Related
            items={[
               { to: "/secretaria/dispensa", title: "Já cursei um conteúdo equivalente" },
               { to: "/secretaria/servicos/CSA_048_A", title: "Preciso do meu histórico escolar" },
               { to: "/secretaria/atendimento", title: "Quero tirar uma dúvida sobre a disciplina" },
            ]}
         />
      </>
   );
}
