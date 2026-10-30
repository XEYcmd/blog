import { esc } from './esc';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { scanBackgrounds } from './backgrounds-scan';
import { SITE_URL } from './base';

export type Lang = 'zh' | 'en';

export const LANGS: Lang[] = ['zh', 'en'];

export const htmlLang = (lang: Lang) => (lang === 'zh' ? 'zh-CN' : 'en');

/** 站点信息：url 跟随实际部署域名（自定义域 / github.io）自动变化 */
export const site = {
  url: SITE_URL,
  name: 'XEYcmd',
  github: 'https://github.com/XEYcmd',
  repo: 'https://github.com/XEYcmd/xeycmd-blog-dsh',
  /** OG 分享图（相对站内路径） */
  ogImage: '/og.png',
};

export const text = {
  zh: {
    title: 'XEYcmd的个人主页',
    siteTitle: 'XEYcmd 的个人主页',
    desc: 'XEYcmd 的个人网站：代码、终端与二次元的记录。',
    nav: { home: '首页', posts: '文章', about: '关于' },
    langLabel: 'Switch to English',
    langShort: 'EN',
    skip: '跳到主要内容',
    navAria: '主导航',
    footer: '用 Astro 构建，托管于 GitHub Pages',
    footerName: 'XEYcmd',
    viewAllPosts: '查看全部文章',
    paginationLabel: '分页导航',
    animeTitle: '我推荐的番剧',
    animeSubtitle: '这些年看过、也愿意推荐给别人的作品。点右侧「百科」去百度百科看详情。',
    animeCount: (n: number) => `共 ${n} 部`,
    animeSearchLabel: '搜索番剧',
    animeSearchPlaceholder: '搜索番剧名…（按 / 快速定位）',
    animeHint: '',
    animeFilterLabel: '按标签筛选',
    animeAll: '全部',
    animeEmpty: '没有符合条件的番剧。',
    animeNote: '百科链接：',
    playerTitle: '音乐',
    playerEmpty: '还没有添加歌曲。把音频放进 public/music/，再到 src/data/music.ts 里登记。',
    playerOpen: '打开播放器',
    playerClose: '关闭播放器',
    playerNoTrack: '未选择曲目',
    playerPlay: '播放',
    playerPause: '暂停',
    playerPrev: '上一首',
    playerNext: '下一首',
    playerSeek: '播放进度',
    playerVolume: '音量',
    playerMute: '静音',
    playerMode: '播放模式',
    navAnime: '番剧',
    pageLabel: (n: number) => `第 ${n} 页`,
    pageOf: (n: number, total: number) => `第 ${n} / ${total} 页`,
    subtitle: '代码 · 终端 · 二次元',
    quickNav: '入口',
    scroll: '向下滚动',
    viewPosts: '浏览文章',
    viewAbout: '关于我',
    postsTitle: '文章',
    postsSubtitle: '把思考、折腾与记录留在这里。',
    postsEmpty: '还没有文章，第一篇正在路上。',
    postCount: (n: number) => `共 ${n} 篇`,
    postLangTag: { zh: '中文', en: 'English' },
    readMore: '阅读全文',
    backToList: '← 返回文章列表',
    backHome: '← 返回首页',
    toc: '本页目录',
    minutes: (n: number) => `约 ${n} 分钟`,
    newer: '更新一篇',
    older: '更早一篇',
    prevNext: '上一篇 / 下一篇',
    aboutTitle: '个人简介',
    aboutTagline: '写代码，也写生活。',
    aboutBio: [
      '你好，我是 XEYcmd。一个喜欢在终端里敲命令、也喜欢二次元的家伙。',
      '这里是我的小站：记录折腾过的项目、踩过的坑，以及一些随手写下的东西。',
      '如果你也对代码与 ACG 感兴趣，欢迎通过下面的方式找我聊聊。',
    ],
    skillsTitle: '在做的事',
    skills: [
      { label: 'Full-stack Web', level: 85 },
      { label: 'TypeScript / Node.js', level: 80 },
      { label: 'Linux / 终端', level: 75 },
      { label: 'UI 与动效', level: 65 },
    ],
    linksTitle: '找到我',
    nowTitle: '最近',
    nowItems: ['在写这个网站', '在补 Astro 的笔记', '在追新番'],
    notFoundTitle: '页面走丢了',
    notFoundText: '这条小路似乎不通向任何地方。',
    home: '首页',
  },
  en: {
    title: "XEYcmd's Homepage",
    siteTitle: "XEYcmd's Homepage",
    desc: "XEYcmd's personal site: code, terminal and a bit of ACG.",
    nav: { home: 'Home', posts: 'Posts', about: 'About' },
    langLabel: '切换到中文',
    langShort: '中',
    skip: 'Skip to main content',
    navAria: 'Main navigation',
    footer: 'Built with Astro, hosted on GitHub Pages',
    footerName: 'XEYcmd',
    viewAllPosts: 'All posts',
    paginationLabel: 'Pagination',
    animeTitle: 'Anime I Recommend',
    animeSubtitle: 'Shows I have watched and would recommend. Tap the badge to open its Baidu Baike page.',
    animeCount: (n: number) => `${n} titles`,
    animeSearchLabel: 'Search anime',
    animeSearchPlaceholder: 'Search a title… (press / to focus)',
    animeHint: '',
    animeFilterLabel: 'Filter by tag',
    animeAll: 'All',
    animeEmpty: 'No matching titles.',
    animeNote: 'Wiki links: ',
    playerTitle: 'Music',
    playerEmpty: 'No tracks yet. Drop audio into public/music/ and register it in src/data/music.ts.',
    playerOpen: 'Open player',
    playerClose: 'Close player',
    playerNoTrack: 'No track selected',
    playerPlay: 'Play',
    playerPause: 'Pause',
    playerPrev: 'Previous',
    playerNext: 'Next',
    playerSeek: 'Seek',
    playerVolume: 'Volume',
    playerMute: 'Mute',
    playerMode: 'Playback mode',
    navAnime: 'Anime',
    pageLabel: (n: number) => `Page ${n}`,
    pageOf: (n: number, total: number) => `Page ${n} of ${total}`,
    subtitle: 'code · terminal · acg',
    quickNav: 'Quick links',
    scroll: 'Scroll down',
    viewPosts: 'Read posts',
    viewAbout: 'About me',
    postsTitle: 'Posts',
    postsSubtitle: 'Thoughts, tinkering and notes live here.',
    postsEmpty: 'No posts yet — the first one is on its way.',
    postCount: (n: number) => `${n} post${n === 1 ? '' : 's'}`,
    postLangTag: { zh: '中文', en: 'English' },
    readMore: 'Read more',
    backToList: '← Back to posts',
    backHome: '← Back home',
    toc: 'On this page',
    minutes: (n: number) => `${n} min read`,
    newer: 'Newer',
    older: 'Older',
    prevNext: 'Previous / next post',
    aboutTitle: 'About',
    aboutTagline: 'Code, and life beyond it.',
    aboutBio: [
      "Hi, I'm XEYcmd — someone who lives in the terminal and also in ACG.",
      'This is my little corner: projects I tinkered with, bugs I stepped on, and random notes.',
      'If you share the same interests, feel free to reach out below.',
    ],
    skillsTitle: 'What I do',
    skills: [
      { label: 'Full-stack Web', level: 85 },
      { label: 'TypeScript / Node.js', level: 80 },
      { label: 'Linux / terminal', level: 75 },
      { label: 'UI & motion', level: 65 },
    ],
    linksTitle: 'Find me',
    nowTitle: 'Now',
    nowItems: ['building this site', 'taking Astro notes', 'catching up on anime'],
    notFoundTitle: 'Page not found',
    notFoundText: 'This path does not seem to lead anywhere.',
    home: 'Home',
  },
};

