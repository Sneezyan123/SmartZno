# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image

src = Path(r"b:\smartZNO\SmartZno\public\history\h1-02\_extract")
dst = Path(r"b:\smartZNO\SmartZno\public\history\h1-02")

def crop(page, box, name):
    im = Image.open(src / f"full_page{page}.png")
    out = im.crop(box)
    out.save(dst / name, optimize=True)
    print(name, out.size)

# full pages 1191 x 1684
crop(3, (48, 720, 1145, 1520), "map-cimmerian.png")
crop(4, (48, 780, 1145, 1525), "map-scythia.png")
crop(5, (280, 620, 910, 1120), "kurgan.png")
crop(6, (48, 175, 1145, 720), "map-darius.png")
crop(7, (48, 760, 1145, 1530), "map-sarmatian.png")
crop(8, (48, 780, 1145, 1525), "map-greek.png")
crop(9, (70, 430, 1120, 820), "chersonesos.png")
crop(11, (70, 280, 1120, 920), "map-slavic.png")
crop(12, (720, 280, 1120, 920), "zbruch-idol.png")
crop(12, (48, 1080, 1145, 1520), "map-antes.png")
