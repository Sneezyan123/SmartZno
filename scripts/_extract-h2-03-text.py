# -*- coding: utf-8 -*-
import os
import pymupdf

pdf = r"c:\Users\munex\Downloads\Telegram Desktop\Галицько-Волинська держава.pdf"
out = r"b:\smartZNO\SmartZno\public\history\h2-03\_extract"
os.makedirs(out, exist_ok=True)

doc = pymupdf.open(pdf)
print("pages", len(doc), "size", doc[0].rect)
text_path = os.path.join(out, "pages.txt")
with open(text_path, "w", encoding="utf-8") as f:
    for i in range(len(doc)):
        page = doc[i]
        t = page.get_text("text")
        f.write(f"\n\n===== PAGE {i+1} =====\n")
        f.write(t)
        print(f"page {i+1}: images={len(page.get_images())} chars={len(t)}")
print("wrote", text_path)
