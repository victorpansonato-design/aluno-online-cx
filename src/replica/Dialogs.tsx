import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Dialog } from "radix-ui";
import { ArrowRight, Check, Download, FileText, Search, X } from "lucide-react";
import { toast } from "sonner";
import { createProtocol, useDemo } from "../cx/state";
import { curriculum, disciplines, normalize, services } from "../cx/data";
import { cleanPresentation, docNames, loadServiceForm, reference, type ReferenceDialog, type ServiceReference } from "./reference";
import { electivesHref, learningLinks, primaryDestinations, studentLabels, supportLinks } from "./student/model";
import { ResponsibilitiesManager } from "./student/Responsibilities";

export type Overlay = {
   kind:
      | "grades"
      | "document"
      | "catalog"
      | "service"
      | "request"
      | "profile"
      | "card"
      | "due"
      | "responsible"
      | "rating"
      | "download"
      | "search"
      | "chat"
      | "rules"
      | "form"
      | "source"
      | "info"
      | "subjects";
   title?: string;
   code?: string;
   index?: number;
   id?: string;
   detail?: string;
   fields?: { label: string; value: string }[];
   selectedSubjects?: string[];
   onSubjects?: (subjects: string[]) => void;
};
type Props = { overlay: Overlay; close: () => void; go: (path: string) => void; connected: boolean };
export const money = (n: number) => (n ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n) : "Gratuito");
export function Layer({
   title,
   children,
   close,
   sheet = false,
   className = "",
}: {
   title: string;
   children: ReactNode;
   close: () => void;
   sheet?: boolean;
   className?: string;
}) {
   return (
      <Dialog.Root
         open
         onOpenChange={v => {
            if (!v) close();
         }}
      >
         <Dialog.Portal>
            <Dialog.Overlay className="replica-overlay" />
            <Dialog.Content aria-describedby={undefined} className={`${sheet ? "replica-sheet" : "replica-dialog"} ${className}`}>
               <Dialog.Title className="replica-dialog-title">{title}</Dialog.Title>
               <Dialog.Close className="replica-close" aria-label="Fechar">
                  <X size={19} />
               </Dialog.Close>
               {children}
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
export default function OverlayView(props: Props) {
   const { overlay: o, close, go, connected } = props;
   const { state, update } = useDemo();
   if (o.kind === "catalog")
      return (
         <Catalog
            connected={connected}
            initialQuery={o.detail || ""}
            close={close}
            choose={code => go("/solicitacao-servicos/solicitar/" + code)}
         />
      );
   if (o.kind === "service") return <ServiceForm code={o.code || "CSA_150"} close={close} go={go} />;
   if (o.kind === "document") return <DocumentSheet index={o.index || 0} close={close} go={go} connected={connected} />;
   if (o.kind === "search") return <SearchDialog close={close} go={go} />;
   if (o.kind === "grades") return <Grades {...props} />;
   if (o.kind === "profile") return <ProfileForm title={o.title || "Informações pessoais"} close={close} />;
   if (o.kind === "subjects")
      return <SubjectPicker initial={o.selectedSubjects || []} close={close} confirm={o.onSubjects || (() => close())} />;
   if (o.kind === "source")
      return (
         <NativeLayer id={o.id || "horas-detalhe"} title={o.title} close={close}>
            <div className="replica-native-footer">
               <button className="replica-button secondary" onClick={() => downloadExample(o.title || "Documento acadêmico")}>
                  Baixar documento <Download size={16} />
               </button>
               {connected && (
                  <button
                     className="replica-text-button"
                     onClick={() => go(o.id === "horas-detalhe" ? "/perfil/certificados" : "/secretaria-virtual")}
                  >
                     {o.id === "horas-detalhe" ? "Meus certificados" : "Secretaria virtual"} <ArrowRight size={16} />
                  </button>
               )}
            </div>
         </NativeLayer>
      );
   if (o.kind === "info")
      return (
         <Layer title={o.title || "Informações"} close={close} sheet>
            <p className="replica-description">{o.detail || "Consulte os caminhos disponíveis para esta etapa da sua vida acadêmica."}</p>
            {o.title?.includes("disciplinas") && (
               <ul className="replica-unit-list">
                  {disciplines
                     .filter(d => d.day !== 5)
                     .map(d => (
                        <li key={d.id}>
                           <strong>{d.name}</strong>
                           <span>
                              Faltas {d.misses} de {d.limit} toleradas
                           </span>
                        </li>
                     ))}
               </ul>
            )}
            <button className="replica-button secondary" onClick={() => go("/perfil/notas-e-faltas")}>
               Notas e faltas
            </button>
            <button className="replica-text-button" onClick={() => go("/secretaria-virtual")}>
               Secretaria virtual <ArrowRight size={16} />
            </button>
         </Layer>
      );
   if (o.kind === "card")
      return (
         <Layer title="Carteirinha digital" close={close}>
            <div className="replica-card">
               <img src="/replica/carteirinha-faculdade-Bmkzfnrg.png" alt="" />
               <div>
                  <img src="/replica/avatar.svg" alt="Foto ilustrativa da aluna" />
                  <strong>{state.profile.name}</strong>
                  <span>Ciências Contábeis</span>
                  <span>RA 20260001 · 2º período</span>
                  <span>Validade: 31/03/2030</span>
               </div>
            </div>
            <button className="replica-button" onClick={() => downloadExample("Carteirinha digital")}>
               Baixar documento <Download size={16} />
            </button>
         </Layer>
      );
   if (o.kind === "due")
      return (
         <Layer title="Alteração de Vencimento" close={close}>
            <p className="replica-description">Escolha o dia de vencimento para o próximo período.</p>
            <form
               onSubmit={e => {
                  e.preventDefault();
                  const day = String(new FormData(e.currentTarget).get("day"));
                  update(s => ({ ...s, dueDay: day }));
                  toast.success("Vencimento atualizado");
                  close();
               }}
            >
               <label className="replica-field">
                  Dia de vencimento
                  <select name="day" defaultValue={state.dueDay}>
                     {["5", "10", "12", "15", "20"].map(d => (
                        <option key={d}>{d}</option>
                     ))}
                  </select>
               </label>
               <p className="replica-note">A disponibilidade real e a data de vigência devem ser confirmadas pela instituição.</p>
               <div className="replica-dialog-footer">
                  <button className="replica-button secondary" type="button" onClick={close}>
                     Cancelar
                  </button>
                  <button className="replica-button">Salvar</button>
               </div>
            </form>
         </Layer>
      );
   if (o.kind === "responsible")
      return (
         <Layer title="Responsáveis financeiros" close={close}>
            <ResponsibilitiesManager />
         </Layer>
      );
   if (o.kind === "rating") return <Rating title={o.title || "Bases da Administração Moderna"} close={close} />;
   if (o.kind === "request") {
      const req = state.requests.find(r => r.id === o.id);
      const status = req?.status || o.detail || "Concluído";
      return (
         <Layer title={req?.name || o.title || "Detalhes da solicitação"} close={close} sheet>
            <p className="replica-description">Protocolo {(o.id || "2026-9000001").replace(/^DEMO-/, "2026-")}</p>
            <div className={`replica-request-status ${status === "Cancelado" ? "cancelled" : ""}`}>{status}</div>
            <ol className="replica-tracking">
               <li>Solicitação registrada</li>
               {status === "Cancelado" ? (
                  <li>Solicitação cancelada · acompanhamento encerrado</li>
               ) : (
                  <>
                     <li>{status === "Aguardando pagamento" ? "Aguardando pagamento" : "Recebida pela instituição"}</li>
                     <li>{status === "Concluído" ? "Atendimento concluído" : "Acompanhe o retorno por aqui"}</li>
                  </>
               )}
            </ol>
            <p>
               {req?.detail?.replace(/Exemplo de acompanhamento\.| de demonstração/g, "") ||
                  "Acompanhe as etapas e o retorno do seu pedido por aqui."}
            </p>
            {req?.price ? <p>Valor: {money(req.price)}</p> : null}
            <div className="replica-stack">
               {status === "Concluído" && (
                  <button className="replica-button" onClick={() => downloadExample(req?.name || o.title || "Documento")}>
                     Baixar documento <Download size={16} />
                  </button>
               )}
               {status === "Aguardando pagamento" && (
                  <button
                     className="replica-button"
                     onClick={() => go("/financeiro?cobranca=" + encodeURIComponent(req?.id || o.id || ""))}
                  >
                     Ver no financeiro <ArrowRight size={16} />
                  </button>
               )}
               {req && status === "Em análise" && (
                  <button
                     className="replica-button secondary"
                     onClick={() => {
                        update(s => ({ ...s, requests: s.requests.map(r => (r.id === req.id ? { ...r, status: "Cancelado" } : r)) }));
                        toast.success("Pedido cancelado");
                     }}
                  >
                     Cancelar pedido
                  </button>
               )}
               <button className="replica-button secondary" onClick={() => go("/solicitacao-servicos")}>
                  Todas as solicitações
               </button>
            </div>
         </Layer>
      );
   }
   if (o.kind === "rules")
      return (
         <NativeLayer
            id="compensacao"
            close={close}
            onAction={text => {
               if (text.includes("Prova Substitutiva")) go("/solicitacao-servicos/solicitar/CSA_114");
               else close();
            }}
         />
      );
   if (o.kind === "chat") return <Ana close={close} go={go} />;
   if (o.kind === "form") return <LocalForm title={o.title || "Nova solicitação"} fields={o.fields} close={close} go={go} />;
   return (
      <Layer title={o.title || "Documento acadêmico"} close={close}>
         <p>Consulte os detalhes e os documentos relacionados.</p>
         <div className="replica-document-preview">
            <img src="/replica/logo-grupo-anchieta-3x-BOFhQ5AB.webp" alt="Grupo Anchieta" />
            <h2>{o.title || "Documento acadêmico"}</h2>
            <p>{state.profile.name} · RA 20260001</p>
            <p>Ciências Contábeis · 2026/2</p>
            <p>Consulte o documento e as informações relacionadas ao seu pedido.</p>
         </div>
         <button className="replica-button" onClick={() => downloadExample(o.title || "Documento acadêmico")}>
            Baixar documento <Download size={16} />
         </button>
      </Layer>
   );
}
function Grades({ overlay: o, close, go, connected }: Props) {
   const unit = disciplines.find(d => normalize(o.title || "").includes(normalize(d.name))) || disciplines[o.index || 0] || disciplines[0];
   const html = useMemo(() => {
      const d = new DOMParser().parseFromString(reference.dialogs["notas-dialog"].html, "text/html");
      d.querySelector("h2")!.textContent = o.title || unit.name;
      Array.from(d.querySelectorAll("button"))
         .filter(x => x.textContent?.trim() === "Close")
         .forEach(x => x.remove());
      const walker = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
         if (walker.currentNode.textContent === "2,0")
            walker.currentNode.textContent = unit.grade === null ? "não lançado" : unit.grade.toFixed(1).replace(".", ",");
      }
      const section = d.querySelector('[aria-labelledby="disciplina-faltas"]');
      section?.querySelectorAll("dd").forEach((dd, i) => (dd.textContent = String(i ? unit.limit : unit.misses)));
      const frequency = Math.round((1 - unit.misses / (unit.limit * 4)) * 100);
      const words = d.createTreeWalker(section || d.body, NodeFilter.SHOW_TEXT);
      while (words.nextNode()) {
         if (words.currentNode.textContent === "100%") words.currentNode.textContent = frequency + "%";
         if (unit.misses > unit.limit / 2 && words.currentNode.textContent === "Presença em dia")
            words.currentNode.textContent = "Atenção às faltas";
      }
      section?.querySelectorAll("circle[stroke-dasharray]").forEach(circle => {
         circle.setAttribute("stroke-dashoffset", String((1 - frequency / 100) * Number(circle.getAttribute("stroke-dasharray"))));
         if (unit.misses > unit.limit / 2) circle.setAttribute("stroke", "var(--warning)");
      });
      if (unit.misses > unit.limit / 2)
         section?.querySelectorAll(".text-success").forEach(el => el.classList.replace("text-success", "text-warning-foreground"));
      if (unit.misses > unit.limit / 2)
         section?.querySelectorAll<HTMLElement>("[style]").forEach(el => {
            el.setAttribute("style", (el.getAttribute("style") || "").replaceAll("var(--success)", "var(--warning-foreground)"));
         });
      cleanPresentation(d);
      return d.body.innerHTML;
   }, [o.title, unit]);
   return (
      <NativeLayer id="notas-dialog" title={o.title || unit.name} html={html} close={close}>
         <div className="replica-native-footer">
            {connected && (
               <div className="replica-sheet-connections">
                  <a className="replica-button" href={unit.ava} target="_blank" rel="noopener noreferrer">
                     Abrir no AVA ↗
                  </a>
                  <button className="replica-button secondary" onClick={() => go("/horarios")}>
                     Meus horários
                  </button>
                  <button className="replica-button secondary" onClick={() => go("/solicitacao-servicos/compensacao-faltas")}>
                     Preciso compensar faltas
                  </button>
                  <button className="replica-text-button" onClick={() => go("/solicitacao-servicos/solicitar/CSA_165")}>
                     Solicitar revisão de nota <ArrowRight size={15} />
                  </button>
               </div>
            )}
         </div>
      </NativeLayer>
   );
}
function NativeLayer({
   id,
   title,
   html,
   close,
   children,
   onAction,
   itemOverride,
   initialValues,
}: {
   id: string;
   title?: string;
   html?: string;
   close: () => void;
   children?: ReactNode;
   onAction?: (text: string) => void;
   itemOverride?: ReferenceDialog;
   initialValues?: Record<string, string | File[]>;
}) {
   const item = itemOverride || reference.dialogs[id] || reference.dialogs["notas-dialog"];
   const content = useMemo(() => {
      const d = new DOMParser().parseFromString(html || item.html, "text/html");
      d.querySelectorAll("button").forEach(b => {
         if (b.textContent?.trim() === "Close") b.remove();
      });
      if (title && d.querySelector("h2")) d.querySelector("h2")!.textContent = title;
      // Treat only known escaped line breaks as paragraphs; arbitrary HTML stays text.
      d.querySelectorAll("form p").forEach(p => {
         if (!/<br\s*\/?\s*>/i.test(p.textContent || "")) return;
         const fragment = d.createDocumentFragment();
         for (const text of (p.textContent || "").split(/(?:\s*<br\s*\/?\s*>\s*)+/i)) {
            if (!text.trim()) continue;
            const paragraph = d.createElement("p");
            paragraph.className = p.className;
            paragraph.textContent = text.trim();
            fragment.append(paragraph);
         }
         p.replaceWith(fragment);
      });
      return d.body.innerHTML;
   }, [html, item, title]);
   const bindContent = useCallback(
      (node: HTMLDivElement | null) => {
         if (!node || !initialValues) return;
         node.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("[data-service-field]").forEach(field => {
            const saved = initialValues[field.name];
            if (saved === undefined) return;
            if (typeof saved === "string") field.value = saved;
            else if (field instanceof HTMLInputElement && field.type === "file" && saved.length) {
               if (typeof DataTransfer !== "undefined") {
                  const transfer = new DataTransfer();
                  saved.forEach(file => transfer.items.add(file));
                  field.files = transfer.files;
               } else {
                  const note = document.createElement("p");
                  note.className = "replica-note";
                  note.textContent =
                     "Selecionado anteriormente: " + saved.map(file => file.name).join(", ") + ". Selecione novamente para continuar.";
                  field.after(note);
               }
            }
            if (field instanceof HTMLTextAreaElement) {
               const counter = document.getElementById(field.id + "-contador");
               if (counter) counter.textContent = field.value.length + " / " + field.maxLength;
            }
         });
      },
      [initialValues],
   );
   return (
      <Dialog.Root
         open
         onOpenChange={v => {
            if (!v) close();
         }}
      >
         <Dialog.Portal>
            <Dialog.Overlay className="replica-overlay" />
            <Dialog.Content
               data-slot={item.slot || "dialog-content"}
               aria-describedby={undefined}
               className={item.className + " replica-native-dialog"}
            >
               <Dialog.Title className="sr-only">{title || item.title}</Dialog.Title>
               <div
                  ref={bindContent}
                  className="replica-native-content"
                  onSubmit={e => {
                     e.preventDefault();
                     onAction?.("Continuar");
                  }}
                  onInput={e => {
                     const t = e.target as HTMLTextAreaElement;
                     const counter = t.id && document.getElementById(t.id + "-contador");
                     if (counter && t.maxLength > 0) counter.textContent = t.value.length + " / " + t.maxLength;
                  }}
                  onClick={e => {
                     const t = (e.target as HTMLElement).closest("button,a");
                     if (!t) return;
                     if (
                        t instanceof HTMLAnchorElement &&
                        !t.dataset.demoDocument &&
                        /^(https?:|mailto:)/.test(t.getAttribute("href") || "")
                     )
                        return;
                     e.preventDefault();
                     if (t.textContent?.trim() === "Fechar") close();
                     else if (onAction) onAction(t.textContent || "");
                     else if (t.textContent?.includes("LinkedIn"))
                        toast.info("Use o certificado oficial do portal para adicionar ao LinkedIn.");
                     else downloadExample(title || item.title);
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
               />
               {children}
               <Dialog.Close className="replica-close" aria-label="Fechar">
                  <X size={19} />
               </Dialog.Close>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
function SubjectPicker({ initial, close, confirm }: { initial: string[]; close: () => void; confirm: (items: string[]) => void }) {
   const [q, setQ] = useState("");
   const [selected, setSelected] = useState(initial);
   return (
      <Layer title="Selecionar disciplinas" close={close}>
         <p className="replica-description">Marque as disciplinas para as quais deseja solicitar aproveitamento.</p>
         <div className="replica-search-field">
            <Search size={17} />
            <input aria-label="Buscar disciplina" placeholder="Nome da disciplina…" value={q} onChange={e => setQ(e.target.value)} />
         </div>
         <div className="replica-subject-picker">
            {curriculum
               .flat()
               .filter(x => normalize(x.name).includes(normalize(q)))
               .map((x, i) => (
                  <label key={x.name + i}>
                     <input
                        type="checkbox"
                        checked={selected.includes(x.name)}
                        onChange={e => setSelected(s => (e.target.checked ? [...s, x.name] : s.filter(n => n !== x.name)))}
                     />
                     <span>
                        {x.name}
                        <small>{x.hours} horas</small>
                     </span>
                  </label>
               ))}
         </div>
         <div className="replica-dialog-footer">
            <span className="replica-note">{selected.length} selecionadas</span>
            <button className="replica-button" disabled={!selected.length} onClick={() => confirm(selected)}>
               Confirmar seleção
            </button>
         </div>
      </Layer>
   );
}
function Catalog({
   close,
   choose,
   connected,
   initialQuery,
}: {
   close: () => void;
   choose: (s: string) => void;
   connected: boolean;
   initialQuery: string;
}) {
   const [q, setQ] = useState(initialQuery);
   useEffect(() => setQ(initialQuery), [initialQuery]);
   const [cost, setCost] = useState("Todos");
   const [selected, setSelected] = useState("");
   const list = services.filter(
      s =>
         (cost === "Todos" || (cost === "Gratuitos" ? s.price === 0 : s.price > 0)) &&
         normalize(s.original + " " + s.name + " " + s.category + " " + s.code + " " + s.keywords).includes(normalize(q)),
   );
   return (
      <Layer title="Solicitar serviço" close={close} className="replica-catalog">
         <p className="replica-description" aria-live="polite">
            {list.length} de 40 serviços disponíveis
         </p>
         <div className="replica-search-field">
            <Search size={17} />
            <input
               autoFocus
               type="search"
               placeholder="Buscar serviço por nome ou código"
               aria-label="Buscar serviço por nome ou código"
               value={q}
               onChange={e => setQ(e.target.value)}
            />
         </div>
         <div className="replica-filter-pills" role="group" aria-label="Filtrar por custo">
            {["Todos", "Gratuitos", "Pagos"].map(c => (
               <button key={c} aria-pressed={cost === c} onClick={() => setCost(c)}>
                  {c}
               </button>
            ))}
         </div>
         <div className="replica-catalog-list" role="radiogroup" aria-label="Serviços disponíveis para solicitação">
            {[false, true].map(auto => (
               <section key={String(auto)}>
                  <h3>
                     {connected
                        ? auto
                           ? "Documentos emitidos on-line"
                           : "Pedidos para análise da secretaria"
                        : "Serviços executados " + (auto ? "eletronicamente" : "pela instituição")}
                  </h3>
                  {list
                     .filter(s => s.auto === auto)
                     .sort((a, b) => a.original.localeCompare(b.original, "pt-BR"))
                     .map(s => (
                        <button
                           role="radio"
                           aria-checked={selected === s.code}
                           className="replica-service-option"
                           key={s.code}
                           onClick={() => setSelected(s.code)}
                        >
                           <span>
                              <strong>{connected ? s.name : s.original}</strong>
                              <small>
                                 {connected && s.name !== s.original ? s.original + " · " : ""}
                                 {s.code}
                                 {s.price > 0 ? " · Pré-pago" : ""}
                              </small>
                           </span>
                           <span className="replica-service-price">
                              {money(s.price)}
                              {selected === s.code && <Check size={16} />}
                           </span>
                        </button>
                     ))}
               </section>
            ))}
            {!list.length && <p className="replica-empty">Nenhum serviço encontrado. Tente outra palavra ou outro filtro.</p>}
         </div>
         <div className="replica-catalog-selection" aria-live="polite">
            {services.find(s => s.code === selected)?.original || "Selecione um serviço para continuar."}
         </div>
         <footer className="replica-dialog-footer">
            <button className="replica-button secondary" onClick={close}>
               Cancelar
            </button>
            <button className="replica-button" disabled={!selected} onClick={() => choose(selected)}>
               Avançar <ArrowRight size={16} />
            </button>
         </footer>
      </Layer>
   );
}
function ServiceForm({ code, close, go }: { code: string; close: () => void; go: (p: string) => void }) {
   const service = services.find(s => s.code === code);
   const { update, state } = useDemo();
   const [step, setStep] = useState(0);
   const [detail, setDetail] = useState("");
   const [answers, setAnswers] = useState<{ label: string; value: string }[]>([]);
   const [formReference, setFormReference] = useState<ServiceReference | null>(null);
   const [loadFailed, setLoadFailed] = useState(false);
   const [protocol, setProtocol] = useState("");
   const draft = useRef<Record<string, string | File[]>>({});
   useEffect(() => {
      let stale = false;
      setFormReference(null);
      setLoadFailed(false);
      setStep(0);
      setAnswers([]);
      setDetail("");
      draft.current = {};
      loadServiceForm(code)
         .then(data => {
            if (!stale) setFormReference(data);
         })
         .catch(() => {
            if (!stale) setLoadFailed(true);
         });
      return () => {
         stale = true;
      };
   }, [code]);
   if (!service)
      return (
         <Layer title="Serviço não encontrado" close={close}>
            <p>Escolha um serviço disponível no catálogo.</p>
            <button className="replica-button" onClick={() => go("/solicitacao-servicos/solicitar")}>
               Abrir catálogo
            </button>
         </Layer>
      );
   const submit = () => {
      const id = createProtocol();
      update(s => ({
         ...s,
         requests: [
            {
               id,
               code,
               name: service.original,
               status: service.price ? "Aguardando pagamento" : service.auto ? "Concluído" : "Em análise",
               price: service.price,
               detail: detail || "Solicitação registrada.",
               date: new Date().toISOString(),
            },
            ...s.requests,
         ],
      }));
      setProtocol(id);
      setStep(2);
   };
   if (step === 0) {
      if (!formReference)
         return (
            <Layer title={service.original} close={close}>
               <p role="status">
                  {loadFailed ? "Não foi possível abrir este formulário. Volte ao catálogo e tente novamente." : "Carregando formulário…"}
               </p>
               <button className="replica-button secondary" onClick={() => go("/solicitacao-servicos/solicitar")}>
                  Voltar ao catálogo
               </button>
            </Layer>
         );
      return (
         <NativeLayer
            id={"form-" + code}
            itemOverride={formReference}
            initialValues={draft.current}
            close={close}
            onAction={text => {
               if (text.trim() === "Voltar") {
                  go("/solicitacao-servicos/solicitar");
                  return;
               }
               if (!/Continuar|Adicionar à solicitação/.test(text)) return;
               const form = document.querySelector<HTMLFormElement>("[role=dialog] form");
               if (!form?.reportValidity()) return;
               for (const input of form.querySelectorAll<HTMLInputElement>("input[type=file]")) {
                  if (Array.from(input.files || []).some(file => file.size > 10 * 1024 * 1024 || !/\.(pdf|png|jpe?g)$/i.test(file.name))) {
                     toast.error("Escolha um arquivo PDF, JPG ou PNG de até 10 MB.");
                     return;
                  }
               }
               draft.current = Object.fromEntries(
                  Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("[data-service-field]")).map(
                     field => [
                        field.name,
                        field instanceof HTMLInputElement && field.type === "file" ? Array.from(field.files || []) : field.value,
                     ],
                  ),
               );
               const values = Array.from(
                  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("[data-service-field]"),
               )
                  .map(field => ({
                     label: field.dataset.serviceField || "",
                     value:
                        field instanceof HTMLInputElement && field.type === "file"
                           ? Array.from(field.files || [])
                                .map(f => f.name)
                                .join(", ")
                           : field.value,
                  }))
                  .filter(x => x.value);
               setAnswers(values);
               setDetail(values.map(x => x.label + ": " + x.value).join("\n"));
               setStep(1);
            }}
         />
      );
   }
   return (
      <Layer title={service.original} close={close} className="replica-service-form">
         <p className="replica-description">
            {code} · {money(service.price)}
            {code === "CSA_048_A" ? " · Prazo de 7 dias úteis" : ""}
         </p>
         <div className="replica-stepper" aria-label={`Etapa ${step + 1} de 3`}>
            {["Informações", "Conferência", "Conclusão"].map((x, i) => (
               <span data-current={i === step} data-done={i < step} key={x}>
                  <b>{i < step ? "✓" : i + 1}</b>
                  {x}
               </span>
            ))}
         </div>
         {step === 1 ? (
            <>
               <h3>Confira antes de concluir</h3>
               <dl className="replica-review">
                  <dt>Serviço</dt>
                  <dd>{service.original}</dd>
                  <dt>Aluno</dt>
                  <dd>{state.profile.name} · RA 20260001</dd>
                  <dt>Valor</dt>
                  <dd>{money(service.price)}</dd>
                  {answers.map(answer => (
                     <div className="replica-review-answer" key={answer.label}>
                        <dt>{answer.label}</dt>
                        <dd>{answer.value}</dd>
                     </div>
                  ))}
               </dl>
               <div className="replica-dialog-footer">
                  <button className="replica-button secondary" onClick={() => setStep(0)}>
                     Voltar
                  </button>
                  <button className="replica-button" onClick={submit}>
                     Concluir solicitação
                  </button>
               </div>
            </>
         ) : (
            <div className="replica-success">
               <Check size={34} />
               <h3>{service.auto ? "Documento disponível" : "Solicitação registrada"}</h3>
               <p>{protocol}</p>
               <p>
                  {service.price
                     ? "O pagamento aparece no financeiro."
                     : service.auto
                       ? "Seu documento está disponível para consulta."
                       : "Acompanhe o pedido na secretaria virtual."}
               </p>
               {service.auto && (
                  <button className="replica-button" onClick={() => downloadExample(service.original)}>
                     Baixar documento <Download size={16} />
                  </button>
               )}
               <button className="replica-button secondary" onClick={() => go("/solicitacao-servicos")}>
                  Acompanhar solicitação <ArrowRight size={16} />
               </button>
               {service.price > 0 && (
                  <button className="replica-text-button" onClick={() => go("/financeiro")}>
                     Ir para o financeiro
                  </button>
               )}
            </div>
         )}
      </Layer>
   );
}
function DocumentSheet({ index, close, go, connected }: { index: number; close: () => void; go: (p: string) => void; connected: boolean }) {
   const { state, update } = useDemo();
   const [file, setFile] = useState<File | null>(null);
   const [error, setError] = useState("");
   const input = useRef<HTMLInputElement>(null);
   const choose = (f?: File) => {
      if (!f) return;
      setFile(null);
      if (!/\.(pdf|png|jpe?g)$/i.test(f.name)) {
         setError("Escolha um arquivo PDF, JPG ou PNG.");
         return;
      }
      if (f.size > 10 * 1024 * 1024) {
         setError("O arquivo precisa ter até 10 MB.");
         return;
      }
      setFile(f);
      setError("");
   };
   const status = state.docs[String(index)];
   return (
      <Layer title={docNames[index]} close={close} sheet>
         <p className="replica-description">
            {
               [
                  "Cadastro de Pessoa Física",
                  "Registro Geral (identidade)",
                  "Documento de estado civil",
                  "Histórico do ensino médio completo",
                  "Certificado de conclusão do ensino médio",
                  "Conta de luz, água ou telefone",
               ][index]
            }
         </p>
         <span className="replica-status-pill">{status?.status || "Pendente"}</span>
         <ul className="replica-file-tips">
            <li>Envie uma imagem legível de todas as informações.</li>
            {index === 0 && <li>Pode ser a versão digital do aplicativo gov.br.</li>}
            <li>PDF, JPG ou PNG · até 10 MB</li>
         </ul>
         {status && (
            <div className="replica-inline-success">
               <Check size={18} />
               <span>
                  {status.name}
                  <small>Metadados salvos localmente. Nenhum arquivo foi enviado.</small>
               </span>
            </div>
         )}
         <input
            ref={input}
            type="file"
            hidden
            accept=".pdf,.jpg,.jpeg,.png"
            aria-label="Escolher arquivo"
            onChange={e => choose(e.target.files?.[0])}
         />
         <button
            className="replica-file-drop"
            onClick={() => input.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
               e.preventDefault();
               choose(e.dataTransfer.files[0]);
            }}
         >
            <FileText size={26} />
            <strong>{file?.name || "Arraste o arquivo ou clique para escolher"}</strong>
            <small>PDF, JPG ou PNG · até 10 MB</small>
         </button>
         {error && (
            <p className="replica-error" role="alert">
               {error}
            </p>
         )}
         <button
            className="replica-button"
            disabled={!file}
            onClick={() => {
               if (!file) return;
               update(s => ({ ...s, docs: { ...s.docs, [index]: { name: file.name, status: "Em conferência" } } }));
               toast.success("Documento em conferência");
               close();
            }}
         >
            Enviar documento
         </button>
         {connected && (
            <div className="replica-sheet-connections">
               <button className="replica-text-button" onClick={() => go("/perfil/documentos")}>
                  Ver todos os meus documentos <ArrowRight size={16} />
               </button>
               <button className="replica-text-button" onClick={() => go("/perfil/visao-geral")}>
                  Conferir meus dados cadastrais <ArrowRight size={16} />
               </button>
            </div>
         )}
      </Layer>
   );
}
function ProfileForm({ title, close }: { title: string; close: () => void }) {
   const { state, update } = useDemo();
   return (
      <Layer title={title} close={close} sheet>
         <form
            onSubmit={e => {
               e.preventDefault();
               const f = new FormData(e.currentTarget);
               update(s => ({
                  ...s,
                  profile: {
                     name: String(f.get("name") || s.profile.name),
                     email: String(f.get("email") || s.profile.email),
                     phone: String(f.get("phone") || s.profile.phone),
                     address: String(f.get("address") || s.profile.address),
                  },
               }));
               toast.success("Dados salvos somente neste navegador");
               close();
            }}
         >
            <label className="replica-field">
               Nome completo
               <input name="name" defaultValue={state.profile.name} required />
            </label>
            <label className="replica-field">
               E-mail
               <input name="email" type="email" defaultValue={state.profile.email} required />
            </label>
            <label className="replica-field">
               Telefone
               <input name="phone" type="tel" defaultValue={state.profile.phone} />
            </label>
            <label className="replica-field">
               Endereço
               <input name="address" defaultValue={state.profile.address} />
            </label>
            <button className="replica-button">Salvar</button>
         </form>
      </Layer>
   );
}
function Rating({ title, close }: { title: string; close: () => void }) {
   const { state, update } = useDemo();
   const [rating, setRating] = useState(state.ratings[title] || 0);
   const [sent, setSent] = useState(false);
   return (
      <Layer title="Avaliar aula" close={close} sheet>
         <h3>{title}</h3>
         <p className="replica-description">Como foi sua experiência na aula?</p>
         {sent ? (
            <div className="replica-success">
               <Check />
               <h3>Avaliação salva</h3>
               <p>Nenhuma resposta foi enviada à instituição.</p>
            </div>
         ) : (
            <form
               onSubmit={e => {
                  e.preventDefault();
                  update(s => ({ ...s, ratings: { ...s.ratings, [title]: rating } }));
                  setSent(true);
               }}
            >
               <div className="replica-rating" role="group" aria-label="Nota da aula de um a cinco">
                  {[1, 2, 3, 4, 5].map(n => (
                     <button type="button" aria-pressed={rating === n} key={n} onClick={() => setRating(n)}>
                        {n}
                     </button>
                  ))}
               </div>
               <label className="replica-field">
                  Comentário (opcional)
                  <textarea rows={4} placeholder="O que podemos melhorar?" />
               </label>
               <button className="replica-button" disabled={!rating}>
                  Salvar avaliação
               </button>
            </form>
         )}
      </Layer>
   );
}
function SearchDialog({ close, go }: { close: () => void; go: (p: string) => void }) {
   const [q, setQ] = useState("");
   const needle = normalize(q);
   const extra = [
      ...primaryDestinations.map(item => [item.href, { title: item.label }] as const),
      ...Object.entries(studentLabels).map(([path, title]) => [path, { title }] as const),
      ...supportLinks.map(item => [item.href, { title: item.label }] as const),
      ...learningLinks.map(item => [item.href, { title: item.label }] as const),
      [electivesHref, { title: "Disciplinas eletivas · oferta e inscrições" }] as const,
      ["/financeiro", { title: "Cobranças, boletos e Pix" }] as const,
   ];
   const pages = [
      ...new Map<string, { title: string }>([
         ...extra,
         ...Object.entries(reference.pages).filter(([path]) => !extra.some(([href]) => href === path)),
      ]).entries(),
   ].filter(([p, v]) => !p.includes("/notificacoes/") && normalize(v.title + " " + p).includes(needle));
   const catalog = services.filter(s => normalize(s.original + " " + s.name + " " + s.keywords).includes(needle));
   return (
      <Layer title="Buscar no Aluno Online" close={close} className="replica-search-dialog">
         <div className="replica-search-field">
            <Search size={18} />
            <input
               autoFocus
               aria-label="Buscar menus, páginas e recursos"
               placeholder="Busque notas, documentos, serviços…"
               value={q}
               onChange={e => setQ(e.target.value)}
            />
         </div>
         <div className="replica-search-results">
            {!q && <p className="replica-note">Encontre uma página ou peça um serviço sem precisar saber a categoria.</p>}
            <h3>Páginas</h3>
            {pages.slice(0, q ? 12 : 6).map(([p, v]) => (
               <button key={p} onClick={() => go(p)}>
                  <span>{v.title}</span>
                  <ArrowRight size={16} />
               </button>
            ))}
            {q && (
               <>
                  <h3>Serviços</h3>
                  {catalog.slice(0, 10).map(s => (
                     <button key={s.code} onClick={() => go("/solicitacao-servicos/solicitar/" + s.code)}>
                        <span>
                           {s.original}
                           <small>{money(s.price)}</small>
                        </span>
                        <ArrowRight size={16} />
                     </button>
                  ))}
               </>
            )}
            {!pages.length && !catalog.length && <p>Nenhum resultado encontrado. Tente outra palavra.</p>}
         </div>
      </Layer>
   );
}
function Ana({ close, go }: { close: () => void; go: (p: string) => void }) {
   const [q, setQ] = useState("");
   const [asked, setAsked] = useState("");
   const choices = [
      { label: "Minhas notas e faltas", path: "/perfil/notas-e-faltas", key: "nota prova falta frequencia" },
      { label: "Enviar meus documentos", path: "/perfil/documentos", key: "documento cpf rg historico enviar" },
      { label: "Pedir um serviço", path: "/secretaria-virtual", key: "secretaria declaracao servico pedido" },
      { label: "Financeiro e mensalidades", path: "/financeiro", key: "boleto financeiro pagamento mensalidade" },
      { label: "Inscrever em DP ou adaptação", path: "/jornada-academica", key: "dp dependencia adaptacao disciplina" },
      { label: "Horário e local das aulas", path: "/horarios", key: "horario aula sala local" },
      { label: "Estágio, TCC e PI", path: "/meu-estagio", key: "estagio tcc pi" },
      { label: "Disciplinas eletivas", path: electivesHref, key: "eletiva eletivas optativa inscricao escolha" },
   ];
   const matches = asked
      ? choices.filter(c =>
           normalize(c.label + " " + c.key)
              .split(" ")
              .some(word => word.length > 2 && normalize(asked).includes(word)),
        )
      : choices.slice(0, 4);
   return (
      <Layer title="Olá, eu sou a Ana!" close={close} className="replica-ana-dialog">
         <div className="replica-ana-greeting">
            <img src="/replica/ana.webp" alt="Ana, assistente virtual" />
            <p>
               Como posso te ajudar?<small>Orientação para sua rotina</small>
            </p>
         </div>
         {asked && <p className="replica-chat-question">{asked}</p>}
         <p>{asked ? "Estes caminhos podem ajudar você:" : "Escolha o que você precisa resolver agora."}</p>
         <div className="replica-chat-options">
            {(matches.length ? matches : choices.slice(0, 4)).map(c => (
               <button key={c.path} onClick={() => go(c.path)}>
                  {c.label}
                  <ArrowRight size={16} />
               </button>
            ))}
         </div>
         <form
            className="replica-chat-input"
            onSubmit={e => {
               e.preventDefault();
               setAsked(q);
               setQ("");
            }}
         >
            <input aria-label="Escrever para Ana" placeholder="Digite sua dúvida…" value={q} onChange={e => setQ(e.target.value)} />
            <button className="replica-button" aria-label="Enviar mensagem para guia local" disabled={!q.trim()}>
               <ArrowRight size={18} />
            </button>
         </form>
         <p className="replica-note">As respostas usam caminhos locais. Não há envio para um serviço de chat.</p>
      </Layer>
   );
}
function LocalForm({
   title,
   fields,
   close,
   go,
}: {
   title: string;
   fields?: { label: string; value: string }[];
   close: () => void;
   go: (p: string) => void;
}) {
   const { update } = useDemo();
   const [step, setStep] = useState(0);
   const [id, setId] = useState("");
   if (fields?.length && step !== 2)
      return (
         <Layer title={"Revisar " + title.toLowerCase()} close={close} sheet>
            <p className="replica-description">Confira os dados preenchidos antes de registrar o pedido.</p>
            <dl className="replica-review">
               {fields.map((f, i) => (
                  <div className="contents" key={i}>
                     <dt>{f.label}</dt>
                     <dd>{f.value || "Não informado"}</dd>
                  </div>
               ))}
            </dl>
            <div className="replica-dialog-footer">
               <button className="replica-button secondary" onClick={close}>
                  Voltar e editar
               </button>
               <button
                  className="replica-button"
                  onClick={() => {
                     const protocol = createProtocol();
                     update(s => ({
                        ...s,
                        requests: [
                           {
                              id: protocol,
                              code: "DEMO",
                              name: title,
                              status: "Em análise",
                              date: new Date().toISOString(),
                              detail: fields.map(f => f.label + ": " + f.value).join(" · "),
                              price: 0,
                           },
                           ...s.requests,
                        ],
                     }));
                     setId(protocol);
                     setStep(2);
                  }}
               >
                  Confirmar solicitação
               </button>
            </div>
         </Layer>
      );
   return (
      <Layer title={title} close={close} sheet>
         {step === 2 ? (
            <div className="replica-success">
               <Check />
               <h3>Pedido registrado</h3>
               <p>{id}</p>
               <button className="replica-button" onClick={() => go("/solicitacao-servicos")}>
                  Acompanhar na secretaria
               </button>
            </div>
         ) : (
            <form
               onSubmit={e => {
                  e.preventDefault();
                  if (step === 0) {
                     setStep(1);
                     return;
                  }
                  const protocol = createProtocol();
                  update(s => ({
                     ...s,
                     requests: [
                        {
                           id: protocol,
                           code: "DEMO",
                           name: title,
                           status: "Em análise",
                           date: new Date().toISOString(),
                           detail: "Solicitação registrada.",
                           price: 0,
                        },
                        ...s.requests,
                     ],
                  }));
                  setId(protocol);
                  setStep(2);
               }}
            >
               <p className="replica-description">
                  {step === 0 ? "Confira os dados do pedido." : "Revise as informações antes de registrar o pedido."}
               </p>
               <label className="replica-field">
                  Descrição *<textarea required rows={4} placeholder="Descreva o que precisa…" />
               </label>
               <label className="replica-field">
                  Data *<input type="date" required defaultValue="2026-10-21" />
               </label>
               <label className="replica-field">
                  Anexo
                  <input type="file" accept=".pdf,.jpg,.png" />
               </label>
               <button className="replica-button">{step === 0 ? "Continuar" : "Confirmar solicitação"}</button>
            </form>
         )}
      </Layer>
   );
}
export function downloadExample(title: string) {
   const safe = title.replace(/[<>&"']/g, "");
   const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>${safe} — exemplo sem validade</title><style>body{font:16px Arial;margin:60px;color:#193770;line-height:1.7}h1{font-size:26px}strong{color:#b23b3b}button{padding:12px}@media print{button{display:none}}</style><h1>${safe}</h1><p>Grupo Anchieta · Demonstração de frontend</p><p>Marina Costa · RA 20260001 · Ciências Contábeis</p><p>Este documento contém informações fictícias para avaliar a navegação.</p><strong>DEMONSTRAÇÃO · SEM VALIDADE ACADÊMICA</strong><p>Emissão de documentos oficiais: portal da instituição.</p><button onclick="window.print()">Imprimir / salvar como PDF</button></html>`;
   const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
   const a = document.createElement("a");
   a.href = url;
   a.download = safe.toLowerCase().replace(/\W+/g, "-") + "-demonstracao.html";
   a.click();
   setTimeout(() => URL.revokeObjectURL(url), 1000);
   toast.success("Documento baixado");
}