/** 逻辑路径 → 语言路径；中文是默认语言，不带前缀 */
export function localize(path: string, lang: Lang): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'zh') return p;
  return p === '/' ? '/en/' : `/en${p}`;
}

/** 去掉 /en 前缀，得到语言无关的逻辑路径 */
export function stripLang(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (p === '/en' || p === '/en/') return '/';
  if (p.startsWith('/en/')) return p.slice(3);
  return p;
}

/** 当前路径 → 另一种语言的对应路径（语言切换用） */
export function switchLangPath(path: string, target: Lang): string {
  return localize(stripLang(path), target);
}

export type Button = {
  key: string;
  href: string;
  external?: boolean;
  kana: string;
  label: { zh: string; en: string };
  icon: 'github' | 'pen' | 'spark';
};

/** 首页三枚按钮 */
export const buttons: Button[] = [
  {
    key: 'github',
    href: 'https://github.com/XEYcmd',
    external: true,
    kana: 'ギットハブ',
    label: { zh: '我的 Github', en: 'GitHub' },
    icon: 'github',
  },
  {
    key: 'posts',
    href: '/posts/',
    kana: 'ブログ',
    label: { zh: '文章', en: 'Posts' },
    icon: 'pen',
  },
  {
    key: 'about',
    href: '/about/',
    kana: 'じこしょうかい',
    label: { zh: '个人简介', en: 'About' },
    icon: 'spark',
  },
];

