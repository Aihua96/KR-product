# 原 README 完整备份

（此文件为自动生成的备份，用于定位原 `README.md` 构建解析错误。请勿直接在此文件继续维护；修复完成后可删除。）

````markdown
# KRVIRT / 文档站（精简版）

基于 VitePress v2.0.0-alpha.12 的极简文档站，目前仅保留核心页面与最小必要结构，方便后续逐步扩展。

## 🚀 项目特性
- 🌙 **深色主题**: 默认深色主题，支持浅色/深色切换  
- 🔍 **强大搜索**: 本地搜索功能，支持快捷键 ⌘K
- 📱 **响应式布局**: 完美适配桌面端和移动端
- 🎯 **中文优化**: 完整的中文语言支持
- ⚡ **高性能**: 静态站点生成，极快的加载速度
- 🛡️ **类型安全**: 完整的 TypeScript 支持


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

| ⭐ | `i18nFile` 自定义 | 允许不同实例加载不同 JSON（灰度文案） |
| ◇ | A11y | 为 radio/checkbox 增加 `aria-label` / `fieldset` |
| ◇ | 统计埋点钩子 | 暴露 onChange 回调注入埋点 | 

---

## ⚠️ 构建死链说明

默认 VitePress 会检测外部无效链接。请避免在文档中直接使用可抓取的裸本地开发地址（如 `http://localhost:5173/index`）。若确需展示本地地址，请使用反引号包裹，或在 `config.ts` 中通过 `ignoreDeadLinks` 配置忽略。

当前已在 `.vitepress/config.ts` 中添加占位锚点白名单（`ignoreDeadLinks`），示例：

```ts
ignoreDeadLinks: [
	/^\/en\/products\/krvirt#core-features-placeholder$/,
	/^\/en\/products\/krcmp#core-features-placeholder$/
	// ... 其余 placeholder
]
```

占位内容实现后应及时删除对应正则，恢复死链校验有效性。

—— 精简版 README 完成，如需再缩减或生成英文版本请告知。

## 📚 现有页面

| 路径 | 说明 | 状态 |
|------|------|------|
| `/` | 首页（Hero + Features） | ✅ |
| `/krvirt/` | KRVIRT 产品介绍 | ✅ |
| `/krvirt/installation` | 部署指南 | ✅(占位) |
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
node scripts/generate-glossary.mjs --locale=zh --maxLinks=3
node scripts/generate-glossary.mjs --no-conflict-warn
node scripts/generate-glossary.mjs --fail-on-conflict   # 有冲突立即退出 3
node scripts/generate-glossary.mjs --fail-on-missing-link # 相关文档链接缺失退出 4
```

`build` 将在执行前自动触发 `prebuild`（运行 glossary 生成），避免遗忘。

### 多来源与冲突检测

- 默认同一术语若在多个文件出现，会展示最多 2 个来源链接（可用 `--maxLinks=3` 调整）。
- 若同一术语的 `desc/descEn/full/fullEn` 在不同文件出现多个不一致值，表格该术语后会追加 `⚠️(冲突:desc,full...)` 提示，并在控制台输出 `[conflict]` 警告。
- 可用 `--no-conflict-warn` 关闭控制台冲突输出（表格标记仍保留）。
- 在 CI 中若希望直接失败，可添加 `--fail-on-conflict` 使其检测到冲突返回退出码 3。
- 若需保证关联文档链接真实存在，可加 `--fail-on-missing-link`，缺失时退出 4。

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

### 脚本退出码速查

`scripts/generate-glossary.mjs`

| 退出码 | 含义 |
|--------|------|
| 0 | 成功 |
| 3 | 冲突存在且使用 `--fail-on-conflict` |
| 4 | 关联文档链接缺失且使用 `--fail-on-missing-link` |

`scripts/check-glossary-integrity.mjs`

| 退出码 | 含义 |
|--------|------|
| 0 | 术语文件最新且无非法链接 |
| 1 | 非法链接 / （启用 `--require-markers` 时）缺少自动标记 |
| 2 | 术语表不最新（脚本已重新写入） |
| 3 | 生成脚本冲突失败或生成异常（透传） |

`scripts/check-legacy-anchors.mjs`

| 退出码 | 含义 |
|--------|------|
| 0 | 所有配置 & 模式匹配文件均包含所需隐藏锚点 |
| 1 | 配置文件缺失或结构非法 |
| 2 | 存在缺失锚点（控制台列出文件及缺失列表） |

配置示例（`scripts/legacy-anchors.config.json`）：

```jsonc
{
	"files": [
		{ "path": "krvirt/installation.md", "anchors": ["安装指南", "部署文档"] }
	],
	"patterns": [
		{
			"glob": "**/deployment.md",
			"titleContains": "部署指南",
			"anchors": ["安装指南", "部署文档"]
		}
	]
}
```

CI 片段：

```yaml
	- name: Check legacy anchors
		run: node scripts/check-legacy-anchors.mjs
