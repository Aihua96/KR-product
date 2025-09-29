<template>
  <div class="solutions-index">
    <FilterToolbar
      :lang="lang"
      :show-search="true"
      :show-industries="industries.length>0"
      :show-tags="tags.length>0"
      :show-statuses="false"
      :show-sort="false"
      :show-reset="true"
      :tag-mode-enabled="false"
      :industries="industries"
      :tags="tags"
      :keyword="keyword"
      :selected-industries="Array.from(selectedIndustries)"
      :selected-tags="Array.from(selectedTags)"
      actions-label="导出:"
      @update:keyword="v=> keyword=v"
      @update:selectedIndustries="arr=> setIndustries(arr)"
      @update:selectedTags="arr=> setTags(arr)"
      @reset="resetFilters"
    >
      <template #actions>
        <button class="pm-export" @click="exportCsv">CSV</button>
        <button class="pm-export" @click="exportMarkdown">MD</button>
        <button class="pm-export" @click="copyShareUrl">URL</button>
      </template>
    </FilterToolbar>

    <div v-if="filtered.length === 0" class="si-empty">暂无匹配方案</div>

    <ul class="si-list">
  <li v-for="s in filtered" :key="s.id" class="si-item">
        <h3><a :href="s.path">{{ s.title }}</a></h3>
        <p class="si-meta">
          <span v-for="i in s.industries" :key="i" class="badge industry">{{ i }}</span>
          <span v-for="t in s.tags" :key="t" class="badge tag">#{{ t }}</span>
        </p>
        <p class="si-updated" v-if="s.updated">更新时间: {{ formatDate(s.updated) }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import FilterToolbar from './FilterToolbar.vue'

interface SolutionMeta {
  id: string
  title: string
  category: string
  industries: string[]
  tags: string[]
  path: string
  updated?: string
  // 2025-09: status 已废弃，不再包含
}

const STORAGE_KEY = 'solutions_filters_v1'
const lang = (typeof window !== 'undefined' && window.location.pathname.startsWith('/en/')) ? 'en' : 'zh'

const list = ref<SolutionMeta[]>([])
const keyword = ref('')
// 状态展示与筛选已移除；排序功能已移除（固定按标题）
// 标签模式已移除：统一为“任意包含” OR 逻辑
const selectedIndustries = ref<Set<string>>(new Set())
const selectedTags = ref<Set<string>>(new Set())

function saveState() {
  const data = {
    keyword: keyword.value,
    industries: Array.from(selectedIndustries.value),
    tags: Array.from(selectedTags.value)
  }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const data = JSON.parse(raw)
    keyword.value = data.keyword || ''
    selectedIndustries.value = new Set(data.industries || [])
    selectedTags.value = new Set(data.tags || [])
  } catch {}
}

const industries = computed(() => Array.from(new Set(list.value.flatMap(s => s.industries))).sort())
const tags = computed(() => Array.from(new Set(list.value.flatMap(s => s.tags))).sort())
// statuses 已移除

function formatDate(d?: string){
  if(!d) return ''
  return d.split('T')[0]
}

function setIndustries(arr: string[]){ selectedIndustries.value = new Set(arr) }
function setTags(arr: string[]){ selectedTags.value = new Set(arr) }

function resetFilters(){
  keyword.value = ''
  selectedIndustries.value.clear()
  selectedTags.value.clear()
  // 不立即写 URL，等用户再操作或共享
}
// sortOptions 已移除

