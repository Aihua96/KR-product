<template>
  <a class="price-btn" href="/pricing/" @click="onClick">
    <slot>查看价格</slot>
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 10h10M11 6l4 4-4 4"/></svg>
  </a>
</template>
<script setup lang="ts">
function onClick(){ /* 可埋点 */ }
</script>
<style scoped>
.price-btn { display:inline-flex; align-items:center; gap:.4rem; background:var(--vp-c-brand); color:#fff; padding:.55rem .95rem; border-radius:8px; font-size:.82rem; font-weight:600; text-decoration:none; line-height:1; box-shadow:0 2px 6px -2px rgba(0,0,0,.5),0 4px 14px -4px rgba(0,0,0,.35); transition:.18s; }
.price-btn:hover { filter:brightness(.92); transform:translateY(-1px); box-shadow:0 4px 14px -4px rgba(0,0,0,.55),0 6px 20px -6px rgba(0,0,0,.45); }
.dark .price-btn { background:linear-gradient(90deg,var(--vp-c-brand),#2563eb); }
</style>
