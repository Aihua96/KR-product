import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "瞰融信息",
  description: "瞰融信息 文档中心",
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  
  themeConfig: {
    siteTitle: '瞰融信息',
    
    nav: [
      { text: '帮助中心', link: '/krvirt/' }
    ],
    
    sidebar: {
      '/': [
        {
          text: 'KRVIRT 虚拟化平台',
          collapsed: false,
          items: [
            { text: 'KRVIRT 产品介绍', link: '/krvirt/' },
            { text: '安装指南', link: '/krvirt/installation' },
            { text: '配置说明', link: '/krvirt/configuration' },
            { text: '故障排除', link: '/krvirt/troubleshooting' },
            { text: '快速开始', link: '/krvirt/quick-start' },
            { text: 'API 参考', link: '/krvirt/api-reference' },
            { text: '术语表', link: '/krvirt/glossary' }
          ]
        }
      ]
    },
    
    search: {
      provider: 'local'
    },
    
    outline: {
      level: [2, 3],
      label: '页面导航'
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],
    lastUpdated: {
      text: '最后更新'
    },
    editLink: {
      pattern: 'https://github.com/my-org/kr-docs/edit/main/:path',
      text: '在 GitHub 上编辑此页'
    }
  },
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'description', content: 'KRVIRT 虚拟化与帮助中心文档' }],
    ['meta', { property: 'og:title', content: 'KRVIRT 文档中心' }],
    ['meta', { property: 'og:description', content: '服务器虚拟化、安装、配置、故障排除与 API 参考文档' }],
    ['meta', { property: 'og:type', content: 'website' }]
  ]
})