// 应用用户提供的 27 条百度百科精确链接 + 按百度百科改番名
// 用法：node scripts/apply-fixes27.mjs
//
// 在 apply-baike.mjs 之后运行：
//   1. 保留已有的 baikePath（172 条）
//   2. 用 FIXES 覆盖那 27 条的链接
//   3. 按 RENAMES 把番名改成百度百科官方名
import { readFileSync, writeFileSync } from 'node:fs';

const OUT = 'src/data/anime.ts';

/** 27 条的原始顺序（与之前列出的 1-27 对应） */
const ORDER = [
  '不知不觉间被邻家的天使大人养成了废柴',
  '初恋时间。',
  '单间，光照尚好，附带天使',
  '古见同学有交流障碍',
  '和班上最讨厌的女生结婚了',
  '和山田谈场lv.999的恋爱',
  '即使是变态你也喜欢吗',
  '就算是哥哥，只要有爱就没问题了吧',
  '哭泣少女乐队',
  '乱马1/2',
  '死神少女与黑女仆',
  '谭雅战记',
  '我的脑内恋爱选项',
  '我的女友和青梅竹马的惨烈修罗场',
  '我家女仆有点烦',
  '我理想的异世界生活',
  '我想要吃掉你的胰脏',
  '喜欢本大爷的居然只有你一个',
  '喜欢的人忘记带眼镜了',
  '夏日口袋漫画',
  '想结束这场我爱你游戏',
  '英雄王，为了穷尽武道转生',
  '鹰峰同学请穿上衣服',
  '与成为异世界美少女的大叔一起',
  '玉子的爱情故事',
  '中二病也要谈恋爱 Take on me',
  'SSSS.GRIDMAN 电光超人古立特',
];

