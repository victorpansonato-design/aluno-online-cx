import { useState } from "react";
import { useDemo } from "../../cx/state";
import { formatDate, today } from "./model";

export function ResponsibleBadge({ name, share }: { name: string; share?: number }) {
   const initials = name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(word => word[0])
      .filter((_, i, a) => i === 0 || i === a.length - 1)
      .join("")
      .toUpperCase();
   return (
      <span className="cx-person-badge">
         <span className="cx-person-avatar" aria-hidden="true">
            {initials}
         </span>
         <span>{name}</span>
         {share !== undefined && share < 100 && <span className="cx-person-share">{share}%</span>}
      </span>
   );
}

export function ResponsibilitiesManager() {
   const { state, update } = useDemo();
   const plan = state.financialPlan;
   const current = plan.people.filter(p => p.role !== "Anterior");
   const previous = plan.people.filter(p => p.role === "Anterior");
   const [targetId, setTargetId] = useState(current[0].id);
   const [name, setName] = useState("");
   const [date, setDate] = useState("2027-01-01");
   const [error, setError] = useState("");
   const [saved, setSaved] = useState(false);
   return (
      <div className="cx-responsibility-manager">
         <p className="replica-description">Consulte os responsáveis e organize uma alteração para novas cobranças.</p>
         <section aria-labelledby="responsibles-current">
            <h3 id="responsibles-current">Responsáveis atuais</h3>
            <ul>
               {current.map(person => (
                  <li key={person.id}>
                     <ResponsibleBadge name={person.name} />
                     <small>
                        {person.role} · desde {formatDate(person.from, { day: "2-digit", month: "short", year: "numeric" })}
                     </small>
                  </li>
               ))}
            </ul>
         </section>
         <p className="cx-responsibility-explanation">
            Uma cobrança pode ter mais de um responsável. A divisão aparece na própria mensalidade; ao selecioná-la, o pagamento considera
            seu valor integral.
         </p>
         <section aria-labelledby="responsibles-history">
            <h3 id="responsibles-history">Responsável anterior</h3>
            {previous.map(person => (
               <div className="cx-previous-responsible" key={person.id}>
                  <ResponsibleBadge name={person.name} />
                  <small>
                     Até {formatDate(person.until!, { day: "2-digit", month: "short", year: "numeric" })} · mantido nas cobranças da época
                  </small>
               </div>
            ))}
         </section>
         {plan.scheduled.length > 0 && (
            <section aria-labelledby="responsibles-scheduled">
               <h3 id="responsibles-scheduled">Alterações agendadas</h3>
               {plan.scheduled.map(change => (
                  <div className="cx-responsible-scheduled" key={change.targetId}>
                     <strong>
                        {plan.people.find(p => p.id === change.targetId)?.name} → {change.name}
                     </strong>
                     <small>
                        Novas emissões a partir de {formatDate(change.effectiveFrom, { day: "2-digit", month: "short", year: "numeric" })}
                     </small>
                     <button
                        className="replica-text-button"
                        onClick={() => {
                           update(s => ({
                              ...s,
                              financialPlan: {
                                 ...s.financialPlan,
                                 scheduled: s.financialPlan.scheduled.filter(c => c.targetId !== change.targetId),
                              },
                           }));
                           setSaved(false);
                        }}
                     >
                        Cancelar agendamento de {change.name}
                     </button>
                  </div>
               ))}
            </section>
         )}
         <form
            onSubmit={event => {
               event.preventDefault();
               if (name.trim().length < 2) {
                  setError("Informe o nome completo do novo responsável.");
                  return;
               }
               if (date < today) {
                  setError("Escolha uma data a partir de hoje.");
                  return;
               }
               update(s => ({
                  ...s,
                  financialPlan: {
                     ...s.financialPlan,
                     scheduled: [
                        ...s.financialPlan.scheduled.filter(c => c.targetId !== targetId),
                        { targetId, name: name.trim(), effectiveFrom: date },
                     ],
                  },
               }));
               setError("");
               setSaved(true);
            }}
         >
            <h3>Agendar troca de responsável</h3>
            <label className="replica-field" htmlFor="responsible-replace">
               Quem será substituído?
               <select
                  id="responsible-replace"
                  value={targetId}
                  onChange={e => {
                     setTargetId(e.target.value);
                     setSaved(false);
                  }}
               >
                  {current.map(person => (
                     <option key={person.id} value={person.id}>
                        {person.name} · {person.role}
                     </option>
                  ))}
               </select>
            </label>
            <label className="replica-field" htmlFor="responsible-name">
               Nome do novo responsável
               <input
                  id="responsible-name"
                  value={name}
                  onChange={e => {
                     setName(e.target.value);
                     setSaved(false);
                  }}
                  required
                  minLength={2}
                  autoComplete="off"
                  aria-invalid={!!error}
                  aria-describedby={error ? "responsible-error" : "responsible-policy"}
               />
            </label>
            <label className="replica-field" htmlFor="responsible-date">
               Válido para novas emissões a partir de
               <input
                  id="responsible-date"
                  type="date"
                  value={date}
                  min={today}
                  onChange={e => {
                     setDate(e.target.value);
                     setSaved(false);
                  }}
                  required
                  aria-describedby="responsible-policy"
               />
            </label>
            <p id="responsible-policy" className="student-muted">
               Cobranças já emitidas e comprovantes mantêm o responsável original. O agendamento não altera essas cobranças.
            </p>
            {error && (
               <p id="responsible-error" role="alert">
                  {error}
               </p>
            )}
            {saved && (
               <p className="cx-responsible-saved" role="status">
                  Alteração agendada. O histórico das cobranças foi preservado.
               </p>
            )}
            <button className="replica-button" type="submit">
               Agendar alteração
            </button>
         </form>
      </div>
   );
}
