---
title: "DeepSeek Harness"
description: "梳理 Agent Loop、插件、Session 事件与 GenUI。"
pubDate: "2026-11-01"
updatedDate: "2026-11-01"
category: "AI 工程"
tags: ["生成式软件工程", "DeepSeek", "Harness"]
type: "learning"
series: "nju-generative-software-engineering"
seriesTitle: "南京大学生成式软件工程"
seriesDescription: "从上下文工程、仓库管理到 Agent Native 与软件演化的个人课程学习笔记。"
seriesOrder: 7
draft: false
sourceUrl: "https://github.com/jiangxiaokang666/nju-gse-notes/blob/9750c910525fdbc02e003b612fc900d62ae206fc/notes/7_DeepSeek_Harness.md"
sourceRevision: "9750c910525fdbc02e003b612fc900d62ae206fc"
---

## DeepSeek Harness

来源：[Lecture 9](https://jyywiki.cn/GSE/2026/lect9.md)

### Agent Loop 与可靠性

- 最小循环：用户目标 → 模型请求 → 工具执行 → 结果回填上下文 → 继续请求。
- 本质复杂性：可靠恢复、权限、预算等产品要求；不会因循环代码简短而消失。
- 偶然复杂性：重复存储状态、复制恢复逻辑等实现负担。
- 重试分类：临时故障可有限重试；输入或权限错误需改变条件；结果未知时先核实实际状态。
- **幂等性**：同一逻辑操作重复提交，不产生额外业务效果；使用稳定操作标识，并协调执行与结果记录。
- 暂停停止新步骤并保留进度；取消不自动撤销已完成修改；恢复需检查外部变化。
- 权限必须落实为执行约束；外部文档中的指令不构成用户授权。

### 架构与抽象边界

- 架构：接受接口与行为限制，换取复用、隔离、可测试性。
- **抽象泄漏**：隐藏的资源成本或旧假设重新影响上层。
- Event Sourcing：记录事实，再计算状态；回放不能重复外部副作用，历史输入与规则需明确。
- MapReduce：`map → 按 key 分组 → reduce`；框架提供并行、调度、重试，应用负责副作用幂等性。
- Spark：多阶段依赖与数据缓存；RDD 丢失分区可按转换关系重算。
- Flink：持续处理有状态数据；水位线表达事件时间进度；恢复需协调输入位置与算子状态。

### Everything Is a Plugin

- 插件范围：模型适配器、工具、会话日志、默认 Agent Loop。
- Cordis：服务解析、依赖激活、作用域、卸载；作用域不等于安全沙箱。
- 共同对象：**Session 记录事实，Agent 推动执行，slots 装配界面**。
- 插件可保留私有状态，通过共同接口协作；拆包本身不保证解耦。

### Session：事实与投影

- `Session = list[Event]`：有序事件，不限于聊天消息。
- **投影**：从同一事件历史计算模型上下文、界面或业务状态。
- `session.append(type, data)`：追加业务事件。
- `session/event`：观察已提交事实；进入历史不等于已持久化。
- `session.deriveMessages()`：生成模型消息。
- `ctx.sessionProjections.register(...)`：注册业务投影。
- `ctx.sessionProjections.stateOf(session, key)`：读取投影状态。

### Agent：输入与执行控制

- `followup(message)`：排入新一轮并唤醒执行。
- `inject(message)`：补充上下文，不唤醒空闲 Agent。
- `steer(message)`：向最近的后续步骤提交引导，空闲时可唤醒；不撤销正在执行的操作。
- `ctx.systemPrompt.context(...)`：动态读取当前状态，避免提示词信息过期。
- `agent/pre-step`：参与尚未执行的步骤决策。
- `next()`：委托后续处理链；不调用可能短路。
- 已发生事实通过新增记录纠正；未来行为通过决策 Hook 调整。

### 插件协作约束

- 明确事件归属、执行顺序、冲突裁决与卸载后的状态处理。
- Hook 顺序影响语义；局部合理不保证组合合理。
- 卸载清理监听与注册，不撤销已修改的文件等外部效果。
- Creator Mode：用户表达需求 → Agent 编写、装配插件 → 现场体验与修改。

### 已有应用的 AI 增强

- 基本接口：**锁定对象 + 序列化对象 + UI**。
- Excalidraw：锁定选区及绑定文字 → 交给 Session → `replace_selection` 提交替换 → 校验边界并暂存 → 本轮成功后应用。
- 停止、超时或失败：解锁并保留原选区；每张画布对应一个会话。

### GenUI

- HTML/JavaScript 交互卡片与 Session 双向通信。
- 用户操作与状态进入上下文，模型回应驱动界面更新。
- 程序维护对象、规则与合法性；模型负责选择与解释。
