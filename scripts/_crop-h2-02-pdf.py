# -*- coding: utf-8 -*-
"""Crop maps/artifacts from Yaroslav webinar. PDF coords, scale 2.0 for quality."""
import os
import pymupdf

pdf = r"c:\Users\munex\Downloads\Telegram Desktop\Русь_Україна_за_Ярослава_Мудрого_і_в_період_роздробленості.pdf"
dst = r"b:\smartZNO\SmartZno\public\history\h2-02"
os.makedirs(dst, exist_ok=True)
doc = pymupdf.open(pdf)
mat = pymupdf.Matrix(2, 2)

def crop(page_no, box, name):
    page = doc[page_no - 1]
    clip = pymupdf.Rect(*box)
    pix = page.get_pixmap(matrix=mat, clip=clip, alpha=False)
    path = os.path.join(dst, name)
    pix.save(path)
    print(name, pix.width, pix.height)

# PDF page ~595 x 842
crop(2, (40, 70, 250, 330), "portrait-yaroslav.png")
crop(3, (40, 430, 290, 700), "pechersk-monastery.png")
crop(3, (305, 430, 555, 700), "sophia-cathedral.png")
crop(4, (330, 70, 555, 240), "ruska-pravda.png")
crop(4, (40, 480, 250, 720), "portrait-anna.png")
crop(5, (40, 70, 555, 430), "map-yaroslav.png")
crop(6, (40, 55, 555, 280), "golden-gate.png")
crop(7, (300, 280, 555, 470), "vseslav-uprising.png")
crop(8, (300, 280, 555, 500), "lyubech-council.png")
crop(10, (40, 55, 555, 390), "map-monomakh-polovtsi.png")
crop(13, (40, 70, 555, 430), "map-fragmentation.png")
crop(14, (40, 340, 290, 530), "sophia-modern.png")
crop(14, (305, 340, 555, 530), "uspensky-lavra.png")
crop(14, (40, 560, 290, 750), "mykhailivsky.png")
crop(15, (40, 80, 290, 330), "spas-chernihiv.png")
crop(15, (305, 80, 555, 330), "pyatnytska.png")
crop(15, (40, 430, 290, 680), "vyshhorod-icon.png")
crop(15, (305, 430, 555, 680), "svenska-icon.png")
crop(16, (40, 90, 290, 380), "pantocrator.png")
crop(16, (305, 90, 555, 380), "oranta.png")
crop(17, (40, 90, 290, 360), "ostromir-luke.png")
crop(17, (305, 90, 555, 360), "izbornik-family.png")
crop(18, (320, 70, 555, 280), "alipiy-miniature.png")
print("done")
