<template>
  <div class="pm-toolbar" :class="wrapperClass">
    <!-- 搜索 -->
    <div class="pm-row pm-row-search" v-if="showSearch">
      <div class="pm-search-box">
        <input v-model="innerKeyword" class="pm-input" :placeholder="t('searchPlaceholder')" @keyup.enter="emitChange" />
        <button v-if="innerKeyword" class="pm-clear-search" @click="clearKeyword">{{ t('clear') }}</button>
      </div>
    </div>

    <!-- 行业 -->
    <div class="pm-row" v-if="industries?.length && showIndustries">
      <span class="pm-row-label">{{ t('industry') }}:</span>
      <div class="pm-tags">
        <button v-for="i in industries" :key="i" class="pm-tag-btn" :class="{ active: selectedIndustries.has(i) }" @click="toggleIndustry(i)">{{ i }}</button>
        <button v-if="selectedIndustries.size" class="pm-clear" @click="clearIndustries">{{ t('clear') }}</button>
      </div>
    </div>

    <!-- 标签 -->
    <div class="pm-row" v-if="tags?.length && showTags">
      <span class="pm-row-label">{{ t('tag') }}:</span>
      <div class="pm-tags">
        <button v-for="tg in tags" :key="tg" class="pm-tag-btn" :class="{ active: selectedTags.has(tg) }" @click="toggleTag(tg)">#{{ displayTag(tg) }}</button>
        <button v-if="selectedTags.size" class="pm-clear" @click="clearTags">{{ t('clear') }}</button>
      </div>
    </div>

    <!-- 状态 -->
    <div class="pm-row" v-if="statuses?.length && showStatuses">
      <span class="pm-row-label">{{ t('status') }}:</span>
      <div class="pm-status-filter">
        <label v-for="s in statuses" :key="s" class="pm-status-opt">
          <input type="checkbox" :value="s" v-model="innerStatuses" @change="emitChange" /> {{ s }}
        </label>
        <button v-if="innerStatuses.length" class="pm-clear-status" @click="clearStatuses">{{ t('clear') }}</button>
      </div>
    </div>

    <!-- 排序（简单 radio 或外部插槽） -->
    <div class="pm-row" v-if="sortOptions?.length && showSort">
      <span class="pm-row-label">{{ t('sort') }}:</span>
      <div class="pm-status-filter">
        <label v-for="opt in sortOptions" :key="opt.value" class="pm-status-opt">
          <input type="radio" :value="opt.value" v-model="innerSort" @change="emitChange" /> {{ opt.label }}
        </label>
        <button class="pm-clear-status" v-if="showReset" @click="resetAll">{{ t('reset') }}</button>
      </div>
    </div>

    <!-- 扩展插槽（列选择 / 导出 等） -->
    <div class="pm-row pm-row-actions" v-if="$slots.actions">
      <span class="pm-row-label" v-if="actionsLabel">{{ actionsLabel }}</span>
      <div class="pm-actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface SortOption { value: string; label: string }

const props = defineProps<{ 
  lang?: 'zh' | 'en'
  // visibility controls
  showSearch?: boolean
  showIndustries?: boolean
  showTags?: boolean
  showStatuses?: boolean
  showSort?: boolean
  showReset?: boolean
  tagModeEnabled?: boolean // 已废弃：不再显示任意/全部切换（保留 prop 仅避免外部传入报错）
  actionsLabel?: string
  // data
  industries?: string[]
  tags?: string[]
  statuses?: string[]
  sortOptions?: SortOption[]
  // model values
  keyword?: string
  selectedIndustries?: string[]
  selectedTags?: string[]
  selectedStatuses?: string[]
  tagMode?: 'any' | 'all' // 仍透传旧值以保持现有父组件逻辑（内部不渲染）
  sort?: string
  // i18n override map (optional)
  i18nMap?: Record<string,string>
  i18nFile?: string // future external file path
  wrapperClass?: string
}>()

const emit = defineEmits<{
  (e:'update:keyword', v:string): void
  (e:'update:selectedIndustries', v:string[]): void
  (e:'update:selectedTags', v:string[]): void
  (e:'update:selectedStatuses', v:string[]): void
  (e:'update:tagMode', v:'any'|'all'): void // 兼容旧事件，不再主动修改
  (e:'update:sort', v:string): void
  (e:'change'): void
  (e:'reset'): void
}>()

