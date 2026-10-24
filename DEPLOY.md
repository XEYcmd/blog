# 部署到 GitHub Pages + 自定义域名

仓库：<https://github.com/XEYcmd/xeycmd-blog-dsh>
自定义域：`xeycmd.ccwu.cc`（DNS 在 Cloudflare，免费版）
构建方式：GitHub Actions（`.github/workflows/deploy.yml` 已就位）

> 下面标注「🖱️ 网页端」的步骤需要你自己在浏览器里点，我这边只负责代码和文档。

---

## 一、推代码（本地已可执行）

```bash
cd "D:\dsh的项目\个人网站"
git init -b main
git remote add origin git@github.com:XEYcmd/xeycmd-blog-dsh.git
git add -A
git commit -m "init: XEYcmd 个人站"
git push -u origin main
```

仓库为空时可以直接推；如果远程已有内容，先 `git pull --rebase origin main` 再推。

---

## 二、🖱️ 开启 GitHub Pages（Actions 方式）

1. 打开仓库 → **Settings** → 左侧 **Pages**
2. **Build and deployment** 下的 **Source** 选 **GitHub Actions**
3. 回到 **Actions** 标签页，应该能看到 `Deploy to GitHub Pages` 正在跑
4. 等它变绿，先访问 `https://xeycmd.github.io/xeycmd-blog-dsh/` 确认站点正常

> 注意：这一步先**不要**填 Custom domain，先把 `github.io` 跑通。

---

## 三、🖱️ 配置自定义域名

1. 仓库 → **Settings** → **Pages** → **Custom domain**
2. 填入 `xeycmd.ccwu.cc`，点 **Save**
3. 等待 DNS 检查通过（前面配好 DNS 后一般几分钟）

> 本项目已经在 `public/CNAME` 里写好了 `xeycmd.ccwu.cc`，构建产物里会带着它。

---

## 四、🖱️ Cloudflare DNS 记录

在 Cloudflare → 你的域名 `ccwu.cc` → **DNS** → **Records** 添加：

### 根域名 `xeycmd.ccwu.cc`

方式 A（推荐，Cloudflare 支持 CNAME 拉平）：

| 类型 | 名称 | 内容 | 代理状态 |
| --- | --- | --- | --- |
| CNAME | `xeycmd` | `xeycmd.github.io` | **仅 DNS（灰云）** |

方式 B（GitHub 官方推荐的 A 记录）：

| 类型 | 名称 | 内容 | 代理状态 |
| --- | --- | --- | --- |
| A | `xeycmd` | `185.199.108.153` | 仅 DNS（灰云） |
| A | `xeycmd` | `185.199.109.153` | 仅 DNS（灰云） |
| A | `xeycmd` | `185.199.110.153` | 仅 DNS（灰云） |
| A | `xeycmd` | `185.199.111.153` | 仅 DNS（灰云） |

可选 IPv6（AAAA）：

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

### 重要：代理必须关掉（灰云）

橙云（代理开启）会让 GitHub 的域名验证和 HTTPS 证书签发失败，表现为 Pages 页面一直报 “DNS check unsuccessful” 或证书错误。

- 如果一定要用 Cloudflare 代理，必须额外把 SSL/TLS 模式设为 **Full**，并关闭 “Always Use HTTPS” 之外的自动 HTTPS 重写；即便如此 GitHub 的 `Enforce HTTPS` 也可能不可用。**第一次上线建议直接用灰云。**

### 关于 `www`

本项目用根域名，`www` 不是必需的。如果也想让 `www.xeycmd.ccwu.cc` 能访问：

| 类型 | 名称 | 内容 |
| --- | --- | --- |
| CNAME | `www` | `xeycmd.github.io` |

GitHub 会自动在两者之间做 301 跳转。

---

## 五、🖱️ 验证

```powershell
# DNS 是否生效（应返回 GitHub Pages 的 IP 或 CNAME）
Resolve-DnsName xeycmd.ccwu.cc

# 站点是否可达
curl.exe -I https://xeycmd.ccwu.cc/
```

- 浏览器打开 `https://xeycmd.ccwu.cc/`，应该能看到首页
- 回到 **Settings → Pages**，勾选 **Enforce HTTPS**（证书签发通常需要几分钟到几十分钟）

---

## 六、之后每次发布

```bash
git add -A
git commit -m "post: 新文章标题"
git push
```

推上去后 Actions 自动构建 + 发布，无需任何手动操作。具体写文章的格式见 [POSTING.md](./POSTING.md)。

---

## 常见问题

**页面 404，但 Actions 是绿的**
检查 Settings → Pages → Source 是否为 `GitHub Actions`；再确认 `dist/index.html` 在产物里（`npm run build` 本地能生成）。

**样式全丢、只有纯文字**
多半是访问了 `https://xeycmd.github.io/xeycmd-blog-dsh/` 而站点是按根域名构建的（`astro.config.mjs` 里 `site` 是根域）。请用 `https://xeycmd.ccwu.cc/` 访问。

**自定义域名一直验证失败**
99% 是 Cloudflare 橙云开着。改成灰云（DNS only），等 5–10 分钟再点 Save。

**Enforce HTTPS 灰色不可点**
证书还没签发完，通常等 15 分钟到几小时；期间可以先用 http 访问。

**改了文章但线上没变**
去 Actions 看最新的 workflow 是否成功；如果是缓存的缘故，强制刷新（Ctrl+F5）。
