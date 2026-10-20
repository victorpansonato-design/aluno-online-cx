import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, ExternalLink, FileText, LockKeyhole, QrCode, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "../../cx/state";
import { external } from "../../cx/data";
import { downloadExample } from "../Dialogs";
import { chargesFor, currency, formatDate, today } from "./model";
import { DestinationList, SectionNavigation } from "./Navigation";

export default function Financial() {
   const { state } = useDemo();
   const [params, setParams] = useSearchParams();
   const charges = chargesFor(state),
      pending = charges.filter(charge => !charge.paid),
      paid = charges.filter(charge => charge.paid);
   const selected = (params.get("cobranca") || "").split(",").filter(id => pending.some(charge => charge.id === id));
   const amount = pending.filter(charge => selected.includes(charge.id)).reduce((sum, charge) => sum + charge.amount, 0);
   const choose = (id: string) => {
      const next = selected.includes(id) ? selected.filter(value => value !== id) : [...selected, id];
      setParams(next.length ? { cobranca: next.join(",") } : {}, { replace: true });
   };
   return (
      <div className="student-page" data-student-ui>
         <header className="student-page-heading">
            <div>
               <h1>Meu financeiro</h1>
               <p>Confira o que precisa pagar, acompanhe pagamentos e encontre seus comprovantes.</p>
            </div>
         </header>
         <SectionNavigation path="/financeiro" />
         <div className="student-financial-layout">
            <section aria-labelledby="pending-charges-title">
               <div className="student-section-heading">
                  <h2 id="pending-charges-title">Cobranças em aberto</h2>
                  <span className="student-count">{pending.length}</span>
               </div>
               <p className="student-muted">Selecione a cobrança que deseja pagar. Valores de demonstração.</p>
               <div className="student-charge-list">
                  {pending.map(charge => (
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
                           <small>{charge.request ? "Vinculada ao pedido " + charge.request : "Mensalidade de demonstração"}</small>
                           {charge.due < today && <b className="student-overdue">Vencida · exemplo sem multa</b>}
                        </span>
                        <strong className="student-charge-value">{currency(charge.amount)}</strong>
                     </label>
                  ))}
               </div>
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
                     <p className="student-data-note">Este percurso não gera boleto nem cobrança real.</p>
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
                              <small>{currency(charge.amount)} · pagamento simulado</small>
                           </span>
                           <Link to={"/financeiro/pix?cobranca=" + encodeURIComponent(charge.id)}>
                              Ver comprovante <ArrowRight size={14} />
                           </Link>
                        </div>
                     ))
                  ) : (
                     <p className="student-muted">
                        Os pagamentos confirmados nesta demonstração aparecerão aqui. Consulte o extrato para o histórico de referência.
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
                        description: state.responsible,
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
      <svg
         viewBox="-3 -3 35 35"
         role="img"
         aria-label="Ilustração de QR Code de demonstração, sem validade para pagamento"
         className="student-demo-qr"
      >
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
            EXEMPLO
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
   const code = "DEMONSTRACAO-SEM-VALIDADE|" + charges.map(charge => charge.id).join("|") + "|" + total.toFixed(2);
   const copy = async () => {
      try {
         await navigator.clipboard.writeText(code);
         setCopied(true);
         toast.success("Código de exemplo copiado. Ele não realiza pagamentos.");
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
               <h1>{allPaid ? "Pagamento simulado confirmado" : "Pagar por Pix"}</h1>
               <p>
                  {allPaid
                     ? "O financeiro e o acompanhamento do pedido já foram atualizados neste navegador."
                     : "Confira a cobrança selecionada e veja uma prévia do pagamento."}
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
               Pix de demonstração
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
               <p>A cobrança desse endereço não está disponível nesta demonstração.</p>
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
                        <h2>Tudo certo nesta simulação</h2>
                        <p>
                           Pagamento de <strong>{currency(total)}</strong> registrado apenas na demonstração.
                        </p>
                        <span className="student-status">Pagamento simulado</span>
                        <button
                           className="replica-button secondary"
                           onClick={() => downloadExample("Comprovante fictício de pagamento · " + currency(total))}
                        >
                           <ReceiptText size={17} />
                           Baixar comprovante de exemplo
                        </button>
                        <Link className="replica-button" to="/inicio">
                           Voltar ao início <ArrowRight size={16} />
                        </Link>
                     </div>
                  ) : (
                     <>
                        <div className="student-pix-notice">
                           <LockKeyhole size={19} />
                           <p>
                              <strong>Este Pix é uma demonstração.</strong> O QR Code e o código abaixo são ilustrativos e não podem ser
                              usados para pagar.
                           </p>
                        </div>
                        <DemoQr />
                        <h2>{currency(total)}</h2>
                        <p className="student-muted">Nenhum valor será transferido.</p>
                        <label className="student-pix-code">
                           Código de exemplo
                           <input readOnly value={code} onFocus={event => event.currentTarget.select()} />
                        </label>
                        <button className="replica-button secondary" onClick={copy}>
                           {copied ? <Check size={17} /> : <Copy size={17} />}{" "}
                           {copied ? "Código de exemplo copiado" : "Copiar código de exemplo"}
                        </button>
                        <div className="student-pix-instructions">
                           <h3>Como será o percurso do aluno</h3>
                           <ol>
                              <li>Conferir o valor e a origem da cobrança.</li>
                              <li>Copiar o código ou ler o QR Code válido fornecido pelo sistema financeiro.</li>
                              <li>Conferir o destinatário no aplicativo do banco e aguardar a confirmação.</li>
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
                              toast.success("Pagamento confirmado somente na demonstração");
                           }}
                        >
                           <CheckCircle2 size={18} />
                           Simular confirmação do pagamento
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
                     <dd>20260001 · exemplo</dd>
                     <dt>Total selecionado</dt>
                     <dd>
                        <strong>{currency(total)}</strong>
                     </dd>
                  </dl>
                  <p className="student-data-note">Não há integração bancária nem emissão de cobrança real neste protótipo.</p>
               </aside>
            </div>
         )}
      </div>
   );
}
