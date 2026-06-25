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
    showStatus('⚠️ 不是 Markdown 文件，请选择 .md / .markdown / .txt 文件。', 'warning');
    return;
  }
  currentFileName = file.name;
  showStatus('正在读取…', '');
  const reader = new FileReader();
  reader.onload = () => {
    render(reader.result, file.name);
    showStatus('✅ 已在本地打开，文件未上传。', 'ok');
  };
  reader.onerror = () => showStatus('❌ 文件读取失败。', 'error');
  reader.readAsText(file);
}

// ——— URL loading ———
urlLoad.addEventListener('click', loadFromURL);
urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') loadFromURL(); });

async function loadFromURL() {
  const url = urlInput.value.trim();
  if (!url) { showStatus('请先粘贴一个链接。', 'warning'); return; }
  if (!url.startsWith('http')) { showStatus('链接需以 http:// 或 https:// 开头。', 'warning'); return; }

  showStatus('正在导入…', '');
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const text = await resp.text();
    const name = url.split('/').pop() || 'markdown';
    currentFileName = name;
    render(text, name);
    showStatus('✅ 已从链接导入。', 'ok');
  } catch (err) {
    showStatus(`❌ 导入失败：${err.message}。请确认是 Markdown 直链（如 raw.githubusercontent.com/…），或下载到本地再打开。`, 'error');
  }
}

// ——— Render ———
function render(raw, fileName) {
  currentRaw = raw;
  if (!raw.trim()) {
    mdBody.innerHTML = '<p style="color:var(--muted)">（空文件）</p>';
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
  document.getElementById('btnRaw').textContent = '查看源码';
  viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    showStatus('📋 已复制（带格式，可直接粘贴到微信/飞书/Word）。', 'ok');
  } catch {
    // 降级：纯文本
    await navigator.clipboard.writeText(currentRaw);
    showStatus('📋 已复制为纯文本。', 'ok');
  }
});

document.getElementById('btnRaw').addEventListener('click', () => {
  showingRaw = !showingRaw;
  if (showingRaw) {
    mdBody.style.display = 'none';
    mdRaw.style.display = 'block';
    document.getElementById('btnRaw').textContent = '查看排版';
  } else {
    mdBody.style.display = 'block';
    mdRaw.style.display = 'none';
    document.getElementById('btnRaw').textContent = '查看源码';
  }
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
      // 浏览器未触发安装提示（如 iOS Safari）：跳转到图文步骤
      location.href = '/about#desktop';
    }
  });
}

window.addEventListener('appinstalled', () => {
  if (installBtn) installBtn.hidden = true;
  showStatus('✅ 已添加到桌面，下次从桌面图标直接打开。', 'ok');
});

// ——— 打开 ?demo 时载入示例 ———
if (new URLSearchParams(location.search).has('demo')) {
  const demo = `# Markdown 示例

## 欢迎使用 MD 阅读器 🎉

下面是 **GitHub 风格 Markdown** 的实时预览效果。

### 它能做什么

- 🚀 即点即看，秒出排版
- 🔒 全程本地，文件不上传
- 📱 手机、平板、电脑都能用
- 📲 可添加到桌面当 App 用

### 代码块

\`\`\`javascript
function greet(name) {
  return \`你好，\${name}！\`;
}
console.log(greet('鸿蒙'));
\`\`\`

### 表格

| 功能       | 支持 |
|------------|------|
| 表格       | ✅   |
| 任务清单   | ✅   |
| 删除线     | ~~有~~ ✅ |
| 代码块     | ✅   |

### 任务清单

- [x] 打开本地 .md 文件
- [x] 粘贴链接导入
- [ ] ~~上传到服务器~~（永远不会）

> **提示：** 点右上角「＋ 添加到桌面」，或看[添加步骤](/about#desktop)，就能像 App 一样从桌面打开。

[GitHub 风格 Markdown 规范](https://github.github.com/gfm/)
`;
  render(demo, '示例.md');
  showStatus('✅ 示例已载入。把你自己的 .md 文件拖进来试试。', 'ok');
}