/** 首页背景图（public/backgrounds 自动扫描） */
export const backgrounds = scanBackgrounds();

/** 首页循环打字的句子 */
export const typingLines: Record<Lang, string[]> = {
  zh: ['XEYcmd的个人主页', '写代码，也写生活。', '在终端与二次元之间游走。', '欢迎来到我的小站。'],
  en: [
    "XEYcmd's Homepage",
    'Code, and life beyond it.',
    'Wandering between terminal & ACG.',
    'Welcome to my little corner.',
  ],
};

/* ------------------------------------------------------------------ */
/* 文章：直接读 content/posts/*.md（不依赖 astro:content，保证稳定）   */
/* ------------------------------------------------------------------ */

export type Post = {
  id: string;
  title: string;
  date: Date;
  lang: Lang;
  summary: string;
  tags: string[];
  draft: boolean;
  body: string;
  file: string;
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function parseScalar(raw: string): unknown {
  const v = raw.trim();
  if (!v) return '';
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1).replace(/\\"/g, '"');
  }
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v.startsWith('[') && v.endsWith(']')) {
    return v
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.replace(/^['"]|['"]$/g, ''));
  }
  return v;
}

/** 极简 YAML frontmatter 解析：支持标量、数组、竖线多行文本，足够写博客用 */
export function parseFrontmatter(source: string): { data: Record<string, unknown>; body: string } {
  const match = source.match(FRONTMATTER);
  if (!match) return { data: {}, body: source };

  const data: Record<string, unknown> = {};
  const lines = match[1].split(/\r?\n/);
  let key = '';
  let block: string[] | null = null;

  const flush = () => {
    if (key && block) data[key] = block.join('\n').trim();
    block = null;
  };

  for (const line of lines) {
    if (block) {
      if (/^\s{2,}/.test(line) || line.trim() === '') {
        block.push(line.replace(/^\s{2}/, ''));
        continue;
      }
      flush();
    }
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    key = m[1];
    const value = m[2];
    if (/^[|>][-+]?$/.test(value.trim())) {
      block = [];
      continue;
    }
    data[key] = parseScalar(value);
  }
  flush();

  return { data, body: source.slice(match[0].length) };
}

export function loadPosts(dir = 'content/posts'): Post[] {
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter((f) => f.endsWith('.md') && statSync(join(dir, f)).isFile());
  const posts: Post[] = files.map((file) => {
    const id = file.replace(/\.md$/, '');
    const { data, body } = parseFrontmatter(readFileSync(join(dir, file), 'utf8'));
    const dateValue = data.date;
    const date = dateValue instanceof Date ? dateValue : new Date(String(dateValue ?? ''));
    return {
      id,
      title: String(data.title ?? id),
      date: Number.isNaN(date.getTime()) ? new Date(0) : date,
      lang: data.lang === 'en' ? 'en' : 'zh',
      summary: String(data.summary ?? ''),
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      draft: data.draft === true,
      body,
      file: join(dir, file),
    };
  });

  return posts.filter((p) => !p.draft).sort((a, b) => b.date.getTime() - a.date.getTime());
}
