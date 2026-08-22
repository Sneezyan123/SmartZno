# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image

src = Path(r"b:\smartZNO\SmartZno\public\history\h1-01\_extract")
dst = Path(r"b:\smartZNO\SmartZno\public\history\h1-01")

def crop(page, box, name):
    im = Image.open(src / f"full_page{page}.png")
    out = im.crop(box)
    path = dst / name
    out.save(path, optimize=True)
    print(name, out.size)

# full pages are 1191 x 1684
crop(2, (48, 390, 1145, 1165), "map-ethnographic.png")
crop(4, (55, 145, 1135, 430), "chrono-timeline.png")
crop(4, (70, 920, 430, 1480), "herodotus-webinar.png")
crop(4, (760, 920, 1125, 1480), "hrushevsky.png")
crop(8, (55, 430, 540, 780), "hand-axe.png")
crop(10, (70, 145, 1120, 860), "map-paleolithic-webinar.png")
crop(10, (55, 900, 560, 1420), "paleolithic-tools.png")
crop(10, (620, 980, 1125, 1420), "mizyn-bracelet.png")
crop(11, (55, 640, 560, 1100), "mesolithic-tools.png")
crop(12, (55, 560, 560, 1020), "neolithic-tools.png")
crop(14, (70, 900, 1125, 1520), "map-trypillia.png")
crop(15, (160, 500, 1030, 990), "trypillia-recon.png")
crop(16, (55, 145, 1135, 545), "trypillia-pottery-webinar.png")
crop(16, (55, 620, 1135, 1020), "talianky-panorama.png")
crop(17, (700, 200, 1125, 760), "goddess-mother.png")
crop(17, (50, 880, 560, 1480), "map-serednostogivska.png")
