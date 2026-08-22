# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image

src = Path(r"b:\smartZNO\SmartZno\public\history\h2-01\_extract")
dst = Path(r"b:\smartZNO\SmartZno\public\history\h2-01")

def crop(page, box, name):
    im = Image.open(src / f"full_page{page}.png")
    out = im.crop(box)
    out.save(dst / name, optimize=True)
    print(name, out.size)

crop(2, (545, 300, 1135, 900), "map-tribes.png")
crop(4, (520, 920, 1135, 1510), "map-askold-860.png")
crop(5, (95, 740, 390, 1120), "portrait-oleg.png")
crop(8, (130, 640, 1060, 1070), "greek-fire.png")
crop(9, (95, 620, 390, 1000), "portrait-olga-webinar.png")
crop(10, (95, 740, 390, 1120), "portrait-sviatoslav.png")
crop(11, (480, 700, 1135, 1515), "map-sviatoslav.png")
crop(13, (80, 200, 360, 500), "portrait-volodymyr.png")
crop(13, (520, 920, 1135, 1510), "map-volodymyr.png")
crop(14, (80, 185, 560, 560), "zmievi-valy.png")
crop(14, (70, 1210, 540, 1495), "city-volodymyr.png")
crop(14, (590, 1210, 1110, 1495), "coins-volodymyr.png")
crop(16, (650, 300, 1110, 880), "baptism-volodymyr.png")
crop(17, (300, 240, 890, 740), "desyatynna.png")
