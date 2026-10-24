// 引入浏览器端脚本：src/scripts/home.ts 由 scripts/build-scripts.mjs 打包成 public/scripts/home.js
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { u } from './base';

const SCRIPT_PATH = join(process.cwd(), 'public', 'scripts', 'home.js');

let cached: string | null = null;

export function homeScript(): string {
  if (cached !== null) return cached;
  if (!existsSync(SCRIPT_PATH)) {
    console.warn('[scripts] 缺少 public/scripts/home.js，先运行 npm run build（prebuild 会生成）');
    cached = '';
    return cached;
  }
  cached = `<script src="${u('/scripts/home.js')}" defer></script>`;
  return cached;
}
