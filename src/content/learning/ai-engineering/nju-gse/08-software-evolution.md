---
title: "软件的演化"
description: "记录软件的时间维度、架构演进与工程判断。"
pubDate: "2026-11-01"
updatedDate: "2026-11-01"
category: "AI 工程"
tags: ["生成式软件工程", "软件演化"]
type: "learning"
series: "nju-generative-software-engineering"
seriesTitle: "南京大学生成式软件工程"
seriesDescription: "从上下文工程、仓库管理到 Agent Native 与软件演化的个人课程学习笔记。"
seriesOrder: 8
draft: false
sourceUrl: "https://github.com/jiangxiaokang666/nju-gse-notes/blob/9750c910525fdbc02e003b612fc900d62ae206fc/notes/8_%E8%BD%AF%E4%BB%B6%E7%9A%84%E6%BC%94%E5%8C%96.md"
sourceRevision: "9750c910525fdbc02e003b612fc900d62ae206fc"
---

## 软件的演化

来源：[Lecture 10](https://jyywiki.cn/GSE/2026/lect10.md)

### 航母不是一天时间造成的
- 平滑演进的
### 软件的“时间维度”
- 架构很重要，给变化留下修改空间
  - 状态机模型
      - Fix, feature, chore, refactor
- 版本历史帮助解释那些例外从何而来
  - 我们总是用“简化”的版本理解软件
### 现在需要足够好的 Taste-bench
- 多维度的相对比较
    - 是否贴合问题、是否容易理解、下一次修改有多贵？
    - 再给一个后续需求，观察原来的优劣是否反转
## 回到 DeepSeek Harness
- 展示了“航母”构建的过程
- 提交记录
  - 设计有来由
  - 写作有边界
  - 验收有层次
  - 经验能积累
## AI 在大空间中采样仍然容易迷失方向
- 项目总体仍然是由人驾驭的
- 生产“与人类对齐”的好代码
  - 找到所有“不好”的特征，并强行排除
    - dsh-prose-standard 编写规范：写足够文字保住契约，删掉推理过程，重复和修饰
    - lint 代码审查
## 反例越积越多，仍然可能不收敛
