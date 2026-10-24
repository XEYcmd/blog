"""生成 OG 分享图（1200x630）：深紫渐变 + 光晕 + 站点名。

用法：python scripts/make-og.py
输出：public/og.png
"""
from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
OUT = Path("public/og.png")

BG_TOP = (18, 14, 36)
BG_BOTTOM = (9, 7, 20)
ACCENT_A = (185, 164, 255)   # 紫
ACCENT_B = (255, 159, 210)   # 粉
ACCENT_C = (143, 231, 255)   # 青


def vertical_gradient(size, top, bottom):
    w, h = size
    base = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(1, h - 1)
        base.putpixel(
            (0, y),
            tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3)),
        )
    return base.resize((w, h), Image.BILINEAR)


def radial_glow(size, center, radius, color, strength=1.0):
    """返回一张带径向光晕的 RGBA 图层。"""
    w, h = size
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    px = layer.load()
    cx, cy = center
    for y in range(max(0, int(cy - radius)), min(h, int(cy + radius))):
        for x in range(max(0, int(cx - radius)), min(w, int(cx + radius))):
            d = math.hypot(x - cx, y - cy)
            if d >= radius:
                continue
            falloff = (1 - d / radius) ** 2.2
            a = int(255 * falloff * strength)
            if a <= 0:
                continue
            px[x, y] = (color[0], color[1], color[2], a)
    return layer.filter(ImageFilter.GaussianBlur(radius * 0.08))


def load_font(candidates, size):
    for path in candidates:
        p = Path(path)
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size)
            except OSError:
                continue
    return ImageFont.load_default()


def main() -> None:
    img = vertical_gradient((W, H), BG_TOP, BG_BOTTOM).convert("RGBA")

    # 三团光晕
    img = Image.alpha_composite(img, radial_glow((W, H), (180, 90), 620, ACCENT_A, 0.30))
    img = Image.alpha_composite(img, radial_glow((W, H), (1080, 120), 520, ACCENT_B, 0.20))
    img = Image.alpha_composite(img, radial_glow((W, H), (600, 660), 620, ACCENT_C, 0.12))

    draw = ImageDraw.Draw(img, "RGBA")

    # 细点阵纹理
    random.seed(20261024)
    for _ in range(2600):
        x = random.randrange(W)
        y = random.randrange(H)
        a = random.randint(10, 34)
        draw.point((x, y), fill=(255, 255, 255, a))

    # 飘落的花瓣/星点
    for _ in range(46):
        x = random.randrange(40, W - 40)
        y = random.randrange(40, H - 40)
        r = random.uniform(1.4, 4.2)
        color = random.choice([ACCENT_A, ACCENT_B, (255, 255, 255)])
        a = random.randint(50, 130)
        draw.ellipse([x - r, y - r * 0.72, x + r, y + r * 0.72], fill=(*color, a))

    # 终端提示符
    mono = load_font(
        [
            r"C:\Windows\Fonts\consola.ttf",
            r"C:\Windows\Fonts\consolab.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        ],
        38,
    )
    draw.text((100, 150), "> XEYcmd", font=mono, fill=(*ACCENT_B, 235))

    # 主标题（中文用系统黑体，找不到就退回默认字体）
    title_font = load_font(
        [
            r"C:\Windows\Fonts\msyhbd.ttc",
            r"C:\Windows\Fonts\msyh.ttc",
            r"C:\Windows\Fonts\simhei.ttf",
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        ],
        86,
    )
    title = "XEYcmd的个人主页"
    draw.text((100, 232), title, font=title_font, fill=(255, 255, 255, 255))

    # 副标题
    sub_font = load_font(
        [
            r"C:\Windows\Fonts\msyh.ttc",
            r"C:\Windows\Fonts\simhei.ttf",
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ],
        34,
    )
    draw.text((104, 360), "代码 · 终端 · 二次元", font=sub_font, fill=(*ACCENT_A, 225))

    # 底部细线 + 域名
    draw.line([(100, 500), (1100, 500)], fill=(255, 255, 255, 40), width=1)
    small = load_font(
        [
            r"C:\Windows\Fonts\consola.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        ],
        26,
    )
    draw.text((100, 524), "blog.xeycmd.ccwu.cc", font=small, fill=(255, 255, 255, 130))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"[og] 已生成 {OUT} ({OUT.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
