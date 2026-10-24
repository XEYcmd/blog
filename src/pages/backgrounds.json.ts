import type { APIRoute } from 'astro';
import { backgrounds } from '../lib/data';

/** 当前扫描到的背景图清单（dev 模式可直接访问 /backgrounds.json 排查） */
export const GET: APIRoute = () => {
  return new Response(JSON.stringify(backgrounds), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};
