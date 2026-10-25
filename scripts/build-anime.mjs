// 从作品库 JSON 生成 src/data/anime.ts
// 用法：node scripts/build-anime.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'D:\\dsh的项目\\作品库-备份-20261024-2329.json';
const OUT = 'src/data/anime.ts';

/**
 * 少数名字和百科条目不一致的，在这里覆盖。
 * key = 作品库里的名字，value = { moe?: 萌娘条目名, baike?: 百度条目名 }
 * 不在这里出现的条目，直接用名字当条目名。
 */
const ALIAS = {
  'love live': { moe: 'LoveLive!', baike: 'LoveLive!' },
  fate: { moe: 'Fate/stay night', baike: 'Fate/stay night' },
  clannad: { moe: 'CLANNAD', baike: 'CLANNAD' },
  kanon: { moe: 'Kanon', baike: 'Kanon' },
  air: { moe: 'AIR', baike: 'AIR' },
  'little busters': { moe: 'Little Busters!', baike: 'Little Busters!' },
  rewrite: { moe: 'Rewrite', baike: 'Rewrite' },
  charlotte: { moe: 'Charlotte', baike: 'Charlotte' },
  'one room': { moe: 'One Room', baike: 'One Room' },
  'ATRI -My Dear Moments-': { baike: 'ATRI -My Dear Moments-' },
  'SSSS.GRIDMAN 电光超人古立特': { moe: 'SSSS.GRIDMAN', baike: 'SSSS.GRIDMAN' },
  'DARLING in the FRANXX': { moe: 'DARLING in the FRANXX' },
  'NEW GAME': { moe: 'NEW GAME!', baike: 'NEW GAME!' },
  annehappy: { moe: 'Anne Happy♪', baike: 'Anne Happy' },
  'GJ部': { moe: 'GJ部' },
  '学生会长是女仆': { baike: '会长是女仆大人' },
  '夏日口袋漫画': { baike: 'Summer Pockets' },
  '天使的3p': { baike: '天使的3P' },
  '奇异太郎少年的妖怪绘日记': { moe: '奇异太郎少年的妖怪绘日记' },
  '86-不存在的战区-': { baike: '86-不存在的战区-' },
  '乱马1/2': { baike: '乱马1/2' },
  '中二病也要谈恋爱 小鸟游六花•改': { baike: '中二病也要谈恋爱！恋' },
  '中二病也要谈恋爱 Take on me': { baike: '中二病也要谈恋爱！Take on me' },
  '碧蓝航线': { moe: '碧蓝航线', baike: '碧蓝航线' },
  '蔚蓝档案': { moe: '蔚蓝档案', baike: '蔚蓝档案' },
  '夜勤病栋': { baike: '夜勤病栋' },
};

/** 标签排序优先级：常用分类靠前 */
const TAG_ORDER = [
  '恋爱',
  '校园',
  '日常',
  '奇幻',
  '搞笑',
  '战斗',
  '治愈',
  '催泪',
  '异世界',
  '科幻',
  '机战',
  '青春',
  '音乐',
  '后宫',
  '剧场版',
  '冒险',
  '超能力',
  '运动',
  '百合',
  '推理',
  '悬疑',
  '热血',
  '其他',
];

const raw = JSON.parse(readFileSync(SRC, 'utf8'));
const works = raw.works;

// 按名字排序，保证每次生成结果稳定
works.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));

const escape = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const lines = [];
lines.push('/**');
lines.push(' * 番剧推荐数据（自动生成，请勿手改）');
lines.push(' *');
lines.push(' * 由 scripts/build-anime.mjs 从作品库 JSON 生成。');
lines.push(' * 要调整某个条目的百科链接，改脚本里的 ALIAS 再重新生成。');
lines.push(' */');
lines.push('');
lines.push('export type AnimeItem = {');
lines.push('  name: string;');
lines.push('  tags: string[];');
lines.push('  moe?: string;');
lines.push('  baike?: string;');
lines.push('};');
lines.push('');
lines.push(`/** 共 ${works.length} 部 */`);
lines.push('export const animeList: AnimeItem[] = [');

for (const w of works) {
  const alias = ALIAS[w.name] ?? {};
  const parts = [`name: '${escape(w.name)}'`];
  const tags = (w.tags ?? []).filter(Boolean);
  parts.push(`tags: [${tags.map((t) => `'${escape(t)}'`).join(', ')}]`);
  if (alias.moe && alias.moe !== w.name) parts.push(`moe: '${escape(alias.moe)}'`);
  if (alias.baike && alias.baike !== w.name) parts.push(`baike: '${escape(alias.baike)}'`);
  lines.push(`  { ${parts.join(', ')} },`);
}

lines.push('];');
lines.push('');
lines.push('/** 萌娘百科链接 */');
lines.push('export function moegirlUrl(item: AnimeItem): string {');
lines.push("  return `https://zh.moegirl.org.cn/${encodeURIComponent(item.moe ?? item.name)}`;");
lines.push('}');
lines.push('');
lines.push('/** 百度百科链接 */');
lines.push('export function baikeUrl(item: AnimeItem): string {');
lines.push("  return `https://baike.baidu.com/item/${encodeURIComponent(item.baike ?? item.name)}`;");
lines.push('}');
lines.push('');
lines.push('/** 所有标签（按常用度排序） */');
lines.push('export function animeTags(): string[] {');
lines.push('  const counter = new Map<string, number>();');
lines.push('  for (const item of animeList) {');
lines.push('    for (const tag of item.tags) counter.set(tag, (counter.get(tag) ?? 0) + 1);');
lines.push('  }');
lines.push('  const order = ' + JSON.stringify(TAG_ORDER) + ';');
lines.push('  return [...counter.keys()].sort((a, b) => {');
lines.push('    const ia = order.indexOf(a);');
lines.push('    const ib = order.indexOf(b);');
lines.push('    if (ia !== -1 || ib !== -1) {');
lines.push('      if (ia === -1) return 1;');
lines.push('      if (ib === -1) return -1;');
lines.push('      return ia - ib;');
lines.push('    }');
lines.push('    return counter.get(b) - counter.get(a);');
lines.push('  });');
lines.push('}');
lines.push('');

writeFileSync(OUT, lines.join('\n'), 'utf8');

const tagCount = new Map();
for (const w of works) for (const t of w.tags ?? []) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
console.log(`[anime] 已生成 ${OUT}`);
console.log(`[anime] 作品 ${works.length} 部，标签 ${tagCount.size} 种`);
console.log(
  '[anime] 标签分布：',
  [...tagCount.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}(${v})`).join(' '),
);
