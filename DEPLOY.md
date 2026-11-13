# 部署说明

## 仓库

| 用途 | 仓库 | 线上地址 |
| --- | --- | --- |
| 正式站 | [XEYcmd/blog](https://github.com/XEYcmd/blog) | <https://blog.xeycmd.ccwu.cc/> |

只有一个仓库：推 `main` 即自动构建并部署到 GitHub Pages。
（原测试库 `XEYcmd/xeycmd-blog-dsh` 已取消。）

## 发布流程

```bash
npm run build        # 先在本地构建验证
git add -A
git commit -m "feat: 描述"
git push origin main # 推送后自动部署
```

本地 remote：

```
origin  git@github.com:XEYcmd/blog.git   ← 正式库
```

## 部署原理

`astro.config.mjs` 会读 Actions 注入的 `GITHUB_REPOSITORY`，并按 `public/CNAME` 是否存在决定路径：

```js
const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? 'XEYCMD/blog').split('/');
const base = domain ? '' : `/${repo}`;
const origin = domain ? `https://${domain}` : `https://${owner.toLowerCase()}.github.io`;
```

- 有 `public/CNAME` → 用 CNAME 里的域名，站点部署在根路径
- 没有 CNAME → 用 `<用户名>.github.io/<仓库名>`，站点部署在子路径

正式库带有 `public/CNAME`，所以正常情况下始终是自定义域名 + 根路径。

`.github/workflows/deploy.yml` 在每次 push `main` 时执行：安装依赖 → `npm run build` → 上传 `dist/` → 部署 Pages。

## 首次部署 / 新建仓库时

1. 仓库 → **Settings** → **Pages**
2. **Source** 选 **GitHub Actions**
3. 等 Actions 变绿
4. 正式库再填 **Custom domain**

## Cloudflare DNS（自定义域名）

`blog.xeycmd.ccwu.cc` 需要一条记录：

| 类型 | 名称 | 内容 | 代理 |
| --- | --- | --- | --- |
| CNAME | `blog` | `xeycmd.github.io` | **仅 DNS（灰云）** |

**代理必须关掉（灰云）**。橙云会让 GitHub 的域名验证和 HTTPS 证书签发失败。

如果改用根域名，则要 4 条 A 记录（`185.199.108.153` ~ `185.199.111.153`），同样是灰云。

## 换域名时

1. Cloudflare 改/加 CNAME 指向 `xeycmd.github.io`
2. GitHub → Settings → Pages → Custom domain 填新域名
3. 改仓库里的 `public/CNAME` 内容为新域名，push
4. 等验证通过后勾上 **Enforce HTTPS**

## 常见问题

**页面 404 但 Actions 是绿的**
检查 Settings → Pages → Source 是否为 `GitHub Actions`。

**样式全丢只剩文字**
多半是访问了错误的地址。正式站请用 <https://blog.xeycmd.ccwu.cc/>，不要用 `github.io` 的项目页地址。

**Enforce HTTPS 是灰的**
证书还在签发，等几分钟到几小时。

**自定义域名验证失败**
检查 Cloudflare 代理是否已关闭（必须是灰云）。
