import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2, ChevronRight, CreditCard, Download, FileText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { external, money } from "./data";
import { useDemo } from "./state";
import { Callout, DocButton, Empty, Ext, Modal, Pill, Related, RowLink, SectionHead, downloadText } from "./ui";

export default function Finance() {
   const path = useLocation().pathname;
   if (path.endsWith("/extrato")) return <Statement />;
   if (path.endsWith("/vencimento")) return <DueDate />;
   if (path.endsWith("/responsavel")) return <Responsible />;
   if (path.endsWith("/informes")) return <Income />;
   return <FinanceHome />;
}

function FinanceHome() {
   const { state, update } = useDemo();
   const [payment, setPayment] = useState(false);
   const pending = state.scenario === "financeiro";
   const services = state.requests.filter(r => r.status === "Aguardando pagamento");
   return (
      <>
         <section className={`finance-status ${pending ? "pending" : ""}`}>
            <span className="finance-status-icon">{pending ? <CreditCard size={31} /> : <ShieldCheck size={31} />}</span>
            <div>
               <Pill tone={pending ? "amber" : "green"}>{pending ? "Exemplo com pendência" : "Tudo em dia"}</Pill>
               <h2>{pending ? "Vamos organizar essa pendência?" : "Uma preocupação a menos."}</h2>
               <p>
                  {pending
                     ? "Consulte o valor, o vencimento e as opções do exemplo abaixo."
                     : "Nenhuma mensalidade pendente neste cenário. Quando uma cobrança for gerada, ela aparece aqui."}
               </p>
            </div>
         </section>
         <div className="columns">
            <section className="panel">
               <SectionHead title="Cobranças em aberto" />
               {pending ? (
                  <div className="bill">
                     <div className="row-between">
                        <Pill tone="amber">Pendente · exemplo</Pill>
                        <span>Vencimento: {state.dueDay}/11/2026</span>
                     </div>
                     <h3>Mensalidade de novembro</h3>
                     <strong className="bill-amount">{money(890)}</strong>
                     <p>Valor fictício para demonstrar o fluxo.</p>
                     <button className="button primary" onClick={() => setPayment(true)}>
                        Ver opções da demonstração
                        <ArrowRight size={17} />
                     </button>
                  </div>
               ) : (
                  <div className="compact-empty">
                     <CheckCircle2 size={28} />
                     <h3>Nenhuma mensalidade em aberto</h3>
                     <p>Você pode consultar o histórico no extrato.</p>
                  </div>
               )}
               {services.map(s => (
                  <RowLink
                     key={s.id}
                     to={"/secretaria/solicitacoes/" + s.id}
                     title={s.name}
                     description={"Serviço de demonstração · " + money(s.price)}
                     badge={<Pill tone="amber">Conferir pedido</Pill>}
                  />
               ))}
            </section>
            <section className="panel">
               <SectionHead title="Meu ano financeiro" to="/financeiro/extrato" action="Ver extrato" />
               <div className="financial-months">
                  {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m, i) => (
                     <button
                        key={m}
                        aria-label={`${m}: ${i === 11 ? "não gerado" : i === 10 && pending ? "pendente" : "sem saldo em aberto"}`}
                        onClick={() => {
                           if (i === 10 && pending) setPayment(true);
                           else
                              toast.info(
                                 i === 11
                                    ? "Cobrança ainda não gerada neste exemplo."
                                    : m + ": sem saldo em aberto no cenário de demonstração.",
                              );
                        }}
                        className={i === 11 ? "future" : i === 10 && pending ? "warning" : ""}
                     >
                        <span>{m}</span>
                        {i === 11 ? <span className="month-dot" /> : i === 10 && pending ? <ClockIcon /> : <CheckCircle2 size={18} />}
                     </button>
                  ))}
               </div>
               <p className="muted">Histórico ilustrativo. Os valores não representam a conta real.</p>
            </section>
         </div>
         <section className="panel">
            <SectionHead title="Documentos e ajustes" />
            <div className="service-shortcuts">
               <RowLink
                  to="/financeiro/extrato"
                  title="Extrato e comprovantes"
                  description="Consulte e exporte o histórico."
                  icon={<FileText size={20} />}
               />
               <RowLink
                  to="/financeiro/vencimento"
                  title="Alterar dia de vencimento"
                  description={"Dia atual no exemplo: " + state.dueDay}
                  icon={<CreditCard size={20} />}
               />
               <RowLink
                  to="/financeiro/responsavel"
                  title="Responsável financeiro"
                  description={state.responsible}
                  icon={<ShieldCheck size={20} />}
               />
               <RowLink
                  to="/financeiro/informes"
                  title="Informes de rendimentos"
                  description="Documentos para a declaração anual."
                  icon={<FileText size={20} />}
               />
            </div>
         </section>
         <div className="context-banner">
            <ShieldCheck size={25} />
            <div>
               <strong>Precisa conversar sobre um pagamento?</strong>
               <p>Consulte as opções no sistema oficial de negociação.</p>
            </div>
            <Ext href={external.negociacao}>Negociação on-line</Ext>
         </div>
         <Related
            items={[
               { to: "/secretaria/servicos/CSA_149", title: "Pedir uma nota fiscal" },
               { to: "/secretaria/atendimento", title: "Tirar uma dúvida sobre cobranças" },
            ]}
         />
         <Modal
            open={payment}
            onClose={() => setPayment(false)}
            title="Cobrança de demonstração"
            description="Mensalidade ilustrativa, sem possibilidade de pagamento real."
         >
            <div className="payment-total">
               <span>Valor fictício</span>
               <strong>{money(890)}</strong>
            </div>
            <Callout title="Nenhum pagamento será realizado">
               Este exemplo não possui QR Code, linha digitável ou dados bancários utilizáveis.
            </Callout>
            <div className="actions">
               <DocButton title="Resumo de cobrança de demonstração" />
               <button
                  className="button primary"
                  onClick={() => {
                     update(s => ({ ...s, scenario: "base" }));
                     setPayment(false);
                     toast.success("Confirmação de pagamento simulada");
                  }}
               >
                  Simular confirmação de pagamento
               </button>
            </div>
         </Modal>
      </>
   );
}
function ClockIcon() {
   return (
      <span aria-hidden="true" className="clock-dot">
         !
      </span>
   );
}

