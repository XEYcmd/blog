/**
 * 友情链接。
 *
 * 每项：{ name: 站点名, url: 地址, desc: 一句话描述（可选） }
 * 加友链直接往数组里加一条即可。
 */
export type Friend = {
  name: string;
  url: string;
  desc?: string;
};

export const friends: Friend[] = [
  // 示例：
  // { name: '某人的博客', url: 'https://example.com', desc: '写代码和生活的记录' },
];
