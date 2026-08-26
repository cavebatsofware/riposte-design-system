/*  This file is part of @cavebatsofware/riposte-design-system
 *  Copyright (C) 2026 Grant DeFayette
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 of the License (GPL-3.0-only).
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/gpl-3.0.html>.
 */

// Writes one file per colorway under styles/palette/, each carrying that
// colorway's [data-theme] blocks verbatim from styles/palette.css, for a
// consumer with a size budget that ships a single colorway. palette.css is the
// authored file and stays a complete, concatenated stylesheet: the Rust crate
// include_str!s it and SPAs import it whole, so the split runs this direction
// and the parts are generated.
//
// Runs from `bun run build`. `--check` compares without writing.

import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const repoRoot = join(import.meta.dir, "..");
const stylesDir = join(repoRoot, "styles");
const outDir = join(stylesDir, "palette");
const check = process.argv.includes("--check");

interface Block {
  id: string;
  text: string;
}

// Every rule in palette.css is a flat [data-theme="id"] block whose closing
// brace sits at column 0, so the blocks come out by line scan. Anything else in
// the file (the doc header, the section headers, the `:root` companion on the
// default colorway) belongs to the concatenated file alone.
function parseBlocks(css: string): Block[] {
  const lines = css.split("\n");
  const blocks: Block[] = [];
  for (let i = 0; i < lines.length; i++) {
    const match = /^\[data-theme="([^"]+)"\] \{$/.exec(lines[i]!);
    if (!match) continue;
    let end = i;
    while (end < lines.length && lines[end] !== "}") end++;
    if (end === lines.length) throw new Error(`unterminated block: ${match[1]}`);
    blocks.push({ id: match[1]!, text: lines.slice(i, end + 1).join("\n") });
    i = end;
  }
  return blocks;
}

function colorwayOf(id: string): string {
  return id.endsWith("-dark") ? id.slice(0, -"-dark".length) : id;
}

function render(colorway: string, blocks: Block[]): string {
  const selectors = blocks.map((b) => `[data-theme="${b.id}"]`).join(", ");
  return `/*  Riposte color palette: ${colorway}.
 *
 *  One colorway, for a consumer that ships a single one rather than the whole
 *  catalog: ${selectors}.
 *
 *  No \`:root\` companion, unlike the concatenated palette.css: the document
 *  sets [data-theme] itself, so importing two of these never leaves the
 *  default to load order. The non-color scale is still in tokens.css.
 *
 *  Generated from styles/palette.css by scripts/split-palette.ts.
 */

${blocks.map((b) => b.text).join("\n\n")}
`;
}

const css = await readFile(join(stylesDir, "palette.css"), "utf8");
const grouped = new Map<string, Block[]>();
for (const block of parseBlocks(css)) {
  const key = colorwayOf(block.id);
  grouped.set(key, [...(grouped.get(key) ?? []), block]);
}
if (grouped.size === 0) throw new Error("no [data-theme] blocks in styles/palette.css");

const problems: string[] = [];

const pkg = JSON.parse(await readFile(join(repoRoot, "package.json"), "utf8")) as {
  exports: Record<string, unknown>;
};
for (const colorway of grouped.keys()) {
  const subpath = `./styles/palette/${colorway}.css`;
  if (!(subpath in pkg.exports)) problems.push(`package.json exports lacks "${subpath}"`);
}

const expected = new Map<string, string>();
for (const [colorway, blocks] of grouped) {
  expected.set(`${colorway}.css`, render(colorway, blocks));
}

await mkdir(outDir, { recursive: true });
for (const [name, text] of expected) {
  const path = join(outDir, name);
  const current = await readFile(path, "utf8").catch(() => null);
  if (current === text) continue;
  if (check) {
    problems.push(`${current === null ? "missing" : "stale"}: styles/palette/${name}`);
  } else {
    await writeFile(path, text);
  }
}
for (const name of await readdir(outDir)) {
  if (!name.endsWith(".css") || expected.has(name)) continue;
  if (check) problems.push(`orphan: styles/palette/${name}`);
  else await rm(join(outDir, name));
}

if (problems.length > 0) {
  for (const problem of problems) console.error(`split-palette: ${problem}`);
  console.error("split-palette: run `bun run palette` to regenerate");
  process.exit(1);
}
console.log(`split-palette: ${expected.size} colorways ${check ? "verified" : "written"}`);
