import { esc } from './esc';
import { u } from './base';
import { text } from './data';
import type { Lang } from './data';
import { tracks, DEFAULT_VOLUME, REMEMBER_STATE } from '../data/music';

const ICONS = {
  play: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><rect x="7" y="5" width="4" height="14" rx="1"/><rect x="13" y="5" width="4" height="14" rx="1"/></svg>`,
  prev: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 5h2v14H7zM19 5v14l-9-7z"/></svg>`,
  next: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M15 5h2v14h-2zM5 5l9 7-9 7z"/></svg>`,
  volume: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h3l5 4V5L7 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>`,
  mute: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h3l5 4V5L7 9z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>`,
  modeLoop: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>`,
  modeOne: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/><path d="M12 9v6"/></svg>`,
  modeShuffle: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>`,
  music: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l10-2v13"/><circle cx="6.5" cy="18" r="3"/><circle cx="16.5" cy="16" r="3"/></svg>`,
};

/** 播放器 HTML + 样式挂点。歌单为空时也渲染按钮，点击后提示去配置。 */
export function musicPlayer(lang: Lang): string {
  const t = text[lang];
  const isEmpty = tracks.length === 0;

  const listItems = isEmpty
    ? `<li class="mp__empty">${esc(t.playerEmpty)}</li>`
    : tracks
        .map((track, i) => {
          const src = track.src.startsWith('/') ? u(track.src) : track.src;
          const cover = track.cover ? (track.cover.startsWith('/') ? u(track.cover) : track.cover) : '';
          return `<li class="mp__track" data-index="${i}" data-src="${esc(src)}" data-cover="${esc(cover)}">
        <button class="mp__track-btn" type="button">
          <span class="mp__track-no" aria-hidden="true">${i + 1}</span>
          <span class="mp__track-meta">
            <span class="mp__track-title">${esc(track.title)}</span>
            <span class="mp__track-artist">${esc(track.artist ?? '')}</span>
          </span>
          <span class="mp__track-state" aria-hidden="true"></span>
        </button>
      </li>`;
        })
        .join('');

  return `<div class="mp" id="music-player" data-lang="${lang}">
  <audio id="mp-audio" preload="metadata"></audio>

  <button class="mp__toggle" id="mp-toggle" type="button" aria-expanded="false" aria-controls="mp-panel" aria-label="${esc(t.playerOpen)}">
    <span class="mp__toggle-icon">${ICONS.music}</span>
    <span class="mp__toggle-ring" aria-hidden="true"></span>
  </button>

  <section class="mp__panel" id="mp-panel" aria-label="${esc(t.playerTitle)}" hidden>
    <header class="mp__head">
      <span class="mp__label">${esc(t.playerTitle)}</span>
      <button class="mp__close" id="mp-close" type="button" aria-label="${esc(t.playerClose)}">×</button>
    </header>

    <div class="mp__now">
      <div class="mp__cover" id="mp-cover">${ICONS.music}</div>
      <div class="mp__info">
        <p class="mp__title" id="mp-title">${esc(t.playerNoTrack)}</p>
        <p class="mp__artist" id="mp-artist"></p>
      </div>
    </div>

    <div class="mp__progress-wrap">
      <input class="mp__progress" id="mp-progress" type="range" min="0" max="1000" value="0" step="1" aria-label="${esc(t.playerSeek)}">
      <div class="mp__times">
        <span id="mp-current">0:00</span>
        <span id="mp-duration">0:00</span>
      </div>
    </div>

    <div class="mp__controls">
      <button class="mp__btn" id="mp-mode" type="button" aria-label="${esc(t.playerMode)}">${ICONS.modeLoop}</button>
      <button class="mp__btn" id="mp-prev" type="button" aria-label="${esc(t.playerPrev)}">${ICONS.prev}</button>
      <button class="mp__btn mp__btn--main" id="mp-play" type="button" aria-label="${esc(t.playerPlay)}">${ICONS.play}</button>
      <button class="mp__btn" id="mp-next" type="button" aria-label="${esc(t.playerNext)}">${ICONS.next}</button>
      <div class="mp__volume">
        <button class="mp__btn" id="mp-mute" type="button" aria-label="${esc(t.playerMute)}">${ICONS.volume}</button>
        <input class="mp__volume-range" id="mp-volume" type="range" min="0" max="100" value="${Math.round(
          DEFAULT_VOLUME * 100,
        )}" aria-label="${esc(t.playerVolume)}">
      </div>
    </div>

    <ul class="mp__list" id="mp-list">
      ${listItems}
    </ul>
  </section>
</div>`;
}

