<template>
  <div class="home-quick-entries" v-if="entries.length">
    <div class="hq-title">快速入口 / Quick Access</div>
    <div class="hq-grid">
      <a v-for="e in entries" :key="e.pid + '-' + e.key" :href="e.href" class="hq-item">
        <span class="hq-icon" v-if="e.icon">{{ e.icon }}</span>
        <span class="hq-text">{{ e.label }}</span>
        <span class="hq-prod" :title="e.productName">{{ e.productShort }}</span>
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useData } from 'vitepress'

interface QuickLink { key:string; zh:string; en:string; href:string; icon?:string }
interface ProductConfig { order:number; links:QuickLink[] }

const { lang } = useData()
const entries = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await fetch('/product-quick-links.json')
    if (!res.ok) return
    const data: Record<string, ProductConfig> = await res.json()
    const list: any[] = []
    Object.entries(data)
      .sort((a,b) => a[1].order - b[1].order)
      .forEach(([pid, cfg]) => {
        cfg.links.slice(0,2).forEach(l => {
          list.push({
            pid,
            key: l.key,
            href: l.href,
            icon: l.icon,
            label: lang.value.startsWith('zh') ? l.zh : l.en,
            productName: pid,
            productShort: pid.toUpperCase()
          })
        })
      })
    entries.value = list
  } catch (e) { /* silent */ }
})
</script>
