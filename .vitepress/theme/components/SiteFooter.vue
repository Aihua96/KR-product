<template>
  <footer class="kr-site-footer" data-footer-check="1">
    <div class="kr-footer-inner">
      <div class="kr-footer-columns">
        <div v-for="col in cfg.columns" :key="col.title" class="kr-footer-col">
          <h4>{{ col.title }}</h4>
          <ul>
            <li v-for="l in col.links" :key="l.href">
              <a :href="l.href" :target="l.external ? '_blank' : undefined" :rel="l.external ? 'noopener' : undefined">{{ l.label }}</a>
            </li>
          </ul>
        </div>
        <div class="kr-footer-col kr-footer-contact-col">
          <h4 style="z-index: 10;">联系我们</h4>
          <div class="kr-mini-contact" v-if="cfg.contact">
            <ul class="kr-contact-list">
              <li v-if="cfg.contact.address">
                <span class="kr-contact-label">公司地址：</span>
                <span class="kr-contact-value" v-html="formattedAddress"></span>
              </li>
              <li v-if="cfg.contact.phone">
                <span class="kr-contact-label">服务热线：</span>
                <a :href="'tel:' + rawPhone(cfg.contact.phone)" class="kr-contact-value kr-contact-link">{{ cfg.contact.phone }}</a>
              </li>
              <li v-if="cfg.contact.email">
                <span class="kr-contact-label">邮箱：</span>
                <a :href="'mailto:' + cfg.contact.email" class="kr-contact-value kr-contact-link">{{ cfg.contact.email }}</a>
              </li>
            </ul>
          </div>
          <div class="kr-social-icons">
            <!-- 微信公众号 -->
            <div class="kr-social-icon" @mouseenter="showQR('wechat')" @mouseleave="hideQR">
              <img :src="socialSrc.wechat" alt="微信公众号" class="kr-social-img" @error="onIconError('wechat')" />
              <div class="kr-qr-tooltip" v-show="activeQR === 'wechat'">
                <img :src="qrImages.wechat" alt="微信公众号二维码" />
                <span>微信公众号</span>
              </div>
            </div>
            <!-- 微信视频号 -->
            <div class="kr-social-icon" @mouseenter="showQR('wechat-video')" @mouseleave="hideQR">
              <img :src="socialSrc.wechatVideo" alt="微信视频号" class="kr-social-img" @error="onIconError('wechatVideo')" />
              <div class="kr-qr-tooltip" v-show="activeQR === 'wechat-video'">
                <img :src="qrImages['wechat-video']" alt="微信视频号二维码" />
                <span>微信视频号</span>
              </div>
            </div>
            <!-- B 站 -->
            <div class="kr-social-icon" @mouseenter="showQR('bilibili')" @mouseleave="hideQR">
              <img :src="socialSrc.bilibili" alt="哔哩哔哩" class="kr-social-img" @error="onIconError('bilibili')" />
              <div class="kr-qr-tooltip" v-show="activeQR === 'bilibili'">
                <img :src="qrImages.bilibili" alt="哔哔哩哔二维码" />
                <span>哔哩哔哩</span>
              </div>
            </div>
            <!-- 抖音 -->
            <div class="kr-social-icon" @mouseenter="showQR('douyin')" @mouseleave="hideQR">
              <img :src="socialSrc.douyin" alt="抖音" class="kr-social-img" @error="onIconError('douyin')" />
              <div class="kr-qr-tooltip" v-show="activeQR === 'douyin'">
                <img :src="qrImages.douyin" alt="抖音二维码" />
                <span>抖音</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  <!-- 已废弃的扩展位（保留注释以说明设计演进） -->
      <div class="kr-footer-meta">
        <div class="kr-footer-brand">
          <img src="/KRlogo.svg" alt="KanRong Logo" class="kr-footer-logo" />
          <span class="kr-brand-name">{{ cfg.meta.copyrightOwner }}</span>
        </div>
        <div class="kr-footer-copy">
          © {{ year }} {{ cfg.meta.copyrightOwner }} {{ cfg.meta.extra }}
          <template v-if="cfg.meta.icp || cfg.meta.beian">
            <span
              v-if="cfg.meta.icp"
              class="kr-icp"
            >
              <span class="kr-sep"> | </span>
              <a :href="cfg.meta.icpLink || 'https://beian.miit.gov.cn/'" target="_blank" rel="noopener">{{ cfg.meta.icp }}</a>
            </span>
            <span
              v-if="cfg.meta.beian"
              class="kr-beian"
            >
              <span class="kr-sep" v-if="!cfg.meta.icp"> | </span>
              <a :href="cfg.meta.beianLink || 'https://www.beian.gov.cn/portal/registerSystemInfo'" target="_blank" rel="noopener">{{ cfg.meta.beian }}</a>
            </span>
          </template>
        </div>
      </div>
      <!-- 友情链接区域已按需求移除 -->
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { footerConfig } from '../footer.config'

// 2025-09: 统一所有页面 footer，无需 frontmatter / showExtra 逻辑
const year = new Date().getFullYear()
const cfg = footerConfig

const activeQR = ref('')

// 说明：为避免对 PNG 资源的显式打包依赖及 TS 模块声明告警，统一改用 /public 下静态路径
// 若后续需要做按需懒加载或 hash 处理，可改造为动态 import()
const qrImages = {
  wechat: '/qrcode-wechat-official.png',
  douyin: '/qrcode-douyin.png',
  bilibili: '/qrcode-bilibili.png',
  'wechat-video': '/qrcode-wechat-video.png'
}

const socialSrc = reactive({
  wechat: '/social-wechat.png',
  douyin: '/social-douyin.png',
  bilibili: '/social-bilibili.png',
  wechatVideo: '/social-wechat-video.png'
})

