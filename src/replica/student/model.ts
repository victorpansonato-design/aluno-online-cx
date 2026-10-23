import type { DemoState } from "../../cx/state";
import { external } from "../../cx/data";

export const today = "2026-10-20";
export const recentNotices = [
   { title: "Tem vaga nova pra você!", category: "Carreira", date: "2026-10-19", href: "/notificacoes/76149709" },
   { title: "The English Lab · 7h (horário de Brasília)", category: "Idiomas", date: "2026-10-19", href: "/notificacoes/76088111" },
];
export const dateValue = (value: string) => new Date(value + "T12:00:00");
export const formatDate = (value: string, options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" }) =>
   new Intl.DateTimeFormat("pt-BR", options).format(dateValue(value));
export const currency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
export type Destination = { label: string; href: string; icon: string; description?: string; id?: string };
export const electivesHref = "/meus-estudos/atividades#eletivas";
export const electivesLegacyRoutes = ["/academico/eletivas", "/meus-estudos/eletivas", "/eletivas"];
export const primaryDestinations: Destination[] = [
   { label: "Início", href: "/inicio", icon: "home" },
   { label: "Meus estudos", href: "/meus-estudos", icon: "menu_book" },
   { label: "Secretaria virtual", href: "/secretaria-virtual", icon: "support_agent" },
   { label: "Financeiro", href: "/financeiro", icon: "payments" },
   { label: "Calendário", href: "/calendario-academico", icon: "calendar_month" },
   { label: "Meus dados", href: "/perfil/visao-geral", icon: "person" },
];
export const studyDestinations: Destination[] = [
   { label: "Visão geral", href: "/meus-estudos", icon: "menu_book" },
   { label: "Horários", href: "/horarios", icon: "schedule" },
   { label: "Notas e faltas", href: "/perfil/notas-e-faltas", icon: "history_edu" },
   { label: "Jornada do curso", href: "/jornada-academica", icon: "hiking" },
   { label: "Atividades e horas", href: "/meus-estudos/atividades", icon: "hourglass_bottom" },
   { label: "Estágio, TCC e PI", href: "/meu-estagio", icon: "work" },
];
export const secretariatDestinations: Destination[] = [
   { label: "Visão geral", href: "/secretaria-virtual", icon: "support_agent" },
   { label: "Solicitar um serviço", href: "/solicitacao-servicos/solicitar", icon: "add_circle" },
   { label: "Meus pedidos", href: "/solicitacao-servicos", icon: "assignment" },
   { label: "Contratos", href: "/contratos", icon: "description" },
   { label: "Formatura", href: "/perfil/colacao-de-grau", icon: "school" },
];
export const financialDestinations: Destination[] = [
   { label: "Cobranças e pagamentos", href: "/financeiro", icon: "payments" },
   { label: "Extrato e bolsas", href: "/financeiro/extrato", icon: "receipt_long" },
   { label: "Vencimento", href: "/financeiro/alteracao-vencimento", icon: "event" },
   { label: "Responsável financeiro", href: "/financeiro/alteracao-responsavel", icon: "person" },
];
export function sectionFor(path: string): Destination | undefined {
   if (path === "/inicio") return primaryDestinations[0];
   if (
      path.startsWith("/meus-estudos") ||
      [
         "/horarios",
         "/jornada-academica",
         "/perfil/notas-e-faltas",
         "/perfil/horas-complementares",
         "/meu-estagio",
         "/avaliar-disciplinas",
         "/avaliacao-institucional",
      ].includes(path)
   )
      return primaryDestinations[1];
   if (
      path.startsWith("/solicitacao-servicos") ||
      path === "/secretaria-virtual" ||
      path === "/contratos" ||
      path === "/perfil/colacao-de-grau"
   )
      return primaryDestinations[2];
   if (path.startsWith("/financeiro")) return primaryDestinations[3];
   if (path === "/calendario-academico") return primaryDestinations[4];
   if (path.startsWith("/perfil/") || path === "/preferencias") return primaryDestinations[5];
   return undefined;
}
export const studentRoutes = new Set([
   "/meus-estudos",
   "/meus-estudos/atividades",
   "/meus-estudos/extensao",
   "/calendario-academico",
   "/comunicados",
   "/financeiro/pix",
]);
export const studentLabels: Record<string, string> = {
   "/meus-estudos": "Meus estudos",
   "/meus-estudos/atividades": "Atividades e horas",
   "/meus-estudos/extensao": "Minhas atividades de extensão",
   "/calendario-academico": "Calendário acadêmico",
   "/comunicados": "Avisos e comunicados",
   "/financeiro/pix": "Pagamento por Pix",
   "/financeiro/extrato": "Extrato e bolsas",
};
export const supportLinks: Destination[] = [
   {
      label: "Biblioteca digital",
      href: external.biblioteca,
      icon: "local_library",
      description: "Encontre livros e materiais para suas disciplinas.",
   },
   { label: "Monitoria", href: external.monitoria, icon: "groups", description: "Procure apoio para uma disciplina." },
   { label: "Pesquisa e iniciação científica", href: external.cpic, icon: "science", description: "Conheça oportunidades do CPIC." },
   {
      label: "Dependência e adaptação",
      href: external.dp,
      icon: "school",
      description: "Consulte e faça sua inscrição em DP ou adaptação.",
   },
];
export type Charge = { id: string; name: string; amount: number; due: string; paid: boolean; request?: string };
export function chargesFor(state: DemoState): Charge[] {
   const monthly: Charge[] =
      state.scenario === "vazio"
         ? []
         : Array.from({ length: 10 }, (_, i) => {
              const date = new Date(2026, 6 + i, 12);
              const month = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
              const id = `DEMO-MENSALIDADE-${month}`;
              const historical = i < 4 && !(state.scenario === "financeiro" && month === "202610");
              return {
                 id,
                 name: `Mensalidade · ${new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(date)}/${date.getFullYear()}`,
                 amount: 890,
                 due: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(i < 4 ? 12 : Math.min(28, Number(state.dueDay) || 12)).padStart(2, "0")}`,
                 paid: historical || state.chargesPaid.includes(id),
              };
           });
   return [
      ...monthly,
      ...state.requests
         .filter(r => r.price > 0 && r.status !== "Cancelado")
         .map(r => ({
            id: r.id,
            name: r.name,
            amount: r.price,
            due: "2026-10-23",
            paid: state.chargesPaid.includes(r.id) || r.status !== "Aguardando pagamento",
            request: r.id,
         })),
   ].sort((a, b) => a.due.localeCompare(b.due));
}
export const formation = { complementary: { done: 26, total: 160 }, extension: { done: 40, total: 240 } };
export type AcademicEvent = {
   id: string;
   title: string;
   start: string;
   end: string;
   category: "Avaliações" | "Prazos" | "Atividades" | "Feriados";
   description: string;
   action?: { label: string; href: string };
   example?: boolean;
};
export const academicEvents: AcademicEvent[] = [
   {
      id: "inscricoes",
      title: "Inscrições para atividades do semestre",
      start: "2026-07-01",
      end: "2026-12-07",
      category: "Atividades",
      description: "Consulte a oferta e as orientações da sua atividade antes de participar.",
      action: { label: "Ver atividades e horas", href: "/meus-estudos/atividades" },
      example: true,
   },
   {
      id: "p1",
      title: "Período de aplicação da P1",
      start: "2026-09-28",
      end: "2026-10-09",
      category: "Avaliações",
      description: "Período representado no esboço enviado. Datas específicas de cada disciplina devem ser confirmadas no AVA.",
      action: { label: "Ver minhas disciplinas", href: "/perfil/notas-e-faltas" },
   },
   {
      id: "digitais",
      title: "Início das disciplinas digitais especiais",
      start: "2026-10-06",
      end: "2026-10-06",
      category: "Atividades",
      description: "Confira no AVA as disciplinas em que você está matriculado e suas orientações.",
      action: { label: "Acessar o AVA", href: external.ava },
   },
   {
      id: "recesso",
      title: "Feriado e recesso",
      start: "2026-10-12",
      end: "2026-10-13",
      category: "Feriados",
      description:
         "Período representado no esboço do calendário. Consulte o calendário oficial do seu curso para confirmar o funcionamento.",
   },
   {
      id: "substitutiva-p1",
      title: "Prova substitutiva da P1",
      start: "2026-10-17",
      end: "2026-10-17",
      category: "Avaliações",
      description: "Confira a oferta e os critérios antes de solicitar uma prova substitutiva.",
      action: { label: "Consultar minhas notas", href: "/perfil/notas-e-faltas" },
   },
   {
      id: "horas-outubro",
      title: "Conferir atividades e comprovantes",
      start: "2026-10-23",
      end: "2026-10-23",
      category: "Prazos",
      description: "Organize seus comprovantes e confira o registro de suas atividades.",
      action: { label: "Conferir minhas horas", href: "/meus-estudos/atividades" },
      example: true,
   },
   {
      id: "avaliacoes-outubro",
      title: "Semana de avaliações",
      start: "2026-10-26",
      end: "2026-10-31",
      category: "Avaliações",
      description: "Consulte o AVA para as datas e orientações de cada disciplina.",
      action: { label: "Abrir minhas disciplinas", href: "/perfil/notas-e-faltas" },
      example: true,
   },
   {
      id: "novembro",
      title: "Organizar entregas do mês",
      start: "2026-11-05",
      end: "2026-11-05",
      category: "Prazos",
      description: "Confira as entregas do mês e organize seus próximos passos.",
      action: { label: "Ver meus estudos", href: "/meus-estudos" },
      example: true,
   },
];
export const overlaps = (event: AcademicEvent, start: string, end: string) => event.start <= end && event.end >= start;
export const monthBounds = (offset: number) => {
   const date = new Date(2026, 9 + offset, 1, 12);
   const year = date.getFullYear(),
      month = date.getMonth();
   const iso = (n: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
   return { date, first: iso(1), last: iso(new Date(year, month + 1, 0).getDate()), iso, days: new Date(year, month + 1, 0).getDate() };
};
