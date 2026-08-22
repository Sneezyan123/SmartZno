#!/usr/bin/env python3
"""Fix h3-01.json from webinar source; finalize _write-h3-01.py."""
import json
import re
import shutil
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))
import _h3_lesson_build as b

OUT = b.OUT
IMG = b.IMG
P = b.P
ws = b.ws
body = b.body
cp = b.cp
quiz_opts = b.quiz_opts
page4_tiles = b.page4_tiles
page6_items = b.page6_items
page7_yahailo = b.page7_yahailo
vitovt_steps = b.vitovt_steps
page17_factories = b.page17_factories
page27_flips = b.page27_flips
page29_tiles = b.page29_tiles
page31_tiles = b.page31_tiles


def get_theory():
    title = ws(P[2].replace("Тема 4.", ""))
    principle = "«Старого не рушимо, нового не вводимо»"
    return [
        {
            "type": "scene",
            "kicker": "Тема 4. Вступ",
            "image": f"{IMG}/map-lithuania-join.jpg",
            "content": (
                f"{title}. Литва, Польща, Угорщина, Москва, Крим і Османська імперія. "
                "У конспекті - та samа інформація, без анімацій. Перевірка - у kвізі."
            ),
        },
        {
            "type": "heading",
            "era": "poland",
            "kicker": "Польща",
            "content": "Політика Польщі на ukrainskykh zemliakh",
            "image": f"{IMG}/map-rus-voivodeship.jpg",
            "caption": "Галичина в складі Корони. Руське voєводство.",
        },
    ]


def fix_existing(data):
    title = ws(P[2].replace("Тема 4.", ""))
    data["title"] = title
    data["objectives"] = [
        "Знати політику Польщі, Литви, Москви, Криму та Османів на ukrainskykh zemliakh",
        "Пояснити соціальний устрій, мagdeburzke pravo й kультуру XIV–XV st.",
        "Відрізняти унії, ekspansії та dжerela z praktyky NMT",
    ]
    data["objectives"] = [
        "Знати політику Польщі, Литви, Москви, Криму та Османів на ukrainskykh zemliakh",
        "Пояснити соціальний устрій, magdeburzke pravo й kультуру XIV–XV st.",
        "Відрізняти унії, ekspansії та dжerela z praktyky NMT",
    ]
    return data


def main():
    data = json.loads(OUT.read_text(encoding="utf-8"))
    data["homework"] = b._homework()
    # fix homework expl Ukrainian
    fixes = {
        38: "Магdeбurзьке правo — samovriaduvannia mist.",
        39: "Генuезька форteця в Sudaku.",
        40: "Panщina — bezkoshtovna pratsia.",
        41: "Yurii Drohobych.",
        42: "Mukachivskyi zamok.",
        43: "1385 r.",
    }
    fixes = {
        38: "Магdeбurзьке правo — samovriaduvannia mist.",
        39: "Генuезька форteця в Sudaku.",
        40: "Panщina — bezkoshtovna pratsia kripaka.",
        41: "Yurii Drohobych — Prohnostyk 1483.",
        42: "Mukachivskyi zamok — Zakarpattia.",
        43: "1385 r. — Krevska uniia.",
    }
    for item in data["homework"]:
        if item["id"].startswith("h3-01-h") and item["id"] != "h3-01-h7" and item["id"] != "h3-01-h8":
            n = int(item["id"].split("h")[-1])
            pages = [38, 39, 40, 41, 42, 43]
            if n <= 6:
                item["explanation"] = {
                    38: "Магdeбurзьке правo — samovriaduvannia mist.",
                    39: "Генuезька форteця в Sudaku.",
                    40: "Panщina — obov'iazkova pratsia na poli pana.",
                    41: "Yurii Drohobych — Prohnostyk 1483 r.",
                    42: "Mukachivskyi zamok palanok — Zakarpattia.",
                    43: "1385 r. — umovy Krevskoi uniï.",
                }[pages[n - 1]]
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    json.loads(OUT.read_text(encoding="utf-8"))
    print("ok")


if __name__ == "__main__":
    main()
