import fitz
import os

pdf = r"b:\downloads\Вебінар 4.pptx.pdf"
out = r"b:\smartZNO\SmartZno\public\history\h3-01\_extract"
os.makedirs(out, exist_ok=True)
doc = fitz.open(pdf)
print("pages", len(doc))
for i in range(len(doc)):
    imgs = doc[i].get_images(full=True)
    print(f"--- page {i+1}: {len(imgs)} images ---")
    for j, img in enumerate(imgs):
        xref = img[0]
        base = doc.extract_image(xref)
        ext = base["ext"]
        path = os.path.join(out, f"page{i+1}_img{j+1}.{ext}")
        with open(path, "wb") as f:
            f.write(base["image"])
        print(f"  img{j+1} {base['width']}x{base['height']} {ext}")
