<template>
  <div v-if="showCTA">
    <ContactCTA />
  </div>
</template>
<script setup lang="ts">
import { useData } from 'vitepress'
import ContactCTA from './ContactCTA.vue'

const { page } = useData()
const fm: any = page.value.frontmatter || {}
const showCTA = fm.contact !== false
</script>