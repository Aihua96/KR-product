#!/usr/bin/env node
/**
 * validate-quick-links.mjs
 * 校验 public/product-quick-links.json 配置文件的完整性与一致性。
 * 规则：
 *  - 根对象：每个 key = 产品 id
 *  - 产品 id 必须出现在 public/products.json (或 data/products.json 派生) 中
 *  - 每个节点包含：order(number) & links(array)
 *  - order 必须为正整数，且全局唯一，建议连续（非强制，只警告）
 *  - links 数组元素字段：key, zh, en, href (icon 可选)
 *  - key 在同一产品内唯一；推荐小写短横线/字母数字
 *  - zh / en 需为非空字符串
 *  - href 需以 / 开头；对应的 markdown 源文件(去除 locale 前缀) 或目录 index.md 存在；允许指向产品根路径 /<id>/
 *  - 若 href 以 /en/ 开头亦可（英文占位）；校验对应的中文或英文页面至少存在其一
 *  - 未在 quick-links.json 中出现的产品（存在于 products.json）给出提示（非失败）
 *  - 支持 --json 输出机器可读结果
 * 退出码：
 *   0 OK
 *   2 读取 / 解析失败
 *   3 校验失败（结构或必填字段错误）
 */
import { readFileSync, statSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve, join, extname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')

const args = process.argv.slice(2)
const flags = new Set(args.filter(a=>a.startsWith('--')).map(a=>a.replace(/^--/,'')))
const outputJson = flags.has('json')

function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf-8')) } catch (e) { throw new Error(path + ' 解析失败: ' + e.message) }
}

let quickLinks, products
try {
  quickLinks = readJson(resolve(ROOT, 'public', 'product-quick-links.json'))
  products = readJson(resolve(ROOT, 'public', 'products.json'))
} catch (e) {
  console.error('[validate-quick-links] 读取失败:', e.message)
  process.exit(2)
}

const productIds = new Set(Array.isArray(products) ? products.map(p=>p.id) : [])
const errors = []
const warnings = []
const orders = new Map()
const referencedProducts = new Set()

if (!quickLinks || typeof quickLinks !== 'object' || Array.isArray(quickLinks)) {
  console.error('[validate-quick-links] 根节点必须是对象')
  process.exit(3)
}

function fileExistsForHref(href) {
  // Normalize: remove query/hash
  const clean = href.split('#')[0].split('?')[0]
  if (!clean.startsWith('/')) return false
  // Accept trailing slash root style e.g. /krvirt/
  if (/^\/[^/]+\/$/.test(clean)) return true // product root, we trust index.md
  // Remove leading /en if present
  const isEn = clean.startsWith('/en/')
  const rel = clean.replace(/^\/en\//,'')
  // Candidate markdown paths relative to ROOT
  // href: /krvirt/installation => krvirt/installation.md or krvirt/installation/index.md
  const base = rel.replace(/^\//,'')
  const md1 = resolve(ROOT, base + '.md')
  const md2 = resolve(ROOT, base, 'index.md')
  // Accept either zh or en variant: if en path requested ensure at least that path exists
  if (isEn) {
    const enMd1 = resolve(ROOT, 'en', base + '.md')
    const enMd2 = resolve(ROOT, 'en', base, 'index.md')
    return [enMd1, enMd2].some(p => existsSync(p))
  }
  return [md1, md2, resolve(ROOT,'en', base + '.md'), resolve(ROOT,'en', base, 'index.md')].some(p => existsSync(p))
}

for (const [pid, cfg] of Object.entries(quickLinks)) {
  if (!productIds.has(pid)) errors.push(`产品 ${pid} 不存在于 products.json`)
  else referencedProducts.add(pid)
  if (typeof cfg !== 'object' || !cfg) { errors.push(`产品 ${pid} 配置必须为对象`); continue }
  const { order, links } = cfg
  if (typeof order !== 'number' || !Number.isInteger(order) || order <= 0) errors.push(`产品 ${pid} order 必须为正整数`)
  else if (orders.has(order)) errors.push(`order 值 ${order} 重复 (产品 ${pid} 与 ${orders.get(order)})`)
  else orders.set(order, pid)
  if (!Array.isArray(links) || links.length === 0) errors.push(`产品 ${pid} links 必须为非空数组`)
  else {
    const keySet = new Set()
    links.forEach((l, idx) => {
      const loc = `${pid}#${idx}`
      if (!l || typeof l !== 'object') { errors.push(`${loc} link 必须为对象`); return }
      const { key, zh, en, href } = l
      if (!key || typeof key !== 'string') errors.push(`${loc} 缺少 key`)
      else {
        if (keySet.has(key)) errors.push(`${loc} key 重复: ${key}`)
        keySet.add(key)
        if (!/^[a-z0-9][a-z0-9-]*$/.test(key)) warnings.push(`${loc} key 推荐使用小写字母数字及 - 组合 (当前: ${key})`)
      }
      if (!zh || typeof zh !== 'string') errors.push(`${loc} 缺少 zh 文本`)
      if (!en || typeof en !== 'string') errors.push(`${loc} 缺少 en 文本`)
      if (!href || typeof href !== 'string') errors.push(`${loc} 缺少 href`)
      else if (!href.startsWith('/')) errors.push(`${loc} href 必须以 / 开头 (当前: ${href})`)
      else if (!fileExistsForHref(href)) warnings.push(`${loc} href 指向的文件可能不存在: ${href}`)
    })
  }
}

// Orphan products (exist in products.json but missing quick links)
for (const pid of productIds) {
  if (!referencedProducts.has(pid)) warnings.push(`产品 ${pid} 未在 quick-links 中配置 (可忽略)`)
}

// Order continuity suggestion
const orderValues = [...orders.keys()].sort((a,b)=>a-b)
orderValues.forEach((v,i) => {
  if (i>0 && v !== orderValues[i-1] + 1) warnings.push(`order 序列存在间隔: ${orderValues[i-1]} -> ${v}`)
})

if (outputJson) {
  console.log(JSON.stringify({ errors, warnings, productCount: productIds.size, configured: Object.keys(quickLinks).length }, null, 2))
}

if (errors.length) {
  if (!outputJson) {
    console.error(`[validate-quick-links] ❌ 校验失败 (${errors.length} 项错误 / ${warnings.length} 项警告)`)
    errors.forEach(e => console.error(' -', e))
    if (warnings.length) {
      console.error('\n警告:')
      warnings.forEach(w => console.error(' -', w))
    }
  }
  process.exit(3)
}

if (!outputJson) {
  console.log(`[validate-quick-links] OK - ${Object.keys(quickLinks).length} 产品, ${warnings.length} 条警告${warnings.length? ' (不阻断)':''}`)
  if (warnings.length) warnings.forEach(w => console.warn('⚠️', w))
}
process.exit(0)
