#!/usr/bin/env node
/**
 * 校验 data/products.json 数据结构与内容合法性。
 * 规则：
 *  - 必填字段：id,nameZh,nameEn,positioningZh,positioningEn,scenariosZh,scenariosEn,capabilitiesZh,capabilitiesEn,deployZh,deployEn,link,tags
 *  - id 唯一，且为 kebab/下划线/小写字母数字组合
 *  - status 允许值：GA | Beta | Preview （大小写不敏感）
 *  - version 允许格式：v?数字(.数字){0,3}
 *  - link 必须是以 / 开头的站内链接或 http(s) URL
 *  - tags 为非空字符串数组；标签命名使用小写字母数字或连字符
 *  - 文本字段不允许出现制表符 \t
 * 退出码：
 *   0 通过
 *   2 读取或解析失败
 *   3 校验失败（打印错误列表）
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dataPath = resolve(__dirname, '..', 'data', 'products.json')
let products
try {
  products = JSON.parse(readFileSync(dataPath, 'utf-8'))
  if (!Array.isArray(products)) throw new Error('products.json 根节点不是数组')
} catch (e) {
  console.error('[validate-products] 解析失败:', e.message)
  process.exit(2)
}

const required = ['id','nameZh','nameEn','positioningZh','positioningEn','scenariosZh','scenariosEn','capabilitiesZh','capabilitiesEn','deployZh','deployEn','link','tags']
const errors = []
const idSet = new Set()

products.forEach((p, idx) => {
  const loc = `[#${idx}] id=${p?.id || 'N/A'}`
  // 必填
  required.forEach(f => { if (!(f in p) || p[f] === '' || p[f] == null) errors.push(`${loc} 缺少必填字段 ${f}`) })
  // id 唯一 & 格式
  if (p.id) {
    if (idSet.has(p.id)) errors.push(`${loc} id 重复`)
    idSet.add(p.id)
    if (!/^[a-z0-9][a-z0-9-_]*$/.test(p.id)) errors.push(`${loc} id 格式非法，应为小写字母数字及 - _ 组合`)
  }
  // status
  if (p.status) {
    if (!/^(ga|beta|preview)$/i.test(p.status)) errors.push(`${loc} status 非法：${p.status}`)
  }
  // version
  if (p.version) {
    if (!/^v?\d+(\.\d+){0,3}$/.test(p.version)) errors.push(`${loc} version 格式非法：${p.version}`)
  }
  // link
  if (p.link) {
    if (!/^(https?:\/\/|\/)/.test(p.link)) errors.push(`${loc} link 必须以 http(s):// 或 / 开头：${p.link}`)
  }
  // tags
  if (p.tags) {
    if (!Array.isArray(p.tags) || p.tags.length===0) errors.push(`${loc} tags 必须为非空数组`)
    else p.tags.forEach(t => { if (typeof t !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(t)) errors.push(`${loc} 非法标签：${t}`) })
  }
  // 文本字段制表符
  Object.entries(p).forEach(([k,v]) => {
    if (typeof v === 'string' && /\t/.test(v)) errors.push(`${loc} 字段 ${k} 含制表符`)
  })
})

if (errors.length) {
  console.error('\n[validate-products] 校验失败，共', errors.length, '项:')
  errors.forEach(e => console.error(' -', e))
  process.exit(3)
}

console.log('[validate-products] OK -', products.length, 'items')
process.exit(0)