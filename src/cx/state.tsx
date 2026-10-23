import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { revealTheme } from "./theme";
import { initialFinancialPlan, validFinancialPlan, type FinancialPlan } from "./financialResponsibility";
export type RequestItem = {
   id: string;
   code: string;
   name: string;
   status: "Em análise" | "Concluído" | "Cancelado" | "Aguardando pagamento";
   date: string;
   detail: string;
   price: number;
};
export type DocItem = { status: "Em conferência" | "Validado" | "Reenviar"; name: string };
export type DemoState = {
   version: 1;
   exampleRevision: number;
   profile: { name: string; email: string; phone: string; address: string };
   docs: Record<string, DocItem>;
   requests: RequestItem[];
   read: string[];
   theme: "light" | "dark";
   largeText: boolean;
   reducedMotion: boolean;
   scenario: "base" | "dp" | "financeiro" | "vazio";
   dueDay: string;
   responsible: string;
   financialPlan: FinancialPlan;
   ratings: Record<string, number>;
   savedRating: number;
   notifications: boolean;
   chargesPaid: string[];
   favoriteDates: string[];
   notificationTopics: string[];
};
const key = "anchieta-cx-demo-v1";
export const initialState: DemoState = {
   version: 1,
   exampleRevision: 10,
   profile: { name: "Marina Costa", email: "marina@example.com", phone: "(11) 90000-0000", address: "Rua Exemplo, 100 · Jundiaí, SP" },
   docs: {},
   requests: [
      {
         id: "DEMO-1042",
         code: "CSA_048_A",
         name: "Histórico escolar",
         status: "Em análise",
         date: "2026-10-19T15:00:00",
         detail: "Preciso do histórico para uma inscrição.",
         price: 0,
      },
      {
         id: "DEMO-1041",
         code: "CSA_150",
         name: "Atestado de matrícula",
         status: "Concluído",
         date: "2026-10-16T10:00:00",
         detail: "Emissão automática.",
         price: 0,
      },
   ],
   read: [],
   theme: "light",
   largeText: false,
   reducedMotion: false,
   scenario: "financeiro",
   dueDay: "12",
   responsible: "Marina Costa (aluna)",
   financialPlan: initialFinancialPlan(),
   ratings: {},
   savedRating: 0,
   notifications: true,
   chargesPaid: [],
   favoriteDates: [],
   notificationTopics: ["Acadêmico", "Serviços"],
};
function load(): DemoState {
   try {
      const v = JSON.parse(localStorage.getItem(key) || "null");
      if (v?.version === 1 && Array.isArray(v.requests) && v.profile && typeof v.docs === "object")
         return {
            ...initialState,
            ...v,
            exampleRevision: initialState.exampleRevision,
            scenario: !v.exampleRevision && v.scenario === "base" ? initialState.scenario : v.scenario || initialState.scenario,
            financialPlan: validFinancialPlan(v.financialPlan)
               ? v.financialPlan
               : initialFinancialPlan(typeof v.responsible === "string" ? v.responsible : undefined),
            chargesPaid: Array.isArray(v.chargesPaid) ? v.chargesPaid : [],
            favoriteDates: Array.isArray(v.favoriteDates) ? v.favoriteDates : [],
            notificationTopics: Array.isArray(v.notificationTopics) ? v.notificationTopics : initialState.notificationTopics,
         };
   } catch {
      /* storage unavailable or obsolete */
   }
   return structuredClone(initialState);
}
const DemoContext = createContext<{
   state: DemoState;
   update: (fn: (s: DemoState) => DemoState) => void;
   changeTheme: (theme: "light" | "dark", origin?: { x: number; y: number }) => void;
   reset: () => void;
   storageError: boolean;
} | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
   const [state, setState] = useState(load);
   const [storageError, setStorageError] = useState(false);
   useEffect(() => {
      try {
         localStorage.setItem(key, JSON.stringify(state));
      } catch {
         setStorageError(true);
      }
      document.documentElement.classList.toggle("dark", state.theme === "dark");
      document.documentElement.classList.toggle("large-text", state.largeText);
      document.documentElement.classList.toggle("reduce-motion", state.reducedMotion);
   }, [state]);
   return (
      <DemoContext.Provider
         value={{
            state,
            update: setState,
            changeTheme: (theme, origin) => revealTheme(theme, () => setState(s => ({ ...s, theme })), state.reducedMotion, origin),
            reset: () => setState(structuredClone(initialState)),
            storageError,
         }}
      >
         {children}
      </DemoContext.Provider>
   );
}
export function useDemo() {
   const value = useContext(DemoContext);
   if (!value) throw new Error("DemoProvider required");
   return value;
}
export const createProtocol = () => `DEMO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
