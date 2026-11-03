---
title: "软件仓库管理"
description: "Git、分支协作与 AI 时代可追踪的软件仓库管理。"
pubDate: "2026-09-12"
updatedDate: "2026-09-16"
category: "AI 工程"
tags: ["生成式软件工程", "Git"]
type: "learning"
series: "nju-generative-software-engineering"
seriesTitle: "南京大学生成式软件工程"
seriesDescription: "从上下文工程、仓库管理到 Agent Native 与软件演化的个人课程学习笔记。"
seriesOrder: 3
draft: false
sourceUrl: "https://github.com/jiangxiaokang666/nju-gse-notes/blob/9750c910525fdbc02e003b612fc900d62ae206fc/notes/3_%E8%BD%AF%E4%BB%B6%E4%BB%93%E5%BA%93%E7%AE%A1%E7%90%86.md"
sourceRevision: "9750c910525fdbc02e003b612fc900d62ae206fc"
---

## 概述
主要讲解软件仓库管理软件在开发过程中的作用，特别是使用Agent后。  
软件仓库是软件工程的“可追踪历史 + 协作边界 + 项目上下文”  
讲解了 Git 如何和[最佳实践](https://sethrobertson.github.io/GitBestPractices/)，鼓励学生深入去理解 git 原理。  
并提出了思考，如果 Agent 能力快了1000倍，怎么解决项目管理问题。

## 软件仓库
- 源代码
- 文档
- 配置
- 测试
- 构建脚本
- 自动化流程( CL/CD )

## Git
> 记录软件项目在不同时间点的状态
> 每个 Commit 对应历史中的一个确定状态
> 让历史可检验，备份与恢复，一个 change 对应一个意图
> 避免 AI-native 导致的一团混沌，现在还没有无限大能力模型

### Git 的不同区域
- 工作区
- 暂存区
- 本地仓库

### 多分支开发
> 解决多人或者多个任务同时开发的问题。

#### Merge 和 Rebase
  - Merge 保留真实分支历史，操作安全，团队协作容易理解
  - Rebase 把 feature的提交移动到最新的main之后
    - 会重写Commit历史
  - 常见规则
    - 自己的本地分支 -> 可以 rebase
    - 已经共享出去的公共历史 -> 谨慎 rebase
  - cherry-pick
    - 把另一分支上的某一个（或几个）提交，单独复制到当前分支
  
### 远程仓库

## 仓库文档同样重要
> 可以告诉AI，项目是什么，怎么构建，代码在哪里，架构是什么，有哪些约束，如何测试

## AI时代的软件仓库
> 程序员 -> Promt/Issue -> AI Agent -> Repository -> 读取 Context -> 修改代码
> -> git diff -> Test -> Commit/PR -> Human Review
