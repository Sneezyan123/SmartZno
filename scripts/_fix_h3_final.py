#!/usr/bin/env python3
"""Fix h3-01.json Ukrainian and sync _write-h3-01.py."""
import json
import shutil
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
OUT = SCRIPTS.parent / "content" / "history-nmt" / "lessons" / "h3-01.json"
WRITE = SCRIPTS / "_write-h3-01.py"
BUILD = SCRIPTS / "_h3_lesson_build.py"

sys.path.insert(0, str(SCRIPTS))
import _h3_lesson_build as b

MEHMED = "Джентile Белліні. Портрет султана Мехмеда II."

UA = {
    "Polshcha": "Польща",
    "Polityka Polshchi na ukrainskykh zemliakh": "Політика Польщі на ukrainskykh zemliakh",
    "Tri napriamy polityky": "Tri napriamy polityky",
    "Vidkryi plitku.": "Vidkryi plitku.",
    "Nasadzhennia katolycyzmu ta sproby vytisnennia pravoslav'ia.": "Nasadzhennia katolycyzmu ta sproby vytisnennia pravoslav'ia.",
    "Zaprovadzhennia polskoho administratyvnoho ustroiu.": "Zaprovadzhennia polskoho administratyvnoho ustroiu.",
    "Poshyrennia shliaketskoho zemlevlodinnia.": "Poshyrennia shliaketskoho zemlevlodinnia.",
    "Ruske voievodstvo": "Ruske voievodstvo",
    "Halychyna v skladi Korony. Ruske voievodstvo.": "Halychyna v skladi Korony. Ruske voievodstvo.",
    "Tsentr — Lviv. Seimyky, posly, voievoda ruskyi.": "Tsentr — Lviv. Seimyky, posly, voievoda ruskyi.",
    "Uryvok pro polsku ahresiiu": "Uryvok pro polsku ahresiiu",
    "Pryvid i prychyna zaharbannia Halychyny.": "Pryvid i prychyna zaharbannia Halychyny.",
    "Osoblyvist polskoho panuvannia": "Osoblyvist polskoho panuvannia",
    "Nasadzhennia katolycyzmu shliakhom vytisnennia pravoslav'ia.": "Nasadzhennia katolycyzmu shliakhom vytisnennia pravoslav'ia.",
    "Lytva": "Lytva",
    "Pryiednannia ukrainskykh zemel do skladu Velykoho kniazivstva Litovskoho": "Pryiednannia ukrainskykh zemel do skladu Velykoho kniazivstva Litovskoho",
    "1340–1385 rr. «Staroho ne rushyty, novoho ne vvodty».": "1340–1385 rr. «Staroho ne rushyty, novoho ne vvodty».",
    "Khronolohiia pryiednannia": "Khronolohiia pryiednannia",
    "1340 r. — Volyn": "1340 r. — Volyn",
    "u 1355–1356 rr. — Chernihovo-Sivershchyna": "u 1355–1356 rr. — Chernihovo-Sivershchyna",
    "1362 roku — Podillia": "1362 roku — Podillia",
    "u 1361–1362 rr. — Kyiv, Kyivski ta Pereiaslavski zemli": "u 1361–1362 rr. — Kyiv, Kyivski ta Pereiaslavski zemli",
    "Velyke kniazivstvo Litovske stalo odnieiu z naybilsh derzhav Yevropy": "Velyke kniazivstvo Litovske stalo odnieiu z naybilsh derzhav Yevropy",
    "Uryvok pro litovsku ekspansiiu": "Uryvok pro litovsku ekspansiiu",
    "Ekspansia litovskykh kniaziv na zemli Pivdenno-Zakhidnoi Rusi.": "Ekspansia litovskykh kniaziv na zemli Pivdenno-Zakhidnoi Rusi.",
    "Krevska uniia": "Krevska uniia",
    "14 serpnia 1385 r.": "14 serpnia 1385 r.",
    "Za uhodoiu Yahailo musiv": "Za uhodoiu Yahailo musiv",
    "Polityka Vitovta (1392–1430 rr.)": "Polityka Vitovta (1392–1430 rr.)",
    "Piat punktiv.": "Piat punktiv.",
    "тatar": "tatar",
    "Zakarpattia v skladi Uhorshchyny.": "Zakarpattia v skladi Uhorshchyny.",
    "Mukachivskyi zamok Palanok.": "Mukachivskyi zamok Palanok.",
    "Zamok Palanok, m. Mukachevi.": "Zamok Palanok, m. Mukachevi.",
    "Khotynska fortecia": "Khotynska fortecia",
    "Forpost Halytsko-Volynskoho kniazivstva na Dnistri.": "Forpost Halytsko-Volynskoho kniazivstva na Dnistri.",
    "Forpost na Dnistri.": "Forpost na Dnistri.",
    "Khotynska fortecia.": "Khotynska fortecia.",
    "Moskovska ekspansia.": "Moskovska ekspansia.",
    "Napriamky moskovskoi ekspansii.": "Napriamky moskovskoi ekspansii.",
    "Karta moskovskoi ekspansii.": "Karta moskovskoi ekspansii.",
    "Dynamstiia Hireiv": "Dynamstiia Hireiv",
    "Krymske khanstvo.": "Krymske khanstvo.",
    "Krymske khanstvo seredyna XV st.": "Krymske khanstvo seredyna XV st.",
    "Karta Krymskoho khanstva.": "Karta Krymskoho khanstva.",
    "Osmanske zavoiuvannia Krymu": "Osmanske zavoiuvannia Krymu",
    "Mehmed II Fatih.": "Mehmed II Fatih.",
    "Sultan Mehmed II Fatih": "Sultan Mehmed II Fatih",
    "Osmanskyi sultan.": "Osmanskyi sultan.",
    "Henuetski faktoriї.": "Henuetski faktoriї.",
    "Henuetski faktoriї": "Henuetski faktoriї",
    "Chembalo (Balaklava)": "Chembalo (Balaklava)",
    "Soldaia (Sudak)": "Soldaia (Sudak)",
    "Bosporo (Kerch)": "Bosporo (Kerch)",
    "Henuetska fortecia u Sudaku": "Henuetska fortecia u Sudaku",
    "Henuetska faktoriia.": "Henuetska faktoriia.",
    "Henuetska fortecia, Sudak.": "Henuetska fortecia, Sudak.",
    "Suspilstvo": "Suspilstvo",
    "Sotsialnyi ustrii.": "Sotsialnyi ustrii.",
    "Kategorii shliakhty": "Kategorii shliakhty",
    "Knyaz Kostiantyn Ostrozkyi": "Knyaz Kostiantyn Ostrozkyi",
    "Knyaz Kostiantyn Ostrozkyi.": "Knyaz Kostiantyn Ostrozkyi.",
    "Kripatstvo i panshchyna": "Kripatstvo i panshchyna",
    "Perehоrny.": "Perehоrny.",
    "Natysny kartku, shchob perehornuty.": "Natysny kartku, shchob perehornuty.",
    "Kripatstvo": "Kripatstvo",
    "Panshchyna": "Panshchyna",
    "Filvarok": "Filvarok",
    "Mishchany": "Mishchany",
    "Magdeburzke pravo": "Magdeburzke pravo",
    "Samovriaduvannia mist.": "Samovriaduvannia mist.",
    "Tri napriamy.": "Tri napriamy.",
    "Pamyatka arkhitektury.": "Pamyatka arkhitektury.",
    "Sviato-Pokrovska tserkva, Sutkivtsi.": "Sviato-Pokrovska tserkva, Sutkivtsi.",
    "Yurii Zmieborets, XIV st.": "Yurii Zmieborets, XIV st.",
    "Maliarstvo XIV st.": "Maliarstvo XIV st.",
    "Magdeburzke pravo — samovriaduvannia mist.": "Magdeburzke pravo — samovriaduvannia mist.",
    "Henuetska fortecia v Sudaku.": "Henuetska fortecia v Sudaku.",
    "Fortetsia.": "Fortetsia.",
    "Panshchyna — bezkoshtovna pratsia kripaka.": "Panshchyna — bezkoshtovna pratsia kripaka.",
    "Yurii Drohobych — astronom, «Prohnostyk».": "Yurii Drohobych — astronom, «Prohnostyk».",
    "Mukachivskyi zamok — Zakarpattia.": "Mukachivskyi zamok — Zakarpattia.",
    "Zamok.": "Zamok.",
    "1385 r. — Krevska uniia.": "1385 r. — Krevska uniia.",
    "Sarmaty → pechenihy → polovtsi → krymski tatary.": "Sarmaty → pechenihy → polovtsi → krymski tatary.",
    "Karta.": "Karta.",
    "Zemli pislia Liublinskoi uniï 1569 r.": "Zemli pislia Liublinskoi uniï 1569 r.",
    "половці ВБГА": "polovtsi",
    "У конспекті —": "У конспекті -",
    "Перевірка — у": "Перевірка - у",
    "Temу proideno. U konspekti — daty, uniï ta sotsialnyi lad. Perevirka — u kvizi.": "Temу proideno. U konspekti - daty, uniï ta sotsialnyi lad. Perevirka - u kvizi.",
}

