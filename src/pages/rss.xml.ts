import type { APIRoute } from 'astro';
import { loadPosts, site, text } from '../lib/data';
import { renderMarkdown } from '../lib/markdown';

/** RSS 2.0 feed：按界面语言输出中文或英文文章 */
function buildFeed(lang: 'zh' | 'en'): string {
  const t = text[lang];
  const prefix = lang === 'zh' ? '' : '/en';
  const posts = loadPosts();

  const items = posts
    .map((post) => {
      const { html } = renderMarkdown(post.body);
      const link = new URL(`${prefix}/posts/${post.id}/`, site.url).href;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <description>${escapeXml(post.summary)}</description>
      <content:encoded><![CDATA[${html}]]></content:encoded>
    </item>`;
    })
    .join('\n');

  const self = new URL(`${prefix}/rss.xml`, site.url).href;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} · ${t.postsTitle}`)}</title>
    <link>${new URL(`${prefix}/posts/`, site.url).href}</link>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(t.desc)}</description>
    <language>${lang === 'zh' ? 'zh-CN' : 'en'}</language>
    <lastBuildDate>${(posts[0]?.date ?? new Date()).toUTCString()}</lastBuildDate>
    <image>
      <url>${new URL('/og.png', site.url).href}</url>
      <title>${escapeXml(site.name)}</title>
      <link>${new URL(`${prefix}/`, site.url).href}</link>
    </image>
${items}
  </channel>
</rss>`;
}

export const GET: APIRoute = () =>
  new Response(buildFeed('zh'), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
