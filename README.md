# KRVIRT / 文档站（精简版）

基于 VitePress v2.0.0-alpha.12 的极简文档站，目前仅保留核心页面与最小必要结构，方便后续逐步扩展。

## 🚀 项目特性

- ✨ **现代化设计**: 基于 VitePress 2.0 最新技术栈
- 🌙 **深色主题**: 默认深色主题，支持浅色/深色切换  
- 🔍 **强大搜索**: 本地搜索功能，支持快捷键 ⌘K
- 📱 **响应式布局**: 完美适配桌面端和移动端
- 🎯 **中文优化**: 完整的中文语言支持
- ⚡ **高性能**: 静态站点生成，极快的加载速度
- 🛡️ **类型安全**: 完整的 TypeScript 支持

## 📁 当前目录结构（真实）

```
KR-docs/
├── .vitepress/        # 配置目录（config.ts）
├── index.md           # 首页（home layout）
├── krvirt/            # KRVIRT 文档（产品介绍 + 子页面）
│   ├── index.md
│   ├── installation.md
│   ├── configuration.md
│   ├── troubleshooting.md
│   ├── quick-start.md
│   ├── api-reference.md
├── public/            # 静态资源（favicon 等）
├── package.json
└── README.md
```

> 注：历史规划中的 `direct-mode/`, `central-mode/`, `client/`, `protocols/`, `changelog/` 等目录已移除，README 同步更新。

## 🛠️ 技术栈

- **框架**: VitePress v2.0.0-alpha.12
- **构建工具**: Vite v7.1.7  
- **语言**: TypeScript
- **字体**: Inter + Roboto
- **主题**: 自定义深色主题
- **搜索**: 本地搜索引擎

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发服务器

```bash
npm run dev
```

访问 http://localhost:5173/ 查看开发环境。

### 构建生产版本

```bash
npm run build
```

生成的静态文件位于 `.vitepress/dist/` 目录。

### 预览构建结果

```bash
npm run preview
```

## 📚 现有页面

| 路径 | 说明 | 状态 |
|------|------|------|
| `/` | 首页（Hero + Features） | ✅ |
| `/krvirt/` | KRVIRT 产品介绍 | ✅ |
| `/krvirt/installation` | 安装指南 | ✅(占位) |
| `/krvirt/configuration` | 配置说明 | ✅(占位) |
| `/krvirt/troubleshooting` | 故障排除 | ✅(占位) |
| `/krvirt/quick-start` | 快速开始 | ✅(占位) |
| `/krvirt/api-reference` | API 参考 | ✅(占位) |
| `/krvirt/glossary` | 术语表 | ✅(初稿) |
| `/404` | 自定义 404 未找到页面 | ✅ |

> 计划：按需新增安装、配置、运维、API、故障排查等章节。

## 🧪 术语表自动生成

在文档正文中插入自定义标记：

`<Term name="KRVIRT" desc="服务器虚拟化平台" />`

然后运行：

```bash
npm run generate:glossary
```

脚本会：

1. 扫描所有 `.md` 文件（排除英文与 `glossary.md` 本身）
2. 抽取 `<Term />` 标记的 `name` 与 `desc`
3. 按首字母（或“其他”）分组
4. 生成字母分节 + 表格，写入 `<!-- AUTO-GLOSSARY:BEGIN -->` 与 `<!-- AUTO-GLOSSARY:END -->` 之间
5. “最后更新”列来自术语首次出现文件的最近一次 Git commit 时间（需已提交）

> 若未提交 Git，列会显示 `-`。提交后重新运行即可刷新。

英文版本 `glossary.en.md` 目前为占位，后续可扩展脚本支持多语言。

### CLI 用法

```bash
# 全量（默认 all）
npm run generate:glossary

# 仅中文
npm run generate:glossary:zh

# 仅英文
npm run generate:glossary:en

# Debug 查看解析到的术语
node scripts/generate-glossary.mjs --debug

# 帮助
node scripts/generate-glossary.mjs --help
```

`build` 将在执行前自动触发 `prebuild`（运行 glossary 生成），避免遗忘。

### 多语言扩展（已初步支持）

可在 `<Term />` 中加入以下可选字段：

| 属性 | 说明 | 示例 |
|------|------|------|
| `desc` | 中文描述 | desc="服务器虚拟化平台" |
| `descEn` | 英文描述 | descEn="Server Virtualization Platform" |
| `full` | 中文全称 | full="KR 虚拟化平台" |
| `fullEn` | 英文全称 | fullEn="KR Virtualization Platform" |

脚本会：
- 中文表：优先使用 `full` / `desc`，fallback 到英文字段。
- 英文表：优先使用 `fullEn` / `descEn`，fallback 到中文字段。

后续要正式引入英文内容时，只需：
1. 在英文页面（或复制的英文版文档）中保留同样 `<Term>`。
2. 添加 i18n 目录结构（例如 `en/krvirt/...`）。
3. 扩展脚本 `scan` 规则（当前仅忽略 `.en.md` 文件，可修改为区分语言目录）。

## ⚙️ 配置快速参考

主配置：`.vitepress/config.ts`

当前启用：
- 顶部导航：仅“帮助中心”
- 侧边栏：`KRVIRT 虚拟化平台` 分组
- 搜索：本地 provider
- Outline：2~3 级标题
- Favicon：`/public/favicon.ico`
- cleanUrls（无 .html 后缀）
- lastUpdated（显示最后更新时间）
- editLink（跳转仓库 my-org/kr-docs 编辑）

可后续添加：`lastUpdated` / `editLink` / 自定义主题样式。

## 🎨 可扩展方向

- 新增：安装 / 配置 / 运维 / API / 安全章节
- 集成：部署流水线（CI）与自动化构建
- 优化：自定义 Theme + 首页组件化
- 国际化：多语言目录结构

## 🧩 最小工作流

```bash
npm install
npm run dev      # 开发
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

## 🤝 贡献

当前阶段：内部整理 / 架构奠基。可在后续阶段开放 PR 流程。

## 📄 许可

内部使用（如需开源可再补充 LICENSE）。

## 🔗 相关链接

- [VitePress 官方文档](https://vitepress.dev/)
- （可选）原始参考文档：<https://docs.pxvdi.lierfang.com/>
- [Vue.js 官方文档](https://vuejs.org/)

---

—— 精简版 README 完成，如需再缩减或生成英文版本请告知。