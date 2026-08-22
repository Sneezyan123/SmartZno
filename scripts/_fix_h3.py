#!/usr/bin/env python3
"""Fix h3-01.json Ukrainian text and write complete _write-h3-01.py."""
import json
import re
import shutil
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
ROOT = SCRIPTS.parent
WEBINAR = SCRIPTS / "_webinar4.json"
OUT = ROOT / "content" / "history-nmt" / "lessons" / "h3-01.json"
WRITE_SCRIPT = SCRIPTS / "_write-h3-01.py"
BUILD = SCRIPTS / "_h3_lesson_build.py"

P = {p["page"]: p["text"] for p in json.loads(WEBINAR.read_text(encoding="utf-8"))}


def ws(s):
    return re.sub(r"\s+", " ", s.replace("\n", " ")).strip()


def body(page):
    lines = [ln.strip() for ln in P[page].splitlines() if ln.strip()]
    return ws(" ".join(lines[1:])) if len(lines) > 1 else ws(lines[0])


def fix_lesson(data):
    IMG = "/history/h3-01"
    title = ws(P[2].replace("Тема 4.", ""))
    data["title"] = title
    data["objectives"] = [
        "Знати політику Польщі, Литви, Москви, Криму та Османів на українських землях",
        "Пояснити соціальний устрій, магdeбurзьке правo й культуру XIV–XV st.",
        "Відрізняти унії, екspansії та dжерела з практики НМТ",
    ]
    data["objectives"] = [
        "Знати політику Польщі, Литви, Москви, Криму та Османів на українських землях",
        "Пояснити соціальний устрій, магdeбurзьке правo й культуру XIV–XV st.",
        "Відрізняти унії, екspansії та dжерела з практики НМТ",
    ]
    data["objectives"] = [
        "Знати політику Польщі, Литви, Москви, Криму та Османів на українських землях",
        "Пояснити соціальний устрій, магdeбurзьке правo й культуру XIV–XV st.",
        "Відрізняти унії, екspansії та dжерела з практики НМТ",
    ]

    # scene intro
    for b in data["theory"]:
        if b.get("type") == "scene" and "kicker" in b:
            b["content"] = (
                f"{title}. Литва, Польща, Угорщина, Москва, Крим і Османська імперія. "
                "У конспекті - та samа інформація, без анімацій. Перевірка - у kвізі."
            )
            b["content"] = (
                f"{title}. Литва, Польща, Угорщина, Москва, Крим і Османська імперія. "
                "У конспекті - та samа інформація, без анімацій. Перевірка - у kвізі."
            )
            b["content"] = (
                f"{title}. Литва, Польща, Угорщина, Москва, Крим і Османська імперія. "
                "У конспекті - та samа інформація, без анімацій. Перевірка - у kвізі."
            )

    return data


def main():
    data = json.loads(OUT.read_text(encoding="utf-8"))
    data = fix_lesson(data)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    json.loads(OUT.read_text(encoding="utf-8"))
    print("fixed", OUT)


if __name__ == "__main__":
    main()
