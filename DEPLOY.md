# 部署说明

## 两个仓库

| 用途 | 仓库 | 线上地址 | 说明 |
| --- | --- | --- | --- |
| 正式站 | [XEYcmd/blog](https://github.com/XEYcmd/blog) | <https://blog.xeycmd.ccwu.cc/> | 绑定自定义域名 |
| 测试站 | [xeycmd-blog-dsh](https://github.com/XEYcmd/xeycmd-blog-dsh) | <https://xeycmd.github.io/xeycmd-blog-dsh/> | 子路径部署，不绑域名 |

同一份代码，两个仓库都能正确构建——不需要改任何配置。

## 工作流（重要）

**所有改动先推到测试库，验证通过后再推正式库。**

```bash
# 1. 改代码、本地构建
npm run build

# 2. 推到测试库
git add -A
git commit -m "feat: 描述"
git push origin main

# 3. 打开测试站验证
#    https://xeycmd.github.io/xeycmd-blog-dsh/

# 4. 确认没问题，再推正式库
git push prod main
```

本地 remote：

```
origin  git@github.com:XEYcmd/xeycmd-blog-dsh.git   ← 测试库
prod    git@github.com:XEYcmd/blog.git              ← 正式库
```

## 为什么两个仓库不用改配置

`astro.config.mjs` 会读 Actions 注入的 `GITHUB_REPOSITORY`：

```js
const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? 'XEYCMD/xeycmd-blog-dsh').split('/');
const base = domain ? '' : `/${repo}`;
const origin = domain ? `https://${domain}` : `https://${owner.toLowerCase()}.github.io`;
```

- 有 `public/CNAME` → 用 CNAME 里的域名，站点部署在根路径
- 没有 CNAME → 用 `<用户名>.github.io/<仓库名>`，站点部署在子路径

`deploy.yml` 里还有一步，保证测试库不会去抢正式域名：

```yaml
- name: Drop custom domain for test deployments
  if: github.repository != 'XEYCMD/blog'
  run: rm -f public/CNAME
```

## 首次部署新仓库时要做的事

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
2. GitHub 正式库 → Settings → Pages → Custom domain 填新域名
3. 改仓库里的 `public/CNAME` 内容为新域名，push
4. 等验证通过后勾上 **Enforce HTTPS**

## 常见问题

**测试站 301 跳转到正式域名**
测试库的 Pages 设置里还留着 Custom domain，去 Settings → Pages → Custom domain 点 Remove。

**页面 404 但 Actions 是绿的**
检查 Settings → Pages → Source 是否为 `GitHub Actions`。

**样式全丢只剩文字**
访问了错误的地址。测试库必须带 `/xeycmd-blog-dsh/` 前缀，正式库用自定义域名根路径。

**Enforce HTTPS 是灰的**
证书还在签发，等几分钟到几小时。
