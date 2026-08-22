# -*- coding: utf-8 -*-
import os
import pymupdf

pdf = r"c:\Users\munex\Downloads\Telegram Desktop\Галицько-Волинська держава.pdf"
dst = r"b:\smartZNO\SmartZno\public\history\h2-03"
os.makedirs(dst, exist_ok=True)
doc = pymupdf.open(pdf)
mat = pymupdf.Matrix(1.5, 1.5)

def crop(page_no, box, name, q=80):
    pix = doc[page_no - 1].get_pixmap(matrix=mat, clip=pymupdf.Rect(*box), alpha=False)
    path = os.path.join(dst, name)
    pix.save(path, jpg_quality=q)
    print(name, pix.width, pix.height)

# portraits / artifacts from detected bboxes
crop(3, (387, 347, 554, 581), "portrait-roman.jpg")
crop(4, (118, 231, 477, 526), "map-roman.jpg")
crop(5, (42, 513, 194, 718), "portrait-danylo.jpg")
crop(7, (93, 115, 503, 440), "map-mongol.jpg")
crop(11, (110, 311, 485, 525), "coronation-danylo.jpg")
crop(12, (40, 267, 197, 476), "portrait-lev.jpg")
crop(13, (398, 105, 552, 305), "portrait-yuri1.jpg")
crop(13, (108, 570, 487, 784), "seal-yuri1.jpg")
crop(14, (399, 324, 556, 523), "portrait-yuri2.jpg")
crop(14, (439, 498, 584, 652), "seal-yuri2.jpg")
crop(16, (105, 68, 491, 357), "uspensky-volodymyr.jpg")
crop(16, (105, 450, 491, 738), "panteleimon.jpg")
crop(17, (194, 62, 408, 351), "dorohobuzh-icon.jpg")
crop(17, (192, 451, 402, 736), "kholm-icon.jpg")
# likely maps drawn as vectors — clip typical content areas
crop(8, (40, 80, 555, 420), "map-kalka.jpg")
crop(9, (40, 80, 555, 380), "map-kyiv-1240.jpg")
print("ok")
