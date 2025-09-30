<template>
  <Layout :class="'kr-custom-layout'">
    <!-- 已移除方案页底部 CTA 插槽 -->
    <template #doc-after>
      <PricingCTA v-if="showPricingCTA" />
    </template>
    <template #layout-bottom>
      <SiteFooter v-if="showFooter" />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
// 直接使用默认主题的 Layout 组件，再显式声明 layout-bottom 插槽内容
const { Layout } = DefaultTheme
import SiteFooter from './components/SiteFooter.vue'
import PricingCTA from './components/PricingCTA.vue'
import { useRoute, useData } from 'vitepress'
import { computed } from 'vue'

const route = useRoute()
const { frontmatter } = useData()
// 方案页底部扩展已移除

// 隐藏页脚的路径前缀（含多语言占位）
const footerHiddenPrefixes = [
  '/products','/solutions','/help','/krvirt','/krcmp','/krdesktop','/krstorage',
  '/pricing',
  '/en/products','/en/solutions','/en/help','/en/krvirt','/en/krcmp','/en/krdesktop','/en/krstorage','/en/pricing'
]
const showFooter = computed(() => {
  // 如果 frontmatter 中明确设置了 footer: false，则不显示页脚
  if (frontmatter.value.footer === false) {
    return false
  }
  // 检查路径前缀
  return !footerHiddenPrefixes.some(p => route.path === p || route.path.startsWith(p + '/'))
})

// 定价页 CTA：路径以 /pricing 开头且未在 frontmatter 禁用
const showPricingCTA = computed(() => {
  if (frontmatter.value.pricingCTA === false) return false
  return route.path.startsWith('/pricing')
})
</script>

<style scoped>
.aside-content{
  overflow: hidden;
}
.aside-container{
  overflow: hidden;
}
</style>