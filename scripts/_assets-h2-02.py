# -*- coding: utf-8 -*-
"""Copy fallback assets + crop key maps from Yaroslav webinar (small JPEGs)."""
import os
import shutil
import pymupdf

dst = r"b:\smartZNO\SmartZno\public\history\h2-02"
os.makedirs(dst, exist_ok=True)
h201 = r"b:\smartZNO\SmartZno\public\history\h2-01"
h204 = r"b:\smartZNO\SmartZno\public\history\h2-04"
assets = r"C:\Users\munex\.cursor\projects\b-smartZNO\assets"

copies = [
    (os.path.join(assets, "hero-yaroslav.jpg"), "hero-yaroslav.jpg"),
    (os.path.join(assets, "hero-triumvirate.jpg"), "hero-triumvirate.jpg"),
    (os.path.join(assets, "hero-mstyslav.jpg"), "hero-mstyslav.jpg"),
    (os.path.join(assets, "hero-pravda.jpg"), "hero-pravda.jpg"),
    (os.path.join(h201, "hero-yaroslav.jpg"), "hero-yaroslav.jpg"),
    (os.path.join(h201, "hero-lyubech.jpg"), "hero-lyubech.jpg"),
    (os.path.join(h201, "hero-monomakh.jpg"), "hero-monomakh.jpg"),
    (os.path.join(h204, "sophia-exterior.jpg"), "hero-sophia.jpg"),
    (os.path.join(h204, "hero-fragmentation.jpg"), "hero-fragmentation.jpg"),
    (os.path.join(h204, "hero-society.jpg"), "hero-society.jpg"),
    (os.path.join(h204, "hero-architecture.jpg"), "hero-culture.jpg"),
]
seen = set()
for src, name in copies:
    if name in seen:
        continue
    if os.path.isfile(src):
        out = os.path.join(dst, name)
        if not os.path.isfile(out):
            shutil.copy2(src, out)
            print("copy", name)
        seen.add(name)
    else:
        print("miss", src)

pdf = r"c:\Users\munex\Downloads\Telegram Desktop\Русь_Україна_за_Ярослава_Мудрого_і_в_період_роздробленості.pdf"
doc = pymupdf.open(pdf)
mat = pymupdf.Matrix(1.25, 1.25)

def crop(page_no, box, name):
    page = doc[page_no - 1]
    pix = page.get_pixmap(matrix=mat, clip=pymupdf.Rect(*box), alpha=False)
    path = os.path.join(dst, name)
    pix.save(path, jpg_quality=78)
    print("crop", name, pix.width, pix.height)

crop(2, (40, 70, 250, 330), "portrait-yaroslav.jpg")
crop(3, (40, 430, 290, 700), "pechersk-monastery.jpg")
crop(3, (305, 430, 555, 700), "sophia-webinar.jpg")
crop(4, (330, 70, 555, 240), "ruska-pravda.jpg")
crop(4, (40, 480, 250, 720), "portrait-anna.jpg")
crop(5, (40, 70, 555, 430), "map-yaroslav.jpg")
crop(6, (40, 55, 555, 280), "golden-gate.jpg")
crop(7, (300, 280, 555, 470), "vseslav-uprising.jpg")
crop(8, (300, 280, 555, 500), "lyubech-council.jpg")
crop(10, (40, 55, 555, 390), "map-monomakh-polovtsi.jpg")
crop(13, (40, 70, 555, 430), "map-fragmentation-webinar.jpg")
crop(14, (40, 560, 290, 750), "mykhailivsky.jpg")
crop(14, (305, 340, 555, 530), "uspensky-lavra.jpg")
crop(15, (40, 80, 290, 330), "spas-chernihiv.jpg")
crop(15, (305, 80, 555, 330), "pyatnytska.jpg")
crop(15, (40, 430, 290, 680), "vyshhorod-icon.jpg")
crop(15, (305, 430, 555, 680), "svenska-icon.jpg")
crop(16, (40, 90, 290, 380), "pantocrator-webinar.jpg")
crop(16, (305, 90, 555, 380), "oranta-webinar.jpg")
crop(17, (40, 90, 290, 360), "ostromir-luke.jpg")
crop(17, (305, 90, 555, 360), "izbornik-family.jpg")
print("ok")
