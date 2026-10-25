// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * 部署形态自动判断，同一份代码可同时用于两个仓库：
 *
 *   1. 有 public/CNAME  → 自定义域名模式
 *      base = ''，site = https://<CNAME 内容>
 *
 *   2. 没有 public/CNAME → GitHub Pages 项目页模式
 *      base = '/<仓库名>'，site = https://<用户名>.github.io/<仓库名>
 *
 * 仓库名从 Actions 注入的 GITHUB_REPOSITORY 读取，本地开发回退到默认值。
 */
const CNAME_PATH = new URL('./public/CNAME', import.meta.url);
const domain = existsSync(CNAME_PATH) ? readFileSync(CNAME_PATH, 'utf8').trim() : '';

const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? 'XEYCMD/xeycmd-blog-dsh').split('/');

const base = domain ? '' : `/${repo}`;
const origin = domain ? `https://${domain}` : `https://${owner.toLowerCase()}.github.io`;

export default defineConfig({
  site: `${origin}${base}`,
  base: base || undefined,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: true,
    },
  },
});
