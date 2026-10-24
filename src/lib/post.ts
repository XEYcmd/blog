import { esc } from './esc';
import { u } from './base';
import { localize, site, text } from './data';
import type { Lang, Post } from './data';
import { pageShell } from './html';
import { renderMarkdown } from './markdown';


const fmt = (d: Date, lang: Lang) =>
  new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);

export function postPage(opts: {
  lang: Lang;
  path: string;
  post: Post;
  all: Post[];
}): string {
  const { lang, path, post, all } = opts;
  const t = text[lang];
  const { html, headings } = renderMarkdown(post.body);
  const plain = post.body.replace(/```[\s\S]*?```/g, ' ').replace(/\s+/g, '');
  const minutes = Math.max(1, Math.round(plain.length / 400));

  const others = all.filter((p) => p.id !== post.id);
  const newer = others.filter((p) => p.date > post.date).sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  const older = others.filter((p) => p.date < post.date).sort((a, b) => b.date.getTime() - a.date.getTime())[0];

  const toc = headings.filter((h) => h.depth === 2 || h.depth === 3);
  const tocHtml =
    toc.length > 2
      ? `<details class="toc glass" open>
      <summary>${esc(t.toc)}</summary>
      <ol>${toc
        .map((h) => `<li class="depth-${h.depth}"><a href="#${esc(h.slug)}">${esc(h.text)}</a></li>`)
        .join('')}</ol>
    </details>`
      : '';

  const navItem = (p: Post | undefined, hint: string, right = false) =>
    p
      ? `<a class="glass post-nav__item${right ? ' post-nav__item--right' : ''}" href="${esc(u(localize(`/posts/${p.id}/`, lang)))}">
          <span class="post-nav__hint">${esc(hint)}</span>
          <span>${esc(p.title)}</span>
        </a>`
      : '';

  const prevNext =
    newer || older
      ? `<nav class="post-nav" aria-label="${esc(t.prevNext)}">
          ${navItem(newer, `← ${t.newer}`)}
          ${navItem(older, `${t.older} →`, true)}
        </nav>`
      : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date.toISOString(),
    description: post.summary,
    inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
    author: { '@type': 'Person', name: site.name, url: site.url },
    mainEntityOfPage: new URL(path, site.url).href,
  };

  const content = `<article class="container prose">
    <header class="post-head">
      <a class="back" href="${esc(u(localize('/posts/', lang)))}">${esc(t.backToList)}</a>
      <h1>${esc(post.title)}</h1>
      <div class="meta">
        <time datetime="${esc(post.date.toISOString())}">${esc(fmt(post.date, lang))}</time>
        <span>${esc(t.minutes(minutes))}</span>
        ${
          post.tags.length
            ? `<ul class="tags">${post.tags.map((tag) => `<li class="tag">${esc(tag)}</li>`).join('')}</ul>`
            : ''
        }
      </div>
    </header>
    ${tocHtml}
    <div class="post-body">${html}</div>
    ${prevNext}
    <p class="post-end"><a class="back" href="${esc(u(localize('/posts/', lang)))}">${esc(t.backToList)}</a></p>
  </article>
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`;

  return pageShell({
    lang,
    path,
    title: post.title,
    description: post.summary || `${post.title} · ${site.name}`,
    content,
  });
}
