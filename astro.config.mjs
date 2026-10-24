// @ts-check
import { existsSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 两种部署形态，自动判断：
//   1. 自定义根域名 https://xeycmd.ccwu.cc/  → public/CNAME 存在，base = ''
//   2. GitHub Pages 项目页（demo）          → 没有 CNAME，base = '/xeycmd-blog-dsh'
// 想从 demo 切到正式域名时，把 CNAME.custom-domain 复制回 public/CNAME 即可。
const HAS_CNAME = existsSync(new URL('./public/CNAME', import.meta.url));
const REPO_NAME = 'xeycmd-blog-dsh';

const base = HAS_CNAME ? '' : `/${REPO_NAME}`;
const origin = HAS_CNAME ? 'https://xeycmd.ccwu.cc' : 'https://xeycmd.github.io';

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
