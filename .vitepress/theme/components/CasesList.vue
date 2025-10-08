<template>
  <div class="cases-wrapper" :aria-busy="loading" aria-live="polite">
    <h2 class="section-title">典型案例 (示例数据)</h2>

    <!-- 过滤与搜索工具条 -->
    <div class="toolbar" role="region" aria-label="案例筛选工具">
      <div class="types" role="tablist" aria-label="类型过滤">
        <button
          v-for="t in typeOptions"
          :key="t.value"
          :class="['type-btn', { active: activeType === t.value }]"
          role="tab"
          :aria-selected="activeType === t.value"
          type="button"
          @click="setType(t.value)"
        >{{ t.label }}</button>
      </div>
      <div class="search-box">
        <input
          ref="searchInputRef"
          :value="keyword"
          @input="onKeywordInput"
          class="search-input"
          type="search"
          placeholder="搜索标题或摘要..."
          aria-label="搜索案例"
        />
        <button v-if="keyword" class="clear-btn" type="button" @click="clearKeyword" aria-label="清除关键词">×</button>
      </div>
      <div class="result-info" aria-live="polite">
        <span v-if="!loading && !error">共 {{ filteredCases.length }} 条</span>
      </div>
    </div>

    <!-- 加载骨架 -->
    <div v-if="loading" class="grid skeleton" aria-hidden="true">
      <div v-for="n in 4" :key="n" class="card is-skeleton" role="presentation">
        <div class="cover shimmer" />
        <div class="body">
          <div class="line w70 shimmer" />
            <div class="line w50 shimmer" />
          <div class="line w90 shimmer" />
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="state error" role="alert" aria-live="assertive">
      <p>加载失败：{{ error }} <button @click="reload" type="button">重试</button></p>
    </div>

    <!-- 空数据（源数据为空） -->
    <div v-else-if="cases.length === 0" class="state empty" role="status">
      <p>暂无案例数据。</p>
    </div>

    <!-- 空过滤结果 -->
    <div v-else-if="filteredCases.length === 0" class="state empty" role="status">
      <p>没有匹配当前筛选 / 搜索条件的案例。
        <button type="button" class="reset-btn" @click="resetFilters">重置筛选</button>
      </p>
    </div>

    <!-- 正常数据 -->
    <div v-else class="grid">
      <a
        v-for="c in filteredCases"
        :key="c.id"
        class="card"
        :href="c.link"
        :aria-label="'查看案例：' + c.title"
      >
        <div class="cover">
          <img :src="c.cover" :alt="c.title" loading="lazy" @error="onImgError($event)" />
        </div>
        <div class="body">
          <h3 class="title">{{ c.title }}</h3>
          <p class="project">{{ c.project }}</p>
          <p class="summary">{{ c.summary }}</p>
          <span class="tag">{{ mapType(c.type) }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { withBase } from 'vitepress'

interface CaseItem {
  id: string
  title: string
  project: string
  type: string
  cover: string
  summary: string
  link: string
}

const cases = ref<CaseItem[]>([])
const loading = ref(true)
const error = ref('')
let lastTs = 0
let inFlightTs = 0
let timeoutId: number | null = null
const debug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debugCases')

// 过滤 & 搜索状态
const activeType = ref<string>('all')
const keyword = ref('')
const debouncedKeyword = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
let debounceTimer: number | null = null
const typeOptions = [
  { value: 'all', label: '全部' },
  { value: 'virtualization', label: '虚拟化' },
  { value: 'desktop', label: '云桌面' },
  { value: 'storage', label: '存储' },
  { value: 'other', label: '其他' }
]

function setType(t: string){
  activeType.value = t
}

function onKeywordInput(e: Event){
  const v = (e.target as HTMLInputElement).value
  keyword.value = v
  if(debounceTimer){
    clearTimeout(debounceTimer)
  }
  debounceTimer = window.setTimeout(() => {
    debouncedKeyword.value = v.trim()
  }, 260)
}

function clearKeyword(){
  keyword.value = ''
  debouncedKeyword.value = ''
  if(searchInputRef.value){
    searchInputRef.value.focus()
  }
}

function resetFilters(){
  activeType.value = 'all'
  clearKeyword()
}

const filteredCases = computed(() => {
  let list = cases.value
  if(activeType.value !== 'all'){
    list = list.filter(c => c.type === activeType.value)
  }
  if(debouncedKeyword.value){
    const kw = debouncedKeyword.value.toLowerCase()
    list = list.filter(c => c.title.toLowerCase().includes(kw) || c.summary.toLowerCase().includes(kw))
  }
  return list
})

function mapType(t: string){
  switch(t){
    case 'virtualization': return '虚拟化'
    case 'desktop': return '云桌面'
    case 'storage': return '存储'
    default: return '其他'
  }
}

function onImgError(e: Event){
  const el = e.target as HTMLImageElement
  if(!el || el.dataset.fallback) return
  el.dataset.fallback = '1'
  el.src = '/case-fallback.svg'
}

async function fetchData(){
  loading.value = true
  error.value = ''
  lastTs = Date.now()
  inFlightTs = lastTs
  const url = withBase('/cases.json') + '?ts=' + lastTs
  if(timeoutId){
    clearTimeout(timeoutId)
  }
  // 8 秒超时
  timeoutId = window.setTimeout(() => {
    if(inFlightTs === lastTs && loading.value){
      error.value = '加载超时'
      loading.value = false
      if(debug) console.warn('[cases] timeout for request', url)
    }
  }, 8000)
  try {
    if(debug) console.log('[cases] fetch start', url, 'ts', lastTs)
    const resp = await fetch(url, { cache: 'no-store' })
    if(inFlightTs !== lastTs){
      if(debug) console.log('[cases] stale response ignored(before ok check)', url)
      return // 已有更新请求发起
    }
    if(!resp.ok){
      throw new Error('HTTP ' + resp.status)
    }
    const data = await resp.json()
    if(inFlightTs !== lastTs){
      if(debug) console.log('[cases] stale response ignored(after json)', url)
      return
    }
    if(Array.isArray(data)) {
      cases.value = data
      if(debug) console.log('[cases] data loaded', data.length)
    } else {
      throw new Error('数据格式不是数组')
    }
  } catch(e:any){
    if(inFlightTs !== lastTs){
      if(debug) console.log('[cases] error but stale ignored', e)
      return
    }
    console.warn('[cases] 获取失败', e)
    error.value = e?.message || '未知错误'
    cases.value = []
  } finally {
    if(inFlightTs === lastTs){
      loading.value = false
      if(timeoutId){
        clearTimeout(timeoutId)
        timeoutId = null
      }
      if(debug) console.log('[cases] fetch end', url)
    }
  }
}

function reload(){
  fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
/* Layout */
.cases-wrapper { padding: 8px 0 32px; }
.section-title { font-size: 1.6rem; margin: 8px 0 16px; }
.grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill,minmax(240px,1fr)); }