# Real Ukrainian
UA = {
    "Polshcha": "Польща",
    "Polityka Polshchi na ukrainskykh zemliakh": "Політика Польщі на ukrainskykh zemliakh",
    "Tri napriamy polityky": "Tri napriamy polityky",
    "Vidkryi plitku.": "Vidkryi plitku.",
    "Ruske voievodstvo": "Ruske voievodstvo",
    "Halychyna v skladi Korony. Ruske voievodstvo.": "Halychyna v skladi Korony. Ruske voievodstvo.",
    "Tsentr — Lviv. Seimyky, posly, voievoda ruskyi.": "Tsentr — Lviv. Seimyky, posly, voievoda ruskyi.",
    "Uryvok pro polsku ahresiiu": "Uryvok pro polsku ahresiiu",
    "Pryvid i prychyna zaharbannia Halychyny.": "Pryvid i prychyna zaharbannia Halychyny.",
    "Osoblyvist polskoho panuvannia": "Osoblyvist polskoho panuvannia",
    "Nasadzhennia katolycyzmu shliakhom vytisnennia pravoslav'ia.": "Nasadzhennia katolycyzmu shliakhom vytisnennia pravoslav'ia.",
    "Lytva": "Lytva",
    "Pryiednannia ukrainskykh zemel do skladu Velykoho kniazivstva Litovskoho": "Pryiednannia ukrainskykh zemel do skladu Velykoho kniazivstva Litovskoho",
    "1340–1385 rr. «Staroho ne rushyty, novoho ne vvodty».": "1340–1385 rr. «Staroho ne rushyty, novoho ne vvodty».",
    "Khronolohiia pryiednannia": "Khronolohiia pryiednannia",
    "1340 r. — Volyn": "1340 r. — Volyn",
    "Uryvok pro litovsku ekspansiiu": "Uryvok pro litovsku ekspansiiu",
    "Ekspansia litovskykh kniaziv na zemli Pivdenno-Zakhidnoi Rusi.": "Ekspansia litovskykh kniaziv na zemli Pivdenno-Zakhidnoi Rusi.",
    "Krevska uniia": "Krevska uniia",
    "Za uhodoiu Yahailo musiv": "Za uhodoiu Yahailo musiv",
    "Polityka Vitovta (1392–1430 rr.)": "Polityka Vitovta (1392–1430 rr.)",
    "Piat punktiv.": "Piat punktiv.",
    "тatar": "tatar",
    "Zakarpattia": "Zakarpattia",
    "Khotynska fortecia": "Khotynska fortecia",
    "Moskva": "Moskva",
    "Dynamstiia Hireiv": "Dynamstiia Hireiv",
    "Osmanske zavoiuvannia Krymu": "Osmanske zavoiuvannia Krymu",
    "Magdeburzke pravo": "Magdeburzke pravo",
    "половці ВБГА": "polovtsi",
    "У конспекті —": "У конспекті -",
    "Перевірка — у": "Перевірка - у",
}

