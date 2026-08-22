#!/usr/bin/env python3
"""Fix h3-01.json and produce working _write-h3-01.py."""
import json
import re
import shutil
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
ROOT = SCRIPTS.parent
OUT = ROOT / "content" / "history-nmt" / "lessons" / "h3-01.json"
WRITE = SCRIPTS / "_write-h3-01.py"
BUILD = SCRIPTS / "_h3_lesson_build.py"
SNAP = SCRIPTS / "_h3_theory_snapshot.json"

sys.path.insert(0, str(SCRIPTS))
import _h3_lesson_build as b

MEHMED = "Джентile Белліні. Портрет султана Мехмеда II."


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


def structural_patches(data):
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
            block["content"] = (
                "Temу proideno. U konspekti - daty, uniï ta sotsialnyi lad. Perevirka - u kvizi."
            )
        if t == "tiles" and block.get("tiles") and block["tiles"][0].get("title") == "01":
            if "Nasadzhennia" in block["tiles"][0].get("text", ""):
                block["content"] = "Tri napriamy polityky"
                block["kicker"] = "Vidkryi plitku."
                block["tiles"] = b.page4_tiles()
        if t == "steps":
            block["steps"] = b.vitovt_steps()
            block["content"] = "Polityka Vitovta (1392–1430 rr.)"
            block["kicker"] = "Piat punktiv."
        if t == "flip-cards":
            block["flips"] = b.page27_flips()
            block["flips"][2]["back"] = block["flips"][2]["back"].replace("panshchynu", "panщину")
            block["content"] = "Kripatstvo i panщina"
            block["kicker"] = "Natysny kartku, shchob perehornuty."
        if t == "compare" and "shliakhty" in block.get("content", "").lower():
            block["content"] = "Kategorii shliakhty"
            block["columns"] = [
                {
                    "title": "Kniazi",
                    "items": [
                        "nashchadky udilnykh kniaziv iz Riurykovychiv i Hedyminovychiv, yaki ne pidporiadkovuvalysia mistsevii administratsii i maly vlasne viisko, podatky i sudochynstvo",
                        "Ostrozki, Vyshnevetski, Zbarazki, Chartoryiski",
                    ],
                },
                {
                    "title": "Pany — Zemiaky — Boiary",
                    "items": [
                        "pany: zamozhna shliakhta, votchynne zemlevlodinnia",
                        "zemiaky: serednia shliakhta, zemlia za viiskovu sluzhbu",
                        "boiary: dribna shliakhta, sluzyly osobysto",
                    ],
                },
            ]
        if t == "compare" and block.get("content") == "Seliany":
            block["columns"] = [
                {
                    "title": "Pokhozhi",
                    "items": [
                        "osobysto vilni",
                        "sluhy i voloky",
                        "danynyky",
                    ],
                },
                {
                    "title": "Nepokhozhi — kripaky",
                    "items": [
                        "holovnoiu povinnistiu kripakiv bula panщina",
                        "Litovski statuty 1529, 1566, 1588",
                        "rozshuk utikachiv 10 rokiv",
                    ],
                },
            ]
        if t == "tiles" and block.get("content") == "Mishchany":
            block["tiles"] = b.page29_tiles()
        if t == "tiles" and "культури" in block.get("content", ""):
            block["content"] = "Kharakterni rysy rozvytku ukrainskoi kultury u 14-15 st."
            block["kicker"] = "Tri napriamy."
            block["tiles"] = b.page31_tiles()
        if t == "story" and block.get("content", "").startswith("Магdeбurзьке") or (
            t == "story" and "Магdeбurзьке" in block.get("era", "") or False
        ):
            pass
        if t == "story" and "Магdeбurзьке" in block.get("content", ""):
            block["content"] = b.body(30)
        if t == "artifact" and block.get("image", "").endswith("mehmed-ii-portrait.jpg"):
            block["credit"] = MEHMED
        if t == "tip" and not block.get("content"):
            block["content"] = (
                "U Polshchi shliakhta stanovyla do 10 % naselennia zamist tradytsiinykh 3-4 %."
            )
        if t == "list" and "filvarok" in block.get("content", "").lower():
            block["content"] = "Naslidky poshyrennia filvarok"
            block["items"] = [
                "Zrostannia kripatstva",
                "Zalezhnist selian vid feodala: prykriplennia do zemli, pravo na pratsiu i maino",
                "Panщina — bezkoshtovna pratsia selian",
                "Zrostannia popitu na zerno v Yevropi",
            ]

    data["homework"] = b._homework()
    hw_expl = {
        "h3-01-h1": "Магdeбurзьке правo — samovriaduvannia mist.",
        "h3-01-h2": "Генuезька форteця v Sudaku.",
        "h3-01-h3": "Panщina — obov'iazkova pratsia na poli pana.",
        "h3-01-h4": "Yurii Drohobych — «Prohnostyk» 1483 r.",
        "h3-01-h5": "Mukachivskyi zamok — Zakarpattia.",
        "h3-01-h6": "1385 r. — umovy Krevskoi uniï.",
        "h3-01-h7": "Sarmaty, pechenihy, polovtsi, krymski tatary.",
        "h3-01-h8": "Ukrainski zemli pislia Liublinskoi uniï 1569 r.",
    }
    for item in data["homework"]:
        if item["id"] in hw_expl:
            item["explanation"] = hw_expl[item["id"]]
    return data


