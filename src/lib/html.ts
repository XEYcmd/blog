import { esc, STYLE_LINKS } from './esc';
import { htmlLang, LANGS, localize, site, text } from './data';
import type { Lang } from './data';
import { u, SITE_URL } from './base';
import { globalScript } from './scripts';

/** 逻辑路径 → 站点绝对 URL（含基路径） */
export const abs = (path: string): string => new URL(u(path), SITE_URL).href;

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9a4ff"/><stop offset="1" stop-color="#ff9fd2"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="#1a1430"/><path d="M18 20l12 12-12 12" fill="none" stroke="url(#lg)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 44h12" fill="none" stroke="#ff9fd2" stroke-width="6" stroke-linecap="round"/></svg>`;

/** 页面 head */
export function head(opts: {
  title: string;
  description: string;
  path: string;
  lang: Lang;
  type?: 'website' | 'article';
  extra?: string;
}): string {
  const { title, description, path, lang, type = 'website', extra = '' } = opts;
  const other: Lang = lang === 'zh' ? 'en' : 'zh';
  const otherPath = localize(path, other);
  const fullTitle = title.includes(site.name) ? title : `${title} · ${site.name}`;

  return `<!doctype html>
<html lang="${htmlLang(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(abs(path))}">
<link rel="alternate" hreflang="${htmlLang(other)}" href="${esc(abs(otherPath))}">
<meta name="theme-color" content="#120e24">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(abs(path))}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${lang === 'zh' ? 'zh_CN' : 'en_US'}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="${u('/favicon.svg')}" type="image/svg+xml">
<link rel="sitemap" href="${u('/sitemap-index.xml')}">
<link rel="alternate" type="application/rss+xml" title="${esc(site.name)} Posts" href="${u('/rss.xml')}">
${STYLE_LINKS}
<meta name="generator" content="Astro">
${extra}
</head>`;
}

/** 内页（文章/简介/404）通用的页头 */
export function pageHeader(lang: Lang, path: string): string {
  const t = text[lang];
  const items = [
    { href: localize('/', lang), label: t.nav.home, match: '/' },
    { href: localize('/posts/', lang), label: t.nav.posts, match: '/posts/' },
    { href: localize('/about/', lang), label: t.nav.about, match: '/about/' },
  ];
  const other: Lang = lang === 'zh' ? 'en' : 'zh';

  const links = items
    .map((item) => {
      const active = path.replace(/\/+$/, '') === item.match.replace(/\/+$/, '');
      return `<a href="${esc(u(item.href))}"${active ? ' aria-current="page"' : ''}>${esc(item.label)}</a>`;
    })
    .join('');

  return `<a class="sr-only" href="#main">${esc(t.skip)}</a>
<div class="page">
<header class="site-header">
  <div class="container site-header__inner">
    <a class="brand" href="${u(localize('/', lang))}"><span class="brand__prompt" aria-hidden="true">&gt; </span>${esc(site.name)}</a>
    <nav class="site-nav" aria-label="${esc(t.navAria)}">
      ${links}
      <button class="lang-toggle" type="button" data-lang-switch="${other}" data-target="${esc(u(localize(path, other)))}" aria-label="${esc(t.langLabel)}">${esc(t.langShort)}</button>
    </nav>
  </div>
</header>
<main id="main" class="page-main">`;
}

/** 内页通用页脚 + 结束标签 + 语言切换脚本 */
export function pageFooter(lang: Lang): string {
  const t = text[lang];
  return `</main>
<footer class="site-footer">
  <div class="container">
    <p>© ${new Date().getFullYear()} ${esc(site.name)} · ${esc(t.footer)}</p>
  </div>
</footer>
</div>
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
${globalScript()}
</body>
</html>`;
}

export function pageShell(opts: {
  lang: Lang;
  path: string;
  title: string;
  description: string;
  content: string;
}): string {
  const { lang, path, title, description, content } = opts;
  return `${head({ title, description, path, lang })}
<body class="inner">
${pageHeader(lang, path)}
${content}
${pageFooter(lang)}`;
}

/** 所有语言 × 各页面的逻辑路径 */
export function allPaths(): string[] {
  return LANGS.flatMap((lang) => [localize('/', lang), localize('/posts/', lang), localize('/about/', lang)]);
}

export { LOGO_SVG };
