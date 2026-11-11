# Tech Notes — 第一阶段开发需求说明

**项目名称：** Tech Notes  
**项目类型：** 个人技术知识分享网站  
**开发阶段：** Phase 1 — 本地工程建设  
**目标平台：** Windows 10 / Windows 11  
**开发工具：** VS Code + Codex  
**网站框架：** Astro + TypeScript  
**代码仓库：** GitHub Public  
**内容语言：** 中文为主，保留英文技术术语

---

## 1. 项目目标

建设一个面向程序员的个人技术知识分享网站，用于长期整理和发布：

1. 系统性学习笔记
2. 算法题解
3. 技术实践与性能实验
4. 技术思考与经验总结

网站采用纯静态架构。

文章使用 Markdown 编写，网站通过 Astro 在构建阶段生成静态 HTML、CSS 和 JavaScript。

第一阶段只建设本地工程，不涉及线上部署。

### 1.1 核心原则

- 内容与页面组件分离。
- 使用 Markdown 管理文章。
- 使用 Git 管理所有源码和公开内容。
- 不引入数据库。
- 不引入服务端 API。
- 不引入用户登录和权限系统。
- 不依赖 Node.js 常驻服务。
- 不过度设计，优先保证可维护性。
- 兼顾未来内容规模增长。

### 1.2 第一阶段交付目标

最终需要得到一个可以正常运行的本地网站：

- 首页完整可用。
- 学习笔记专题与章节页面完整可用。
- 算法题解分类与详情页面完整可用。
- 算法题解代码块支持语法高亮。
- 算法题解支持按分类浏览。
- 支持移动端访问。
- 支持本地构建。
- 支持 Git 提交。

技术实践页面、数学公式渲染与全站搜索属于第二阶段，见 1.3。

### 1.3 本次范围调整

2026-11-11 调整：第一阶段只做到 Task 5（算法题解）为止，以下三项移出本次范围，不纳入验收：

- 技术实践与技术思考模块的列表页、详情页（原 Task 6）。
- Pagefind 全站搜索、代码块复制、数学公式渲染（原 Task 7）。
- 全站路由与构建验收、README 收尾（原 Task 8）。

第 5–12 节仍保留这些能力的完整需求描述，作为第二阶段依据；本次实现与验收不要求满足这些章节。

---

## 2. 技术选型

| 模块 | 技术 | 用途 |
|---|---|---|
| 网站框架 | Astro | 静态网站生成 |
| 开发语言 | TypeScript | 类型安全 |
| 内容格式 | Markdown | 技术文章 |
| 内容管理 | Astro Content Collections | 内容组织与校验 |
| 页面样式 | 原生 CSS | 响应式布局 |
| 代码高亮 | Shiki | 代码展示 |
| 数学公式 | KaTeX | 数学公式渲染 |
| 全文搜索 | Pagefind | 静态全文检索 |
| 版本管理 | Git | 代码管理 |

技术约束：

1. 使用当前稳定版 Astro。
2. 使用 Astro 官方推荐的 Content Collections / Content Layer API。
3. 内容集合使用 glob loader 加载本地 Markdown。
4. 优先使用 Astro 原生组件。
5. 第一阶段不引入 React、Vue 等前端框架。
6. 不使用重量级 UI 组件库。
7. 使用 npm 和 package-lock.json 锁定依赖。
8. 所有依赖必须能够在 Windows 本地正常安装和构建。

---

## 3. 网站信息架构

网站顶部导航：

- 首页
- 学习笔记
- 算法题解
- 技术实践
- 技术思考
- 关于

### 3.1 首页

路径：`/`

首页由以下模块组成：

**A. 网站介绍**

显示：

- 网站名称：Tech Notes
- 简短介绍：记录技术学习，分享工程实践，沉淀编程知识。
- 全站搜索入口。

**B. 内容统计**

动态统计：

- 学习笔记数量
- 算法题解数量
- 技术实践数量
- 标签数量

统计数据必须来自实际内容，不允许写死模拟数字。

