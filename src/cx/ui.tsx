import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight, CircleHelp, FileText, Info, Search, X } from "lucide-react";
import { Dialog as D } from "radix-ui";
import { toast } from "sonner";
export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
   return <span className={`pill ${tone}`}>{children}</span>;
}
export function Ext({ href, children, className = "button secondary" }: { href: string; children: ReactNode; className?: string }) {
   return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
         {children}
         <ArrowUpRight size={16} />
         <span className="sr-only"> (sistema externo, abre em nova aba)</span>
      </a>
   );
}
export function NextLink({ to, children }: { to: string; children: ReactNode }) {
   return (
      <Link className="text-link" to={to}>
         {children}
         <ArrowRight size={16} />
      </Link>
   );
}
export function SectionHead({
   title,
   to,
   action = "Ver tudo",
   children,
}: {
   title: string;
   to?: string;
   action?: string;
   children?: ReactNode;
}) {
   return (
      <div className="section-heading">
         <div>
            <h2>{title}</h2>
            {children}
         </div>
         {to && <NextLink to={to}>{action}</NextLink>}
      </div>
   );
}
export function PageHead({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
   return (
      <div className="page-heading">
         <div>
            <h1 tabIndex={-1} id="page-title">
               {title}
            </h1>
            <p>{description}</p>
         </div>
         {children}
      </div>
   );
}
export function Callout({ title, children, tone = "info" }: { title: string; children: ReactNode; tone?: string }) {
   return (
      <div className={`callout ${tone}`}>
         <Info size={20} />
         <div>
            <strong>{title}</strong>
            <div>{children}</div>
         </div>
      </div>
   );
}
export function Empty({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
   return (
      <div className="empty">
         <span className="empty-icon">
            <CheckCircle2 size={28} />
         </span>
         <h2>{title}</h2>
         <p>{children}</p>
         {action}
      </div>
   );
}
export function SearchField({
   value,
   onChange,
   placeholder,
   label = "Buscar",
}: {
   value: string;
   onChange: (v: string) => void;
   placeholder: string;
   label?: string;
}) {
   return (
      <div className="search-field">
         <Search size={19} />
         <input aria-label={label} type="search" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
         {value && (
            <button className="icon-button" aria-label="Limpar busca" onClick={() => onChange("")}>
               <X size={16} />
            </button>
         )}
      </div>
   );
}
export function RowLink({
   to,
   title,
   description,
   icon,
   badge,
}: {
   to: string;
   title: string;
   description?: string;
   icon?: ReactNode;
   badge?: ReactNode;
}) {
   return (
      <Link to={to} className="row-link">
         {icon && <span className="row-icon">{icon}</span>}
         <span className="row-copy">
            <strong>{title}</strong>
            {description && <span>{description}</span>}
         </span>
         {badge}
         <ChevronRight size={18} />
      </Link>
   );
}
export function Related({ items }: { items: { to: string; title: string; description?: string }[] }) {
   return (
      <section className="related">
         <h2>Talvez você também precise</h2>
         <div>
            {items.map(i => (
               <RowLink key={i.to} {...i} icon={<CircleHelp size={19} />} />
            ))}
         </div>
      </section>
   );
}
export function Modal({
   open,
   onClose,
   title,
   description,
   children,
}: {
   open: boolean;
   onClose: () => void;
   title: string;
   description: string;
   children: ReactNode;
}) {
   return (
      <D.Root open={open} onOpenChange={v => !v && onClose()}>
         <D.Portal>
            <D.Overlay className="dialog-overlay" />
            <D.Content className="dialog-content">
               <D.Title className="dialog-title">{title}</D.Title>
               <D.Description className="dialog-description">{description}</D.Description>
               <D.Close className="icon-button dialog-close" aria-label="Fechar">
                  <X size={20} />
               </D.Close>
               {children}
            </D.Content>
         </D.Portal>
      </D.Root>
   );
}
export function downloadText(name: string, text: string, type = "text/plain;charset=utf-8") {
   const blob = new Blob([text], { type });
   const url = URL.createObjectURL(blob);
   const a = document.createElement("a");
   a.href = url;
   a.download = name;
   a.click();
   setTimeout(() => URL.revokeObjectURL(url), 1000);
   toast.success("Arquivo de demonstração baixado");
}
export function downloadDocument(title: string, content = "") {
   const safe = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
   downloadText(
      "demonstracao-" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".html",
      `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>${safe(title)}</title><style>body{font:16px system-ui;max-width:760px;margin:70px auto;padding:24px;color:#172b4c}h1{color:#153977}p{line-height:1.6}.demo{border:2px solid #153977;padding:16px}button{padding:12px}@media print{button{display:none}}</style><p class="demo">DEMONSTRAÇÃO · SEM VALIDADE ACADÊMICA, FINANCEIRA OU JURÍDICA</p><h1>${safe(title)}</h1><p>Aluno fictício · Ciências Contábeis</p><p>${safe(content || "Documento ilustrativo gerado pelo protótipo local. Não representa um documento emitido pelo Grupo Anchieta.")}</p><p>Gerado em ${new Date().toLocaleDateString("pt-BR")}.</p><button onclick="window.print()">Imprimir ou salvar como PDF</button></html>`,
      "text/html;charset=utf-8",
   );
}
export function DocButton({ title, label = "Baixar exemplo" }: { title: string; label?: string }) {
   return (
      <button className="button secondary" onClick={() => downloadDocument(title)}>
         <FileText size={17} />
         {label}
      </button>
   );
}
