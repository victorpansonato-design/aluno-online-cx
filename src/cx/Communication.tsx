import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, CheckCheck, FileText, GraduationCap, Headphones } from "lucide-react";
import { notices, external, normalize } from "./data";
import { useDemo } from "./state";
import { Callout, Empty, Ext, NextLink, Pill, Related, RowLink, SearchField, SectionHead } from "./ui";

export default function Communication() {
   const path = useLocation().pathname;
   return path.startsWith("/avisos") ? <Notices /> : path === "/mural" ? <Mural /> : <Help />;
}

function Notices() {
   const { id } = useParams();
   const { state, update } = useDemo();
   const [q, setQ] = useState("");
   const [filter, setFilter] = useState("Todos");
   if (id) {
      const n = notices.find(n => n.id === id);
      if (!n)
         return (
            <Empty
               title="Aviso não encontrado"
               action={
                  <Link to="/avisos" className="button primary">
                     Ver meus avisos
                  </Link>
               }
            >
               Volte à lista de avisos para encontrar a mensagem.
            </Empty>
         );
      return (
         <>
            <Link className="back-link" to="/avisos">
               <ArrowLeft size={16} />
               Todos os avisos
            </Link>
            <article className="panel notice-article">
               <div className="row-between">
                  <Pill tone="blue">{n.category}</Pill>
                  <span className="muted">{n.date} de 2026 · conteúdo ilustrativo</span>
               </div>
               <h2>{n.title}</h2>
               <p>{n.text}</p>
               <Link className="button primary" to={n.path} onClick={() => update(s => ({ ...s, read: [...new Set([...s.read, n.id])] }))}>
                  {n.action}
                  <ArrowRight size={17} />
               </Link>
               <button
                  className="button ghost"
                  onClick={() => update(s => ({ ...s, read: s.read.includes(n.id) ? s.read.filter(r => r !== n.id) : [...s.read, n.id] }))}
               >
                  {state.read.includes(n.id) ? "Marcar como não lido" : "Marcar como lido"}
               </button>
            </article>
         </>
      );
   }
   const list = notices.filter(
      n =>
         normalize(n.title + " " + n.text).includes(normalize(q)) &&
         (filter !== "Não lidos" || !state.read.includes(n.id)) &&
         (filter !== "Importantes" || n.important),
   );
   return (
      <>
         <div className="toolbar">
            <SearchField value={q} onChange={setQ} placeholder="Buscar nos avisos" />
            <label className="select-field">
               <span>Mostrar</span>
               <select value={filter} onChange={e => setFilter(e.target.value)}>
                  <option>Todos</option>
                  <option>Não lidos</option>
                  <option>Importantes</option>
               </select>
            </label>
            <button className="button secondary" onClick={() => update(s => ({ ...s, read: notices.map(n => n.id) }))}>
               <CheckCheck size={17} />
               Marcar todos como lidos
            </button>
         </div>
         <div className="panel notices-list">
            {list.map(n => (
               <Link className={`notice-row ${state.read.includes(n.id) ? "read" : ""}`} key={n.id} to={"/avisos/" + n.id}>
                  <span className="notice-dot" />
                  <div>
                     <div className="row-between">
                        <Pill tone={n.important ? "blue" : "neutral"}>{n.category}</Pill>
                        <span className="muted">{n.date}</span>
                     </div>
                     <h2>{n.title}</h2>
                     <p>{n.text}</p>
                  </div>
                  <ArrowRight size={19} />
               </Link>
            ))}
         </div>
         {!list.length && <Empty title="Tudo lido ou nenhum resultado">Ajuste os filtros para consultar outros avisos.</Empty>}
      </>
   );
}

