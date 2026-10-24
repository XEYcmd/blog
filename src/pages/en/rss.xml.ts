import type { APIRoute } from 'astro';
import { loadPosts, site, text } from '../../lib/data';
import { renderMarkdown } from '../../lib/markdown';

/** 英文 RSS feed */
export const GET: APIRoute = () => {
  const t = text.en;
  const posts = loadPosts();

  const items = posts
    .map((post) => {
      const { html } = renderMarkdown(post.body);
      const link = new URL(`/en/posts/${post.id}/`, site.url).href;
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
    <title>${escapeXml(`${site.name} · ${t.postsTitle}`)}</title>
    <link>${new URL('/en/posts/', site.url).href}</link>
    <atom:link href="${new URL('/en/rss.xml', site.url).href}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(t.desc)}</description>
    <language>en</language>
    <lastBuildDate>${(posts[0]?.date ?? new Date()).toUTCString()}</lastBuildDate>
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
