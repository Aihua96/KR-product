#!/usr/bin/env node
/**
 * check-legacy-anchors.mjs
 * Ensure configured pages preserve legacy hidden anchors:
 * <span id="安装指南"> etc.
 * Enhancements:
 *  - Optional validation of preceding comment marker <!-- legacy-anchor --> when --require-marker passed.
 *  - Supports patterns + explicit file list (existing behavior).
 *  - Outputs machine friendly JSON summary with --json flag.
 * Exit codes:
 *  0 OK
 *  1 Config / usage error
 *  2 Missing anchors
 *  3 Missing marker (when required)
 */
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, sep } from 'path'

const ROOT = process.cwd()
const args = process.argv.slice(2)
const flags = new Set(args.filter(a=>a.startsWith('--')).map(a=>a.replace(/^--/,'')))
const requireMarker = flags.has('require-marker')
const outputJson = flags.has('json')
const CONFIG_PATH = join(ROOT, 'scripts/legacy-anchors.config.json')

let config
try {
  config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
} catch (e) {
  console.error('[legacy-anchors] ❌ Cannot read config', CONFIG_PATH, e.message)
  process.exit(1)
}

if (!config || !Array.isArray(config.files)) {
  console.error('[legacy-anchors] ❌ Invalid config structure: expected { files: [...] }')
  process.exit(1)
}

// Optional patterns support: { patterns: [ { glob: "**/deployment.md", titleContains: "部署指南", anchors: [..] } ] }
// Simple glob -> regex converter supporting **, * and escaping others.
function globToRegExp(glob){
  const esc = s => s.replace(/[.+^${}()|\\]/g,'\\$&')
  let out = ''
  for (let i=0;i<glob.length;i++) {
    if (glob[i] === '*') {
      if (glob[i+1] === '*') { out += '.*'; i++; } else { out += '[^/]*' }
    } else {
      out += esc(glob[i])
    }
  }
  return new RegExp('^' + out + '$')
}

function walk(dir, acc=[]) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, acc)
    else acc.push(full)
  }
  return acc
}

const missing = []
const missingMarker = []
const checkedFiles = new Set()
for (const item of config.files) {
  if (!item.path || !Array.isArray(item.anchors)) continue
  const filePath = join(ROOT, item.path)
  let content = ''
  try { content = readFileSync(filePath, 'utf-8') } catch { missing.push({ file: item.path, missing: item.anchors }); continue }
  const missAnchors = item.anchors.filter(a => !new RegExp(`<span id=\"${a}\"`).test(content))
  if (missAnchors.length) missing.push({ file: item.path, missing: missAnchors })
  if (requireMarker) {
    // For each present anchor ensure a preceding <!-- legacy-anchor --> exists in previous 2 lines region.
    item.anchors.forEach(a => {
      if (missAnchors.includes(a)) return
      const anchorRegex = new RegExp(`<!--\\s*legacy-anchor\\s*-->\\s*\n?\\s*<span id=\\"${a}\\"`)
      if (!anchorRegex.test(content)) {
        missingMarker.push({ file: item.path, anchor: a })
      }
    })
  }
  checkedFiles.add(item.path)
}

// Pattern-based detection
if (Array.isArray(config.patterns)) {
  const allFiles = walk(ROOT).map(p => p.substring(ROOT.length + 1).split(sep).join('/'))
  for (const pat of config.patterns) {
    if (!pat.glob || !Array.isArray(pat.anchors)) continue
    const rx = globToRegExp(pat.glob)
    const candidates = allFiles.filter(f => rx.test(f))
    for (const rel of candidates) {
      // Skip if already explicitly checked
      if (checkedFiles.has(rel)) continue
      let content = ''
      try { content = readFileSync(join(ROOT, rel), 'utf-8') } catch { continue }
      let needCheck = true
      if (pat.titleContains) {
        const headingRegex = /^#{1,6}\s.*$/mg
        needCheck = false
        let m
        while ((m = headingRegex.exec(content))) {
          if (m[0].includes(pat.titleContains)) { needCheck = true; break }
        }
      }
      if (!needCheck) continue
      const missAnchors = pat.anchors.filter(a => !new RegExp(`<span id=\"${a}\"`).test(content))
      if (missAnchors.length) missing.push({ file: rel, missing: missAnchors })
      if (requireMarker) {
        pat.anchors.forEach(a => {
          if (missAnchors.includes(a)) return
          const anchorRegex = new RegExp(`<!--\\s*legacy-anchor\\s*-->\\s*\n?\\s*<span id=\\"${a}\\"`)
          if (!anchorRegex.test(content)) missingMarker.push({ file: rel, anchor: a })
        })
      }
    }
  }
}
if (outputJson) {
  const result = { missing, missingMarker, requireMarker }
  console.log(JSON.stringify(result, null, 2))
}
if (missing.length) {
  if (!outputJson) {
    console.error('\n[legacy-anchors] ❌ Missing hidden anchors:')
    for (const m of missing) console.error(`  - ${m.file}: ${m.missing.join(', ')}`)
    console.error('\nHint: add <span id="NAME" style="display:none"></span> for each missing anchor.')
  }
  process.exit(2)
}
if (requireMarker && missingMarker.length) {
  if (!outputJson) {
    console.error('\n[legacy-anchors] ❌ Missing <!-- legacy-anchor --> markers:')
    for (const m of missingMarker) console.error(`  - ${m.file}: anchor ${m.anchor}`)
    console.error('\nHint: add <!-- legacy-anchor --> line immediately before the <span ...> anchor element.')
  }
  process.exit(3)
}
if (!outputJson) console.log('[legacy-anchors] OK - all configured hidden anchors present' + (requireMarker? ' (markers validated)':''))
