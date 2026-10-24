import { homePage } from './home';
import type { HomeTeaser } from './home';
import { buttons, backgrounds, loadPosts, text, typingLines } from './data';
import type { Lang } from './data';
import { localize } from './data';
import { globalScript, homeScript } from './scripts';

const fmt = (d: Date, lang: Lang) =>
  new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);

function buildTeaser(lang: Lang): HomeTeaser {
  const t = text[lang];
  const posts = loadPosts()
    .slice(0, 3)
    .map((post) => ({
      id: post.id,
      title: post.title,
      summary: post.summary || post.title,
      dateText: fmt(post.date, lang),
      href: localize(`/posts/${post.id}/`, lang),
    }));

  return {
    posts,
    about: {
      tagline: t.aboutTagline,
      lines: t.aboutBio.slice(0, 2),
      href: localize('/about/', lang),
    },
  };
}

/** 首页模板（中/英共用），由 src/pages/index.astro 与 en/index.astro 调用 */
export function renderHome(lang: Lang): string {
  return homePage({
    lang,
    path: lang === 'zh' ? '/' : '/en/',
    backgrounds,
    typing: typingLines[lang],
    teaser: buildTeaser(lang),
    script: homeScript(),
    globalScript: globalScript(),
    buttons: buttons.map((b) => ({
      key: b.key,
      href: b.href,
      external: Boolean((b as { external?: boolean }).external),
      kana: b.kana,
      label: b.label[lang],
      icon: b.icon,
    })),
  });
}
