import type { APIRoute } from 'astro';
import { loadPosts, site } from '../lib/data';
import { renderMarkdown } from '../lib/markdown';

/** RSS 2.0 feed：中文文章 */
export const GET: APIRoute = () => {
  const posts = loadPosts();
  const items = posts
    .map((post) => {
      const { html } = renderMarkdown(post.body);
      const link = new URL(`/posts/${post.id}/`, site.url).href;
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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)} · 文章</title>
    <link>${new URL('/posts/', site.url).href}</link>
    <atom:link href="${new URL('/rss.xml', site.url).href}" rel="self" type="application/rss+xml" />
    <description>${escapeXml('XEYcmd 的个人网站：代码、终端与二次元的记录。')}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
