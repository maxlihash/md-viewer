# MD Reader

Online Markdown reader — open .md files in your browser. Free, local, no upload, installable as a PWA.

Global-facing (English-first). Supports all platforms: iOS, Android, HarmonyOS, Windows, macOS.

## Local preview

```bash
python3 -m http.server 8080
# Open http://localhost:8080
# Add ?demo for sample content
```

## Features

- Drop local .md files → instant rendering
- Paste a raw Markdown URL → import and render
- Add to home screen (PWA, works offline)
- Export: PDF / save as .html / copy with formatting
- Toggle between rendered view and raw source
- ⌘V / Ctrl+V to paste files from clipboard
- 100% frontend, no backend

## Pages

- `index.html` — Minimal tool page (tool-first landing)
- `about.html` — Detailed intro + install steps + FAQ
- `privacy.html` — Privacy policy

## Deploy

```bash
./set-domain.sh https://your-domain.com hello@your-domain.com
# Deploy to Cloudflare Pages
```

## Files

- `index.html` — Main app (minimal)
- `assets/app.js` — Logic (file/URL loading, marked.js rendering, export, PWA install)
- `assets/i18n.js` — zh-CN / en bilingual support (English default)
- `assets/styles.css` — Clean light theme, mobile-first, follows system dark mode
- `manifest.json` / `sw.js` — PWA
- `about.html` / `privacy.html` — Static pages
- `robots.txt` / `sitemap.xml` — SEO
- `set-domain.sh` — Domain placeholder replacement
