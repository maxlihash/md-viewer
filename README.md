# MD Viewer

Online Markdown viewer — open .md files in your browser. Free, private, no upload.

Built for HarmonyOS (and all browsers). PWA installable.

## Quick start

```bash
python3 -m http.server 8080
# open http://localhost:8080
# add ?demo for demo content
```

## Features

- Drop local .md file → instant render
- Paste GitHub raw URL → fetch + render
- PWA installable (offline support)
- Export to .html / PDF (print) / Copy HTML
- Toggle rendered ↔ source view
- ⌘V paste file from clipboard
- 100% client-side, zero server

## Deploy

```bash
./set-domain.sh https://your-domain.com hello@your-domain.com
# deploy to Cloudflare Pages
```

## Files

- `index.html` — main app
- `assets/app.js` — logic (file/URL loading, marked.js rendering, export)
- `assets/styles.css` — dark theme, mobile-first
- `manifest.json` / `sw.js` — PWA
- `about.html` / `privacy.html` — static pages
- `robots.txt` / `sitemap.xml` — SEO
- `set-domain.sh` — domain placeholder replace
