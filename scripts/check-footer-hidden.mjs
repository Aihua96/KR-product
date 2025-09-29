#!/usr/bin/env node
/**
 * 校验 LayoutOverride.vue 中 footerHiddenPrefixes 配置的前缀在内容目录中是否存在对应路径，
 * 以避免隐藏了一个并不存在的路由前缀（后续维护易出错）。
 *
 * 规则：
 * 1. 去重 + 排序输出
 * 2. 对于以 /en/ 开头的前缀，检查去掉 /en 的中文路径是否存在；若中文存在而英文缺失，只警告不报错（可允许部分中英不同步）。
 * 3. 对于非 /en/ 开头的前缀，需存在一个同名目录（或 index.md 文件所在目录）。
 * 4. 退出码：若存在严重缺失（非 /en/ 前缀缺少目录），退出 1；否则 0。
 */
import { readFileSync } from 'node:fs'
import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import url from 'node:url'

const root = dirname(url.fileURLToPath(import.meta.url)) + '/..'
const layoutPath = resolve(root, '.vitepress/theme/LayoutOverride.vue')

let src
try { src = readFileSync(layoutPath, 'utf-8') } catch (e){
  console.error('[check-footer-hidden] 读取 LayoutOverride.vue 失败:', e)
  process.exit(1)
}

const m = src.match(/footerHiddenPrefixes\s*=\s*\[(.*?)\]/s)
if (!m){
  console.warn('[check-footer-hidden] 未找到 footerHiddenPrefixes 定义，跳过。')
  process.exit(0)
}

// 粗略解析数组（假设都是简单的单引号/双引号字符串常量）
const arrRaw = m[1]
const prefixRegex = /['"](.*?)['"]/g
const prefixes = []
let r
while ((r = prefixRegex.exec(arrRaw))){ prefixes.push(r[1]) }
const unique = Array.from(new Set(prefixes))

let hasError = false

function checkPrefix(p){
  if (p.startsWith('/en/')){
    const zh = p.replace(/^\/en\//,'/')
    const zhDir = resolve(root, '.' + zh)
    const enDir = resolve(root, '.' + p)
    const zhExists = existsSync(zhDir)
    const enExists = existsSync(enDir)
    if (!enExists){
      if (zhExists){
        console.warn(`[check-footer-hidden] 英文前缀 ${p} 目录缺失（中文 ${zh} 存在） -> 仅警告。`)
      } else {
        console.warn(`[check-footer-hidden] 英文前缀 ${p} 与中文 ${zh} 均缺失 -> 仅警告（可能是未来预留）。`)
      }
    }
  } else {
    const dir = resolve(root, '.' + p)
    if (!existsSync(dir)){
      console.error(`[check-footer-hidden] 前缀 ${p} 对应目录不存在 -> 视为错误。`)
      hasError = true
    }
  }
}

unique.sort().forEach(checkPrefix)

if (hasError){
  console.error('[check-footer-hidden] 验证失败。')
  process.exit(1)
}
console.log('[check-footer-hidden] 验证通过，前缀：', unique.join(', '))
