// @ts-check
import { existsSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * 部署形态自动判断（不用手动改）：
 *
 *   1. 自定义域名：public/CNAME 存在
 *      → base = ''，site = https://<CNAME 内容>
 *      → 站点在域名根路径，例如 https://blog.xeycmd.ccwu.cc/
 *
 *   2. GitHub Pages 项目页（没配域名时）
 *      → base = '/仓库名'，site = https://<用户名>.github.io/<仓库名>
 *
 * 想启用/停用自定义域名，只需要增删 public/CNAME 这一个文件。
 */
const CNAME_PATH = new URL('./public/CNAME', import.meta.url);
const HAS_CNAME = existsSync(CNAME_PATH);

const REPO_NAME = 'xeycmd-blog-dsh';
const USER_NAME = 'XEYCMD';

let domain = '';
if (HAS_CNAME) {
  const { readFileSync } = await import('node:fs');
  domain = readFileSync(CNAME_PATH, 'utf8').trim();
}

const base = domain ? '' : `/${REPO_NAME}`;
const origin = domain ? `https://${domain}` : `https://${USER_NAME.toLowerCase()}.github.io`;

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