**C. 正在学习**

展示正在学习的专题。

例如：

- C++ 对象模型
- C++ 并发编程
- Unreal Engine 架构
- AI Agent 工程实践

**D. 最新文章**

按照发布时间倒序展示最近发布的文章。

**E. 内容分类入口**

展示学习笔记、算法题解、技术实践和技术思考四个主要入口。

---

## 4. 学习笔记模块

路径：`/learning/`

这是网站最重要的模块。

采用专题 + 章节的组织方式。

### 4.1 分类设计

初始分类：

- C++
- 并发编程
- 数据结构
- Unreal Engine
- AI 工程
- 操作系统

允许未来增加分类，不允许通过修改页面组件才能增加分类。

### 4.2 专题结构

示例：

C++ 对象模型实战：

1. 对象内存布局
2. 虚函数与虚表
3. 多继承
4. 虚继承
5. RTTI 与 dynamic_cast
6. 构造与析构过程
7. 综合实验

每个专题需要有：

- 专题名称
- 专题介绍
- 所属分类
- 章节数量
- 章节列表
- 章节顺序
- 学习状态

### 4.3 专题详情页

显示：

- 专题标题
- 专题介绍
- 专题目录
- 章节列表
- 章节完成状态
- 每章文章链接

章节按照 `seriesOrder` 排序。

支持上一章、下一章导航。

### 4.4 学习笔记文章页

文章页面布局：

- 左侧：专题章节目录
- 中间：文章正文
- 右侧：文章目录 TOC

移动端需要将侧边目录折叠。

文章正文需要支持：

- Markdown 标题
- 普通文本
- 有序列表和无序列表
- 表格
- 引用
- 图片
- 代码块
- 行内代码
- 数学公式（第二阶段）
- 内部文章链接
- 外部链接

---

## 5. 算法题解模块

路径：`/algorithms/`

采用分类 + 题解列表 + 题解详情的组织方式。

### 5.1 初始分类

- 数组与字符串
- 链表
- 栈与队列
- 哈希表
- 双指针
- 滑动窗口
- 二叉树
- 堆与优先队列
- 递归与回溯
- 动态规划
- 贪心算法
- 图论
- 排序与搜索

### 5.2 算法题解列表

列表按发布时间倒序展示题解，支持按分类筛选。

- 不做难度筛选与标签筛选；`difficulty`、`tags` 仅作为文章元信息展示。
- 关键词搜索属于第二阶段的全站搜索，见 1.3。

难度取值：

- Easy
- Medium
- Hard

### 5.3 算法题解文章模板

每篇算法文章应支持以下信息：

1. 题目名称
2. 题目来源
3. 原题链接
4. 题目难度
5. 算法标签
6. 题目描述
7. 解题思路
8. 算法实现
9. 复杂度分析
10. 总结

默认以 C++ 为主要实现语言，同时允许 Python 等其他语言。

代码必须支持语法高亮。

---

## 6. 技术实践模块（第二阶段）

> 本模块已移出第一阶段范围，见 1.3；以下内容保留为第二阶段需求。

路径：`/practices/`

用于记录真实的工程实践、实验和性能测试。

初始分类：

- C++ 性能优化
- 内存与缓存
- 并发编程
- SIMD
- UE 工程实践
- 开发工具

文章支持：

- 实验背景
- 实验目的
- 实验环境
- 实现过程
- 测试代码
- 测试数据
- 图表
- 结果分析
- 总结

例如：

- False Sharing 性能测试
- SIMD AoS 与 SoA 对比
- vector 扩容性能测试
- ThreadPool 实现
- Cache 与 Pointer Chasing 实验

允许文章插入图片、代码块和表格。

---

## 7. 技术思考模块（第二阶段）

> 本模块已移出第一阶段范围，见 1.3；以下内容保留为第二阶段需求。

路径：`/thoughts/`

记录不属于系统性专题的技术思考。

例如：

- RAG 与 Graphiti 的区别
- Agent Harness 架构
- C++ 与 Go 的工程取舍
- 大型 C++ 项目的代码索引方案

