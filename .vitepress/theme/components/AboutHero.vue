<template>
  <section class="about-hero" :class="variantClass">
    <div class="hero-bg" aria-hidden="true" />
    <div class="hero-inner">
      <div class="hero-text">
        <h1 class="hero-title">{{ title }}</h1>
        <p class="hero-sub" v-if="subtitle">{{ subtitle }}</p>
        <slot />
        <div class="hero-actions" v-if="$slots.actions">
          <slot name="actions" />
        </div>
      </div>
      <div v-if="image" class="hero-media">
        <img :src="image" :alt="imageAlt || 'Hero visual'" />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  image?: string
  imageAlt?: string
  variant?: 'brand' | 'soft' | 'gradient'
}
const props = withDefaults(defineProps<Props>(), {
  title: '关于我们',
  subtitle: '一站式算力与多云基础设施平台',
  variant: 'gradient'
})
const variantClass = `variant-${props.variant}`
</script>
<style scoped>
.about-hero { position: relative; width:100%; margin:0 0 2.2rem; padding: 3.2rem 0 3rem; }
.about-hero .hero-bg { position:absolute; inset:0; background: var(--ah-bg, linear-gradient(135deg,#0f172a,#1e293b)); opacity:.9; }
.about-hero.variant-soft .hero-bg { background: var(--ah-bg-soft, var(--vp-c-bg-soft)); opacity:1; }
.about-hero.variant-brand .hero-bg { background: linear-gradient(135deg,var(--vp-c-brand),#0f172a); }
.about-hero.variant-gradient .hero-bg { background: radial-gradient(circle at 20% 30%, var(--vp-c-brand) 0%, #0f172a 55%, #020617 100%); }
.about-hero .hero-inner { position:relative; z-index:1; max-width: 1180px; margin:0 auto; padding:0 2.0rem; display:flex; gap:3rem; align-items:center; }
.about-hero .hero-text { flex: 1 1 60%; }
.about-hero .hero-title { margin:0 0 .9rem; font-size:2.4rem; line-height:1.1; letter-spacing:.5px; background: linear-gradient(90deg,#fff,#dbeafe); -webkit-background-clip:text; background-clip:text; color:transparent; }
.about-hero .hero-sub { margin:0 0 1.4rem; font-size:1.05rem; color: #e2e8f0; max-width:46ch; line-height:1.5; }
.about-hero .hero-media { flex:1 1 40%; display:flex; justify-content:center; }
.about-hero .hero-media img { max-width: 420px; width:100%; border-radius: 12px; box-shadow: 0 6px 22px -6px rgba(0,0,0,.45), 0 4px 12px -2px rgba(0,0,0,.35); }
.hero-actions { display:flex; flex-wrap:wrap; gap:.9rem; margin-top: .3rem; }
.hero-btn { --btn-bg: var(--vp-c-brand); --btn-color: #fff; --btn-border: var(--vp-c-brand); text-decoration:none; display:inline-flex; align-items:center; gap:.4rem; padding:.7rem 1.15rem; font-size:.85rem; font-weight:600; border-radius:8px; background:var(--btn-bg); color:var(--btn-color); border:1px solid var(--btn-border); line-height:1; box-shadow:0 2px 6px -2px rgba(0,0,0,.4),0 4px 14px -4px rgba(0,0,0,.35); transition:.18s; }
.hero-btn:hover { filter:brightness(.92); transform:translateY(-1px); box-shadow:0 4px 14px -4px rgba(0,0,0,.5),0 6px 18px -6px rgba(0,0,0,.4); }
.hero-btn.secondary { --btn-bg: rgba(255,255,255,.1); --btn-color:#eef2ff; --btn-border:rgba(255,255,255,.35); backdrop-filter: blur(3px); }
.variant-soft .hero-btn.secondary { --btn-color: var(--vp-c-text-1); }
.hero-btn.outline { --btn-bg: transparent; --btn-color: var(--vp-c-brand); --btn-border: var(--vp-c-brand); box-shadow:none; }
.hero-btn.outline:hover { background: var(--vp-c-brand-soft); }

@media (max-width: 960px) { 
  .about-hero { padding:2.6rem 0 2.2rem; }
  .about-hero .hero-inner { flex-direction:column; text-align:center; gap:2.2rem; }
  .about-hero .hero-text { flex:1; }
  .about-hero .hero-title { font-size:2.15rem; }
  .about-hero .hero-sub { margin-left:auto; margin-right:auto; }
  .hero-actions { justify-content:center; }
}

@media (max-width: 560px) { 
  .about-hero { padding:2.2rem 0 1.8rem; }
  .about-hero .hero-title { font-size:1.9rem; }
  .about-hero .hero-inner { padding:0 1.2rem; }
}

.dark .about-hero.variant-soft .hero-bg { background: var(--vp-c-bg-alt); }
/* Readability adjustments */
/* Soft variant (light mode) needed higher contrast: remove light gradient text */
.about-hero.variant-soft .hero-title { background:none; -webkit-background-clip:initial; background-clip:initial; color: var(--vp-c-text-1); text-shadow:0 1px 2px rgba(0,0,0,.06); }
.about-hero.variant-soft .hero-sub { color: var(--vp-c-text-2); }
/* Restore bright gradient for dark mode soft variant */
.dark .about-hero.variant-soft .hero-title { background: linear-gradient(90deg,#fff,#dbeafe); -webkit-background-clip:text; background-clip:text; color:transparent; text-shadow:0 2px 10px rgba(0,0,0,.55); }
.dark .about-hero.variant-soft .hero-sub { color:#e2e8f0; }
/* Add subtle shadow for gradient & brand variants to improve legibility on vivid backgrounds */
.about-hero.variant-gradient .hero-title, .about-hero.variant-brand .hero-title { text-shadow:0 2px 12px rgba(0,0,0,.45); }
</style>