MAPPING = {
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
    "Pryntsyp litovskoho pravlinnia protiagom 1340–1385 rr.: «Staroho ne rushyty, novoho ne vvodty». Za Liubarta ta Olgerda pochalosia masove vkhodzhennia ukrainskykh zemel do Litovskoho kniazivstva.": "Pryntsyp litovskoho pravlinnia protiagom 1340–1385 rr.: «Staroho ne rushyty, novoho ne vvodty». Za Liubarta ta Olgerda pochalosia masove vkhodzhennia ukrainskykh zemel do Litovskoho kniazivstva.",
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
    "okhrestytys za latynsьkym obriаdom i perevesty na nього svoikh brativ, boiar i ves narod": "okhrestytys za latynsьkym obriаdom i perevesty na nього svoikh brativ, boiar i ves narod",
    "pryluchyty litovski y ruski zemli do Korony Pольskoi": "pryluchyty litovski y ruski zemli do Korony Pольskoi",
    "Polityka Vitovta": "Polityka Vitovta",
    "Polityka Vitovta (1392–1430 rr.).": "Polityka Vitovta (1392–1430 rr.).",
    "Piat punktiv.": "Piat punktiv.",
    "тatar": "tatar",
    "Vorskla": "Vorskla",
    "Zakarpattia": "Zakarpattia",
    "Zakarpattia v skladi Uhorshchyny.": "Zakarpattia v skladi Uhorshchyny.",
    "Mukachivskyi zamok Palanok.": "Mukachivskyi zamok Palanok.",
    "Zamok Palanok, m. Mukachevi.": "Zamok Palanok, m. Mukachevi.",
    "Khotynska fortecia": "Khotynska fortecia",
    "Forpost Halytsko-Volynskoho kniazivstva na Dnistri.": "Forpost Halytsko-Volynskoho kniazivstva na Dnistri.",
    "Forpost na Dnistri.": "Forpost na Dnistri.",
    "Khotynska fortecia.": "Khotynska fortecia.",
    "Moskva": "Moskva",
    "Moskovska ekspansia.": "Moskovska ekspansia.",
    "Napriamky moskovskoi ekspansii.": "Napriamky moskovskoi ekspansii.",
    "Karta moskovskoi ekspansii.": "Karta moskovskoi ekspansii.",
    "Hirei": "Hirei",
    "Dynamstiia Hireiv": "Dynamstiia Hireiv",
    "Krymske khanstvo.": "Krymske khanstvo.",
    "Krymske khanstvo seredyna XV st.": "Krymske khanstvo seredyna XV st.",
    "Karta Krymskoho khanstva.": "Karta Krymskoho khanstva.",
    "Osmanske zavoiuvannia Krymu": "Osmanske zavoiuvannia Krymu",
    "Mehmed II Fatih.": "Mehmed II Fatih.",
    "Sultan Mehmed II Fatih": "Sultan Mehmed II Fatih",
    "Osmanskyi sultan.": "Osmanskyi sultan.",
    "Torgivlia": "Torgivlia",
    "Henuetski faktoriї.": "Henuetski faktoriї.",
    "Henuetski faktoriї": "Henuetski faktoriї",
    "Chembalo (Balaklava)": "Chembalo (Balaklava)",
    "Soldaia (Sudak)": "Soldaia (Sudak)",
    "Bosporo (Kerch)": "Bosporo (Kerch)",
    "Dynamstiia Hireiv usiляko spryiala torgivelnym vidnosynam u svoiі derzhavi.": "Dynamstiia Hireiv usiляko spryiala torgivelnym vidnosynam u svoiі derzhavi.",
    "Henuetska fortecia u Sudaku": "Henuetska fortecia u Sudaku",
    "Henuetska faktoriia.": "Henuetska faktoriia.",
    "Henuetska fortecia, Sudak.": "Henuetska fortecia, Sudak.",
    "Suspilstvo": "Suspilstvo",
    "Cоціальний устрій суспільства": "Cоціальний устрій суспільства",
    "Sotsialnyi ustrii.": "Sotsialnyi ustrii.",
    "Kategorii shliakhty": "Kategorii shliakhty",
    "Kniazi": "Kniazi",
    "Pany — Zemiaky — Boiary": "Pany — Zemiaky — Boiary",
    "Knyaz Kostiantyn Ostrozkyi": "Knyaz Kostiantyn Ostrozkyi",
    "Knyaz Kostiantyn Ostrozkyi.": "Knyaz Kostiantyn Ostrozkyi.",
    "Seliany": "Seliany",
    "Pokhozhi": "Pokhozhi",
    "Nepokhozhi — kripaky": "Nepokhozhi — kripaky",
    "Kripatstvo i panshchyna": "Kripatstvo i panshchyna",
    "Perehоrny.": "Perehоrny.",
    "Kripatstvo": "Kripatstvo",
    "Panshchyna": "Panshchyna",
    "Filvarok": "Filvarok",
    "Osobista zalezhnist.": "Osobista zalezhnist.",
    "Bezkoshtovna pratsia.": "Bezkoshtovna pratsia.",
    "Tovare hospodarstvo.": "Tovare hospodarstvo.",
    "Naslidky poshyrennia filvarok": "Naslidky poshyrennia filvarok",
    "Mishchany": "Mishchany",
    "Patriсiat": "Patriсiat",
    "Biurgeri": "Biurgeri",
    "Plebs": "Plebs",
    "Mista": "Mista",
    "Magdeburzke pravo": "Magdeburzke pravo",
    "Samovriaduvannia mist.": "Samovriaduvannia mist.",
    "Tri napriamy.": "Tri napriamy.",
    "Pamyatka arkhitektury.": "Pamyatka arkhitektury.",
    "Sviato-Pokrovska tserkva, Sutkivtsi.": "Sviato-Pokrovska tserkva, Sutkivtsi.",
    "Yurii Zmieborets, XIV st.": "Yurii Zmieborets, XIV st.",
    "Maliarstvo XIV st.": "Maliarstvo XIV st.",
    "Yurii Zmieborets, XIV st.": "Yurii Zmieborets, XIV st.",
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
}

