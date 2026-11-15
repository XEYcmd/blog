// 全局脚本：鼠标光点拖尾（所有页面都有，颜色偏淡）

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function initCursorTrail() {
  if (reduceMotion.matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-trail';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  type Spark = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    max: number;
    hue: number;
    size: number;
  };

  const sparks: Spark[] = [];
  const MAX = 140;

  window.addEventListener(
    'pointermove',
    (e) => {
      // 每次移动只留 1~2 颗，避免糊成一片
      const amount = Math.random() < 0.55 ? 1 : 2;
      for (let i = 0; i < amount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 0.15 + Math.random() * 0.55;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 0.15,
          life: 0,
          max: 420 + Math.random() * 320,
          hue: Math.random() < 0.5 ? 268 : 330,
          size: 0.9 + Math.random() * 1.4,
        });
      }
      if (sparks.length > MAX) sparks.splice(0, sparks.length - MAX);
    },
    { passive: true },
  );

  let raf = 0;
  let last = performance.now();

  const frame = (now: number) => {
    const dt = now - last;
    last = now;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.life += dt;
      if (p.life >= p.max) {
        sparks.splice(i, 1);
        continue;
      }
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      p.vy += 0.003 * (dt / 16);

      const t = 1 - p.life / p.max;
      // 整体比之前淡一半左右
      ctx.globalAlpha = t * 0.42;
      const r = p.size * (0.6 + t * 0.7) * 3.4;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, `hsla(${p.hue}, 100%, 92%, 0.9)`);
      g.addColorStop(0.35, `hsla(${p.hue}, 100%, 78%, 0.35)`);
      g.addColorStop(1, `hsla(${p.hue}, 100%, 70%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  let resizeTimer: number | undefined;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 180);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  });
}

type FooterQuote = {
  main: string;
  sub: string;
  by: string;
};

/** 页脚名言：每次刷新随机换一条，并用打字机逐字显示 */
function initFooterQuote() {
  const root = document.querySelector<HTMLElement>('[data-footer-quote]');
  const dataEl = document.querySelector<HTMLScriptElement>('[data-footer-quotes]');
  if (!root || !dataEl) return;

  let items: FooterQuote[] = [];
  try {
    const parsed: unknown = JSON.parse(dataEl.textContent || '[]');
    if (Array.isArray(parsed)) items = parsed as FooterQuote[];
  } catch {
    return;
  }
  if (items.length === 0) return;

  const mainEl = root.querySelector<HTMLElement>('[data-quote-main]');
  const subEl = root.querySelector<HTMLElement>('[data-quote-sub]');
  const byEl = root.querySelector<HTMLElement>('[data-quote-by]');
  if (!mainEl || !byEl) return;

  // 同一个标签页连续刷新时，尽量不重复上一条
  let index = Math.floor(Math.random() * items.length);
  try {
    const last = sessionStorage.getItem('xey-quote');
    if (items.length > 1 && String(index) === last) {
      index = (index + 1 + Math.floor(Math.random() * (items.length - 1))) % items.length;
    }
    sessionStorage.setItem('xey-quote', String(index));
  } catch {
    /* 隐私模式下忽略 */
  }

  const quote = items[index];
  if (subEl) subEl.textContent = quote.sub;
  byEl.textContent = `—— ${quote.by}`;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    mainEl.textContent = quote.main;
    return;
  }

  root.classList.add('is-waiting', 'is-typing');
  mainEl.textContent = '';

  const text = quote.main;
  let i = 0;

  const type = () => {
    i += 1;
    mainEl.textContent = text.slice(0, i);
    if (i >= text.length) {
      window.setTimeout(() => root.classList.remove('is-typing', 'is-waiting'), 260);
      return;
    }
    const ch = text.charAt(i - 1);
    const pause =
      ch === '。' || ch === '！' || ch === '？' || ch === '.' || ch === '!' || ch === '?'
        ? 260
        : ch === '、' || ch === '…' || ch === ',' || ch === ';' || ch === ':'
          ? 130
          : 38 + Math.random() * 34;
    window.setTimeout(type, pause);
  };

  window.setTimeout(type, 420);
}

function boot() {
  initCursorTrail();
  initFooterQuote();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
