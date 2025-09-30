<template>
  <section class="pricing-cta">
    <div class="cta-inner">
      <div class="cta-text">
        <h2 class="cta-title">需要正式报价或定制方案？</h2>
        <p class="cta-sub">提交业务场景 / 资源规模 / 期望上线时间，我们将在 <strong>1 个工作日</strong> 内与您联系并提供初步建议。</p>
        <div class="cta-actions">
          <a class="cta-btn primary" target="_blank" rel="noopener" href="https://alidocs.dingtalk.com/notable/share/form/v014jKqmoRM6bJvlw19_dv19yqvsgs3oebp3pcjys_qn4n6l9332n2ko368azus">获取试用</a>
          <a class="cta-btn outline" href="mailto:market@kanrong.xyz?subject=报价咨询&body=请填写: 场景/规模/期望时间">邮件咨询</a>
          <a class="cta-btn ghost" href="/about/company">了解公司</a>
        </div>
      </div>
      <div class="cta-extra">
        <ul>
          <li>支持按阶段 PoC / 试用</li>
          <li>可选企业级支持等级 (标准 / 加急 / 7x24)</li>
          <li>灵活的多 GPU / 多集群部署模式</li>
        </ul>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
// 试用申请改为直接跳转钉钉表单，无需弹窗逻辑
</script>
<style scoped>
.pricing-cta { margin: 3.2rem 0 0; padding: 2.4rem 0 2.8rem; position:relative; }
.pricing-cta::before { content:""; position:absolute; inset:0; background:linear-gradient(135deg,#1e293b,#0f172a); border-radius:18px; opacity:.95; }
.cta-inner { position:relative; z-index:1; display:flex; flex-wrap:wrap; gap:2.8rem; padding:0 2.2rem; }
.cta-text { flex:1 1 420px; min-width:300px; }
.cta-extra { flex:1 1 280px; min-width:240px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); padding:1.2rem 1.4rem; border-radius:14px; color:#cfd8e3; font-size:.82rem; line-height:1.55; backdrop-filter: blur(4px); }
.cta-extra ul { list-style:disc; margin:.2rem 0 0 1.1rem; padding:0; }
.cta-title { margin:0 0 .9rem; font-size:1.55rem; line-height:1.2; background:linear-gradient(90deg,#fff,#dbeafe); -webkit-background-clip:text; background-clip:text; color:transparent; }
.cta-sub { margin:.2rem 0 1.2rem; font-size:.9rem; color:#e2e8f0; max-width:50ch; }
.cta-actions { display:flex; flex-wrap:wrap; gap:.9rem; }
.cta-btn { --btn-bg:#334155; --btn-color:#fff; --btn-border:rgba(255,255,255,.2); text-decoration:none; display:inline-flex; align-items:center; gap:.4rem; padding:.65rem 1.05rem; font-size:.78rem; font-weight:600; border-radius:8px; background:var(--btn-bg); color:var(--btn-color); border:1px solid var(--btn-border); line-height:1; letter-spacing:.3px; transition:.18s; cursor:pointer; }
.cta-btn.primary { --btn-bg:var(--vp-c-brand); --btn-border:var(--vp-c-brand); }
.cta-btn.outline { --btn-bg:transparent; --btn-color:var(--vp-c-brand); --btn-border:var(--vp-c-brand); }
.cta-btn.ghost { --btn-bg:rgba(255,255,255,.08); --btn-border:rgba(255,255,255,.15); }
.cta-btn:hover { filter:brightness(.93); transform:translateY(-1px); box-shadow:0 4px 16px -4px rgba(0,0,0,.5); }
@media (max-width: 860px){
  .cta-inner { flex-direction:column; padding:0 1.4rem; }
  .cta-extra { order:-1; }
  .cta-title { font-size:1.4rem; }
}
:root[data-theme='light'] .pricing-cta::before { background:linear-gradient(135deg,#1e2530,#162133); }
</style>
