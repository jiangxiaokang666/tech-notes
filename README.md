# JXK · Tech Notes

个人技术知识分享网站，使用 Astro + TypeScript，构建输出为纯静态文件。

## 当前进度

已完成工程初始化、内容模型与基础 UI，并迁入南京大学生成式软件工程的 8 篇个人学习笔记。
学习笔记模块已支持分类、专题目录、章节阅读、相邻章节导航与 H2/H3 目录。
仓库内目前包含 9 篇真实内容（8 篇学习笔记、1 篇 Git 实践）和 6 篇明确标注的示例（其中 1 篇草稿）。
第一阶段范围已收缩到 Task 5（算法题解）：技术实践与技术思考模块页面、Pagefind 搜索与阅读体验增强、
全站验收移出本次范围，记录在 `docs/requirements-phase1.md` 的 1.3 节。
顶部导航只保留 首页 / 学习笔记 / 算法题解；技术实践与技术思考的集合、占位页仍在仓库中，只是不再展示。

## 环境要求

- Node.js >=22.23.4（本地验证版本：24.14.1）
- npm >=9.6.5（本地验证版本：11.12.0）

直接依赖固定为 Astro 7.4.5、@astrojs/check 0.9.12、TypeScript 6.0.3。
初始化时查询 npm `latest` 得到 Astro 7.4.5。
检查工具的 TypeScript peer 范围为 `^5.0.0 || ^6.0.0`，因此选用兼容的
TypeScript 6.0.3，未采用当前最新但不在该范围内的 TypeScript 7。

## 本地使用

```powershell
npm ci
npm run dev
```

开发服务默认地址为 http://localhost:4321，可访问首页，以及学习笔记、算法题解两个分类入口。
技术实践与技术思考的占位页仍可访问，但首页与导航不再提供入口。
访问不存在的路径可验证 404 页面；构建产物中对应文件为 `dist/404.html`。

```powershell
npm run check
npm run build
npm run preview
```

`check` 执行 Astro 和 TypeScript 诊断；`build` 将静态文件输出到 `dist/`；
`preview` 用于本地预览构建产物。项目不需要常驻的生产 Node.js 服务。

在限制用户配置目录写入的执行环境中，可先在当前 PowerShell 会话运行
`$env:ASTRO_TELEMETRY_DISABLED='1'`，避免 Astro 遥测尝试创建用户配置目录。
本次检查与构建使用了此设置，不修改系统环境变量。

## 目录职责

- `public/images/`：直接复制到构建产物的图片。
- `src/components/`：复用组件。
- `src/layouts/`：页面和文章布局。
- `src/lib/`：内容查询、专题汇总、Schema 与站点配置。
- `src/content/learning/`：学习笔记。
- `src/content/algorithms/`：算法题解。
- `src/content/practices/`：技术实践。
- `src/content/thoughts/`：技术思考。
- `src/pages/`：页面路由。
- `src/styles/`：样式。
- `scripts/`：项目辅助脚本。
- `docs/`：需求及项目文档。

空目录使用 `.gitkeep` 保留。
当前不安装 Pagefind、KaTeX 或前端框架，后续按任务引入必要依赖。

`.npmrc` 将 npm 缓存放在已忽略的 `.npm-cache/`，避免依赖系统缓存目录的写入权限。
使用 `package-lock.json` 锁定完整依赖树，首次安装和验收使用 `npm ci`。

## 内容模型与新增文章

`src/content.config.ts` 使用 Astro Content Layer 的 `glob` loader，递归加载四个目录中的
`**/*.md`。集合名为 `learning`、`algorithms`、`practices`、`thoughts`。
Zod Schema 位于 `src/lib/content-schemas.ts`，使用 Astro 提供的 `astro/zod`，无需额外依赖。

所有文章必须提供：

