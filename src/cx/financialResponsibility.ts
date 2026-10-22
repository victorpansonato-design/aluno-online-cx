import type { DemoState } from "./state";

export type FinancialPerson = { id: string; name: string; role: "Titular" | "Corresponsável" | "Anterior"; from: string; until?: string };
export type ResponsibleChange = { targetId: string; name: string; effectiveFrom: string };
export type FinancialPlan = { people: FinancialPerson[]; scheduled: ResponsibleChange[] };
export type ChargeOwner = { id: string; name: string; share: number };

export function initialFinancialPlan(name = "Marina Costa"): FinancialPlan {
   return {
      people: [
         { id: "student", name: name.replace(/\s*\(aluna?\)\s*$/i, ""), role: "Titular", from: "2026-10-01" },
         { id: "co", name: "Paulo Costa", role: "Corresponsável", from: "2026-10-01" },
         { id: "previous", name: "Joana Costa", role: "Anterior", from: "2026-07-01", until: "2026-09-30" },
      ],
      scheduled: [],
   };
}
export function validFinancialPlan(value: unknown): value is FinancialPlan {
   if (!value || typeof value !== "object") return false;
   const p = value as FinancialPlan;
   return (
      Array.isArray(p.people) &&
      ["student", "co", "previous"].every(id => p.people.some(person => person.id === id && typeof person.name === "string")) &&
      Array.isArray(p.scheduled) &&
      p.scheduled.every(c => typeof c.name === "string" && typeof c.targetId === "string" && typeof c.effectiveFrom === "string")
   );
}
/** Issued invoices retain their original owners, including after a scheduled change. */
export function ownersForCharge(id: string, state: Pick<DemoState, "financialPlan">): ChargeOwner[] {
   const month = id.startsWith("DEMO-MENSALIDADE-") ? id.slice(-6) : "";
   const shares: [string, number][] =
      month && month < "202610"
         ? [["previous", 100]]
         : month === "202701"
           ? [
                ["student", 60],
                ["co", 40],
             ]
           : month >= "202702"
             ? [["co", 100]]
             : [["student", 100]];
   return shares.map(([personId, share]) => ({ id: personId, name: state.financialPlan.people.find(p => p.id === personId)!.name, share }));
}
