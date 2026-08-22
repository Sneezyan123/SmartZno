# -*- coding: utf-8 -*-
import os
import pymupdf

pdf = r"c:\Users\munex\Downloads\Telegram Desktop\Руські_удільні_князівства_у_складі_іноземних_держав_1.pdf"
dst = r"b:\smartZNO\SmartZno\public\history\h3-01\_extract"
os.makedirs(dst, exist_ok=True)
doc = pymupdf.open(pdf)
out = []
out.append(f"pages={doc.page_count} title={doc.metadata.get('title')}")
for i, page in enumerate(doc, 1):
    text = page.get_text("text")
    out.append(f"\n===== PAGE {i} =====\n{text}")
path = os.path.join(dst, "pages.txt")
with open(path, "w", encoding="utf-8") as f:
    f.write("\n".join(out))
print("pages", doc.page_count, "chars", sum(len(x) for x in out))
print("wrote", path)
