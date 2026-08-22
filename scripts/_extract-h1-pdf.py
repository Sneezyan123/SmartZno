# -*- coding: utf-8 -*-
import os
import fitz

pdf = r"c:\Users\munex\Downloads\Telegram Desktop\Вступ_до_історії,_стародавня_історія_України_до_трипільської_культури (2).pdf"
out = r"b:\smartZNO\SmartZno\public\history\h1-01\_extract"
os.makedirs(out, exist_ok=True)

doc = fitz.open(pdf)
print("pages", len(doc))
for i in range(len(doc)):
    page = doc[i]
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    full = os.path.join(out, f"full_page{i+1}.png")
    pix.save(full)
    imgs = page.get_images(full=True)
    print(f"--- page {i+1}: {len(imgs)} images, full {pix.width}x{pix.height} ---")
    for j, img in enumerate(imgs):
        xref = img[0]
        base = doc.extract_image(xref)
        ext = base["ext"]
        path = os.path.join(out, f"page{i+1}_img{j+1}.{ext}")
        with open(path, "wb") as f:
            f.write(base["image"])
        print(f"  img{j+1} {base['width']}x{base['height']} {ext}")
