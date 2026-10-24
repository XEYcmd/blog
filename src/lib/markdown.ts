/**
 * 极简 Markdown → HTML 渲染器（够写博客用）
 * 支持：标题、段落、粗体/斜体/行内代码/链接/图片、有序/无序列表、引用、围栏代码块（带语言标签）、
 *      分割线、表格、GFM 自动换行。
 * 只输出受控 HTML：先整体转义，再按行重建标签，因此文章内容不会注入脚本。
 */

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** 标题锚点：中文保留，空格变 -，去掉标点 */
function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[!-/:-@[-`{-~]/g, '')
    .replace(/[\s·、，。：；！？（）「」『』【】《》“”‘’]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function inline(src: string): string {
  let s = esc(src);

  // 行内代码先占位，避免内部内容被继续解析
  const codes: string[] = [];
  s = s.replace(/`([^`\n]+)`/g, (_m, code: string) => {
    codes.push(`<code>${code}</code>`);
    return `\u0000C${codes.length - 1}\u0000`;
  });

  // 图片 ![alt](src "title")
  s = s.replace(/!\[([^\]]*)\]\((\S+?)(?:\s+&quot;([^&]*)&quot;)?\)/g, (_m, alt: string, src2: string, title?: string) => {
    const safe = /^(https?:\/\/|\/)/i.test(src2) ? src2 : '#';
    return `<img src="${safe}" alt="${alt}"${title ? ` title="${title}"` : ''} loading="lazy" decoding="async">`;
  });

  // 链接 [text](url)
  s = s.replace(/\[([^\]]+)\]\((\S+?)\)/g, (_m, label: string, href: string) => {
    const external = /^https?:\/\//i.test(href);
    const safe = /^(https?:\/\/|\/|#|mailto:)/i.test(href) ? href : '#';
    return `<a href="${safe}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
  });

  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  s = s.replace(/\u0000C(\d+)\u0000/g, (_m, i: string) => codes[Number(i)]);
  return s;
}

type Heading = { depth: number; text: string; slug: string };

export function renderMarkdown(source: string): { html: string; headings: Heading[] } {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const out: string[] = [];
  const headings: Heading[] = [];
  let i = 0;

  const isBlank = (l: string) => l.trim() === '';

  while (i < lines.length) {
    const line = lines[i];

    // 围栏代码块
    const fence = line.match(/^\s*```(\S*)\s*$/);
    if (fence) {
      const lang = fence[1] || '';
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // 跳过结束围栏
      const cls = lang ? ` class="language-${esc(lang)}"` : '';
      out.push(
        `<pre><div class="code-head"><span>${esc(lang || 'text')}</span></div><code${cls}>${esc(buf.join('\n'))}</code></pre>`,
      );
      continue;
    }

    // 分割线
    if (/^\s*(\*\s*){3,}$/.test(line) || /^\s*(-\s*){3,}$/.test(line) || /^\s*(_\s*){3,}$/.test(line)) {
      out.push('<hr>');
      i++;
      continue;
    }

    // ATX 标题
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const depth = h[1].length;
      const raw = h[2].replace(/\s+#+\s*$/, '').trim();
      const slug = slugify(raw) || `h-${headings.length}`;
      headings.push({ depth, text: raw, slug });
      if (depth === 1) {
        out.push(`<h1>${inline(raw)}</h1>`);
      } else {
        out.push(`<h${depth} id="${esc(slug)}">${inline(raw)}<a class="anchor" href="#${esc(slug)}" aria-hidden="true">#</a></h${depth}>`);
      }
      i++;
      continue;
    }

    // 引用块
    if (/^\s*>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      out.push(`<blockquote><p>${inline(buf.join(' '))}</p></blockquote>`);
      continue;
    }

    // 表格（第二行是 |---| 分隔）
    if (/\|/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1])) {
      const cells = (row: string) =>
        row
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((c) => c.trim());
      const head = cells(line);
      const align = cells(lines[i + 1]).map((c) => {
        if (/^:-+:$/.test(c)) return 'center';
        if (/^-+:$/.test(c)) return 'right';
        return '';
      });
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /\|/.test(lines[i]) && !isBlank(lines[i])) {
        rows.push(cells(lines[i]));
        i++;
      }
      const th = head.map((c, k) => `<th${align[k] ? ` style="text-align:${align[k]}"` : ''}>${inline(c)}</th>`).join('');
      const tb = rows
        .map(
          (r) =>
            `<tr>${r
              .map((c, k) => `<td${align[k] ? ` style="text-align:${align[k]}"` : ''}>${inline(c)}</td>`)
              .join('')}</tr>`,
        )
        .join('');
      out.push(`<div class="table-wrap"><table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>`);
      continue;
    }

    // 无序列表
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ''));
        i++;
      }
      out.push(`<ul>${items.map((it) => `<li>${inline(it)}</li>`).join('')}</ul>`);
      continue;
    }

    // 有序列表
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ''));
        i++;
      }
      out.push(`<ol>${items.map((it) => `<li>${inline(it)}</li>`).join('')}</ol>`);
      continue;
    }

    // 空行
    if (isBlank(line)) {
      i++;
      continue;
    }

    // 段落
    const buf: string[] = [];
    while (
      i < lines.length &&
      !isBlank(lines[i]) &&
      !/^\s*```/.test(lines[i]) &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i])
    ) {
      buf.push(lines[i].trim());
      i++;
    }
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }

  return { html: out.join('\n'), headings };
}

export { slugify };
