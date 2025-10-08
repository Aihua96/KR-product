<template>
  <div class="cases-wrapper" :aria-busy="loading" aria-live="polite">
    <h2 class="section-title">典型案例 (示例数据)</h2>

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

    <!-- 空数据 -->
    <div v-else-if="cases.length === 0" class="state empty" role="status">
      <p>暂无案例数据。</p>
    </div>

    <!-- 正常数据 -->
    <div v-else class="grid">
      <a
        v-for="c in cases"
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
import { onMounted, ref } from 'vue'
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
  try {
    const resp = await fetch(url, { cache: 'no-store' })
    if(inFlightTs !== lastTs){
      return // 已有更新请求发起
    }
    if(!resp.ok){
      throw new Error('HTTP ' + resp.status)
    }
    const data = await resp.json()
    if(inFlightTs !== lastTs){
      return
    }
    if(Array.isArray(data)) {
      cases.value = data
    } else {
      throw new Error('数据格式不是数组')
    }
  } catch(e:any){
    if(inFlightTs !== lastTs){
      return
    }
    console.warn('[cases] 获取失败', e)
    error.value = e?.message || '未知错误'
    cases.value = []
  } finally {
    if(inFlightTs === lastTs){
      loading.value = false
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