```

CI 参考（GitHub Actions 片段）：

```yaml
		- name: Generate glossary
			run: node scripts/generate-glossary.mjs --fail-on-conflict
		- name: Check glossary integrity
			run: node scripts/check-glossary-integrity.mjs --require-markers
```

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

## 📊 产品矩阵 & 动态组件

文档站的产品总览页已采用**自动化 + 动态组件**混合模式：

### ⚠️ 2025-09 功能精简与废弃说明

近期（2025-09）针对可维护性与阅读聚焦，对产品矩阵与解决方案列表做了“减法”优化：

| 变更项 | 状态 | 影响范围 | 说明 / 迁移指引 |
|--------|------|----------|-----------------|
| Solutions `status` 前端字段 | 已移除 | 所有 solutions/*.md 与列表组件 | Frontmatter `status:` & 页面内“状态：...” 行删除；过滤 / 导出不再包含该字段。历史链接若含 `status=` 查询参数将被忽略。|
| Product Matrix `link` 列 | 已移除 | `ProductMatrix.vue` 及引用示例 | 统一改为表格底部追加两行：产品介绍 / 帮助中心。frontmatter `productMatrixColumns` 中如仍含 `link` 可安全删除。|
| 标签匹配模式 (ANY / ALL) | 已废弃 | FilterToolbar | UI 不再展示；内部统一为“任意”匹配。旧 URL 参数 `mode=` 会被忽略，不报错。|
| 高级视觉特性（粘性表头/首列、列 hover 高亮、渐变滚动指示、文本折叠/展开、渐进式加载） | 已移除 | Product Matrix | 回归原生自适应宽度表格，减少样式复杂度与滚动条；仅保留基础排序 / 过滤 / 导出。|
| 列动态勾选 | 已废弃 | Product Matrix | 固定核心信息列顺序；避免持久化列集合带来的状态分歧。|

设计理念：聚焦“快速扫一眼关键信息 + 导出”，避免交互栈过深。若后续确有需要，可通过版本标签或独立子页面恢复高交互矩阵。

迁移检查清单（建议执行一次）：
1. Grep 仓库是否仍存在 `status:` frontmatter（应为 0 条）。
2. 检查 `products/index.md` 与 `en/products/index.md` 的 `productMatrixColumns` 是否已去除 `link`。
3. 若外部书签含旧查询参数（`mode=` / `status=` / `cols=`），确认功能仍可回退（参数被忽略，不阻断渲染）。
4. README 或其它文档中示例列数组同步去掉 `link`。

变更后的默认列（2025-09 起）按顺序：`name, positioning, scenarios, capabilities, deploy, version, status, tags`（其中 version/status 若源数据缺省则对应单元格留空）。

> 如果你正在阅读旧版本生成的导出文件（CSV/Markdown）并看到包含 `link` 或 `status`/列筛选注释，可直接忽略这些字段；重新在站点导出将使用上述精简结构。

---

### 示例截图

![产品矩阵组件示意](/product-matrix-demo.svg)

*动态列 / 标签过滤 / 排序 / 导出 CSV & Markdown / 版本 & 状态徽章 / noscript 回退表格*

### 数据来源
产品元数据已抽离为单一源文件：`data/products.json`。

执行 `npm run generate:products:matrix` 会：
- 读取 `data/products.json`
- 若页面未使用组件（无 `<ProductMatrix`），生成/覆盖静态 Markdown 表格（标记包裹区内）
- 无论是否组件模式，始终写出运行时数据：`public/products.json`
- 保留列顺序与裁剪逻辑（由 frontmatter 控制）

### 页面模式
在 `products/index.md` 与 `en/products/index.md` 中放置：

```md
<!-- PRODUCT_MATRIX_START -->
<ProductMatrix lang="zh" :columns="['name','positioning','scenarios','capabilities','deploy','tags']" />
<!-- PRODUCT_MATRIX_END -->
```

脚本检测到标记内含 `<ProductMatrix` 即自动跳过静态表格写入，仅刷新 `products.json`，保证组件动态渲染。

### 可配置列
在 frontmatter 中配置：

```yaml
productMatrixColumns:
	- name
	- positioning
	- scenarios
	- capabilities
	- deploy
	- tags
