#!/usr/bin/env python3
"""Generate complete _write-h3-01.py and h3-01.json."""
import json
import textwrap
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
ROOT = SCRIPTS.parent
WEBINAR = SCRIPTS / "_webinar4.json"
OUT = ROOT / "content" / "history-nmt" / "lessons" / "h3-01.json"
TARGET = SCRIPTS / "_write-h3-01.py"

P = {p["page"]: p["text"] for p in json.loads(WEBINAR.read_text(encoding="utf-8"))}


def build_and_write():
    import re

    IMG = "/history/h3-01"

    def ws(s):
        return re.sub(r"\s+", " ", s.replace("\n", " ")).strip()

    def body(page):
        lines = [ln.strip() for ln in P[page].splitlines() if ln.strip()]
        return ws(" ".join(lines[1:])) if len(lines) > 1 else ws(lines[0])

    def cp(content, prompt, options, answer, explanation, era=None):
        block = {
            "type": "checkpoint",
            "content": content,
            "checkpoint": {
                "prompt": prompt,
                "options": [{"key": k, "text": t} for k, t in options],
                "answer": answer,
                "explanation": explanation,
            },
        }
        if era:
            block["era"] = era
        return block

    def quiz_opts(page):
        opts, key, lines = [], None, []
        for ln in P[page].splitlines():
            ln = ln.strip()
            if not ln or ln == "ВБГА":
                continue
            m = re.match(r"^([АБВГ])\s+(.+)$", ln)
            if m:
                if key:
                    opts.append((key, ws(" ".join(lines))))
                key, lines = m.group(1), [m.group(2)]
            elif key:
                lines.append(ln)
        if key:
            text = re.sub(r"\s+ВБГА$", "", ws(" ".join(lines)))
            opts.append((key, text))
        return opts

    def quiz_prompt(page):
        q = []
        for ln in P[page].splitlines():
            ln = ln.strip()
            if not ln:
                continue
            if re.match(r"^[АБВГ]\s", ln):
                break
            q.append(ln)
        return ws(" ".join(q))

    def page4_tiles():
        lines = [ln.strip() for ln in P[4].splitlines() if ln.strip()]
        return [
            {"title": "01", "text": ws(lines[1])},
            {"title": "02", "text": ws(lines[4])},
            {"title": "03", "text": ws(lines[7])},
        ]

    def page6_items():
        items = []
        for ln in P[6].splitlines():
            ln = ln.strip().lstrip("•").strip()
            if re.match(r"^(1340|1355|1362|1361|Велике)", ln):
                items.append(ws(ln))
        return items

    def page7_yahailo():
        items = []
        for ln in P[7].split("За угодою")[1].splitlines():
            ln = ln.strip().lstrip("•").strip()
            if ln.startswith("охрестит") or ln.startswith("прилучити"):
                items.append(ws(ln))
        return items

    def vitovt_steps():
        chunks = re.split(r"\n0[1-5]\n", P[8])[1:]
        steps = [{"title": f"{i:02d}", "content": ws(c)} for i, c in enumerate(chunks, 1)]
        steps[2]["content"] = steps[2]["content"].replace("тatar", "татар")
        return steps

    def page17_factories():
        items, block = [], False
        for ln in P[17].splitlines():
            ln = ln.strip()
            if "Генуезькими факторіями також" in ln:
                block = True
                continue
            if block and ln and not ln.startswith("Генуезька"):
                if ln.startswith("("):
                    items[-1] += " " + ws(ln)
                else:
                    items.append(ws(ln))
        return items

    title = ws(P[2].replace("Тема 4.", ""))

    theory = [
        {
            "type": "scene",
            "kicker": "Тема 4. Вступ",
            "image": f"{IMG}/map-lithuania-join.jpg",
            "content": (
                f"{title}. Литва, Польща, Угорщина, Москва, Крим і Османська імперія. "
                "У конспекті - та сама інформація, без анімацій. Перевірка - у квізі."
            ),
        },
        {
            "type": "heading",
            "era": "poland",
            "kicker": "Польща",
            "content": "Політика Польщі на українських землях",
            "image": f"{IMG}/map-rus-voivodeship.jpg",
            "caption": "Галичина в складі Корони. Руське воєводство.",
        },
        {
            "type": "tiles",
            "era": "poland",
            "content": "Три напрями політики",
            "kicker": "Відкрий плитку.",
            "tiles": page4_tiles(),
        },
        {
            "type": "heading",
            "era": "poland",
            "kicker": "1434",
            "content": "Руське воєводство",
            "image": f"{IMG}/map-rus-voivodeship.jpg",
            "caption": "Центр - Львів. Сеймики, посли, voєвoda ruskyi.",
        },
    ]

    print("partial", len(theory))

    data = {"id": "h3-01", "title": title, "theory_count": len(theory)}
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return data


if __name__ == "__main__":
    r = build_and_write()
    print(r)
