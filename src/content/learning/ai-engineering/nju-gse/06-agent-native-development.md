---
title: "Agent Native 开发"
description: "Agent Native、Harness、反馈循环和 CI/CD 门控。"
pubDate: "2026-11-01"
updatedDate: "2026-11-01"
category: "AI 工程"
tags: ["生成式软件工程", "AI Agent", "Harness"]
type: "learning"
series: "nju-generative-software-engineering"
seriesTitle: "南京大学生成式软件工程"
seriesDescription: "从上下文工程、仓库管理到 Agent Native 与软件演化的个人课程学习笔记。"
seriesOrder: 6
draft: false
sourceUrl: "https://github.com/jiangxiaokang666/nju-gse-notes/blob/9750c910525fdbc02e003b612fc900d62ae206fc/notes/6_Agent_Native%E5%BC%80%E5%8F%91.md"
sourceRevision: "9750c910525fdbc02e003b612fc900d62ae206fc"
---

## Agent Native 开发

来源：[Lecture 8](https://jyywiki.cn/GSE/2026/lect8.md)

### 核心概念

- **Agent Native**：将 Agent 作为开发参与者，围绕它设计工作环境。
- **Harness**：Agent 使用的工具、知识、运行环境、约束与反馈机制。
- **Ralph Loop**：同一任务反复执行；提示词不变，工作区状态持续变化。
- **状态机视角**：工作区是状态，Agent 的一轮工作是状态迁移。
- **Long-horizon task**：跨多个步骤、会话的长期任务；依赖持久化状态交接。
- **CI：持续集成**：小改动频繁合入主干，自动构建、测试。
- **Continuous Delivery：持续交付**：始终保持可发布状态，上线时机可由人决定。
- **Continuous Deployment：持续部署**：通过检查后自动发布。
- **Hook**：事件触发指定动作，如提交后检查、主干更新后部署。
- **Lint**：静态检查格式、可疑写法与项目约定；不能替代行为测试。

### 开发循环

原型 → 运行与观察 → 定位问题层次 → 修改 → 验证。

- 问题层次：实现不符合规格／规格未表达需求／需求假设不成立。
- Ralph Loop 必备：验收标准、预算、停止条件、重复失败处理。
- 工作区交接信息：目标、已完成事项、验证证据、失败位置、剩余任务。
- 并行开发条件：任务可拆分、依赖明确、工作区隔离、集成检查。

### CI/CD 门控

- 合并前：Lint、测试、与最新主干组合检查；失败禁止合并。
- 发布前：检查和构建全部成功，部署对应提交的产物。
- 发布失败：保留上一版。
- 并发发布：防止旧产物覆盖新版本。
- 例外放行：明确权限与记录。
- 门控验收：主动制造 Lint、测试失败，检查是否阻止合并和发布。

### Harness 建设要点

- 知识外部化：决策背景、约束、理由进入版本管理；入口文档提供导航。
- 行为可观察：Agent 能启动实例、操作页面、读取日志。
- 规则可执行：架构依赖方向、格式、复杂度等进入自动检查。
- 持续清理：消除重复、修正文档、抑制坏模式扩散。
- 反馈可行动：报告违规位置、失败原因与修复方向。
- 标准独立：不能为通过检查擅自删断言或降低要求。

### 实践案例

- **Stripe Minions**：Blueprint 混合工作流：模型处理判断，程序执行固定工序；限制 CI 重试次数。
- **Anthropic C 编译器**：GCC 作参照，切换部分文件的编译器，缩小失败集合，拆分并行任务。
- **StrongDM**：独立用户场景验收；外部服务行为替身；检查多次执行是否满足用户意图。

### 关键边界

- 自动检查通过 ≠ 用户需求成立。
- 持续清理技术债 ≠ 修复失效的架构假设。
- 增加 Agent 数量 ≠ 任务自动可并行。
- 服务替身通过 ≠ 真实系统行为一致。
- Token 预算提供试错机会；工程判断还依赖分析反馈与实践改进。