function Mural() {
   const [q, setQ] = useState("");
   const [category, setCategory] = useState("Tudo");
   const items = [
      {
         title: "Manual do Aluno · Presencial",
         date: "5 out",
         category: "Manuais",
         href: external.manual,
         description: "Orientações para conhecer a instituição e sua vida acadêmica.",
      },
      {
         title: "Como usar o Google Meet",
         date: "5 out",
         category: "Manuais",
         href: external.meet,
         description: "Um guia para os seus encontros on-line.",
      },
      {
         title: "Manual de monitoria",
         date: "5 out",
         category: "Manuais",
         href: external.manualMonitoria,
         description: "Orientações sobre o programa de monitoria.",
      },
      {
         title: "Disciplinas ofertadas em DP e adaptação · 2026/2",
         date: "22 set",
         category: "Editais",
         href: external.dpEdital,
         description: "Consulte oferta e orientações antes de iniciar sua inscrição.",
      },
      {
         title: "Calendários acadêmicos",
         date: "Consulte o site",
         category: "Calendários",
         href: external.calendario,
         description: "Escolha o calendário de seu curso e modalidade.",
      },
      {
         title: "Cursos de extensão",
         date: "Consulte a oferta",
         category: "Oportunidades",
         href: external.cursos,
         description: "Conheça oportunidades para ampliar sua formação.",
      },
   ];
   items.push(
      {
         title: "Critérios de Rendimento Acadêmico",
         date: "Documento de referência",
         category: "Regulamentos",
         href: external.criterios,
         description: "Consulte as regras oficiais de rendimento e frequência.",
      },
      {
         title: "Regimento do UniAnchieta",
         date: "Documento de referência",
         category: "Regulamentos",
         href: external.regimento,
         description: "Entenda as regras que organizam a vida acadêmica.",
      },
      {
         title: "Regulamento Interno de Trânsito",
         date: "Documento de referência",
         category: "Regulamentos",
         href: external.transito,
         description: "Orientações para circulação no campus.",
      },
      {
         title: "Edital de DP e adaptação · Presencial",
         date: "2026/2",
         category: "Editais",
         href: external.editalDp,
         description: "Consulte critérios e prazos antes da inscrição.",
      },
      {
         title: "Regulamento de Ligas Acadêmicas",
         date: "Documento de referência",
         category: "Regulamentos",
         href: external.ligas,
         description: "Conheça as orientações para as ligas acadêmicas.",
      },
      {
         title: "Regulamento das horas complementares",
         date: "Documento de referência",
         category: "Regulamentos",
         href: external.horasEdital,
         description: "Consulte o que pode ser reconhecido como atividade complementar.",
      },
   );
   const list = items.filter(n => normalize(n.title).includes(normalize(q)) && (category === "Tudo" || category === n.category));
   return (
      <>
         <div className="toolbar">
            <SearchField value={q} onChange={setQ} placeholder="Encontrar manual, edital ou oportunidade" />
         </div>
         <div className="filter-chips">
            {["Tudo", "Manuais", "Editais", "Regulamentos", "Calendários", "Oportunidades"].map(c => (
               <button aria-pressed={category === c} onClick={() => setCategory(c)} key={c}>
                  {c}
               </button>
            ))}
         </div>
         <div className="mural-grid">
            {list.map(n => (
               <article className="panel mural-item" key={n.title}>
                  <div className="row-between">
                     <span className="row-icon">
                        <FileText size={24} />
                     </span>
                     <Pill>{n.category}</Pill>
                  </div>
                  <h2>{n.title}</h2>
                  <p>{n.description}</p>
                  <span className="muted">{n.date}</span>
                  <Ext href={n.href} className="text-link">
                     Abrir documento ou página
                  </Ext>
               </article>
            ))}
         </div>
         {!list.length && <Empty title="Nenhum material com esse filtro">Experimente outro nome ou categoria.</Empty>}
         <Related
            items={[
               { to: "/academico/jornada", title: "Entender dependências e adaptações" },
               { to: "/academico/horas", title: "Conferir o regulamento das horas complementares" },
            ]}
         />
      </>
   );
}

