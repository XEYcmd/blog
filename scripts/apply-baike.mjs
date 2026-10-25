// 把 _baike-resolved.json 里的精确链接写进 src/data/anime.ts
// 用法：node scripts/apply-baike.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const RESOLVED = 'scripts/_baike-resolved.json';
const OUT = 'src/data/anime.ts';

if (!existsSync(RESOLVED)) {
  console.error('缺少 scripts/_baike-resolved.json，先运行 scripts/_baike-resolve.mjs');
  process.exit(1);
}

const resolved = JSON.parse(readFileSync(RESOLVED, 'utf8'));

/** 从完整 URL 里取出 /item/xxx/id 路径部分（去掉 query） */
function toPath(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    // 只有 /item/... 才是词条；落到首页或其他路径的视为失败
    if (!u.pathname.startsWith('/item/')) return null;
    return u.pathname; // /item/%E5%86%B0%E8%8F%93/5650507
  } catch {
    return null;
  }
}

const lines = [];
lines.push('/**');
lines.push(' * 番剧推荐数据（自动生成，请勿手改）');
lines.push(' *');
lines.push(' * 由 scripts/build-anime.mjs + scripts/apply-baike.mjs 生成。');
lines.push(' * baikePath 是百度百科词条的规范路径（含数字 ID，避免落到消歧义页）。');
lines.push(' */');
lines.push('');
lines.push('export type AnimeItem = {');
lines.push('  name: string;');
lines.push('  tags: string[];');
lines.push('  /** 百度百科词条路径，如 /item/冰菓/5650507 */');
lines.push('  baikePath?: string;');
lines.push('};');
lines.push('');

// 读现有的 anime.ts 拿 name/tags（由 build-anime.mjs 生成）
const current = readFileSync(OUT, 'utf8');
// 兼容两种格式：build-anime.mjs 产出的（可能带 moe/baike）和 apply-baike.mjs 产出的（带 baikePath）
const re = /\{ name: '((?:[^'\\]|\\.)*)', tags: \[([^\]]*)\](?:, (?:moe|baike|baikePath): '(?:[^'\\]|\\.)*')* \}/g;
const unesc = (s) => s.replace(/\\'/g, "'").replace(/\\\\/g, '\\');

const items = [];
let m;
while ((m = re.exec(current))) {
  items.push({ name: unesc(m[1]), tags: m[2] });
}

console.log(`读入 ${items.length} 条，解析结果 ${Object.keys(resolved).length} 条`);

let withPath = 0;
let missing = [];

lines.push(`/** 共 ${items.length} 部 */`);
lines.push('export const animeList: AnimeItem[] = [');

for (const item of items) {
  const r = resolved[item.name];
  const path = r?.url ? toPath(r.url) : null;
  if (path) withPath++;
  else missing.push(item.name);

  const parts = [`name: '${item.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`, `tags: [${item.tags}]`];
  if (path) parts.push(`baikePath: '${path.replace(/'/g, "\\'")}'`);
  lines.push(`  { ${parts.join(', ')} },`);
}

lines.push('];');
lines.push('');
lines.push('/** 百度百科链接：优先用精确路径，没有则退回按名字搜索 */');
lines.push('export function baikeUrl(item: AnimeItem): string {');
lines.push('  if (item.baikePath) return `https://baike.baidu.com${item.baikePath}`;');
lines.push("  return `https://baike.baidu.com/search/word?word=${encodeURIComponent(item.name)}`;");
lines.push('}');
lines.push('');

// 保留 animeTags（从 build-anime.mjs 的版本里抽出来）
const tagsFnStart = current.indexOf('/** 所有标签（按常用度排序） */');
if (tagsFnStart !== -1) {
  lines.push(current.slice(tagsFnStart).trim());
  lines.push('');
}

writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`\n已写入 ${OUT}`);
console.log(`有精确链接 ${withPath} 条，回退搜索 ${missing.length} 条`);
if (missing.length) console.log('回退条目：', missing.slice(0, 20).join(', '), missing.length > 20 ? '...' : '');
