import { esc } from './esc';
import { u } from './base';
import { localize, text } from './data';
import type { Lang, Post } from './data';
import { pageShell } from './html';

const fmt = (d: Date, lang: Lang) =>
  new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);

export function postsPage(opts: { lang: Lang; path: string; posts: Post[] }): string {
  const { lang, path, posts } = opts;
  const t = text[lang];
  const firstId = posts[0]?.id ?? '';

  const cards = posts
    .map(
      (post) => `<article class="card glass">
      <a class="card__link" href="${esc(u(localize(`/posts/${post.id}/`, lang)))}">
        <h2 class="card__title">${esc(post.title)}</h2>
        <p class="card__summary">${esc(post.summary || (lang === 'zh' ? '（暂无摘要）' : 'No summary yet.'))}</p>
      </a>
      <div class="meta card__meta">
        <time datetime="${esc(post.date.toISOString())}">${esc(fmt(post.date, lang))}</time>
        <span class="card__lang">${esc(t.postLangTag[post.lang])}</span>
      </div>
    </article>`,
    )
    .join('\n');

  const list =
    posts.length > 0
      ? `<div class="list__items">${cards}</div>${firstId ? `<span class="sr-only">${esc(firstId)}</span>` : ''}`
      : `<p class="list__empty glass">${esc(t.postsEmpty)}</p>`;

  const content = `<section class="container list">
    <header class="list__head">
      <h1>${esc(t.postsTitle)}</h1>
      <p>${esc(t.postsSubtitle)}</p>
      ${posts.length > 0 ? `<p class="meta">${esc(t.postCount(posts.length))}</p>` : ''}
    </header>
    ${list}
  </section>`;

  return pageShell({
    lang,
    path,
    title: t.postsTitle,
    description: t.postsSubtitle,
    content,
  });
}