const faqs = [
   {
      q: "Como encontro os conteúdos e as atividades da aula?",
      a: "Abra Minha vida acadêmica, escolha a disciplina e toque em “Acessar conteúdos no AVA”. Você será direcionado ao ambiente de aprendizagem.",
      to: "/academico/disciplinas",
      action: "Encontrar minha disciplina",
   },
   {
      q: "Onde entrego meus documentos de matrícula?",
      a: "Em Meus dados → Meus documentos. Escolha um documento, confira a orientação e envie o arquivo. Depois acompanhe a conferência no mesmo lugar.",
      to: "/meus-dados/documentos",
      action: "Ver meus documentos",
   },
   {
      q: "Preciso de uma declaração de matrícula. Onde peço?",
      a: "A declaração é emitida pela faculdade. Na Secretaria virtual, busque por “atestado de matrícula”. Você pode ver o serviço, pedir e acompanhar o resultado.",
      to: "/secretaria/servicos/CSA_150",
      action: "Conhecer o atestado",
   },
   {
      q: "Fui reprovado em uma matéria. O que é DP?",
      a: "DP significa dependência: uma disciplina que precisa ser cursada novamente. Ela não entra automaticamente na matrícula. Consulte sua jornada e a oferta do semestre para saber como se inscrever.",
      to: "/academico/jornada",
      action: "Ver minha jornada",
   },
   {
      q: "Não concordo com uma nota. O que faço?",
      a: "Confira os lançamentos em Notas e faltas. Na disciplina, use a opção de revisão de nota e confira o prazo e as orientações do serviço.",
      to: "/academico/notas",
      action: "Conferir minhas notas",
   },
   {
      q: "Perdi uma prova. Compensação de faltas resolve?",
      a: "São processos diferentes. Para uma prova perdida, consulte o serviço de prova substitutiva. A compensação trata ausências nas aulas e depende de regras e análise da instituição.",
      to: "/secretaria/servicos/CSA_114",
      action: "Conhecer a prova substitutiva",
   },
   {
      q: "Como acompanho um pedido que já fiz?",
      a: "Abra Secretaria virtual → Minhas solicitações. Escolha o protocolo para ver a etapa atual, as informações e o resultado disponível.",
      to: "/secretaria/solicitacoes",
      action: "Acompanhar meus pedidos",
   },
   {
      q: "Meu certificado conta automaticamente como horas?",
      a: "A validade das atividades depende das regras do curso e da conferência institucional. Confira o histórico de horas e o regulamento antes de registrar uma atividade.",
      to: "/academico/horas",
      action: "Ver minhas horas",
   },
   {
      q: "Um sistema externo pediu meu login de novo. É normal?",
      a: "Alguns recursos do Anchieta funcionam em sistemas próprios. O portal sinaliza quando você está saindo para um deles. Se não conseguir acessar, procure orientação pelos canais oficiais.",
      to: "/secretaria/atendimento",
      action: "Encontrar atendimento",
   },
];
export function Help() {
   const [q, setQ] = useState("");
   return (
      <>
         <section className="help-intro">
            <span className="support-avatar">
               <Headphones size={28} />
            </span>
            <h2>Vamos encontrar seu caminho.</h2>
            <p>Você não precisa conhecer os nomes que a faculdade usa.</p>
            <SearchField value={q} onChange={setQ} placeholder="Qual é sua dúvida?" label="Buscar respostas" />
         </section>
         <section className="panel first-steps-guide">
            <SectionHead title="Primeiros passos no Anchieta" />
            <RowLink
               to="/meus-dados/documentos"
               title="Confira seus documentos de matrícula"
               description="Saiba o que falta e como entregar."
               icon={<FileText size={20} />}
            />
            <RowLink
               to="/academico/horarios"
               title="Descubra quando e onde é sua aula"
               description="Encontre a agenda e o link para entrar."
               icon={<GraduationCap size={20} />}
            />
            <RowLink
               to="/academico/disciplinas"
               title="Conheça suas disciplinas e o AVA"
               description="Acesse os conteúdos e as atividades."
               icon={<BookOpen size={20} />}
            />
         </section>
         <section className="faq-list">
            <h2>Dúvidas que podem ser suas</h2>
            {faqs
               .filter(f => normalize(f.q + " " + f.a).includes(normalize(q)))
               .map(f => (
                  <details className="faq" key={f.q}>
                     <summary>{f.q}</summary>
                     <p>{f.a}</p>
                     <NextLink to={f.to}>{f.action}</NextLink>
                  </details>
               ))}
         </section>
         {q && !faqs.some(f => normalize(f.q + " " + f.a).includes(normalize(q))) && (
            <Empty
               title="Não encontramos essa resposta"
               action={
                  <Link className="button primary" to="/secretaria/atendimento">
                     Encontrar atendimento
                  </Link>
               }
            >
               Tente uma palavra mais curta ou procure orientação.
            </Empty>
         )}
         <Callout title="Sobre a assistente desta demonstração">
            A Ana funciona como um guia de navegação por assuntos. Não consulta dados reais, não envia mensagens à instituição e não usa
            inteligência artificial para gerar respostas.
         </Callout>
         <Related
            items={[
               { to: "/secretaria/atendimento", title: "Ainda preciso de ajuda" },
               { to: "/meus-dados/preferencias", title: "Ajustar texto, movimento e tema" },
            ]}
         />
      </>
   );
}
