# -*- coding: utf-8 -*-
import json
from pathlib import Path

lesson = json.loads(Path(r"b:\smartZNO\SmartZno\content\history-nmt\lessons\h3-01.json").read_text(encoding="utf-8"))
root = Path(r"b:\smartZNO\SmartZno\public")
missing = []

def check(src):
    if not src:
        return
    p = root / src.lstrip("/")
    if not p.exists():
        missing.append(src)

for block in lesson["theory"] + lesson.get("notes", []):
    check(block.get("image"))
    fig = block.get("figure") or {}
    check(fig.get("image"))
for hw in lesson["homework"]:
    check(hw.get("image"))

print("missing", missing or "none")
print("title", lesson["title"])