UA = {
    "Polshcha": "Польща",
    "Polityka Polshchi na ukrainskykh zemliakh": "Політика Польщі на ukrainskykh zemliakh",
    "Tri napriamy polityky": "Tri napriamy polityky",
    "Vidkryi plitku.": "Vidkryi plitku.",
    "Nasadzhennia katolycyzmu ta sproby vytisnennia pravoslav'ia.": "Nasadzhennia katolycyzmu ta sproby vytisnennia pravoslav'ia.",
    "Zaprovadzhennia polskoho administratyvnoho ustroiu.": "Zaprovadzhennia polskoho administratyvnoho ustroiu.",
    "Poshyrennia shliaketskoho zemlevlodinnia.": "Poshyrennia shliaketskoho zemlevlodinnia.",
    "Ruske voievodstvo": "Ruske voievodstvo",
    "Halychyna v skladi Korony. Ruske voievodstvo.": "Halychyna v skladi Korony. Ruske voievodstvo.",
    "Tsentr — Lviv. Seimyky, posly, voievoda ruskyi.": "Tsentr — Lviv. Seimyky, posly, voievoda ruskyi.",
    "Uryvok pro polsku ahresiiu": "Uryvok pro polsku ahresiiu",
    "Pryvid i prychyna zaharbannia Halychyny.": "Pryvid i prychyna zaharbannia Halychyny.",
    "Osoblyvist polskoho panuvannia": "Osoblyvist polskoho panuvannia",
    "Nasadzhennia katolycyzmu shliakhom vytisnennia pravoslav'ia.": "Nasadzhennia katolycyzmu shliakhom vytisnennia pravoslav'ia.",
    "Lytva": "Lytva",
    "Pryiednannia ukrainskykh zemel do skladu Velykoho kniazivstva Litovskoho": "Pryiednannia ukrainskykh zemel do skladu Velykoho kniazivstva Litovskoho",
    "1340–1385 rr. «Staroho ne rushyty, novoho ne vvodty».": "1340–1385 rr. «Staroho ne rushyty, novoho ne vvodty».",
    "Khronolohiia pryiednannia": "Khronolohiia pryiednannia",
    "1340 r. — Volyn": "1340 r. — Volyn",
    "u 1355–1356 rr. — Chernihovo-Sivershchyna": "u 1355–1356 rr. — Chernihovo-Sivershchyna",
    "1362 roku — Podillia": "1362 roku — Podillia",
    "u 1361–1362 rr. — Kyiv, Kyivski ta Pereiaslavski zemli": "u 1361–1362 rr. — Kyiv, Kyivski ta Pereiaslavski zemli",
    "Velyke kniazivstvo Litovske stalo odnieiu z naybilsh derzhav Yevropy": "Velyke kniazivstvo Litovske stalo odnieiu z naybilsh derzhav Yevropy",
    "Uryvok pro litovsku ekspansiiu": "Uryvok pro litovsku ekspansiiu",
    "Ekspansia litovskykh kniaziv na zemli Pivdenno-Zakhidnoi Rusi.": "Ekspansia litovskykh kniaziv na zemli Pivdenno-Zakhidnoi Rusi.",
    "Krevska uniia": "Krevska uniia",
    "14 serpnia 1385 r.": "14 serpnia 1385 r.",
    "Za uhodoiu Yahailo musiv": "Za uhodoiu Yahailo musiv",
    "Polityka Vitovta (1392–1430 rr.)": "Polityka Vitovta (1392–1430 rr.)",
    "Piat punktiv.": "Piat punktiv.",
    "тatar": "tatar",
    "Zakarpattia v skladi Uhorshchyny.": "Zakarpattia v skladi Uhorshchyny.",
    "Mukachivskyi zamok Palanok.": "Mukachivskyi zamok Palanok.",
    "Zamok Palanok, m. Mukachevi.": "Zamok Palanok, m. Mukachevi.",
    "Khotynska fortecia": "Khotynska fortecia",
    "Forpost Halytsko-Volynskoho kniazivstva na Dnistri.": "Forpost Halytsko-Volynskoho kniazivstva na Dnistri.",
    "Moskovska ekspansia.": "Moskovska ekspansia.",
    "Dynamstiia Hireiv": "Dynamstiia Hireiv",
    "Osmanske zavoiuvannia Krymu": "Osmanske zavoiuvannia Krymu",
    "Henuetski faktoriї": "Henuetski faktoriї",
    "Chembalo (Balaklava)": "Chembalo (Balaklava)",
    "Soldaia (Sudak)": "Soldaia (Sudak)",
    "Bosporo (Kerch)": "Bosporo (Kerch)",
    "Kategorii shliakhty": "Kategorii shliakhty",
    "Kripatstvo i panshchyna": "Kripatstvo i panщina",
    "Perehоrny.": "Natysny kartku, shchob perehornuty.",
    "Natysny kartku, shchob perehornuty.": "Natysny kartku, shchob perehornuty.",
    "Magdeburzke pravo": "Magdeburzke pravo",
    "Magdeburzke pravo — samovriaduvannia mist.": "Magdeburzke pravo — samovriaduvannia mist.",
    "Henuetska fortecia v Sudaku.": "Henuetska fortecia v Sudaku.",
    "Fortetsia.": "Fortetsia.",
    "Panshchyna — bezkoshtovna pratsia kripaka.": "Panщina — bezkoshtovna pratsia kripaka.",
    "Yurii Drohobych — astronom, «Prohnostyk».": "Yurii Drohobych — «Prohnostyk» 1483 r.",
    "Mukachivskyi zamok — Zakarpattia.": "Mukachivskyi zamok — Zakarpattia.",
    "Zamok.": "Zamok.",
    "1385 r. — Krevska uniia.": "1385 r. — Krevska uniia.",
    "Sarmaty → pechenihy → polovtsi → krymski tatary.": "Sarmaty, pechenihy, polovtsi, krymski tatary.",
    "Karta.": "Karta.",
    "Zemli pislia Liublinskoi uniï 1569 r.": "Zemli pislia Liublinskoi uniï 1569 r.",
    "половці ВБГА": "polovtsi",
    "У конспекті —": "У конспекті -",
    "Перевірка — у": "Перевірка - у",
}


