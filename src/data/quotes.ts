/**
 * 页脚随机名言。
 *
 * 每条包含：日文原句 / 中文翻译 / 英文翻译 / 角色 / 作品。
 * 想增删台词，直接改这个数组即可；页脚和刷新逻辑会自动读取。
 */
export type Quote = {
  id: string;
  /** 日文原句（中文站主展示文本） */
  ja: string;
  /** 中文翻译 */
  zh: string;
  /** 英文翻译（英文站主展示文本） */
  en: string;
  /** 角色名 */
  by: { zh: string; en: string };
  /** 作品名 */
  from: { zh: string; en: string };
};

export const quotes: Quote[] = [
  {
    id: 'lelouch',
    ja: '俺は世界を壊し、世界を創る。',
    zh: '我将会毁灭世界，并创造新的世界。',
    en: 'I will destroy the world and create it anew.',
    by: { zh: '鲁路修', en: 'Lelouch' },
    from: { zh: 'Code Geass 反叛的鲁路修', en: 'Code Geass: Lelouch of the Rebellion' },
  },
  {
    id: 'okabe',
    ja: 'すべては、シュタインズ・ゲートの選択だった。',
    zh: '这一切都是命运石之门的选择。',
    en: 'Everything was the choice of Steins;Gate.',
    by: { zh: '冈部伦太郎', en: 'Rintaro Okabe' },
    from: { zh: '命运石之门', en: 'Steins;Gate' },
  },
  {
    id: 'shinji',
    ja: '逃げちゃダメだ、逃げちゃダメだ、逃げちゃダメだ。',
    zh: '不能逃避，不能逃避，不能逃避。',
    en: "I mustn't run away. I mustn't run away. I mustn't run away.",
    by: { zh: '碇真嗣', en: 'Shinji Ikari' },
    from: { zh: '新世纪福音战士', en: 'Neon Genesis Evangelion' },
  },
  {
    id: 'rei',
    ja: '私が死んでも、代わりはいるもの。',
    zh: '即使我死了，也会有替代品。',
    en: 'Even if I die, someone will take my place.',
    by: { zh: '绫波丽', en: 'Rei Ayanami' },
    from: { zh: '新世纪福音战士', en: 'Neon Genesis Evangelion' },
  },
  {
    id: 'luffy',
    ja: '俺は海賊王になる男だ！',
    zh: '我是要成为海贼王的男人！',
    en: "I'm the man who will become the Pirate King!",
    by: { zh: '蒙奇·D·路飞', en: 'Monkey D. Luffy' },
    from: { zh: '海贼王', en: 'One Piece' },
  },
  {
    id: 'zoro',
    ja: '背中の傷は剣士の恥だ。',
    zh: '背上的伤，是剑士的耻辱。',
    en: "A wound on the back is a swordsman's shame.",
    by: { zh: '罗罗诺亚·索隆', en: 'Roronoa Zoro' },
    from: { zh: '海贼王', en: 'One Piece' },
  },
  {
    id: 'naruto',
    ja: '俺は絶対に火影になる！',
    zh: '我一定会成为火影！',
    en: "I'm definitely going to become Hokage!",
    by: { zh: '漩涡鸣人', en: 'Naruto Uzumaki' },
    from: { zh: '火影忍者', en: 'Naruto' },
  },
  {
    id: 'itachi',
    ja: '許せ、サスケ。これが最後だ。',
    zh: '原谅我，佐助。这是最后一次了。',
    en: 'Forgive me, Sasuke. This is the last time.',
    by: { zh: '宇智波鼬', en: 'Itachi Uchiha' },
    from: { zh: '火影忍者 疾风传', en: 'Naruto Shippuden' },
  },
  {
    id: 'aizen',
    ja: '憧れは、理解から最も遠い感情だ。',
    zh: '憧憬，是距离理解最遥远的感情。',
    en: 'Admiration is the emotion furthest from understanding.',
    by: { zh: '蓝染惣右介', en: 'Sosuke Aizen' },
    from: { zh: '死神', en: 'Bleach' },
  },
  {
    id: 'edward',
    ja: '何かを得るためには、同等の代価が必要だ。',
    zh: '想要得到什么，就必须付出同等的代价。',
    en: 'To obtain something, you must offer something of equal value.',
    by: { zh: '爱德华·艾尔利克', en: 'Edward Elric' },
    from: { zh: '钢之炼金术师 FA', en: 'Fullmetal Alchemist: Brotherhood' },
  },
  {
    id: 'gintoki',
    ja: '空気を読むな、空気を作れ。',
    zh: '不要读空气，去创造空气。',
    en: "Don't read the mood. Create it.",
    by: { zh: '坂田银时', en: 'Gintoki Sakata' },
    from: { zh: '银魂', en: 'Gintama' },
  },
  {
    id: 'eren',
    ja: '駆逐してやる…この世から…一匹残らず。',
    zh: '我要把它们驱逐出去……从这个世界上……一个不留。',
    en: "I'll wipe them out... every last one of them!",
    by: { zh: '艾伦·耶格尔', en: 'Eren Yeager' },
    from: { zh: '进击的巨人', en: 'Attack on Titan' },
  },
  {
    id: 'armin',
    ja: '何かを変えるためには、何かを捨てるしかない。',
    zh: '想要改变什么，就只能舍弃什么。',
    en: 'To change something, you have to throw something away.',
    by: { zh: '阿尔敏·阿诺德', en: 'Armin Arlert' },
    from: { zh: '进击的巨人', en: 'Attack on Titan' },
  },
  {
    id: 'levi',
    ja: '後悔しない選択をしろ。',
    zh: '做出不会让自己后悔的选择。',
    en: "Choose the path you won't regret.",
    by: { zh: '利威尔·阿克曼', en: 'Levi Ackerman' },
    from: { zh: '进击的巨人', en: 'Attack on Titan' },
  },
  {
    id: 'rengoku',
    ja: '心を燃やせ。',
    zh: '燃起心火。',
    en: 'Set your heart ablaze.',
    by: { zh: '炼狱杏寿郎', en: 'Kyojuro Rengoku' },
    from: { zh: '鬼灭之刃', en: 'Demon Slayer: Kimetsu no Yaiba' },
  },
  {
    id: 'gojo',
    ja: '大丈夫だ。俺は最強だから。',
    zh: '没关系，因为我是最强的。',
    en: "Don't worry. I'm the strongest.",
    by: { zh: '五条悟', en: 'Satoru Gojo' },
    from: { zh: '咒术回战', en: 'Jujutsu Kaisen' },
  },
  {
    id: 'anya',
    ja: 'アーニャ、わからない。',
    zh: '阿尼亚不明白。',
    en: "Anya doesn't understand.",
    by: { zh: '阿尼亚·福杰', en: 'Anya Forger' },
    from: { zh: '间谍过家家', en: 'Spy × Family' },
  },
  {
    id: 'frieren',
    ja: '人間のことを、もっと知りたかった。',
    zh: '我想更多地了解人类。',
    en: 'I wanted to know more about humans.',
    by: { zh: '芙莉莲', en: 'Frieren' },
    from: { zh: '葬送的芙莉莲', en: "Frieren: Beyond Journey's End" },
  },
  {
    id: 'ai',
    ja: '嘘はとびきりの愛なんだよ。',
    zh: '谎言，是最极致的爱。',
    en: 'Lies are the ultimate form of love.',
    by: { zh: '星野爱', en: 'Ai Hoshino' },
    from: { zh: '【我推的孩子】', en: 'Oshi no Ko' },
  },
  {
    id: 'kaguya',
    ja: 'お可愛いこと。',
    zh: '真可爱呢。',
    en: 'How cute.',
    by: { zh: '四宫辉夜', en: 'Kaguya Shinomiya' },
    from: { zh: '辉夜大小姐想让我告白', en: 'Kaguya-sama: Love Is War' },
  },
  {
    id: 'haruhi',
    ja: '宇宙人、未来人、異世界人、超能力者がいたら、私のところに来なさい！',
    zh: '如果有外星人、未来人、异世界人、超能力者，就来找我吧！',
    en: 'If there are aliens, time travelers, people from another world, or espers, come to me!',
    by: { zh: '凉宫春日', en: 'Haruhi Suzumiya' },
    from: { zh: '凉宫春日的忧郁', en: 'The Melancholy of Haruhi Suzumiya' },
  },
  {
    id: 'madoka',
    ja: 'こんなの絶対おかしいよ。',
    zh: '这绝对很奇怪啊。',
    en: 'This is absolutely wrong.',
    by: { zh: '鹿目圆', en: 'Madoka Kaname' },
    from: { zh: '魔法少女小圆', en: 'Puella Magi Madoka Magica' },
  },
  {
    id: 'shirou',
    ja: '正義の味方になりたい。',
    zh: '我想成为正义的伙伴。',
    en: 'I want to be a hero of justice.',
    by: { zh: '卫宫士郎', en: 'Shirou Emiya' },
    from: { zh: 'Fate/stay night', en: 'Fate/stay night' },
  },
  {
    id: 'ushio',
    ja: '泣ける場所は、トイレと、パパの胸の中だけだ。',
    zh: '能哭的地方，只有厕所和爸爸的怀里。',
    en: "There are only two places where you can cry: the toilet and Daddy's arms.",
    by: { zh: '冈崎汐', en: 'Ushio Okazaki' },
    from: { zh: 'CLANNAD ～AFTER STORY～', en: 'Clannad: After Story' },
  },
  {
    id: 'violet',
    ja: '愛してるの意味が、知りたいんです。',
    zh: '我想知道，“爱”是什么意思。',
    en: 'I want to know what "I love you" means.',
    by: { zh: '薇尔莉特·伊芙加登', en: 'Violet Evergarden' },
    from: { zh: '紫罗兰永恒花园', en: 'Violet Evergarden' },
  },
  {
    id: 'rem',
    ja: 'スバル君のことが好きです。',
    zh: '我喜欢昴君。',
    en: 'I love you, Subaru.',
    by: { zh: '蕾姆', en: 'Rem' },
    from: { zh: 'Re:从零开始的异世界生活', en: 'Re:Zero - Starting Life in Another World' },
  },
  {
    id: 'saitama',
    ja: '俺は趣味でヒーローをやってる。',
    zh: '我当英雄，只是兴趣。',
    en: "I'm a hero for fun.",
    by: { zh: '埼玉', en: 'Saitama' },
    from: { zh: '一拳超人', en: 'One Punch Man' },
  },
  {
    id: 'jotaro',
    ja: 'やれやれだぜ。',
    zh: '真是够了。',
    en: 'Good grief.',
    by: { zh: '空条承太郎', en: 'Jotaro Kujo' },
    from: { zh: 'JOJO的奇妙冒险 星尘斗士', en: "JoJo's Bizarre Adventure: Stardust Crusaders" },
  },
  {
    id: 'chitanda',
    ja: '私、気になります！',
    zh: '我很好奇！',
    en: "I'm curious!",
    by: { zh: '千反田爱瑠', en: 'Eru Chitanda' },
    from: { zh: '冰菓', en: 'Hyouka' },
  },
  {
    id: 'lucy',
    ja: '月に行きたい。',
    zh: '我想去月球。',
    en: 'I want to go to the moon.',
    by: { zh: '露西', en: 'Lucy' },
    from: { zh: '赛博朋克：边缘行者', en: 'Cyberpunk: Edgerunners' },
  },
];
