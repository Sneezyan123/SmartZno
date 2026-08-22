# -*- coding: utf-8 -*-
import os
import pymupdf

pdf = r"c:\Users\munex\Downloads\Telegram Desktop\Руські_удільні_князівства_у_складі_іноземних_держав_1.pdf"
dst = r"b:\smartZNO\SmartZno\public\history\h3-01\_extract"
os.makedirs(dst, exist_ok=True)
doc = pymupdf.open(pdf)
lines = []
for i, page in enumerate(doc, 1):
    lines.append(f"\n=== PAGE {i} ===")
    large = 0
    for img in page.get_images(full=True):
        xref = img[0]
        try:
            r = page.get_image_rects(xref)
        except Exception:
            r = []
        info = doc.extract_image(xref)
        w, h = info["width"], info["height"]
        bbox = tuple(round(x, 1) for box in r for x in box) if r else ()
        if w >= 80 and h >= 80:
            large += 1
            b = r[0] if r else None
            lines.append(f"  {w}x{h} bbox={tuple(round(x,1) for x in b) if b else None}")
    lines.append(f"  large={large} page={page.rect}")
path = os.path.join(dst, "bboxes.txt")
with open(path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print("ok", len(lines))
