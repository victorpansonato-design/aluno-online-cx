import { readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";
const js = ts.transpile(readFileSync("src/cx/data.ts", "utf8"), { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 });
const { routes, services, curriculum } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
function csv(file, rows) {
   writeFileSync(
      file,
      "\uFEFF" + rows.map(row => row.map(cell => '"' + String(cell ?? "").replaceAll('"', '""') + '"').join(";")).join("\r\n"),
   );
}
csv("docs/inventario-rotas.csv", [["Área", "Nome", "Rota", "Descrição"], ...routes.map(r => [r.group, r.title, r.path, r.description])]);
csv("docs/catalogo-servicos.csv", [
   ["Código", "Nome proposto", "Nome original", "Categoria", "Valor observado em 20/10/2026", "Tipo"],
   ...services.map(s => [
      s.code,
      s.name,
      s.original,
      s.category,
      s.price.toFixed(2).replace(".", ","),
      s.auto ? "Eletrônico" : "Instituição",
   ]),
]);
csv("docs/matriz-curricular.csv", [
   ["Período", "Disciplina", "Carga horária", "Origem"],
   ...curriculum.flatMap((period, i) => period.map(d => [i + 1, d.name, d.hours, "Matriz observada em 20/10/2026"])),
]);
console.log(JSON.stringify({ routes: routes.length, services: services.length, curriculum: curriculum.flat().length }));
