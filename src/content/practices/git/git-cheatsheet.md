---
title: Git 常用操作速查：cherry-pick、merge、restore
description: 以「命令 + 典型场景 + 易错点」记录日常最容易用错的 Git 操作，并给出冲突处理与误操作后的补救路径。
pubDate: 2026-11-11
category: 开发工具
tags: [Git, 版本控制, 冲突处理]
type: practice
---

本文只记录实际会照抄的命令。每条都标出适用场景和最常见的误操作，遇到问题时先看「误操作急救表」。

## 先建立三个坐标

理解下面三样东西，大部分"我的改动去哪了"都能自己回答：

| 名称 | 含义 | 查看方式 |
| --- | --- | --- |
| 工作区 | 磁盘上的文件 | `git diff` |
| 暂存区（index） | 下次提交的内容 | `git diff --staged` |
| HEAD | 当前分支指向的提交 | `git log -1 --oneline` |

分支只是一个指向提交的指针，`reset` 移动指针，`restore` 只改文件，`revert` 追加新提交。搞混这三者是最常见的错误来源。

## 动手前的通用检查

```bash
git status -sb                        # 当前分支、领先/落后、改动文件
git log --oneline --graph -15         # 最近历史与分叉形状
git diff                              # 工作区相对暂存区
git diff --staged                     # 暂存区相对 HEAD
git reflog -15                        # 所有 HEAD 移动记录，误操作的入口
```

任何破坏性操作前，先确认 `git branch --show-current` 输出的是你以为的分支。

## cherry-pick

**场景**：只需要另一个分支上的某一个修复或功能，不想把整条分支一起合进来。

```bash
git switch main
git cherry-pick 3f2a1bc                     # 应用单个提交
git cherry-pick 3f2a1bc 9c8d7e6             # 多个提交，按给出的顺序应用
git cherry-pick abc123..def456              # 区间：左开右闭，不含 abc123
git cherry-pick abc123^..def456             # 想包含 abc123 时
git cherry-pick -x 3f2a1bc                  # 提交信息追加 (cherry picked from commit ...)
git cherry-pick -n 3f2a1bc 9c8d7e6          # 只落盘不提交，便于把多个提交合成一个
```

冲突时：

```bash
git status                     # 找 both modified
# 编辑冲突文件，删掉 <<<<<<< ======= >>>>>>> 标记
git add <file>
git cherry-pick --continue     # 继续序列中的下一个
git cherry-pick --skip         # 跳过当前这条（改动已被目标分支包含时有用）
git cherry-pick --abort        # 整个序列回滚到执行前
```

**易错点**

- cherry-pick 会生成**新提交**（哈希不同）。原提交后续的改动不会自动跟过来，长期维护同一处逻辑应改用 merge 或 rebase。
- 区间 `A..B` 不含 A，这是最常见的漏提交原因。
- 应用顺序是命令行顺序，不是提交时间顺序。
- 目标分支已有等价改动时会冲突或产生空提交。先 `git log --grep` 或 `git log -S"关键代码"` 查重，别急着 pick。
- 冲突解决后不要直接 `git commit` 收尾，用 `--continue` 才能正确结束整个序列并保留记录。

## merge

**场景**：把功能分支合回主干，或同步远端主干。

```bash
git switch main
git merge --no-ff feature/login        # 强制生成合并提交，历史能看出功能边界
git merge --ff-only origin/main        # 只允许快进，有分叉就直接失败，最安全
git merge --squash feature/login       # 压缩成一次未提交的改动，需自己 commit
git merge --no-commit --no-ff feature/login   # 先看合并结果再决定是否提交
git merge --abort                      # 冲突时放弃，回到 merge 之前
```

快进与三方合并的区别：主干在分叉后没有新提交时，默认直接快进、不产生合并提交；有分叉时才做三方合并。

冲突处理流程与 cherry-pick 相同，区别是结束方式为 `git add` 后 `git commit`（不是 `--continue`）。

**易错点**

- 在错误的分支上执行 merge。合并前一定确认当前分支。
- 为了"同步主干"把 main 合进 feature 再推远端，会污染功能分支历史。同步主干优先用 `git rebase origin/main`，或明确约定团队接受反向合并。
- 冲突解决后的默认信息是 `Merge branch 'x'`，需要说明冲突如何解决时手动改写。
- 撤并：本地未推送用 `git reset --hard ORIG_HEAD`；已推送共享分支用 `git revert -m 1 <merge-hash>`，并且以后重新合并该分支前要先 revert 那个 revert。

## restore

**场景**：撤销文件改动，不涉及历史。`restore` 自 2.23 起从 `checkout` 拆出，只做文件恢复，比 `checkout` 更难误伤分支。

```bash
git restore README.md                          # 丢弃工作区修改（回到暂存区版本）
git restore --staged README.md                 # 取消暂存，工作区改动保留
git restore --staged --worktree README.md      # 暂存区和工作区一起回到 HEAD
git restore --source=HEAD~1 README.md          # 取历史版本写入工作区
git restore --source=3f2a1bc --staged --worktree src/   # 整个目录回滚到某次提交
git restore .                                  # 危险：丢弃当前目录全部未暂存修改
git restore --staged .                         # 全部取消暂存
```