function rawPhone(p: string){
  return (p || '').replace(/[^+\d]/g,'')
}

function showQR(type: string) {
  activeQR.value = type
}

function hideQR() {
  activeQR.value = ''
}

function onIconError(key: 'wechat' | 'douyin' | 'bilibili' | 'wechatVideo'){
  socialSrc[key] = socialSrc[key]
}

// 将地址中的 \n 转换为 <br>
const formattedAddress = computed(() => (cfg.contact?.address || '').replace(/\n/g, '<br>'))
</script>

<style scoped>
 .kr-site-footer {
  margin-top: 48px;
  background: var(--kr-footer-bg, #0f1115);
  color: var(--kr-footer-fg, #d2d5db);
  font-size: 14px;
  line-height: 1.6;
  border-top: 1px solid var(--kr-footer-border,#1c2128);
  min-height: 120px;
 }
.kr-footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 32px 32px;
}
/* 旧版大尺寸二维码与多列联系模块样式已移除（如需恢复可回溯 git 历史） */

.kr-contact-link { color: var(--kr-footer-link,#9aa0aa); text-decoration:none; }
.kr-contact-link:hover { color: var(--kr-footer-link-hover,#fff); }

.kr-footer-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(140px,1fr));
  gap: 32px 40px;
}
 .kr-footer-col h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--kr-footer-title,#ffffff);
  margin: 0 0 12px;
 }
.kr-footer-col ul { list-style: none; padding: 0; margin: 0; }
.kr-footer-col li { margin: 4px 0; }
 .kr-footer-col a {
  color: var(--kr-footer-link,#9aa0aa);
  text-decoration: none;
  transition: color .15s;
 }
 .kr-footer-col a:hover { color: var(--kr-footer-link-hover,#fff); }
 .kr-footer-meta {
   margin-top: 40px;
   padding-top: 24px;
   border-top: 1px solid #1c2128;
   display: flex;
   flex-wrap: wrap;
   align-items: center;
   justify-content: space-between;
   gap: 16px;
 }
.kr-footer-brand { display: flex; align-items: center; gap: 10px; }
.kr-footer-logo { height: 32px; width: auto; }
 .kr-brand-name { font-size: 16px; font-weight: 600; color: var(--kr-footer-title,#fff); }
 .kr-footer-copy { color: var(--kr-footer-meta,#6f7782); font-size:13px; }
 .kr-footer-copy a { color: var(--kr-footer-link,#9aa0aa); text-decoration:none; }
 .kr-footer-copy a:hover { color: var(--kr-footer-link-hover,#fff); }
 .kr-social-list { list-style:none; padding:0; margin:0; display:flex; gap:10px; }
 .kr-social-link { display:inline-flex; width:32px; height:32px; align-items:center; justify-content:center; color:#9aa0aa; border-radius:6px; background:#1a2026; transition:background .15s,color .15s; }
 .kr-social-link:hover { background:#2a3139; color:#fff; }

/* 联系我们列（与普通列排版统一：列表行 14px，次级描述色，间距微调） */
.kr-footer-contact-col { min-width:220px; }
/* 列表化后的联系我们与其它列统一：ul/li 样式 */
.kr-mini-contact { margin-bottom:12px; }
.kr-contact-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px; font-size:14px; line-height:1.6; }
.kr-contact-list li { color:var(--kr-footer-link,#9aa0aa); line-height:1.6; }
.kr-contact-value br { line-height:1.0; content:""; } /* 避免 <br> 造成行距塌陷或过大 */
.kr-contact-value { line-height:1.55; display:inline-block; }
.kr-contact-label { color:var(--kr-footer-meta,#8c939c); margin-right:4px; }
.kr-contact-value { color:var(--kr-footer-link,#9aa0aa); }
.kr-contact-link { text-decoration:none; }
.kr-contact-link:hover { color:var(--kr-footer-link-hover,#fff); }
/* 地址分行布局 */
.kr-mini-line { display:flex; flex-direction:column; }
.kr-address-label { font-weight:600; color:var(--kr-footer-fg,#d2d5db); margin-bottom:2px; }
.kr-address-lines { white-space:normal; line-height:1.5; }

/* 社交媒体图标 */
.kr-social-icons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.kr-social-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--kr-footer-link, #9aa0aa);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.kr-social-icon:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--kr-footer-link-hover, #fff);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.kr-social-img { width:24px; height:24px; object-fit:contain; display:block; }

.kr-qr-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  background: #2a2e35;
  border: 1px solid #3c4149;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 10009;
  min-width: 120px;
  text-align: center;
}

.kr-qr-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #2a2e35;
}

.kr-qr-tooltip img {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  display: block;
  margin: 0 auto 8px;
}

.kr-qr-tooltip span {
  display: block;
  font-size: 12px;
  color: #e9ecef;
  font-weight: 500;
}




 :root[data-theme='light'] .kr-site-footer {
  --kr-footer-bg: #1e2228;
  --kr-footer-border: #262c33;
  --kr-footer-fg: #d8dce2;
  --kr-footer-link: #b0b6be;
  --kr-footer-link-hover: #ffffff;
  --kr-footer-title: #ffffff;
  --kr-footer-meta: #9ba1a8;
 }

 @media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) .kr-site-footer {
    --kr-footer-bg: #1e2228;
    --kr-footer-border: #262c33;
    --kr-footer-fg: #d8dce2;
    --kr-footer-link: #b0b6be;
    --kr-footer-link-hover: #ffffff;
    --kr-footer-title: #ffffff;
    --kr-footer-meta: #9ba1a8;
  }
 }

@media (max-width: 640px) {
  .kr-footer-inner { padding: 40px 20px 28px; }
  .kr-footer-columns { gap: 24px 20px; }
}
</style>
