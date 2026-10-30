import { esc } from './esc';
import { u } from './base';
import { localize, site, text } from './data';
import type { Lang } from './data';
import { pageShell } from './html';

export function aboutPage(opts: { lang: Lang; path: string; postCount: number }): string {
  const { lang, path, postCount } = opts;
  const t = text[lang];
  const start = new Date('2026-10-01');
  const days = Math.max(1, Math.floor((Date.now() - start.getTime()) / 86400000));

  const skills = t.skills
    .map(
      (s) => `<li>
        <span class="skills__label">${esc(s.label)}</span>
        <span class="skills__bar" aria-hidden="true"><span style="width:${Number(s.level)}%"></span></span>
      </li>`,
    )
    .join('');

  const links = [
    `<li><a href="${esc(site.github)}" rel="noopener noreferrer" target="_blank">GitHub</a></li>`,
    `<li><a href="${esc(u(localize('/posts/', lang)))}">${esc(t.nav.posts)}</a></li>`,
  ].join('');

  const content = `<section class="container about">
    <header class="about__hero">
      <div class="avatar glass" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="64" height="64">
          <defs><linearGradient id="ag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9a4ff"/><stop offset="1" stop-color="#ff9fd2"/></linearGradient></defs>
          <path d="M8 26c0-10 10-16 24-16s24 6 24 16" fill="none" stroke="url(#ag)" stroke-width="4" stroke-linecap="round"/>
          <circle cx="24" cy="32" r="3.5" fill="#b9a4ff"/><circle cx="40" cy="32" r="3.5" fill="#b9a4ff"/>
          <path d="M25 43c4 4 10 4 14 0" fill="none" stroke="#ff9fd2" stroke-width="3.5" stroke-linecap="round"/>
        </svg>
      </div>
      <div>
        <h1>${esc(site.name)}</h1>
        <p class="tagline">${esc(t.aboutTagline)}</p>
      </div>
    </header>

    <div class="about__grid">
      <div class="about__bio">${t.aboutBio.map((line) => `<p>${esc(line)}</p>`).join('')}</div>
      <aside class="about__side">
        <section class="glass block">
          <h2>${esc(t.skillsTitle)}</h2>
          <ul class="skills">${skills}</ul>
        </section>
        <section class="glass block">
          <h2>${esc(t.linksTitle)}</h2>
          <ul class="links">${links}</ul>
        </section>
        <section class="glass block">
          <h2>${esc(t.nowTitle)}</h2>
          <ul class="now">${t.nowItems.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
        </section>
      </aside>
    </div>

    <p class="about__stats meta">
      <span>${esc(lang === 'zh' ? `${postCount} 篇文字` : `${postCount} posts`)}</span>
      <span>${esc(lang === 'zh' ? `第 ${days} 天` : `day ${days}`)}</span>
    </p>
  </section>`;

  return pageShell({
    lang,
    path,
    title: t.aboutTitle,
    description: `${site.name} — ${t.aboutTagline}`,
    content,
  });
}

export function notFoundPage(opts: { lang: Lang; path: string }): string {
  const { lang, path } = opts;
  const t = text[lang];
  const content = `<section class="container nf">
    <p class="nf__code" aria-hidden="true">404</p>
    <h1>${esc(t.notFoundTitle)}</h1>
    <p>${esc(t.notFoundText)}</p>
    <a class="nf__back" href="${esc(u(localize('/', lang)))}">${esc(t.backHome)}</a>
  </section>`;
  return pageShell({ lang, path, title: '404', description: t.notFoundText, content });
}