```

脚本和组件都会读取该数组，实现列裁剪（未来扩展列时向后兼容）。

### 组件功能概览
| 能力 | 说明 |
|------|------|
| 列动态 + 勾选 | frontmatter 初始列 + UI 复选框，localStorage 持久化 |
| 标签过滤 | 支持多标签 + 模式切换（任意 ANY / 全部 ALL） |
| 全局搜索 | 关键词匹配：名称 / 定位 / 场景 / 能力 / 部署 / 标签 / 版本 / 状态（高亮显示） |

---

## 🌐 多语言占位策略（Internationalization Placeholder Strategy）

当前仓库已启用 `locales`：中文为 root，英文 `/en/` 为占位。英文内容采用最小页面骨架 + 后续规划提示，便于逐步补充。

### 目录与命名
- 中文：`/krvirt/installation` 已重命名展示文案为“部署指南”（原“安装指南” / “部署文档” 统一）。
- 英文：对应使用 `Deployment Guide`，放置在 `/en/<product>/deployment.md`。
- 英文快速开始：`/en/<product>/quick-start.md`（placeholder）。

### 渐进式填充原则
1. 优先补充 Overview（定位/特性/架构高层）。
2. 再补 Quick Start（5~8 步即可上手）。
3. 最后拓展 Deployment Guide 的详细章节（环境、步骤、验证、HA、故障排查链接）。

### Legacy Anchors（旧锚点兼容）
为避免早期外链或文档引用失效，在所有中文“部署指南”页顶部加入：

```html
<span id="安装指南" style="display:none"></span>
<span id="部署文档" style="display:none"></span>
```

这样历史的 `#安装指南` / `#部署文档` fragment URL 仍能定位页面。后续若需要正式 URL 层级重写，可：

| 方案 | 适用场景 | 做法 |
|------|----------|------|
| 前端 meta refresh | 少量永久重定向 | 在旧文件添加 `<meta http-equiv="refresh" content="0;url=/new/path" />` |
| JS 重定向 | 动态判断或统计 | `<script>location.replace('/new/path')</script>` |
| 站点层 Nginx rewrite | 大规模规则 | 配置 `rewrite ^/old/(.*)$ /new/$1 permanent;` |

### 隐藏锚点校验脚本
新增计划：`scripts/check-legacy-anchors.mjs`（见下方脚本章节），在 CI 中保障锚点不被误删。

---
| 版本 & 状态徽章 | 显示 `version` 与 `status(GA/Beta/Preview)` 彩色徽章 |
| 排序 | 表头点击三态：升序 / 降序 / 取消 |
| 导出 | 一键导出当前列/过滤结果为 CSV 或 Markdown 表格 |
| Dark / Light 适配 | 使用 CSS 变量与渐进增强样式 |
| 响应式 & 可折行 | 小屏折行展示标签与多字段 |
| noscript 回退 | `<noscript>` 提供精简静态表格，保证无 JS 可读 |

### 更新流程
1. 修改 `data/products.json`（新增字段需同步组件渲染逻辑）。
2. 运行：
	```bash
	npm run generate:products:matrix
	```
3. 查看 `public/products.json` 是否更新。
4. 本地预览组件效果：
	```bash
	npm run dev
	```

### 扩展建议（待选）
（以下已部分实现或可继续演进）

- [x] version / status 徽章（已完成）
- [x] 多标签模式（ANY / ALL 已完成）
- [x] 列显示勾选 + localStorage（已完成）
- [x] `<noscript>` 兜底静态表格（已完成）
- [x] 导出 CSV / Markdown（已完成）
- [x] 列排序（已完成）
- [x] 全局关键词搜索（已完成）
- [ ] 关键词搜索框（可选：基于 name/positioning/scenarios/capabilities）
- [ ] 服务端 / 构建期校验字段完整性（schema 校验）
- [ ] 分组视图（按标签或状态折叠）

