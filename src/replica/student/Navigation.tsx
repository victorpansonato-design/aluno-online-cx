import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { financialDestinations, sectionFor, secretariatDestinations, studyDestinations, type Destination } from "./model";

export function SectionNavigation({ path }: { path: string }) {
   const ref = useRef<HTMLElement>(null);
   const section = sectionFor(path);
   const communications = path === "/comunicados" || path.startsWith("/notificacoes") || path === "/mural";
   const items = communications
      ? [
           { label: "Para minha rotina", href: "/comunicados" },
           { label: "Todos os avisos", href: "/notificacoes" },
           { label: "Mural da instituição", href: "/mural" },
        ]
      : section?.href === "/meus-estudos"
        ? studyDestinations
        : section?.href === "/secretaria-virtual"
          ? secretariatDestinations
          : section?.href === "/financeiro"
            ? financialDestinations.slice(0, 2)
            : [];
   useLayoutEffect(() => {
      const selected = ref.current?.querySelector<HTMLElement>("[aria-current=page]");
      const nav = ref.current;
      if (selected && nav && nav.scrollWidth > nav.clientWidth) {
         nav.scrollLeft +=
            selected.getBoundingClientRect().left - nav.getBoundingClientRect().left - (nav.clientWidth - selected.offsetWidth) / 2;
      }
   }, [path]);
   if (!items.length) return null;
   return (
      <nav
         ref={ref}
         data-student-ui
         className={"student-section-nav" + (section?.href === "/financeiro" ? " student-financial-nav" : "")}
         aria-label={communications ? "Avisos e comunicados" : `Seções de ${section!.label.toLowerCase()}`}
      >
         {items.map(item => (
            <Link
               key={item.href}
               to={item.href}
               aria-current={
                  path === item.href ||
                  (item.href === "/solicitacao-servicos/solicitar" && path.startsWith("/solicitacao-servicos/solicitar/")) ||
                  (item.href === "/notificacoes" && path.startsWith("/notificacoes/")) ||
                  (item.href === "/meus-estudos/atividades" && ["/perfil/horas-complementares", "/meus-estudos/extensao"].includes(path))
                     ? "page"
                     : undefined
               }
            >
               {item.label}
            </Link>
         ))}
      </nav>
   );
}
export function DestinationList({ items }: { items: Destination[] }) {
   return (
      <div className="student-destinations">
         {items.map(item => {
            const external = item.href.startsWith("https:");
            const intent = (item.href + " " + item.label + " " + item.icon)
               .normalize("NFD")
               .replace(/[\u0300-\u036f]/g, "")
               .toLowerCase();
            const tone = /eletiv/.test(intent)
               ? "support"
               : /estagio|tcc|certific|\bhoras\b|atividad|extens|formacao/.test(intent)
                 ? "formation"
                 : /avali|ouvid/.test(intent)
                   ? "feedback"
                   : /bibli|monitor|pesquisa|eletiv|dp|adap/.test(intent)
                     ? "support"
                     : "academic";
            const content = (
               <>
                  <span className="material-symbols-outlined" aria-hidden="true">
                     {item.icon}
                  </span>
                  <span>
                     <strong>{item.label}</strong>
                     {item.description && <small>{item.description}</small>}
                  </span>
                  {external ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
               </>
            );
            return external ? (
               <a
                  key={item.href}
                  id={item.id}
                  data-tone={tone}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label + " (abre em nova aba)"}
               >
                  {content}
               </a>
            ) : (
               <Link key={item.href} id={item.id} to={item.href} data-tone={tone}>
                  {content}
               </Link>
            );
         })}
      </div>
   );
}
