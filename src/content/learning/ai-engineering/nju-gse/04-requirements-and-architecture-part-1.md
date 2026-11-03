---
title: "需求和架构（一）"
description: "需求工程、软件架构与 Event Sourcing、CQRS、DDD。"
pubDate: "2026-10-06"
updatedDate: "2026-10-06"
category: "AI 工程"
tags: ["生成式软件工程", "软件架构"]
type: "learning"
series: "nju-generative-software-engineering"
seriesTitle: "南京大学生成式软件工程"
seriesDescription: "从上下文工程、仓库管理到 Agent Native 与软件演化的个人课程学习笔记。"
seriesOrder: 4
draft: false
sourceUrl: "https://github.com/jiangxiaokang666/nju-gse-notes/blob/9750c910525fdbc02e003b612fc900d62ae206fc/notes/4_%E9%9C%80%E6%B1%82%E5%92%8C%E6%9E%B6%E6%9E%84%281%29.md"
sourceRevision: "9750c910525fdbc02e003b612fc900d62ae206fc"
---

## 概述
我们究竟要做什么？应该怎样组织这个系统，才能承受下一次需求变化？

## 需求、产品设计、架构
- 需求、产品设计、架构成为撬动软件生产力的杠杆
### 需求工程
- 需求爆炸
- 客户说不清楚明确的需求
- 说清楚了，也未必能达成一致
- 软件增长，维护成本不断增加
### 软件架构
“跳出问题看问题”
- 驾驭复杂性，应对变化
  - 简化问题、安放复杂性、减少依赖
  - 应对需求的变化、降低维护成本
  - 甚至再小的代码都有架构
- 好的架构
  - 复杂性有归处、变化有边界
- 中间表示 IR(Intermediate Representation) 
  - 类似软件工程中的中间层
- 事件溯源 Event Sourcing
  - 状态变化保存在事件序列里，并让状态能够由这些记录重建。
- 命令与查询职责分离 CQRS(Command Query Responsibility Segregation)
  - 命令表达一个业务意图，查询则服务于不同使用者
  - 写模型集中维护业务约束，读模型可以为查询准备专门的数据结构，适当冗余或预计算。
  - 并发处理
    - 读模型通过异步处理时间更新，可能出现短暂的间隙。
- 领域驱动设计 DDD(Domain-Driven Design)
  - 在一个明确边界内，同一个词应当具有一致的含义，这就是统一语言。
  - 边界之间传递信息时，也要明确含义。
