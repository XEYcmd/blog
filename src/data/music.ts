/**
 * 音乐播放器配置。
 *
 * 把音频文件放进 public/music/，然后在下面列表里加一条即可。
 * 支持 mp3 / ogg / m4a / wav 等浏览器能播放的格式。
 *
 * 示例：
 *   { title: '曲名', artist: '歌手', src: '/music/xxx.mp3' }
 *
 * 说明：src 会自动带上部署基路径，写 '/music/xxx.mp3' 即可。
 * 列表为空时，播放器按钮不显示。
 */
export type Track = {
  title: string;
  artist?: string;
  /** 站内路径（/music/xxx.mp3）或完整外链（https://...） */
  src: string;
  /** 封面图（可选），同样支持站内路径或外链 */
  cover?: string;
};

export const tracks: Track[] = [
  // 在这里加歌，例如：
  // { title: '示例曲目', artist: '示例歌手', src: '/music/demo.mp3' },
];

/** 播放器默认音量（0–1） */
export const DEFAULT_VOLUME = 0.7;

/** 是否记忆上次播放的曲目与进度 */
export const REMEMBER_STATE = true;
