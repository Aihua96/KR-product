export interface FooterColumnLink { label: string; href: string; external?: boolean }
export interface FooterColumn { title: string; links: FooterColumnLink[] }
export interface SocialLink { name: string; icon: string; href: string }

export interface FooterMeta {
  icp?: string
  beian?: string
  icpLink?: string
  beianLink?: string
  copyrightOwner: string
  extra?: string
}

export interface FooterConfig {
  columns: FooterColumn[]
  socials: SocialLink[]
  meta: FooterMeta
  contact?: {
    phone?: string
    address?: string
    // future: email, support link, etc.
  }
  qrCodes?: Array<{ label: string; img: string; alt?: string; short?: string; icon?: string }>
}

export const footerConfig: FooterConfig = {
  columns: [
    {
      title: '产品',
      links: [
        { label: 'KRVIRT 虚拟化', href: '/products/krvirt' },
        { label: 'KRCMP 云管理', href: '/products/krcmp' },
        { label: 'KRDesktop 云桌面', href: '/products/krdesktop' },
        { label: 'KRStorage 存储', href: '/products/krstorage' },
        { label: '更多产品', href: '/products/' }
      ]
    },
    {
      title: '解决方案',
      links: [
        { label: '智能算力平台', href: '/solutions/intelligent-compute-platform' },
        { label: '统一云管理', href: '/solutions/unified-cloud' },
        { label: '国产信创适配', href: '/solutions/xinchuang-adaptation' },
        { label: '移动应急算力', href: '/solutions/mobile-emergency' },
        { label: 'NeRF 建模算力', href: '/solutions/nerf-compute' },
        { label: '多云智能调度', href: '/solutions/multi-cloud-scheduling' },
        { label: '更多解决方案', href: '/solutions/' }
      ]
    },
    {
      title: '帮助中心',
      links: [
        { label: '总览', href: '/help/' },
        { label: '常见问题', href: '/help/faq' },
        { label: 'KRVIRT', href: '/krvirt/' },
        { label: 'KRCMP', href: '/krcmp/' },
        { label: 'KRDesktop', href: '/krdesktop/' },
        { label: 'KRStorage', href: '/krstorage/' }
      ]
    },
    {
      title: '公司',
      links: [
        { label: '加入我们(占位)', href: '/products/krvirt#licensing-placeholder' },
        { label: '更新日志', href: '/help/recent-updates' }
      ]
    }
  ],
  socials: [
    { name: 'GitHub', icon: 'github', href: 'https://github.com' }
    // 可追加 wechat/bilibili/zhihu 等
  ],
  meta: {
    icp: '沪ICP备 XXXXXX 号',
    beian: '公网安备 XXXXXXXXXXXXX 号',
    icpLink: 'https://beian.miit.gov.cn/',
    beianLink: 'https://www.beian.gov.cn/portal/registerSystemInfo',
    copyrightOwner: '瞰融信息',
    extra: '一站式算力解决方案提供商'
  },
  contact: {
    phone: '+86-021-61659316',
    // 企业地址：总部 + 办事处概览（用户 2025-09 提供最新版）
    address: '上海总部：上海市浦东新区浦三路3058号长青企业广场295-297室\n大区办事处：华北办事处、 西北办事处、 西南办事处、 新疆办事处'
  },
  qrCodes: [
    { label: '微信公众号', short: '微', icon: 'wechat', img: '/qrcode-wechat-official.png', alt: '微信公众号二维码' },
    { label: '微信视频号', short: '视', icon: 'wechat-video', img: '/qrcode-wechat-video.png', alt: '微信视频号二维码' },
    { label: 'B站号', short: 'B', icon: 'bilibili', img: '/qrcode-bilibili.png', alt: 'B站二维码' },
    { label: '抖音号', short: '抖', icon: 'douyin', img: '/qrcode-douyin.png', alt: '抖音二维码' }
  ]
}

export function resolveIcon(name: string) {
  if (name === 'github') {
    return `<svg viewBox='0 0 16 16' width='18' height='18' fill='currentColor' aria-hidden='true'><path d='M8 .2a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.62 7.62 0 0 1 2-.27 7.6 7.6 0 0 1 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 .2Z'/></svg>`
  }
  return ''
}