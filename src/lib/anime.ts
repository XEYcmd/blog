import { esc } from './esc';
import { u } from './base';
import { localize, text } from './data';
import type { Lang } from './data';
import { pageShell } from './html';
import { animeList, animeTags, baikeUrl } from '../data/anime';

/** 每行显示的标签数上限（避免卡片过高） */
const MAX_TAGS = 3;

function renderItem(item: (typeof animeList)[number], index: number): string {
  const tags = item.tags.slice(0, MAX_TAGS);
  const extra = item.tags.length > MAX_TAGS ? `<span class="anime__tag anime__tag--more">+${item.tags.length - MAX_TAGS}</span>` : '';

  return `<li class="anime__item" data-tags="${esc(item.tags.join(' '))}" data-name="${esc(item.name.toLowerCase())}">
    <span class="anime__index" aria-hidden="true">${String(index + 1).padStart(3, '0')}</span>
    <div class="anime__main">
      <span class="anime__name">${esc(item.name)}</span>
      <span class="anime__tags">${tags.map((t) => `<span class="anime__tag">${esc(t)}</span>`).join('')}${extra}</span>
    </div>
    <span class="anime__links">
      <a class="anime__link anime__link--baike" href="${esc(baikeUrl(item))}" target="_blank" rel="noopener noreferrer" title="百度百科" aria-label="${esc(item.name)} · 百度百科">百科</a>
    </span>
  </li>`;
}

export function animePage(opts: { lang: Lang; path: string }): string {
  const { lang, path } = opts;
  const t = text[lang];
  const tags = animeTags();

  const items = animeList.map((item, i) => renderItem(item, i)).join('\n');

  const content = `<section class="container anime">
    <header class="anime__head">
      <h1>${esc(t.animeTitle)}</h1>
      <p>${esc(t.animeSubtitle)}</p>
      <p class="meta">${esc(t.animeCount(animeList.length))}</p>
    </header>

    <div class="anime__toolbar">
      <label class="anime__search">
        <span class="sr-only">${esc(t.animeSearchLabel)}</span>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        <input type="search" id="anime-search" placeholder="${esc(t.animeSearchPlaceholder)}" autocomplete="off" spellcheck="false">
      </label>
      <p class="anime__hint" id="anime-hint">${esc(t.animeHint)}</p>
    </div>

    <div class="anime__filters" role="group" aria-label="${esc(t.animeFilterLabel)}">
      <button class="anime__chip is-active" type="button" data-tag="">${esc(t.animeAll)}</button>
      ${tags.map((tag) => `<button class="anime__chip" type="button" data-tag="${esc(tag)}">${esc(tag)}</button>`).join('')}
    </div>

    <ul class="anime__list" id="anime-list">
      ${items}
    </ul>

    <p class="anime__empty" id="anime-empty" hidden>${esc(t.animeEmpty)}</p>

    <p class="anime__note">
      ${esc(t.animeNote)}
      <a href="https://baike.baidu.com/" target="_blank" rel="noopener noreferrer">百度百科</a>
    </p>
  </section>`;

  return pageShell({
    lang,
    path,
    title: t.animeTitle,
    description: t.animeSubtitle,
    content,
  });
}

/** 筛选脚本：搜索 + 标签过滤，纯前端，不依赖框架 */
export function animeScript(): string {
  return `<script>
(function () {
  var list = document.getElementById('anime-list');
  if (!list) return;
  var items = Array.prototype.slice.call(list.querySelectorAll('.anime__item'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.anime__chip'));
  var input = document.getElementById('anime-search');
  var empty = document.getElementById('anime-empty');
  var hint = document.getElementById('anime-hint');
  var activeTag = '';
  var keyword = '';

  function apply() {
    var shown = 0;
    items.forEach(function (el) {
      var name = el.getAttribute('data-name') || '';
      var tags = el.getAttribute('data-tags') || '';
      var okTag = !activeTag || (' ' + tags + ' ').indexOf(' ' + activeTag + ' ') !== -1;
      var okKey = !keyword || name.indexOf(keyword) !== -1;
      var show = okTag && okKey;
      el.hidden = !show;
      if (show) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
    if (hint) hint.textContent = '显示 ' + shown + ' / ' + items.length;
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      activeTag = chip.getAttribute('data-tag') || '';
      apply();
    });
  });

  if (input) {
    input.addEventListener('input', function () {
      keyword = input.value.trim().toLowerCase();
      apply();
    });
    // 按 / 快速聚焦搜索框
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== input) {
        e.preventDefault();
        input.focus();
      }
    });
  }

  apply();
})();
</script>`;
}
