<template>
  <div v-if="items.length" class="product-status-bar">
    <div class="psb-item" v-for="p in items" :key="p.id">
      <div class="psb-head">
        <a :href="localizedLink(p.link)" class="psb-name">{{ displayName(p) }}</a>
        <span class="psb-version" v-if="p.version">{{ p.version }}</span>
        <span class="psb-status" :class="p.status && ('st-' + p.status.toLowerCase())" v-if="p.status">{{ p.status }}</span>
      </div>
      <div class="psb-tags" v-if="p.tags && p.tags.length">
        <span v-for="t in p.tags" :key="t" class="psb-tag">{{ t }}</span>
      </div>
      <div class="psb-desc" v-if="p.positioning">{{ p.positioning }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface ProductItem {
  id: string
  nameZh: string
  nameEn: string
  version?: string
  status?: string
  tags: string[]
  positioningZh?: string
  positioningEn?: string
  link: string
}

const items = ref<any[]>([])
const path = typeof window !== 'undefined' ? window.location.pathname : ''
const isEn = path.startsWith('/en/')

function displayName(p: ProductItem) {
  return isEn ? (p.nameEn || p.nameZh) : p.nameZh
}
function localizedLink(base: string) {
  if (isEn) {
    // ensure /en prefix once
    return base.startsWith('/en/') ? base : '/en' + base
  }
  return base
}

onMounted(async () => {
  try {
    const r = await fetch('/products.json')
    if (!r.ok) return
    const data: ProductItem[] = await r.json()
    // Derive minimal subset for status bar
    items.value = data.map(d => ({
      ...d,
      positioning: isEn ? (d.positioningEn || d.positioningZh) : (d.positioningZh)
    }))
  } catch (e) {
    console.warn('[ProductStatusBar] load failed', e)
  }
})
</script>

<style scoped>
.product-status-bar { display:grid; gap:.9rem; margin:1.2rem 0 1.4rem; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); }
.psb-item { border:1px solid var(--vp-c-divider); padding:.65rem .75rem .7rem; border-radius:8px; background:var(--vp-c-bg-soft); position:relative; }
.psb-head { display:flex; flex-wrap:wrap; align-items:center; gap:.4rem; margin-bottom:.35rem; }
.psb-name { font-weight:600; font-size:.85rem; text-decoration:none; }
.psb-version { font-size:.65rem; background:var(--vp-c-brand-soft); color:var(--vp-c-brand-1); padding:.1rem .4rem; border-radius:4px; }
.psb-status { font-size:.6rem; padding:.12rem .45rem; border-radius:4px; letter-spacing:.5px; text-transform:uppercase; }
.psb-status.st-ga { background:#064e3b; color:#d1fae5; }
.psb-status.st-beta { background:#92400e; color:#fef3c7; }
.psb-status.st-preview { background:#3730a3; color:#e0e7ff; }
.psb-tags { display:flex; flex-wrap:wrap; gap:.3rem; margin-bottom:.3rem; }
.psb-tag { font-size:.55rem; background:var(--vp-c-default-soft); padding:.15rem .4rem; border-radius:3px; line-height:1; }
.psb-desc { font-size:.62rem; line-height:1.25; opacity:.85; }
@media (max-width: 600px){
  .product-status-bar { grid-template-columns:1fr 1fr; }
}
</style>
