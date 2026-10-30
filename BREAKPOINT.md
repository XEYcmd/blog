# 断点记录（2026-10-30 更新）

## 线上状态

| 站点 | 地址 | 状态 |
| --- | --- | --- |
| **正式站** | https://blog.xeycmd.ccwu.cc/ | ✅ 全部 200 |
| 测试站 | https://xeycmd.github.io/xeycmd-blog-dsh/ | ⚠️ 被 301 到 `blog.xeydemo.ccwu.cc`，但该域名 DNS 不通 |

**最新提交**：`6d1c38d`（本地、origin、prod 三者一致）

## 已完成的功能

### 首页 `/`
- 轮换背景：交叉淡入淡出 + Ken Burns（`public/backgrounds/` **仍为空**，用渐变占位）
- 打字特效：4 句循环打字删除
- 樱花/星光粒子（Canvas）
- 全局鼠标光点拖尾（所有页面，已调淡）
- 三枚毛玻璃按钮（Github / 文章 / 个人简介）+ 日式 kana 提示
- 下方可滚动区：最近 3 篇文章 + 简介摘要

### 文章 `/posts/`
- 数字分页，每页 6 篇，当前 8 篇 demo 文章
- 卡片显示标题+摘要+日期，标题和「阅读全文」都是真链接
- 详情页：Markdown 渲染、目录、上下篇导航

### 番剧 `/anime/` ✅ 已完成
- **199 部**作品，来自作品库 JSON
- **197 条**百度百科精确词条链接（含数字 ID）
- 只剩 2 条回退到搜索页（用户标记「不挂链接」和「去除」的）
- 24 条番名已按百度百科官方名修正
- 6 条原本指向漫画/轻小说的已换成动画词条
- 搜索框 + 34 个标签筛选（可组合）
- 数据生成流程：`build-anime.mjs` → `apply-baike.mjs` → `apply-fixes27.mjs`

### 音乐播放器 ✅ 界面完成，歌单待填
- 右下角全局悬浮按钮，玻璃拟态
- 功能：播放/暂停/上下首、拖进度、音量静音、三种循环模式、媒体键、记忆状态
- **歌单为空**，点开会提示怎么添加
- 加歌：音频丢进 `public/music/`，在 `src/data/music.ts` 的 `tracks` 里登记

### 其他
- 中英双语切换（全站生效，可双向切换）
- 手机版适配（首页/列表/详情/简介/番剧全部验证过）
- RSS（中英各一份）、sitemap、OG 分享图（`public/og.png`）
- 404 页

## 待办

1. **测试站域名问题**（阻塞测试流程）
   - `xeydemo.ccwu.cc` 只有 SOA 记录，没有 A/CNAME，DNS 未生效
   - 需要：Cloudflare 加 CNAME `xeydemo` → `xeycmd.github.io`（灰云）
   - 或：在测试库 Settings → Pages 里把 Custom domain 清空

2. **音乐播放器加歌**
   - 等用户提供音频文件或外链

3. **首页背景图**
   - `public/backgrounds/` 放二次元插画即可自动轮换，无需改代码

4. **demo 文章**
   - 8 篇里 6 篇是测试分页用的，可考虑删掉

## 工作流（重要）

**所有改动先推测试库，验证通过再推正式库：**

```bash
git add -A
git commit -m "feat: 描述"
git push origin main    # 测试库 xeycmd-blog-dsh
# 打开 https://xeycmd.github.io/xeycmd-blog-dsh/ 验证
git push prod main      # 正式库 XEYCMD/blog
```

远程：
```
origin  git@github.com:XEYcmd/xeycmd-blog-dsh.git   ← 测试
prod    git@github.com:XEYcmd/blog.git              ← 正式
```

代码会读 `GITHUB_REPOSITORY` 自动判断 base：
- 正式库（有 `public/CNAME`）→ 根路径 + `blog.xeycmd.ccwu.cc`
- 测试库（deploy.yml 会删 CNAME）→ `/xeycmd-blog-dsh/` + `xeycmd.github.io`

## 环境备忘

- Node v24.20.0 / npm 11.19.0
- 构建：`npm run build`（prebuild 同步字体样式 + esbuild 打包客户端脚本）
- 预览：`npm run preview`（端口 4321 起）
- **已知坑**：
  - `src/pages/*.astro` 里不要 import 其他页面，会解析失败
  - 相对路径深度容易写错，改完务必 `npm run build`
  - PowerShell 会吞掉反引号模板变量，改含 `${}` 的代码优先用 edit 工具
  - 这台机器访问 `zh.moegirl.org.cn` 会超时/403，百度百科需要真实浏览器（Node fetch 会被 403）
  - Edge CDP 调试端口有时打不开（安全软件拦截），可用 `--headless=new --screenshot` 替代