function Statement() {
   const [year, setYear] = useState("2026");
   const [filter, setFilter] = useState("Todos");
   const [selected, setSelected] = useState<string | null>(null);
   const list =
      year === "2026"
         ? Array.from({ length: 11 }, (_, i) => ({
              month: 11 - i,
              title: "Mensalidade de " + new Date(2026, 10 - i, 1).toLocaleDateString("pt-BR", { month: "long" }),
              value: 0,
              type: "Bolsa",
              date: `2026-${String(11 - i).padStart(2, "0")}-12`,
           }))
         : [];
   const filtered = list.filter(r => filter === "Todos" || r.type === filter);
   return (
      <>
         <div className="toolbar">
            <label className="select-field">
               <span>Ano</span>
               <select value={year} onChange={e => setYear(e.target.value)}>
                  <option>2026</option>
                  <option>2025</option>
               </select>
            </label>
            <label className="select-field">
               <span>Tipo</span>
               <select value={filter} onChange={e => setFilter(e.target.value)}>
                  <option>Todos</option>
                  <option>Bolsa</option>
                  <option>Pagamento</option>
               </select>
            </label>
            <button
               className="button secondary"
               onClick={() =>
                  downloadText(
                     "extrato-demonstracao.csv",
                     "Demonstração sem validade\r\nData;Descrição;Valor;Tipo\r\n" +
                        filtered.map(r => `${r.date};${r.title};0,00;${r.type}`).join("\r\n"),
                     "text/csv;charset=utf-8",
                  )
               }
            >
               <Download size={16} />
               Exportar CSV
            </button>
            <button className="button secondary" onClick={() => window.print()}>
               Imprimir extrato
            </button>
         </div>
         <Callout title="Extrato de demonstração">
            Os lançamentos abaixo são fictícios e ilustram um cenário com bolsa. Nenhuma informação bancária da conta real foi copiada.
         </Callout>
         <section className="panel">
            {filtered.length ? (
               filtered.map(r => (
                  <button className="statement-row" key={r.month} onClick={() => setSelected(r.title)}>
                     <span className="statement-date">12/{String(r.month).padStart(2, "0")}</span>
                     <span>
                        <strong>{r.title}</strong>
                        <small>{r.type} · cenário ilustrativo</small>
                     </span>
                     <strong>{money(r.value)}</strong>
                     <ChevronRight size={18} />
                  </button>
               ))
            ) : (
               <Empty title="Nenhum lançamento neste filtro">Tente o ano de 2026 ou selecione todos os tipos.</Empty>
            )}
         </section>
         <Modal
            open={!!selected}
            onClose={() => setSelected(null)}
            title={selected || "Lançamento"}
            description="Detalhes fictícios de um lançamento financeiro."
         >
            <dl className="review-list">
               <div>
                  <dt>Valor do exemplo</dt>
                  <dd>R$ 0,00</dd>
               </div>
               <div>
                  <dt>Tipo</dt>
                  <dd>Bolsa · sem saldo em aberto</dd>
               </div>
               <div>
                  <dt>Situação</dt>
                  <dd>Exemplo sem validade financeira.</dd>
               </div>
            </dl>
            <DocButton title={"Lançamento — " + selected} label="Baixar resumo de exemplo" />
         </Modal>
      </>
   );
}

