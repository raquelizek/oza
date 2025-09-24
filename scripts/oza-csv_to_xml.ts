#!/usr/bin/env -S deno run --allow-read --allow-write
import { parse } from "std/csv/parse";

type Args = {
  ["--model"]: string;
  ["--input"]: string;
  ["--out"]?: string;
  ["--id-prefix"]?: string;
  ["--id-column"]?: string;
  ["--noupdate"]?: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (!k.startsWith("--")) continue;
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) { args[k] = next; i++; }
    else { args[k] = true; }
  }
  if (!args["--model"] || !args["--input"]) {
    throw new Error("Uso: --model <modelo> --input <arquivo.csv> [--out <arquivo.xml>] [--id-prefix <pfx>] [--id-column <col>] [--noupdate]");
  }
  return args as Args;
}

const esc = (s: string) =>
  s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
   .replaceAll('"',"&quot;").replaceAll("'","&apos;");
const stripBom = (s: string) => (s.charCodeAt(0) === 0xfeff ? s.slice(1) : s);

async function readCsvAsObjects(path: string): Promise<Record<string, string>[]> {
  let csvText: string;
  try { csvText = await Deno.readTextFile(path); }
  catch { console.error(`[erro] arquivo não encontrado: ${path}`); Deno.exit(1); }
  csvText = stripBom(csvText);

  const matrix = (await parse(csvText)) as (string | number)[][];
  if (!matrix.length) { console.error("[erro] CSV vazio"); Deno.exit(1); }
  const headers = matrix[0].map((h) => String(h).trim());
  const dataRows = matrix.slice(1);

  return dataRows.map((cells) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { if (h) obj[h] = cells[i] == null ? "" : String(cells[i]); });
    return obj;
  });
}

function deriveOutPath(input: string): string {
  if (input.toLowerCase().endsWith(".csv")) return input.slice(0, -4) + ".xml";
  return input + ".xml";
}

async function main() {
  const args = parseArgs(Deno.args);
  const model = args["--model"];
  const input = args["--input"];
  const out = args["--out"] ?? deriveOutPath(input);
  const idPrefix = args["--id-prefix"] ?? "rec_";
  const idColumn = args["--id-column"];
  const noUpdate = !!args["--noupdate"];

  const rows = await readCsvAsObjects(input);

  const lines: string[] = [];
  lines.push("<odoo>");
  lines.push(`  <data${noUpdate ? ' noupdate="1"' : ""}>`);

  rows.forEach((row, idx) => {
    let recId = `${idPrefix}${idx + 1}`;
    if (idColumn) {
      const candidate = (row[idColumn] ?? "").trim();
      if (candidate) recId = candidate;
    }
    lines.push(`    <record id="${esc(recId)}" model="${esc(model)}">`);
    for (const [k, raw] of Object.entries(row)) {
      if (raw == null) continue;
      const v = String(raw).trim();
      if (!v) continue;
      if (v.startsWith("ref:")) lines.push(`      <field name="${esc(k)}" ref="${esc(v.slice(4))}"/>`);
      else lines.push(`      <field name="${esc(k)}">${esc(v)}</field>`);
    }
    lines.push("    </record>");
  });

  lines.push("  </data>");
  lines.push("</odoo>");

  const outPath = out.startsWith("/") ? out : `${Deno.cwd()}/${out}`;
  const outDir = outPath.replace(/[/\\][^/\\]+$/, "");
  await Deno.mkdir(outDir, { recursive: true });
  await Deno.writeTextFile(outPath, lines.join("\n"));
  console.log(`[ok] XML gerado em: ${out}`);
}

if (import.meta.main) await main();
