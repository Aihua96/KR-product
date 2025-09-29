#!/usr/bin/env node
/**
 * README structural validator
 * Goals:
 * 1. Detect unbalanced fenced code blocks (```)
 * 2. Validate markdown tables: consistent column counts
 * 3. Detect raw placeholder tokens like <productId> (or other <xxx> patterns) inside tables not wrapped in backticks
 * 4. Warn about suspicious angle-bracket tokens that are NOT HTML tags / Vue components with attributes
 * 5. Non-zero exit (11) on hard errors; warnings do not fail build unless --strict
 *
 * Usage:
 *   node scripts/validate-readme.mjs            # normal (errors => exit 11)
 *   node scripts/validate-readme.mjs --strict   # errors or warnings => exit 11
 *   node scripts/validate-readme.mjs --file=README.md
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const fileArg = args.find(a => a.startsWith('--file='));
const targetFile = fileArg ? fileArg.split('=')[1] : 'README.md';
const fullPath = path.resolve(process.cwd(), targetFile);

if (!fs.existsSync(fullPath)) {
  console.error(`[validate-readme] File not found: ${targetFile}`);
  process.exit(11);
}

const content = fs.readFileSync(fullPath, 'utf8');
const lines = content.split(/\r?\n/);

const errors = [];
const warnings = [];

// 1. Fenced code blocks balance check
// We only track lines starting with ``` (three or more backticks) not indented by more than 3 spaces
const fenceRegex = /^ {0,3}(`{3,})([^`]*)$/;
const fenceStack = []; // store { line, fence, info }
lines.forEach((line, idx) => {
  const m = line.match(fenceRegex);
  if (!m) return;
  const fenceMarker = m[1];
  const info = (m[2] || '').trim();
  if (fenceStack.length === 0) {
    fenceStack.push({ line: idx + 1, fence: fenceMarker, info });
  } else {
    const top = fenceStack[fenceStack.length - 1];
    if (top.fence.length === fenceMarker.length) {
      // close
      fenceStack.pop();
    } else {
      // Different length backticks opens a nested fence (rare) – treat as new
      fenceStack.push({ line: idx + 1, fence: fenceMarker, info });
    }
  }
});
if (fenceStack.length) {
  fenceStack.forEach(f => {
    errors.push(`Unclosed code fence started at line ${f.line} (info='${f.info || ''}')`);
  });
}

// 2. Table validation
// Detect contiguous table blocks (must have at least header + separator)
function splitTableRow(raw) {
  // Remove leading/trailing pipe then split
  const inner = raw.trim().replace(/^\|/, '').replace(/\|$/, '');
  return inner.split(/\|/).map(c => c.trim());
}

const tableBlocks = [];
let i = 0;
while (i < lines.length) {
  if (/^\s*\|.*\|\s*$/.test(lines[i])) {
    const start = i;
    const block = [];
    while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
      block.push({ line: i + 1, text: lines[i] });
      i++;
    }
    if (block.length >= 2) tableBlocks.push(block);
  } else {
    i++;
  }
}

const htmlTagWhitelist = new Set([
  'a','img','span','div','p','h1','h2','h3','h4','h5','h6','code','pre','table','thead','tbody','tr','td','th','ul','ol','li','strong','em','blockquote','hr','br','details','summary'
]);

for (const block of tableBlocks) {
  const header = block[0];
  const separator = block[1];
  const headerCols = splitTableRow(header.text).length;
  const sepCols = splitTableRow(separator.text).length;
  if (headerCols !== sepCols) {
    errors.push(`Table separator column count mismatch at line ${separator.line}: header has ${headerCols}, separator has ${sepCols}`);
  }
  for (let r = 2; r < block.length; r++) {
    const row = block[r];
    const cols = splitTableRow(row.text).length;
    if (cols !== headerCols) {
      errors.push(`Table row column mismatch at line ${row.line}: expected ${headerCols}, got ${cols}`);
    }
  }
  // Placeholder detection inside table lines
  for (const row of block) {
    const raw = row.text;
    // Temporarily mask inline code spans to avoid false positives
    const masked = raw.replace(/`[^`]*`/g, '`CODE`');
    // Find <token> occurrences
    const angleMatches = [...masked.matchAll(/<([A-Za-z0-9_-]+)>/g)];
    for (const m of angleMatches) {
      const token = m[1];
      if (htmlTagWhitelist.has(token.toLowerCase())) continue; // normal HTML
      // Heuristic: if appears as part of a component (next char after > is :) skip? Here it's a placeholder.
      // Ensure original raw has it outside code.
      const originalFragment = m[0];
      const backticked = new RegExp('`[^`]*' + originalFragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^`]*`').test(raw);
      if (!backticked) {
        errors.push(`Unescaped placeholder '${originalFragment}' in table (line ${row.line}) – wrap with backticks like \`<${token}>\``);
      }
    }
  }
}

// 3. Global scan for suspicious placeholders outside code but not valid component tags
// We consider a suspicious standalone <word> if:
//  - line contains <word>
//  - not followed by space or '/' before '>' (so no attributes/self-close)
//  - word not in whitelist and line is NOT inside a code fence (we could track but simpler heuristic: ignore lines that start with four spaces or a tab)

// Track code fence regions to skip
const fenceRegions = [];
let openIdx = null;
lines.forEach((line, idx) => {
  if (line.match(fenceRegex)) {
    if (openIdx == null) openIdx = idx; else { fenceRegions.push([openIdx, idx]); openIdx = null; }
  }
});
function inFence(lineNumber) {
  return fenceRegions.some(([s,e]) => lineNumber-1 >= s && lineNumber-1 <= e);
}

lines.forEach((line, idx) => {
  if (inFence(idx+1)) return;
  if (line.trim().startsWith('>')) return; // skip blockquotes
  const masked = line.replace(/`[^`]*`/g, '`CODE`');
  const matches = [...masked.matchAll(/<([A-Za-z0-9_-]+)>/g)];
  for (const m of matches) {
    const token = m[1];
    if (htmlTagWhitelist.has(token.toLowerCase())) continue;
    // Skip component-like patterns with uppercase first letter followed by attribute start in original (e.g., <Term name="...")
    if (/</.test(line)) {
      const after = line.slice(line.indexOf('<'+token)+token.length+1, line.indexOf('<'+token)+token.length+2);
      if (after === ' ' || after === '\\n') continue; // component start
    }
    // Skip if already reported inside a table (to avoid duplication)
    if (!errors.some(e => e.includes(`'<'${token}`))) {
      warnings.push(`Suspicious placeholder '${m[0]}' at line ${idx+1} (consider wrapping in backticks)`);
    }
  }
});

// Output
if (!errors.length && !warnings.length) {
  console.log('[validate-readme] OK: no issues found.');
  process.exit(0);
}

if (errors.length) {
  console.error('\n[validate-readme] ERRORS:');
  errors.forEach(e => console.error('  - ' + e));
}
if (warnings.length) {
  console.warn('\n[validate-readme] WARNINGS:');
  warnings.forEach(w => console.warn('  - ' + w));
}

if (errors.length || (strict && warnings.length)) {
  console.error(`\n[validate-readme] Failed with ${errors.length} error(s)` + (strict?` and ${warnings.length} warning(s)`:''));
  process.exit(11);
}

console.log(`[validate-readme] Completed with ${errors.length} errors, ${warnings.length} warnings (non-strict mode).`);
