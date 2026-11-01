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
  {
    name: 'AeriFoxの小窝',
    url: 'https://symetro.net/',
    desc: '这是AeriFoxの小窝，仍在开发！',
  },
  {
    name: 'XXXUAN的小窝',
    url: 'https://xxxuan-nxd.github.io/',
    desc: 'XXXUAN的赛博小窝！',
  },
  {
    name: 'TwinConnectMonai',
    url: 'https://sbu.monai.ccwu.cc/',
    desc: '一个好用的国模逆向',
  },
];
