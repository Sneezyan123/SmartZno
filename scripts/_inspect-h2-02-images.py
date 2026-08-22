# -*- coding: utf-8 -*-
import pymupdf

pdf = r"c:\Users\munex\Downloads\Telegram Desktop\Русь_Україна_за_Ярослава_Мудрого_і_в_період_роздробленості.pdf"
out = r"b:\smartZNO\SmartZno\public\history\h2-02\_extract\bboxes.txt"
doc = pymupdf.open(pdf)
lines = []
for i in [1, 2, 3, 4, 5, 6, 7, 9, 12, 13, 14, 15, 16, 17]:
    page = doc[i]
    lines.append(f"\n=== PAGE {i+1} ===")
    blocks = page.get_text("dict")["blocks"]
    imgs = [b for b in blocks if b.get("type") == 1]
    lines.append(f"image blocks {len(imgs)}")
    for b in imgs:
        x0, y0, x1, y1 = b["bbox"]
        w, h = x1 - x0, y1 - y0
        if w > 40 and h > 40:
            lines.append(f"  {w:.0f}x{h:.0f} bbox=({x0:.0f},{y0:.0f},{x1:.0f},{y1:.0f})")
open(out, "w", encoding="utf-8").write("\n".join(lines) + "\n")
print("ok", len(lines))
