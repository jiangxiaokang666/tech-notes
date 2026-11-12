---
title: "用 std::map::emplace 合并查找与插入"
description: "用 emplace 的返回值判断键是否新增，并区分插入默认值、向 vector 追加元素和延迟构造的场景。"
pubDate: 2026-11-12
category: C++
type: learning
series: cpp-stl
seriesTitle: "C++ STL 使用技巧"
seriesDescription: "记录标准库容器和算法在日常开发中的用法。"
seriesOrder: 1
tags: [STL, map]
---

## 用一次操作判断键是否新增

假设用 `std::map<int, std::string>` 保存玩家 ID 和名字，重复注册时保留第一次写入的名字。先 `find` 再 `emplace` 的写法，在键不存在时会先查找，再由插入操作确定位置。

```cpp
if (auto it = players.find(id); it != players.end()) {
    std::cout << "Already registered: " << it->second << '\n';
} else {
    players.emplace(id, name);
}
```

直接使用 `emplace` 的返回值，就能同时拿到迭代器和插入结果。下面的例子可以用 C++17 编译。

```cpp
#include <cassert>
#include <map>
#include <string>

int main()
{
    std::map<int, std::string> players;

    const auto [first, added] = players.emplace(42, "Alice");
    assert(added);
    assert(first->second == "Alice");

    const auto [existing, addedAgain] = players.emplace(42, "Bob");
    assert(!addedAgain);
    assert(existing == first);
    assert(existing->second == "Alice");
}
```

| 键的状态 | 迭代器指向 | 布尔值 |
| --- | --- | --- |
| 不存在 | 刚插入的元素 | `true` |
| 已存在 | 原有元素，值保持原样 | `false` |

`emplace` 的时间复杂度是 `O(log n)`。C++11 起可以用 `result.first` 和 `result.second` 读取返回值，C++17 起可以用上面的结构化绑定。

## 如果 push 指的是向 vector 追加元素

`std::map` 通过 `emplace` 等接口插入键值对。假设 map 的值是 `std::vector<int>`，`push_back` 操作的是这个 vector。如果每次都要追加，键不存在时可以先创建一个空 vector。

```cpp
std::map<int, std::vector<int>> itemsByPlayer;

// C++17，键不存在时才默认构造 vector。
auto [it, inserted] = itemsByPlayer.try_emplace(playerId);
it->second.push_back(itemId);
// inserted 可用于只在第一次创建分组时执行的逻辑。
```

只需要追加元素时，可以写成 `itemsByPlayer[playerId].push_back(itemId)`，它也会在键不存在时创建空 vector。如果只有键已经存在时才允许追加，继续使用 `find`。

## 值的构造成本较高时用 try_emplace

键已存在时，`emplace` 仍可能先构造候选元素，再将它销毁。C++17 的 `try_emplace(key, args...)` 在键不存在时才用 `args...` 构造值。对于 `std::map<int, std::string>`，`players.try_emplace(id, 1024, 'x')` 只在插入时才构造包含 1024 个 `x` 的字符串。

调用前依然会求值实参。例如 `players.try_emplace(id, MakeName())` 每次都会调用 `MakeName()`。如果还要跳过生成值的函数调用，可以保留 `find`，并把调用放在键不存在的分支里。

如果业务要求重复键覆盖旧值，可以用 C++17 的 `players.insert_or_assign(id, name)`。
