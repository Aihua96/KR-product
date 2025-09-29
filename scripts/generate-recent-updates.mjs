#!/usr/bin/env node
/**
 * Generate a recent updates markdown snippet from git history.
 * - Collect last N (default 8) modified markdown files under root (excluding node_modules, .vitepress/dist, public).
 * - For each, capture last commit date & message.
 * - Output to help/recent-updates.md (overwrites auto section only) with table.
 * Usage: node scripts/generate-recent-updates.mjs [--limit=10]
 */
import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const args = process.argv.slice(2);
let limit = 8;
for (const a of args) {
  const m = a.match(/^--limit=(\d+)$/);
  if (m) limit = parseInt(m[1],10);
}

function getRecentFiles(limit) {
  // Use git to list recently committed markdown (excluding glossary auto outputs if desired?)
  const raw = execSync(`git log --pretty=format:%H --name-only -n 200`, { cwd: root }).toString();
  const seen = new Set();
  const order = [];
  for (const line of raw.split(/\n/)) {
    if (!line || /^[0-9a-f]{40}$/.test(line)) continue;
    if (!line.endsWith('.md')) continue;
    if (line.startsWith('node_modules/') || line.startsWith('public/') ) continue;
    if (line.includes('.vitepress/dist')) continue;
    if (!seen.has(line)) {
      seen.add(line);
      order.push(line);
      if (order.length >= limit) break;
    }
  }
  return order;
}

function info(file) {
  // Use ASCII unit separator 0x1F as delimiter to avoid shell interpretation
  const cmd = `git log -n 1 --pretty=format:%ad%x1f%s --date=iso-strict -- "${file}"`;
  const out = execSync(cmd, { stdio: ['ignore','pipe','pipe'] }).toString();
  const parts = out.split('\u001f');
  const date = (parts[0] || '').trim();
  const msg = (parts.slice(1).join('\u001f') || '').trim();
  return { file, date, msg };
}

const files = getRecentFiles(limit);
const rows = files.filter(f => {
  try { return statSync(f).isFile(); } catch { return false; }
}).map(f => info(f));
const targetDir = join(root,'help');
try { mkdirSync(targetDir,{recursive:true}); } catch {}
const target = join(targetDir,'recent-updates.md');

let existing = '';
if (existsSync(target)) existing = readFileSync(target,'utf8');

const header = '# 最近更新 (自动生成)\n\n<!-- RECENT-UPDATES:BEGIN -->\n';
const footer = '\n<!-- RECENT-UPDATES:END -->\n\n> 通过 `node scripts/generate-recent-updates.mjs` 重新生成。';
function toLinkPath(file){
  if (file.endsWith('index.md')) return '/' + file.replace(/index.md$/,'');
  return '/' + file;
}
const table = ['| 文件 | 最近提交时间 | 提交摘要 |','|------|--------------|----------|', ...rows.map(r=>`| [${r.file}](${toLinkPath(r.file)}) | ${r.date} | ${r.msg.replace(/\|/g,'\\|')} |`)].join('\n');

const newContent = header + table + footer;
let final = newContent;
if (existing) {
  // preserve any content outside markers
  const before = existing.split('<!-- RECENT-UPDATES:BEGIN -->')[0];
  const afterSplit = existing.split('<!-- RECENT-UPDATES:END -->');
  const after = afterSplit.length>1 ? afterSplit[1] : '';
  final = before.trimEnd() + '\n' + newContent + after;
}
writeFileSync(target, final, 'utf8');
console.log(`[ok] recent updates written -> ${target}`);
console.log('Rows:', rows.length);
