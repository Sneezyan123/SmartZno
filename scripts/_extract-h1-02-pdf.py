# -*- coding: utf-8 -*-
import os
import fitz

pdf = r"c:\Users\munex\Downloads\Telegram Desktop\Стародавня_історія_України_залізний_вік,_греки,_словʼяни.pdf"
out = r"b:\smartZNO\SmartZno\public\history\h1-02\_extract"
os.makedirs(out, exist_ok=True)

doc = fitz.open(pdf)
print("pages", len(doc), "size", doc[0].rect)
for i in range(len(doc)):
    page = doc[i]
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    pix.save(os.path.join(out, f"full_page{i+1}.png"))
    print(f"page {i+1}: {pix.width}x{pix.height}")
