---
title: 对象内存布局（示例）
description: 用于验证学习笔记集合的示例章节。
pubDate: 2026-11-03
category: C++
tags: [C++, 对象模型]
type: learning
series: cpp-object-model
seriesTitle: C++ 对象模型（示例专题）
seriesOrder: 1
---

> 示例内容：用于验证内容模型，并非完整教程。

## 观察对象大小

使用 `sizeof` 观察对象大小；具体结果取决于编译器与目标平台。

```cpp
#include <iostream>

struct Point { int x; int y; };

int main() {
    std::cout << sizeof(Point) << '\n';
}
```

### 记录环境

| 项目 | 记录内容 |
| --- | --- |
| 编译器 | 名称及版本 |
| 目标平台 | 操作系统及架构 |
