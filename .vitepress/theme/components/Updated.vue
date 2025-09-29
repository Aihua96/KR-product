<script setup lang="ts">
import { useData } from 'vitepress'

// i18n prefix map; can extend
const PREFIX: Record<string,string> = {
  'zh-CN': '最后更新：',
  'zh': '最后更新：',
  'en-US': 'Last Updated: ',
  'en': 'Last Updated: '
}

const { page, theme, lang } = useData()

function pickDate(): string | null {
  // Git lastUpdated comes from page.value.lastUpdated (ms timestamp) in VP2
  const gitTs = (page.value.lastUpdated && typeof page.value.lastUpdated === 'number')
    ? page.value.lastUpdated
    : null

  // Frontmatter manual fallback if user still supplies
  const fm = page.value.frontmatter as any
  let fmTs: number | null = null
  if (fm && fm.updated) {
    // Accept YYYY-MM-DD or ISO
    const parsed = Date.parse(fm.updated as string)
    if (!isNaN(parsed)) fmTs = parsed
  }

  const best = gitTs && fmTs ? Math.max(gitTs, fmTs) : (gitTs || fmTs)
  if (!best) return null
  const d = new Date(best)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth()+1).padStart(2,'0')
  const dd = String(d.getDate()).padStart(2,'0')
  return `${yyyy}-${mm}-${dd}`
}

const dateStr = pickDate()
const prefix = PREFIX[lang.value] || PREFIX['en']
</script>

<template>
  <span v-if="dateStr">{{ prefix + dateStr }}</span>
  <span v-else>{{ prefix }}-</span>
</template>

<style scoped>
span { white-space: nowrap; }
</style>