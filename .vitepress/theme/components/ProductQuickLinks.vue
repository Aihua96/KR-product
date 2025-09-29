<template>
  <div class="product-quick-links" v-if="resolved.length">
    <h2 v-if="title" class="pql-title">{{ title }}</h2>
    <ul>
      <li v-for="item in resolved" :key="item.href">
        <a :href="item.href">
          <span class="pql-icon" v-if="item.icon">{{ item.icon }}</span>{{ item.label }}
        </a>
      </li>
    </ul>
  </div>
  <div v-else class="product-quick-links pql-empty" v-if="loaded">{{ prefix ? 'No quick links' : '暂无快速入口' }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface JsonLink { key: string; zh: string; en: string; href: string; icon?: string }
interface JsonEntry { order?: number; links: JsonLink[] }

const props = defineProps<{ title?: string; product?: string }>()

const path = typeof window !== 'undefined' ? window.location.pathname : ''
const inferred = path.match(/(?:^|\/)(krvirt|krcmp|krdesktop|krstorage)(?:\/|$)/i)?.[1]?.toLowerCase() || ''
const product = (props.product || inferred).toLowerCase()
const isEn = path.startsWith('/en/')
const prefix = isEn ? '/en' : ''
const title = props.title || (isEn ? 'Quick Links' : '快速入口')

const loaded = ref(false)
const mapping = ref<Record<string, JsonEntry>>({})

onMounted(async () => {
  try {
    const r = await fetch('/product-quick-links.json')
    if (r.ok) mapping.value = await r.json()
  } catch (e) { console.warn('load product-quick-links.json failed', e) }
  loaded.value = true
})

const resolved = computed(() => {
  const entry = mapping.value[product]
  if (!entry) return []
  return entry.links.map(l => ({
    href: prefix + l.href,
    label: isEn ? l.en : l.zh,
    icon: l.icon
  }))
})
</script>

<style scoped>
.product-quick-links { margin: 1.2rem 0; }
.product-quick-links ul { list-style: none; padding-left: 0; display:flex; flex-wrap:wrap; gap:.6rem; }
.product-quick-links li { background: var(--vp-c-bg-soft); padding:.45rem .75rem; border-radius:6px; font-size:.65rem; }
.product-quick-links a { text-decoration: none; display:inline-flex; align-items:center; gap:.35rem; }
.pql-title { font-size: 1.05rem; margin-bottom:.55rem; }
.pql-icon { font-size:.9em; }
.pql-empty { font-size:.7rem; opacity:.7; }
</style>