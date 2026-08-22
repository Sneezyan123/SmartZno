# -*- coding: utf-8 -*-
import os
import pymupdf

pdf = r"c:\Users\munex\Downloads\Telegram Desktop\Руські_удільні_князівства_у_складі_іноземних_держав_1.pdf"
dst = r"b:\smartZNO\SmartZno\public\history\h3-01\_extract"
os.makedirs(dst, exist_ok=True)
doc = pymupdf.open(pdf)
mat = pymupdf.Matrix(0.7, 0.7)
lines = []
for i, page in enumerate(doc, 1):
    pix = page.get_pixmap(matrix=mat, alpha=False)
    pix.save(os.path.join(dst, f"p{i:02d}.jpg"), jpg_quality=55)
    lines.append(f"\n=== PAGE {i} ===")
    n = 0
    for b in page.get_text("dict")["blocks"]:
        if b.get("type") == 1:
            bb = tuple(round(x, 1) for x in b["bbox"])
            w = round(bb[2] - bb[0])
            h = round(bb[3] - bb[1])
            if w >= 60 and h >= 60:
                n += 1
                lines.append(f"  img {w}x{h} bbox={bb}")
    # drawings that look like maps
    for d in page.get_drawings():
        r = d["rect"]
        if r.width > 180 and r.height > 140:
            lines.append(f"  draw {round(r.width)}x{round(r.height)} bbox={tuple(round(x,1) for x in r)}")
            break
    lines.append(f"  images={n}")
path = os.path.join(dst, "layout.txt")
with open(path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print("ok", path)
