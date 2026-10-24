// 本地子路径预览：把 dist 挂到 /xeycmd-blog-dsh/ 下，模拟 GitHub Pages 项目页
// 用法：node scripts/preview-subpath.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const PORT = Number(process.argv[2] || 4322);
const BASE = '/xeycmd-blog-dsh';
const ROOT = join(process.cwd(), 'dist');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolveFile(pathname) {
  let p = decodeURIComponent(pathname);
  if (!p.startsWith(BASE)) return null;
  p = p.slice(BASE.length) || '/';
  const full = join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ''));
  try {
    const s = await stat(full);
    if (s.isDirectory()) {
      const idx = join(full, 'index.html');
      await stat(idx);
      return idx;
    }
    return full;
  } catch {
    try {
      const html = `${full}.html`;
      await stat(html);
      return html;
    } catch {
      return null;
    }
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  if (url.pathname === '/') {
    res.writeHead(302, { Location: `${BASE}/` });
    res.end();
    return;
  }
  const file = await resolveFile(url.pathname);
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404</h1><p>Not found in dist/</p>');
    return;
  }
  const body = await readFile(file);
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(body);
}).listen(PORT, () => {
  console.log(`preview: http://localhost:${PORT}${BASE}/`);
});
