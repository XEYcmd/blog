# 发布文章

发文章 = **新建一个 Markdown 文件 → git push**。推上去之后 GitHub Actions 会自动构建并发布，几分钟后线上就能看到。

## 1. 新建文件

在 `content/posts/` 下新建 `你的文章名.md`，**文件名就是 URL**：

- `content/posts/hello-world.md` → `https://xeycmd.ccwu.cc/posts/hello-world/`
- 建议用英文小写 + 连字符，避免中文和空格带来的编码问题

## 2. 写 frontmatter

文件开头两行 `---` 之间是元信息：

```md
---
title: 文章的标题
date: 2026-10-24
lang: zh
summary: 一句话摘要，会显示在列表页和搜索结果里。
tags: [标签A, 标签B]
---

正文从这里开始。
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | ✅ | 文章标题 |
| `date` | ✅ | 日期，`YYYY-MM-DD`，列表按它倒序 |
| `lang` | ❌ | `zh` 或 `en`，默认 `zh`，列表页会显示语言标签 |
| `summary` | ❌ | 摘要，也会用作 meta description |
| `tags` | ❌ | 标签数组 |
| `draft` | ❌ | 设为 `true` 时构建会跳过这篇文章 |

## 3. 正文写法

支持这些 Markdown 语法：

```md
## 二级标题（会自动生成右侧目录）
### 三级标题

**粗体** *斜体* ~~删除线~~ `行内代码`

[链接](https://example.com)
![图片](/backgrounds/example.jpg)

> 引用

- 无序列表
- 第二项

1. 有序列表

| 表头 | 表头 |
| --- | --- |
| 单元格 | 单元格 |

```js
// 代码块，会显示语言标签
console.log('hi');
```

---

分割线
```

> 标题 `##` 和 `###` 会自动进入文章顶部的「本页目录」，超过两条才显示。

## 4. 发布

```bash
git add content/posts/你的文章名.md
git commit -m "post: 文章标题"
git push
```

推完可以在仓库的 **Actions** 页面看构建进度，绿色勾出现后刷新线上页面即可。

## 5. 本地预览（可选）

```bash
npm run dev      # 起开发服务器，改文件即时刷新
```

或者构建后预览生产版本：

```bash
npm run build
npm run preview
```

## 小贴士

- 图片放 `public/` 下，正文里用 `/图片路径` 引用（会原样复制到产物里）
- 首页背景图放 `public/backgrounds/`，构建时自动扫描，不用改代码
- 改完首页的打字文案等，需要重跑 `npm run font` 重新裁剪标题字体（否则新字可能用系统字体兜底）
- 不打算做评论功能，所以文章页没有评论区；想讨论可以留 GitHub 链接或邮箱
