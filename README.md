# YUE LEE — Portfolio (static, GitHub Pages ready)
Plain HTML/CSS/JS, no build step. Push this folder to a repo and enable Pages (root).

## Add images
1. Put raw files in a folder with one subfolder per category: `2d/`, `3d/`, `animation/`, `logo/`.
2. `pip install pillow` then `python3 build_gallery.py /path/to/raw` — images are resized to max 1600px (+600px thumbs in `thumbs/`), JPG unless transparent (PNG). MP4/WebM/GIF ≤20 MB are copied as-is.
3. Or drop already-optimized files into `images/<category>/` (+ `thumbs/` same name) and run `python3 build_gallery.py` with no args.
This regenerates `images.json` and `gallery-data.js` (what the page loads). Order = filename order.

External-only categories (Drive link cards) live in `links.js` / `app.js` (`LINKS`).
Category labels: `CATS` in `app.js` and `build_gallery.py`.