/** 播放器脚本（内联，避免额外请求） */
export function musicScript(): string {
  const hasTracks = tracks.length > 0;
  return `<script>
(function () {
  var root = document.getElementById('music-player');
  if (!root) return;

  var HAS_TRACKS = ${hasTracks ? 'true' : 'false'};

  var audio = document.getElementById('mp-audio');
  var toggle = document.getElementById('mp-toggle');
  var panel = document.getElementById('mp-panel');
  var closeBtn = document.getElementById('mp-close');
  var playBtn = document.getElementById('mp-play');
  var prevBtn = document.getElementById('mp-prev');
  var nextBtn = document.getElementById('mp-next');
  var modeBtn = document.getElementById('mp-mode');
  var muteBtn = document.getElementById('mp-mute');
  var progress = document.getElementById('mp-progress');
  var volume = document.getElementById('mp-volume');
  var curEl = document.getElementById('mp-current');
  var durEl = document.getElementById('mp-duration');
  var titleEl = document.getElementById('mp-title');
  var artistEl = document.getElementById('mp-artist');
  var coverEl = document.getElementById('mp-cover');
  var listEl = document.getElementById('mp-list');

  var ICON_PLAY = ${JSON.stringify(ICONS.play)};
  var ICON_PAUSE = ${JSON.stringify(ICONS.pause)};
  var ICON_LOOP = ${JSON.stringify(ICONS.modeLoop)};
  var ICON_ONE = ${JSON.stringify(ICONS.modeOne)};
  var ICON_SHUFFLE = ${JSON.stringify(ICONS.modeShuffle)};
  var ICON_VOL = ${JSON.stringify(ICONS.volume)};
  var ICON_MUTE = ${JSON.stringify(ICONS.mute)};
  var ICON_MUSIC = ${JSON.stringify(ICONS.music)};

  var items = Array.prototype.slice.call(listEl.querySelectorAll('.mp__track'));

  var MODES = ['loop', 'one', 'shuffle'];
  var state = {
    index: 0,
    mode: 'loop',
    volume: ${DEFAULT_VOLUME},
    muted: false,
    seeking: false,
  };

  var KEY = 'xey-mp-state';
  var REMEMBER = ${REMEMBER_STATE ? 'true' : 'false'};

  function save() {
    if (!REMEMBER) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({
        index: state.index,
        mode: state.mode,
        volume: state.volume,
        muted: state.muted,
        time: audio.currentTime || 0,
      }));
    } catch (e) {}
  }

  function restore() {
    if (!REMEMBER) return;
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return;
      var s = JSON.parse(raw);
      if (typeof s.index === 'number' && s.index >= 0 && s.index < items.length) state.index = s.index;
      if (MODES.indexOf(s.mode) !== -1) state.mode = s.mode;
      if (typeof s.volume === 'number') state.volume = s.volume;
      state.muted = !!s.muted;
      state.savedTime = typeof s.time === 'number' ? s.time : 0;
    } catch (e) {}
  }

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) return '0:00';
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function setIcons() {
    playBtn.innerHTML = audio.paused ? ICON_PLAY : ICON_PAUSE;
    playBtn.setAttribute('aria-label', audio.paused ? ${JSON.stringify(text.zh.playerPlay)} : ${JSON.stringify(
      text.zh.playerPause,
    )});
    modeBtn.innerHTML = state.mode === 'one' ? ICON_ONE : state.mode === 'shuffle' ? ICON_SHUFFLE : ICON_LOOP;
    modeBtn.setAttribute('data-mode', state.mode);
    muteBtn.innerHTML = state.muted || state.volume === 0 ? ICON_MUTE : ICON_VOL;
  }

  function markActive() {
    items.forEach(function (li, i) {
      li.classList.toggle('is-active', i === state.index);
    });
  }

  function loadTrack(index, autoplay) {
    if (!items.length) return;
    state.index = (index + items.length) % items.length;
    var li = items[state.index];
    audio.src = li.getAttribute('data-src');
    var title = li.querySelector('.mp__track-title').textContent;
    var artist = li.querySelector('.mp__track-artist').textContent;
    titleEl.textContent = title;
    artistEl.textContent = artist;
    var cover = li.getAttribute('data-cover');
    if (cover) {
      coverEl.innerHTML = '';
      coverEl.style.backgroundImage = 'url("' + cover + '")';
      coverEl.classList.add('has-cover');
    } else {
      coverEl.style.backgroundImage = '';
      coverEl.classList.remove('has-cover');
      coverEl.innerHTML = ICON_MUSIC;
    }
    markActive();
    if (autoplay) {
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  function nextIndex(dir) {
    if (state.mode === 'shuffle' && items.length > 1) {
      var n = state.index;
      while (n === state.index) n = Math.floor(Math.random() * items.length);
      return n;
    }
    return (state.index + dir + items.length) % items.length;
  }

  function play() {
    if (!HAS_TRACKS || !items.length) return;
    if (!audio.src) loadTrack(state.index, false);
    var p = audio.play();
    if (p && p.catch) p.catch(function () {});
  }

  function pause() {
    audio.pause();
  }

  /* ---- 面板开关 ---- */
  function openPanel() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    root.classList.add('is-open');
  }
  function closePanel() {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    root.classList.remove('is-open');
  }
  toggle.addEventListener('click', function () {
    if (panel.hidden) openPanel(); else closePanel();
  });
  closeBtn.addEventListener('click', closePanel);

  /* ---- 控制 ---- */
  playBtn.addEventListener('click', function () {
    if (audio.paused) play(); else pause();
  });
  prevBtn.addEventListener('click', function () {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    loadTrack(nextIndex(-1), true);
  });
  nextBtn.addEventListener('click', function () {
    loadTrack(nextIndex(1), true);
  });
  modeBtn.addEventListener('click', function () {
    var i = MODES.indexOf(state.mode);
    state.mode = MODES[(i + 1) % MODES.length];
    setIcons();
    save();
  });
  muteBtn.addEventListener('click', function () {
    state.muted = !state.muted;
    audio.muted = state.muted;
    setIcons();
    save();
  });
  volume.addEventListener('input', function () {
    state.volume = Number(volume.value) / 100;
    audio.volume = state.volume;
    if (state.volume > 0 && state.muted) {
      state.muted = false;
      audio.muted = false;
    }
    setIcons();
    save();
  });

  /* ---- 进度 ---- */
  progress.addEventListener('input', function () {
    state.seeking = true;
    if (audio.duration) {
      curEl.textContent = fmt((Number(progress.value) / 1000) * audio.duration);
    }
  });
  progress.addEventListener('change', function () {
    if (audio.duration) audio.currentTime = (Number(progress.value) / 1000) * audio.duration;
    state.seeking = false;
  });

  audio.addEventListener('timeupdate', function () {
    if (state.seeking || !audio.duration) return;
    progress.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
    curEl.textContent = fmt(audio.currentTime);
  });
  audio.addEventListener('loadedmetadata', function () {
    durEl.textContent = fmt(audio.duration);
  });
  audio.addEventListener('play', setIcons);
  audio.addEventListener('pause', setIcons);
  audio.addEventListener('ended', function () {
    if (state.mode === 'one') {
      audio.currentTime = 0;
      play();
      return;
    }
    loadTrack(nextIndex(1), true);
  });
  audio.addEventListener('error', function () {
    titleEl.textContent = '无法播放（检查文件路径）';
  });

  /* ---- 列表点选 ---- */
  items.forEach(function (li, i) {
    li.querySelector('.mp__track-btn').addEventListener('click', function () {
      if (i === state.index && !audio.paused) {
        pause();
      } else {
        loadTrack(i, true);
      }
    });
  });

  /* ---- 媒体键 / 键盘 ---- */
  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.setActionHandler('play', play);
      navigator.mediaSession.setActionHandler('pause', pause);
      navigator.mediaSession.setActionHandler('previoustrack', function () {
        loadTrack(nextIndex(-1), true);
      });
      navigator.mediaSession.setActionHandler('nexttrack', function () {
        loadTrack(nextIndex(1), true);
      });
    } catch (e) {}
  }
  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.code === 'Space' && !panel.hidden) {
      e.preventDefault();
      if (audio.paused) play(); else pause();
    }
  });

  /* ---- 初始化 ---- */
  restore();
  audio.volume = state.volume;
  audio.muted = state.muted;
  volume.value = String(Math.round(state.volume * 100));
  setIcons();
  loadTrack(state.index, false);

  // 恢复上次进度（只在同一条曲目时）
  if (state.savedTime) {
    var onMeta = function () {
      if (state.savedTime < audio.duration - 3) audio.currentTime = state.savedTime;
      audio.removeEventListener('loadedmetadata', onMeta);
    };
    audio.addEventListener('loadedmetadata', onMeta);
  }

  window.addEventListener('beforeunload', save);
  setInterval(save, 5000);
})();
</script>`;
}
