// md-viewer — core app logic
// Pure client-side: local file loading, URL fetching, markdown rendering, export

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const urlInput = document.getElementById('urlInput');
const urlLoad = document.getElementById('urlLoad');
const statusEl = document.getElementById('status');
const viewer = document.getElementById('viewer');
const mdBody = document.getElementById('mdBody');
const mdRaw = document.getElementById('mdRaw');
const tbTitle = document.getElementById('tbTitle');

let currentFileName = '';
let currentRaw = '';
let showingRaw = false;

// ——— Configure marked ———
if (typeof marked !== 'undefined') {
  marked.setOptions({
    gfm: true,
    breaks: false,
    smartLists: true,
    smartypants: true,
  });
}

// ——— Local file handling ———
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('dragover'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) loadFile(file);
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) loadFile(file);
});

function loadFile(file) {
  if (!file.name.match(/\.(md|markdown|txt)$/i)) {
    showStatus('⚠️ Not a markdown file. Try a .md or .markdown file.', 'warning');
    return;
  }
  currentFileName = file.name;
  showStatus('Reading file…', '');
  const reader = new FileReader();
  reader.onload = () => {
    render(reader.result, file.name);
    showStatus('✅ Rendered from local file — nothing uploaded.', 'ok');
  };
  reader.onerror = () => showStatus('❌ Failed to read file.', 'error');
  reader.readAsText(file);
}

// ——— URL loading ———
urlLoad.addEventListener('click', loadFromURL);
urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') loadFromURL(); });

async function loadFromURL() {
  const url = urlInput.value.trim();
  if (!url) { showStatus('Paste a URL first.', 'warning'); return; }
  if (!url.startsWith('http')) { showStatus('URL must start with http:// or https://', 'warning'); return; }

  showStatus('Fetching…', '');
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const text = await resp.text();
    const name = url.split('/').pop() || 'markdown';
    currentFileName = name;
    render(text, name);
    showStatus('✅ Rendered from URL.', 'ok');
  } catch (err) {
    showStatus(`❌ Failed: ${err.message}. Make sure it's a raw GitHub URL (raw.githubusercontent.com/…).`, 'error');
  }
}

// ——— Render ———
function render(raw, fileName) {
  currentRaw = raw;
  if (!raw.trim()) {
    mdBody.innerHTML = '<p style="color:var(--muted)">(empty file)</p>';
    mdRaw.textContent = '';
  } else {
    const html = typeof marked !== 'undefined' ? marked.parse(raw) : `<pre>${escapeHtml(raw)}</pre>`;
    mdBody.innerHTML = html;
    mdRaw.textContent = raw;
  }
  showingRaw = false;
  mdBody.style.display = 'block';
  mdRaw.style.display = 'none';
  tbTitle.textContent = fileName || '—';
  viewer.style.display = 'block';
  document.getElementById('btnRaw').innerHTML = '&#x3c;&#x3e; Source';
  viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ——— Toolbar actions ———
document.getElementById('btnDownload').addEventListener('click', () => {
  const html = mdBody.innerHTML;
  const full = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(currentFileName)}</title><style>body{max-width:860px;margin:40px auto;padding:0 20px;font:16px/1.65 -apple-system,BlinkMacSystemFont,sans-serif;color:#e6edf3;background:#0d1117;}pre{background:#161b22;padding:16px;border-radius:8px;overflow-x:auto}code{font-size:.88em}img{max-width:100%}blockquote{border-left:3px solid #58a6ff;padding:4px 16px;color:#8b949e}a{color:#58a6ff}table{border-collapse:collapse}td,th{border:1px solid #30363d;padding:8px 12px}</style></head><body>${html}</body></html>`;
  downloadBlob(full, currentFileName.replace(/\.(md|markdown|txt)$/i, '') + '.html', 'text/html');
});

document.getElementById('btnPrint').addEventListener('click', () => window.print());

document.getElementById('btnCopy').addEventListener('click', async () => {
  const html = mdBody.innerHTML;
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([currentRaw], { type: 'text/plain' }) })
    ]);
    showStatus('📋 Copied (HTML + plain text).', 'ok');
  } catch {
    // fallback
    await navigator.clipboard.writeText(currentRaw);
    showStatus('📋 Copied as plain text.', 'ok');
  }
});

document.getElementById('btnRaw').addEventListener('click', () => {
  showingRaw = !showingRaw;
  if (showingRaw) {
    mdBody.style.display = 'none';
    mdRaw.style.display = 'block';
    document.getElementById('btnRaw').textContent = '👁️ Rendered';
  } else {
    mdBody.style.display = 'block';
    mdRaw.style.display = 'none';
    document.getElementById('btnRaw').innerHTML = '&#x3c;&#x3e; Source';
  }
});

// ——— Helpers ———
function showStatus(msg, cls) {
  statusEl.textContent = msg;
  statusEl.style.color = cls === 'error' ? '#f85149' : cls === 'warning' ? '#d29922' : cls === 'ok' ? '#7ee787' : 'var(--muted)';
}

function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ——— Paste file from clipboard (⌘V / Ctrl+V) ———
document.addEventListener('paste', e => {
  const items = e.clipboardData?.items;
  if (!items) return;
  for (const item of items) {
    if (item.kind === 'file') {
      e.preventDefault();
      const file = item.getAsFile();
      loadFile(file);
      return;
    }
  }
});

// ——— Demo content if opened with ?demo ———
if (new URLSearchParams(location.search).has('demo')) {
  const demo = `# Markdown Demo

## Welcome to MD Viewer 🎉

This is a **live preview** of GitHub-Flavored Markdown.

### Features

- 🚀 Instant rendering
- 🔒 100% private — no upload
- 📱 Mobile-friendly
- 🌙 Dark mode

### Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet('HarmonyOS'));
\`\`\`

### Table

| Feature    | Supported |
|------------|-----------|
| Tables     | ✅        |
| Task lists | ✅        |
| Strikethrough | ~~yes~~ ✅ |
| Code blocks | ✅       |

### Task List

- [x] Drop a .md file
- [x] Paste a GitHub URL
- [ ] ~~Upload to server~~ (never!)

> **Tip:** Install this page as a PWA — tap browser menu → "Add to Home Screen".

[GitHub-Flavored Markdown Spec](https://github.github.com/gfm/)
`;
  render(demo, 'demo.md');
  showStatus('✅ Demo loaded. Drop your own .md file or paste a URL.', 'ok');
}
