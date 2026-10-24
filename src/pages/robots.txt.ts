import type { APIRoute } from 'astro';
import { SITE_URL } from '../lib/base';

/** robots.txt：sitemap 地址随部署域名自动变化 */
export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap-index.xml', SITE_URL).href}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
