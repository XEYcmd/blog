import { homePage } from './home';
import { buttons, backgrounds, typingLines } from './data';
import type { Lang } from './data';
import { text } from './data';
import { esc, STYLE_LINKS } from './esc';

/** 首页模板（中/英共用），由 src/pages/index.astro 与 en/index.astro 调用 */
export function renderHome(lang: Lang, script = ''): string {
  return homePage({
    lang,
    path: lang === 'zh' ? '/' : '/en/',
    backgrounds,
    typing: typingLines[lang],
    script,
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
