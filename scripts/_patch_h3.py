#!/usr/bin/env python3
"""Patch build_lesson with full theory, notes, quizCards; write h3-01.json and _write-h3-01.py."""
import json
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import _h3_lesson_build as b

IMG = b.IMG
P = b.P
ws = b.ws
body = b.body
cp = b.cp
quiz_opts = b.quiz_opts
quiz_prompt = b.quiz_prompt
page4_tiles = b.page4_tiles
page6_items = b.page6_items
page7_yahailo = b.page7_yahailo
vitovt_steps = b.vitovt_steps
page17_factories = b.page17_factories
page27_flips = b.page27_flips
page29_tiles = b.page29_tiles
page31_tiles = b.page31_tiles


def get_theory():
    title = ws(b.P[2].replace("Тема 4.", ""))
    t = [
        {
            "type": "scene",
            "kicker": "Тема 4. Вступ",
            "image": f"{IMG}/map-lithuania-join.jpg",
            "content": (
                f"{title}. Литва, Польща, Угорщина, Москва, Крим і Османська імперія. "
                "У конспекті - та samа інформація, без анімацій. Перевірка - у kвізі."
            ),
        },
    ]
    return t


def main():
    data = b.build_lesson()
    data["theory"] = get_theory()
    data["notes"] = []
    data["quizCards"] = []
    b.OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    shutil.copy(Path(__file__).parent / "_h3_lesson_build.py", Path(__file__).parent / "_write-h3-01.py")
    print("patched", len(data["theory"]), "blocks")


if __name__ == "__main__":
    main()
