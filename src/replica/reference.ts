import raw from "./reference.json";
import type { DemoState } from "../cx/state";
import { curriculum, external } from "../cx/data";
import { primaryDestinations, studentLabels } from "./student/model";

export type ReferenceDialog = { title: string; className: string; slot: string | null; html: string };
export type ServiceField = { name: string; label: string; type: string; required: boolean; options?: string[] };
export type ServiceReference = ReferenceDialog & { name: string; fields: ServiceField[] };
export const reference = raw as {
   shell: string;
   pages: Record<string, { name: string; title: string; crumbs: string }>;
   variants: Record<string, { name: string }>;
   dialogs: Record<string, ReferenceDialog>;
   serviceForms: Record<string, { name: string; title: string }>;
};
const screenModules = import.meta.glob<{ default: { html: string } & Partial<ServiceReference> }>("./screens/*.json");
export async function loadServiceForm(code: string): Promise<ServiceReference> {
   const name = reference.serviceForms[code]?.name;
   const module = screenModules["./screens/" + name + ".json"];
   if (!module) throw new Error("Formulário não encontrado");
   return (await module()).default as ServiceReference;
}
const screenCache = new Map<string, string>();
export async function loadScreen(name: string) {
   const cached = screenCache.get(name);
   if (cached) return cached;
   const module = screenModules["./screens/" + name + ".json"];
   if (!module) throw new Error("Tela não encontrada: " + name);
   const result = (await module()).default.html;
   screenCache.set(name, result);
   return result;
}
export const docNames = [
   "CPF do aluno",
   "RG do aluno",
   "Certidão de nascimento ou casamento",
   "Histórico escolar",
   "Certificado de conclusão",
   "Comprovante de residência",
];
export const escapeHtml = (s: string) =>
   s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const parse = (html: string) => new DOMParser().parseFromString(html, "text/html");
