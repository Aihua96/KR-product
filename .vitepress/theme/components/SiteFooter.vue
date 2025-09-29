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
          <div class="kr-mini-contact">
            <div class="kr-mini-line" v-if="cfg.contact?.address">公司地址：<span class="kr-text">{{ cfg.contact.address }}</span></div>
            <div class="kr-mini-line" v-if="cfg.contact?.phone">服务热线：<a :href="'tel:' + rawPhone(cfg.contact.phone)" class="kr-contact-link">{{ cfg.contact.phone }}</a></div>
          </div>
          <div class="kr-social-icons">
            <div class="kr-social-icon" @mouseenter="showQR('wechat')" @mouseleave="hideQR">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M8.5 6.5c-3.3 0-6 2.1-6 4.7 0 1.5.9 2.8 2.2 3.6l-.6 1.8 2.1-1.1c.4.1.9.1 1.3.1 3.3 0 6-2.1 6-4.7s-2.7-4.7-6-4.7zM16 1c-4.4 0-8 2.8-8 6.2 0 2 1.2 3.8 3.1 4.9l-.8 2.3 2.8-1.4c.6.1 1.2.2 1.9.2 4.4 0 8-2.8 8-6.2S20.4 1 16 1z"/>
              </svg>
              <div class="kr-qr-tooltip" v-show="activeQR === 'wechat'">
                <img :src="qrImages.wechat" alt="微信公众号二维码" />
                <span>微信公众号</span>
              </div>
            </div>
            <div class="kr-social-icon" @mouseenter="showQR('douyin')" @mouseleave="hideQR">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12.5 3.5c-.3 0-.5.2-.5.5v8.2l-1.4-1.4c-.2-.2-.5-.2-.7 0s-.2.5 0 .7l2.1 2.1c.2.2.5.2.7 0l2.1-2.1c.2-.2.2-.5 0-.7s-.5-.2-.7 0L13 12.2V4c0-.3-.2-.5-.5-.5zm6.8 4.8c-.9-.9-2.1-1.4-3.3-1.4-.3 0-.5.2-.5.5s.2.5.5.5c.9 0 1.8.4 2.5 1.1.7.7 1.1 1.6 1.1 2.5s-.4 1.8-1.1 2.5-1.6 1.1-2.5 1.1c-.3 0-.5.2-.5.5s.2.5.5.5c1.2 0 2.4-.5 3.3-1.4 1.8-1.8 1.8-4.7 0-6.5z"/>
              </svg>
              <div class="kr-qr-tooltip" v-show="activeQR === 'douyin'">
                <img :src="qrImages.douyin" alt="抖音二维码" />
                <span>抖音</span>
              </div>
            </div>
            <div class="kr-social-icon" @mouseenter="showQR('bilibili')" @mouseleave="hideQR">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.51.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .356-.124.657-.373.906l-1.174 1.12zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.789 1.894v7.52c.02.764.283 1.395.789 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.789-1.893v-7.52c-.02-.765-.283-1.396-.789-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
              </svg>
              <div class="kr-qr-tooltip" v-show="activeQR === 'bilibili'">
                <img :src="qrImages.bilibili" alt="哔哩哔哩二维码" />
                <span>哔哩哔哩</span>
              </div>
            </div>
            <div class="kr-social-icon" @mouseenter="showQR('wechat-video')" @mouseleave="hideQR">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M3.2 1.2L21.8 1.2c1.1 0 2 .9 2 2v13.6c0 1.1-.9 2-2 2H14l-2 4-2-4H3.2c-1.1 0-2-.9-2-2V3.2c0-1.1.9-2 2-2zm8.8 6c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm-6 0c-.8 0-1.5.7-1.5 1.5S5.2 10.2 6 10.2s1.5-.7 1.5-1.5S6.8 7.2 6 7.2zm12 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z"/>
              </svg>
              <div class="kr-qr-tooltip" v-show="activeQR === 'wechat-video'">
                <img :src="qrImages['wechat-video']" alt="微信视频号二维码" />
                <span>微信视频号</span>
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
import { ref } from 'vue'
import { footerConfig } from '../footer.config'
import wechatQR from '../footerImg/qrcode-wechat-official.png'
import douyinQR from '../footerImg/qrcode-douyin.png'
import bilibiliQR from '../footerImg/qrcode-bilibili.png'
import wechatVideoQR from '../footerImg/qrcode-wechat-video.png'

// 2025-09: 统一所有页面 footer，无需 frontmatter / showExtra 逻辑
const year = new Date().getFullYear()
const cfg = footerConfig

const activeQR = ref('')

const qrImages = {
  wechat: wechatQR,
  douyin: douyinQR,
  bilibili: bilibiliQR,
  'wechat-video': wechatVideoQR
}

function rawPhone(p: string){
  return (p || '').replace(/[^+\d]/g,'')
}

function showQR(type: string) {
  activeQR.value = type
}

function hideQR() {
  activeQR.value = ''
}




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

/* 联系我们列 */
.kr-footer-contact-col { min-width:220px; }
.kr-mini-contact { font-size:13px; line-height:1.5; color:var(--kr-footer-meta,#8c939c); margin-bottom:12px; display:flex; flex-direction:column; gap:4px; }
.kr-mini-line .kr-text { color:var(--kr-footer-fg,#d2d5db); }

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
