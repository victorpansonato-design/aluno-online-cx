import { useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
   ArrowLeft,
   ArrowRight,
   BookOpen,
   Check,
   CheckCircle2,
   ChevronRight,
   Clock3,
   Copy,
   FileCheck2,
   FileText,
   GraduationCap,
   Headphones,
   HeartHandshake,
   Plus,
   Search,
   ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { disciplines, external, money, normalize, services } from "./data";
import { createProtocol, useDemo, type RequestItem } from "./state";
import { Callout, DocButton, Empty, Ext, Modal, NextLink, Pill, Related, RowLink, SearchField, SectionHead, downloadDocument } from "./ui";

export default function Services() {
   const { pathname } = useLocation();
   if (pathname === "/secretaria") return <SecretariatHome />;
   if (pathname === "/secretaria/servicos") return <Catalog />;
   if (pathname.startsWith("/secretaria/servicos/")) return <ServiceRequest />;
   if (pathname.startsWith("/secretaria/solicitacoes/")) return <RequestDetail />;
   if (pathname === "/secretaria/solicitacoes") return <Requests />;
   if (pathname.endsWith("/compensacao")) return <SpecialForm type="compensacao" />;
   if (pathname.endsWith("/dispensa")) return <SpecialForm type="dispensa" />;
   if (pathname.endsWith("/laboratorios")) return <SpecialForm type="laboratorios" />;
   if (pathname.endsWith("/contratos")) return <Contracts />;
   if (pathname.endsWith("/formatura")) return <Graduation />;
   if (pathname.endsWith("/atendimento")) return <Contact />;
   return <Resource />;
}

function SecretariatHome() {
   const { state } = useDemo();
   const [q, setQ] = useState("");
   const nav = useNavigate();
   return (
      <>
         <section className="secretariat-intro">
            <div className="secretariat-symbol">
               <Headphones size={36} />
            </div>
            <h2>Como a gente pode te ajudar?</h2>
            <p>
               Do atestado de matrícula ao acompanhamento de um pedido.
               <br />
               Sua secretaria, sempre por perto.
            </p>
            <form
               onSubmit={e => {
                  e.preventDefault();
                  nav("/secretaria/servicos?q=" + encodeURIComponent(q));
               }}
               className="service-search"
            >
               <Search size={21} />
               <input
                  aria-label="O que você precisa na secretaria?"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Ex.: preciso de uma declaração de matrícula"
               />
               <button className="button primary" aria-label="Buscar serviço">
                  <ArrowRight size={19} />
               </button>
            </form>
            <div className="suggestions">
               <span>Mais procurados:</span>
               <Link to="/secretaria/servicos/CSA_150">Atestado de matrícula</Link>
               <Link to="/secretaria/servicos/CSA_048_A">Histórico escolar</Link>
               <Link to="/secretaria/servicos/CSA_114">Prova substitutiva</Link>
            </div>
         </section>
         <div className="columns">
            <section className="panel">
               <SectionHead title="Resolver uma necessidade" to="/secretaria/servicos" action="Todos os 40 serviços" />
               {[
                  {
                     title: "Pedir declarações e documentos",
                     description: "Atestado de matrícula, histórico e outros comprovantes.",
                     to: "/secretaria/servicos?categoria=Declarações",
                     icon: FileText,
                  },
                  {
                     title: "Tratar uma prova ou nota",
                     description: "Revisão, prova substitutiva e reabertura de prazo.",
                     to: "/secretaria/servicos?categoria=Provas%20e%20notas",
                     icon: BookOpen,
                  },
                  {
                     title: "Cuidar da minha matrícula",
                     description: "Curso, turno, turma e orientações de matrícula.",
                     to: "/secretaria/servicos?categoria=Matrícula%20e%20curso",
                     icon: GraduationCap,
                  },
                  {
                     title: "Solicitar apoio e acessibilidade",
                     description: "Condições para estudar e participar melhor.",
                     to: "/secretaria/servicos?categoria=Acessibilidade",
                     icon: HeartHandshake,
                  },
               ].map(({ icon: Icon, ...r }) => (
                  <RowLink {...r} key={r.to} icon={<Icon size={21} />} />
               ))}
            </section>
            <section className="panel">
               <SectionHead title="Acompanhe seus pedidos" to="/secretaria/solicitacoes" action="Ver todos" />
               {state.scenario === "vazio" ? (
                  <Empty title="Seu acompanhamento começa aqui">Depois de pedir um serviço, você poderá ver todas as etapas.</Empty>
               ) : (
                  state.requests
                     .slice(0, 3)
                     .map(r => (
                        <RowLink
                           key={r.id}
                           title={r.name}
                           description={r.id}
                           to={"/secretaria/solicitacoes/" + r.id}
                           badge={<Pill tone={r.status === "Concluído" ? "green" : "blue"}>{r.status}</Pill>}
                        />
                     ))
               )}
               <Link to="/secretaria/servicos" className="button primary full">
                  <Plus size={17} />
                  Fazer uma nova solicitação
               </Link>
            </section>
         </div>
         <section className="panel">
            <SectionHead title="Outros caminhos da secretaria" />
            <div className="service-shortcuts">
               {[
                  { to: "/secretaria/compensacao", title: "Compensação de faltas", description: "Orientações e acompanhamento." },
                  { to: "/secretaria/dispensa", title: "Aproveitar disciplinas", description: "Análise do que você já cursou." },
                  { to: "/secretaria/laboratorios", title: "Reservar laboratório", description: "Consulte recursos e horários." },
                  { to: "/secretaria/contratos", title: "Meus contratos", description: "Consulte e acompanhe assinaturas." },
                  { to: "/secretaria/formatura", title: "Minha formatura", description: "Os passos até a colação de grau." },
                  { to: "/secretaria/atendimento", title: "Falar com o Anchieta", description: "Encontre ajuda para seu caso." },
               ].map(r => (
                  <RowLink {...r} key={r.to} />
               ))}
            </div>
         </section>
         <div className="context-banner">
            <FileCheck2 size={24} />
            <div>
               <strong>Precisa entregar RG, CPF ou histórico do ensino médio?</strong>
               <p>Esses são seus documentos pessoais. Você encontra tudo em Meus dados.</p>
            </div>
            <NextLink to="/meus-dados/documentos">Ir para meus documentos</NextLink>
         </div>
      </>
   );
}

function Catalog() {
   const [params, setParams] = useSearchParams();
   const [q, setQ] = useState(params.get("q") || "");
   const [category, setCategory] = useState(params.get("categoria") || "Todos");
   const [cost, setCost] = useState("Todos");
   const categories = ["Todos", ...new Set(services.map(s => s.category))];
   const terms = normalize(q)
      .split(/\s+/)
      .filter(t => t.length > 2 && !["preciso", "uma", "meu", "para", "quero", "pedir", "minha"].includes(t));
   const list = services.filter(s => {
      const text = normalize(s.name + " " + s.original + " " + s.keywords + " " + s.code);
      return (
         terms.every(t => text.includes(t)) &&
         (category === "Todos" || s.category === category) &&
         (cost === "Todos" || (cost === "Gratuitos" ? s.price === 0 : s.price > 0))
      );
   });
   return (
      <>
         <div className="toolbar">
            <SearchField
               value={q}
               onChange={v => {
                  setQ(v);
                  setParams(
                     p => {
                        p.set("q", v);
                        return p;
                     },
                     { replace: true },
                  );
               }}
               placeholder="O que você precisa? Busque também pelo nome antigo."
               label="Buscar nos 40 serviços"
            />
            <label className="select-field">
               <span>Custo</span>
               <select value={cost} onChange={e => setCost(e.target.value)}>
                  <option>Todos</option>
                  <option>Gratuitos</option>
                  <option>Pagos</option>
               </select>
            </label>
         </div>
         <div className="filter-chips" aria-label="Categorias de serviço">
            {categories.map(c => (
               <button
                  key={c}
                  aria-pressed={category === c}
                  onClick={() => {
                     setCategory(c);
                     setParams(
                        p => {
                           p.set("categoria", c);
                           return p;
                        },
                        { replace: true },
                     );
                  }}
               >
                  {c}
               </button>
            ))}
         </div>
         <div className="row-between">
            <p className="muted" role="status">
               {list.length} {list.length === 1 ? "serviço encontrado" : "serviços encontrados"}
            </p>
            <NextLink to="/secretaria/solicitacoes">Ver meus pedidos</NextLink>
         </div>
         <div className="service-catalog">
            {list.map(s => (
               <Link to={"/secretaria/servicos/" + s.code} className="catalog-row" key={s.code}>
                  <span className="row-icon">
                     <FileText size={21} />
                  </span>
                  <div>
                     <span className="category-label">{s.category}</span>
                     <h2>{s.name}</h2>
                     <p>
                        {s.auto ? "Emissão eletrônica" : "Atendimento pela instituição"} <span>· {s.code}</span>
                     </p>
                  </div>
                  <Pill tone={s.price === 0 ? "green" : "neutral"}>{s.price === 0 ? "Gratuito" : money(s.price)}</Pill>
                  <ChevronRight size={19} />
               </Link>
            ))}
         </div>
         {!list.length && (
            <Empty
               title="Vamos tentar de outro jeito?"
               action={
                  <button
                     className="button secondary"
                     onClick={() => {
                        setQ("");
                        setCategory("Todos");
                        setCost("Todos");
                        setParams({});
                     }}
                  >
                     Ver todos os serviços
                  </button>
               }
            >
               Use uma palavra como “matrícula”, “prova” ou “histórico”.
            </Empty>
         )}
         <p className="footnote">
            Nomes, códigos e valores observados no catálogo em 20/10/2026. A instituição deve confirmar a tabela vigente antes da
            implantação.
         </p>
         <Related
            items={[
               { to: "/secretaria/atendimento", title: "Não encontrei o que preciso" },
               { to: "/meus-dados/documentos", title: "Quero entregar meus documentos pessoais" },
            ]}
         />
      </>
   );
}

function ServiceRequest() {
   const { code } = useParams();
   const [params] = useSearchParams();
   const service = services.find(s => s.code === code);
   const { update } = useDemo();
   const nav = useNavigate();
   const [step, setStep] = useState(0);
   const [detail, setDetail] = useState("");
   const [discipline, setDiscipline] = useState(params.get("disciplina") || "");
   const [accepted, setAccepted] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   if (!service)
      return (
         <Empty
            title="Serviço não encontrado"
            action={
               <Link className="button primary" to="/secretaria/servicos">
                  Voltar ao catálogo
               </Link>
            }
         >
            Procure novamente pelo nome do serviço.
         </Empty>
      );
   const isAcademic = service.category === "Provas e notas" || service.category === "Estágio e extensão";
   const submit = async () => {
      if (submitting) return;
      setSubmitting(true);
      const id = createProtocol();
      const request: RequestItem = {
         id,
         code: service.code,
         name: service.name,
         status: service.price ? "Aguardando pagamento" : service.auto ? "Concluído" : "Em análise",
         date: new Date().toISOString(),
         detail: (discipline ? "Disciplina: " + disciplines.find(d => d.id === discipline)?.name + ". " : "") + detail,
         price: service.price,
      };
      update(s => ({ ...s, scenario: s.scenario === "vazio" ? "base" : s.scenario, requests: [request, ...s.requests] }));
      toast.success("Solicitação criada somente na demonstração");
      nav("/secretaria/solicitacoes/" + id);
   };
   return (
      <>
         <Link className="back-link" to="/secretaria/servicos">
            <ArrowLeft size={16} />
            Todos os serviços
         </Link>
         <ol className="stepper" aria-label="Etapas da solicitação">
            {["Entender o serviço", "Informar os dados", "Revisar e confirmar"].map((s, i) => (
               <li key={s} className={i === step ? "active" : i < step ? "complete" : ""} aria-current={i === step ? "step" : undefined}>
                  <span>{i < step ? <Check size={15} /> : i + 1}</span>
                  {s}
               </li>
            ))}
         </ol>
         <section className="panel service-detail">
            <h2>{service.name}</h2>
            <div className="row-between wrap">
               <Pill tone="blue">{service.category}</Pill>
               <Pill tone={service.price ? "amber" : "green"}>{service.price ? money(service.price) : "Gratuito"}</Pill>
            </div>
            {step === 0 ? (
               <>
                  <p>
                     {service.auto
                        ? "Documento emitido eletronicamente no serviço original. Aqui você pode experimentar a emissão e baixar um exemplo sem validade."
                        : "A secretaria recebe seu pedido, verifica as informações e comunica o andamento. Você acompanha o resultado por protocolo."}
                  </p>
                  <dl className="detail-grid">
                     <div>
                        <dt>Quem atende</dt>
                        <dd>{service.auto ? "Emissão eletrônica" : "Instituição"}</dd>
                     </div>
                     <div>
                        <dt>Prazo de retorno</dt>
                        <dd>Confirmar nas orientações do serviço</dd>
                     </div>
                     <div>
                        <dt>Valor observado</dt>
                        <dd>{service.price ? money(service.price) : "Gratuito"}</dd>
                     </div>
                     <div>
                        <dt>Referência no portal</dt>
                        <dd>{service.code}</dd>
                     </div>
                  </dl>
                  <details className="native-details">
                     <summary>Nome usado no portal atual</summary>
                     <p>{service.original}</p>
                  </details>
                  {["CSA_114", "CSA_165"].includes(service.code) && (
                     <Callout title="Atenção ao prazo de solicitação" tone="warning">
                        {service.original}. Confirme a regra vigente com a instituição. Esta simulação não verifica elegibilidade.
                     </Callout>
                  )}
                  <div className="actions">
                     <button className="button primary" onClick={() => setStep(1)}>
                        Continuar
                        <ArrowRight size={17} />
                     </button>
                     <Link className="button secondary" to="/secretaria">
                        Voltar à secretaria
                     </Link>
                  </div>
               </>
            ) : step === 1 ? (
               <form
                  className="form-stack"
                  onSubmit={e => {
                     e.preventDefault();
                     setStep(2);
                  }}
               >
                  <p className="muted">Use informações fictícias. Tudo fica neste navegador.</p>
                  {isAcademic && (
                     <label>
                        Disciplina relacionada
                        <select value={discipline} onChange={e => setDiscipline(e.target.value)} required>
                           <option value="">Selecione a disciplina</option>
                           {disciplines.map(d => (
                              <option value={d.id} key={d.id}>
                                 {d.name}
                              </option>
                           ))}
                        </select>
                     </label>
                  )}
                  <label>
                     Conte o que você precisa {service.auto ? "(opcional)" : "*"}
                     <textarea
                        required={!service.auto}
                        minLength={service.auto ? 0 : 10}
                        maxLength={1500}
                        value={detail}
                        onChange={e => setDetail(e.target.value)}
                        placeholder="Descreva seu pedido com informações de exemplo."
                        rows={4}
                     />
                  </label>
                  <p className="field-hint">{detail.length}/1500 caracteres. Evite incluir dados pessoais.</p>
                  <div className="actions">
                     <button type="button" className="button secondary" onClick={() => setStep(0)}>
                        Voltar
                     </button>
                     <button className="button primary">
                        Revisar pedido
                        <ArrowRight size={17} />
                     </button>
                  </div>
               </form>
            ) : (
               <>
                  <Callout title="Confira antes de concluir">
                     Este pedido será criado apenas no protótipo. Não será enviado ao Grupo Anchieta.
                  </Callout>
                  <dl className="review-list">
                     <div>
                        <dt>Serviço</dt>
                        <dd>{service.name}</dd>
                     </div>
                     <div>
                        <dt>Custo no catálogo de referência</dt>
                        <dd>{service.price ? money(service.price) : "Gratuito"}</dd>
                     </div>
                     {discipline && (
                        <div>
                           <dt>Disciplina</dt>
                           <dd>{disciplines.find(d => d.id === discipline)?.name}</dd>
                        </div>
                     )}
                     <div>
                        <dt>Informações</dt>
                        <dd>{detail || "Emissão automática de exemplo."}</dd>
                     </div>
                  </dl>
                  <label className="checkbox-label">
                     <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} />
                     Entendi que estou criando uma solicitação de demonstração.
                  </label>
                  <div className="actions">
                     <button className="button secondary" onClick={() => setStep(1)}>
                        Editar informações
                     </button>
                     <button className="button primary" disabled={!accepted || submitting} onClick={submit}>
                        {submitting ? "Registrando…" : "Confirmar pedido de demonstração"}
                        <Check size={17} />
                     </button>
                  </div>
               </>
            )}
         </section>
         <Related
            items={[
               { to: "/secretaria/solicitacoes", title: "Acompanhar pedidos já realizados" },
               { to: "/secretaria/atendimento", title: "Tirar uma dúvida sobre este serviço" },
            ]}
         />
      </>
   );
}

