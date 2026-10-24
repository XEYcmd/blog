// 构建前同步静态资源：
//   1. 从 node_modules/@fontsource 复制等宽字体（拉丁子集）到 public/fonts
//   2. 把 src/styles/*.css 复制到 public/styles
// 正文使用系统字体（中文观感好、零下载），标题圆体由 scripts/build-display-font.mjs 生成。
// 用法：node scripts/sync-assets.mjs（已挂到 npm run build 的 prebuild）
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const PUB = join(ROOT, 'public');
const ensure = (p) => mkdirSync(p, { recursive: true });

/* ---------- 1. 等宽字体 ---------- */
const FONT_OUT = join(PUB, 'fonts');
ensure(FONT_OUT);

function copySubsetCss(pkgDir, cssFile, outName) {
  const cssPath = join(pkgDir, cssFile);
  if (!existsSync(cssPath)) return false;
  let css = readFileSync(cssPath, 'utf8');
  const files = [...css.matchAll(/url\(\.\/files\/([^)]+?\.woff2)\)/g)].map((m) => m[1]);
  for (const name of files) {
    const from = join(pkgDir, 'files', name);
    const to = join(FONT_OUT, name);
    if (existsSync(from) && !existsSync(to)) copyFileSync(from, to);
  }
  css = css.replace(/url\(\.\/files\/([^)]+?\.woff2)\)/g, 'url(/fonts/$1)');
  css = css.replace(/,\s*url\([^)]+\.woff\)\s*format\('woff'\)/g, '');
  writeFileSync(join(FONT_OUT, outName), css);
  return true;
}

const monoDir = join(ROOT, 'node_modules', '@fontsource', 'jetbrains-mono');
for (const weight of [400, 700]) {
  copySubsetCss(monoDir, `latin-${weight}.css`, `jetbrains-mono-${weight}.css`);
}

// 清理历史遗留的字体分片（旧方案把整包日文子集都复制了）
const KEEP = /^(jetbrains-mono-|zen-maru-|.*\.css$|files$)/;
for (const name of readdirSync(FONT_OUT)) {
  if (!KEEP.test(name)) {
    try {
      const { rmSync } = await import('node:fs');
      rmSync(join(FONT_OUT, name), { force: true });
    } catch {
      /* ignore */
    }
  }
}

if (!existsSync(join(FONT_OUT, 'files', 'zen-maru-subset-700.woff2'))) {
  console.warn('[assets] 缺少标题圆体子集，运行 npm run font 生成（需要 fonttools + brotli）');
}

/* ---------- 2. 样式 ---------- */
const STYLE_SRC = join(ROOT, 'src', 'styles');
const STYLE_OUT = join(PUB, 'styles');
ensure(STYLE_OUT);
for (const file of readdirSync(STYLE_SRC)) {
  if (file.endsWith('.css')) copyFileSync(join(STYLE_SRC, file), join(STYLE_OUT, file));
}

ensure(join(PUB, 'backgrounds'));
console.log('[assets] 字体与样式已同步到 public/');
