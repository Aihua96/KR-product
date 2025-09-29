<template>
  <div class="product-matrix-dynamic" v-if="loaded">
    <FilterToolbar
      :lang="lang as any"
      :show-search="true"
      :show-tags="allTags.length>0"
      :show-statuses="allStatuses.length>0"
      :show-reset="true"
      :tag-mode-enabled="false"
      :tags="allTags"
      :statuses="allStatuses"
      :keyword="keyword"
      :selected-tags="Array.from(selectedTags)"
      :selected-statuses="selectedStatuses"
      :i18n-map="toolbarI18nMap"
      actions-label="导出:"
      @update:keyword="v=> keyword = v"
      @update:selectedTags="arr=> selectedTags = new Set(arr)"
      @update:selectedStatuses="arr=> selectedStatuses = arr"
      @reset="resetFilters"
    >
      <template #actions>
        <button class="pm-export" @click="exportCsv">CSV</button>
        <button class="pm-export" @click="exportMarkdown">MD</button>
        <button class="pm-export" @click="copyShareUrl">URL</button>
      </template>
    </FilterToolbar>

    <div class="pm-table-wrap" v-if="filteredProducts.length">
      <table class="pm-table-simple">
        <thead>
          <tr>
            <th class="pm-field-header" @click="toggleProductSort" :class="productSortClass">
              {{ t('fieldHeader') }}
              <span class="pm-sort-ind" v-if="productSort">{{ productSort==='asc' ? '↑' : '↓' }}</span>
            </th>
            <th v-for="p in filteredProducts" :key="p.id" class="pm-product-header">
              <span v-html="highlight(lang==='en'? p.nameEn : p.nameZh)"></span>
              <div class="pm-product-badges">
                <span v-if="p.version" class="pm-badge neutral">{{ p.version }}</span>
                <span v-if="p.status" class="pm-badge" :class="p.status.toLowerCase()">{{ renderStatus(p.status) }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="field in activeColumns" :key="field">
            <th class="pm-row-header">{{ columnLabel(field) }}</th>
            <td v-for="p in filteredProducts" :key="p.id + '-' + field" v-html="renderCell(p, field)"></td>
          </tr>
          <!-- 产品介绍行：链接文案 “进入《产品介绍》” / “Enter Intro” -->
          <tr class="pm-extra-row">
            <th class="pm-row-header">{{ lang==='en' ? 'Product Intro' : '产品介绍' }}</th>
            <td v-for="p in filteredProducts" :key="p.id + '-intro'">
              <a :href="productIntroUrl(p)">{{ lang==='en' ? 'Enter Intro' : '进入《产品介绍》' }}</a>
            </td>
          </tr>
          <!-- 帮助中心行：链接文案 “进入《帮助中心》” / “Enter Help” -->
          <tr class="pm-extra-row">
            <th class="pm-row-header">{{ lang==='en' ? 'Help Center' : '帮助中心' }}</th>
            <td v-for="p in filteredProducts" :key="p.id + '-help'">
              <a :href="helpCenterUrl(p)">{{ lang==='en' ? 'Enter Help' : '进入《帮助中心》' }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="pm-empty">{{ t('empty') }}</div>
  </div>
  <div v-else class="pm-loading">{{ t('loading') }}</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import FilterToolbar from './FilterToolbar.vue'

interface ProductItem {
  id: string
  nameZh: string
  nameEn: string
  positioningZh: string
  positioningEn: string
  scenariosZh: string
  scenariosEn: string
  capabilitiesZh: string
  capabilitiesEn: string
  deployZh: string
  deployEn: string
  link: string
  tags: string[]
  version?: string
  status?: string
}

const props = defineProps<{ lang?: 'zh' | 'en', columns?: string[] }>()
const lang = computed(() => props.lang || (typeof window !== 'undefined' && window.location.pathname.startsWith('/en/') ? 'en' : 'zh'))

const loaded = ref(false)
const list = ref<ProductItem[]>([])
const keyword = ref('')
let selectedTags = ref<Set<string>>(new Set())
let selectedStatuses = ref<string[]>([])
// 2025-09: 表格视觉简化，移除列 hover / clamp / sticky 等高级特性

// 固定列顺序（列选择已移除，2025-09 移除 link 列以避免单独“跳转”行）
const defaultColumns = ['name','positioning','scenarios','capabilities','deploy','version','status','tags']
const activeColumns = ref<string[]>(defaultColumns.slice())

// Persistence (旧分散键 + 新聚合键)
const LS_KEY_COLS = 'KR_PM_COLUMNS' // legacy only
const LS_KEY_SELECTED_TAGS = 'KR_PM_TAGS'
const LS_KEY_KEYWORD = 'KR_PM_KEYWORD'
const LS_KEY_STATUS = 'KR_PM_STATUS_FILTER'
const LS_KEY_AGG = 'KR_PM_STATE_V2'


// restore from localStorage (支持聚合 + 迁移)
if (typeof window !== 'undefined') {
  try {
    const agg = localStorage.getItem(LS_KEY_AGG)
    if (agg) {
      const data = JSON.parse(agg)
      if (data.keyword) keyword.value = data.keyword
      if (Array.isArray(data.tags)) selectedTags.value = new Set(data.tags.filter((t:string)=> typeof t==='string'))
      if (Array.isArray(data.statuses)) selectedStatuses.value = data.statuses.filter((s:string)=> typeof s==='string')
      // ignore legacy stored custom columns (feature removed)
      if (data.productSort === 'asc' || data.productSort === 'desc' || data.productSort === null) productSort.value = data.productSort
    } else {
      // fallback legacy keys
      // skip legacy column key restoration
      const savedTags = localStorage.getItem(LS_KEY_SELECTED_TAGS)
      if (savedTags) {
        const arr = JSON.parse(savedTags)
        if (Array.isArray(arr)) selectedTags.value = new Set(arr)
      }
      const savedKw = localStorage.getItem(LS_KEY_KEYWORD)
      if (savedKw) keyword.value = savedKw
      const savedStatuses = localStorage.getItem(LS_KEY_STATUS)
      if (savedStatuses) {
        try { const arr = JSON.parse(savedStatuses); if (Array.isArray(arr)) selectedStatuses.value = arr.filter(x=> typeof x==='string') } catch {}
      }
      // 迁移写聚合
      persistAggregated()
    }
  } catch {}
}

function persistAggregated(){
  if (typeof window === 'undefined') return
  const payload = {
    keyword: keyword.value,
    tags: Array.from(selectedTags.value),
    statuses: selectedStatuses.value.slice(),
  columns: defaultColumns.slice(),
    productSort: productSort.value
  }
  try { localStorage.setItem(LS_KEY_AGG, JSON.stringify(payload)) } catch {}
}

// External i18n override (optional) loaded from /product-matrix-i18n.json
const i18nOverrides = ref<Record<string, Record<string,string>> | null>(null)
async function loadI18nOverrides(){
  try {
    const r = await fetch('/product-matrix-i18n.json')
    if (r.ok) {
      const json = await r.json()
      if (json && typeof json === 'object') i18nOverrides.value = json
    }
  } catch {}
}

// 列选择功能已移除（2025-09），保留 defaultColumns 以便导出使用；selectableColumns 逻辑删除

const allTags = computed(() => Array.from(new Set(list.value.flatMap(p => p.tags))).sort())

function clearTags(){ selectedTags.value.clear() }
function resetFilters(){
  keyword.value=''
  selectedTags.value.clear()
  selectedStatuses.value = allStatuses.value.slice()
}

// -------- URL 分享逻辑 (与 Solutions 保持参数风格) --------
function buildShareQuery(){
  const params = new URLSearchParams()
  if (keyword.value.trim()) params.set('kw', keyword.value.trim())
  if (selectedTags.value.size) params.set('tags', Array.from(selectedTags.value).join(','))
  if (selectedStatuses.value.length && selectedStatuses.value.length !== allStatuses.value.length) params.set('status', selectedStatuses.value.join(','))
  // 额外：列与排序（产品矩阵专属）
  if (activeColumns.value.length && activeColumns.value.join(',') !== defaultColumns.join(',')) params.set('cols', activeColumns.value.join(','))
  if (productSort.value) params.set('sort', productSort.value)
  return params.toString()
}
function copyShareUrl(){
  if (typeof window === 'undefined') return
  const q = buildShareQuery()
  const url = window.location.origin + window.location.pathname + (q ? ('?'+q):'')
  navigator.clipboard?.writeText(url).then(()=>{ console.log('product matrix share url copied') })
}
function applyQuery(){
  if (typeof window === 'undefined') return
  const usp = new URLSearchParams(window.location.search)
  const kw = usp.get('kw'); if (kw) keyword.value = kw
  const tagStr = usp.get('tags'); if (tagStr) selectedTags.value = new Set(tagStr.split(',').filter(Boolean))
  const st = usp.get('status'); if (st) selectedStatuses.value = st.split(',').filter(Boolean)
  const cols = usp.get('cols'); if (cols){
    const arr = cols.split(',').filter(c => defaultColumns.includes(c))
    if (arr.length) activeColumns.value = arr
  }
  const srt = usp.get('sort'); if (srt && (srt==='asc'||srt==='desc')) productSort.value = srt as any
}

// i18n 主文件（列描述 + 基础文案）
const pmI18n = ref<Record<string, Record<string,string>> | null>(null)
async function loadPrimaryI18n(){
  if (pmI18n.value || typeof fetch === 'undefined') return
  try {
    const r = await fetch('/product-matrix-i18n.json')
    if (r.ok) pmI18n.value = await r.json()
  } catch {}
}
function t(key: string){
  return pmI18n.value?.[lang.value]?.[key] || key
}

// 提供给 FilterToolbar 的局部 i18n 覆盖：只注入 tag.* 与搜索占位符
const toolbarI18nMap = computed(() => {
  const map = pmI18n.value?.[lang.value]
  if (!map) return {}
  const out: Record<string,string> = {}
  for (const k of Object.keys(map)) {
    if (k.startsWith('tag.')) out[k] = map[k]
  }
  if (map.searchPlaceholder) out.searchPlaceholder = map.searchPlaceholder
  return out
})

function columnLabel(col: string){
  return t('col.'+col)
}
function tagLabel(tag: string){
  if (lang.value === 'zh') return t('tag.'+tag) || tag
  return tag.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
}
// columnDesc 旧函数删除；如需列描述可从 i18nOverrides 中读取

function exportCsv(){
  const singleLine = (s: string) => s.replace(/\r?\n+/g,' / ').replace(/\s{2,}/g,' ').trim()
  const filters = buildFiltersSummary()
  const query = buildShareQuery()
  const header = ['"' + t('fieldHeader') + '"'].concat(filteredProducts.value.map(p => '"' + singleLine((lang.value==='en'? p.nameEn : p.nameZh)).replace(/"/g,'""') + '"'))
  const rows: string[][] = [header]
  for (const field of activeColumns.value) {
    const row: string[] = ['"' + singleLine(columnLabel(field)).replace(/"/g,'""') + '"']
    for (const p of filteredProducts.value) {
      row.push('"' + singleLine(plainCell(p, field)).replace(/"/g,'""') + '"')
    }
    rows.push(row)
  }
  const shareLine = '# share: ' + (query ? query : 'none')
  const content = ['# ' + filters, shareLine, ...rows.map(r=>r.join(','))].join('\n') + '\n'
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, `products-${lang.value}.csv`)
}

function exportMarkdown(){
  const singleLine = (s: string) => s.replace(/\r?\n+/g,' / ').replace(/\s{2,}/g,' ').trim()
  const filters = buildFiltersSummary()
  const query = buildShareQuery()
  const header = '| ' + t('fieldHeader') + ' | ' + filteredProducts.value.map(p => singleLine((lang.value==='en'? p.nameEn : p.nameZh)).replace(/\|/g,'\\|')).join(' | ') + ' |'
  const sep = '| ' + ['---'].concat(filteredProducts.value.map(()=> '---')).join(' | ') + ' |'
  const body = activeColumns.value.map(field => {
    return '| ' + singleLine(columnLabel(field)).replace(/\|/g,'\\|') + ' | ' + filteredProducts.value.map(p => singleLine(plainCell(p, field)).replace(/\|/g,'\\|')).join(' | ') + ' |'
  }).join('\n')
  const blob = new Blob(['<!-- ' + filters + ' | share:' + (query||'none') + ' -->\n' + header+'\n'+sep+'\n'+body+'\n'], { type: 'text/markdown;charset=utf-8;' })
  triggerDownload(blob, `products-${lang.value}.md`)
}

function plainCell(p: ProductItem, col: string){
  switch(col){
    case 'name': return lang.value==='en'? p.nameEn : p.nameZh
    case 'positioning': return lang.value==='en'? p.positioningEn : p.positioningZh
    case 'scenarios': return lang.value==='en'? p.scenariosEn : p.scenariosZh
    case 'capabilities': return lang.value==='en'? p.capabilitiesEn : p.capabilitiesZh
    case 'deploy': return lang.value==='en'? p.deployEn : p.deployZh
    case 'tags': return p.tags.join(';')
    case 'version': return p.version || ''
    case 'status': return renderStatus(p.status)
  // link 列已移除
    default: return ''
  }
}

function buildFiltersSummary(){
  const parts: string[] = []
  if (keyword.value.trim()) parts.push(`keyword="${keyword.value.trim()}"`)
  if (selectedTags.value.size) parts.push(`tags=${Array.from(selectedTags.value).join('|')}`)
  if (selectedStatuses.value.length) parts.push(`status=${selectedStatuses.value.join('|')}`)
  parts.push(`columns=${activeColumns.value.join(',')}`)
  if (productSort.value) parts.push(`sort=${productSort.value}`)
  return (lang.value==='en'? 'Filters':'过滤条件') + (parts.length? ': ' + parts.join(' ; ') : ': (none)')
}

function triggerDownload(blob: Blob, filename: string){
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(()=> URL.revokeObjectURL(url), 500)
}

const baseFiltered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return list.value.filter(p => {
    const name = (lang.value==='en'? p.nameEn : p.nameZh).toLowerCase()
    const caps = (lang.value==='en'? p.capabilitiesEn : p.capabilitiesZh).toLowerCase()
    const pos = (lang.value==='en'? p.positioningEn : p.positioningZh).toLowerCase()
    const dep = (lang.value==='en'? p.deployEn : p.deployZh).toLowerCase()
    const scen = (lang.value==='en'? p.scenariosEn : p.scenariosZh).toLowerCase()
    const matchKw = !kw || name.includes(kw) || caps.includes(kw) || scen.includes(kw) || pos.includes(kw) || dep.includes(kw) || (p.version||'').toLowerCase().includes(kw) || (p.status||'').toLowerCase().includes(kw) || p.tags.some(t => t.toLowerCase().includes(kw))
    let matchTags = true
    if (selectedTags.value.size>0) {
      // 简化：只要包含任意一个
      matchTags = p.tags.some(t => selectedTags.value.has(t))
    }
    let matchStatus = true
    if (selectedStatuses.value.length) {
      matchStatus = !!p.status && selectedStatuses.value.map(s => s.toLowerCase()).includes(p.status.toLowerCase())
    }
    return matchKw && matchTags && matchStatus
  })
})

// Product column sorting (by product name only)
const productSort = ref<'asc'|'desc'|null>(null)
function toggleProductSort(){
  if (!productSort.value) productSort.value = 'asc'
  else if (productSort.value === 'asc') productSort.value = 'desc'
  else productSort.value = null
}
const productSortClass = computed(() => {
  if (!productSort.value) return 'pm-sortable'
  return 'pm-sortable active ' + productSort.value
})

const filteredProducts = computed(() => {
  const arr = baseFiltered.value.slice()
  if (productSort.value) {
    arr.sort((a,b) => {
      const an = (lang.value==='en'? a.nameEn : a.nameZh).toLowerCase()
      const bn = (lang.value==='en'? b.nameEn : b.nameZh).toLowerCase()
      if (an === bn) return 0
      const r = an < bn ? -1 : 1
      return productSort.value === 'asc' ? r : -r
    })
  }
  return arr
})

function escapeHtml(s: string){
  return s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]!))
}

function renderStatus(s?: string){
  if (!s) return ''
  const v = s.toLowerCase()
  const map: Record<string,string> = {
    ga: 'GA',
    beta: 'Beta',
    preview: lang.value==='en' ? 'Preview' : '预览'
  }
  return map[v] || s
}
const allStatuses = computed(() => Array.from(new Set(list.value.map(p => (p.status||'').toLowerCase()).filter(Boolean))))

function renderCell(p: ProductItem, col: string){
  switch(col){
    case 'name': return highlight(lang.value==='en'? p.nameEn : p.nameZh)
    case 'positioning': return highlight(lang.value==='en'? p.positioningEn : p.positioningZh)
    case 'scenarios': return highlight(lang.value==='en'? p.scenariosEn : p.scenariosZh)
    case 'capabilities': return highlight(lang.value==='en'? p.capabilitiesEn : p.capabilitiesZh)
    case 'deploy': return highlight(lang.value==='en'? p.deployEn : p.deployZh)
  case 'tags': return p.tags.map(tg => `<span class=\"product-tag\"${lang.value==='zh'?` title=\\"${escapeHtml(tg)}\\"`:''}>${escapeHtml(tagLabel(tg))}</span>`).join(' ')
  case 'version': return p.version ? `<span class=\"pm-badge neutral\">${escapeHtml(p.version)}</span>` : ''
  case 'status': return p.status ? `<span class=\"pm-badge ${p.status?.toLowerCase()}\">${escapeHtml(renderStatus(p.status))}</span>` : ''
    case 'link': return `<a href="${p.link}">${lang.value==='en'? 'Open':'进入'}</a>`
    default: return ''
  }
}
// clamp / hover 行为已移除，保留空占位函数名称若后续需要可恢复（当前不再使用）

// 帮助中心链接策略：
// 若未来存在各产品独立帮助首页，可在 map 中按 id 配置；否则 fallback 到统一 /help/。
function helpCenterUrl(p: ProductItem){
  const map: Record<string,string> = {
    krvirt: '/krvirt/',
    krcmp: '/krcmp/',
    krdesktop: '/krdesktop/',
    krstorage: '/krstorage/'
  }
  return map[p.id] || '/help/'
}

// 产品介绍链接（与 help 区分，假设 intro 入口仍为产品根页，可按需细化到 /overview 等）
function productIntroUrl(p: ProductItem){
  // 若未来 intro 与帮助不同路径，可单独维护映射
  return p.link || ('/' + p.id + '/')
}

function escapeRegExp(str: string){
  return str.replace(/[.*+?^${}()|[\]\\]/g, r=>`\\${r}`)
}
// 缓存关键字对应的高亮 RegExp，避免每单元格重复创建
let cachedKw = ''
let cachedRe: RegExp | null = null
function getHighlightRe(){
  const kw = keyword.value.trim()
  if (!kw) { cachedKw = ''; cachedRe = null; return null }
  if (kw === cachedKw && cachedRe) return cachedRe
  try {
    cachedRe = new RegExp(escapeRegExp(kw), 'gi')
    cachedKw = kw
    return cachedRe
  } catch { cachedRe = null; return null }
}
function highlight(raw: string){
  const re = getHighlightRe()
  const safe = escapeHtml(raw)
  if (!re) return safe
  return safe.replace(re, m => `<mark>${m}</mark>`)
}

onMounted(async () => {
  try {
    const resp = await fetch('/products.json')
    if (resp.ok) {
      list.value = await resp.json()
    }
  } catch (e) { console.warn('load products.json failed', e) }
  // Load i18n optional override
  loadI18nOverrides()
  loadPrimaryI18n()
  // 应用 URL 参数（优先于本地存储默认 ALL 状态填充）
  applyQuery()
  // If there is no persisted status filter, default to selecting all statuses (meaning show all but with explicit visual selection)
  try {
    if (typeof window !== 'undefined' && !localStorage.getItem(LS_KEY_STATUS)) {
      // Need a microtask so computed allStatuses has evaluated from loaded list
      Promise.resolve().then(() => { selectedStatuses.value = allStatuses.value.slice() })
    }
  } catch {}
  loaded.value = true
})

watch(() => props.columns, (n)=>{ if (n && n.length) activeColumns.value = n.slice() })
// Persist selections
watch([selectedTags, keyword, selectedStatuses, productSort], persistAggregated, { deep: true })
function resetColumns(){}
</script>

<style scoped>
.product-matrix-dynamic { margin: 1.2rem 0; display: flex; flex-direction: column; gap: 1rem; }
/* 过滤 toolbar 样式由全局 custom.css + FilterToolbar.vue 控制，这里移除局部重复 */
.pm-badge { display:inline-block; padding: .15rem .45rem; font-size:.55rem; line-height:1; border-radius: 4px; font-weight:600; background: var(--vp-c-default-soft); color: var(--vp-c-text-1); }
.pm-badge.beta { background: #fde68a; color:#92400e; }
.pm-badge.preview { background:#e0e7ff; color:#3730a3; }
.pm-badge.ga { background:#bbf7d0; color:#065f46; }
.pm-sortable { cursor:pointer; user-select:none; }
.pm-sortable.active.asc { color: var(--vp-c-brand); }
.pm-sortable.active.desc { color: var(--vp-c-brand); }
.pm-sort-ind { font-size:.6rem; margin-left:.2rem; }
mark { background: #fef08a; color: inherit; padding:0 .1em; border-radius:2px; }
.pm-empty, .pm-loading { padding: 1rem; font-size: .8rem; opacity: .75; }
@media (min-width: 760px){
  .pm-row-label { text-align:right; }
  .pm-row { align-items:center; }
}

/* 简化后的表格样式（对齐方案目录风格） */
.pm-table-wrap { width:100%; overflow-x:visible; }
.pm-table-simple { width:100%; border-collapse: collapse; table-layout: auto; }
.pm-table-simple th, .pm-table-simple td { border:1px solid var(--vp-c-divider); padding:.55rem .6rem; font-size:.68rem; vertical-align: top; text-align:left; background: var(--vp-c-bg); }
.pm-table-simple thead th { background: var(--vp-c-bg-soft); font-weight:600; }
.pm-product-header span { font-weight:600; display:inline-block; }
.pm-product-badges { margin-top:.35rem; display:flex; gap:.3rem; flex-wrap:wrap; }
.pm-row-header, .pm-field-header { background: var(--vp-c-bg-soft); font-weight:600; white-space:nowrap; }
.product-tag { display:inline-block; background: var(--vp-c-default-soft); color: var(--vp-c-text-1); padding:.18rem .42rem; border-radius:4px; font-size:.55rem; line-height:1; margin:0 .25rem .25rem 0; }
.pm-badge.neutral { background: var(--vp-c-bg); color: var(--vp-c-text-2); border:1px solid var(--vp-c-divider); font-weight:500; }
@media (max-width: 960px){ .pm-table-simple th, .pm-table-simple td { font-size:.62rem; padding:.45rem .5rem; } }
@media (prefers-color-scheme: dark){ .pm-table-simple th, .pm-table-simple td { background: var(--vp-c-bg); } .product-tag { background: rgba(255,255,255,0.08); color: var(--vp-c-text-2); } .pm-badge.neutral { background: rgba(255,255,255,0.08); color: var(--vp-c-text-2); } }
</style>