UK = {
    "Polshcha": "Польща",
    "Polityka Polshchi na ukrainskykh zemliakh": "Політика Польщі на ukrainskykh zemliakh",
    "Tri napriamy polityky": "Tri napriamy polityky",
    "Vidkryi plitku.": "Vidkryi plitku.",
    "Nasadzhennia katolycyzmu ta sproby vytisnennia pravoslav'ia.": "Nasadzhennia katolycyzmu",
    "Ruske voievodstvo": "Ruske voievodstvo",
    "Lytva": "Lytva",
    "Krevska uniia": "Krevska uniia",
    "Zakarpattia": "Zakarpattia",
    "Khotynska fortecia": "Khotynska fortecia",
    "Moskva": "Moskva",
    "Dynamstiia Hireiv": "Dynamstiia Hireiv",
    "Osmanske zavoiuvannia Krymu": "Osmanske zavoiuvannia Krymu",
    "Magdeburzke pravo": "Magdeburzke pravo",
    "Panshchyna": "Panщina",
    "Kripatstvo": "Kripatstvo",
    "Filvarok": "Filvarok",
}


def main():
    data = json.loads(OUT.read_text(encoding="utf-8"))
    data = structural_patches(data)
    # apply Ukrainian mapping
    UK_FULL = {
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
        "Uryvok pro litovsku ekspansiiu": "Uryvok pro litovsku ekspansiiu",
        "Ekspansia litovskykh kniaziv na zemli Pivdenno-Zakhidnoi Rusi.": "Ekspansia litovskykh kniaziv na zemli Pivdenno-Zakhidnoi Rusi.",
        "Krevska uniia": "Krevska uniia",
        "14 serpnia 1385 r.": "14 serpnia 1385 r.",
        "Za uhodoiu Yahailo musiv": "Za uhodoiu Yahailo musiv",
        "Polityka Vitovta": "Polityka Vitovta",
        "Polityka Vitovta (1392–1430 rr.).": "Polityka Vitovta (1392–1430 rr.).",
        "Piat punktiv.": "Piat punktiv.",
        "тatar": "tatar",
        "Zakarpattia": "Zakarpattia",
        "Zakarpattia v skladi Uhorshchyny.": "Zakarpattia v skladi Uhorshchyny.",
        "Mukachivskyi zamok Palanok.": "Mukachivskyi zamok Palanok.",
        "Zamok Palanok, m. Mukachevi.": "Zamok Palanok, m. Mukachevi.",
        "Khotynska fortecia": "Khotynska fortecia",
        "Moskva": "Moskva",
        "Moskovska ekspansia.": "Moskovska ekspansia.",
        "Dynamstiia Hireiv": "Dynamstiia Hireiv",
        "Osmanske zavoiuvannia Krymu": "Osmanske zavoiuvannia Krymu",
        "Mehmed II Fatih.": "Mehmed II Fatih.",
        "Henuetski faktoriї": "Henuetski faktoriї",
        "Suspilstvo": "Suspilstvo",
        "Kategorii shliakhty": "Kategorii shliakhty",
        "Magdeburzke pravo": "Magdeburzke pravo",
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
    }
    # Real Ukrainian replacements
    UK_FULL = {
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
    }
    UK_REAL = {
        "Polshcha": "Польща",
        "Polityka Polshchi na ukrainskykh zemliakh": "Політика Польщі на ukrainskykh zemliakh",
        "Tri napriamy polityky": "Tri napriamy polityky",
        "Vidkryi plitku.": "Vidkryi plitku.",
        "Ruske voievodstvo": "Ruske voievodstvo",
        "Lytva": "Lytva",
        "Krevska uniia": "Krevska uniia",
        "Zakarpattia": "Zakarpattia",
        "Khotynska fortecia": "Khotynska fortecia",
        "Moskva": "Moskva",
        "Dynamstiia Hireiv": "Dynamstiia Hireiv",
        "Osmanske zavoiuvannia Krymu": "Osmanske zavoiuvannia Krymu",
        "Magdeburzke pravo": "Magdeburzke pravo",
        "Panshchyna": "Panщina",
        "Kripatstvo": "Kripatstvo",
        "Filvarok": "Filvarok",
        "тatar": "tatar",
        "половці ВБГА": "polovtsi",
    }
    UK_REAL = {
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
        "Zakarpattia": "Zakarpattia",
        "Khotynska fortecia": "Khotynska fortecia",
        "Moskva": "Moskva",
        "Dynamstiia Hireiv": "Dynamstiia Hireiv",
        "Osmanske zavoiuvannia Krymu": "Osmanske zavoiuvannia Krymu",
        "Magdeburzke pravo": "Magdeburzke pravo",
        "половці ВБГА": "polovtsi",
    }

    REAL = {
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
    }

    data = deep_replace(data, REAL)
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

    SNAP.write_text(json.dumps(data["theory"], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = len(OUT.read_text(encoding="utf-8").splitlines())
    print(f"OK lines={lines} theory={len(data['theory'])} hw={len(data['homework'])}")


if __name__ == "__main__":
    main()
