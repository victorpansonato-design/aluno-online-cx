import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
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
   ratings: Record<string, number>;
   savedRating: number;
   notifications: boolean;
};
const key = "anchieta-cx-demo-v1";
export const initialState: DemoState = {
   version: 1,
   profile: { name: "Marina Costa", email: "marina@example.com", phone: "(11) 90000-0000", address: "Rua Exemplo, 100 · Jundiaí, SP" },
   docs: {},
   requests: [
      {
         id: "DEMO-1042",
         code: "CSA_048_A",
         name: "Histórico escolar",
         status: "Em análise",
         date: "2026-10-19T15:00:00",
         detail: "Preciso do histórico para uma inscrição. Exemplo de acompanhamento.",
         price: 0,
      },
      {
         id: "DEMO-1041",
         code: "CSA_150",
         name: "Atestado de matrícula",
         status: "Concluído",
         date: "2026-10-16T10:00:00",
         detail: "Emissão automática de demonstração.",
         price: 0,
      },
   ],
   read: [],
   theme: "light",
   largeText: false,
   reducedMotion: false,
   scenario: "base",
   dueDay: "12",
   responsible: "Marina Costa (aluna)",
   ratings: {},
   savedRating: 0,
   notifications: true,
};
function load(): DemoState {
   try {
      const v = JSON.parse(localStorage.getItem(key) || "null");
      if (v?.version === 1 && Array.isArray(v.requests) && v.profile && typeof v.docs === "object") return { ...initialState, ...v };
   } catch {
      /* storage unavailable or obsolete */
   }
   return structuredClone(initialState);
}
const DemoContext = createContext<{
   state: DemoState;
   update: (fn: (s: DemoState) => DemoState) => void;
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
      <DemoContext.Provider value={{ state, update: setState, reset: () => setState(structuredClone(initialState)), storageError }}>
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