采用普通文章列表和文章详情页。

---

## 8. Markdown 内容组织规范

内容文件统一存放在：

`src/content/`

目录建议：

```text
src/content/
├── learning/
│   ├── cpp/
│   │   ├── object-model/
│   │   │   ├── 01-memory-layout.md
│   │   │   ├── 02-virtual-function.md
│   │   │   └── 03-multiple-inheritance.md
│   │   │
│   │   └── concurrency/
│   │       ├── 01-thread.md
│   │       └── 02-atomic.md
│   │
│   ├── unreal-engine/
│   └── ai-engineering/
│
├── algorithms/
│   ├── array/
│   ├── linked-list/
│   ├── tree/
│   ├── dynamic-programming/
│   └── graph/
│
├── practices/
│   ├── performance/
│   ├── concurrency/
│   └── unreal-engine/
│
└── thoughts/
```

### 8.1 学习笔记 Frontmatter

```yaml
---
title: C++ 虚函数与虚表
description: 分析 C++ 虚函数调用机制与虚表布局。
pubDate: 2026-11-03
updatedDate: 2026-11-03
category: C++
tags:
  - C++
  - 对象模型
  - VTable
type: learning
series: cpp-object-model
seriesTitle: C++ 对象模型实战
seriesOrder: 2
draft: false
---
```

### 8.2 算法题解 Frontmatter

```yaml
---
title: 两数之和
description: 使用哈希表解决数组查找问题。
pubDate: 2026-11-03
category: 数组与字符串
tags:
  - Array
  - Hash Table
type: algorithm
difficulty: Easy
source: LeetCode
sourceUrl: https://leetcode.com/problems/two-sum/
language: cpp
draft: false
---
```

### 8.3 技术实践 Frontmatter

```yaml
---
title: False Sharing 性能测试
description: 通过多线程计数实验验证伪共享的性能影响。
pubDate: 2026-11-03
category: C++ 性能优化
tags:
  - C++
  - Cache
  - Multithreading
type: practice
draft: false
---
```

### 8.4 内容校验

必须使用 Zod Schema 校验 Frontmatter。

要求：

- title 必填。
- description 必填。
- pubDate 必填。
- tags 默认空数组。
- draft 默认 false。
- difficulty 仅允许 Easy、Medium、Hard。
- seriesOrder 必须是正整数。
- 算法题解必须填写 difficulty。
- Frontmatter 不合法时构建失败，并输出明确的错误位置。
- 不允许静默忽略错误文章。

---

## 9. 页面路由

第一阶段至少实现：

| 路径 | 页面 |
|---|---|
| `/` | 首页 |
| `/learning/` | 学习笔记首页 |
| `/learning/[slug]/` | 学习专题详情 |
| `/learning/[...slug]/` | 学习章节文章 |
| `/algorithms/` | 算法题解首页 |
| `/algorithms/[...slug]/` | 算法题解文章 |
| `/practices/` | 技术实践首页（第二阶段） |
| `/practices/[...slug]/` | 实践文章（第二阶段） |
| `/thoughts/` | 技术思考首页（第二阶段） |
| `/thoughts/[...slug]/` | 思考文章（第二阶段） |
| `/tags/[tag]/` | 标签文章列表（第二阶段） |
| `/about/` | 关于页面 |
| `/search/` | 搜索页面（第二阶段） |

所有文章页面使用统一的文章布局，但不同类型可以有不同的元数据展示。

URL 规则：

- 使用英文小写 slug。
- 使用连字符分隔单词。
- 不将中文标题直接作为 URL。
- 发布后尽量保持 URL 稳定。
- 所有站内链接必须使用统一的路由生成逻辑。

---

## 10. 全站搜索（第二阶段）

> 本节已移出第一阶段范围，见 1.3；以下内容保留为第二阶段需求。

使用 Pagefind 实现静态全文搜索。

要求：

