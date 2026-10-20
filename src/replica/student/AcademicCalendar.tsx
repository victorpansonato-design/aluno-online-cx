import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, ExternalLink, Search, Star, X } from "lucide-react";
import { useDemo } from "../../cx/state";
import { normalize, external } from "../../cx/data";
import { academicEvents, formatDate, monthBounds, overlaps, today, type AcademicEvent } from "./model";

const categoryClass = (category: string) => "student-event-" + normalize(category).replaceAll(" ", "-");
export function CalendarGrid({
   offset,
   events,
   selected,
   onSelect,
   compact = false,
}: {
   offset: number;
   events: AcademicEvent[];
   selected: string;
   onSelect: (date: string) => void;
   compact?: boolean;
}) {
   const month = monthBounds(offset);
   const blanks = month.date.getDay();
   return (
      <div
         className={"student-month-grid" + (compact ? " compact" : "")}
         role="group"
         aria-label={new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(month.date)}
      >
         {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(day => (
            <span key={day} className="student-weekday" aria-hidden="true">
               {day}
            </span>
         ))}
         {Array.from({ length: blanks }, (_, i) => (
            <span className="student-calendar-blank" key={"blank" + i} aria-hidden="true" />
         ))}
         {Array.from({ length: month.days }, (_, i) => {
            const date = month.iso(i + 1);
            const items = events.filter(event => overlaps(event, date, date));
            return (
               <button
                  key={date}
                  className="student-calendar-day"
                  aria-current={date === today ? "date" : undefined}
                  aria-pressed={selected === date}
                  aria-label={
                     formatDate(date, { dateStyle: "full" }) +
                     (items.length ? `, ${items.length} ${items.length === 1 ? "evento" : "eventos"}` : ", sem eventos")
                  }
                  onClick={() => onSelect(date)}
               >
                  <span>{i + 1}</span>
                  <span className="student-day-events" aria-hidden="true">
                     {items.slice(0, compact ? 3 : 2).map(event => (
                        <i title={event.title} key={event.id} className={categoryClass(event.category)} />
                     ))}
                     {!compact && items.length > 2 && <small>+{items.length - 2}</small>}
                  </span>
               </button>
            );
         })}
      </div>
   );
}
export function CalendarPreview() {
   const [selected, setSelected] = useState("");
   const upcoming = academicEvents.filter(event => event.end >= today && event.start > today).slice(0, 3);
   const dateEvents = selected ? academicEvents.filter(event => overlaps(event, selected, selected)) : upcoming;
   return (
      <section className="student-calendar-preview" aria-labelledby="home-calendar-title">
         <div className="student-section-heading">
            <h2 id="home-calendar-title">Seu calendário acadêmico</h2>
            <Link to="/calendario-academico">
               Ver completo <ArrowRight size={15} />
            </Link>
         </div>
         <div className="student-calendar-preview-body">
            <div>
               <div className="student-mini-month-title">
                  <CalendarDays size={16} />
                  <strong>Outubro de 2026</strong>
               </div>
               <CalendarGrid compact offset={0} events={academicEvents} selected={selected} onSelect={setSelected} />
            </div>
            <div className="student-preview-events">
               <div className="student-preview-events-title">
                  <strong>{selected ? formatDate(selected, { day: "numeric", month: "long" }) : "Próximos prazos"}</strong>
                  {selected && (
                     <button aria-label="Voltar aos próximos prazos" className="student-icon-button" onClick={() => setSelected("")}>
                        <X size={15} />
                     </button>
                  )}
               </div>
               {dateEvents.slice(0, 3).map(event => (
                  <Link key={event.id} className="student-preview-event" to={"/calendario-academico?evento=" + event.id}>
                     <span className={"student-event-date " + categoryClass(event.category)}>
                        <strong>{formatDate(event.start, { day: "2-digit" })}</strong>
                        <small>{formatDate(event.start, { month: "short" }).replace(".", "")}</small>
                     </span>
                     <span>
                        <strong>{event.title}</strong>
                        <small>
                           {event.example ? "Exemplo de lembrete" : event.category}
                           {event.end !== event.start ? " · até " + formatDate(event.end) : ""}
                        </small>
                     </span>
                     <ArrowRight size={14} />
                  </Link>
               ))}
               {!dateEvents.length && <p className="student-muted">Nenhum evento previsto para este dia.</p>}
               <p className="student-data-note">Prévia demonstrativa. Confirme datas e regras no calendário oficial do seu curso.</p>
            </div>
         </div>
      </section>
   );
}
export default function AcademicCalendar() {
   const { state, update } = useDemo();
   const [params, setParams] = useSearchParams();
   const [offset, setOffset] = useState(0),
      [selectedDate, setSelectedDate] = useState(""),
      [query, setQuery] = useState(""),
      [category, setCategory] = useState("Todos"),
      [favoritesOnly, setFavoritesOnly] = useState(false);
   const month = monthBounds(offset);
   const selectedEvent = academicEvents.find(event => event.id === params.get("evento"));
   const matches = academicEvents.filter(
      event =>
         overlaps(event, month.first, month.last) &&
         (category === "Todos" || event.category === category) &&
         normalize(event.title + " " + event.description).includes(normalize(query)) &&
         (!favoritesOnly || state.favoriteDates.includes(event.id)),
   );
   const visible = selectedDate ? matches.filter(event => overlaps(event, selectedDate, selectedDate)) : matches;
   const toggleFavorite = (id: string) =>
      update(s => ({
         ...s,
         favoriteDates: s.favoriteDates.includes(id) ? s.favoriteDates.filter(x => x !== id) : [...s.favoriteDates, id],
      }));
   const openEvent = (id: string) => {
      setParams({ evento: id });
   };
   return (
      <div className="student-page student-calendar-page" data-student-ui>
         <header className="student-page-heading">
            <div>
               <h1>Calendário acadêmico</h1>
               <p>Saiba o que vem pela frente e encontre o que importa para o seu semestre.</p>
            </div>
            <a className="replica-button secondary" href={external.calendario} target="_blank" rel="noopener noreferrer">
               Calendário oficial <ExternalLink size={15} />
            </a>
         </header>
         <div className="student-calendar-toolbar">
            <label className="student-search">
               <Search size={18} />
               <span className="sr-only">Buscar no calendário</span>
               <input
                  type="search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Buscar prova, feriado, atividade…"
               />
            </label>
            <button className="replica-button secondary" aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly(v => !v)}>
               <Star size={16} fill={favoritesOnly ? "currentColor" : "none"} />
               Meus favoritos
            </button>
         </div>
         <div className="student-calendar-filters" role="group" aria-label="Filtrar calendário por assunto">
            {["Todos", "Avaliações", "Prazos", "Atividades", "Feriados"].map(item => (
               <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>
                  {item}
               </button>
            ))}
         </div>
         <div className="student-full-calendar">
            <section className="student-calendar-board" aria-label="Dias do mês">
               <div className="student-month-controls">
                  <button
                     className="student-icon-button"
                     aria-label="Mês anterior"
                     onClick={() => {
                        setOffset(n => n - 1);
                        setSelectedDate("");
                     }}
                  >
                     <ChevronLeft size={18} />
                  </button>
                  <h2>{new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(month.date)}</h2>
                  <button
                     className="student-icon-button"
                     aria-label="Mês seguinte"
                     onClick={() => {
                        setOffset(n => n + 1);
                        setSelectedDate("");
                     }}
                  >
                     <ChevronRight size={18} />
                  </button>
               </div>
               <CalendarGrid
                  offset={offset}
                  events={matches}
                  selected={selectedDate}
                  onSelect={date => {
                     setSelectedDate(date);
                     setParams({});
                  }}
               />
               <button
                  className="student-text-link"
                  onClick={() => {
                     setOffset(0);
                     setSelectedDate(today);
                     setParams({});
                  }}
               >
                  Ir para hoje · 20 de outubro
               </button>
               <p className="student-data-note">
                  Selecione um dia para ver os eventos. Faixas indicam períodos; favoritos ficam salvos neste navegador.
               </p>
            </section>
            <section className="student-calendar-agenda" aria-label="Eventos do calendário">
               <div className="student-section-heading">
                  <h2>{selectedDate ? formatDate(selectedDate, { day: "numeric", month: "long" }) : "Eventos do mês"}</h2>
                  {selectedDate && (
                     <button className="student-text-link" onClick={() => setSelectedDate("")}>
                        Ver mês todo
                     </button>
                  )}
               </div>
               <p className="student-muted" role="status">
                  {visible.length} {visible.length === 1 ? "evento encontrado" : "eventos encontrados"}
               </p>
               {selectedEvent && (
                  <article className="student-event-detail" aria-live="polite">
                     <div className="student-section-heading">
                        <span className="student-status">{selectedEvent.category}</span>
                        <button className="student-icon-button" aria-label="Fechar detalhes do evento" onClick={() => setParams({})}>
                           <X size={17} />
                        </button>
                     </div>
                     <h3>{selectedEvent.title}</h3>
                     <p>
                        <strong>{formatDate(selectedEvent.start, { dateStyle: "long" })}</strong>
                        {selectedEvent.end !== selectedEvent.start ? " até " + formatDate(selectedEvent.end, { dateStyle: "long" }) : ""}
                     </p>
                     <p>{selectedEvent.description}</p>
                     {selectedEvent.action &&
                        (selectedEvent.action.href.startsWith("http") ? (
                           <a className="replica-button" href={selectedEvent.action.href} target="_blank" rel="noopener noreferrer">
                              {selectedEvent.action.label}
                              <ExternalLink size={16} />
                           </a>
                        ) : (
                           <Link className="replica-button" to={selectedEvent.action.href}>
                              {selectedEvent.action.label}
                              <ArrowRight size={16} />
                           </Link>
                        ))}
                  </article>
               )}
               <div className="student-agenda-list">
                  {visible.map(event => (
                     <article key={event.id} className={"student-agenda-item " + (event.end < today ? "past" : "")}>
                        <div className={"student-agenda-mark " + categoryClass(event.category)} />
                        <button
                           className="student-agenda-open"
                           onClick={() => openEvent(event.id)}
                           aria-pressed={selectedEvent?.id === event.id}
                        >
                           <span>
                              {formatDate(event.start)}
                              {event.end !== event.start ? " a " + formatDate(event.end) : ""}
                           </span>
                           <strong>{event.title}</strong>
                           <small>
                              {event.category}
                              {event.example ? " · demonstração" : ""}
                           </small>
                        </button>
                        <button
                           className="student-icon-button"
                           aria-label={(state.favoriteDates.includes(event.id) ? "Remover dos favoritos: " : "Favoritar: ") + event.title}
                           aria-pressed={state.favoriteDates.includes(event.id)}
                           onClick={() => toggleFavorite(event.id)}
                        >
                           <Star size={17} fill={state.favoriteDates.includes(event.id) ? "currentColor" : "none"} />
                        </button>
                     </article>
                  ))}
               </div>
               {!visible.length && (
                  <div className="student-empty">
                     <CalendarDays size={25} />
                     <h3>Nenhum evento com esses filtros</h3>
                     <p>Tente outro mês ou mostre todos os assuntos.</p>
                     <button
                        className="replica-button secondary"
                        onClick={() => {
                           setQuery("");
                           setCategory("Todos");
                           setFavoritesOnly(false);
                           setSelectedDate("");
                        }}
                     >
                        Limpar filtros
                     </button>
                  </div>
               )}
            </section>
         </div>
         <div className="student-calendar-disclosure">
            <p>Esta prévia combina o esboço enviado com eventos ilustrativos. Ela não consulta nem publica o calendário institucional.</p>
            <a href="https://calendarios-academicos-pink.vercel.app/#/visao-aluno/portal" target="_blank" rel="noopener noreferrer">
               Abrir esboço original <ExternalLink size={14} />
            </a>
         </div>
      </div>
   );
}
