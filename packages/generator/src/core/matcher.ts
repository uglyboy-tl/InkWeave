import type { Table, TableSchema } from "./types";

export function matchTables(
  rawTables: Record<string, Table>,
  schemas: Record<string, TableSchema>,
): Record<string, Table> {
  const matched: Record<string, Table> = {};
  const used = new Set<string>();

  for (const [schemaName, schema] of Object.entries(schemas)) {
    const required = schema.columns.filter((c) => c.required).map((c) => c.name);
    if (required.length === 0) continue;

    let best: Table | undefined;
    let bestScore = -1;

    for (const [tableName, table] of Object.entries(rawTables)) {
      if (used.has(tableName)) continue;
      if (!required.every((col) => table.headers.includes(col))) continue;
      const score = table.rows.length;
      if (score > bestScore) {
        bestScore = score;
        best = table;
      }
    }

    if (best) {
      const key = Object.entries(rawTables).find(([, v]) => v === best)?.[0];
      if (key) used.add(key);
      matched[schemaName] = best;
    }
  }

  return matched;
}
