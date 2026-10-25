import { esc, STYLE_LINKS } from './esc';
import { htmlLang, LANGS, localize, site, stripLang, switchLangPath, text } from './data';
import type { Lang } from './data';
import { u, SITE_URL } from './base';
import { globalScript } from './scripts';
import { musicPlayer, musicScript } from './player';

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
  /** 文章页：发布日期、标签、原文语言 */
  article?: { published: Date; tags: string[]; lang: Lang };
  /** 是否禁止索引（404、分页等） */
  noindex?: boolean;
  extra?: string;
}): string {
  const { title, description, path, lang, type = 'website', article, noindex = false, extra = '' } = opts;
  const other: Lang = lang === 'zh' ? 'en' : 'zh';
  const otherPath = localize(path, other);
  const fullTitle = title.includes(site.name) ? title : `${title} · ${site.name}`;
  const ogImage = abs(site.ogImage);

  const articleMeta = article
    ? `<meta property="article:published_time" content="${article.published.toISOString()}">
<meta property="article:author" content="${esc(site.name)}">
${article.tags.map((tag) => `<meta property="article:tag" content="${esc(tag)}">`).join('\n')}
<meta property="og:locale:alternate" content="${article.lang === 'zh' ? 'en_US' : 'zh_CN'}">`
    : '';

  return `<!doctype html>
<html lang="${htmlLang(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow">'}
<link rel="canonical" href="${esc(abs(path))}">
<link rel="alternate" hreflang="${htmlLang(lang)}" href="${esc(abs(path))}">
<link rel="alternate" hreflang="${htmlLang(other)}" href="${esc(abs(otherPath))}">
<link rel="alternate" hreflang="x-default" href="${esc(abs(localize(path, 'zh')))}">
<meta name="theme-color" content="#120e24">
<meta name="author" content="${esc(site.name)}">

<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(abs(path))}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${lang === 'zh' ? 'zh_CN' : 'en_US'}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(fullTitle)}">
${articleMeta}

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImage)}">

<link rel="icon" href="${u('/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${u('/favicon.svg')}">
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
    { href: localize('/anime/', lang), label: t.navAnime, match: '/anime/' },
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
      <button class="lang-toggle" type="button" data-lang-switch="${other}" data-target="${esc(u(switchLangPath(path, other)))}" aria-label="${esc(t.langLabel)}">${esc(t.langShort)}</button>
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
${musicPlayer(lang)}
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
${musicScript()}
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
  type?: 'website' | 'article';
  article?: { published: Date; tags: string[]; lang: Lang };
  noindex?: boolean;
}): string {
  const { lang, path, title, description, content, type, article, noindex } = opts;
  return `${head({ title, description, path, lang, type, article, noindex })}
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
