---
title: 两数之和（示例）
description: 用于验证算法题解元数据的示例文章。
pubDate: 2026-11-03
category: 数组与字符串
tags: [Array, Hash Table]
type: algorithm
difficulty: Easy
source: LeetCode
sourceUrl: https://leetcode.com/problems/two-sum/
---

> 示例内容：用于验证内容模型，并非完整题解。

## 题目描述

给定整数数组和目标值，寻找两个不同下标，使对应元素之和等于目标值。

## 解题思路

遍历时用哈希表记录已访问的值与下标，查找当前值所需的补数。

## 复杂度分析

使用哈希表时，平均时间复杂度为 O(n)，额外空间复杂度为 O(n)。
