// 一次性脚本：把 @fontsource 的 Zen Maru Gothic 日文全量字块，
// 用 pyftsubset 按站点实际用到的字符裁成一个小 woff2。
// 依赖：pip install fonttools brotli
// 用法：node scripts/build-display-font.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = 'node_modules/@fontsource/zen-maru-gothic/files/zen-maru-gothic-japanese-700-normal.woff2';
const OUT_DIR = 'public/fonts/files';
const OUT = join(OUT_DIR, 'zen-maru-subset-700.woff2');
const SCAN_DIRS = ['src', 'content'];

if (!existsSync(SRC)) {
  console.warn('[font] 未找到 @fontsource/zen-maru-gothic，跳过圆体字裁切（将使用系统圆体回退）。');
  process.exit(0);
}

const walk = (dir, acc = []) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(astro|ts|md|mdx|json|css|mjs)$/.test(name)) acc.push(p);
  }
  return acc;
};

const files = SCAN_DIRS.filter(existsSync).flatMap((d) => walk(d));
let text = '';
for (const f of files) text += readFileSync(f, 'utf8');

const chars = [...new Set([...text, ...'XEYcmd0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,!?:;\'"()[]{}<>/\\\\-_+=*&%#@~`|$^'])]
  .filter((c) => c.codePointAt(0) > 0x20 && c.codePointAt(0) < 0x3000 + 0x1000)
  .join('');

mkdirSync(OUT_DIR, { recursive: true });

try {
  execFileSync(
    'python',
    ['-m', 'fontTools.subset', SRC, `--output-file=${OUT}`, `--text=${chars}`, '--flavor=woff2', '--layout-features=kern,palt', '--no-hinting'],
    { stdio: 'inherit' },
  );
} catch {
  console.warn('[font] pyftsubset 不可用（需要 pip install fonttools brotli），改用完整日文字块回退（约 1.5MB）。');
  const { copyFileSync } = await import('node:fs');
  copyFileSync(SRC, join(OUT_DIR, 'zen-maru-japanese-700.woff2'));
  process.exit(0);
}

console.log(`[font] 已生成 ${relative('.', OUT)}（${chars.length} 个字符，${(statSync(OUT).size / 1024).toFixed(1)} KB）`);
