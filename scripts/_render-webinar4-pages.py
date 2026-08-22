# -*- coding: utf-8 -*-
import fitz
from pathlib import Path

pdf = Path(r"b:\downloads\Вебінар 4.pptx.pdf")
out = Path(r"b:\smartZNO\SmartZno\public\history\h3-01\_extract")
doc = fitz.open(pdf)
for i in [3, 10, 25, 28, 29, 30, 31]:
    page = doc[i]
    pix = page.get_pixmap(matrix=fitz.Matrix(1.6, 1.6), alpha=False)
    path = out / f"full_page{i+1}.png"
    pix.save(str(path))
    print("saved", path.name, pix.width, pix.height)
