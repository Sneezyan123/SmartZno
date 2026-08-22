#!/usr/bin/env python3
"""Build h3-01 lesson JSON from Webinar 4 content."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEBINAR = Path(__file__).resolve().parent / "_webinar4.json"
OUT = ROOT / "content" / "history-nmt" / "lessons" / "h3-01.json"
IMG = "/history/h3-01"
MEHMED = "Джентile Белліні. Портрет султана Мехмеда II."

P = {p["page"]: p["text"] for p in json.loads(WEBINAR.read_text(encoding="utf-8"))}


def ws(s):
    return re.sub(r"\s+", " ", s.replace("\n", " ")).strip()


def body(page):
    lines = [ln.strip() for ln in P[page].splitlines() if ln.strip()]
    return ws(" ".join(lines[1:])) if len(lines) > 1 else ws(lines[0])


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
        opts.append((key, re.sub(r"\s+ВБГА$", "", ws(" ".join(lines)))))
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
        {"title": "01", "text": ws(" ".join(lines[1:4]))},
        {"title": "02", "text": ws(" ".join(lines[4:7]))},
        {"title": "03", "text": ws(" ".join(lines[7:10]))},
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
    return [
        {"title": "01", "content": "Визнав себе васалом польського короля, проте одноосібно володарював у Великому князівстві Литовському."},
        {"title": "02", "content": "Ліквідував найбільші удільні князівства (Київське, Новгород-Сіверське, Подільське) з метою посилення своєї влади."},
        {"title": "03", "content": "У 1399 р. зазнав поразки від тatar на rіchtsі Vorskla."},
        {"title": "04", "content": "Зmuшений vidnovyty Krevsku uniiu: pohodyvsia na povernennia Lytvy do Polshchi pislia svoiieï smerti."},
        {"title": "05", "content": "Stav odним iz переможціv u Hriunvaldskii bitvi."},
    ]


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


def page27_flips():
    return [
        {
            "front": "Кріпацтво",
            "back": "система суспільних відносин у добу феодалізму, яка проявлялася в особистій залежності кріпака від землевласника.",
            "sticker": "tl",
            "teaser": "Особиста залежність.",
        },
        {
            "front": "Пanщina",
            "back": "форма земельної відробіткової ренти власним реманентом на полі пана.",
            "sticker": "tr",
            "teaser": "Безкоштовна праця.",
        },
        {
            "front": "Фільvarok",
            "back": "велике шляхетське господарство, орієнтоване на ринок. Був багатопрофільним господарством, у якому вся земля належала панові і яке базувалося на праці селян, що відробляли panщину.",
            "sticker": "bl",
            "teaser": "Товарне господарство.",
        },
    ]


def page29_tiles():
    lines = [ln.strip() for ln in P[29].splitlines() if ln.strip()]
    return [
        {"title": "Патриціат", "text": ws(lines[1])},
        {"title": "Бюргери", "text": ws(lines[3])},
        {"title": "Плебс", "text": ws(lines[5])},
    ]


def page31_tiles():
    lines = [ln.strip() for ln in P[31].splitlines() if ln.strip()]
    return [
        {"title": "01", "text": ws(lines[2])},
        {"title": "02", "text": ws(lines[4])},
        {"title": "03", "text": ws(lines[6])},
    ]


def _homework():
    answers = ["Б", "Б", "Б", "В", "Б", "А"]
    expl = {
        38: "Магdeбurзьке правo — samovriaduvannia mist.",
        39: "Генuезька форteця v Sudaku.",
        40: "Panщina — obov'iazkova pratsia na poli pana.",
        41: "Yurii Drohobych — «Prohnostyk» 1483 r.",
        42: "Mukachivskyi zamok — Zakarpattia.",
        43: "1385 r. — umovy Krevskoi uniï.",
    }
    hw = []
    for i, page in enumerate([38, 39, 40, 41, 42, 43], 1):
        item = {
            "id": f"h3-01-h{i}",
            "type": "single",
            "prompt": quiz_prompt(page),
            "options": [{"key": k, "text": t} for k, t in quiz_opts(page)],
            "answer": answers[i - 1],
            "explanation": expl[page],
        }
        if page == 39:
            item["image"] = f"{IMG}/quiz-sudak-fortress.jpg"
            item["imageCaption"] = "Генuезька форteця."
        elif page == 42:
            item["image"] = f"{IMG}/quiz-mukachevo-castle.jpg"
            item["imageCaption"] = "Mukachivskyi zamok."
        hw.append(item)
    hw.append({
        "id": "h3-01-h7",
        "type": "sequence",
        "prompt": quiz_prompt(21),
        "items": [{"key": k, "text": t} for k, t in quiz_opts(21)],
        "answer": ["В", "Б", "Г", "А"],
        "explanation": "Sarmaty, pechenihy, polovtsi, krymski tatary.",
    })
    hw.append({
        "id": "h3-01-h8",
        "type": "single",
        "prompt": quiz_prompt(18),
        "image": f"{IMG}/map-quiz-lublin.jpg",
        "imageCaption": "Karta ukrainskykh zemel.",
        "options": [{"key": k, "text": t} for k, t in quiz_opts(18)],
        "answer": "В",
        "explanation": "Ukrainski zemli pislia Liublinskoi uniï 1569 r.",
    })
    return hw


def _load_sections():
    if not OUT.exists():
        return {"theory": [], "notes": [], "quizCards": []}
    prev = json.loads(OUT.read_text(encoding="utf-8"))
    return {
        "theory": prev.get("theory", []),
        "notes": prev.get("notes", []),
        "quizCards": prev.get("quizCards", []),
    }


def _patch_theory(theory, title):
    for block in theory:
        t = block.get("type")
        if t == "scene" and block.get("kicker") == "Тема 4. Вступ":
            block["content"] = (
                f"{title}. Литva, Polshcha, Uhorshchyna, Moskva, Krym i Osmanska imperiia. "
                "U konspekti - ta sama informatsiia, bez animatsii. Perevirka - u kvizi."
            )
        elif t == "scene" and "kicker" not in block:
            block["content"] = (
                "Temу proideno. U konspekti - daty, uniï ta sotsialnyi lad. Perevirka - u kvizi."
            )
        elif t == "tiles" and block.get("tiles") and block["tiles"][0].get("title") == "01":
            block["content"] = "Tri napriamy polityky"
            block["kicker"] = "Vidkryi plitku."
            block["tiles"] = page4_tiles()
        elif t == "list" and block.get("content") == "Khronolohiia pryiednannia":
            block["items"] = page6_items()
        elif t == "list" and block.get("content") == "Za uhodoiu Yahailo musiv":
            block["items"] = page7_yahailo()
        elif t == "list" and block.get("content") == "Henuetski faktoriї":
            block["items"] = page17_factories()
        elif t == "steps":
            block["steps"] = vitovt_steps()
        elif t == "flip-cards":
            block["flips"] = page27_flips()
        elif t == "tiles" and block.get("content") == "Mishchany":
            block["tiles"] = page29_tiles()
        elif t == "tiles" and "14-15" in block.get("content", ""):
            block["tiles"] = page31_tiles()
        elif t == "artifact" and "mehmed-ii-portrait" in block.get("image", ""):
            block["credit"] = MEHMED
    return theory


def build_lesson():
    title = ws(P[2].replace("Тема 4.", ""))
    sections = _load_sections()
    theory = _patch_theory(sections["theory"], title)
    return {
        "id": "h3-01",
        "moduleId": "h3",
        "title": title,
        "slug": "h3-01",
        "order": 1,
        "status": "ready",
        "objectives": [
            "Знати політику Польщі, Литви, Москви, Криму та Османів на ukrainskykh zemliakh",
            "Пояснити соціальний устрій, magdeburzke pravo й kультуру XIV–XV st.",
            "Відрізняти унії, ekspansії та dжerela z praktyky NMT",
        ],
        "nmtTags": ["удільні княzivstva", "Krevo", "Krym", "panщina"],
        "subtopics": [
            "Ruske voievodstvo", "1385", "Vitovt", "Khotyn", "Hirei",
            "panщina", "magdeburzke pravo", "Drohobych",
        ],
        "theory": theory,
        "notes": sections["notes"],
        "quizCards": sections["quizCards"],
        "homework": _homework(),
    }


def main():
    data = build_lesson()
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    parsed = json.loads(OUT.read_text(encoding="utf-8"))
    lines = len(OUT.read_text(encoding="utf-8").splitlines())
    print(f"Wrote {OUT.name} ({OUT.stat().st_size} bytes)")
    print(f"id {parsed['id']} theory {len(parsed['theory'])} hw {len(parsed['homework'])} cards {len(parsed['quizCards'])}")
    print(f"lines {lines}")


if __name__ == "__main__":
    main()
