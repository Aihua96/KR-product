<template>
  <div class="contact-cta">
    <div class="cta-body">
      <h4>需要进一步了解或获取方案支持？</h4>
      <p>联系我们的解决方案顾问，获取定制化评估 / 架构设计 / PoC 支持。</p>
      <div class="cta-actions">
        <a :href="primaryHref" class="btn primary" target="_blank" rel="noopener">{{ primaryText }}</a>
        <a v-if="wechatHref" :href="wechatHref" class="btn wechat" target="_blank" rel="noopener">企业微信</a>
        <a v-if="formHref" :href="formHref" class="btn ghost" target="_blank" rel="noopener">提交需求表单</a>
        <a v-if="secondaryHref" :href="secondaryHref" class="btn ghost" target="_blank" rel="noopener">{{ secondaryText }}</a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  primaryHref?: string
  primaryText?: string
  secondaryHref?: string
  secondaryText?: string
  wechatHref?: string
  formHref?: string
}
const props = defineProps<Props>()
const primaryHref = props.primaryHref || 'mailto:contact@kanrong.example.com?subject=解决方案咨询'
const primaryText = props.primaryText || '联系我们'
const secondaryHref = props.secondaryHref || ''
const secondaryText = props.secondaryText || '下载白皮书'
const wechatHref = props.wechatHref || 'https://work.weixin.qq.com/'
const formHref = props.formHref || 'https://forms.example.com/solution-request'
</script>
<style scoped>
.contact-cta { margin: 2.5rem 0 1.5rem; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: linear-gradient(135deg,var(--vp-c-bg-soft),var(--vp-c-bg-alt)); padding: 1.6rem 1.8rem; }
.cta-body { display: flex; flex-direction: column; gap: .6rem; }
.cta-actions { display: flex; flex-wrap: wrap; gap: .75rem; }
.btn { text-decoration: none; padding: .55rem 1.1rem; border-radius: 6px; font-size: .75rem; font-weight: 500; border: 1px solid var(--vp-c-brand); }
.btn.primary { background: var(--vp-c-brand); color: var(--vp-c-bg); }
.btn.primary:hover { opacity: .85; }
.btn.ghost { background: transparent; color: var(--vp-c-brand); }
.btn.ghost:hover { background: var(--vp-c-brand-soft); }
.btn.wechat { background: #07C160; border-color: #07C160; color: #fff; }
.btn.wechat:hover { filter: brightness(.9); }
</style>