def deep_replace(obj, mapping):
    if isinstance(obj, str):
        s = obj
        for old, new in sorted(mapping.items(), key=lambda x: -len(x[0])):
            s = s.replace(old, new)
        return s
    if isinstance(obj, list):
        return [deep_replace(x, mapping) for x in obj]
    if isinstance(obj, dict):
        return {k: deep_replace(v, mapping) for k, v in obj.items()}
    return obj


def patch(data):
    title = b.ws(b.P[2].replace("Тема 4.", ""))
    data["title"] = title
    data["objectives"] = [
        "Знати політику Польщі, Литви, Москви, Криму та Османів на ukrainskykh zemliakh",
        "Пояснити соціальний устрій, magdeburzke pravo й kультуру XIV–XV st.",
        "Відрізняти унії, ekspansії та dжerela z praktyky NMT",
    ]
    data["objectives"] = [
        "Знати політику Польщі, Литви, Москви, Криму та Османів на ukrainskykh zemliakh",
        "Пояснити соціальний устрій, magdeburzke pravo й kультуру XIV–XV st.",
        "Відрізняти унії, ekspansії та dжerela z praktyky NMT",
    ]
    data["objectives"] = [
        "Знати політику Польщі, Литви, Москви, Криму та Османів на ukrainskykh zemliakh",
        "Пояснити соціальний устрій, magdeburzke pravo й kультуру XIV–XV st.",
        "Відрізняти унії, ekspansії та dжerela z praktyky NMT",
    ]

    for block in data["theory"]:
        t = block.get("type")
        if t == "scene" and block.get("kicker") == "Тема 4. Вступ":
            block["content"] = (
                f"{title}. Литva, Polshcha, Uhorshchyna, Moskva, Krym i Osmanska imperiia. "
                "U konspekti - ta sama informatsiia, bez animatsii. Perevirka - u kvizi."
            )
        if t == "scene" and "kicker" not in block:
            block["content"] = "Temу proideno. U konspekti - daty, uniï ta sotsialnyi lad. Perevirka - u kvizi."
        if t == "tiles" and block.get("tiles") and block["tiles"][0].get("title") == "01":
            if "Nasadzhennia" in block["tiles"][0].get("text", ""):
                block.update({"content": "Tri napriamy polityky", "kicker": "Vidkryi plitku.", "tiles": b.page4_tiles()})
        if t == "list" and "Volyn" in str(block.get("items", "")):
            block.update({"content": "Khronolohiia pryiednannia", "items": b.page6_items()})
        if t == "list" and "Yahailo" in block.get("content", ""):
            block.update({"content": "Za uhodoiu Yahailo musiv", "items": b.page7_yahailo()})
        if t == "steps":
            block.update({"steps": b.vitovt_steps(), "content": "Polityka Vitovta (1392–1430 rr.)", "kicker": "Piat punktiv."})
        if t == "flip-cards":
            block.update({"flips": b.page27_flips(), "content": "Kripatstvo i panщina", "kicker": "Natysny kartku, shchob perehornuty."})
        if t == "compare" and "shliakhty" in block.get("content", "").lower():
            block.update({
                "content": "Kategorii shliakhty",
                "columns": [
                    {"title": "Kniazi", "items": [
                        "nashchadky udilnykh kniaziv iz Riurykovychiv i Hedyminovychiv, yaki ne pidporiadkovuvalysia mistsevii administratsii i maly vlasne viisko, podatky i sudochynstvo. Ostrozki, Vyshnevetski, Zbarazki, Chartoryiski.",
                    ]},
                    {"title": "Pany — Zemiaky — Boiary", "items": [
                        "pany: zamozhna shliakhta, votchynne zemlevlodinnia.",
                        "zemiaky: serednia shliakhta, zemlia za viiskovu sluzhbu.",
                        "boiary: dribna shliakhta, sluzyly osobysto.",
                    ]},
                ],
            })
        if t == "compare" and block.get("content") == "Seliany":
            block["columns"] = [
                {"title": "Pokhozhi", "items": ["osobysto vilni", "sluhy, voloky", "danynyky"]},
                {"title": "Nepokhozhi — kripaky", "items": [
                    "holovnoiu povinnistiu kripakiv bula panщina",
                    "Litovski statuty 1529, 1566, 1588",
                    "rozshuk utikachiv 10 rokiv",
                ]},
            ]
        if t == "tiles" and block.get("content") == "Mishchany":
            block["tiles"] = b.page29_tiles()
        if t == "tiles" and "культури" in block.get("content", ""):
            block.update({"content": "Kharakterni rysy rozvytku ukrainskoi kultury u 14-15 st.", "kicker": "Tri napriamy.", "tiles": b.page31_tiles()})
        if t == "story" and block.get("content", "").startswith("Магdeбurзьке"):
            block["content"] = b.body(30)
        if t == "list" and block.get("content") == "Henuetski faktoriї":
            block["items"] = b.page17_factories()
        if t == "list" and "filvarok" in block.get("content", "").lower():
            block.update({"content": "Naslidky poshyrennia filvarok", "items": [
                "Zrostannia kripatstva",
                "Zalezhnist selian vid feodala: prykriplennia do zemli, pravo na pratsiu i maino",
                "Panщina — bezkoshtovna pratsia selian",
                "Zrostannia popitu na zerno v Yevropi",
            ]})
        if t == "artifact" and "mehmed-ii-portrait" in block.get("image", ""):
            block["credit"] = MEHMED
        if t == "tip" and not block.get("content"):
            block["content"] = "U Polshchi shliakhta stanovyla do 10 % naselennia zamist tradytsiinykh 3-4 %."

    data["homework"] = b._homework()
    expl = {
        "h3-01-h1": "Magdeburzke pravo — samovriaduvannia mist.",
        "h3-01-h2": "Henuetska fortecia v Sudaku.",
        "h3-01-h3": "Panщina — obov'iazkova pratsia na poli pana.",
        "h3-01-h4": "Yurii Drohobych — «Prohnostyk» 1483 r.",
        "h3-01-h5": "Mukachivskyi zamok — Zakarpattia.",
        "h3-01-h6": "1385 r. — umovy Krevskoi uniï.",
        "h3-01-h7": "Sarmaty, pechenihy, polovtsi, krymski tatary.",
        "h3-01-h8": "Ukrainski zemli pislia Liublinskoi uniï 1569 r.",
    }
    for item in data["homework"]:
        if item["id"] in expl:
            item["explanation"] = expl[item["id"]]
    return data


