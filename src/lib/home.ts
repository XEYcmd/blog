import { esc } from './esc';
import { localize, text } from './data';
import type { Lang } from './data';
import { head } from './html';
import { u } from './base';

const ICONS: Record<string, string> = {
  github: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.62-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/></svg>`,
  pen: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2l2.1 5.9L20 10l-5.9 2.1L12 18l-2.1-5.9L4 10l5.9-2.1Z"/></svg>`,
};

export type HomeButton = {
  key: string;
  href: string;
  external?: boolean;
  kana: string;
  label: string;
  icon: string;
};

/** 首页下方的预览区：最近文章 + 简介摘要 */
export type HomeTeaser = {
  posts: { id: string; title: string; summary: string; dateText: string; href: string }[];
  about: { tagline: string; lines: string[]; href: string };
};

function pageHead(opts: Parameters<typeof head>[0]): string {
  return head(opts);
}

export function homePage(opts: {
  lang: Lang;
  path: string;
  backgrounds: string[];
  buttons: HomeButton[];
  typing: string[];
  teaser: HomeTeaser;
  script?: string;
  globalScript?: string;
}): string {
  const { lang, path, backgrounds, buttons, typing, teaser, script = '', globalScript = '' } = opts;
  const t = text[lang];
  const other: Lang = lang === 'zh' ? 'en' : 'zh';
  const rotateMs = backgrounds.length > 1 ? 8000 : 0;
  const total = Math.max(2, backgrounds.length * 2);
  const duration = Math.max(1, backgrounds.length) * rotateMs;

  const layers = Array.from({ length: total }, (_, i) => {
    const url = backgrounds.length ? backgrounds[i % backgrounds.length] : '';
    const style = url
      ? ` style="--bg-url:url(&quot;${esc(url)}&quot;);--delay:${i * rotateMs}ms;--duration:${duration}ms"`
      : '';
    return `<div class="bg__layer bg__layer--${i}" data-bg-url="${esc(url)}"${style}></div>`;
  }).join('');

  const btnHtml = buttons
    .map((btn, i) => {
      const href = btn.href.startsWith('/') ? u(localize(btn.href, lang)) : btn.href;
      const attrs = btn.external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a class="btn btn--${esc(btn.key)}" href="${esc(href)}"${attrs} data-fade data-fade-delay="${1200 + i * 140}">
      <span class="btn__icon" aria-hidden="true">${ICONS[btn.icon] ?? ''}</span>
      <span class="btn__label">${esc(btn.label)}</span>
      <span class="btn__kana" aria-hidden="true">${esc(btn.kana)}</span>
    </a>`;
    })
    .join('\n    ');

  const postCards = teaser.posts
    .map(
      (post) => `<a class="teaser-card glass" href="${esc(post.href)}">
        <h3>${esc(post.title)}</h3>
        <p>${esc(post.summary)}</p>
        <time datetime="${esc(post.dateText)}">${esc(post.dateText)}</time>
      </a>`,
    )
    .join('\n      ');

  const firstLine = typing[0] ?? '';

  return `${pageHead({ title: t.title, description: t.desc, path, lang })}
<body class="home">
<a class="sr-only" href="#main">${esc(t.skip)}</a>
<div data-home data-typing="${esc(JSON.stringify(typing))}" class="home__stage">
  <div class="bg${backgrounds.length ? ' bg--has-images' : ''}" aria-hidden="true">
    ${layers}
    <div class="bg__shade"></div>
    <div class="bg__vignette"></div>
  </div>
  <canvas class="petals" aria-hidden="true"></canvas>

  <nav class="home-nav" aria-label="${esc(t.navAria)}">
    <a href="${u(localize('/', lang))}" aria-current="page">${esc(t.nav.home)}</a>
    <a href="${u(localize('/posts/', lang))}">${esc(t.nav.posts)}</a>
    <a href="${u(localize('/about/', lang))}">${esc(t.nav.about)}</a>
    <button class="lang-toggle" type="button" data-lang-switch="${other}" data-target="${esc(u(localize(path, other)))}" aria-label="${esc(t.langLabel)}">${esc(t.langShort)}</button>
  </nav>

  <main id="main" class="hero">
    <h1 class="hero__title">
      <span class="hero__text" data-typing-target aria-live="polite" aria-atomic="true"></span><span class="hero__caret" aria-hidden="true"></span>
      <noscript><span>${esc(firstLine)}</span></noscript>
    </h1>
    <p class="hero__sub" data-fade data-fade-delay="900">${esc(t.subtitle)}</p>
    <nav class="hero__actions" aria-label="${esc(t.quickNav)}">
      ${btnHtml}
    </nav>
    <a class="scroll-hint" href="#more" data-fade data-fade-delay="2000">
      <span>${esc(t.scroll)}</span>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>
    </a>
  </main>
</div>

<section id="more" class="home-more">
  <div class="container home-more__inner">
    <header class="home-more__head">
      <h2>${esc(t.postsTitle)}</h2>
      <a class="home-more__all" href="${u(localize('/posts/', lang))}">${esc(t.viewAllPosts)} →</a>
    </header>
    <div class="teaser-grid">
      ${postCards || `<p class="teaser-empty">${esc(t.postsEmpty)}</p>`}
    </div>

    <section class="home-about glass">
      <div>
        <p class="home-about__tagline">${esc(teaser.about.tagline)}</p>
        ${teaser.about.lines.map((line) => `<p>${esc(line)}</p>`).join('')}
      </div>
      <a class="home-about__link" href="${esc(teaser.about.href)}">${esc(t.viewAbout)} →</a>
    </section>

    <footer class="home-footer">
      <p>© ${new Date().getFullYear()} ${esc(t.footerName)} · ${esc(t.footer)}</p>
    </footer>
  </div>
</section>

<script>
document.querySelectorAll('[data-lang-switch]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var next = btn.getAttribute('data-lang-switch');
    var target = btn.getAttribute('data-target') || '/';
    if (next) document.cookie = 'xey_lang=' + next + '; path=/; max-age=31536000; samesite=lax';
    window.location.href = target;
  });
});
</script>
${globalScript}
${script}
</body>
</html>`;
}
