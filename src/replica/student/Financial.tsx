import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, ExternalLink, FileText, QrCode, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "../../cx/state";
import { external } from "../../cx/data";
import { ownersForCharge } from "../../cx/financialResponsibility";
import { ResponsibleBadge } from "./Responsibilities";
import { downloadExample } from "../Dialogs";
import { chargesFor, currency, formatDate, today } from "./model";
import { DestinationList, SectionNavigation } from "./Navigation";

export default function Financial() {
   const { state } = useDemo();
   const [params, setParams] = useSearchParams();
   const [ownerFilter, setOwnerFilter] = useState<string | null>(null);
   const charges = chargesFor(state),
      pending = charges.filter(charge => !charge.paid),
      overdue = pending.filter(charge => charge.due < today),
      paid = charges.filter(charge => charge.paid);
   const owners = [...new Map(pending.flatMap(charge => ownersForCharge(charge.id, state)).map(owner => [owner.id, owner])).values()];
   const visiblePending = pending.filter(
      charge => !ownerFilter || ownersForCharge(charge.id, state).some(owner => owner.id === ownerFilter),
   );
   const selected = (params.get("cobranca") || "").split(",").filter(id => pending.some(charge => charge.id === id));
   const amount = pending.filter(charge => selected.includes(charge.id)).reduce((sum, charge) => sum + charge.amount, 0);
   const hiddenSelected = selected.filter(id => !visiblePending.some(charge => charge.id === id)).length;
   const choose = (id: string) => {
      const next = selected.includes(id) ? selected.filter(value => value !== id) : [...selected, id];
      setParams(next.length ? { cobranca: next.join(",") } : {}, { replace: true });
   };
   return (
      <div className="student-page cx-financial" data-student-ui>
         <header className="student-page-heading">
            <div>
               <h1>Meu financeiro</h1>
               <p>Confira o que precisa pagar, acompanhe pagamentos e encontre seus comprovantes.</p>
            </div>
         </header>
         <SectionNavigation path="/financeiro" />
         <nav className="student-financial-mobile-actions" aria-label="Organizar meu financeiro">
            <Link to="/financeiro/alteracao-vencimento">
               <span className="material-symbols-outlined" aria-hidden="true">
                  event
               </span>
               <span>Alterar vencimento</span>
               <ArrowRight size={14} />
            </Link>
            <Link to="/financeiro/alteracao-responsavel">
               <span className="material-symbols-outlined" aria-hidden="true">
                  person
               </span>
               <span>Responsável financeiro</span>
               <ArrowRight size={14} />
            </Link>
         </nav>
         <section className="cx-financial-overview" aria-label="Resumo financeiro" data-empty-history={!paid.length}>
            <div data-has-overdue={overdue.length > 0}>
               <span>Vencidas</span>
               <strong>{currency(overdue.reduce((sum, charge) => sum + charge.amount, 0))}</strong>
               <small>
                  {overdue.length
                     ? `${overdue.length} ${overdue.length === 1 ? "cobrança vencida em aberto" : "cobranças vencidas em aberto"}`
                     : "Nenhuma cobrança vencida em aberto"}
               </small>
            </div>
            <div>
               <span>Próximo vencimento</span>
               <strong>{pending.length ? formatDate(pending[0].due, { day: "2-digit", month: "short" }) : "Tudo em dia"}</strong>
               <small>{pending.length ? pending[0].name : "Nenhum pagamento pendente"}</small>
            </div>
            <div>
               <span>Pagamentos registrados</span>
               <strong>{paid.length}</strong>
               <small>{paid.length ? "Consulte os resumos abaixo" : "Consulte o histórico no extrato"}</small>
            </div>
         </section>
         <div className="student-financial-layout">
            <section aria-labelledby="pending-charges-title">
               <div className="student-section-heading">
                  <h2 id="pending-charges-title">Cobranças em aberto</h2>
                  <span className="student-count">{ownerFilter ? `${visiblePending.length} de ${pending.length}` : pending.length}</span>
               </div>
               <p className="student-muted">Selecione a cobrança que deseja pagar.</p>
               {owners.length > 0 && (
                  <div className="cx-charge-responsibles" role="group" aria-label="Filtrar cobranças por responsável">
                     <span>Responsável</span>
                     {owners.length > 1 && (
                        <button type="button" aria-pressed={!ownerFilter} onClick={() => setOwnerFilter(null)}>
                           Todos
                        </button>
                     )}
                     {owners.map(owner => (
                        <button
                           type="button"
                           key={owner.id}
                           aria-pressed={ownerFilter === owner.id}
                           onClick={() => setOwnerFilter(ownerFilter === owner.id ? null : owner.id)}
                        >
                           <ResponsibleBadge name={owner.name} />
                           {ownerFilter === owner.id && <Check size={13} aria-hidden="true" />}
                        </button>
                     ))}
                     <Link to="/financeiro/alteracao-responsavel" className="cx-manage-responsibles">
                        Gerenciar
                     </Link>
                  </div>
               )}
               <div className="student-charge-list">
                  {visiblePending.map(charge => (
                     <label key={charge.id} className={"student-charge" + (selected.includes(charge.id) ? " selected" : "")}>
                        <input
                           type="checkbox"
                           checked={selected.includes(charge.id)}
                           onChange={() => choose(charge.id)}
                           aria-label={`Selecionar ${charge.name}`}
                        />
                        <span className="student-charge-description">
                           <strong>{charge.name}</strong>
                           <span>Vencimento em {formatDate(charge.due, { day: "2-digit", month: "long", year: "numeric" })}</span>
                           <small>{charge.request ? "Vinculada ao pedido " + charge.request : "Mensalidade do curso"}</small>
                           <span className="cx-charge-owner-list">
                              <span className="sr-only">Responsável na emissão: </span>
                              {ownersForCharge(charge.id, state).map(owner => (
                                 <ResponsibleBadge key={owner.id} name={owner.name} share={owner.share} />
                              ))}
                           </span>
                           {ownersForCharge(charge.id, state).length > 1 && (
                              <small>Cobrança compartilhada · pagamento pelo valor integral</small>
                           )}
                           {charge.due < today && <b className="student-overdue">Vencida</b>}
                        </span>
                        <strong className="student-charge-value">{currency(charge.amount)}</strong>
                     </label>
                  ))}
               </div>
               {pending.length > 0 && !visiblePending.length && (
                  <div className="student-empty">
                     <p>Nenhuma cobrança para este responsável.</p>
                     <button className="replica-text-button" onClick={() => setOwnerFilter(null)}>
                        Ver todas as cobranças
                     </button>
                  </div>
               )}
               {!pending.length && (
                  <div className="student-empty">
                     <CheckCircle2 size={32} />
                     <h3>Nenhuma cobrança em aberto</h3>
                     <p>Quando houver um próximo pagamento, você poderá acompanhar por aqui e pela home.</p>
                  </div>
               )}
               {pending.length > 0 && (
                  <div className="student-payment-selection" aria-live="polite">
                     <div>
                        <span>
                           {selected.length
                              ? selected.length + " " + (selected.length === 1 ? "cobrança selecionada" : "cobranças selecionadas")
                              : "Selecione uma cobrança para continuar"}
                        </span>
                        <strong>{currency(amount)}</strong>
                        {hiddenSelected > 0 && (
                           <small>
                              {hiddenSelected}{" "}
                              {hiddenSelected === 1 ? "cobrança selecionada fora deste filtro" : "cobranças selecionadas fora deste filtro"}
                              .{" "}
                              <button className="replica-text-button" onClick={() => setOwnerFilter(null)}>
                                 Ver todas
                              </button>
                           </small>
                        )}
                     </div>
                     <Link
                        className={"replica-button" + (!selected.length ? " disabled" : "")}
                        aria-disabled={!selected.length}
                        tabIndex={selected.length ? 0 : -1}
                        to={selected.length ? "/financeiro/pix?cobranca=" + encodeURIComponent(selected.join(",")) : "#"}
                        onClick={event => {
                           if (!selected.length) event.preventDefault();
                        }}
                     >
                        <QrCode size={17} />
                        Continuar para Pix <ArrowRight size={16} />
                     </Link>
                  </div>
               )}
               <section className="student-paid-history" aria-labelledby="paid-history-title">
                  <div className="student-section-heading">
                     <h2 id="paid-history-title">Pagamentos e comprovantes</h2>
                     <Link to="/financeiro/extrato">
                        Ver extrato completo <ArrowRight size={14} />
                     </Link>
                  </div>
                  {paid.length ? (
                     paid.map(charge => (
                        <div className="student-paid-row" key={charge.id}>
                           <CheckCircle2 size={19} />
                           <span>
                              <strong>{charge.name}</strong>
                              <small>{currency(charge.amount)} · pagamento informado</small>
                              <span className="cx-charge-owner-list">
                                 <small>Responsável na emissão</small>
                                 {ownersForCharge(charge.id, state).map(owner => (
                                    <ResponsibleBadge key={owner.id} name={owner.name} share={owner.share} />
                                 ))}
                              </span>
                           </span>
                           <Link to={"/financeiro/pix?cobranca=" + encodeURIComponent(charge.id)}>
                              Ver comprovante <ArrowRight size={14} />
                           </Link>
                        </div>
                     ))
                  ) : (
                     <p className="student-muted">
                        Nenhum pagamento registrado neste período. Consulte o extrato para acompanhar o histórico.
                     </p>
                  )}
               </section>
            </section>
            <aside className="student-financial-aside">
               <h2>Precisa organizar algo?</h2>
               <DestinationList
                  items={[
                     {
                        label: "Alterar o vencimento",
                        href: "/financeiro/alteracao-vencimento",
                        icon: "event",
                        description: "Consulte o dia escolhido para o próximo período.",
                     },
                     {
                        label: "Responsável financeiro",
                        href: "/financeiro/alteracao-responsavel",
                        icon: "person",
                        description: state.financialPlan.people
                           .filter(person => person.role !== "Anterior")
                           .map(person => person.name)
                           .join(" e "),
                     },
                     {
                        label: "Extrato e bolsas",
                        href: "/financeiro/extrato",
                        icon: "receipt_long",
                        description: "Consulte movimentações e informações financeiras.",
                     },
                     {
                        label: "Negociar mensalidades",
                        href: external.negociacao,
                        icon: "handshake",
                        description: "Acesse o sistema de negociação da instituição.",
                     },
                  ]}
               />
               <section className="student-financial-documents">
                  <h3>Documentos financeiros</h3>
                  <a href={external.informeAtual} target="_blank" rel="noopener noreferrer">
                     <FileText size={16} />
                     Informe de rendimentos 2026
                     <ExternalLink size={14} />
                  </a>
                  <a href={external.informeAnterior} target="_blank" rel="noopener noreferrer">
                     <FileText size={16} />
                     Informe do ano anterior
                     <ExternalLink size={14} />
                  </a>
                  <Link to="/contratos">
                     <FileText size={16} />
                     Meus contratos
                     <ArrowRight size={14} />
                  </Link>
               </section>
            </aside>
         </div>
      </div>
   );
}
function DemoQr() {
   const finder = (x: number, y: number, ox: number, oy: number) => {
      const dx = x - ox,
         dy = y - oy;
      return (
         dx >= 0 &&
         dy >= 0 &&
         dx < 7 &&
         dy < 7 &&
         (dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4))
      );
   };
   const isFinderArea = (x: number, y: number) => (x < 8 && y < 8) || (x >= 21 && y < 8) || (x < 8 && y >= 21);
   return (
      <svg viewBox="-3 -3 35 35" role="img" aria-label="QR Code do pagamento" className="student-demo-qr">
         <rect x="-3" y="-3" width="35" height="35" fill="white" />
         {Array.from({ length: 29 * 29 }, (_, i) => {
            const x = i % 29,
               y = Math.floor(i / 29);
            const fill = isFinderArea(x, y)
               ? finder(x, y, 0, 0) || finder(x, y, 22, 0) || finder(x, y, 0, 22)
               : (x * 17 + y * 13 + x * y) % 7 < 3;
            return fill ? <rect x={x} y={y} width="1" height="1" fill="#101828" key={i} /> : null;
         })}
         <rect x="6" y="12" width="18" height="5" rx=".5" fill="white" />
         <text x="15" y="15.2" textAnchor="middle" fontSize="2.2" fontFamily="sans-serif" fontWeight="700" fill="#173aa3">
            ANCHIETA
         </text>
      </svg>
   );
}
export function PixPayment() {
   const { state, update } = useDemo();
   const [params] = useSearchParams();
   const [copied, setCopied] = useState(false);
   const ids = (params.get("cobranca") || "").split(",");
   const charges = chargesFor(state).filter(charge => ids.includes(charge.id));
   const total = charges.reduce((sum, charge) => sum + charge.amount, 0);
   const allPaid = charges.length > 0 && charges.every(charge => charge.paid);
   const code = "ALUNO-ONLINE|" + charges.map(charge => charge.id.replace("DEMO-", "")).join("|") + "|" + total.toFixed(2);
   const copy = async () => {
      try {
         await navigator.clipboard.writeText(code);
         setCopied(true);
         toast.success("Código copiado");
      } catch {
         toast.info("Selecione e copie o texto do código abaixo.");
      }
   };
   return (
      <div className="student-page student-pix-page" data-student-ui>
         <Link
            className="student-back-link"
            to={
               "/financeiro" +
               (!allPaid && charges.length ? "?cobranca=" + encodeURIComponent(charges.map(charge => charge.id).join(",")) : "")
            }
         >
            <ArrowLeft size={16} />
            Voltar para cobranças
         </Link>
         <header className="student-page-heading">
            <div>
               <h1>{allPaid ? "Pagamento informado" : "Pagar por Pix"}</h1>
               <p>
                  {allPaid
                     ? "Você pode acompanhar a situação e consultar o resumo abaixo."
                     : "Confira o valor e os dados da cobrança antes de continuar."}
               </p>
            </div>
         </header>
         <ol className="student-payment-steps" aria-label="Etapas do pagamento">
            <li>
               <Check size={15} />
               Cobrança selecionada
            </li>
            <li aria-current={!allPaid ? "step" : undefined}>
               <QrCode size={16} />
               Pagamento por Pix
            </li>
            <li aria-current={allPaid ? "step" : undefined}>
               <CheckCircle2 size={16} />
               Confirmação
            </li>
         </ol>
         {!charges.length ? (
            <div className="student-empty">
               <ReceiptText size={30} />
               <h2>Escolha uma cobrança para continuar</h2>
               <p>A cobrança desse endereço não está disponível.</p>
               <Link className="replica-button" to="/financeiro">
                  Ver minhas cobranças <ArrowRight size={16} />
               </Link>
            </div>
         ) : (
            <div className="student-pix-layout">
               <section className="student-pix-main">
                  {allPaid ? (
                     <div className="student-payment-success">
                        <CheckCircle2 size={48} />
                        <h2>Recebemos sua informação</h2>
                        <p>
                           Pagamento de <strong>{currency(total)}</strong> informado por você.
                        </p>
                        <span className="student-status">Pagamento informado</span>
                        <button
                           className="replica-button secondary"
                           onClick={() => downloadExample("Resumo do pagamento · " + currency(total))}
                        >
                           <ReceiptText size={17} />
                           Baixar resumo do pagamento
                        </button>
                        <Link className="replica-button" to="/inicio">
                           Voltar ao início <ArrowRight size={16} />
                        </Link>
                     </div>
                  ) : (
                     <>
                        <DemoQr />
                        <h2>{currency(total)}</h2>
                        <label className="student-pix-code">
                           Código Pix
                           <input readOnly value={code} onFocus={event => event.currentTarget.select()} />
                        </label>
                        <button className="replica-button secondary" onClick={copy}>
                           {copied ? <Check size={17} /> : <Copy size={17} />} {copied ? "Código copiado" : "Copiar código Pix"}
                        </button>
                        <div className="student-pix-instructions">
                           <h3>Como pagar com Pix</h3>
                           <ol>
                              <li>Confira o valor e a origem da cobrança.</li>
                              <li>Copie o código ou leia o QR Code no aplicativo do banco.</li>
                              <li>Confira o destinatário e aguarde a confirmação no banco.</li>
                           </ol>
                        </div>
                        <button
                           className="replica-button student-confirm-payment"
                           onClick={() => {
                              update(s => ({
                                 ...s,
                                 chargesPaid: [...new Set([...s.chargesPaid, ...charges.map(charge => charge.id)])],
                                 requests: s.requests.map(request =>
                                    ids.includes(request.id) && request.status === "Aguardando pagamento"
                                       ? { ...request, status: "Em análise" }
                                       : request,
                                 ),
                              }));
                              toast.success("Pagamento informado");
                           }}
                        >
                           <CheckCircle2 size={18} />
                           Já realizei o pagamento
                        </button>
                     </>
                  )}
               </section>
               <aside className="student-pix-summary">
                  <h2>Resumo do pagamento</h2>
                  {charges.map(charge => (
                     <div key={charge.id}>
                        <strong>{charge.name}</strong>
                        <span>{currency(charge.amount)}</span>
                        <small>Vencimento em {formatDate(charge.due, { dateStyle: "long" })}</small>
                        {charge.request && (
                           <Link to="/solicitacao-servicos">
                              Acompanhar pedido {charge.request}
                              <ArrowRight size={14} />
                           </Link>
                        )}
                     </div>
                  ))}
                  <dl>
                     <dt>Aluno</dt>
                     <dd>{state.profile.name}</dd>
                     <dt>RA</dt>
                     <dd>20260001</dd>
                     <dt>Total selecionado</dt>
                     <dd>
                        <strong>{currency(total)}</strong>
                     </dd>
                  </dl>
               </aside>
            </div>
         )}
      </div>
   );
}
