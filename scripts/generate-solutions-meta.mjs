#!/usr/bin/env node
/**
 * 扫描 solutions/*.md 生成 public/solutions/meta.json
 * 读取 frontmatter (title, updated, industries, tags, contact)
 * 2025-09: 已废弃 status 字段，不再输出；如仍存在 frontmatter status 忽略。
 * 若 updated 缺失使用文件 mtime。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const solutionsDir = path.join(root, 'solutions')
const outputDir = path.join(root, 'public', 'solutions')
const outputFile = path.join(outputDir, 'meta.json')

function ensureDir(p){ if(!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }

function readSolutions(){
  if(!fs.existsSync(solutionsDir)) return []
  return fs.readdirSync(solutionsDir)
    .filter(f => f.endsWith('.md') && f !== 'index.md')
    .map(f => path.join(solutionsDir, f))
}

function buildMeta(){
  const files = readSolutions()
  const list = []
  for(const file of files){
    const raw = fs.readFileSync(file, 'utf8')
    const { data } = matter(raw)
    const stat = fs.statSync(file)
    const id = path.basename(file, '.md')
    const meta = {
      schemaVersion: 2, // v1 含 status 字段；v2 移除
      id,
      title: data.title || id,
      category: '场景',
      industries: Array.isArray(data.industries) ? data.industries : (data.industries ? [data.industries] : []),
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      updated: data.updated || stat.mtime.toISOString(),
      path: `/solutions/${id}`,
      contact: data.contact !== false // 默认显示 CTA, frontmatter contact:false 隐藏
    }
    list.push(meta)
  }
  return list.sort((a,b) => a.title.localeCompare(b.title, 'zh'))
}

function main(){
  const meta = buildMeta()
  ensureDir(outputDir)
  fs.writeFileSync(outputFile, JSON.stringify(meta, null, 2), 'utf8')
  console.log(`生成 meta.json 条目: ${meta.length}`)
}

main()
