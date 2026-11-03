---
title: "欢迎来到未来"
description: "AI 时代的软件生产方式，以及人的目标、上下文与验证职责。"
pubDate: "2026-09-10"
updatedDate: "2026-09-12"
category: "AI 工程"
tags: ["生成式软件工程", "AI Agent"]
type: "learning"
series: "nju-generative-software-engineering"
seriesTitle: "南京大学生成式软件工程"
seriesDescription: "从上下文工程、仓库管理到 Agent Native 与软件演化的个人课程学习笔记。"
seriesOrder: 1
draft: false
sourceUrl: "https://github.com/jiangxiaokang666/nju-gse-notes/blob/9750c910525fdbc02e003b612fc900d62ae206fc/notes/1_%E6%AC%A2%E8%BF%8E%E6%9D%A5%E5%88%B0%E6%9C%AA%E6%9D%A5.md"
sourceRevision: "9750c910525fdbc02e003b612fc900d62ae206fc"
---

## 概述
> AI已经能完成大量“从需求到代码”的工作。人的核心价值正在从亲自写代码，转向提出目标、澄清需求、组织上下文、设计验证，并带着AI完成它单独做不到的事情。

### 1.为什么叫“欢迎来到未来”
软件生产方式发生了变化。
> 过去：人理解需求、设计方案、编写代码、调试测试。
> 现在：人描述目标，Agent读取项目、调用工具、修改代码、运行测试并循环修复。
> 将来：“智能”越来越便宜，代码本身不再是最稀缺的东西。
### 2.“没有Token就退学”
只是强调性的教学表达，不是字面上的退学要求。
只看教程、只用免费聊天窗口，难以真正理解不同模型。
- 能力边界
- 调用成本
- 响应速度
- 长任务稳定性
- 幻觉和失败模式
### chat、copilot和agent的区别
- chat:问一次，模型答一次
- copilot：持续获得你正在做什么的上下文，辅助下一步工作
- agent:大模型加上工具调用和循环执行
### 上下文工程比“神奇提示词”更重要
### AI时代的软件工程没有消失
- 需求与产品设计
- 知识和上下文管理
- 敏捷开发与版本控制
- CI与CD
- 测试、验证和调试
- 安全与代码审查
- 技术债与重构
- 软件架构
- AI-native系统
## 我的理解
- code is cheap , show me the talk
- agent的本质是模型、工具和反馈循环
- 带着AI做AI单独做不到的事情
- 任何生成结果都必须通过考验复现的证据验收