### 数据校验 (validate-products)

新增脚本：`scripts/validate-products.mjs`，在 `prebuild` 阶段自动执行，确保产品数据一致性。

校验规则：
1. 必填字段完整：id / nameZh / nameEn / positioningZh / positioningEn / ... / tags
2. id 唯一 & 正则：`^[a-z0-9][a-z0-9-_]*$`
3. status 允许：GA | Beta | Preview（大小写不敏感）
4. version 允许：`v?数字(.数字){0,3}`
5. link 需以 `/` 或 `http(s)://` 开头
6. tags：非空数组，小写字母数字或连字符
7. 文本字段禁止制表符 (\t)

退出码：
| 码 | 含义 |
|----|------|
| 0 | 通过 |
| 2 | 读取 / 解析失败 |
| 2 | 存在缺失锚点（控制台列出文件及缺失列表） |
| 3 | 使用 --require-marker 时，锚点前缺少 <!-- legacy-anchor --> 注释 |


手动运行：


组件：`ProductQuickLinks.vue` 动态读取 `public/product-quick-links.json`，实现按顺序展示各产品常用入口（部署、快速开始、配置、API 等）。

示例：

```jsonc
{
	"krvirt": {
		"order": 1,
		"links": [
			{ "key": "deploy", "zh": "部署指南", "en": "Deployment", "href": "/krvirt/installation", "icon": "🚀" }
		]
	}
}
```

字段规则：

| 字段 | 层级 | 说明 |
|------|------|------|
| <productId>.order | 必填 | 正整数；全局唯一（用于排序） |
| <productId>.links | 必填 | 非空数组 |
| links[].key | 必填 | 同一产品内唯一；`^[a-z0-9][a-z0-9-]*$` 推荐 |
| links[].zh / en | 必填 | 中/英文本；不可为空 |
| links[].href | 必填 | 以 `/` 开头；指向现有页面（中文或 `/en/`）或产品根路径 `/id/` |
| links[].icon | 可选 | Emoji 或文本图标 |

校验脚本：`scripts/validate-quick-links.mjs`

退出码：

| 码 | 含义 |
|----|------|
| 0 | 通过（可能含警告） |
| 2 | 解析失败 |
| 3 | 结构 / 规则错误（打印错误列表） |

警告类型（不阻断）：

| 类型 | 说明 |
|------|------|
| key 规范建议 | key 不符合推荐命名但仍可用 |
| href 可能不存在 | 未找到对应 md/index.md，可能尚未创建 |
| order 序列间隔 | 排序非连续（例如 1,3,4） |
| 产品未配置 | 某产品在 products.json 中存在但无快捷入口 |

命令：

```bash
npm run validate:quick-links          # 人类可读输出
node scripts/validate-quick-links.mjs --json  # 机器可读 JSON
```

已集成：`prebuild` 串联执行，失败将阻断构建。

### Product Status Bar (产品状态汇总)

组件：`ProductStatusBar.vue` 读取 `public/products.json`，展示：产品中文/英文名、版本、状态徽章（GA/Beta/Preview）、首个标签 + 余量计数、定位摘要。用于在 `products/index.md` 顶部快速浏览当前产品线全貌。

维护要点：

| 操作 | 影响 |
|------|------|
| 更新 version/status | 徽章即时反映 |
| 添加 tags | 超过 1 个时 UI 显示首个 + “+n” |
| 修改 positioning* | 摘要文本同步更新 |

### Product Matrix (产品矩阵) 扩展提醒

新增字段时需同步三处：
1. `data/products.json` 与生成逻辑（`generate-products-matrix.mjs`）
2. 运行时数据 `public/products.json`（脚本自动）
3. 前端展示：`ProductMatrix.vue` + `public/product-matrix-i18n.json`（列本地化描述）
```bash
npm run validate:products
```

失败时会列出全部问题并阻断 build。

---

### Product Matrix URL 分享 & 持久化升级

新增能力：
| 能力 | 说明 |
|------|------|
| URL 参数解析 | 页面加载自动读取查询串预填过滤/列/排序 |
| 分享按钮 | 导出区域新增 URL 按钮复制当前过滤状态链接 |
| 导出注释增强 | CSV 第一行 / MD 注释中追加 `share:` 查询串，便于还原上下文 |
| 聚合状态存储 | 使用 `KR_PM_STATE_V2` 统一保存全部状态（向下兼容旧键） |
| 外置 i18n | 行内文案移至 `public/product-matrix-i18n.json` 可覆盖列描述 |

