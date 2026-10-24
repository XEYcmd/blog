// 首页交互脚本：背景预加载 + 打字 + 樱花粒子 + 鼠标光点拖尾 + 入场淡入

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* =========================================================
 * 1. 背景：图片清单已在服务端渲染进页面，这里只负责预加载
 * ======================================================= */
function preloadBackgrounds(root: HTMLElement) {
  const list = root.querySelectorAll<HTMLElement>('[data-bg-url]');
  list.forEach((el, i) => {
    const src = el.dataset.bgUrl;
    if (!src) return;
    const img = new Image();
    img.decoding = 'async';
    // 第一张立刻加载，其余延后
    if (i === 0) {
      img.src = src;
    } else {
      window.setTimeout(() => (img.src = src), 600 + i * 250);
    }
  });
}

/* =========================================================
 * 2. 打字特效：打字 → 停顿 → 删除 → 下一句
 * ======================================================= */
function initTyping(root: HTMLElement) {
  const target = root.querySelector<HTMLElement>('[data-typing-target]');
  if (!target) return;

  let lines: string[] = [];
  try {
    lines = JSON.parse(root.dataset.typing || '[]');
  } catch {
    lines = [];
  }
  lines = lines.filter((l) => typeof l === 'string' && l.length > 0);
  if (!lines.length) return;

  if (reduceMotion.matches) {
    target.textContent = lines[0];
    return;
  }

  // 预留最长句子的高度，避免打字时布局跳动
  const title = target.closest<HTMLElement>('h1');
  if (title) {
    const probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;top:0;';
    probe.textContent = lines.reduce((a, b) => (a.length >= b.length ? a : b), '');
    title.appendChild(probe);
    title.style.minHeight = `${probe.offsetHeight}px`;
    probe.remove();
  }

  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const pause = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

  const run = async () => {
    for (;;) {
      if (document.hidden) {
        await new Promise<void>((resolve) => document.addEventListener('visibilitychange', () => resolve(), { once: true }));
      }
      const line = lines[lineIndex];
      if (!deleting) {
        charIndex++;
        target.textContent = line.slice(0, charIndex);
        if (charIndex >= line.length) {
          deleting = true;
          await pause(2200);
          continue;
        }
        await pause(85 + Math.random() * 70);
      } else {
        charIndex--;
        target.textContent = line.slice(0, Math.max(0, charIndex));
        if (charIndex <= 0) {
          deleting = false;
          lineIndex = (lineIndex + 1) % lines.length;
          await pause(480);
          continue;
        }
        await pause(34 + Math.random() * 24);
      }
    }
  };

  void run();
}

/* =========================================================
 * 3. 樱花 + 星光粒子
 * ======================================================= */
function initPetals(canvas: HTMLCanvasElement) {
  if (reduceMotion.matches) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;

  const resize = () => {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  const COLORS = ['#ffd1e6', '#ffb3d1', '#ffffff', '#e6ddff', '#ffe9f3'];

  type Particle = {
    x: number;
    y: number;
    z: number;
    size: number;
    speed: number;
    sway: number;
    phase: number;
    rot: number;
    vr: number;
    color: string;
    star: boolean;
  };

  const count = () => Math.min(70, Math.round((w * h) / 22000));

  const spawn = (initial = false): Particle => {
    const z = 0.35 + Math.random() * 0.65;
    const star = Math.random() < 0.22;
    return {
      x: Math.random() * w,
      y: initial ? Math.random() * h : -20 - Math.random() * 60,
      z,
      size: star ? 1 + z * 2 : 6 + z * 9,
      speed: 18 + z * 46,
      sway: 14 + Math.random() * 30,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.9,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      star,
    };
  };

  let list = Array.from({ length: count() }, () => spawn(true));

  const draw = (p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = 0.35 + p.z * 0.5;
    ctx.fillStyle = p.color;
    const s = p.size;
    if (p.star) {
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8 * p.z;
      const t = s * 1.6;
      ctx.beginPath();
      ctx.moveTo(0, -t);
      ctx.quadraticCurveTo(0, 0, t, 0);
      ctx.quadraticCurveTo(0, 0, 0, t);
      ctx.quadraticCurveTo(0, 0, -t, 0);
      ctx.quadraticCurveTo(0, 0, 0, -t);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.6);
      ctx.bezierCurveTo(s * 0.8, -s * 0.4, s * 0.6, s * 0.5, 0, s * 0.7);
      ctx.bezierCurveTo(-s * 0.6, s * 0.5, -s * 0.8, -s * 0.4, 0, -s * 0.6);
      ctx.fill();
    }
    ctx.restore();
  };

  let raf = 0;
  let last = performance.now();

  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      p.phase += dt * 0.9;
      p.y += p.speed * dt;
      p.x += Math.sin(p.phase) * p.sway * dt;
      p.rot += p.vr * dt;
      if (p.y > h + 30 || p.x < -60 || p.x > w + 60) {
        list[i] = spawn();
        continue;
      }
      draw(p);
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  let resizeTimer: number | undefined;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resize();
      list = Array.from({ length: count() }, () => spawn(true));
    }, 180);
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

/* =========================================================
 * 4. 入场淡入
 * ======================================================= */
function initFade(root: HTMLElement) {
  const els = root.querySelectorAll<HTMLElement>('[data-fade]');
  els.forEach((el) => {
    const delay = Number(el.dataset.fadeDelay || 0);
    window.setTimeout(() => el.classList.add('is-in'), Math.min(delay, 2500));
  });
}

/* =========================================================
 * 启动
 * ======================================================= */
function boot() {
  const root = document.querySelector<HTMLElement>('[data-home]');
  if (!root) return;

  initFade(root);
  initTyping(root);
  preloadBackgrounds(root);

  const petals = root.querySelector<HTMLCanvasElement>('canvas.petals');
  if (petals) initPetals(petals);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