1. 搜索标题。
2. 搜索文章正文。
3. 搜索描述。
4. 支持中文内容检索。
5. 搜索结果展示文章标题和摘要。
6. 支持点击跳转。
7. 支持无结果提示。
8. 搜索页面不依赖后端服务。
9. Pagefind 索引在构建阶段生成。

需要特别测试中文分词和中英文混合搜索效果。

如果 Pagefind 对中文搜索存在明显不足，应先评估实际测试结果，再考虑调整分词配置或替代方案。

---

## 11. UI 与交互设计

### 11.1 整体风格

设计方向：

- 简洁
- 技术感
- 低干扰
- 阅读优先
- 类似现代技术文档网站

不要做成复杂的商业门户网站。

### 11.2 页面布局

桌面端：

- 顶部导航固定或正常滚动。
- 内容区域居中。
- 最大宽度建议 1200px。
- 文章正文最大宽度建议 800px。
- 文章页支持侧边目录。

移动端：

- 导航折叠。
- 正文占满可用宽度。
- 代码块允许横向滚动。
- 表格允许横向滚动。
- TOC 使用折叠面板。

### 11.3 主题

支持：

- 浅色模式
- 深色模式
- 跟随系统

主题选择可以保存在浏览器 localStorage 中。

### 11.4 代码块

代码块需要：

- 语法高亮。
- 显示语言。
- 横向滚动。
- 一键复制。
- 暗色主题适配。

### 11.5 文章目录

根据 Markdown 标题自动生成 TOC。

要求：

- 支持 H2、H3。
- 点击目录定位到对应标题。
- 当前阅读章节可以高亮。
- 移动端折叠。

---

## 12. SEO 与基础功能

第一阶段完成：

- 每个页面独立 title。
- description。
- Open Graph 基础信息。
- 合理的语义化 HTML。
- 图片 alt 属性。
- 404 页面。
- favicon。
- RSS 可作为基础增强功能。

域名尚未配置，因此：

- 不要将临时域名写死在业务代码中。
- 通过环境变量或统一站点配置管理正式域名。
- Sitemap 可以在正式域名确定后完成最终配置。

---

## 13. 推荐项目目录

```text
tech-notes/
│
├── public/
│   ├── favicon.svg
│   └── images/
│
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── SearchBox.astro
│   │   ├── ArticleCard.astro
│   │   ├── TagList.astro
│   │   ├── TableOfContents.astro
│   │   ├── CodeBlock.astro
│   │   └── ThemeToggle.astro
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── ArticleLayout.astro
│   │   └── LearningLayout.astro
│   │
│   ├── content/
│   │   ├── learning/
│   │   ├── algorithms/
│   │   ├── practices/
│   │   └── thoughts/
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── learning/
│   │   ├── algorithms/
│   │   ├── practices/
│   │   ├── thoughts/
│   │   ├── tags/
│   │   ├── search.astro
│   │   ├── about.astro
│   │   └── 404.astro
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── article.css
│   │   └── code.css
│   │
│   └── content.config.ts
│
├── scripts/
│   └── validate-content.mjs
│
├── .gitignore
├── astro.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
└── .github/
    └── workflows/
        └── (第二阶段再实现)
```

允许 Codex 根据实际实现调整目录，但必须保持内容、页面、组件和样式之间的职责清晰。

---

## 14. 测试要求

必须验证：

### 页面测试

- 首页正常展示。
- 学习笔记列表正常展示。
- 专题章节顺序正确。
- 算法题解列表正常展示。
- 算法题解详情页正常展示。
- 文章详情页正常展示。
- 404 页面正常展示。

技术实践列表、技术思考列表、标签页面与搜索页面属于第二阶段，第一阶段不验收。

### 内容测试

- Markdown 正常解析。
- 中文标题正常显示。
- 代码高亮正常。
- 数学公式正常（第二阶段）。
- 表格正常。
- 图片正常。
- 站内链接有效。
- 草稿不出现在正式网站。
- Frontmatter 错误能够被发现。

注意：GitHub Public 仓库中的草稿文件本身也是公开的，draft 只能控制网站是否发布，不能用于存放私人内容。

