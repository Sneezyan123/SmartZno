# -*- coding: utf-8 -*-
import json
import shutil
from pathlib import Path

root = Path(r"b:\smartZNO\SmartZno")
src = json.loads((root / "content/history-nmt/lessons/h1-01.json").read_text(encoding="utf-8"))

iron_at = next(
    i for i, b in enumerate(src["theory"])
    if b.get("type") == "heading" and b.get("content") == "Залізний вік"
)
nomad_notes_at = next(
    i for i, b in enumerate(src["notes"])
    if b.get("type") == "heading" and "Кочові" in b.get("content", "")
)

img_dir = root / "public/history"
(img_dir / "h1-02").mkdir(parents=True, exist_ok=True)
for name in [
    "hero-cimmerian.jpg", "hero-scythian.jpg", "hero-greek.jpg",
    "hero-sarmatian.jpg", "hero-slavic.jpg", "pectoral.jpg",
    "scythian-comb.jpg", "map-slavic-migration.png", "darius.jpg",
]:
    a = img_dir / "h1-01" / name
    b = img_dir / "h1-02" / name
    if a.exists() and not b.exists():
        shutil.copy2(a, b)

def retarget(obj):
    if isinstance(obj, dict):
        return {k: retarget(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [retarget(v) for v in obj]
    if isinstance(obj, str):
        return obj.replace("/history/h1-01/", "/history/h1-02/").replace("h1-01-", "h1-02-")
    return obj

theory = retarget(src["theory"][iron_at:])
theory.insert(0, {
    "type": "scene",
    "kicker": "Тема 1. Продовження",
    "image": "/history/h1-02/hero-cimmerian.jpg",
    "content": "Від заліза до слов'ян. Кочовики степу, грецькі поліси, перші згадки слов'ян. У конспекті - та сама інформація, без анімацій. Перевірка - у квізі.",
})
# drop the old closing scene if present at end; we'll add a new one
if theory[-1].get("type") == "scene":
    theory[-1] = {
        "type": "scene",
        "content": "Тему про кочовиків, поліси і слов'ян пройдено. У конспекті - та сама інформація, без анімацій. Перевірка - у квізі.",
    }

notes = retarget(src["notes"][nomad_notes_at:])
quiz = retarget([c for c in src["quizCards"] if c["id"] not in {
    "h1-01-c01", "h1-01-c02", "h1-01-c03", "h1-01-c04",
    "h1-01-c05", "h1-01-c06", "h1-01-c07",
}])
homework = retarget([h for h in src["homework"] if h["id"] in {
    "h1-01-h4", "h1-01-h5", "h1-01-h6", "h1-01-h7",
}])

out = {
    "id": "h1-02",
    "moduleId": "h1",
    "title": "Кочовики, античні поліси і слов'яни",
    "slug": "h1-02",
    "order": 2,
    "status": "ready",
    "objectives": [
        "Пройти залізний вік від кіммерійців до слов'ян",
        "Мати під рукою конспект для повторення",
        "Закріпити все в квізі",
    ],
    "nmtTags": ["стародавня історія", "кіммерійці", "скіфи", "античні поліси", "слов'яни"],
    "subtopics": [
        "кіммерійці", "скіфи", "грецькі поліси", "сармати", "слов'яни",
    ],
    "theory": theory,
    "notes": notes,
    "quizCards": quiz,
    "homework": homework,
}

path = root / "content/history-nmt/lessons/h1-02.json"
path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("h1-02 theory", len(theory), "notes", len(notes), "cards", len(quiz), "hw", len(homework))
