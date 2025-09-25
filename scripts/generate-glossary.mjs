#!/usr/bin/env node
/**
 * Glossary generator (bilingual)
 * Scans markdown for <Term name="X" desc="中文描述" descEn="English desc" full="Full Expansion" fullEn="English Full" /> markers.
 * Outputs grouped tables (A~Z + 其他/Other) into:
 *   - krvirt/glossary.md (ZH)
 *   - krvirt/glossary.en.md (EN) if file & markers exist
 * "最后更新" / "Last Updated" = latest git commit time among files containing the term.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const root = process.cwd();
// Simple CLI argument parsing
const argv = process.argv.slice(2);
const flags = new Set();
const kv = {};
for (const a of argv) {
  if (a.startsWith('--')) {
    const [k,v] = a.replace(/^--/,'').split('=');
    if (v === undefined) flags.add(k); else kv[k] = v;
  }
}
if (flags.has('help')) {
  console.log(`Usage: node generate-glossary.mjs [--locale=zh|en|all] [--debug]\n`);
  process.exit(0);
}
const targetLocale = kv.locale || 'all';
const debug = flags.has('debug');
const zhGlossaryPath = join(root, 'krvirt', 'glossary.md');
const enGlossaryPath = join(root, 'krvirt', 'glossary.en.md');

function walk(dir) {
  const res = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      res.push(...walk(full));
    } else if (entry.name.endsWith('.md') && !entry.name.endsWith('.en.md')) {
      res.push(full);
    }
  }
  return res;
}

const termRegex = /<Term\s+([^>]+?)\/>/g; // capture attribute block
const attrRegex = /(\w+)="([^"]+)"/g;

function getGitTime(file) {
  try {
    const cmd = `git log -1 --format=%cI -- ${file}`;
    return execSync(cmd, { cwd: root }).toString().trim();
  } catch {
    return '-';
  }
}

const files = walk(root).filter(f => !f.endsWith('glossary.md'));
const terms = new Map(); // name -> { name, desc, descEn, full, fullEn, files:Set, latestTime }

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  let m;
  while ((m = termRegex.exec(content))) {
    const attrsRaw = m[1];
    let a; const attrs = {};
    while ((a = attrRegex.exec(attrsRaw))) {
      attrs[a[1]] = a[2];
    }
    if (!attrs.name) continue;
    const name = attrs.name.trim();
    const desc = (attrs.desc || '').trim();
    const descEn = (attrs.descEn || '').trim();
    const full = (attrs.full || '').trim();
    const fullEn = (attrs.fullEn || '').trim();
    const t = terms.get(name) || { name, desc: '', descEn: '', full: '', fullEn: '', files: new Set(), latestTime: '-' };
    if (!t.desc && desc) t.desc = desc;
    if (!t.descEn && descEn) t.descEn = descEn;
    if (!t.full && full) t.full = full;
    if (!t.fullEn && fullEn) t.fullEn = fullEn;
    t.files.add(file);
    const time = getGitTime(file);
    if (t.latestTime === '-' || (time !== '-' && time > t.latestTime)) {
      t.latestTime = time;
    }
    terms.set(name, t);
  }
}

if (!terms.size) {
  console.log('No <Term /> markers found.');
}
if (debug) {
  console.log('[debug] Parsed terms:', Array.from(terms.keys()));
}

function groupKey(term) {
  const first = term.name[0].toUpperCase();
  if (first >= 'A' && first <= 'Z') return first;
  return '其他';
}

const groups = {};
for (const t of terms.values()) {
  const g = groupKey(t);
  groups[g] = groups[g] || [];
  groups[g].push(t);
}

for (const key of Object.keys(groups)) {
  groups[key].sort((a,b)=> a.name.localeCompare(b.name, 'zh-Hans-CN'));
}

function buildTable(rows, locale='zh') {
  const isZh = locale === 'zh';
  const header = isZh
    ? '| 术语 | 全称 / 英文 | 说明 | 相关文档 | 最后更新 |'
    : '| Term | Full | Description | Related | Last Updated |';
  const sep = '|------|-------------|------|----------|-----------|';
  return [header, sep, ...rows.map(r => {
    const rel = r.files.values().next().value.replace(root + '/', '');
    let docLink = rel.startsWith('krvirt/') ? rel.slice('krvirt/'.length) : rel;
    docLink = docLink.replace(/index\.md$/, 'index.md');
    const link = docLink === 'index.md'
      ? (isZh ? '[产品介绍](./index.md)' : '[Overview](./index.md)')
      : `[${docLink.replace(/\.md$/, '')}](./${docLink})`;
    const full = isZh ? (r.full || r.fullEn || r.name) : (r.fullEn || r.full || r.name);
    const desc = isZh ? (r.desc || r.descEn || '') : (r.descEn || r.desc || '');
    const last = r.latestTime || '-';
    return `| ${r.name} | ${full} | ${desc} | ${link} | ${last} |`;
  })].join('\n');
}

function generate(locale) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let out = '';
  for (const L of letters) {
    if (groups[L]) {
      out += `\n### ${L}\n\n` + buildTable(groups[L], locale) + '\n';
    }
  }
  const otherKey = locale === 'zh' ? '其他' : 'Other';
  if (groups['其他']) {
    out += `\n### ${otherKey}\n\n` + buildTable(groups['其他'], locale) + '\n';
  }
  return out;
}

function patchFile(targetPath, locale) {
  if (!targetPath) return;
  let content;
  try { content = readFileSync(targetPath, 'utf8'); } catch { return; }
  const begin = '<!-- AUTO-GLOSSARY:BEGIN -->';
  const end = '<!-- AUTO-GLOSSARY:END -->';
  const pattern = new RegExp(`${begin}[\\s\\S]*?${end}`); // escape backslashes for constructor
  if (!pattern.test(content)) {
    console.warn(`[warn] Missing markers in ${targetPath}, skip.`);
    return;
  }
  const localeNote = locale === 'zh'
    ? '该区域由脚本自动生成。请勿手动编辑下面到 END 之间的内容。'
    : 'This section is auto-generated. Do NOT edit between BEGIN and END.';
  const replacement = `${begin}\n<!-- ${localeNote} -->\n${generate(locale)}\n${end}`;
  writeFileSync(targetPath, content.replace(pattern, replacement), 'utf8');
  console.log(`[ok] Patched glossary (${locale})`);
}

if (targetLocale === 'zh' || targetLocale === 'all') patchFile(zhGlossaryPath, 'zh');
if (targetLocale === 'en' || targetLocale === 'all') patchFile(enGlossaryPath, 'en');

console.log('Total terms:', terms.size, 'locale:', targetLocale);
