import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bell, CheckCircle2, ExternalLink } from "lucide-react";
import { useDemo } from "../../cx/state";
import { external } from "../../cx/data";
import type { Overlay } from "../Dialogs";
import Financial, { PixPayment } from "./Financial";
import AcademicCalendar from "./AcademicCalendar";
import { DestinationList, SectionNavigation } from "./Navigation";
import { academicEvents, formatDate, supportLinks, today } from "./model";

import { AcademicPulse, ContextBanner, FormationSummary, HelpCenter, HomeDashboard, SecretariatHub } from "./Experience";

type Props = { path: string; showOverlay: (overlay: Overlay) => void };
export default function StudentPage({ path, showOverlay }: Props) {
   if (path === "/inicio") return <HomeDashboard showOverlay={showOverlay} />;
   if (path === "/secretaria-virtual") return <SecretariatHub />;
   if (path === "/ajuda") return <HelpCenter showOverlay={showOverlay} />;
   if (path === "/financeiro") return <Financial />;
   if (path === "/financeiro/pix") return <PixPayment />;
   if (path === "/calendario-academico") return <AcademicCalendar />;
   if (path === "/meus-estudos/extensao") return <ExtensionRedirect />;
   if (path === "/meus-estudos/atividades") return <Formation extensionOnly={false} />;
   if (path === "/comunicados") return <Communications />;
   return <Studies />;
}
function ExtensionRedirect() {
   useEffect(() => {
      window.location.replace(external.extensao);
   }, []);
   return (
      <div className="student-page" data-student-ui>
         <h1>Prática extensionista</h1>
         <p>Abrindo seu sistema de extensão…</p>
         <a className="replica-button" href={external.extensao}>
            Acessar prática extensionista <ExternalLink size={16} />
         </a>
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
         <ContextBanner
            title="Seu aprendizado tem um caminho."
            action={
               <Link className="replica-button" to="/jornada-academica">
                  Explorar minha jornada <ArrowRight size={16} />
               </Link>
            }
         >
            Acompanhe suas disciplinas, encontre apoio e veja seu próximo passo no curso.
         </ContextBanner>
         <div className="cx-study-overview">
            <AcademicPulse />
            <section className="cx-study-shortcuts">
               <h2>Sua rotina de estudos</h2>
               <DestinationList
                  items={[
                     {
                        label: "Entrar na minha aula",
                        href: external.ava,
                        icon: "laptop_mac",
                        description: "Conteúdos e atividades no AVA.",
                     },
                     {
                        label: "Ver meus horários",
                        href: "/horarios",
                        icon: "calendar_month",
                        description: "Dias, horários e local das aulas.",
                     },
                     {
                        label: "Acompanhar minha formação",
                        href: "/meus-estudos/atividades",
                        icon: "school",
                        description: "Horas complementares e extensão.",
                     },
                  ]}
               />
            </section>
         </div>
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
         <ContextBanner
            title={extensionOnly ? "Aprender também é transformar." : "Sua formação vai além da sala de aula."}
            media="study-desk"
            action={
               <a
                  className="replica-button"
                  href={extensionOnly ? external.extensao : external.horas}
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  {extensionOnly ? "Acompanhar extensão" : "Registrar uma atividade"}
                  <ExternalLink size={16} />
               </a>
            }
         >
            Cada atividade acrescenta uma experiência. Acompanhe suas horas e encontre oportunidades para continuar.
         </ContextBanner>
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
                        href: external.extensao,
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
            </section>
         </div>
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
                        description: formatDate(event.start),
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