function buildShareQuery(){
  const params = new URLSearchParams()
  if (keyword.value.trim()) params.set('kw', keyword.value.trim())
  if (selectedIndustries.value.size) params.set('inds', Array.from(selectedIndustries.value).join(','))
  if (selectedTags.value.size) params.set('tags', Array.from(selectedTags.value).join(','))
  return params.toString()
}
function copyShareUrl(){
  if (typeof window === 'undefined') return
  const q = buildShareQuery()
  const url = window.location.origin + window.location.pathname + (q? ('?'+q):'')
  navigator.clipboard?.writeText(url).then(()=>{
    // 轻提示可以后续加一个全局 toast，这里暂留注释
    console.log('share url copied')
  })
}
function applyQuery(){
  if (typeof window === 'undefined') return
  const usp = new URLSearchParams(window.location.search)
  const kw = usp.get('kw'); if (kw) keyword.value = kw
  const inds = usp.get('inds'); if (inds) selectedIndustries.value = new Set(inds.split(',').filter(Boolean))
  const tagStr = usp.get('tags'); if (tagStr) selectedTags.value = new Set(tagStr.split(',').filter(Boolean))
  // 旧 status / sort / mode 参数忽略
}
function exportCsv(){
  const header = ['"ID"','"标题"','"行业"','"标签"','"更新时间"','"路径"']
  const rows = filtered.value.map(s => [
    s.id, s.title, s.industries.join(';'), s.tags.join(';'), s.updated||'', s.path
  ].map(v => '"'+(v||'').replace(/"/g,'""')+'"'))
  const filters = buildShareQuery()
  const metaLine = '# note: status 字段自 2025-09 起已移除，仅保留标题/行业/标签/更新时间/路径'
  const content = ['# filters: '+(filters||'none'), metaLine, header.join(','), ...rows.map(r=>r.join(','))].join('\n')+'\n'
  const blob = new Blob([content], { type:'text/csv;charset=utf-8;' })
  triggerDownload(blob, 'solutions.csv')
}
function exportMarkdown(){
  const escape = (s:string)=> (s||'').replace(/\|/g,'\\|').replace(/\n/g,' / ')
  const filters = buildShareQuery()
  const header = '| ID | 标题 | 行业 | 标签 | 更新时间 | 路径 |'
  const sep = '| --- | --- | --- | --- | --- | --- |'
  const body = filtered.value.map(s => `| ${escape(s.id)} | ${escape(s.title)} | ${escape(s.industries.join(';'))} | ${escape(s.tags.join(';'))} | ${escape(s.updated||'')} | ${escape(s.path)} |`).join('\n')
  const note = '<!-- filters:'+(filters||'none')+' | note: status 字段自 2025-09 起移除 -->' 
  const blob = new Blob([`${note}\n${header}\n${sep}\n${body}\n`], { type:'text/markdown;charset=utf-8;' })
  triggerDownload(blob, 'solutions.md')
}
function triggerDownload(blob:Blob, filename:string){
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href=url; a.download=filename; a.click(); setTimeout(()=>URL.revokeObjectURL(url),400)
}

const filtered = computed(() => {
  return list.value
    .filter(s => {
      const kw = keyword.value.trim().toLowerCase()
      const kwMatch = !kw || s.title.toLowerCase().includes(kw) || s.tags.some(t => t.toLowerCase().includes(kw))
      const industryMatch = selectedIndustries.value.size === 0 || s.industries.some(i => selectedIndustries.value.has(i))
      const tagMatch = selectedTags.value.size === 0 || s.tags.some(t => selectedTags.value.has(t))
      return kwMatch && industryMatch && tagMatch
    })
    .sort((a,b) => a.title.localeCompare(b.title, 'zh'))
})

onMounted(async () => {
  restoreState()
  applyQuery()
  try {
    const resp = await fetch('/solutions/meta.json')
    if (resp.ok) list.value = await resp.json()
  } catch (e) { console.warn('加载 solutions meta 失败', e) }
})

watch([keyword, selectedIndustries, selectedTags], saveState, { deep: true })
</script>

<style scoped>
.solutions-index { margin: 1.5rem 0; }
.si-list { list-style: none; padding: 0; margin: 1rem 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
.si-item { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: .9rem .95rem; background: var(--vp-c-bg-soft); display: flex; flex-direction: column; gap: .4rem; }
.si-item h3 { font-size: 1.05rem; margin: 0; }
.si-item a { text-decoration: none; }
.si-meta { display: flex; flex-wrap: wrap; gap: .35rem; margin: 0; }
.badge { background: var(--vp-c-brand-soft); color: var(--vp-c-text-1); padding: 2px 6px; border-radius: 4px; font-size: .6rem; line-height: 1.2; }
.badge.tag { background: var(--vp-c-default-soft); }
.si-updated { font-size: .6rem; opacity: .65; margin: 0; }
.si-empty { padding: 1rem; font-size: .9rem; color: var(--vp-c-text-2); }
@media (max-width: 640px){ .si-list { grid-template-columns: 1fr; } }
</style>