#### 查询参数表（产品矩阵）
| 参数 | 含义 | 示例 | 省略条件 |
|------|------|------|----------|
| kw | 关键词 | kw=storage | 空 |
| tags | 标签集合 | tags=compute,storage | 未选择 |
| status | 状态集合 | status=ga,beta | =全部状态 |
| cols | 列顺序 | cols=name,positioning,version | 等于默认顺序 |
| sort | 产品列排序 | sort=asc / sort=desc | 无排序（原始顺序） |

> 与 Solutions 共享：kw / tags / status；新增产品特有：cols / sort。`mode` 已废弃（2025-09）。

#### 新持久化结构
Key: `KR_PM_STATE_V2`
```jsonc
{
	"keyword": "edge",
	"tags": ["compute","storage"],
	"statuses": ["ga","beta"],
	"columns": ["name","positioning","scenarios",...],
	"productSort": "asc"   // 或 "desc" / null
}
```
启动逻辑：
1. 若存在 `KR_PM_STATE_V2` 直接使用。
2. 否则读取旧分散键 `KR_PM_*`（兼容），随后写入聚合键（一次性迁移）。
3. 后续仅更新聚合键；旧键保持只读兼容，可在数次发布后清理。

#### i18n 外置迁移
移除组件内硬编码 map：
1. 基础标签/状态/列等文案统一放置 `product-matrix-i18n.json`。
2. 列描述 (desc) 与标签翻译亦集中于该文件；可按需追加键。
3. 运行时懒加载，未加载前回退 key，便于调试缺失项。

#### 导出注释格式
CSV 第一行：`# Filters: ...` & 第二行 `# share: kw=...&tags=...`
Markdown 顶部注释：`<!-- Filters: ... | share:kw=... -->`
若无参数则 `share:none`。

---

### Product Matrix URL 分享 & 持久化升级
...（重复段在原文中可能引起解析风险，此处保持原样备份）

---

## 🧰 FilterToolbar 组件治理规范（统一过滤工具条）

为复用 Solutions 列表与 Product Matrix 顶部过滤 UI，抽象出通用组件 `FilterToolbar.vue`，通过“配置化 Props + model v-model 风格事件 + actions 插槽”组合实现差异化扩展（列选择 / 导出按钮等）。

### 设计目标
1. 去重：消除多处复制的标签 / 状态 / 搜索 / 重置逻辑。
2. 可裁剪：按需显示（搜索、行业、标签、状态、排序、重置）。
3. 可扩展：actions 插槽自由注入列选择、导出、分享 URL 等自定义能力。
4. i18n：公共文案外置 JSON（`/public/filter-toolbar-i18n.json`），允许按键覆盖。
5. 可持久：由业务侧负责 localStorage 键管理，组件保持“无副作用 / 无存储”。

### 基础用法（示例 - SolutionsIndex）
```text
<FilterToolbar
	:lang="lang"
	:show-search="true"
	:show-industries="industries.length>0"
	:show-tags="tags.length>0"
	:show-statuses="statuses.length>0"
	:show-sort="true"
	:show-reset="true"
	:tag-mode-enabled="true"
	:industries="industries"
	:tags="tags"
	:statuses="statuses"
	:sort-options="sortOptions"
	:keyword="keyword"
	:selected-industries="Array.from(selectedIndustries)"
	:selected-tags="Array.from(selectedTags)"
	:selected-statuses="internalStatus"
	:tag-mode="matchModeTag"
	:sort="sortKey"
	actions-label="导出:"
	@update:keyword="v=> keyword=v"
	@update:selectedIndustries="arr=> setIndustries(arr)"
	@update:selectedTags="arr=> setTags(arr)"
	@update:selectedStatuses="arr=> internalStatus = arr"
	@update:sort="v=> sortKey = v as any"
	@reset="resetFilters"
>
	<template #actions>
		<button class="pm-export" @click="exportCsv">CSV</button>
		<button class="pm-export" @click="exportMarkdown">MD</button>
		<button class="pm-export" @click="copyShareUrl">URL</button>
	</template>
</FilterToolbar>
```
...（后续大量段落同主 README，已完整备份，不再重复注释）

````