export const aliases: Record<string, string> = {
   "/": "/inicio",
   "/perfil": "/perfil/visao-geral",
   "/meus-dados": "/perfil/visao-geral",
   "/academico": "/meus-estudos",
   "/academico/disciplinas": "/perfil/notas-e-faltas",
   "/academico/notas": "/perfil/notas-e-faltas",
   "/academico/horarios": "/horarios",
   "/academico/jornada": "/jornada-academica",
   "/academico/horas": "/perfil/horas-complementares",
   "/academico/estagio": "/meu-estagio",
   "/academico/avaliacoes": "/avaliar-disciplinas",
   "/academico/institucional": "/avaliacao-institucional",
   "/secretaria": "/secretaria-virtual",
   "/secretaria/servicos": "/solicitacao-servicos/solicitar",
   "/secretaria/solicitacoes": "/solicitacao-servicos",
   "/secretaria/compensacao": "/solicitacao-servicos/compensacao-faltas",
   "/secretaria/dispensa": "/solicitacao-servicos/dispensa-disciplinas",
   "/secretaria/laboratorios": "/solicitacao-servicos/agendamento-laboratorios",
   "/secretaria/contratos": "/contratos",
   "/secretaria/formatura": "/perfil/colacao-de-grau",
   "/meus-dados/documentos": "/perfil/documentos",
   "/meus-dados/certificados": "/perfil/certificados",
   "/meus-dados/carteirinha": "/perfil/visao-geral/carteirinha",
   "/meus-dados/preferencias": "/preferencias",
   "/avisos": "/notificacoes",
   "/financeiro/vencimento": "/financeiro/alteracao-vencimento",
   "/financeiro/responsavel": "/financeiro/alteracao-responsavel",
};
export const routePath = (path: string) => aliases[path] || path.replace(/^\/aluno-online/, "");
export const labels: Record<string, string> = {
   ...studentLabels,
   "/secretaria-virtual": "Secretaria virtual",
   "/preferencias": "Preferências",
   "/ajuda": "Ajuda e orientação",
   "/entrar": "Acessar demonstração",
};
export function titleFor(path: string) {
   return (
      labels[path] ||
      reference.pages[path]?.title ||
      (path.includes("solicitar")
         ? "Solicitar serviço"
         : path.includes("alteracao")
           ? "Financeiro"
           : path.includes("carteirinha")
             ? "Carteirinha"
             : path.includes("notificacoes/")
               ? "Notificação"
               : "Aluno Online")
   );
}
export type NavItem = { label: string; href: string; icon: string };
export const connectedGroups: { label: string; items: NavItem[] }[] = [
   {
      label: "MINHA VIDA ACADÊMICA",
      items: [
         { label: "Notas e faltas", href: "/perfil/notas-e-faltas", icon: "history_edu" },
         { label: "Jornada acadêmica", href: "/jornada-academica", icon: "hiking" },
         { label: "Horas complementares", href: "/perfil/horas-complementares", icon: "hourglass_bottom" },
         { label: "Meu Estágio/TCC/PI", href: "/meu-estagio", icon: "work" },
         { label: "Prática extensionista", href: external.extensao, icon: "extension" },
         { label: "Inscrição DP/Adap", href: external.dp, icon: "gavel" },
         { label: "Eletivas", href: external.eletivas, icon: "menu_book" },
         { label: "Avaliar disciplinas", href: "/avaliar-disciplinas", icon: "insert_chart" },
         { label: "Avaliação institucional", href: "/avaliacao-institucional", icon: "fact_check" },
      ],
   },
   {
      label: "SECRETARIA VIRTUAL",
      items: [
         { label: "Início da secretaria", href: "/secretaria-virtual", icon: "support_agent" },
         { label: "Solicitar um serviço", href: "/solicitacao-servicos/solicitar", icon: "emoji_people" },
         { label: "Minhas solicitações", href: "/solicitacao-servicos", icon: "assignment" },
         { label: "Compensação de faltas", href: "/solicitacao-servicos/compensacao-faltas", icon: "person_add_disabled" },
         { label: "Dispensa de disciplinas", href: "/solicitacao-servicos/dispensa-disciplinas", icon: "library_books" },
         { label: "Agendar laboratório", href: "/solicitacao-servicos/agendamento-laboratorios", icon: "event_available" },
         { label: "Contratos", href: "/contratos", icon: "document_scanner" },
         { label: "Colação de grau", href: "/perfil/colacao-de-grau", icon: "school" },
         { label: "Ouvidoria", href: external.ouvidoria, icon: "forum" },
      ],
   },
   {
      label: "MEU FINANCEIRO",
      items: [
         { label: "Cobranças e extrato", href: "/financeiro", icon: "payments" },
         { label: "Alteração de vencimento", href: "/financeiro/alteracao-vencimento", icon: "account_balance" },
         { label: "Responsável financeiro", href: "/financeiro/alteracao-responsavel", icon: "supervisor_account" },
         { label: "Negociação online", href: external.negociacao, icon: "wallet" },
      ],
   },
   {
      label: "MEUS DADOS",
      items: [
         { label: "Dados cadastrais", href: "/perfil/visao-geral", icon: "person" },
         { label: "Meus documentos", href: "/perfil/documentos", icon: "folder" },
         { label: "Carteirinha", href: "/perfil/visao-geral/carteirinha", icon: "badge" },
         { label: "Certificados", href: "/perfil/certificados", icon: "workspace_premium" },
      ],
   },
   {
      label: "NO DIA A DIA",
      items: [
         { label: "AVA", href: external.ava, icon: "lightbulb" },
         { label: "Biblioteca", href: external.biblioteca, icon: "local_library" },
         { label: "Monitoria", href: external.monitoria, icon: "groups" },
         { label: "CPIC", href: external.cpic, icon: "science" },
         { label: "Calendário acadêmico", href: external.calendario, icon: "calendar_month" },
         { label: "Mural", href: "/mural", icon: "article" },
      ],
   },
];
export const topItems: NavItem[] = [
   { label: "Início", href: "/inicio", icon: "home" },
   { label: "Horários", href: "/horarios", icon: "schedule" },
   { label: "Secretaria virtual", href: "/secretaria-virtual", icon: "support_agent" },
   { label: "Meus dados", href: "/perfil/visao-geral", icon: "person" },
];
export function navLink(item: NavItem) {
   const ext = item.href.startsWith("http");
   return `<li data-slot="sidebar-menu-item" data-sidebar="menu-item" class="group/menu-item relative"><a data-slot="sidebar-menu-button" data-sidebar="menu-button" data-active="false" class="replica-nav-link" href="${escapeHtml(item.href)}" aria-label="${escapeHtml(item.label)}" title="${escapeHtml(item.label)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ""}><span class="material-symbols-outlined" aria-hidden="true">${item.icon}</span><span>${escapeHtml(item.label)}</span>${ext ? '<span class="replica-outbound" aria-hidden="true">↗</span>' : ""}</a></li>`;
}
export function navigationHtml(connected: boolean) {
   const original = parse(reference.shell).querySelector('nav[aria-label="Navegação principal"]')!;
   if (!connected) return original.innerHTML;

   return `<div class="student-sidebar"><ul aria-label="Destinos principais">${primaryDestinations.map(navLink).join("")}</ul><a class="student-sidebar-ava" href="${external.ava}" aria-label="Entrar no AVA (abre em nova aba)" title="Entrar no AVA" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined" aria-hidden="true">lightbulb</span><span>Entrar no AVA</span></a><div class="student-sidebar-bottom"><a class="student-sidebar-course" href="/perfil/visao-geral" aria-label="Meu curso: Ciências Contábeis, 2º período. Ver meus dados." title="Meu curso e meus dados"><span class="material-symbols-outlined" aria-hidden="true">school</span><span><strong>Ciências Contábeis</strong><small>2º período · 2026/2</small></span></a><a class="student-sidebar-help" href="/ajuda" aria-label="Preciso de ajuda" title="Preciso de ajuda"><span class="material-symbols-outlined" aria-hidden="true">help</span><span>Preciso de ajuda</span><span class="material-symbols-outlined student-help-arrow" aria-hidden="true">arrow_forward</span></a></div></div>`;
}
function contextLinks(d: Document, items: { label: string; href: string }[]) {
   const section = d.createElement("nav");
   section.setAttribute("aria-label", "Caminhos relacionados");
   section.className = "replica-context";
   section.innerHTML =
      "<span>Continue por aqui</span>" +
      items
         .map(
            i =>
               `<a href="${escapeHtml(i.href)}"${i.href.startsWith("https:") ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(i.label)} <span aria-hidden="true">↗</span></a>`,
         )
         .join("");
   d.body.append(section);
}
export function preparePage(path: string, html: string, connected: boolean, state: DemoState, period: number) {
   const d = parse(html);
   if (path === "/financeiro/extrato") {
      const statement = d.querySelector("#extrato-financeiro-title")?.closest("section");
      if (statement) {
         const retained = statement.cloneNode(true);
         d.body.replaceChildren();
         const header = d.createElement("header");
         header.className = "replica-page-head";
         header.innerHTML =
            "<h1>Extrato e bolsas</h1><p>Consulte as movimentações e benefícios do seu contrato. Histórico de referência da demonstração.</p>";
         d.body.append(header, retained);
      }
   }
   if (path === "/inicio" && !d.querySelector("h1")) {
      const h = d.createElement("h1");
      h.className = "sr-only";
      h.textContent = "Início do Aluno Online";
      d.body.prepend(h);
   }
   d.querySelectorAll("[style]").forEach(e => {
      const el = e as HTMLElement;
      if (el.style.opacity === "0") el.style.opacity = "1";
   });
   d.querySelectorAll("[data-slot=carousel-content]").forEach(e => {
      const track = e.parentElement;
      if (track) {
         track.classList.add("replica-carousel");
         (e as HTMLElement).style.transform = "none";
      }
   });
   d.querySelectorAll('button[aria-label^="Copiar protocolo"]').forEach(e =>
      e.setAttribute("data-copy", e.getAttribute("aria-label")!.replace("Copiar protocolo ", "")),
   );
   d.querySelectorAll("input").forEach(e => {
      if (e.type === "hidden") e.remove();
      if (e.type === "search" || e.placeholder.toLowerCase().includes("buscar")) e.dataset.pageSearch = "true";
      const label = e.id ? d.querySelector(`label[for="${e.id}"]`)?.textContent : "";
      if (label) e.setAttribute("aria-label", label);
      if (label?.includes("Data inicial")) {
         e.type = "date";
         e.required = true;
      }
      if (e.id === "lab-descricao" || e.id === "lab-inicio" || e.id === "lab-fim" || (e.type === "number" && path.includes("compensacao")))
         e.required = true;
      if (e.type === "file" && (path.includes("compensacao") || path.includes("dispensa"))) e.required = true;
   });
   // Native select fields keep the original field geometry, and work with mobile keyboards.
   d.querySelectorAll("button[role=combobox]").forEach(e => {
      if (e.id === "dispensa-disciplinas") {
         e.setAttribute("data-select-subjects", "true");
         return;
      }
      const select = d.createElement("select");
      select.className = e.className;
      select.setAttribute(
         "aria-label",
         e.getAttribute("aria-label") || e.parentElement?.querySelector("label")?.textContent || "Selecionar opção",
      );
      select.id = e.id;
      if (e.id) {
         const label = d.querySelector(`label[for="${e.id}"]`);
         if (label) select.setAttribute("aria-label", label.textContent || "Selecionar opção");
      }
      const label = (select.getAttribute("aria-label") + " " + e.parentElement?.textContent).toLowerCase();
      const values = label.includes("situaç")
         ? ["Todas", "Em andamento", "Concluído", "Cancelado", "Recusado", "Atendimento automático"]
         : label.includes("avisos")
           ? ["Últimos 6 meses", "Últimos 30 dias", "Últimos 7 dias", "Todos os avisos"]
           : label.includes("disciplin")
             ? curriculum.flat().map(x => x.name)
             : label.includes("local")
               ? ["Selecione…", "Campus Professor Pedro Clarismundo Fornari", "Campus Central"]
               : label.includes("recurso")
                 ? ["Selecione…", "Laboratório de Informática · demonstração", "Laboratório de Práticas · demonstração"]
                 : ["Selecione…", "Sim", "Não"];
      select.innerHTML = values.map((v, i) => `<option value="${i ? "v" + i : ""}">${escapeHtml(v)}</option>`).join("");
      if (e.hasAttribute("disabled")) select.disabled = true;
      if (!label.includes("situaç") && !label.includes("avisos")) select.required = true;
      e.replaceWith(select);
   });
   d.querySelectorAll("button[role=checkbox]").forEach(e => {
      const input = d.createElement("input");
      input.type = "checkbox";
      input.id = e.id;
      input.className = "replica-native-checkbox";
      input.required = path.includes("compensacao");
      input.setAttribute("aria-label", d.querySelector(`label[for="${e.id}"]`)?.textContent || "Confirmar ciência");
      const parent = e.parentElement;
      e.replaceWith(input);
      parent?.querySelectorAll("input[aria-hidden=true]").forEach(x => x.remove());
   });
   const labDate = d.querySelector("#lab-data");
   if (labDate) {
      const input = d.createElement("input");
      input.type = "date";
      input.id = "lab-data";
      input.required = true;
      input.disabled = true;
      input.className = labDate.className;
      input.setAttribute("aria-label", "Data do Agendamento");
      labDate.replaceWith(input);
   }
   d.querySelectorAll("button").forEach(e => {
      if (e.textContent?.trim() === "Close") e.setAttribute("aria-label", "Fechar");
      if (e.getAttribute("aria-label")?.includes("O que achou")) e.remove();
   });
   if (path === "/perfil/documentos") {
      d.querySelector("h2")?.setAttribute("id", "documentos-matricula");
      docNames.forEach((name, i) => {
         const status = state.docs[String(i)];
         if (!status) return;
         const button = Array.from(d.querySelectorAll("button")).find(e => e.textContent?.startsWith(name));
         if (!button) return;
         button.setAttribute("data-document", String(i));
         const walker = d.createTreeWalker(button, NodeFilter.SHOW_TEXT);
         while (walker.nextNode()) {
            if (walker.currentNode.textContent === "Pendente") walker.currentNode.textContent = status.status;
         }
         button.classList.add("replica-doc-sent");
      });
      const count = Object.keys(state.docs).length;
      if (count) {
         const dl = d.querySelector("dl");
         dl?.querySelectorAll("dt").forEach(dt => {
            const dd = dt.nextElementSibling;
            if (dd)
               dd.textContent = dt.textContent?.toLowerCase().includes("confer")
                  ? String(count)
                  : dt.textContent?.toLowerCase().includes("falta")
                    ? String(6 - count)
                    : "0";
         });
         const summary = d.createElement("p");
         summary.className = "replica-inline-success";
         summary.textContent = `${count} de 6 documentos enviados para conferência nesta demonstração.`;
         d.querySelector("h2")?.parentElement?.append(summary);
      }
   }
   if (path === "/inicio") {
      const sent = Object.keys(state.docs).length;
      const pending = state.requests.filter(r => r.status === "Aguardando pagamento").length + (state.scenario === "financeiro" ? 1 : 0);
      const walker = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
         if (walker.currentNode.textContent === "Faltam 6 de 6" && sent)
            walker.currentNode.textContent = sent === 6 ? "Todos enviados" : `Faltam ${6 - sent} de 6`;
         if (walker.currentNode.textContent === "Sem pendências" && pending)
            walker.currentNode.textContent = `${pending} pagamento${pending === 1 ? "" : "s"} para conferir`;
      }
   }
   if (path === "/solicitacao-servicos") {
      const list = state.requests.filter(r => connected || !["DEMO-1041", "DEMO-1042"].includes(r.id));
      if (list.length) {
         const section = d.createElement("section");
         section.className = "replica-local-requests";
         section.innerHTML =
            "<h2>Solicitações criadas nesta demonstração</h2>" +
            list
               .map(
                  r =>
                     `<button class="replica-local-request" data-local-request="${escapeHtml(r.id)}"><span><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(r.id)}</small></span><span class="replica-status-pill">${escapeHtml(r.status)}</span><span aria-hidden="true">›</span></button>`,
               )
               .join("");
         d.querySelector("h1")?.parentElement?.after(section);
      }
   }
   if (path === "/financeiro") {
      const pending = [
         ...state.requests.filter(r => r.status === "Aguardando pagamento"),
         ...(state.scenario === "financeiro" ? [{ id: "DEMO-MENSALIDADE", name: "Mensalidade de exemplo", price: 890 }] : []),
      ];
      if (pending.length) {
         const heading = d.querySelector("h1");
         if (heading) {
            heading.textContent = "Você tem pagamentos para conferir";
            const parent = heading.parentElement;
            parent
               ?.querySelectorAll("p")
               .forEach(p => (p.textContent = "Valores fictícios para avaliar o percurso. Nenhuma cobrança real será gerada."));
         }
         const charges = d.querySelector("#cobrancas");
         if (charges) {
            charges.innerHTML =
               '<div class="replica-local-charges"><h2>Cobranças de demonstração</h2><p>Confira a origem da cobrança antes de continuar.</p>' +
               pending
                  .map(
                     r =>
                        `<div><span><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(r.id)} · ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(r.price)}</small></span><button class="replica-button" data-pay-demo="${escapeHtml(r.id)}">Simular pagamento</button>${r.id === "DEMO-MENSALIDADE" ? "" : `<button class="replica-text-button" data-local-request="${escapeHtml(r.id)}">Ver solicitação</button>`}</div>`,
                  )
                  .join("") +
               "</div>";
         }
      }
   }
   if (path === "/jornada-academica") {
      // The desktop source and mobile source share data, but use different interaction structures.
      const mobile = Array.from(d.querySelectorAll("button[aria-expanded][aria-label]")).filter(e =>
         /^\dº período/.test(e.getAttribute("aria-label")!),
      );
      for (const button of mobile) {
         const n = Number(button.getAttribute("aria-label")!.charAt(0));
         const li = button.closest("li");
         if (!li) continue;
         Array.from(li.children)
            .filter(e => e.tagName !== "BUTTON" && !e.classList.contains("pointer-events-none"))
            .forEach(e => e.remove());
         li.querySelectorAll(".replica-period-content").forEach(e => e.remove());
         const old = Array.from(li.children).find(e => e.tagName !== "BUTTON" && e.tagName !== "DIV");
         old?.remove();
         if (n === period) {
            const variant = parse(html);
            const heading = Array.from(variant.querySelectorAll("h3")).find(e => e.textContent?.includes("Período"));
            const list = heading?.parentElement?.parentElement?.querySelector("ul") || heading?.parentElement?.nextElementSibling;
            const div = d.createElement("div");
            div.className = "replica-period-content col-span-2";
            div.innerHTML =
               list?.tagName === "UL"
                  ? list.outerHTML
                  : `<ul class="replica-unit-list">${(curriculum[n - 1] || []).map(x => `<li><strong>${escapeHtml(x.name)}</strong><span>${x.hours} horas · ${n === 1 ? "Aprovado" : n === 2 ? "Cursando" : "A cursar"}</span></li>`).join("")}</ul>`;
            li.append(div);
         }
         button.setAttribute("aria-expanded", String(n === period));
      }
   }
   if (connected) {
      if (path === "/inicio")
         d.querySelectorAll('a[href="/perfil/documentos"]').forEach(a => a.setAttribute("href", "/perfil/documentos#documentos-matricula"));
      if (["/perfil/notas-e-faltas", "/perfil/horas-complementares", "/perfil/colacao-de-grau"].includes(path)) {
         const banner = d.querySelector('[aria-label="Identificação do aluno"]');
         const nav = d.querySelector('[aria-label="Seções do perfil"]');
         banner?.remove();
         nav?.parentElement?.querySelector('button[aria-label="Sair"]')?.remove();
         nav?.remove();
         Array.from(d.querySelectorAll("button"))
            .filter(x => x.textContent?.trim() === "Sair")
            .forEach(x => x.remove());
         const head = d.createElement("header");
         head.className = "replica-page-head";
         head.innerHTML = `<h1>${escapeHtml(titleFor(path))}</h1><p>${path.includes("notas") ? "Notas, frequência e próximos passos das suas disciplinas." : path.includes("horas") ? "Acompanhe as atividades que fazem parte da sua formação." : "Acompanhe as etapas para concluir sua graduação."}</p>`;
         d.body.prepend(head);
      } else if (path.startsWith("/perfil/")) {
         const nav = d.querySelector('[aria-label="Seções do perfil"]');
         nav?.querySelectorAll("a").forEach(a => {
            const href = a.getAttribute("href") || "";
            if (["/perfil/notas-e-faltas", "/perfil/horas-complementares", "/perfil/colacao-de-grau"].includes(href)) a.remove();
         });
      }
      if (path === "/perfil/notas-e-faltas")
         contextLinks(d, [
            { label: "Ver meus horários", href: "/horarios" },
            { label: "Compensação de faltas", href: "/solicitacao-servicos/compensacao-faltas" },
            { label: "Pedir revisão de nota", href: "/solicitacao-servicos/solicitar/CSA_165" },
            { label: "Minha jornada", href: "/jornada-academica" },
         ]);
      if (path === "/perfil/horas-complementares")
         contextLinks(d, [
            { label: "Meus certificados", href: "/perfil/certificados" },
            { label: "Regulamento das atividades", href: external.horasEdital },
            { label: "Secretaria virtual", href: "/secretaria-virtual" },
         ]);
      if (path === "/perfil/documentos")
         contextLinks(d, [
            { label: "Meus dados cadastrais", href: "/perfil/visao-geral" },
            { label: "Pedir histórico ou declaração", href: "/solicitacao-servicos/solicitar" },
            { label: "Acompanhar solicitações", href: "/solicitacao-servicos" },
         ]);
      if (path === "/financeiro")
         contextLinks(d, [
            { label: "Meus contratos", href: "/contratos" },
            { label: "Solicitações com custo", href: "/solicitacao-servicos" },
            { label: "Secretaria virtual", href: "/secretaria-virtual" },
         ]);
      if (path === "/contratos")
         contextLinks(d, [
            { label: "Meu financeiro", href: "/financeiro" },
            { label: "Meus documentos", href: "/perfil/documentos" },
            { label: "Secretaria virtual", href: "/secretaria-virtual" },
         ]);
      if (path === "/meu-estagio")
         contextLinks(d, [
            { label: "Solicitar carta de estágio", href: "/solicitacao-servicos/solicitar/CSA_117" },
            { label: "Solicitar atestado de estágio", href: "/solicitacao-servicos/solicitar/CSA_168" },
            { label: "Minha jornada", href: "/jornada-academica" },
         ]);
      if (path === "/jornada-academica") {
         contextLinks(d, [
            { label: "Meus horários", href: "/horarios" },
            { label: "Notas e faltas", href: "/perfil/notas-e-faltas" },
            { label: "Aproveitar disciplinas", href: "/solicitacao-servicos/dispensa-disciplinas" },
            { label: "Meus certificados", href: "/perfil/certificados" },
         ]);
         if (state.scenario === "dp") {
            const section = d.createElement("section");
            section.className = "replica-dp-example";
            section.id = "disciplinas-regularizar";
            section.innerHTML = `<h2>Disciplinas para regularizar</h2><p>Cenário de demonstração · essas pendências são fictícias.</p>${[
               { name: "Fundamentos da Contabilidade", type: "Dependência (DP)" },
               { name: "Direito Aplicado aos Negócios", type: "Adaptação" },
            ]
               .map(
                  x =>
                     `<div><span><strong>${x.name}</strong><small>${x.type}</small></span><a class="replica-button" href="${external.dp}" target="_blank" rel="noopener noreferrer">Inscrever em ${x.type.startsWith("Depend") ? "DP" : "adaptação"} ↗</a></div>`,
               )
               .join(
                  "",
               )}<a href="${external.dpEdital}" target="_blank" rel="noopener noreferrer">Consultar disciplinas ofertadas e edital ↗</a>`;
            d.querySelector("section")?.append(section);
         }
      }
   }
   // No data from input is interpreted as HTML.
   if (state.profile.name !== "Marina Costa") {
      const walker = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
         walker.currentNode.textContent = walker.currentNode.textContent?.replaceAll("Marina Costa", state.profile.name) || "";
      }
   }
   return d.body.innerHTML;
}
