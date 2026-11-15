import { esc } from './esc';
import { quotes } from '../data/quotes';
import type { Lang } from './data';

type Payload = {
  main: string;
  sub: string;
  by: string;
};

/**
 * 页脚名言卡片。
 *
 * 服务端先渲染第一条作为无 JS 兜底，同时把当前语言的台词清单塞进
 * JSON script；客户端脚本会随机换一条并做打字机效果。
 */
export function footerQuote(lang: Lang): string {
  const q = quotes[0];
  const isZh = lang === 'zh';

  const main = isZh ? q.ja : q.en;
  const sub = isZh ? q.zh : '';
  const by = isZh ? `${q.by.zh} · 《${q.from.zh}》` : `${q.by.en} · ${q.from.en}`;

  const payload: Payload[] = quotes.map((item) =>
    isZh
      ? {
          main: item.ja,
          sub: item.zh,
          by: `${item.by.zh} · 《${item.from.zh}》`,
        }
      : {
          main: item.en,
          sub: '',
          by: `${item.by.en} · ${item.from.en}`,
        },
  );

  // 放进 <script> 的 JSON 不能出现裸的 </script>
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');

  return `<figure class="footer-quote" data-footer-quote>
  <blockquote>
    <p class="footer-quote__main" lang="${isZh ? 'ja' : 'en'}" data-quote-main>${esc(main)}</p>
    ${sub ? `<p class="footer-quote__sub" lang="zh-CN" data-quote-sub>${esc(sub)}</p>` : ''}
  </blockquote>
  <figcaption class="footer-quote__by" data-quote-by>—— ${esc(by)}</figcaption>
</figure>
<script type="application/json" data-footer-quotes>${json}</script>`;
}