/** 修正后的路径；null = 保持原样 */
const FIXES = {
  1: '/item/%E5%85%B3%E4%BA%8E%E6%88%91%E5%9C%A8%E6%97%A0%E6%84%8F%E9%97%B4%E8%A2%AB%E9%9A%94%E5%A3%81%E7%9A%84%E5%A4%A9%E4%BD%BF%E5%8F%98%E6%88%90%E5%BA%9F%E6%9F%B4%E8%BF%99%E4%BB%B6%E4%BA%8B/59807929',
  2: null,
  3: '/item/%E5%8D%95%E4%BA%BA%E6%88%BF%EF%BC%8C%E6%97%A5%E7%85%A7%E4%B8%80%E8%88%AC%EF%BC%8C%E9%99%84%E5%A4%A9%E4%BD%BF%E3%80%82/68108413',
  4: '/item/%E5%8F%A4%E8%A7%81%E5%90%8C%E5%AD%A6%E6%9C%89%E4%BA%A4%E6%B5%81%E9%9A%9C%E7%A2%8D%E7%97%87%E3%80%82/56967748',
  5: '/item/%E6%88%91%E5%92%8C%E7%8F%AD%E4%B8%8A%E6%9C%80%E8%AE%A8%E5%8E%8C%E7%9A%84%E5%A5%B3%E7%94%9F%E7%BB%93%E5%A9%9A%E4%BA%86%E3%80%82/64582629',
  6: '/item/%E5%92%8C%E5%B1%B1%E7%94%B0%E8%B0%88%E5%9C%BALv999%E7%9A%84%E6%81%8B%E7%88%B1/62817504',
  7: '/item/%E5%8F%AA%E8%A6%81%E9%95%BF%E5%BE%97%E5%8F%AF%E7%88%B1%EF%BC%8C%E5%8D%B3%E4%BD%BF%E6%98%AF%E5%8F%98%E6%80%81%E4%BD%A0%E4%B9%9F%E5%96%9C%E6%AC%A2%E5%90%97%EF%BC%9F/23298331',
  8: '/item/%E5%B0%B1%E7%AE%97%E6%98%AF%E5%93%A5%E5%93%A5%EF%BC%8C%E6%9C%89%E7%88%B1%E5%B0%B1%E6%B2%A1%E9%97%AE%E9%A2%98%E4%BA%86%EF%BC%8C%E5%AF%B9%E5%90%A7/4747730',
  9: '/item/BanG%20Dream!/19819147',
  10: '/item/%E4%B9%B1%E9%A9%AC1%2F2/6769125',
  11: '/item/%E6%AD%BB%E7%A5%9E%E5%B0%91%E7%88%B7%E4%B8%8E%E9%BB%91%E5%A5%B3%E4%BB%86/22595731',
  12: '/item/%E5%B9%BC%E5%A5%B3%E6%88%98%E8%AE%B0/16341770',
  13: '/item/%E6%88%91%E7%9A%84%E8%84%91%E5%86%85%E6%81%8B%E7%A2%8D%E9%80%89%E9%A1%B9/6852708',
  14: '/item/%E6%88%91%E5%A5%B3%E5%8F%8B%E4%B8%8E%E9%9D%92%E6%A2%85%E7%AB%B9%E9%A9%AC%E7%9A%84%E6%83%A8%E7%83%88%E4%BF%AE%E7%BD%97%E5%9C%BA/8389935',
  15: '/item/%E6%88%91%E5%AE%B6%E7%9A%84%E5%A5%B3%E4%BB%86%E6%9C%89%E5%A4%9F%E7%83%A6%EF%BC%81/22595731',
  16: null,
  17: '/item/%E6%88%91%E6%83%B3%E5%90%83%E6%8E%89%E4%BD%A0%E7%9A%84%E8%83%B0%E8%84%8F/22068674',
  18: '/item/%E5%96%9C%E6%AC%A2%E6%9C%AC%E5%A4%A7%E7%88%B7%E7%9A%84%E7%AB%9F%E7%84%B6%E5%B0%B1%E4%BD%A0%E4%B8%80%E4%B8%AA%EF%BC%9F/22590833',
  19: '/item/%E6%88%91%E5%96%9C%E6%AC%A2%E7%9A%84%E5%A5%B3%E5%AD%A9%E5%BF%98%E8%AE%B0%E6%88%B4%E7%9C%BC%E9%95%9C/62570381',
  20: '/item/Summer%20Pockets/59732229',
  21: '/item/%E6%83%B3%E8%AE%A9%E2%80%9C%E6%88%91%E7%88%B1%E4%BD%A0%E2%80%9D%E6%B8%B8%E6%88%8F%E5%BF%AB%E7%82%B9%E7%BB%93%E6%9D%9F/63042424',
  22: '/item/%E8%8B%B1%E9%9B%84%E7%8E%8B%EF%BC%8C%E4%B8%BA%E4%BA%86%E7%A9%B7%E5%B0%BD%E6%AD%A6%E9%81%93%E8%80%8C%E8%BD%AC%E7%94%9F%20%EF%BD%9E%E7%84%B6%E5%90%8E%EF%BC%8C%E6%88%90%E4%B8%BA%E4%B8%96%E7%95%8C%E6%9C%80%E5%BC%BA%E7%9A%84%E8%A7%81%E4%B9%A0%E9%AA%91%E5%A3%AB%E2%99%80%EF%BD%9E/62479909',
  23: '/item/%E6%8B%9C%E6%89%98%E8%AF%B7%E7%A9%BF%E4%B8%8A%EF%BC%8C%E9%B9%B0%E5%B3%B0%E5%90%8C%E5%AD%A6/64743335',
  24: '/item/%E4%B8%8E%E5%8F%98%E6%88%90%E4%BA%86%E5%BC%82%E4%B8%96%E7%95%8C%E7%BE%8E%E5%B0%91%E5%A5%B3%E7%9A%84%E5%A4%A7%E5%8F%94%E4%B8%80%E8%B5%B7%E5%86%92%E9%99%A9/57018081',
  25: '/item/%E7%8E%89%E5%AD%90%E7%88%B1%E6%83%85%E6%95%85%E4%BA%8B/12707997',
  26: '/item/%E4%B8%AD%E4%BA%8C%E7%97%85%E4%B9%9F%E8%A6%81%E8%B0%88%E6%81%8B%E7%88%B1%EF%BC%81%20-Take%20On%20Me-/20810379',
  27: '/item/SSSS.%E5%8F%A4%E7%AB%8B%E7%89%B9/22909951',
};

