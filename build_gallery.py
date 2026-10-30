#!/usr/bin/env python3
"""Optimize raw images into images/<category>/ and regenerate images.json.
Usage: python3 build_gallery.py [RAW_DIR]   (RAW_DIR has one subfolder per category slug)
Or just drop already-optimized files into images/<category>/ (name.jpg + thumbs/name.jpg) and run with no args."""
import json, os, sys, shutil
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).parent; IMG = ROOT / "images"
CATS = {"2d": "2D Artwork", "3d": "3D Portfolio", "anim": "Animation", "logo": "Game Logo Design"}
VID = {".mp4", ".webm", ".gif"}; MAXV = 20 * 1024 * 1024
def has_alpha(im):
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        a = im.convert("RGBA").getchannel("A"); return a.getextrema()[0] < 250
    return False
def optimize(src, dst_dir, stem):
    im = Image.open(src); im.load()
    alpha = has_alpha(im); ext = ".png" if alpha else ".jpg"
    im = im.convert("RGBA" if alpha else "RGB")
    out = []
    for w, d in ((1600, dst_dir), (600, dst_dir / "thumbs")):
        d.mkdir(parents=True, exist_ok=True); c = im.copy()
        if c.width > w: c = c.resize((w, round(c.height * w / c.width)), Image.LANCZOS)
        p = d / (stem + ext)
        if alpha: c.save(p, optimize=True)
        else: c.save(p, quality=84 if w > 600 else 78, optimize=True, progressive=True)
        out.append(p)
    return out
def ingest(raw):
    for slug in CATS:
        src = Path(raw) / slug
        if not src.exists(): continue
        dst = IMG / slug; n = 0
        for f in sorted(src.rglob("*")):
            if not f.is_file(): continue
            n += 1; stem = f"{slug}-{n:03d}"; e = f.suffix.lower()
            try:
                if e in VID:
                    if f.stat().st_size <= MAXV:
                        dst.mkdir(parents=True, exist_ok=True); shutil.copy(f, dst / (stem + e))
                    else: print("skip big video", f)
                else: optimize(f, dst, stem)
            except Exception as ex: print("skip", f, ex)
def index():
    items = []
    for slug, label in CATS.items():
        d = IMG / slug
        if not d.exists(): continue
        for f in sorted(d.iterdir()):
            if not f.is_file(): continue
            e = f.suffix.lower(); it = {"cat": slug, "src": f"images/{slug}/{f.name}", "title": label}
            if e in (".mp4", ".webm"):
                it["type"] = "video"
                for pe in (".jpg", ".png"):  # poster sits flat next to the video (same stem)
                    if (d / (f.stem + pe)).exists():
                        it["poster"] = f"images/{slug}/{f.stem}{pe}"
                        im = Image.open(d / (f.stem + pe)); it["w"], it["h"] = im.size; break
            elif any((d / (f.stem + ve)).exists() for ve in (".mp4", ".webm")): continue  # poster, not a gallery item
            else:
                t = d / "thumbs" / f.name
                it["thumb"] = f"images/{slug}/thumbs/{f.name}" if t.exists() else it["src"]
                im = Image.open(f); it["w"], it["h"] = im.size
            items.append(it)
    (ROOT / "images.json").write_text(json.dumps(items, indent=1))
    (ROOT / "gallery-data.js").write_text("window.GALLERY=" + json.dumps(items) + ";\n")
    print(len(items), "items")
if __name__ == "__main__":
    if len(sys.argv) > 1: ingest(sys.argv[1])
    index()