| 字段 | 规则 |
| --- | --- |
| `title`、`description`、`category` | 非空文本 |
| `pubDate` | 必填日期，例如 `2026-11-03` |
| `updatedDate` | 可选日期 |
| `tags` | 字符串数组，默认 `[]` |
| `draft` | 布尔值，默认 `false` |
| `type` | 必须与所属集合匹配，见下表 |

| 目录 | type | 额外字段 |
| --- | --- | --- |
| `learning/` | `learning` | `series`、`seriesTitle`、`seriesOrder` 必填 |
| `algorithms/` | `algorithm` | `difficulty`、`source`、`sourceUrl` 必填；`language` 默认 `cpp` |
| `practices/` | `practice` | 无 |
| `thoughts/` | `thought` | 无 |

`difficulty` 仅允许 `Easy`、`Medium`、`Hard`。`sourceUrl` 必须为 HTTP/HTTPS URL。
`seriesOrder` 必须为正整数；`series` 使用英文小写、数字及连字符。
文章路径同样使用英文小写、数字及连字符，避免中文 URL；发布后保持文件路径稳定。
分类使用文本字段，可通过内容增加分类，无需修改页面组件。
四个集合始终加载并校验，但页面目前只展示 `learning` 与 `algorithms`；
`practices`、`thoughts` 的列表与详情页属于第二阶段，内容可先提交，暂不出现在站点上。

新增学习专题时，在 `src/content/learning/` 下创建专题目录，参考
`cpp/object-model/01-memory-layout.md`；同专题各章使用相同的 `series` 与 `seriesTitle`，
按 `seriesOrder` 指定章节顺序。新增章节时添加新的 Markdown 文件并设置序号。
新增算法题解参考 `algorithms/array/two-sum.md`，填写难度和题目来源。
新增实践参考 `practices/performance/measurement-checklist.md`；
新增思考参考 `thoughts/engineering-tradeoffs.md`。
示例文章的标记应保留；编写正式内容时替换为自己的实际内容。

实践文章的最小 Frontmatter：

```yaml
---
title: 文章标题
description: 文章摘要
pubDate: 2026-11-03
category: 开发工具
type: practice
tags: [工具]
draft: true
---
```

## 公开查询与草稿

后续页面的列表、统计及 `getStaticPaths` 统一使用 `src/lib/content.ts` 中的
`getPublishedCollection(collection)`，按发布日期倒序返回非草稿文章；
详情查询使用 `getPublishedEntry(collection, id)`，草稿或不存在的 ID 返回 `undefined`。
开发环境也过滤草稿。专题章节的排序由使用方按 `seriesOrder` 处理。

直接调用 Astro 的 `getCollection` 会包含草稿，仅用于校验或明确需要全部内容的内部工具。
草稿同样加载并校验，字段错误会导致构建失败并报告文件路径与错误字段。
公开 GitHub 仓库中的草稿源码仍然公开，`draft` 不能保护私人信息。

## 内容检查

```powershell
npm run validate:content
npm run check
npm run test:content
npm run build
```

`validate:content` 强制同步全部内容并执行 Schema 校验。
`test:content` 使用 Node.js 内置测试工具，检查必填字段、默认值、难度、日期和章节序号；
还通过实际构建验证 Markdown、表格、代码块及草稿过滤，并验证缺少难度的草稿会导致构建失败。
测试会临时创建验证路由和错误文章，在结束时删除；请勿与开发服务或其他构建同时运行。
测试结束后运行 `npm run build`，恢复仅含正常页面的构建产物。
数学公式、Pagefind 及页面阅读效果属于第二阶段。

## 基础 UI

- `src/layouts/BaseLayout.astro`：公共页面骨架、中文语言标记、标题、描述和 Open Graph 信息。
- `src/components/Header.astro`：公共导航与当前页标记。
- `src/components/ThemeToggle.astro`：浅色、深色和跟随系统三种模式。
- `src/components/ArticleCard.astro`：首页文章摘要，学习笔记提供正文链接，其他模块不提供未实现的正文链接。
- `src/lib/site.ts`：统一管理站点信息、分类、导航和已实现的路由。站点名为 `JXK · Tech Notes`，
  头部品牌直接读取它；子页面标题用 `|` 连接页面名与站点名。