/* Toolbar */
.toolbar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin: 4px 0 18px; }
.types { display: flex; gap: 6px; }
.type-btn { border: 1px solid #e5e7eb; background: #fff; padding: 4px 10px; font-size: 13px; border-radius: 6px; cursor: pointer; line-height: 1.2; color:#374151; }
.type-btn:hover { background: #f3f4f6; }
.type-btn.active { background: #4338ca; color:#fff; border-color:#4338ca; }
.search-box { position: relative; }
.search-input { border:1px solid #d1d5db; background:#fff; padding:6px 26px 6px 10px; font-size:13px; border-radius:6px; width:200px; }
.search-input:focus { outline: 2px solid #6366f1; outline-offset: 1px; }
.clear-btn { position:absolute; right:4px; top:50%; transform:translateY(-50%); border:none; background:transparent; cursor:pointer; font-size:16px; line-height:1; color:#6b7280; }
.clear-btn:hover { color:#111827; }
.reset-btn { margin-left:8px; font-size:13px; cursor:pointer; background:#4338ca; color:#fff; border:none; padding:4px 10px; border-radius:4px; }
.reset-btn:hover { background:#3730a3; }
.result-info { font-size:12px; color:#6b7280; }

/* Card */
.card { display: flex; flex-direction: column; text-decoration: none; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; transition: box-shadow .2s, border-color .2s; overflow: hidden; position: relative; }
.card:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08); border-color: #d1d5db; }
.cover { aspect-ratio: 4/3; background: #f3f4f6; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.cover img { width: 100%; height: 100%; object-fit: cover; }
.body { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 4px; position: relative; }
.title { font-size: 15px; line-height: 1.3; margin: 0; font-weight: 600; color: #111827; }
.project { margin: 0; font-size: 12px; color: #374151; }
.summary { margin: 2px 0 0; font-size: 12px; line-height: 1.4; color: #4b5563; min-height: 32px; }
.tag { position: absolute; top: 12px; right: 12px; font-size: 11px; background: #eef2ff; color: #4338ca; padding: 2px 6px; border-radius: 999px; }

/* State blocks */
.state { padding: 24px 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fafafa; color: #374151; font-size: 14px; }
.state.error { border-color: #fca5a5; background: #fef2f2; color: #b91c1c; }
.state.empty { text-align: center; }
.state button { margin-left: 8px; font-size: 13px; cursor: pointer; background: #3b82f6; border: none; color: #fff; padding: 4px 10px; border-radius: 4px; }
.state button:hover { background: #2563eb; }

/* Skeleton */
.skeleton .card { pointer-events: none; }
.is-skeleton .body { gap: 6px; }
.line { height: 10px; border-radius: 4px; background: #e5e7eb; }
.line.w70 { width: 70%; }
.line.w50 { width: 50%; }
.line.w90 { width: 90%; }
.shimmer { position: relative; overflow: hidden; }
.shimmer::after { content: ''; position: absolute; inset: 0; background: linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.6) 40%, rgba(255,255,255,0) 80%); animation: shimmer 1.2s linear infinite; transform: translateX(-100%); }
@keyframes shimmer { to { transform: translateX(100%); } }
</style>
