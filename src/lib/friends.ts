import { esc } from './esc';
import { text } from './data';
import type { Lang } from './data';
import { pageShell } from './html';
import { friends } from '../data/friends';

/** 域名 → 去掉 www 和协议，用于卡片里显示来源 */
function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function friendsPage(opts: { lang: Lang; path: string }): string {
  const { lang, path } = opts;
  const t = text[lang];

  const cards = friends.length
    ? `<div class="friends__grid">${friends
        .map(
          (f) => `<article class="friend-card glass">
        <header class="friend-card__head">
          <div class="friend-card__title">
            <h3 class="friend-card__name">${esc(f.name)}</h3>
            <span class="friend-card__host">${esc(hostOf(f.url))}</span>
          </div>
        </header>
        ${f.desc ? `<p class="friend-card__desc">${esc(f.desc)}</p>` : ''}
        <div class="friend-card__actions">
          <a class="friend-card__visit" href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">
            ${esc(t.friendsVisit)}
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3h7v7"/><path d="M21 3l-9 9"/><path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></svg>
          </a>
          <button class="friend-card__copy" type="button" data-copy="${esc(f.url)}" aria-label="${esc(t.friendsCopy)}: ${esc(f.name)}" title="${esc(t.friendsCopy)}">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>
      </article>`,
        )
        .join('\n')}</div>`
    : `<p class="friends__empty glass">${esc(t.friendsEmpty)}</p>`;

  const content = `<section class="container friends">
    <header class="friends__head">
      <h1>${esc(t.friendsTitle)}</h1>
      <p>${esc(t.friendsSubtitle)}</p>
    </header>

    ${cards}

    <p class="friends__count">${esc(t.friendsCount(friends.length))}</p>
  </section>`;

  return pageShell({
    lang,
    path,
    title: t.friendsTitle,
    description: t.friendsSubtitle,
    content,
  });
}

/** 复制链接按钮的脚本 */
export function friendsScript(lang: Lang): string {
  const t = text[lang];
  return `<script>
(function () {
  function feedback(btn) {
    btn.classList.add('is-copied');
    var old = btn.getAttribute('title');
    btn.setAttribute('title', ${JSON.stringify(t.friendsCopied)});
    setTimeout(function () {
      btn.classList.remove('is-copied');
      btn.setAttribute('title', old);
    }, 1600);
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var url = btn.getAttribute('data-copy') || '';

      // 优先用 Clipboard API；不可用或被拒时退回 execCommand
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(
          function () { feedback(btn); },
          function () { if (legacyCopy(url)) feedback(btn); },
        );
      } else if (legacyCopy(url)) {
        feedback(btn);
      }
    });
  });
})();
</script>`;
}
