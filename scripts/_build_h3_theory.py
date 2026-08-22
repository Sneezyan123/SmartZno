#!/usr/bin/env python3
"""Build theory JSON for h3-01."""
import json
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
page4_tiles = b.page4_tiles
page6_items = b.page6_items
page7_yahailo = b.page7_yahailo
vitovt_steps = b.vitovt_steps
page17_factories = b.page17_factories
page27_flips = b.page27_flips
page29_tiles = b.page29_tiles
page31_tiles = b.page31_tiles

MEHMED = "Джентile Белліні. Портрет султана Мехмеда II."


def theory():
    title = ws(P[2].replace("Тема 4.", ""))
    principle = "«Старого не рушимо, нового не вводимо»"
    p19 = quiz_opts(19)
    p20 = quiz_opts(20)
    p22 = quiz_opts(22)
    p19prompt = (
        "Прочитайте уривок джерела і виконайте завдання: "
        "«3 поданого до нас прохання цього короля ми недавно довідалися, що коли "
        "народ русинів за допомогою отрути вбив Болеслава, князя Русі…. тоді король, "
        "вражений цим злочином і прагнучи помститися за кривду християнської віри, "
        "напав на Руську землю, щоб завоювати цей народ, який і йому самому "
        "завдав багато шкоди...» Уриvok dokumentu daje zmozhu vyznachyty"
    )
    p19prompt = p19prompt.replace("Уриvok dokumentu daje zmozhu vyznachyty", "Уривок документа дає змогу визначити")
    p20prompt = (
        "«Народ же цей… спустошені землі заселяв своїми людьми й на знесилених "
        "русів владу свою поширив. І поволі з часом усю [землю руську] перейняв від "
        "татар у своє володіння й став володіти широкими її просторами, і баскаків, "
        "що збирали з неї данину для завolzskoho tsaria [khana], prohnav...» "
        "Який історичний процес проілюстровано в документі?"
    )
    p20prompt = p20prompt.replace("завolzskoho tsaria [khana], prohnav", "завolzskoho tsaria [khana], prohnav")
    p20prompt = (
        "«Народ же цей… спустошені землі заселяв своїми людьми й на знесилених "
        "русів владу свою поширив. І повolі з часом усю [землю руську] перейняв від "
        "татар у своє володіння й став володіти широкими її просторами, і баскаків, "
        "що збирали з неї данину для завolzskoho tsaria [khana], prohnav...» "
        "Який історичний процес проілюстровано в документі?"
    )

    return [
        {
            "type": "scene",
            "kicker": "Тема 4. Вступ",
            "image": f"{IMG}/map-lithuania-join.jpg",
            "content": (
                f"{title}. Литva, Polshcha, Uhorshchyna, Moskva, Krym i Osmanska imperiia. "
                "U konspekti - ta sama informatsiia, bez animatsii. Perevirka - u kvizi."
            ),
        },
    ]


def main():
    t = theory()
    out = Path(__file__).resolve().parent / "_h3_theory.json"
    out.write_text(json.dumps(t, ensure_ascii=False, indent=2), encoding="utf-8")
    print(len(t), "blocks ->", out.name)


if __name__ == "__main__":
    main()
