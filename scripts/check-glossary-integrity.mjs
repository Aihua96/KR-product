#!/usr/bin/env node
/**
 * Glossary integrity check script.
 * Strategy (regen & diff):
 * 1. Capture BEFORE glossary AUTO section content (ZH + EN).
 * 2. Invoke generator (mutates files) to ensure they are freshly rebuilt.
 * 3. Capture AFTER content and compare.
 * 4. Fail if differences -> glossary not committed.
 * 5. Validate no invalid README-style relative links.
 * 6. Optional: enforce presence of AUTO markers with --require-markers.
 *
 * Exit codes:
 *  0 - OK
 *  1 - Invalid link / missing required markers
 *  2 - Glossary out-of-date
 *  3 - Generator conflict failure (propagated) / general generation error
 */
import { readFileSync } from 'fs';
import { spawnSync } from 'child_process';

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')).map(a => a.replace(/^--/, '')));
if (flags.has('help')) {
  console.log(`Usage: node scripts/check-glossary-integrity.mjs [--require-markers] [--help]\n` +
    `  --require-markers   Fail if glossary files missing AUTO-GLOSSARY markers\n` +
    `  --help              Show this help message`);
  process.exit(0);
}
const requireMarkers = flags.has('require-markers');

function extract(file) {
  let c;
  try { c = readFileSync(file,'utf8'); } catch { return ''; }
  const m = c.match(/<!-- AUTO-GLOSSARY:BEGIN -->([\s\S]*?)<!-- AUTO-GLOSSARY:END -->/);
  return m ? m[1].trim() : '';
}

function regen() {
  // Re-run generator (will patch files). If diff occurs, git diff will show.
  const r = spawnSync('node',['scripts/generate-glossary.mjs'], { stdio:'inherit'});
  if (r.status !== 0) {
    console.error('[ci] glossary generation failed');
    process.exit(r.status || 1);
  }
}

function checkInvalidLinks(content, file) {
  const bad = content.match(/\]\(\.\/README(\.md)?\)/g);
  if (bad) {
    console.error(`[ci] invalid README relative link in ${file}`);
    process.exit(1);
  }
}

const zhFile = 'krvirt/glossary.md';
const enFile = 'krvirt/glossary.en.md';
const beforeZh = extract(zhFile);
const beforeEn = extract(enFile);
if (requireMarkers) {
  const zhHas = beforeZh.length > 0;
  const enHas = beforeEn.length > 0; // EN may be optional; still check if file exists
  if (!zhHas) {
    console.error('[ci] missing AUTO-GLOSSARY markers in', zhFile);
    process.exit(1);
  }
  // EN 允许不存在文件；只在文件存在但无标记时报错
}
regen();
const afterZh = extract(zhFile);
const afterEn = extract(enFile);
checkInvalidLinks(afterZh, zhFile);
checkInvalidLinks(afterEn, enFile);
if (beforeZh !== afterZh || beforeEn !== afterEn) {
  console.error('[ci] glossary not up-to-date. Please commit regenerated glossary.');
  process.exit(2);
}
console.log('[ci] glossary integrity OK');