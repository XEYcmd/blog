# XEYcmd 的个人站

个人博客主页：轮换背景、打字机标题、樱花粒子、毛玻璃按钮，中英双语，纯静态。

- 线上（demo）：<https://xeycmd.github.io/xeycmd-blog-dsh/>
- 正式域名：`xeycmd.ccwu.cc`（配好 DNS 后自动切换）
- 文章：Markdown 文件 + `git push` 发布

## 快速开始

```bash
npm install
npm run dev      # 开发预览 http://localhost:4321
npm run build    # 生成 dist/
npm run preview  # 预览生产构建
```

## 写文章

见 [POSTING.md](./POSTING.md)。一句话：往 `content/posts/` 放一个带 frontmatter 的 `.md`，push 上去即可。

## 部署

见 [DEPLOY.md](./DEPLOY.md)。

- 默认按 **GitHub Pages 项目页** 构建（`base = /xeycmd-blog-dsh`）
- 把 `CNAME.custom-domain` 复制成 `public/CNAME`，构建会自动切成**根域名模式**（`base = ''`，`site = https://xeycmd.ccwu.cc`）

## 目录结构

```
content/posts/        文章 Markdown（文件名即 URL）
public/backgrounds/   首页轮换背景图（放进去就自动扫描）
public/fonts/         自托管字体（标题圆体子集 + 等宽拉丁子集）
public/scripts/       构建产物：浏览器端脚本
src/lib/              页面模板、Markdown 渲染、i18n 文案
src/pages/            路由（每个页面都是薄壳，调用 src/lib 的渲染函数）
src/scripts/home.ts   首页交互（打字、粒子、光点拖尾、背景预加载）
src/styles/           CSS（global / home / inner / display-font）
scripts/              构建脚本（字体、样式、客户端脚本、子路径预览）
```

## 技术说明

- **不依赖 `astro:content`**：文章由 `src/lib/data.ts` 直接读 Markdown + 自写 frontmatter 解析，
  避开 Astro 6 在本机出现的 collection 解析问题
- **不依赖 Markdown 库**：`src/lib/markdown.ts` 是自写的零依赖渲染器（标题/列表/表格/代码块/引用/图片/链接）
- **不做评论功能**：纯静态，没有评论区
- 动画全部原生实现：背景交叉淡化是纯 CSS，粒子与光点是 Canvas 2D
- 尊重 `prefers-reduced-motion`，减少动效偏好下自动退化为静态
