# -*- coding: utf-8 -*-
"""Crop educational visuals from the intro/Trypillia webinar PDF."""
import os
import fitz

pdf = r"c:\Users\munex\Downloads\Telegram Desktop\Вступ_до_історії,_стародавня_історія_України_до_трипільської_культури (2).pdf"
out = r"b:\smartZNO\SmartZno\public\history\h1-01"
os.makedirs(out, exist_ok=True)

doc = fitz.open(pdf)
print("page size", doc[0].rect)

# clip is in PDF points (page ~595 x 842)
crops = {
    # page, (x0, y0, x1, y1), filename
    "map-ethnographic.png": (1, (36, 188, 560, 548)),
    "chrono-timeline.png": (3, (36, 70, 560, 250)),
    "herodotus-webinar.png": (3, (40, 430, 290, 760)),
    "hrushevsky.png": (3, (310, 430, 560, 760)),
    "hand-axe.png": (7, (36, 210, 280, 390)),
    "map-paleolithic-webinar.png": (9, (40, 70, 555, 430)),
    "paleolithic-tools.png": (9, (36, 440, 300, 720)),
    "mizyn-bracelet.png": (9, (310, 440, 560, 720)),
    "mesolithic-tools.png": (10, (36, 310, 300, 560)),
    "neolithic-tools.png": (11, (36, 280, 300, 520)),
    "map-trypillia.png": (13, (40, 430, 555, 760)),
    "trypillia-recon.png": (14, (80, 250, 515, 500)),
    "trypillia-pottery-webinar.png": (15, (36, 70, 560, 280)),
    "talianky-panorama.png": (15, (36, 300, 560, 520)),
    "goddess-mother.png": (16, (330, 80, 560, 380)),
    "map-serednostogivska.png": (16, (36, 430, 300, 740)),
}

mat = fitz.Matrix(2.4, 2.4)
for name, (page_i, box) in crops.items():
    page = doc[page_i]
    clip = fitz.Rect(*box)
    pix = page.get_pixmap(matrix=mat, clip=clip, alpha=False)
    path = os.path.join(out, name)
    pix.save(path)
    print(f"{name}: {pix.width}x{pix.height}")