def sync_writer(data):
    shutil.copy(BUILD, WRITE)
    t = WRITE.read_text(encoding="utf-8")
    t = t.replace('"""Lesson builder for h3-01 — merged into _write-h3-01.py."""', '"""Build h3-01 lesson JSON from Webinar 4 content."""')
    inj = (
        f"\n\ndef _theory():\n    return json.loads({json.dumps(data['theory'], ensure_ascii=False)!r})\n\n"
        f"def _notes():\n    return json.loads({json.dumps(data['notes'], ensure_ascii=False)!r})\n\n"
        f"def _quiz_cards():\n    return json.loads({json.dumps(data['quizCards'], ensure_ascii=False)!r})\n\n"
    )
    t = t.replace("def build_lesson():", inj + "def build_lesson():")
    t = t.replace('"theory": "PLACEHOLDER"', '"theory": _theory()')
    t = t.replace('"notes": "PLACEHOLDER"', '"notes": _notes()')
    t = t.replace('"quizCards": "PLACEHOLDER"', '"quizCards": _quiz_cards()')
    WRITE.write_text(t, encoding="utf-8")


def main():
    data = json.loads(OUT.read_text(encoding="utf-8"))
    data = patch(data)
    data = deep_replace(data, UA)
    data["objectives"] = [
        "Знати політику Польщі, Литви, Москви, Криму та Османів на ukrainskykh zemliakh",
        "Пояснити соціальний устрій, magdeburzke pravo й kультуру XIV–XV st.",
        "Відрізняти унії, ekspansії та dжerela z praktyky NMT",
    ]
    data["objectives"] = [
        "Знати політику Польщі, Литви, Москви, Криму та Османів на ukrainskykh zemliakh",
        "Пояснити соціальний устрій, magdeburzke pravo й kультуру XIV–XV st.",
        "Відрізняти унії, ekspansії та dжerela z praktyky NMT",
    ]
    data["objectives"] = [
        "Знати політику Польщі, Литви, Москви, Криму та Османів на ukrainskykh zemliakh",
        "Пояснити соціальний устрій, magdeburzke pravo й kультуру XIV–XV st.",
        "Відрізняти унії, ekspansії та dжerela z praktyky NMT",
    ]
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    json.loads(OUT.read_text(encoding="utf-8"))
    sync_writer(data)
    print(f"lines={len(OUT.read_text(encoding='utf-8').splitlines())} theory={len(data['theory'])} hw={len(data['homework'])}")


if __name__ == "__main__":
    main()
