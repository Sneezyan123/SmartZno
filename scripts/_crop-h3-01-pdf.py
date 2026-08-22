# -*- coding: utf-8 -*-
import os
import pymupdf

pdf = r"c:\Users\munex\Downloads\Telegram Desktop\Руські_удільні_князівства_у_складі_іноземних_держав_1.pdf"
dst = r"b:\smartZNO\SmartZno\public\history\h3-01"
os.makedirs(dst, exist_ok=True)
doc = pymupdf.open(pdf)
mat = pymupdf.Matrix(1.5, 1.5)

def crop(page_no, box, name, q=80):
    pix = doc[page_no - 1].get_pixmap(matrix=mat, clip=pymupdf.Rect(*box), alpha=False)
    path = os.path.join(dst, name)
    pix.save(path, jpg_quality=q)
    print(name, pix.width, pix.height)

crop(4, (400.4, 169.9, 534.5, 334.4), "portrait-liubart.jpg")
crop(4, (50.4, 414.7, 192.9, 574.3), "portrait-olgerd.jpg")
crop(5, (153.7, 452.3, 441.6, 757.3), "map-syni-vody.jpg")
crop(7, (106.3, 312.4, 232.2, 483.2), "portrait-jagailo.jpg")
crop(7, (363.1, 312.7, 505.3, 483.6), "portrait-jadwiga.jpg")
crop(8, (425.5, 591.6, 548.4, 751.2), "portrait-vytautas.jpg")
crop(9, (106.3, 48.0, 489.0, 392.2), "map-vorskla.jpg")
crop(11, (72.0, 45.2, 523.3, 245.2), "painting-grunwald.jpg")
crop(11, (132.0, 406.7, 463.2, 706.0), "map-1387.jpg")
crop(12, (303.0, 468.1, 546.5, 746.3), "map-vkrus.jpg")
crop(14, (168.1, 47.3, 427.2, 392.8), "map-1452-1471.jpg")
print("ok")