function DueDate() {
   const { state, update } = useDemo();
   const [day, setDay] = useState(state.dueDay);
   const [confirm, setConfirm] = useState(false);
   return (
      <>
         <Callout title="Vale para cobranças futuras">
            No fluxo observado, boletos já emitidos não mudam. A alteração permanece no mês de competência e não prorroga para o mês
            seguinte.
         </Callout>
         <section className="panel form-panel">
            <h2>Organize o dia do vencimento</h2>
            <p>
               Dia atual neste exemplo: <strong>{state.dueDay} de cada mês</strong>.
            </p>
            <form
               className="form-stack"
               onSubmit={e => {
                  e.preventDefault();
                  setConfirm(true);
               }}
            >
               <label>
                  Novo dia de vencimento
                  <select value={day} onChange={e => setDay(e.target.value)}>
                     {["5", "10", "12", "15", "20"].map(d => (
                        <option value={d} key={d}>
                           Dia {d} de cada mês
                        </option>
                     ))}
                  </select>
               </label>
               <p className="muted">As opções são ilustrativas. Os dias permitidos devem vir das regras do contrato.</p>
               <button className="button primary" disabled={day === state.dueDay}>
                  Revisar alteração local
                  <ArrowRight size={17} />
               </button>
            </form>
         </section>
         <Related
            items={[
               { to: "/financeiro", title: "Conferir cobranças já emitidas" },
               { to: "/secretaria/atendimento", title: "Entender as regras do meu contrato" },
            ]}
         />
         <Modal
            open={confirm}
            onClose={() => setConfirm(false)}
            title="Revisar o vencimento de exemplo"
            description={"Novo vencimento: dia " + day + " de cada mês. A mudança afeta somente a demonstração."}
         >
            <button
               className="button primary"
               onClick={() => {
                  update(s => ({ ...s, dueDay: day }));
                  setConfirm(false);
                  toast.success("Vencimento de exemplo atualizado");
               }}
            >
               Confirmar alteração local
            </button>
         </Modal>
      </>
   );
}

function Responsible() {
   const { state, update } = useDemo();
   const [edit, setEdit] = useState(false);
   const [name, setName] = useState(state.responsible);
   return (
      <>
         <Callout title="A mudança no portal real vale para o próximo semestre">
            O responsável do semestre atual permanece o mesmo. No protótipo, o nome é alterado apenas para visualizar a experiência.
         </Callout>
         <section className="panel">
            <SectionHead title="Responsável do exemplo" />
            <div className="responsible-person">
               <span className="large-avatar">MC</span>
               <div>
                  <h2>{state.responsible}</h2>
                  <p>Documento pessoal não incluído na demonstração.</p>
               </div>
            </div>
            <button
               className="button secondary"
               onClick={() => {
                  setName(state.responsible);
                  setEdit(true);
               }}
            >
               Editar responsável de exemplo
            </button>
         </section>
         <Related
            items={[
               { to: "/secretaria/contratos", title: "Consultar os contratos" },
               { to: "/meus-dados", title: "Conferir meus dados pessoais" },
            ]}
         />
         <Modal
            open={edit}
            onClose={() => setEdit(false)}
            title="Responsável de exemplo"
            description="Use um nome fictício. Nenhum cadastro será alterado na instituição."
         >
            <form
               className="form-stack"
               onSubmit={e => {
                  e.preventDefault();
                  update(s => ({ ...s, responsible: name }));
                  setEdit(false);
                  toast.success("Responsável fictício atualizado");
               }}
            >
               <label>
                  Nome para demonstração
                  <input required minLength={3} maxLength={100} value={name} onChange={e => setName(e.target.value)} />
               </label>
               <button className="button primary">Salvar no exemplo local</button>
            </form>
         </Modal>
      </>
   );
}

function Income() {
   return (
      <>
         <Callout title="Você será direcionado ao sistema oficial">
            Os informes dependem dos dados financeiros e da autenticação do aluno. Os links abaixo foram observados no portal.
         </Callout>
         <section className="panel">
            <SectionHead title="Informe anual" />
            <div className="income-row">
               <FileText size={28} />
               <div>
                  <h2>Ano de referência atual</h2>
                  <p>Confira o ano exibido no documento oficial.</p>
               </div>
               <Ext href={external.informeAtual}>Abrir informe atual</Ext>
            </div>
            <div className="income-row">
               <FileText size={28} />
               <div>
                  <h2>Ano de referência anterior</h2>
                  <p>Use o documento correspondente ao ano que precisa.</p>
               </div>
               <Ext href={external.informeAnterior}>Abrir informe anterior</Ext>
            </div>
         </section>
         <Related
            items={[
               { to: "/financeiro/extrato", title: "Consultar meu extrato" },
               { to: "/secretaria/servicos/CSA_149", title: "Preciso de uma nota fiscal" },
            ]}
         />
      </>
   );
}
