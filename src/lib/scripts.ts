// 引入浏览器端脚本：src/scripts/*.ts 由 scripts/build-scripts.mjs 打包成 public/scripts/*.js
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { u } from './base';

const has = (name: string) => existsSync(join(process.cwd(), 'public', 'scripts', name));

let cached: string | null = null;

/** 首页交互脚本（打字、粒子、背景预加载、入场淡入） */
export function homeScript(): string {
  if (cached !== null) return cached;
  if (!has('home.js')) {
    console.warn('[scripts] 缺少 public/scripts/home.js，先运行 npm run build（prebuild 会生成）');
    cached = '';
    return cached;
  }
  cached = `<script src="${u('/scripts/home.js')}" defer></script>`;
  return cached;
}

/** 全站脚本（鼠标光点拖尾），所有页面都会引入 */
export function globalScript(): string {
  if (!has('global.js')) return '';
  return `<script src="${u('/scripts/global.js')}" defer></script>`;
}
