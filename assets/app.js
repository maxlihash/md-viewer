// MD 阅读器 — 核心逻辑
// 纯前端：本地文件读取、链接导入、Markdown 渲染、导出、添加到桌面

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
    showStatus(t('status-not-md'), 'warning');
    return;
  }
  currentFileName = file.name;
  showStatus(t('status-reading'), '');
  const reader = new FileReader();
  reader.onload = () => {
    render(reader.result, file.name);
    showStatus(t('status-ok-local'), 'ok');
  };
  reader.onerror = () => showStatus(t('status-read-error'), 'error');
  reader.readAsText(file);
}

// ——— URL loading ———
urlLoad.addEventListener('click', loadFromURL);
urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') loadFromURL(); });

async function loadFromURL() {
  const url = urlInput.value.trim();
  if (!url) { showStatus(t('status-no-url'), 'warning'); return; }
  if (!url.startsWith('http')) { showStatus(t('status-bad-url'), 'warning'); return; }

  showStatus(t('status-fetching'), '');
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const text = await resp.text();
    const name = url.split('/').pop() || 'markdown';
    currentFileName = name;
    render(text, name);
    showStatus(t('status-ok-url'), 'ok');
  } catch (err) {
    showStatus(t('status-fetch-error').replace('{0}', err.message), 'error');
  }
}

// ——— Render ———
window.render = function render(raw, fileName) {
  currentRaw = raw;
  if (!raw.trim()) {
    mdBody.innerHTML = '<p style="color:var(--muted)">' + t('empty-file') + '</p>';
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
  updateBtnLabels();
  viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function updateBtnLabels() {
  document.getElementById('btnRaw').textContent = showingRaw ? t('toolbar-rendered') : t('toolbar-source');
}

// ——— Toolbar actions ———
document.getElementById('btnDownload').addEventListener('click', () => {
  const html = mdBody.innerHTML;
  const full = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(currentFileName)}</title><style>body{max-width:820px;margin:40px auto;padding:0 20px;font:16px/1.7 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;color:#1f2329;background:#fff;}pre{background:#f2f3f5;padding:16px;border-radius:8px;overflow-x:auto}code{font-size:.88em;background:#f2f3f5;padding:1px 5px;border-radius:4px}pre code{background:none;padding:0}img{max-width:100%}blockquote{border-left:3px solid #3370ff;padding:4px 16px;color:#646a73;margin:14px 0}a{color:#3370ff}table{border-collapse:collapse}td,th{border:1px solid #e5e6eb;padding:8px 12px}</style></head><body>${html}</body></html>`;
  downloadBlob(full, currentFileName.replace(/\.(md|markdown|txt)$/i, '') + '.html', 'text/html');
});

document.getElementById('btnPrint').addEventListener('click', () => window.print());

document.getElementById('btnCopy').addEventListener('click', async () => {
  const html = mdBody.innerHTML;
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([currentRaw], { type: 'text/plain' }) })
    ]);
    showStatus(t('status-copied-rich'), 'ok');
  } catch {
    await navigator.clipboard.writeText(currentRaw);
    showStatus(t('status-copied-plain'), 'ok');
  }
});

document.getElementById('btnRaw').addEventListener('click', () => {
  showingRaw = !showingRaw;
  if (showingRaw) {
    mdBody.style.display = 'none';
    mdRaw.style.display = 'block';
  } else {
    mdBody.style.display = 'block';
    mdRaw.style.display = 'none';
  }
  updateBtnLabels();
});

// ——— Helpers ———
function showStatus(msg, cls) {
  statusEl.textContent = msg;
  statusEl.style.color = cls === 'error' ? '#d92020' : cls === 'warning' ? '#b25e00' : cls === 'ok' ? '#1a7f37' : 'var(--muted)';
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

// ——— 添加到桌面（PWA 安装）———
const installBtn = document.getElementById('installBtn');
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.hidden = false;
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') installBtn.hidden = true;
      deferredPrompt = null;
    } else {
      location.href = '/about#desktop';
    }
  });
}

window.addEventListener('appinstalled', () => {
  if (installBtn) installBtn.hidden = true;
  showStatus(t('install-done'), 'ok');
});

// ——— 打开 ?demo 时载入示例 ———
function buildDemo() {
  return '# ' + t('demo-h1') + '\n\n' +
    '## ' + t('demo-h2') + '\n\n' +
    t('demo-p') + '\n\n' +
    '### ' + t('demo-h3-features') + '\n\n' +
    '- ' + t('demo-li1') + '\n' +
    '- ' + t('demo-li2') + '\n' +
    '- ' + t('demo-li3') + '\n' +
    '- ' + t('demo-li4') + '\n\n' +
    '### ' + t('demo-h3-code') + '\n\n' +
    '```javascript\nfunction greet(name) {\n  return `' + t('demo-code').replace('{0}', '${name}') + '`;\n}\n' +
    'console.log(greet(\'World\'));\n```\n\n' +
    '### ' + t('demo-h3-table') + '\n\n' +
    '| ' + t('demo-th1') + ' | ' + t('demo-th2') + ' |\n' +
    '|------|------|\n' +
    '| ' + t('demo-td1') + ' | ✅ |\n' +
    '| ' + t('demo-td2') + ' | ✅ |\n' +
    '| ' + t('demo-td3') + ' | ' + t('demo-td4') + ' |\n' +
    '| ' + t('demo-td5') + ' | ✅ |\n\n' +
    '### ' + t('demo-h3-tasks') + '\n\n' +
    '- [x] ' + t('demo-task1') + '\n' +
    '- [x] ' + t('demo-task2') + '\n' +
    '- [ ] ' + t('demo-task3') + '\n\n' +
    '> **' + t('demo-tip') + '**\n\n' +
    '[' + t('demo-link-gfm') + '](https://github.github.com/gfm/)\n';
}

if (new URLSearchParams(location.search).has('demo')) {
  // Wait for i18n to be ready, then render
  function showDemo() {
    render(buildDemo(), 'demo.md');
    showStatus(t('status-demo'), 'ok');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showDemo);
  } else {
    showDemo();
  }
}
