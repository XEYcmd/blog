# 断点记录（2026-10-24 23:5x）

## 已完成并上线

线上地址：**https://blog.xeycmd.ccwu.cc/**（自定义域名，CNAME → xeycmd.github.io，灰云）

最近提交：`75eda0f` fix: 语言切换无法从英文切回中文 + 阅读全文改成可点击链接

功能状态：
- 首页：轮换背景（`public/backgrounds/` 仍为空，用渐变占位）、打字特效、樱花粒子、全局鼠标拖尾、毛玻璃按钮
- 文章列表：数字分页，每页 6 篇，8 篇 demo 文章
- 文章详情：Markdown 渲染、目录、上下篇
- 简介页、404、中英双语、RSS（中英各一份）、sitemap、OG 分享图
- 手机版适配已完成

## 未完成：番剧推荐页

**目标**：把 `D:\dsh的项目\作品库-备份-20261024-2329.json` 里的 199 部作品做成 blog 的一个「我推荐的番剧」页面，只显示名字，每部链接到萌娘百科对应条目。

**已经做完的准备工作**：
- 源数据已导出到 `content/_anime-source.csv`（name + tags 两列，199 条，尚未提交）
- 已验证：**从这台机器访问 `zh.moegirl.org.cn` 会连接超时/403**，无法批量校验条目是否存在
  - 试过 GET 单条、POST 批量、带 UA、多次重试，都不稳定
  - 之前的「全部 missing」是网络失败被误判，不是真的没有条目

**下次的推荐做法**：
1. 不再做在线校验，直接按萌娘百科命名规则生成链接：
   `https://zh.moegirl.org.cn/{encodeURIComponent(名字)}`
2. 少数需要人工修正的（名字和条目名不一致的，如 `love live` → `LoveLive!`、`fate` → `Fate/stay night`），
   在数据文件里加一个 `alias` 字段手工覆盖
3. 页面结构建议：
   - 路由：`/anime/`（中文）+ `/en/anime/`（英文）
   - 按 tag 分组或筛选（恋爱 101 / 校园 72 / 日常 71 / 奇幻 58 / 搞笑 57 …）
   - 只显示名字，点击跳萌娘百科，`target="_blank" rel="noopener noreferrer"`
   - 数据放 `src/data/anime.ts`（或读 `content/anime.json`）
   - 导航栏加一项「番剧」/「Anime」

## 其他待办

- `public/backgrounds/` 放二次元插画（放进去自动轮换，无需改代码）
- 8 篇 demo 文章里 6 篇是测试用的，要不要删
- README 已按要求简化成「这是我的个人博客」

## 环境备忘

- Node v24.20.0 / npm 11.19.0
- 项目路径：`D:\dsh的项目\个人网站`
- 远程：`git@github.com:XEYcmd/xeycmd-blog-dsh.git`（SSH，已配好）
- 构建：`npm run build`（prebuild 会同步字体/样式并打包客户端脚本）
- 预览：`npm run preview`
- 已知坑：`src/pages/*.astro` 里不要 import 其他页面；相对路径深度容易写错
- 用户 hosts 文件曾被 GitHub 加速工具写入大量 `127.0.0.1 github.com`，已清理
