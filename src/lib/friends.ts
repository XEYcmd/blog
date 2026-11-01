import { esc } from './esc';
import { text } from './data';
import type { Lang } from './data';
import { pageShell } from './html';
import { friends } from '../data/friends';

export function friendsPage(opts: { lang: Lang; path: string }): string {
  const { lang, path } = opts;
  const t = text[lang];

  const list = friends.length
    ? `<ul class="friends__list">${friends
        .map(
          (f) => `<li class="friends__item glass">
        <a class="friends__link" href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">
          <span class="friends__name">${esc(f.name)}</span>
          ${f.desc ? `<span class="friends__desc">${esc(f.desc)}</span>` : ''}
        </a>
      </li>`,
        )
        .join('\n')}</ul>`
    : `<p class="friends__empty glass">${esc(t.friendsEmpty)}</p>`;

  const content = `<section class="container friends">
    <header class="friends__head">
      <h1>${esc(t.friendsTitle)}</h1>
      <p>${esc(t.friendsSubtitle)}</p>
    </header>
    ${list}
  </section>`;

  return pageShell({
    lang,
    path,
    title: t.friendsTitle,
    description: t.friendsSubtitle,
    content,
  });
}
