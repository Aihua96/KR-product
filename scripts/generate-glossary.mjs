#!/usr/bin/env node
/**
 * Glossary generator (bilingual)
 * Scans markdown for <Term name="X" desc="中文描述" descEn="English desc" full="Full Expansion" fullEn="English Full" /> markers.
 * Outputs grouped tables (A~Z + 其他/Other) into:
 *   - krvirt/glossary.md (ZH)
 *   - krvirt/glossary.en.md (EN) if file & markers exist
 * "最后更新" / "Last Updated" = latest git commit time among files containing the term.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
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
  console.log(`Usage: node scripts/generate-glossary.mjs [options]\n\n` +
`Options:\n` +
`  --locale=zh|en|all       Generate glossary for specific locale(s) (default: all)\n` +
`  --maxLinks=N            Max related document links per term (default: 2)\n` +
`  --no-conflict-warn      Suppress console warnings for conflicts (badge still shown)\n` +
`  --fail-on-conflict      Exit with code 3 if any term field conflicts detected\n` +
`  --fail-on-missing-link  Exit with code 4 if related doc link target missing\n` +
`  --debug                 Print parsed term names\n` +
`  --help                  Show this help\n`);
  process.exit(0);
}
const targetLocale = kv.locale || 'all';
const debug = flags.has('debug');
const maxLinks = kv.maxLinks ? parseInt(kv.maxLinks, 10) : 2; // number of related doc links to show
const noConflictWarn = flags.has('no-conflict-warn');
const failOnConflict = flags.has('fail-on-conflict');
const failOnMissingLink = flags.has('fail-on-missing-link');
const zhGlossaryPath = join(root, 'krvirt', 'glossary.md');
const enGlossaryPath = join(root, 'krvirt', 'glossary.en.md');
// Optional i18n location mirror (if exists) e.g. en/krvirt/glossary.md
const enI18nGlossaryPath = join(root, 'en', 'krvirt', 'glossary.md');

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
const terms = new Map(); // name -> { name, desc, descEn, full, fullEn, files:Set, latestTime, _variants: {desc:Set,descEn:Set,full:Set,fullEn:Set} }

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
  const t = terms.get(name) || { name, desc: '', descEn: '', full: '', fullEn: '', files: new Set(), latestTime: '-', _variants: { desc:new Set(), descEn:new Set(), full:new Set(), fullEn:new Set() } };
  if (desc) t._variants.desc.add(desc);
  if (descEn) t._variants.descEn.add(descEn);
  if (full) t._variants.full.add(full);
  if (fullEn) t._variants.fullEn.add(fullEn);
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

function pickMultiLinks(r, isZh) {
  const rels = Array.from(r.files).map(f => f.replace(root + '/', ''));
  rels.sort();
  const filtered = rels.filter(rel => rel !== 'README.md'); // 排除根 README 防止 ./README 死链
  const sliced = filtered.slice(0, maxLinks);
  const links = [];
  for (const rel of sliced) {
    let docLink = rel.startsWith('krvirt/') ? rel.slice('krvirt/'.length) : rel;
    const sameSection = rel.startsWith('krvirt/');
    // 生成用于链接的路径片段（去掉 index.md 变目录路径）
    let linkPath = docLink;
    if (linkPath.endsWith('index.md')) linkPath = linkPath.replace(/index\.md$/, '');
    else linkPath = linkPath.replace(/\.md$/, '');
    const labelBase = docLink === 'index.md'
      ? (isZh ? '产品介绍' : 'Overview')
      : docLink.replace(/\.md$/, '');
    // 校验文件是否存在
    const physical = rel;
    try {
      readFileSync(join(root, physical));
    } catch {
      links.push(isZh ? `❌(缺失:${docLink})` : `❌(missing:${docLink})`);
      missingLinkSet.add(physical);
      continue;
    }
    // 同目录内使用相对路径，其它产品使用站点绝对路径，避免 ./krcmp/ 造成 404
    const url = sameSection ? (linkPath ? `./${linkPath}` : './') : `/${linkPath}`;
    links.push(`[${labelBase}](${url})`);
  }
  return links.join('<br/>') || (isZh ? '—' : '—');
}

function detectConflict(r) {
  const conf = [];
  const v = r._variants;
  if (v.desc.size > 1) conf.push('desc');
  if (v.descEn.size > 1) conf.push('descEn');
  if (v.full.size > 1) conf.push('full');
  if (v.fullEn.size > 1) conf.push('fullEn');
  return conf;
}

function mdEscape(v) {
  if (!v) return '';
  // Escape pipes, backticks, angle brackets to reduce table / HTML injection issues
  return v
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/`/g, '\\`')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildTable(rows, locale='zh') {
  const isZh = locale === 'zh';
  const header = isZh
    ? '| 术语 | 全称 / 英文 | 说明 | 相关文档 | 最后更新 |'
    : '| Term | Full | Description | Related | Last Updated |';
  const sep = '|------|-------------|------|----------|-----------|';
  return [header, sep, ...rows.map(r => {
    const link = pickMultiLinks(r, isZh);
  const fullRaw = isZh ? (r.full || r.fullEn || r.name) : (r.fullEn || r.full || r.name);
  const descRaw = isZh ? (r.desc || r.descEn || '') : (r.descEn || r.desc || '');
  const full = mdEscape(fullRaw);
  const desc = mdEscape(descRaw);
    const last = r.latestTime || '-';
    const conflicts = detectConflict(r);
    const conflictBadge = conflicts.length ? (isZh ? ` ⚠️(冲突:${conflicts.join(',')})` : ` ⚠️(conflict:${conflicts.join(',')})`) : '';
    return `| ${r.name}${conflictBadge} | ${full} | ${desc} | ${link} | ${last} |`;
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

function exportJson(locale) {
  const isZh = locale === 'zh';
  const out = [];
  for (const t of terms.values()) {
    const conflicts = detectConflict(t);
    out.push({
      name: t.name,
      desc: t.desc || '',
      descEn: t.descEn || '',
      full: t.full || '',
      fullEn: t.fullEn || '',
      lastUpdated: t.latestTime,
      files: Array.from(t.files).map(f => f.replace(root + '/', '')),
      conflicts
    });
  }
  const dir = join(root, 'public');
  try { mkdirSync(dir, { recursive: true }); } catch {}
  const file = join(dir, `glossary.${locale}.json`);
  writeFileSync(file, JSON.stringify(out, null, 2), 'utf8');
  console.log(`[ok] Exported JSON ${file}`);
}

function exportConflictsJson() {
  const conflicts = [];
  for (const t of terms.values()) {
    const c = detectConflict(t);
    if (c.length) {
      conflicts.push({ name: t.name, fields: c, variants: {
        desc: Array.from(t._variants.desc),
        descEn: Array.from(t._variants.descEn),
        full: Array.from(t._variants.full),
        fullEn: Array.from(t._variants.fullEn)
      }});
    }
  }
  const dir = join(root, 'public');
  try { mkdirSync(dir, { recursive: true }); } catch {}
  const file = join(dir, 'glossary-conflicts.json');
  writeFileSync(file, JSON.stringify(conflicts, null, 2), 'utf8');
  if (conflicts.length) {
    console.warn(`[warn] Conflicts exported to ${file}`);
  }
}

if (targetLocale === 'zh' || targetLocale === 'all') patchFile(zhGlossaryPath, 'zh');
if (targetLocale === 'en' || targetLocale === 'all') {
  patchFile(enGlossaryPath, 'en');
  // mirror path if exists
  patchFile(enI18nGlossaryPath, 'en');
}

// JSON export (always export for selected locales)
if (targetLocale === 'zh' || targetLocale === 'all') exportJson('zh');
if (targetLocale === 'en' || targetLocale === 'all') exportJson('en');
exportConflictsJson();

let conflictTotal = 0;
const missingLinkSet = new Set();
for (const r of terms.values()) {
  const c = detectConflict(r);
  if (c.length) {
    conflictTotal++;
    if (!noConflictWarn) {
      console.warn('[conflict]', r.name, 'fields:', c.join(','));
    }
  }
}

if (failOnConflict && conflictTotal > 0) {
  console.error(`[error] Detected ${conflictTotal} conflicted term(s). Failing due to --fail-on-conflict.`);
  process.exit(3);
}

if (failOnMissingLink && missingLinkSet.size > 0) {
  console.error(`[error] Missing related doc link targets (${missingLinkSet.size}). Failing due to --fail-on-missing-link.`);
  for (const m of missingLinkSet) console.error('  -', m);
  process.exit(4);
}

console.log('Total terms:', terms.size, 'locale:', targetLocale, 'maxLinks:', maxLinks, 'conflicts:', conflictTotal, 'missingLinks:', missingLinkSet.size);
