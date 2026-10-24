// 构建前：把 src/scripts/*.ts 用 esbuild 打包成 public/scripts/*.js
// 用法：node scripts/build-scripts.mjs（已挂到 prebuild）
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src', 'scripts');
const OUT = join(ROOT, 'public', 'scripts');
mkdirSync(OUT, { recursive: true });

if (!existsSync(SRC)) {
  console.log('[scripts] 没有 src/scripts，跳过');
  process.exit(0);
}

// esbuild 是 astro 的间接依赖，按路径动态引入（Windows 下必须用 file:// URL）
const candidates = [
  join(ROOT, 'node_modules', 'esbuild', 'lib', 'main.js'),
  join(ROOT, 'node_modules', 'astro', 'node_modules', 'esbuild', 'lib', 'main.js'),
  join(ROOT, 'node_modules', 'vite', 'node_modules', 'esbuild', 'lib', 'main.js'),
];

let esbuild = null;
for (const c of candidates) {
  if (existsSync(c)) {
    esbuild = await import(pathToFileURL(c).href);
    break;
  }
}

if (!esbuild) {
  try {
    esbuild = await import('esbuild');
  } catch {
    console.error('[scripts] 找不到 esbuild，无法打包浏览器脚本');
    process.exit(1);
  }
}

const build = esbuild.build ?? esbuild.default?.build;
if (typeof build !== 'function') {
  console.error('[scripts] esbuild 接口异常');
  process.exit(1);
}

for (const file of readdirSync(SRC).filter((f) => f.endsWith('.ts'))) {
  const outfile = join(OUT, file.replace(/\.ts$/, '.js'));
  await build({
    entryPoints: [join(SRC, file)],
    outfile,
    bundle: true,
    format: 'iife',
    target: ['es2020'],
    minify: true,
    legalComments: 'none',
    logLevel: 'warning',
  });
  console.log(`[scripts] ${file} → public/scripts/${file.replace(/\.ts$/, '.js')}`);
}
