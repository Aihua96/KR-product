<template>
  <span 
    class="kr-term" 
    @mouseenter="showTooltip = true" 
    @mouseleave="showTooltip = false"
    :title="tooltipText"
  >
    {{ name }}
    <div class="kr-term-tooltip" v-show="showTooltip">
      <div class="kr-term-name">{{ full || name }}</div>
      <div class="kr-term-desc">{{ desc }}</div>
      <div class="kr-term-desc-en" v-if="descEn">{{ descEn }}</div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  name: string
  desc?: string
  descEn?: string
  full?: string
  fullEn?: string
}

const props = withDefaults(defineProps<Props>(), {
  desc: '',
  descEn: '',
  full: '',
  fullEn: ''
})

const showTooltip = ref(false)

const tooltipText = computed(() => {
  return `${props.full || props.name}: ${props.desc}`
})
</script>

<style scoped>
.kr-term {
  position: relative;
  display: inline-block;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-decoration-style: dotted;
  cursor: help;
  font-weight: 500;
}

.kr-term:hover {
  color: var(--vp-c-brand-2);
}

.kr-term-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  background: #2a2e35;
  border: 1px solid #3c4149;
  border-radius: 6px;
  padding: 8px 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  min-width: 200px;
  max-width: 300px;
  text-align: left;
  white-space: normal;
}

.kr-term-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #2a2e35;
}

.kr-term-name {
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
  font-size: 14px;
}

.kr-term-desc {
  color: #e9ecef;
  font-size: 13px;
  line-height: 1.4;
}

.kr-term-desc-en {
  color: #adb5bd;
  font-size: 12px;
  font-style: italic;
  margin-top: 2px;
  line-height: 1.3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .kr-term-tooltip {
    min-width: 180px;
    max-width: 250px;
    font-size: 12px;
  }
  
  .kr-term-name {
    font-size: 13px;
  }
  
  .kr-term-desc {
    font-size: 12px;
  }
  
  .kr-term-desc-en {
    font-size: 11px;
  }
}
</style>