**易错点**

- 只影响**已跟踪**文件。新建但未 `git add` 的文件要用 `git clean -n` 先预览、`git clean -fd` 再删除，且不可恢复。
- 不带 `--staged` 时只改工作区，容易出现"以为撤销了提交，其实只是改了文件"。
- 丢弃的未暂存修改不进 reflog，无法找回（只有 IDE 本地历史可能留有副本）。
- 想恢复被删文件：`git restore <file>`；想整体回到某次提交用 `git restore --source=<hash> --worktree .`，但别在共享分支上这么做。

## 只同步另一个分支的几个文件

**场景**：只要 main 上几个配置文件或工具脚本，不想 merge 整个分支，也不想把对方的提交历史带过来。

先比对，别直接覆盖：

```bash
git fetch origin                                  # 跨远端时先取最新
git diff --stat origin/main -- src/config/        # 目录级差异概览
git diff origin/main -- src/config/app.ts         # 具体改了什么
```

按路径取目标分支的**文件快照**，不产生提交：

```bash
git restore --source=origin/main -- src/config/app.ts                    # 只写工作区，不进暂存区
git restore --source=origin/main --worktree -- src/config/               # 整个目录
git restore --source=origin/main --staged --worktree -- src/config/app.ts # 直接进暂存区
```

老写法，注意它会**同时写入索引**（等价于 `--staged --worktree`）：

```bash
git checkout origin/main -- src/config/app.ts
```

只要内容、先不落盘时用重定向，完全不碰索引：

```bash
git show origin/main:src/config/app.ts > src/config/app.ts
```

只想应用**某次提交里这几个文件的改动**（而不是目标分支的整体快照）：

```bash
git diff 3f2a1bc^ 3f2a1bc -- src/config/app.ts | git apply --3way
```

`--3way` 在补丁对不上时用三方合并兜底，并且会直接把结果放进暂存区；失败则不写入，比 `patch` 更安全。

收尾与确认：

```bash
git status
git diff --staged
git commit -m "chore: 同步 main 的配置文件"
```

**易错点**

- 这几种写法都只按路径取快照，历史里不会记录"文件来自哪个分支"，来源要写进提交信息，否则日后只能靠猜。
- 都会覆盖本地未提交的修改：动手前 `git stash`，或先用 `git diff <branch> -- <path>` 确认这些改动确实可以丢弃。
- 源分支有、本地没有的文件会被创建为**未跟踪文件**，要 `git add` 才会进入提交；源分支上删除的文件不会因此删掉本地文件。
- `git restore --source` 是整体覆盖，没有冲突合并过程。需要保留自己的改动逐行合并时，改用 `git diff ... | git apply --3way`。
- 路径写错会报 `pathspec ... did not match`，先用 `git ls-tree origin/main -- <path>` 确认目标分支里的确切路径和大小写。
- 别在脏工作区执行 `git checkout origin/main -- .`，一次覆盖所有路径后，很难再挑出哪些是自己的改动。

## 撤销已提交：reset 还是 revert

| 命令 | 作用范围 | 用在哪 |
| --- | --- | --- |
| `git reset --soft HEAD~1` | 只移动分支指针，改动留在暂存区 | 本地改提交信息或合并提交 |
| `git reset HEAD~1` | 指针回退，改动留在工作区（默认 `--mixed`） | 本地拆提交 |
| `git reset --hard HEAD~1` | 指针、暂存区、工作区全部回退 | 本地丢弃提交，需确认没有未提交改动 |
| `git revert <hash>` | 追加一个反向提交 | 已推送的共享分支 |

判断标准：提交是否已经推到别人会拉取的分支。推过就用 `revert`，不要在共享分支上 `reset --hard` 后强推。

## 误操作急救表

| 发生了什么 | 怎么查 | 怎么退 |
| --- | --- | --- |
| 提交信息写错，未推送 | `git log -1` | `git commit --amend` |
| 提交内容漏了文件，未推送 | `git show --stat HEAD` | `git add <file>` 后 `git commit --amend --no-edit` |
| 提交到错误分支，未推送 | `git log --oneline -3` | 在目标分支 `git cherry-pick <hash>`，再在原分支 `git reset --hard HEAD~1` |
| 刚 `reset --hard` 后悔 | `git reflog -20` | `git reset --hard <reflog 里的哈希>` |
| 删掉的分支还没合并 | `git reflog` 或 `git branch --contains` | `git branch <name> <hash>` |
| 合并/变基到一半发现方向错了 | `git status` 提示 in progress | `git merge --abort` 或 `git rebase --abort` |
| 误提交了大文件或密钥 | `git log --stat` | 未推送可 `commit --amend` 或交互式 rebase；已推送视为泄露，先轮换凭据再考虑 `git filter-repo` |

## 日常习惯

- 提交前看 `git diff --staged`，确认暂存的就是想提交的。
- 执行 `reset --hard`、`clean -fd`、强推之前，先 `git stash` 或 `git branch backup-20261111` 留后路。
- 拉取用 `git pull --ff-only`，冲突和合并时机更可控；需要线性历史时 `git fetch` 后 `git rebase origin/main`。
- 共享分支只 `revert`，不 `reset`；强推前确认分支没有其他人在用。
