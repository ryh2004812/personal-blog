# 个人博客

基于 [VitePress](https://vitepress.dev) 的静态个人博客，含首页、专栏、归档、标签、深色模式与本地搜索。

## 已实现功能

- **首页**：Hero 区块 + 三个专栏入口卡片，下方「最近更新」为纵向列表，按时间倒序展示最新文章
- **专栏页**：嵌入式、软件开发笔记、开源项目三个独立栏目，各自有侧边栏
- **归档页**：文章按年份分组汇总，便于回溯
- **标签页**：自动聚合全部标签，点击可筛选对应文章
- **关于页**：个人信息 / 简介展示
- **本地全文搜索**：基于 VitePress 内置搜索，离线可用
- **深色模式**：跟随系统自动切换，也可手动切换
- **自定义主题**：品牌色、首页卡片、文章排版与交互细节统一调优（见 `theme/style.css`）
- **内容加载器**：`posts.data.ts` 在构建期自动收集所有文章的标题、日期、标签、摘要
- **响应式布局**：桌面与移动端自适应
- **Vercel 部署**：已内置 `vercel.json`，`vercel --prod` 即上线

## 快速开始

### 环境搭建和验证
环境要求：Node.js 20.x（任意发行版均可，无需特定便携版）。

```bash
# 1. 安装 Node.js（任意 20.x 即可，无需原电脑的便携版）
#    推荐用 nvm 或直接装官方 LTS：https://nodejs.org

# 2. 克隆仓库
git clone https://gitee.com/ren2004/personal-blog.git
cd personal-blog

# 3. 安装依赖
npm install

# 4. 本地开发（自动热更新）
npm run dev        # 打开 http://localhost:5173

# 可选
npm run build      # 构建到 docs/.vitepress/dist
npm run preview    # 预览构建产物
```

### 添加新内容

在对应专栏目录下新建 `.md` 文件，frontmatter 保持这四个字段：

```md
---
title: 文章标题
date: 2026-10-05
tags: [标签1, 标签2]
description: 一句话摘要，会显示在列表卡片上
---
```

只有带 `date` 的页面才会被识别为「文章」，出现在归档、标签和首页「最近更新」中。保存后 dev 服务器会自动刷新。

## 目录结构

```text
docs/
├── .vitepress/
│   ├── config.mts              # 站点配置：导航、侧边栏、搜索、页脚
│   └── theme/
│       ├── index.ts            # 扩展默认主题（注入首页「最近更新」）
│       ├── style.css           # 主题样式（品牌色、卡片、排版）
│       ├── components/         # 自定义组件 PostList / PostArchive / RecentUpdates / TagCloud
│       └── data/
│           ├── posts.data.ts   # 内容加载器：构建期收集全部文章
│           └── categories.ts   # 专栏定义
├── index.md                    # 首页
├── archive.md                  # 归档
├── tags.md                     # 标签
├── about.md                    # 关于
├── embedded/                   # 专栏：嵌入式
├── dev/                        # 专栏：软件开发笔记
└── opensource/                 # 专栏：开源项目
```

## 部署到 Vercel（免费）

项目已带 `vercel.json`，无需额外配置。

### 方式一：命令行（最快）

```bash
npm i -g vercel
vercel          # 首次会打开浏览器登录，一路回车
vercel --prod   # 正式部署，得到 https://xxx.vercel.app
```

### 方式二：网页导入（推荐，支持自动部署）

1. 把代码推到 GitHub
2. 打开 [vercel.com/new](https://vercel.com/new) 导入该仓库
3. Framework Preset 选 **VitePress**（或保持 Other，构建配置会读取 `vercel.json`）
4. 之后每次 `git push` 都会自动重新部署

### 绑定自己的域名

在 Vercel 项目 → **Settings → Domains** 里添加域名（如 `renyihao.dev`），按提示去注册商加一条 CNAME 记录指向 `cname.vercel-dns.com`，HTTPS 证书由 Vercel 自动签发。

### 让他人公开访问（关闭部署保护）

新项目默认开启 **Deployment Protection（Vercel Authentication）**，访客需登录 Vercel 账号才能查看。若要所有人直接打开：

1. 打开 [vercel.com/dashboard](https://vercel.com/dashboard) → 进入 `ryh-blog` 项目
2. 左侧 **Settings → Deployment Protection**
3. 将 **Vercel Authentication** 关闭（或把 Production 环境的 Protection 设为 Off）
4. 保存后无需重新部署，立即对所有人生效

若只想放行特定人，可在同一页面把对方邮箱加入 Allowlist。

## 其他托管

`npm run build` 的产物是纯静态文件，也可直接托管到 GitHub Pages、Netlify 或对象存储。
若部署在子路径（如 `example.com/blog/`），需在 `docs/.vitepress/config.mts` 中设置 `base: '/blog/'`。

## 后续计划

- 接入评论系统（Giscus / Waline），支持读者互动
- 生成 RSS 订阅，方便订阅更新
- 文章阅读量 / 访问统计
- 站内搜索升级为 Algolia DocSearch
- 绑定个人域名并配置 HTTPS 自动证书
- 文章封面图与社交分享 OG 图
- i18n 多语言支持
- 友情链接页
- SEO 优化：自动生成 sitemap、robots.txt
