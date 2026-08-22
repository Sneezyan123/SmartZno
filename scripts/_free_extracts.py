# -*- coding: utf-8 -*-
import os
import shutil
from pathlib import Path

roots = [
    Path(r"b:\smartZNO\SmartZno\public\history\h2-01\_extract"),
    Path(r"b:\smartZNO\SmartZno\public\history\h1-01\_extract"),
    Path(r"b:\smartZNO\SmartZno\public\history\h1-02\_extract"),
    Path(r"b:\smartZNO\SmartZno\public\history\h3-01\_extract"),
]
# keep h2-02 pages.txt but delete full_page jpgs
p = Path(r"b:\smartZNO\SmartZno\public\history\h2-02\_extract")
if p.exists():
    for f in p.glob("full_page*.jpg"):
        f.unlink()
        print("del", f.name)
    for f in p.glob("full_page*.png"):
        f.unlink()
        print("del", f.name)
for r in roots:
    if r.exists():
        shutil.rmtree(r, ignore_errors=True)
        print("rmtree", r)
print("done")
