<template>
  <Layout :class="'kr-custom-layout'">
    <template #doc-after>
      <div v-if="showSolutionsAfter"><SolutionsDocAfter /></div>
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
import SolutionsDocAfter from './components/SolutionsDocAfter.vue'
import { useRoute, useData } from 'vitepress'
import { computed } from 'vue'

const route = useRoute()
const { frontmatter } = useData()
const showSolutionsAfter = computed(()=> route.path.startsWith('/solutions/') && route.path !== '/solutions/')

// 隐藏页脚的路径前缀（含多语言占位）
const footerHiddenPrefixes = ['/products','/solutions','/help','/krvirt','/krcmp','/krdesktop','/krstorage','/en/products','/en/solutions','/en/help','/en/krvirt','/en/krcmp','/en/krdesktop','/en/krstorage']
const showFooter = computed(() => {
  // 如果 frontmatter 中明确设置了 footer: false，则不显示页脚
  if (frontmatter.value.footer === false) {
    return false
  }
  // 检查路径前缀
  return !footerHiddenPrefixes.some(p => route.path === p || route.path.startsWith(p + '/'))
})
</script>

<style scoped>
.kr-custom-layout :deep(.kr-site-footer){
  /* 可在此添加与主体间的额外分隔 */
}
.aside-content{
  overflow: hidden;
}
.aside-container{
  overflow: hidden;
}
</style>