/** 按百度百科官方名改名 */
const RENAMES = {
  '哭泣少女乐队': 'BanG Dream!',
  '死神少女与黑女仆': '死神少爷与黑女仆',
  '谭雅战记': '幼女战记',
  '我的脑内恋爱选项': '我的脑内恋碍选项',
  '我的女友和青梅竹马的惨烈修罗场': '我女友与青梅竹马的惨烈修罗场',
  '我家女仆有点烦': '我家的女仆有够烦！',
  '我想要吃掉你的胰脏': '我想吃掉你的胰脏',
  '喜欢本大爷的居然只有你一个': '喜欢本大爷的竟然就你一个？',
  '喜欢的人忘记带眼镜了': '我喜欢的女孩忘记戴眼镜',
  '夏日口袋漫画': 'Summer Pockets',
  '想结束这场我爱你游戏': '想让“我爱你”游戏快点结束',
  '英雄王，为了穷尽武道转生': '英雄王，为了穷尽武道而转生 ～然后，成为世界最强的见习骑士♀～',
  '鹰峰同学请穿上衣服': '拜托请穿上，鹰峰同学',
  '与成为异世界美少女的大叔一起': '与变成了异世界美少女的大叔一起冒险',
  '玉子的爱情故事': '玉子爱情故事',
  '中二病也要谈恋爱 Take on me': '中二病也要谈恋爱！ -Take On Me-',
  'SSSS.GRIDMAN 电光超人古立特': 'SSSS.古立特',
  '即使是变态你也喜欢吗': '只要长得可爱，即使是变态你也喜欢吗？',
  '不知不觉间被邻家的天使大人养成了废柴': '关于我在无意间被隔壁的天使变成废柴这件事',
  '单间，光照尚好，附带天使': '单人房，日照一般，附天使。',
  '古见同学有交流障碍': '古见同学有交流障碍症。',
  '和班上最讨厌的女生结婚了': '我和班上最讨厌的女生结婚了。',
  '和山田谈场lv.999的恋爱': '和山田谈场Lv999的恋爱',
  '就算是哥哥，只要有爱就没问题了吧': '就算是哥哥，有爱就没问题了，对吧',
};

/* ---------------- 逐行解析，保留已有 baikePath ---------------- */
const src = readFileSync(OUT, 'utf8');
const lines = src.split(/\r?\n/);

const ITEM_LINE = /^\s*\{ name: '((?:[^'\\]|\\.)*)'(.*)$/;
const PATH_IN_LINE = /baikePath: '((?:[^'\\]|\\.)*)'/;
const TAGS_IN_LINE = /tags: \[([^\]]*)\]/;

const items = [];
for (const line of lines) {
  const m = line.match(ITEM_LINE);
  if (!m) continue;
  const name = m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  const tagsMatch = line.match(TAGS_IN_LINE);
  const pathMatch = line.match(PATH_IN_LINE);
  items.push({
    name,
    tags: tagsMatch ? tagsMatch[1] : '',
    baikePath: pathMatch ? pathMatch[1] : null,
  });
}

const before = items.filter((i) => i.baikePath).length;
console.log(`读入 ${items.length} 条，已有精确链接 ${before} 条`);

const fixByName = new Map();
ORDER.forEach((origName, i) => {
  const path = FIXES[i + 1];
  if (path) fixByName.set(origName, path);
});

let overridden = 0;
let renamed = 0;

const out = [];
out.push('/**');
out.push(' * 番剧推荐数据（自动生成，请勿手改）');
out.push(' *');
out.push(' * 生成流程：scripts/build-anime.mjs → apply-baike.mjs → apply-fixes27.mjs');
out.push(' * baikePath 指向百度百科的动画词条（含数字 ID，避免落到消歧义页）。');
out.push(' */');
out.push('');
out.push('export type AnimeItem = {');
out.push('  name: string;');
out.push('  tags: string[];');
out.push('  /** 百度百科词条路径，如 /item/冰菓/5650507 */');
out.push('  baikePath?: string;');
out.push('};');
out.push('');
out.push(`/** 共 ${items.length} 部 */`);
out.push('export const animeList: AnimeItem[] = [');

for (const item of items) {
  const newName = RENAMES[item.name] ?? item.name;
  if (newName !== item.name) renamed++;

  const fixPath = fixByName.get(item.name);
  let path = item.baikePath;
  if (fixPath) {
    path = fixPath;
    overridden++;
  }

  const safeName = newName.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const parts = [`name: '${safeName}'`, `tags: [${item.tags}]`];
  if (path) parts.push(`baikePath: '${path.replace(/'/g, "\\'")}'`);
  out.push(`  { ${parts.join(', ')} },`);
}

out.push('];');
out.push('');
out.push('/** 百度百科链接：优先用精确路径，没有则退回按名字搜索 */');
out.push('export function baikeUrl(item: AnimeItem): string {');
out.push('  if (item.baikePath) return `https://baike.baidu.com${item.baikePath}`;');
out.push("  return `https://baike.baidu.com/search/word?word=${encodeURIComponent(item.name)}`;");
out.push('}');
out.push('');

const tagsStart = src.indexOf('/** 所有标签（按常用度排序） */');
if (tagsStart !== -1) {
  out.push(src.slice(tagsStart).trim());
  out.push('');
}

writeFileSync(OUT, out.join('\n'), 'utf8');

const finalWithPath = items.filter((i) => i.baikePath || fixByName.has(i.name)).length;
console.log(`\n已写入 ${OUT}`);
console.log(`覆盖链接 ${overridden} 条，改名 ${renamed} 条`);
console.log(`最终精确链接 ${finalWithPath} / ${items.length}，回退 ${items.length - finalWithPath}`);