- `src/styles/global.css`：原生 CSS、主题变量和响应式布局，最大容器宽度 1200px。

主题保存在浏览器 `localStorage` 的 `tech-notes-theme` 键中；存储不可用时，
当前页面仍可切换。跟随系统模式监听系统配色变化，跨标签页同步外观偏好。
头部提前应用主题以减少加载闪烁。禁用 JavaScript 时仍有系统配色及原生移动导航。
移动端菜单使用 `details/summary`，支持键盘展开、收起，Escape 可关闭并返回菜单焦点。
提供跳转到主要内容的键盘入口、焦点样式以及减少动态效果设置。

首页 hero 只保留两个操作按钮和“搜索即将开放”提示；站点介绍以 `visually-hidden` 的 `h1` 保留，
供搜索引擎与读屏软件使用，视觉上不显示。首页统计只计学习笔记、算法题解与标签数量；
正文不再有分类入口卡片，统计之后直接是“最新文章”和“正在学习”两栏。
“正在学习”仅展示已有章节的专题，未虚构完成状态或进度百分比。
搜索按钮显示“即将开放”，属于第二阶段；算法题解详情页尚未实现，卡片仍标注“正文待开放”。
学习笔记使用独立路由；其他分类基础页由 `src/pages/[section]/index.astro` 生成，后续开发相应模块时替换，
避免与静态分类路由重复。首页不写死临时域名。
顶部导航为 首页 / 学习笔记 / 算法题解，由 `src/lib/site.ts` 导出；关于页面已随本次调整移除，
技术实践与技术思考的占位页仍可访问，但没有入口。
全站不设页脚，页面底部由各内容容器的下内边距收尾（`.home-columns`、`.prose`、`.learning-index` 等）。

验证：`npm run check` 检查 19 个文件，0 errors / 0 warnings / 0 hints；`npm run build` 生成 18 页。
此前浏览器验证过桌面导航、390px 手机布局无横向溢出、手机导航展开与跳转，
以及浅色、深色、跟随系统和跨页面主题保存。

## 南京大学生成式软件工程笔记

来源：[nju-gse-notes](https://github.com/jiangxiaokang666/nju-gse-notes)，
迁入版本 `9750c910525fdbc02e003b612fc900d62ae206fc`。
原文件与迁入文件对照详见 `docs/imports/nju-gse-notes.md`。

- 内容目录：`src/content/learning/ai-engineering/nju-gse/`。
- 学习笔记入口：`/learning/`。
- 专题目录：`/learning/nju-generative-software-engineering/`。
- 章节 URL：`/learning/ai-engineering/nju-gse/<英文文件名>/`。
- 分类为 AI 工程，8 个章节按原编号排列；原编号不等同于课程 Lecture 编号。
- `pubDate` / `updatedDate` 来自原文件最早 / 最近提交的作者日期。
- 正文仅调整 Markdown 标题层级；新增摘要、标签和来源信息。
- 每篇 `sourceUrl` 指向原始提交中的文件，`sourceRevision` 记录来源提交。
- 保留课程与公开资料链接；不复制课程视频或完整课件。

`src/lib/learning.ts` 汇总非草稿章节，按 `seriesOrder` 排序，
并拒绝同专题序号重复、标题或分类不一致，避免静默生成错误目录。
桌面阅读页提供左右侧栏；窄屏目录折叠；页内目录随滚动标记当前段落。
复制代码和数学公式仍属于第二阶段的阅读体验任务。

远程仓库使用 SSH：`git@github.com:jiangxiaokang666/tech-notes.git`。
导入时的临时源仓库位于已忽略的 `.import-source/`，不作为项目源码提交。
