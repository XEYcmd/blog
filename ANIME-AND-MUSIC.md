# 番剧推荐 & 音乐播放器

## 番剧推荐页

地址：`/anime/`（英文 `/en/anime/`），导航栏「番剧」进入。

### 数据来源

199 部作品来自作品库 JSON，由脚本生成到 `src/data/anime.ts`：

```bash
node scripts/build-anime.mjs
```

**不要直接改 `src/data/anime.ts`**，它会被重新生成覆盖。要改某个条目的百科链接，
改 `scripts/build-anime.mjs` 里的 `ALIAS` 对象，然后重新生成。

### 修改作品列表

直接改作品库 JSON 后重新运行生成脚本。如果想在博客里单独调整，可以改
`scripts/build-anime.mjs` 顶部的 `SRC` 路径指向新文件。

### 百科链接

每部作品有两个链接：

- **萌** → 萌娘百科 `https://zh.moegirl.org.cn/<条目名>`
- **百** → 百度百科 `https://baike.baidu.com/item/<条目名>`

默认用作品名当条目名。名字对不上的（如 `love live` → `LoveLive!`），在
`build-anime.mjs` 的 `ALIAS` 里加一条：

```js
'love live': { moe: 'LoveLive!', baike: 'LoveLive!' },
```

### 页面功能

- 搜索框（输入即时过滤，按 `/` 快速聚焦）
- 标签筛选（34 种标签，点选切换）
- 搜索 + 标签可组合
- 无结果时显示提示
- 手机版：标签横向滚动、条目单列

---

## 音乐播放器

全局悬浮按钮，右下角，所有页面都有。

### 加歌

1. 把音频文件放进 `public/music/`
2. 编辑 `src/data/music.ts`：

```ts
export const tracks: Track[] = [
  { title: '曲名', artist: '歌手', src: '/music/xxx.mp3' },
  { title: '另一首', artist: '歌手', src: '/music/yyy.mp3', cover: '/music/cover.jpg' },
];
```

3. `npm run build`

**歌单为空时播放器完全不渲染**（按钮都不会出现），所以没放歌之前不用担心。

### 支持的字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | ✅ | 曲名 |
| `src` | ✅ | 站内路径 `/music/x.mp3` 或完整外链 |
| `artist` | ❌ | 歌手 |
| `cover` | ❌ | 封面图，站内路径或外链 |

格式：mp3 / ogg / m4a / wav 等浏览器能播的都行。

### 功能

- 播放 / 暂停 / 上一首 / 下一首
- 拖动进度条
- 音量调节 + 静音
- 三种播放模式：列表循环 → 单曲循环 → 随机
- 媒体键支持（耳机线控、键盘媒体键）
- 记住上次的曲目、进度、音量和模式（localStorage）
- 面板打开时按空格可播放/暂停

### 配置项

`src/data/music.ts` 里还有两个开关：

```ts
export const DEFAULT_VOLUME = 0.7;   // 默认音量
export const REMEMBER_STATE = true;  // 是否记忆播放状态
```

### 关于版权

播放器本身不提供任何音频，只播放你放进 `public/music/` 的文件。
请确保你有权分享这些音频——公开站点上传播受版权保护的音乐有法律风险。
