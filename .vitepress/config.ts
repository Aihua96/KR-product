import { defineConfig } from 'vitepress'

export default defineConfig({
  // root locale title 用于浏览器标签的基准（但我们下面会手动固定）
  title: "瞰融信息",
  description: "瞰融信息 文档中心",
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  // Dead link whitelist (patterns). These links are allowed to be temporarily missing.
  ignoreDeadLinks: [
    // Placeholder English product deep links still under construction
    /^\/en\/products\/krvirt#core-features-placeholder$/,
    /^\/en\/products\/krvirt#reference-architecture-placeholder$/,
    /^\/en\/products\/krvirt#licensing-placeholder$/,
    /^\/en\/products\/krcmp#core-features-placeholder$/,
    /^\/en\/products\/krcmp#reference-architecture-placeholder$/,
    /^\/en\/products\/krcmp#licensing-placeholder$/,
    /^\/en\/products\/krdesktop#core-features-placeholder$/,
    /^\/en\/products\/krdesktop#reference-architecture-placeholder$/,
    /^\/en\/products\/krdesktop#licensing-placeholder$/,
    /^\/en\/products\/krstorage#core-features-placeholder$/,
    /^\/en\/products\/krstorage#reference-architecture-placeholder$/,
    /^\/en\/products\/krstorage#licensing-placeholder$/
  ],
  // 多语言配置：英文为占位
  locales: {
    root: { label: '简体中文', lang: 'zh-CN' },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        siteTitle: 'Kanrong Docs',
        nav: [
          { text: 'Home', link: '/en/', activeMatch: '^/en/$' },
          { text: 'Products', link: '/en/products/', activeMatch: '^/en/products/' },
          { text: 'Help Center', link: '/en/help/', activeMatch: '^/en/help/' },
          { text: 'Solutions (ZH)', link: '/solutions/' }
        ],
        sidebar: {
          '/en/products/': [
            {
              text: 'Overview', collapsed: false, items: [
                { text: 'Product Matrix', link: '/en/products/' }
              ]
            },
            {
              text: 'Product Intro', collapsed: false, items: [
                { text: 'KRVIRT Platform', link: '/en/products/krvirt' },
                { text: 'Proxmox VE', link: '/en/products/proxmox-ve' },
                { text: 'KRCMP Cloud Mgmt', link: '/en/products/krcmp' },
                { text: 'KRDesktop', link: '/en/products/krdesktop' },
                { text: 'KRStorage', link: '/en/products/krstorage' }
              ]
            }
          ]
        }
      }
    }
  },
  
  themeConfig: {
    siteTitle: '瞰融信息',
    logo: '/KRlogo.svg',
    nav: [
      { text: '首页', link: '/', activeMatch: '^/$' },
      // 新增『产品』一级导航，匹配各产品与概览页面
      { 
        text: '产品', 
        activeMatch: '^/(products|krvirt|krcmp|krdesktop|krstorage|proxmox-ve)/',
        items: [
          { text: '产品概览', link: '/products/' },
          { text: 'Proxmox VE 服务器虚拟化', link: '/products/proxmox-ve' },
          { text: 'KRVIRT 虚拟化平台', link: '/products/krvirt' },
          { text: 'KRCMP 云管理平台', link: '/products/krcmp' },
          { text: 'KRDesktop 云桌面', link: '/products/krdesktop' },
          { text: 'KRStorage 存储管理系统', link: '/products/krstorage' }
        ]
      },
      { text: '解决方案', link: '/solutions/', activeMatch: '^/solutions/' },
        { text: '合作伙伴', link: '/partners/', activeMatch: '^/partners/' },
      {
        text: '帮助中心',
        items: [
          { text: '总览', link: '/help/', activeMatch: '^/help/' },
          { text: 'KRVIRT', link: '/krvirt/', activeMatch: '^/krvirt/' },
          { text: 'KRCMP', link: '/krcmp/', activeMatch: '^/krcmp/' },
          { text: 'KRDesktop', link: '/krdesktop/', activeMatch: '^/krdesktop/' },
          { text: 'KRStorage', link: '/krstorage/', activeMatch: '^/krstorage/' }
        ]
      }
    ],
    
    sidebar: {
      '/solutions/': [
        {
          text: '解决方案概览',
          collapsed: false,
          items: [
            { text: '总览', link: '/solutions/' }
          ]
        },
        {
          text: '场景方案',
          collapsed: false,
          items: [
            { text: '统一云管理方案', link: '/solutions/unified-cloud' },
            { text: '国产信创适配方案', link: '/solutions/xinchuang-adaptation' },
            { text: '移动应急算力保障', link: '/solutions/mobile-emergency' },
            { text: 'NeRF 建模算力方案', link: '/solutions/nerf-compute' },
            { text: '多云智能算力调度', link: '/solutions/multi-cloud-scheduling' }
          ]
        }
      ],
      '/products/': [
        {
          text: '产品概览',
          collapsed: false,
          items: [
            { text: '总览', link: '/products/' }
          ]
        },
        {
          text: '产品介绍',
          collapsed: false,
          items: [
            { text: 'Proxmox VE 服务器虚拟化', link: '/products/proxmox-ve' },
            { text: 'KRVIRT 虚拟化平台', link: '/products/krvirt' },
            { text: 'KRCMP 云管理平台', link: '/products/krcmp' },
            { text: 'KRDesktop 云桌面', link: '/products/krdesktop' },
            { text: 'KRStorage 存储管理系统', link: '/products/krstorage' }
          ]
        }
      ],
      '/help/': [
        {
          text: '帮助中心',
          collapsed: false,
          items: [
            { text: '总览', link: '/help/' },
            { text: 'FAQ (占位)', link: '/help/faq' },
            { text: '更新日志 (占位)', link: '/help/recent-updates' }
          ]
        }
      ],
      '/krvirt/': [
        {
          text: 'KRVIRT 虚拟化平台',
          collapsed: false,
          items: [
            { text: '产品介绍', link: '/krvirt/' },
            { text: '快速开始', link: '/krvirt/quick-start' },
            { text: '部署指南', link: '/krvirt/installation' },
            { text: '配置说明', link: '/krvirt/configuration' },
            { text: 'API 参考', link: '/krvirt/api-reference' },
            { text: '故障排除', link: '/krvirt/troubleshooting' },
            { text: '术语表', link: '/krvirt/glossary' }
          ]
        },
        {
          text: '架构设计',
          collapsed: true,
          items: [
            { text: '（规划中）', link: '/krvirt/' }
          ]
        },
        {
          text: '运维指南',
          collapsed: true,
          items: [
            { text: '（规划中）', link: '/krvirt/' }
          ]
        },
        {
          text: '最佳实践',
            collapsed: true,
            items: [ { text: '（规划中）', link: '/krvirt/' } ]
        }
      ],
      '/krcmp/': [
        {
          text: 'KRCMP 云管理平台',
          collapsed: false,
          items: [
            { text: '产品介绍', link: '/krcmp/' },
            { text: '部署指南', link: '/krcmp/deployment' },
            { text: '快速上手', link: '/krcmp/quick-start' }
          ]
        },
        {
          text: '架构设计',
          collapsed: true,
          items: [ { text: '概述', link: '/krcmp/architecture/' } ]
        },
        {
          text: '运维指南',
          collapsed: true,
          items: [ { text: '常规运维', link: '/krcmp/operations/' } ]
        },
        {
          text: '最佳实践',
          collapsed: true,
          items: [ { text: '实践合集', link: '/krcmp/best-practices/' } ]
        }
      ],
      '/krdesktop/': [
        {
          text: 'KRDesktop 云桌面',
          collapsed: false,
          items: [
            { text: '产品介绍', link: '/krdesktop/' },
            { text: '部署指南', link: '/krdesktop/deployment' },
            { text: '快速上手', link: '/krdesktop/quick-start' }
          ]
        },
        {
          text: '架构设计',
          collapsed: true,
          items: [ { text: '组件结构', link: '/krdesktop/architecture/' } ]
        },
        {
          text: '运维指南',
          collapsed: true,
          items: [ { text: '运维指南', link: '/krdesktop/operations/' } ]
        },
        {
          text: '最佳实践',
          collapsed: true,
          items: [ { text: '最佳实践', link: '/krdesktop/best-practices/' } ]
        }
      ],
      '/krstorage/': [
        {
          text: 'KRStorage 存储管理系统',
          collapsed: false,
          items: [
            { text: '产品介绍', link: '/krstorage/' },
            { text: '部署指南', link: '/krstorage/deployment' },
            { text: '快速上手', link: '/krstorage/quick-start' }
          ]
        },
        {
          text: '架构设计',
          collapsed: true,
          items: [ { text: '架构设计', link: '/krstorage/architecture/' } ]
        },
        {
          text: '运维指南',
          collapsed: true,
          items: [ { text: '运维指南', link: '/krstorage/operations/' } ]
        },
        {
          text: '最佳实践',
          collapsed: true,
          items: [ { text: '最佳实践', link: '/krstorage/best-practices/' } ]
        }
      ]
    },
    
    search: { provider: 'local' },
    outline: { level: [2,3], label: '页面导航' },
    socialLinks: [ { icon: 'github', link: 'https://github.com' } ],
    lastUpdated: { text: '最后更新' },
    editLink: { pattern: 'https://github.com/my-org/kr-docs/edit/main/:path', text: '在 GitHub 上编辑此页' }
  },
  
  head: [
    ['link', { rel: 'icon', href: '/KRlogo.svg' }],
    // 固定页面 <title> 内容: 通过一个 script 在客户端强制覆盖，防止路由切换时 VitePress 改写
    ['script', {}, `(() => {
      var FIXED_TITLE = '瞰融信息-一站式算力解决方案提供商';
      function apply(){ if (typeof document!=='undefined' && document.title !== FIXED_TITLE) document.title = FIXED_TITLE; }
      if (typeof document!=='undefined') document.addEventListener('DOMContentLoaded', apply);
      ['pushState','replaceState'].forEach(function(k){
        try {
          var orig = history[k];
          history[k] = function(){ var r = orig.apply(this, arguments); setTimeout(apply,0); return r; };
        } catch(e) { /* ignore */ }
      });
      if (typeof window!=='undefined') window.addEventListener('popstate', function(){ setTimeout(apply,0); });
      apply();
    })();`],
    ['meta', { name: 'description', content: 'KRVIRT 虚拟化与帮助中心文档' }],
    ['meta', { property: 'og:title', content: 'KRVIRT 文档中心' }],
    ['meta', { property: 'og:description', content: '服务器虚拟化、安装、配置、故障排除与 API 参考文档' }],
    ['meta', { property: 'og:type', content: 'website' }]
  ]
})