function Requests() {
   const { state } = useDemo();
   const [q, setQ] = useState("");
   const [status, setStatus] = useState("Todos");
   const list = (state.scenario === "vazio" ? [] : state.requests).filter(
      r => normalize(r.name + " " + r.id).includes(normalize(q)) && (status === "Todos" || r.status === status),
   );
   return (
      <>
         <div className="toolbar">
            <SearchField value={q} onChange={setQ} placeholder="Buscar serviço ou protocolo" label="Buscar solicitações" />
            <label className="select-field">
               <span>Situação</span>
               <select value={status} onChange={e => setStatus(e.target.value)}>
                  {["Todos", "Em análise", "Aguardando pagamento", "Concluído", "Cancelado"].map(s => (
                     <option key={s}>{s}</option>
                  ))}
               </select>
            </label>
            <Link to="/secretaria/servicos" className="button primary">
               <Plus size={17} />
               Nova solicitação
            </Link>
         </div>
         <p className="muted" role="status">
            {list.length} {list.length === 1 ? "pedido encontrado" : "pedidos encontrados"}
         </p>
         <div className="requests-list">
            {list.map(r => (
               <Link to={"/secretaria/solicitacoes/" + r.id} className="request-list-item" key={r.id}>
                  <div className="row-between">
                     <Pill
                        tone={
                           r.status === "Concluído"
                              ? "green"
                              : r.status === "Cancelado"
                                ? "neutral"
                                : r.status === "Aguardando pagamento"
                                  ? "amber"
                                  : "blue"
                        }
                     >
                        {r.status}
                     </Pill>
                     <span className="muted">{new Date(r.date).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <h2>{r.name}</h2>
                  <p>Protocolo {r.id}</p>
                  <div className="row-between">
                     <span className="muted">
                        {r.status === "Concluído"
                           ? "Seu retorno está disponível"
                           : r.status === "Em análise"
                             ? "Com a secretaria"
                             : r.status === "Cancelado"
                               ? "Pedido encerrado"
                               : "Confira a orientação de pagamento"}
                     </span>
                     <span className="text-link">
                        Ver detalhes
                        <ArrowRight size={17} />
                     </span>
                  </div>
               </Link>
            ))}
         </div>
         {!list.length && (
            <Empty
               title={q || status !== "Todos" ? "Nenhum pedido com esses filtros" : "Seus pedidos vão aparecer aqui"}
               action={
                  q || status !== "Todos" ? (
                     <button
                        className="button secondary"
                        onClick={() => {
                           setQ("");
                           setStatus("Todos");
                        }}
                     >
                        Limpar filtros
                     </button>
                  ) : (
                     <Link to="/secretaria/servicos" className="button primary">
                        Encontrar um serviço
                     </Link>
                  )
               }
            >
               Acompanhe o protocolo, as etapas e o retorno de cada solicitação.
            </Empty>
         )}
      </>
   );
}

function RequestDetail() {
   const { id } = useParams();
   const { state, update } = useDemo();
   const [cancel, setCancel] = useState(false);
   const request = state.requests.find(r => r.id === id);
   if (!request)
      return (
         <Empty
            title="Pedido não encontrado neste navegador"
            action={
               <Link className="button primary" to="/secretaria/solicitacoes">
                  Ver meus pedidos
               </Link>
            }
         >
            A demonstração salva os pedidos localmente. Eles não ficam disponíveis em outro dispositivo.
         </Empty>
      );
   const copy = async () => {
      try {
         await navigator.clipboard.writeText(request.id);
         toast.success("Protocolo copiado");
      } catch {
         toast.error("Não foi possível copiar. Selecione o protocolo exibido.");
      }
   };
   const status = (value: RequestItem["status"]) =>
      update(s => ({ ...s, requests: s.requests.map(r => (r.id === id ? { ...r, status: value } : r)) }));
   return (
      <>
         <Link className="back-link" to="/secretaria/solicitacoes">
            <ArrowLeft size={16} />
            Meus pedidos
         </Link>
         <section className="panel request-full">
            <div className="row-between wrap">
               <Pill tone={request.status === "Concluído" ? "green" : request.status === "Aguardando pagamento" ? "amber" : "blue"}>
                  {request.status}
               </Pill>
               <button className="button secondary" onClick={copy}>
                  <Copy size={15} />
                  {request.id}
               </button>
            </div>
            <h2>{request.name}</h2>
            <p className="muted">Criado em {new Date(request.date).toLocaleString("pt-BR")} · Somente demonstração</p>
            <ol className="tracking">
               <li className="done">
                  <span>
                     <Check size={16} />
                  </span>
                  <div>
                     <strong>Pedido recebido</strong>
                     <p>Suas informações foram registradas no exemplo local.</p>
                  </div>
               </li>
               {request.status !== "Cancelado" && (
                  <li className={request.status === "Concluído" ? "done" : "current"}>
                     <span>{request.status === "Concluído" ? <Check size={16} /> : <Clock3 size={16} />}</span>
                     <div>
                        <strong>
                           {request.status === "Aguardando pagamento" ? "Aguardando etapa financeira" : "Análise da secretaria"}
                        </strong>
                        <p>
                           {request.status === "Aguardando pagamento"
                              ? "O serviço tem custo. Nenhum pagamento é realizado neste protótipo."
                              : "A instituição confere os dados e a elegibilidade no fluxo real."}
                        </p>
                     </div>
                  </li>
               )}
               <li className={request.status === "Cancelado" ? "cancelled" : request.status === "Concluído" ? "done" : ""}>
                  <span>{request.status === "Concluído" ? <Check size={16} /> : <FileCheck2 size={16} />}</span>
                  <div>
                     <strong>{request.status === "Cancelado" ? "Pedido cancelado" : "Retorno disponível"}</strong>
                     <p>
                        {request.status === "Concluído"
                           ? "O exemplo do resultado está disponível abaixo."
                           : request.status === "Cancelado"
                             ? "Este pedido foi encerrado. Não há análise em andamento nem retorno a aguardar."
                             : "O retorno aparece aqui quando a análise termina."}
                     </p>
                  </div>
               </li>
            </ol>
            {request.status === "Concluído" && (
               <div className="result-block">
                  <CheckCircle2 size={25} />
                  <div>
                     <h3>Pedido concluído no exemplo</h3>
                     <p>Você pode baixar um documento ilustrativo, sem validade.</p>
                  </div>
                  <DocButton title={request.name} />
               </div>
            )}
            {request.status === "Aguardando pagamento" && (
               <Callout title={`Valor de referência: ${money(request.price)}`}>
                  <NextLink to="/financeiro">Consultar meu financeiro</NextLink> Uma integração real deve gerar a cobrança e atualizar este
                  protocolo após a confirmação.
               </Callout>
            )}
            <h3>O que você informou</h3>
            <p className="preserve-lines">{request.detail || "Não foram fornecidas observações adicionais."}</p>
            <div className="actions">
               <button
                  className="button secondary"
                  onClick={() => downloadDocument("Protocolo " + request.id, request.name + " — " + request.status)}
               >
                  Baixar protocolo de exemplo
               </button>
               {!["Concluído", "Cancelado"].includes(request.status) && (
                  <button className="button ghost danger-text" onClick={() => setCancel(true)}>
                     Cancelar pedido local
                  </button>
               )}
            </div>
            <details className="demo-tools">
               <summary>Testar o andamento desta demonstração</summary>
               <p>Os botões abaixo mudam somente o estado local para permitir avaliar o fluxo completo.</p>
               <div className="actions">
                  <button className="button secondary" onClick={() => status("Em análise")}>
                     Simular análise
                  </button>
                  <button className="button secondary" onClick={() => status("Concluído")}>
                     Simular conclusão
                  </button>
               </div>
            </details>
         </section>
         <Related
            items={[
               { to: "/secretaria/atendimento?protocolo=" + request.id, title: "Preciso de ajuda com este pedido" },
               { to: "/secretaria/servicos", title: "Encontrar outro serviço" },
            ]}
         />
         <Modal
            open={cancel}
            onClose={() => setCancel(false)}
            title="Cancelar este pedido de demonstração?"
            description="O cancelamento afeta somente o pedido salvo neste navegador."
         >
            <div className="actions">
               <button className="button secondary" onClick={() => setCancel(false)}>
                  Manter pedido
               </button>
               <button
                  className="button primary"
                  onClick={() => {
                     status("Cancelado");
                     setCancel(false);
                     toast.success("Pedido local cancelado");
                  }}
               >
                  Cancelar pedido local
               </button>
            </div>
         </Modal>
      </>
   );
}

function SpecialForm({ type }: { type: "compensacao" | "dispensa" | "laboratorios" }) {
   const { update } = useDemo();
   const nav = useNavigate();
   const [params] = useSearchParams();
   const [discipline, setDiscipline] = useState(params.get("disciplina") || "");
   const [review, setReview] = useState(false);
   const [detail, setDetail] = useState("");
   const [date, setDate] = useState("");
   const [end, setEnd] = useState("");
   const [startTime, setStartTime] = useState("19:00");
   const [endTime, setEndTime] = useState("20:00");
   const [lab, setLab] = useState("");
   const [fileName, setFileName] = useState("");
   const [accepted, setAccepted] = useState(false);
   const name =
      type === "compensacao" ? "Compensação de faltas" : type === "dispensa" ? "Aproveitamento de disciplinas" : "Reserva de laboratório";
   const submit = () => {
      const id = createProtocol();
      update(s => ({
         ...s,
         scenario: s.scenario === "vazio" ? "base" : s.scenario,
         requests: [
            {
               id,
               code: "DEMO_" + type,
               name,
               status: "Em análise",
               date: new Date().toISOString(),
               detail: [
                  detail,
                  discipline ? "Disciplina: " + disciplines.find(d => d.id === discipline)?.name : "",
                  date ? "Data: " + date : "",
                  end ? "Fim: " + end : "",
                  lab ? "Recurso de exemplo: " + lab + " · " + startTime + "–" + endTime : "",
                  fileName ? "Arquivo de teste selecionado (não enviado): " + fileName : "",
               ]
                  .filter(Boolean)
                  .join("\n"),
               price: 0,
            },
            ...s.requests,
         ],
      }));
      nav("/secretaria/solicitacoes/" + id);
      toast.success("Pedido registrado somente na demonstração");
   };
   return (
      <>
         <Callout
            title={
               type === "compensacao"
                  ? "Entenda antes de pedir"
                  : type === "dispensa"
                    ? "O que você já estudou pode ser analisado"
                    : "Disponibilidade ilustrativa"
            }
         >
            {type === "compensacao"
               ? "O atestado não elimina faltas automaticamente. O pedido depende das regras de frequência, da documentação e da análise institucional. Para uma prova perdida, o caminho é a prova substitutiva."
               : type === "dispensa"
                 ? "A equivalência depende da análise do histórico, dos conteúdos e da carga horária. O envio do pedido não garante a dispensa."
                 : "Recursos, locais e horários deste formulário são fictícios. Uma reserva real precisa de disponibilidade e confirmação institucional."}
         </Callout>
         <section className="panel form-panel">
            <ol className="stepper">
               <li className={!review ? "active" : "complete"}>
                  <span>1</span>Informações
               </li>
               <li className={review ? "active" : ""}>
                  <span>2</span>Revisão
               </li>
            </ol>
            <h2>{name}</h2>
            {!review ? (
               <form
                  className="form-stack"
                  onSubmit={e => {
                     e.preventDefault();
                     if (type === "laboratorios" && endTime <= startTime) {
                        toast.error("O horário final deve ser depois do inicial.");
                        return;
                     }
                     setReview(true);
                  }}
               >
                  {type !== "laboratorios" && (
                     <label>
                        Disciplina relacionada
                        <select required value={discipline} onChange={e => setDiscipline(e.target.value)}>
                           <option value="">Selecione</option>
                           {disciplines.map(d => (
                              <option key={d.id} value={d.id}>
                                 {d.name}
                              </option>
                           ))}
                        </select>
                     </label>
                  )}
                  {type === "compensacao" && (
                     <div className="form-columns">
                        <label>
                           Primeiro dia de ausência
                           <input type="date" required value={date} onChange={e => setDate(e.target.value)} />
                        </label>
                        <label>
                           Último dia de ausência
                           <input type="date" required min={date} value={end} onChange={e => setEnd(e.target.value)} />
                        </label>
                     </div>
                  )}
                  {type === "laboratorios" && (
                     <>
                        <label>
                           Recurso de demonstração
                           <select required value={lab} onChange={e => setLab(e.target.value)}>
                              <option value="">Selecione</option>
                              <option>Laboratório de informática · exemplo</option>
                              <option>Espaço de estudos · exemplo</option>
                           </select>
                        </label>
                        <label>
                           Data desejada
                           <input type="date" required min="2026-10-20" value={date} onChange={e => setDate(e.target.value)} />
                        </label>
                        <div className="form-columns">
                           <label>
                              Das
                              <input type="time" required value={startTime} onChange={e => setStartTime(e.target.value)} />
                           </label>
                           <label>
                              Até
                              <input type="time" required min={startTime} value={endTime} onChange={e => setEndTime(e.target.value)} />
                           </label>
                        </div>
                     </>
                  )}
                  <label>
                     {type === "laboratorios" ? "Objetivo da reserva" : "Descreva sua necessidade"}
                     <textarea
                        required
                        minLength={10}
                        maxLength={1000}
                        rows={4}
                        value={detail}
                        onChange={e => setDetail(e.target.value)}
                        placeholder="Use informações fictícias para experimentar o fluxo."
                     />
                  </label>
                  {type !== "laboratorios" && (
                     <label>
                        {type === "compensacao" ? "Atestado de teste" : "Histórico escolar de teste"}
                        <input
                           type="file"
                           required
                           accept=".pdf,.png,.jpg,.jpeg"
                           onChange={e => {
                              const f = e.target.files?.[0];
                              if (f && f.size > 10 * 1024 * 1024) {
                                 e.target.value = "";
                                 setFileName("");
                                 toast.error("Escolha um arquivo de até 10 MB.");
                              } else setFileName(f?.name || "");
                           }}
                        />
                        <small>
                           PDF, JPG ou PNG, até 10 MB. Use um arquivo sem dados pessoais; seu conteúdo não será enviado ou salvo.
                        </small>
                     </label>
                  )}
                  <label className="checkbox-label">
                     <input type="checkbox" required checked={accepted} onChange={e => setAccepted(e.target.checked)} />
                     Entendi que este é um pedido de demonstração, sujeito a regras institucionais no fluxo real.
                  </label>
                  <button className="button primary">
                     Revisar informações
                     <ArrowRight size={17} />
                  </button>
               </form>
            ) : (
               <>
                  <dl className="review-list">
                     <div>
                        <dt>Pedido</dt>
                        <dd>{name}</dd>
                     </div>
                     <div>
                        <dt>Informações</dt>
                        <dd>{detail}</dd>
                     </div>
                     {discipline && (
                        <div>
                           <dt>Disciplina</dt>
                           <dd>{disciplines.find(d => d.id === discipline)?.name}</dd>
                        </div>
                     )}
                     {date && (
                        <div>
                           <dt>Data</dt>
                           <dd>
                              {date}
                              {end && " até " + end}
                           </dd>
                        </div>
                     )}
                     {lab && (
                        <div>
                           <dt>Recurso e horário</dt>
                           <dd>
                              {lab} · {startTime} – {endTime}
                           </dd>
                        </div>
                     )}
                     {fileName && (
                        <div>
                           <dt>Arquivo selecionado</dt>
                           <dd>{fileName} · não enviado</dd>
                        </div>
                     )}
                  </dl>
                  <div className="actions">
                     <button className="button secondary" onClick={() => setReview(false)}>
                        Editar informações
                     </button>
                     <button className="button primary" onClick={submit}>
                        Confirmar pedido de demonstração
                     </button>
                  </div>
               </>
            )}
         </section>
         <Related
            items={
               type === "compensacao"
                  ? [
                       { to: "/secretaria/servicos/CSA_114", title: "Perdi uma prova: pedir substitutiva" },
                       { to: "/academico/notas", title: "Voltar para minhas notas e faltas" },
                    ]
                  : [
                       { to: "/secretaria/solicitacoes", title: "Acompanhar meus pedidos" },
                       { to: "/secretaria/atendimento", title: "Tirar uma dúvida antes de pedir" },
                    ]
            }
         />
      </>
   );
}

function Contracts() {
   const { state, update } = useDemo();
   const [open, setOpen] = useState(false);
   const signed = state.requests.some(r => r.code === "DEMO_CONTRATO");
   return (
      <>
         <Callout title="Documentos que você pode consultar">
            O protótipo não contém contratos reais. A assinatura abaixo serve apenas para testar a atualização do status local.
         </Callout>
         <section className="panel">
            <SectionHead title="Contrato do semestre" />
            <div className="contract-preview">
               <FileText size={34} />
               <div>
                  <h2>Contrato de prestação de serviços educacionais</h2>
                  <p>Semestre 2026/2 · documento ilustrativo</p>
                  <Pill tone={signed ? "green" : "blue"}>{signed ? "Simulação concluída" : "Assinatura de exemplo disponível"}</Pill>
               </div>
            </div>
            <div className="actions">
               <button className="button secondary" onClick={() => setOpen(true)}>
                  Ler exemplo
               </button>
               <DocButton title="Contrato ilustrativo" />
               {!signed && (
                  <button className="button primary" onClick={() => setOpen(true)}>
                     Testar fluxo de assinatura
                  </button>
               )}
            </div>
         </section>
         <Related
            items={[
               { to: "/secretaria/atendimento", title: "Tirar uma dúvida sobre matrícula ou contrato" },
               { to: "/meus-dados/documentos", title: "Conferir meus documentos de matrícula" },
            ]}
         />
         <Modal
            open={open}
            onClose={() => setOpen(false)}
            title="Exemplo de contrato"
            description="Texto demonstrativo, sem efeito jurídico."
         >
            <p>
               Este conteúdo representa o espaço de leitura de um contrato. Em uma implementação real, o documento oficial e o serviço de
               assinatura devem ser integrados e validados pela instituição.
            </p>
            <p>A ação abaixo apenas demonstra a mudança de status no protótipo.</p>
            <button
               className="button primary"
               disabled={signed}
               onClick={() => {
                  update(s => ({
                     ...s,
                     requests: [
                        {
                           id: createProtocol(),
                           code: "DEMO_CONTRATO",
                           name: "Simulação de assinatura",
                           status: "Concluído",
                           date: new Date().toISOString(),
                           detail: "Somente demonstração. Não é uma assinatura contratual.",
                           price: 0,
                        },
                        ...s.requests,
                     ],
                  }));
                  setOpen(false);
                  toast.success("Status de demonstração atualizado");
               }}
            >
               Simular conclusão da assinatura
            </button>
         </Modal>
      </>
   );
}

function Graduation() {
   const { state } = useDemo();
   return (
      <>
         <section className="feature-strip">
            <GraduationCap size={40} />
            <div>
               <h2>Seu diploma começa a ser construído agora.</h2>
               <p>Acompanhe os passos com tranquilidade, desde o primeiro período.</p>
            </div>
         </section>
         <section className="panel">
            <SectionHead title="O que precisa estar em dia" />
            {[
               { name: "Concluir as disciplinas do curso", text: "Você está no 2º de 8 períodos neste exemplo.", to: "/academico/jornada" },
               { name: "Cumprir as horas complementares", text: "26 de 160 horas no cenário ilustrativo.", to: "/academico/horas" },
               {
                  name: "Entregar os documentos de matrícula",
                  text: `${Object.values(state.docs).filter(d => d.status !== "Reenviar").length} de 6 documentos enviados na demonstração.`,
                  to: "/meus-dados/documentos",
               },
               {
                  name: "Confirmar os requisitos do seu curso",
                  text: "Estágio, TCC, extensão e outros critérios devem ser validados pela instituição.",
                  to: "/academico/estagio",
               },
            ].map(r => (
               <RowLink key={r.to} to={r.to} title={r.name} description={r.text} icon={<CheckCircle2 size={20} />} />
            ))}
         </section>
         <Callout title="Ainda é hora de construir sua trajetória">
            A solicitação de colação depende da conclusão e da validação dos requisitos. Você pode conhecer o serviço e tirar suas dúvidas
            desde já.
         </Callout>
         <div className="actions">
            <Link to="/secretaria/servicos/CSA_055" className="button primary">
               Conhecer serviço de colação
               <ArrowRight size={17} />
            </Link>
            <Link to="/secretaria/atendimento" className="button secondary">
               Pedir orientação
            </Link>
         </div>
      </>
   );
}

function Contact() {
   const [params] = useSearchParams();
   return (
      <>
         <section className="panel prose">
            <h2>Vamos encontrar o caminho certo.</h2>
            <p>Comece pelo assunto. Assim, sua dúvida chega com o contexto necessário.</p>
            {params.get("protocolo") && (
               <Callout title={"Sobre o pedido " + params.get("protocolo")}>Tenha este protocolo em mãos ao procurar atendimento.</Callout>
            )}
            <RowLink
               to="/secretaria/servicos"
               title="Preciso de um serviço ou documento"
               description="Encontre o serviço e acompanhe por protocolo."
               icon={<FileText size={21} />}
            />
            <RowLink
               to="/academico"
               title="Tenho uma dúvida sobre meus estudos"
               description="Aulas, disciplinas, notas e atividades."
               icon={<BookOpen size={21} />}
            />
            <RowLink
               to="/financeiro"
               title="Quero resolver uma questão financeira"
               description="Cobranças, extrato e responsável financeiro."
               icon={<ShieldCheck size={21} />}
            />
            <RowLink
               to="/ajuda"
               title="Preciso de ajuda para usar o portal"
               description="Respostas rápidas e primeiros passos."
               icon={<Headphones size={21} />}
            />
            <div className="divider" />
            <h3>Ouvidoria</h3>
            <p>Para manifestações que precisem deste canal, consulte as orientações e os meios de contato oficiais.</p>
            <Ext href={external.ouvidoria}>Ir para a Ouvidoria</Ext>
         </section>
      </>
   );
}

function Resource() {
   const path = useLocation().pathname;
   const kind = path.endsWith("biblioteca") ? "biblioteca" : path.endsWith("monitoria") ? "monitoria" : "cpic";
   const content = {
      biblioteca: {
         title: "Seu próximo aprendizado pode começar em um livro.",
         text: "Acesse os livros digitais no sistema da biblioteca. O acesso pode pedir uma nova autenticação.",
         action: "Abrir biblioteca digital",
         url: external.biblioteca,
      },
      monitoria: {
         title: "Um apoio a mais para aprender.",
         text: "Consulte a oferta e as orientações do programa de monitoria no sistema dedicado.",
         action: "Consultar monitoria",
         url: external.monitoria,
      },
      cpic: {
         title: "Sua curiosidade pode virar pesquisa.",
         text: "Consulte as oportunidades e orientações do CPIC no sistema de iniciação científica.",
         action: "Acessar o CPIC",
         url: external.cpic,
      },
   }[kind];
   return (
      <>
         <section className="feature-strip">
            <BookOpen size={38} />
            <div>
               <h2>{content.title}</h2>
               <p>{content.text}</p>
            </div>
         </section>
         <Ext href={content.url} className="button primary">
            {content.action}
         </Ext>
         <Related
            items={[
               { to: "/academico/disciplinas", title: "Voltar para minhas disciplinas" },
               { to: "/secretaria/atendimento", title: "Preciso de orientação para acessar" },
            ]}
         />
      </>
   );
}