### 构建测试

执行：

```powershell
npm ci
npm run check
npm run build
```

要求：

- TypeScript 检查通过。
- Astro 检查通过。
- 静态构建成功。
- 生成 dist 目录。
- Pagefind 索引生成成功（第二阶段）。
- 构建过程中没有无法解释的错误。

### 本地预览

```powershell
npm run dev
```

浏览器访问：

```text
http://localhost:4321
```

生产构建预览：

```powershell
npm run preview
```

---

## 15. 第一阶段明确不做的事情

以下功能不在本阶段范围内：

- ECS 部署。
- Caddy 配置。
- 域名解析。
- HTTPS 证书。
- GitHub Actions 自动部署。
- 数据库。
- 用户登录。
- 评论系统。
- 网页文章编辑后台。
- 复杂动画。
- 复杂权限系统。
- 在线代码运行。
- 文章点赞和收藏服务端功能。
- 技术实践、技术思考模块页面，全站搜索与阅读体验增强（见 1.3）。

---

## 16. Codex 开发执行计划

请按以下顺序分阶段实施，不要一次性生成全部代码。

### Task 1：初始化工程

- 检查本地 Node.js 和 npm。
- 创建 Astro TypeScript 工程。
- 配置静态输出。
- 安装必要依赖。
- 建立基础目录。
- 确保 npm run build 成功。

### Task 2：内容模型

- 建立四个 Content Collections。
- 建立 Zod Schema。
- 实现 Markdown 加载。
- 准备示例文章。
- 验证内容字段。
- 实现草稿过滤。

### Task 3：基础 UI

- 实现全局布局。
- 实现 Header 和 Footer。
- 实现首页。
- 实现导航。
- 实现响应式布局。
- 实现主题切换。

### Task 4：学习笔记

- 实现专题列表。
- 实现专题详情。
- 实现章节文章页面。
- 实现章节排序。
- 实现上一篇、下一篇导航。
- 实现文章 TOC。

### Task 5：算法题解

- 实现分类与题解列表（按分类筛选、按发布时间排序）。
- 实现题解详情模板。
- 不做难度筛选与标签筛选，`difficulty`、`tags` 仅作为元信息展示。

第一阶段到 Task 5 结束。原 Task 6–8 已移出本次范围，见 1.3，本次不做也不验收。

每个 Task 完成后先运行对应检查，确认通过再进入下一阶段。

---

## 17. 最终交付物

Codex 完成后必须提供：

1. 完整 Astro 项目源码。
2. 完整目录结构。
3. Content Collections 配置。
4. 所有页面和组件。
5. 全局 CSS。
6. 示例 Markdown 文章。
7. 算法题解列表与详情页面。
8. README.md。
9. 本地开发启动说明。
10. 构建与验收结果。

README 至少说明：

- 环境要求。
- 安装依赖。
- 本地启动。
- 新增学习专题。
- 新增章节。
- 新增算法题解。
- 新增技术实践。
- Markdown Frontmatter 规范。
- 本地构建。
- 如何预览构建产物。

---

## 18. Codex 执行约束

1. 先检查当前目录，不要覆盖已有工程。
2. 如果目录非空，先分析现有文件，再决定如何初始化。
3. 每完成一个 Task 都运行检查。
4. 不要为了实现简单功能引入大量依赖。
5. 不要使用虚构数据冒充实际文章数量。
6. 所有示例文章必须标明为示例内容。
7. 不要将私人信息、密钥或服务器配置写入仓库。
8. 不要擅自修改 Windows 系统环境。
9. 不要执行 ECS 部署操作。
10. 遇到技术选型冲突，先说明原因和影响，再选择维护成本较低的方案。

**最终验收标准：**

在 Windows 本地执行：

```powershell
npm ci
npm run check
npm run build
npm run preview
```

网站可以正常运行，所有主要页面和示例文章可以正常访问，搜索和阅读功能正常。

第一阶段完成后，整个项目应当具备直接提交到 GitHub Public 仓库的条件。

