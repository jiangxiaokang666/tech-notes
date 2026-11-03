---
title: "需求和架构（二）"
description: "区分本质复杂性与附带复杂性，为系统变化设计边界。"
pubDate: "2026-10-06"
updatedDate: "2026-10-06"
category: "AI 工程"
tags: ["生成式软件工程", "软件架构"]
type: "learning"
series: "nju-generative-software-engineering"
seriesTitle: "南京大学生成式软件工程"
seriesDescription: "从上下文工程、仓库管理到 Agent Native 与软件演化的个人课程学习笔记。"
seriesOrder: 5
draft: false
sourceUrl: "https://github.com/jiangxiaokang666/nju-gse-notes/blob/9750c910525fdbc02e003b612fc900d62ae206fc/notes/5_%E9%9C%80%E6%B1%82%E5%92%8C%E6%9E%B6%E6%9E%84%282%29.md"
sourceRevision: "9750c910525fdbc02e003b612fc900d62ae206fc"
---

## 怎样驾驭复杂性
- 软件工程的本质，是驾驭这些不断增长的复杂性。
  - 一部分来自问题领域本身，称为本质复杂性 (essential complexity)
  - 另一部分是实现方式额外带来的附带复杂性（accidental complexity)
### 需求工程
- 直面本质复杂性，收缩意图空间中的不确定性。
- 也不是越长越好，每写下一条承诺，就多了一条需要检查、维护并在需求变化时重新审视的约束。到了生成式软件工程里，这些工作还会体现为上下文长度、token开销，以及模型在复杂约束下出错的机会。
### 架构设计
- 分解本质复杂性，减少附带复杂性。
- 承认自己笨 -> 所以必须依靠结构 -> 结构让程序可证明、可修改。
- 好的架构不是只选出一个解，而是设计开放需求空间所对应的解空间。
#### unix: 组合规则比现成用途更有力量
- 设计者提供组合的规则，使用者便可以创造设计者没有想到的用途。
#### 关系数据库
- 分开理解数据与存放数据
#### Internet
- 在持续变化中保持协作
  - 做好数据传输这一件事，基础设施提供足够通用的通信抽象，让上层应用有自己的演化空间。
## 设计原则
- 系统应保存足以重建其余信息的事实依据（source of truth），其他状态尽可能成为计算的结果。
