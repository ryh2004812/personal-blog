---
title: Git 常用命令速查
date: 2026-09-10
tags: [Git, 工具]
description: 日常最常用的 Git 命令清单，按使用场景整理。
---

# Git 常用命令速查

只保留日常最高频的命令，按「我要做什么」组织。

## 基础提交

```bash
git status                 # 查看当前状态
git add <file>             # 把文件加入暂存区
git add .                  # 加入全部改动
git commit -m "msg"        # 提交到本地仓库
git diff                   # 查看工作区与暂存区的差异
git diff --cached          # 查看暂存区与上次提交的差异
```

## 撤销与回退

区分四个词：**工作区、暂存区（index）、本地仓库、远程仓库**。

| 场景 | 命令 |
| --- | --- |
| 丢弃工作区某个文件的修改 | `git restore <file>` |
| 把已 `add` 的文件撤回工作区 | `git restore --staged <file>` |
| 修改上一次的提交信息 | `git commit --amend -m "new msg"` |
| 重新提交但保留原信息 | `git commit --amend --no-edit` |
| 撤销某次提交，但保留历史 | `git revert <commit>` |
| 彻底回到某个提交，丢弃之后所有 | `git reset --hard <commit>` |
| 丢弃工作区全部修改 | `git checkout -- .` |
| 删除未跟踪的文件和目录 | `git clean -fd` |

::: warning
`git reset --hard` 会丢弃工作区未提交的改动且难以找回。如果已经 push 过，改用 `git revert`，它生成一个新的「反向提交」，不改写历史，对协作更安全。
:::

## 分支

```bash
git branch                 # 查看本地分支
git branch -a              # 含远程分支
git switch -c feature/xxx  # 新建并切换（推荐）
git switch master          # 切换分支
git branch -d feature/xxx  # 删除已合并分支
git branch -D feature/xxx  # 强制删除未合并分支
```

> `git switch` / `git restore` 是 Git 2.23 之后拆出来的命令，比 `git checkout` 语义清晰，建议替代它。

## 临时切换：stash

```bash
git stash                  # 暂存当前改动
git stash -u               # 连同未跟踪文件一起
git stash list             # 查看列表
git stash pop              # 恢复最近一次并删除
```

## 远程协作

```bash
git clone <url>            # 克隆远程仓库
git remote -v              # 查看远程地址
git fetch origin           # 只拉取不合并
git pull                   # 拉取并合并
git push -u origin master  # 首次推送并建立上游跟踪
git push                   # 之后直接推送
git push --force-with-lease origin master  # 强制推送但更安全，会先检查是否有他人新提交
```

::: tip
优先用 `--force-with-lease` 而不是 `--force`，前者在别人已经往该分支推了新提交时会拒绝执行，避免覆盖他人工作。
:::

## 子模块

```bash
git submodule update --init   # 拉取并初始化子模块（克隆后常用）
```

## 查看配置

```bash
git config --list             # 列出当前所有 Git 配置
```

## 排查与定位

```bash
git log --oneline --graph  # 图形化看提交历史
git log -p <file>          # 看某个文件的改动历史
git blame <file>           # 逐行看最后修改者
git reflog                 # 救命稻草：找回「丢失」的提交
```

`git reflog` 记录 HEAD 的每一次移动。误操作 `reset --hard` 之后，用它找到之前的 commit hash 再 `git reset --hard <hash>` 就能救回来（只要还没被 GC）。
