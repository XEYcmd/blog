/** 零依赖的 HTML 片段渲染工具：被各页面模板共用 */
import { u } from './base';

export const esc = (s: unknown): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** 字体（构建前由 scripts/sync-assets.mjs 复制到 public/fonts） */
export const FONT_LINKS = [
  u('/fonts/jetbrains-mono-400.css'),
  u('/fonts/jetbrains-mono-700.css'),
]
  .map((href) => `<link rel="stylesheet" href="${href}">`)
  .join('\n');

export const STYLE_LINKS = [
  FONT_LINKS,
  ...['display-font.css', 'global.css', 'home.css', 'inner.css'].map(
    (f) => `<link rel="stylesheet" href="${u(`/styles/${f}`)}">`,
  ),
].join('\n');
