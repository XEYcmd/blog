import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { u } from './base';

export const BACKGROUND_EXTS = /\.(png|jpe?g|webp|avif|gif)$/i;

/** 扫描 public/backgrounds/ 下的图片，按文件名自然排序，返回带基路径的站内路径 */
export function scanBackgrounds(dir = 'public/backgrounds'): string[] {
  try {
    if (!statSync(dir).isDirectory()) return [];
  } catch {
    return [];
  }
  return readdirSync(dir)
    .filter((f) => BACKGROUND_EXTS.test(f) && !statSync(join(dir, f)).isDirectory())
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .map((f) => u(`/backgrounds/${encodeURIComponent(f)}`));
}
