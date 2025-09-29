<template>
  <div class="lang-switch" v-if="link">
    <a :href="link.href" :title="link.title">{{ link.label }}</a>
  </div>
</template>
<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { localePath, page } = useData()

// Logic: if current starts with /en/ -> offer 中文 (strip /en) else offer English (/en + path)
const link = computed(() => {
  const path = page.value.relativePath // e.g. en/products/index.md or products/index.md
  if (!path) return null
  const clean = '/' + path.replace(/index\.md$/, '') // remove index.md
  if (clean.startsWith('/en/')) {
    const target = clean.replace(/^\/en\//, '/').replace(/\/$/, '/')
    return { href: target === '/' ? '/' : target, label: '中文', title: '切换到中文' }
  } else {
    // skip adding /en/ twice
    const target = clean === '/' ? '/en/' : '/en' + (clean.startsWith('/') ? clean : '/' + clean)
    return { href: target, label: 'EN', title: 'Switch to English' }
  }
})
</script>
