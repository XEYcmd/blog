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

/** 每页文章数 */
export const PAGE_SIZE = 6;

export const totalPages = (count: number) => Math.max(1, Math.ceil(count / PAGE_SIZE));

/** 页码 → 路径：第 1 页是 /posts/，其余是 /posts/page/2/ */
export function pagePath(page: number, lang: Lang): string {
  if (page <= 1) return localize('/posts/', lang);
  return localize(`/posts/page/${page}/`, lang);
}

export function slicePage(posts: Post[], page: number): Post[] {
  const start = (page - 1) * PAGE_SIZE;
  return posts.slice(start, start + PAGE_SIZE);
}

function pagination(current: number, total: number, lang: Lang, t: (typeof text)['zh']): string {
  if (total <= 1) return '';

  const items: string[] = [];

  const link = (page: number, label: string, opts: { active?: boolean; disabled?: boolean; rel?: string } = {}) => {
    const { active = false, disabled = false, rel } = opts;
    if (disabled) {
      return `<span class="pager__item pager__item--disabled" aria-hidden="true">${label}</span>`;
    }
    if (active) {
      return `<span class="pager__item pager__item--active" aria-current="page">${label}</span>`;
    }
    const href = u(pagePath(page, lang));
    return `<a class="pager__item" href="${esc(href)}"${rel ? ` rel="${rel}"` : ''} aria-label="${esc(
      t.pageLabel(page),
    )}">${label}</a>`;
  };

  items.push(link(current - 1, '‹', { disabled: current <= 1, rel: 'prev' }));

  // 页码窗口：首页、末页始终显示，当前页附近显示，中间用省略号
  const window = 1;
  const pages = new Set<number>([1, total]);
  for (let p = current - window; p <= current + window; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);

  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) {
      items.push('<span class="pager__gap" aria-hidden="true">…</span>');
    }
    items.push(link(p, String(p), { active: p === current }));
    prev = p;
  }

  items.push(link(current + 1, '›', { disabled: current >= total, rel: 'next' }));

  return `<nav class="pager" aria-label="${esc(t.paginationLabel)}">${items.join('')}</nav>`;
}

export function postsPage(opts: {
  lang: Lang;
  path: string;
  posts: Post[];
  page?: number;
}): string {
  const { lang, path, posts, page = 1 } = opts;
  const t = text[lang];
  const total = totalPages(posts.length);
  const current = Math.min(Math.max(1, page), total);
  const items = slicePage(posts, current);

  const cards = items
    .map(
      (post) => `<article class="card glass">
      <a class="card__link" href="${esc(u(localize(`/posts/${post.id}/`, lang)))}">
        <h2 class="card__title">${esc(post.title)}</h2>
        <p class="card__summary">${esc(post.summary || (lang === 'zh' ? '（暂无摘要）' : 'No summary yet.'))}</p>
      </a>
      <div class="meta card__meta">
        <time datetime="${esc(post.date.toISOString())}">${esc(fmt(post.date, lang))}</time>
        <span class="card__more">${esc(t.readMore)} →</span>
      </div>
    </article>`,
    )
    .join('\n');

  const list =
    posts.length > 0
      ? `<div class="list__items">${cards}</div>${pagination(current, total, lang, t)}`
      : `<p class="list__empty glass">${esc(t.postsEmpty)}</p>`;

  const counter =
    posts.length > 0
      ? `<p class="meta">${esc(t.postCount(posts.length))}${
          total > 1 ? ` · ${esc(t.pageOf(current, total))}` : ''
        }</p>`
      : '';

  const content = `<section class="container list">
    <header class="list__head">
      <h1>${esc(t.postsTitle)}</h1>
      <p>${esc(t.postsSubtitle)}</p>
      ${counter}
    </header>
    ${list}
  </section>`;

  const title = current > 1 ? `${t.postsTitle} · ${t.pageOf(current, total)}` : t.postsTitle;

  return pageShell({
    lang,
    path,
    title,
    description: t.postsSubtitle,
    content,
  });
}
