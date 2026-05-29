"""Render the ClickMenu mark to PNG/ICO at multiple sizes.

Draws the same shapes as src/app/icon.svg so SVG and raster stay visually identical:
- dark rounded square background (gradient approximated with two layers)
- bold gold M path
- small gold "click" dot top-right
"""
from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APP_DIR = ROOT / "src" / "app"
PUB_DIR = ROOT / "public" / "logos"

# Palette
BG_TOP    = (26, 26, 26, 255)
BG_BOTTOM = (7, 7, 7, 255)
GOLD_TOP    = (255, 233, 168, 255)
GOLD_MID    = (232, 193, 88, 255)
GOLD_BOTTOM = (181, 135, 46, 255)
GOLD_HAIR   = (255, 224, 150, 46)  # subtle inner border

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(len(a)))

def vertical_gradient(w, h, top, bot):
    img = Image.new("RGBA", (w, h))
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        c = lerp(top, bot, t)
        for x in range(w):
            px[x, y] = c
    return img

def gold_for_y(y, h):
    t = y / max(1, h - 1)
    if t < 0.55:
        return lerp(GOLD_TOP, GOLD_MID, t / 0.55)
    return lerp(GOLD_MID, GOLD_BOTTOM, (t - 0.55) / 0.45)

def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([(0, 0), size], radius=radius, fill=255)
    return mask

def render(size: int, supersample: int = 4) -> Image.Image:
    """Render at size*supersample, then downscale for clean antialiasing."""
    S = size * supersample
    radius_ratio = 14 / 64

    # Background: gradient + rounded mask
    bg = vertical_gradient(S, S, BG_TOP, BG_BOTTOM)
    mask = rounded_mask((S, S), int(S * radius_ratio))
    canvas = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    canvas.paste(bg, (0, 0), mask)

    draw = ImageDraw.Draw(canvas)

    # Inner hairline border (subtle)
    inset = max(1, S // 96)
    draw_rect = (inset, inset, S - inset - 1, S - inset - 1)
    border_mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(border_mask).rounded_rectangle(
        draw_rect, radius=int(S * radius_ratio) - inset, outline=255, width=max(1, S // 128)
    )
    border_layer = Image.new("RGBA", (S, S), GOLD_HAIR)
    canvas.paste(border_layer, (0, 0), border_mask)

    # Bold M path (viewBox 64): (14,49)→(14,18)→(32,38)→(50,18)→(50,49)
    def scale(p):
        return (p[0] / 64 * S, p[1] / 64 * S)
    pts = [scale(p) for p in [(14, 49), (14, 18), (32, 38), (50, 18), (50, 49)]]
    stroke_w = max(2, int(7 / 64 * S))

    # Draw the stroke into its own layer, then color it with a vertical gold gradient by masking
    m_layer = Image.new("L", (S, S), 0)
    ImageDraw.Draw(m_layer).line(pts, fill=255, width=stroke_w, joint="curve")
    # round line caps explicitly (PIL strokes are flat by default; emulate with circles at endpoints)
    cap_r = stroke_w // 2
    for (x, y) in (pts[0], pts[-1]):
        ImageDraw.Draw(m_layer).ellipse(
            (x - cap_r, y - cap_r, x + cap_r, y + cap_r), fill=255
        )
    # Build vertical gold gradient image, then mask
    gold_img = Image.new("RGBA", (S, S))
    gpx = gold_img.load()
    # Find vertical range of the M for gradient mapping
    ys = [p[1] for p in pts]
    y_top, y_bot = min(ys) - cap_r, max(ys) + cap_r
    for y in range(S):
        rel = (y - y_top) / max(1, y_bot - y_top)
        rel = max(0.0, min(1.0, rel))
        if rel < 0.55:
            c = lerp(GOLD_TOP, GOLD_MID, rel / 0.55)
        else:
            c = lerp(GOLD_MID, GOLD_BOTTOM, (rel - 0.55) / 0.45)
        for x in range(S):
            gpx[x, y] = c
    canvas.paste(gold_img, (0, 0), m_layer)

    # Click dot top-right at (50, 14) radius 4.2 (viewBox 64)
    cx, cy = scale((50, 14))
    r = (4.2 / 64) * S
    halo_r = (6.6 / 64) * S
    # Halo ring
    halo_w = max(1, int(S / 110))
    ImageDraw.Draw(canvas).ellipse(
        (cx - halo_r, cy - halo_r, cx + halo_r, cy + halo_r),
        outline=(232, 193, 88, 115), width=halo_w,
    )
    # Filled dot
    ImageDraw.Draw(canvas).ellipse(
        (cx - r, cy - r, cx + r, cy + r),
        fill=(232, 193, 88, 255),
    )

    # Reapply outer rounded-square mask to keep corners clean
    canvas.putalpha(mask)

    # Downscale
    return canvas.resize((size, size), Image.LANCZOS)

def main():
    APP_DIR.mkdir(parents=True, exist_ok=True)
    PUB_DIR.mkdir(parents=True, exist_ok=True)

    # PNG outputs
    for size, path in [
        (32,  APP_DIR / "icon.png"),
        (180, APP_DIR / "apple-icon.png"),
        (512, PUB_DIR / "clickmenu-mark-512.png"),
    ]:
        render(size).save(path, "PNG")
        print(f"wrote {path}")

    # Multi-resolution ICO (overwrite favicon.ico)
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    base = render(64)
    base.save(APP_DIR / "favicon.ico", format="ICO", sizes=ico_sizes)
    print(f"wrote {APP_DIR / 'favicon.ico'} ({len(ico_sizes)} sizes)")

if __name__ == "__main__":
    main()
