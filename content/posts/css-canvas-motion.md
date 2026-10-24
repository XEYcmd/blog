---
title: 给纯静态站点加一点“活”的东西
date: 2026-10-18
lang: zh
summary: 交叉淡入淡出的背景、打字机效果、樱花粒子——全部用 CSS 和原生 Canvas 实现，不需要任何动画库。
tags: [前端, CSS, Canvas]
---

# 给纯静态站点加一点"活"的东西

首页想要的效果有四个：背景轮换、打字机标题、飘落的樱花、跟着鼠标的光点。它们都可以不装任何依赖就做出来。

## 背景：纯 CSS 就能交叉淡入淡出

关键是把每张图放在独立的一层上，然后用同一个 `animation` 但不同的 `animation-delay` 错开：

```css
.bg--has-images .bg__layer {
  background-image: var(--bg-url);
  animation:
    bg-show var(--duration) ease-in-out var(--delay) infinite both,
    kenburns calc(var(--duration) * 2) ease-in-out infinite alternate;
}

@keyframes bg-show {
  0%   { opacity: 0; }
  3%   { opacity: 1; }
  50%  { opacity: 1; }
  58%, 100% { opacity: 0; }
}
```

`bg-show` 里 3% 到 50% 是全不透明，58% 之后完全透明。因为相邻两层的透明区间有重叠，叠化时两张图会同时可见——这就是交叉淡入淡出的来源。

> 把图片数量 × 2 层叠起来，轮换的循环就接上了。

## 打字机：async/await 反而最清楚

```ts
const run = async () => {
  for (;;) {
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
```

每次暂停的时长带一点随机，打出来就不会有机械感。

## 樱花粒子：Canvas 比 DOM 便宜

七十个 DOM 元素做动画会掉帧，画在 Canvas 上就几乎不花钱：

```ts
const frame = (now: number) => {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  ctx.clearRect(0, 0, w, h);

  for (const p of petals) {
    p.phase += dt * 0.9;
    p.y += p.speed * dt;
    p.x += Math.sin(p.phase) * p.sway * dt;
    p.rot += p.vr * dt;
    draw(p);
  }
  requestAnimationFrame(frame);
};
```

花瓣用 `bezierCurveTo` 画一个不对称的椭圆，星星用四个二次贝塞尔拼出来。`z` 值决定大小、速度和透明度，制造纵深。

## 别忘了尊重用户的偏好

所有动画都要在 `prefers-reduced-motion: reduce` 下退化成静态：

```css
@media (prefers-reduced-motion: reduce) {
  .bg--has-images .bg__layer { animation: none; }
  .bg--has-images .bg__layer:first-child { opacity: 1; }
}
```

```ts
if (reduceMotion.matches) {
  target.textContent = lines[0];
  return;
}
```

## 小结

| 效果 | 实现 | 依赖 |
| --- | --- | --- |
| 背景轮换 | CSS animation | 无 |
| 打字机 | async/await + setTimeout | 无 |
| 樱花粒子 | Canvas 2D | 无 |
| 光点拖尾 | Canvas 2D + pointermove | 无 |

四个效果，零依赖，整站 JS 加起来不到 12KB。