const lang = computed(()=> props.lang || (typeof window !== 'undefined' && window.location.pathname.startsWith('/en/') ? 'en' : 'zh'))

const innerKeyword = ref(props.keyword || '')
// 标签模式已下线，不再使用 UI；仅保留变量避免外部传入触发警告
const innerTagMode = ref<'any'|'all'>(props.tagMode || 'any')
const selectedIndustries = ref<Set<string>>(new Set(props.selectedIndustries || []))
const selectedTags = ref<Set<string>>(new Set(props.selectedTags || []))
const innerStatuses = ref<string[]>(props.selectedStatuses?.slice() || [])
const innerSort = ref(props.sort || (props.sortOptions?.[0]?.value || ''))

watch(() => props.keyword, v=> { if(v!==undefined) innerKeyword.value = v })
// tagMode 已废弃：不再 watch 但保留原值
watch(() => props.selectedIndustries, v=> { if(v) selectedIndustries.value = new Set(v) })
watch(() => props.selectedTags, v=> { if(v) selectedTags.value = new Set(v) })
watch(() => props.selectedStatuses, v=> { if(v) innerStatuses.value = v.slice() })
watch(() => props.sort, v=> { if(v) innerSort.value = v })

function emitChange(){
  emit('update:keyword', innerKeyword.value)
  emit('update:selectedIndustries', Array.from(selectedIndustries.value))
  emit('update:selectedTags', Array.from(selectedTags.value))
  emit('update:selectedStatuses', innerStatuses.value)
  // tagMode 已废弃，不再 emit
  emit('update:sort', innerSort.value)
  emit('change')
}

function clearKeyword(){ innerKeyword.value=''; emitChange() }
function toggleIndustry(i:string){ selectedIndustries.value.has(i) ? selectedIndustries.value.delete(i) : selectedIndustries.value.add(i); emitChange() }
function toggleTag(t:string){ selectedTags.value.has(t) ? selectedTags.value.delete(t) : selectedTags.value.add(t); emitChange() }
function clearIndustries(){ selectedIndustries.value.clear(); emitChange() }
function clearTags(){ selectedTags.value.clear(); emitChange() }
// 全选移除
function clearStatuses(){ innerStatuses.value = []; emitChange() }
function resetAll(){
  innerKeyword.value = ''
  // tagMode 已废弃
  selectedIndustries.value.clear()
  selectedTags.value.clear()
  innerStatuses.value = props.statuses ? props.statuses.slice() : []
  if (props.sortOptions?.length) innerSort.value = props.sortOptions[0].value
  emit('reset')
  emitChange()
}

const i18n = ref<Record<string, Record<string,string>> | null>(null)
async function loadI18n(){
  if (i18n.value || typeof fetch === 'undefined') return
  try {
    const r = await fetch('/filter-toolbar-i18n.json')
    if (r.ok) i18n.value = await r.json()
  } catch {}
}
if (typeof window !== 'undefined') loadI18n()

function t(key:string){
  return props.i18nMap?.[key] || i18n.value?.[lang.value]?.[key] || key
}
function displayTag(tag:string){
  // 允许 i18n JSON 中使用 tag.<name> 提供翻译
  const transKey = 'tag.'+tag
  const translated = props.i18nMap?.[transKey] || i18n.value?.[lang.value]?.[transKey]
  if (translated) return translated
  // zh 模式下若是全英文可直接返回翻译失败的原值；英文模式保持原值
  return tag
}
</script>

<style scoped>
.pm-actions { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; }
.pm-row-actions .pm-row-label { align-self:flex-start; }
/* 统一导出按钮样式（Solutions & ProductMatrix 共用） */
.pm-export { padding:.35rem .9rem; font-size:.65rem; border:1px solid var(--vp-c-brand); background:transparent; border-radius:6px; cursor:pointer; line-height:1.1; }
.pm-export:hover { background: var(--vp-c-brand-soft); }
.pm-export:active { background: var(--vp-c-brand); color: #fff; }
</style>
