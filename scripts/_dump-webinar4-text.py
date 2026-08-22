# -*- coding: utf-8 -*-
import sys
from pathlib import Path
import fitz

sys.stdout.reconfigure(encoding="utf-8")
pdf = Path(r"b:\downloads\Вебінар 4.pptx.pdf")
out = Path(r"b:\smartZNO\SmartZno\scripts\_webinar4-text.txt")
doc = fitz.open(pdf)
parts = [f"pages {len(doc)}\n"]
for i in range(len(doc)):
    t = doc[i].get_text("text")
    parts.append(f"\n===== PAGE {i+1} =====\n")
    parts.append(t if t.strip() else "(no text)")
out.write_bytes("".join(parts).encode("utf-8"))
print("ok", out.stat().st_size)
