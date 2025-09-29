#!/usr/bin/env node
/**
 * 自动生成产品矩阵表 (中英文)。
 * 生成逻辑：读取本脚本内的产品元数据数组 -> 渲染 Markdown 表格 -> 替换目标文件中的占位标记。
 * 占位标记：
 *   <!-- PRODUCT_MATRIX_START --> 与 <!-- PRODUCT_MATRIX_END --> 之间内容会被重写（中文）
 *   <!-- PRODUCT_MATRIX_EN_START --> 与 <!-- PRODUCT_MATRIX_EN_END --> 之间内容会被重写（英文）
 * 
 * 使用：node scripts/generate-products-matrix.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 从独立数据文件读取产品数据，便于组件与脚本共享
const dataFile = resolve(__dirname, '..', 'data', 'products.json')
let products = []
try {
  products = JSON.parse(readFileSync(dataFile, 'utf-8'))
} catch (e) {
  console.error('[error] failed to load data/products.json', e)
  process.exit(2)
}

function buildColumns(cols, lang='zh') {
  // Column definitions mapping
  const map = {
    name: lang==='zh' ? '产品' : 'Product',
    positioning: lang==='zh' ? '核心定位' : 'Positioning',
    scenarios: lang==='zh' ? '典型场景' : 'Scenarios',
    capabilities: lang==='zh' ? '主要能力（摘要）' : 'Key Capabilities',
    deploy: lang==='zh' ? '部署形态' : 'Deployment',
    tags: lang==='zh' ? '标签' : 'Tags',
    version: lang==='zh' ? '版本' : 'Version',
    status: lang==='zh' ? '状态' : 'Status',
    link: lang==='zh' ? '文档入口' : 'Docs'
  }
  return cols.map(c => map[c] || c)
}

function renderTable(products, cols, lang='zh') {
  const headers = buildColumns(cols, lang)
  const headerLine = `| ${headers.join(' | ')} |`;
  const sepLine = `|${headers.map(()=>'------').join('|')}|`
  const rows = products.map(p => {
    return '| ' + cols.map(c => {
      switch(c) {
        case 'name': return lang==='zh'? p.nameZh : p.nameEn
        case 'positioning': return lang==='zh'? p.positioningZh : p.positioningEn
        case 'scenarios': return lang==='zh'? p.scenariosZh : p.scenariosEn
        case 'capabilities': return lang==='zh'? p.capabilitiesZh : p.capabilitiesEn
        case 'deploy': return lang==='zh'? p.deployZh : p.deployEn
        case 'tags': return p.tags.map(t=>`\`${t}\``).join('<br/>')
      case 'version': return p.version || ''
      case 'status': return p.status || ''
        case 'link': return lang==='zh'? `[进入](${p.link})` : `[Open](${p.link})`
        default: return ''
      }
    }).join(' | ') + ' |'
  }).join('\n')
  return `${headerLine}\n${sepLine}\n${rows}`
}

function patchFile(file, startMarker, endMarker, table) {
  if (!existsSync(file)) return console.warn(`[skip] file not found: ${file}`)
  const content = readFileSync(file, 'utf-8')
  // 如果文件包含 <ProductMatrix 则跳过替换，仅输出 JSON
  if (content.includes('<ProductMatrix')) {
    console.log(`[info] component mode detected, skip static table for ${file}`)
    return
  }
  const start = content.indexOf(startMarker)
  const end = content.indexOf(endMarker)
  if (start === -1 || end === -1 || end < start) {
    console.warn(`[warn] markers not found in ${file}, append block`)
    const appended = `${content}\n\n${startMarker}\n${table}\n${endMarker}\n`
    writeFileSync(file, appended)
    return
  }
  const before = content.slice(0, start + startMarker.length)
  const after = content.slice(end)
  const next = `${before}\n\n${table}\n${after}`
  writeFileSync(file, next)
  console.log(`[ok] updated matrix in ${file}`)
}

const root = resolve(__dirname, '..')
const zhFile = resolve(root, 'products/index.md')
const enFile = resolve(root, 'en/products/index.md')
const jsonOut = resolve(root, 'public', 'products.json')

function readFrontmatterColumns(file) {
  try {
    const raw = readFileSync(file, 'utf-8')
    const match = raw.match(/^---[\s\S]*?---/)
    if (!match) return null
    const block = match[0]
    const lines = block.split('\n').slice(1,-1)
    const idx = lines.findIndex(l=>l.trim().startsWith('productMatrixColumns:'))
    if (idx === -1) return null
    const cols = []
    for (let i=idx+1;i<lines.length;i++) {
      const l = lines[i]
      if (!/^\s*-\s+/.test(l)) break
      cols.push(l.replace(/^\s*-\s+/, '').trim())
    }
    return cols.length? cols : null
  } catch { return null }
}

const zhCols = readFrontmatterColumns(zhFile) || ['name','positioning','scenarios','capabilities','deploy','tags','link']
const enCols = readFrontmatterColumns(enFile) || ['name','positioning','scenarios','capabilities','deploy','tags','link']

patchFile(zhFile, '<!-- PRODUCT_MATRIX_START -->', '<!-- PRODUCT_MATRIX_END -->', renderTable(products, zhCols, 'zh'))
patchFile(enFile, '<!-- PRODUCT_MATRIX_EN_START -->', '<!-- PRODUCT_MATRIX_EN_END -->', renderTable(products, enCols, 'en'))

// 输出 JSON 供组件消费
try {
  writeFileSync(jsonOut, JSON.stringify(products, null, 2))
  console.log('[ok] wrote products.json')
} catch (e) {
  console.error('[error] write products.json failed', e)
}
