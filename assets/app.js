// MD 阅读器 — 核心逻辑
// 纯前端：本地文件读取、链接导入、Markdown 渲染、导出、添加到桌面
// Features: File History, Auto-Refresh, Shareable Link

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const urlInput = document.getElementById('urlInput');
const urlLoad = document.getElementById('urlLoad');

const viewer = document.getElementById('viewer');
const mdBody = document.getElementById('mdBody');
const mdRaw = document.getElementById('mdRaw');
const tbTitle = document.getElementById('tbTitle');
const btnRefresh = document.getElementById('btnRefresh');
const btnReload = document.getElementById('btnReload');
const btnShare = document.getElementById('btnShare');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');
const historyEmpty = document.getElementById('historyEmpty');

let currentFileName = '';
let currentRaw = '';
let currentFile = null;       // File 对象引用（本地文件 fallback）
let currentHandle = null;     // FileSystemFileHandle（根治原子写入刷新）
let currentUrl = null;        // URL 字符串（URL 自动刷新用）
const hasFSA = typeof window.showOpenFilePicker === 'function';

// ——— IndexedDB: 持久化 FileSystemFileHandle（不能序列化到 localStorage）———
function _idb(mode) {
  return new Promise(function (resolve, reject) {
    var r = indexedDB.open('mdreader_fs', 1);
    r.onupgradeneeded = function () { r.result.createObjectStore('h'); };
    r.onsuccess = function () { resolve(r.result); };
    r.onerror = function () { reject(r.error); };
  }).then(function (db) {
    return { db: db, tx: db.transaction('h', mode), store: function () { return this.tx.objectStore('h'); } };
  });
}

function handleStore(id, handle) {
  return _idb('readwrite').then(function (d) {
    d.store().put(handle, id);
    return new Promise(function (resolve) { d.tx.oncomplete = resolve; }).then(function () { d.db.close(); });
  });
}

function handleGet(id) {
  return _idb('readonly').then(function (d) {
    return new Promise(function (resolve, reject) {
      var r = d.store().get(id);
      r.onsuccess = function () { resolve(r.result); };
      r.onerror = function () { reject(r.error); };
    }).then(function (h) { d.db.close(); return h; });
  });
}

function handleDel(id) {
  return _idb('readwrite').then(function (d) {
    d.store().delete(id);
    return new Promise(function (resolve) { d.tx.oncomplete = resolve; }).then(function () { d.db.close(); });
  });
}

let showingRaw = false;
let autoRefreshOn = true;     // 默认开启
let autoRefreshInterval = null;

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

// File System Access API — 点击选择时用 handle（原子写入也能刷新）
// capture phase 拦截，防止同时弹出两个文件选择器
dropzone.addEventListener('click', function (e) {
  if (!hasFSA) return;
  e.stopPropagation();
  e.preventDefault();
  openFileViaFSA();
}, true);

function openFileViaFSA() {
  window.showOpenFilePicker({
    types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md', '.markdown', '.txt'] } }],
    multiple: false
  }).then(function (handles) {
    var handle = handles[0];
    return handle.getFile().then(function (file) {
      loadFile(file, handle);
    });
  }).catch(function (err) {
    if (err.name === 'AbortError') return; // 用户取消
    // 意外错误 → 降级到传统 file input
    fileInput.click();
  });
}

function loadFile(file, handle) {
  if (!file.name.match(/\.(md|markdown|txt)$/i)) {
    toast(t('status-not-md'), 'warn');
    return;
  }
  currentFileName = file.name;
  currentFile = file;
  currentHandle = handle || null;
  currentUrl = null;
  toast(t('status-reading'), 'info');
  file.text().then(function (text) {
    render(text, file.name);
    toast(t('status-ok-local'), 'ok');
    var entry = { type: 'file', name: file.name, time: Date.now(), snippet: snippet(text) };
    if (handle) {
      // 持久化 handle，历史记录可直接打开不需重选
      entry.handleId = file.name;
      handleStore(file.name, handle);
    }
    addHistory(entry);
    ensureAutoRefresh();
  }).catch(function () {
    toast(t('status-read-error'), 'error');
  });
}

// ——— URL loading ———
urlLoad.addEventListener('click', loadFromURL);
urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') loadFromURL(); });

async function loadFromURL() {
  const url = urlInput.value.trim();
  if (!url) { toast(t('status-no-url'), 'warn'); return; }
  if (!url.startsWith('http')) { toast(t('status-bad-url'), 'warn'); return; }

  toast(t('status-fetching'), 'info');
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const text = await resp.text();
    const name = url.split('/').pop() || 'markdown';
    currentFileName = name;
    currentFile = null;
    currentHandle = null;
    currentUrl = url;
    render(text, name);
    toast(t('status-ok-url'), 'ok');
    addHistory({ type: 'url', name: name, url: url, time: Date.now(), snippet: snippet(text) });
    ensureAutoRefresh();
  } catch (err) {
    toast(t('status-fetch-error').replace('{0}', err.message), 'error');
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
  if (!autoRefreshInterval) {
    // Only scroll on initial render, not on auto-refresh
    viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

function updateBtnLabels() {
  document.getElementById('btnRaw').textContent = showingRaw ? t('toolbar-rendered') : t('toolbar-source');
  updateRefreshButton();
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
  // 优先 rich text clipboard API（需 HTTPS 或 localhost）
  if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([currentRaw], { type: 'text/plain' }) })
      ]);
      toast(t('status-copied-rich'), 'ok');
      return;
    } catch { /* rich text 失败，降级到纯文本 */ }
  }
  // Fallback: writeText 或 execCommand
  if (await copyTextFallback(currentRaw)) {
    toast(t('status-copied-plain'), 'ok');
  } else {
    toast(t('status-read-error'), 'error');
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

// ——— 网页全屏（内容撑满视口，不走浏览器全屏 API）———
var btnExpand = document.getElementById('btnExpand');
if (btnExpand) {
  btnExpand.addEventListener('click', function () {
    document.body.classList.toggle('expanded-view');
    btnExpand.textContent = document.body.classList.contains('expanded-view')
      ? t('toolbar-expand-exit') : t('toolbar-expand');
  });
}

// ——— 浏览器全屏 ———
var btnFullscreen = document.getElementById('btnFullscreen');
if (btnFullscreen) {
  btnFullscreen.addEventListener('click', function () {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      viewer.requestFullscreen().catch(function () { /* not supported */ });
    }
  });
  document.addEventListener('fullscreenchange', function () {
    if (btnFullscreen) {
      btnFullscreen.textContent = document.fullscreenElement ? t('toolbar-fullscreen-exit') : t('toolbar-fullscreen');
    }
  });
}

// ══════════════════════════════════════════
// Feature 1: 文件历史 (File History)
// ══════════════════════════════════════════

function addHistory(entry) {
  const history = loadHistory();
  // URL 型：同名 URL 不重复，更新 time + snippet
  if (entry.type === 'url' && entry.url) {
    const idx = history.findIndex(h => h.type === 'url' && h.url === entry.url);
    if (idx >= 0) {
      history[idx].time = entry.time;
      history[idx].snippet = entry.snippet;
      // Move to top
      const item = history.splice(idx, 1)[0];
      history.unshift(item);
    } else {
      history.unshift(entry);
    }
  } else {
    // 本地文件：同名/同路径去重，移到顶部
    var dedupKey = entry.handleId || entry.name;
    var idx = history.findIndex(function (h) {
      return h.type === 'file' && (h.handleId || h.name) === dedupKey;
    });
    if (idx >= 0) {
      history[idx].time = entry.time;
      history[idx].snippet = entry.snippet;
      if (entry.handleId && !history[idx].handleId) history[idx].handleId = entry.handleId;
      var item = history.splice(idx, 1)[0];
      history.unshift(item);
    } else {
      history.unshift(entry);
    }
  }
  // 最多 20 条，FIFO 淘汰
  const trimmed = history.slice(0, 20);
  try {
    localStorage.setItem('mdreader_history', JSON.stringify(trimmed));
  } catch { /* localStorage full, ignore */ }
  renderHistory();
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem('mdreader_history') || '[]');
  } catch { return []; }
}

function openHistoryFile(entry) {
  if (!entry.handleId) {
    openFileViaFSA();
    return;
  }
  toast(t('status-reading'), 'info');
  handleGet(entry.handleId).then(function (handle) {
    if (!handle) { openFileViaFSA(); return; }
    // 页面重载后需重新请求权限
    return handle.queryPermission({ mode: 'read' }).then(function (state) {
      if (state === 'granted') return handle;
      return handle.requestPermission({ mode: 'read' }).then(function (s) {
        if (s === 'granted') return handle;
        throw new Error('denied');
      });
    });
  }).then(function (handle) {
    return handle.getFile();
  }).then(function (file) {
    return file.text().then(function (text) {
      currentFileName = file.name;
      currentFile = file;
      currentHandle = null; // IndexedDB handle 是独立的，不用存 currentHandle
      currentUrl = null;
      render(text, file.name);
      toast(t('status-ok-local'), 'ok');
      // 更新历史记录时间
      addHistory({ type: 'file', name: entry.name, time: Date.now(), snippet: snippet(text), handleId: entry.handleId });
    });
  }).catch(function () {
    // handle 失效（文件移动/删除/权限拒绝）→ 回退到 picker
    openFileViaFSA();
  });
}

function renderHistory() {
  const history = loadHistory();
  historyList.innerHTML = '';
  if (history.length === 0) {
    historyEmpty.style.display = 'block';
    return;
  }
  historyEmpty.style.display = 'none';
  history.forEach((entry, i) => {
    const li = document.createElement('li');
    li.className = 'history-item';
    const icon = entry.type === 'url' ? '🔗' : '📄';
    const time = formatTime(entry.time);
    // FSA 浏览器：本地文件也能直接打开（showOpenFilePicker），不需要"重新选择"
    const actionLabel = entry.type === 'url' ? t('history-reopen') : (hasFSA ? t('history-reopen') : t('history-reselect'));
    const name = escapeHtml(entry.name);
    let tooltip = '';
    if (entry.type === 'url' && entry.url) {
      tooltip = escapeHtml(entry.url);
    } else if (entry.snippet) {
      tooltip = escapeHtml(entry.snippet);
    }
    li.innerHTML =
      `<span class="hi-icon">${icon}</span>` +
      `<span class="hi-name" title="${tooltip}">${name}</span>` +
      `<span class="hi-time">${time}</span>` +
      `<button class="btn small hi-action" data-idx="${i}">${actionLabel}</button>` +
      `<button class="btn small hi-delete" data-idx="${i}" title="${escapeHtml(t('history-delete'))}">×</button>`;
    // Click row to re-open
    if (entry.type === 'url') {
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        urlInput.value = entry.url;
        loadFromURL();
      });
    } else if (hasFSA) {
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => openHistoryFile(entry));
    }
    historyList.appendChild(li);
  });

  // Wire up action buttons (stopPropagation to avoid row click)
  historyList.querySelectorAll('.hi-action').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      const h = loadHistory();
      const entry = h[idx];
      if (!entry) return;
      if (entry.type === 'url' && entry.url) {
        urlInput.value = entry.url;
        loadFromURL();
      } else if (hasFSA) {
        openHistoryFile(entry);
      } else {
        fileInput.click();
      }
    });
  });

  // Wire up delete buttons
  historyList.querySelectorAll('.hi-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      deleteHistory(idx);
    });
  });
}

function deleteHistory(idx) {
  const history = loadHistory();
  if (idx < 0 || idx >= history.length) return;
  var entry = history[idx];
  history.splice(idx, 1);
  try {
    localStorage.setItem('mdreader_history', JSON.stringify(history));
  } catch { /* ignore */ }
  // 清理 IndexedDB handle
  if (entry.handleId) {
    // 只有同 handleId 的历史记录都删了才清 handle
    var stillUsed = history.some(function (e) { return e.handleId === entry.handleId; });
    if (!stillUsed) handleDel(entry.handleId);
  }
  renderHistory();
}

function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  if (isToday) return hh + ':' + mm;
  const M = d.getMonth() + 1;
  const D = d.getDate();
  return M + '/' + D + ' ' + hh + ':' + mm;
}

function snippet(text, maxLen) {
  maxLen = maxLen || 100;
  const s = text.replace(/\n+/g, ' ').trim();
  return s.length > maxLen ? s.slice(0, maxLen) + '…' : s;
}

// ══════════════════════════════════════════
// Feature 2: 自动刷新 (Auto-Refresh)
// ══════════════════════════════════════════

function loadAutoRefreshPref() {
  try {
    const v = localStorage.getItem('mdreader_autorefresh');
    if (v === 'false') autoRefreshOn = false;
    else if (v === 'true') autoRefreshOn = true;
  } catch { autoRefreshOn = true; }
}

function saveAutoRefreshPref() {
  try {
    localStorage.setItem('mdreader_autorefresh', String(autoRefreshOn));
  } catch { /* ignore */ }
}

function startAutoRefresh() {
  stopAutoRefresh();
  if (currentHandle) {
    // File System Access API — handle 按路径跟踪，原子写入无影响
    autoRefreshInterval = setInterval(async function () {
      try {
        var file = await currentHandle.getFile();
        var text = await file.text();
        if (text !== currentRaw) {
          var scrollY = window.scrollY;
          render(text, currentFileName);
          window.scrollTo(0, scrollY);
          toast(t('status-refreshed'), 'ok');
        }
      } catch (e) {
        // handle 失效（文件被删除/权限被收回）
        stopAutoRefresh();
        currentHandle = null;
        currentFile = null;
      }
    }, 3000);
  } else if (currentFile) {
    // Fallback: 传统 File API（编辑器原子写入会失败）
    autoRefreshInterval = setInterval(function () {
      var reader = new FileReader();
      reader.onload = function () {
        if (reader.result !== currentRaw) {
          var scrollY = window.scrollY;
          render(reader.result, currentFileName);
          window.scrollTo(0, scrollY);
          toast(t('status-refreshed'), 'ok');
        }
      };
      reader.onerror = function () {
        stopAutoRefresh();
        currentFile = null;
      };
      reader.readAsText(currentFile);
    }, 3000);
  } else if (currentUrl) {
    autoRefreshInterval = setInterval(async function () {
      try {
        var resp = await fetch(currentUrl, { cache: 'no-store' });
        if (!resp.ok) return;
        var text = await resp.text();
        if (text !== currentRaw) {
          var scrollY = window.scrollY;
          render(text, currentFileName);
          window.scrollTo(0, scrollY);
          toast(t('status-refreshed'), 'ok');
        }
      } catch (e) { /* 网络错误，静默忽略 */ }
    }, 10000);
  }
}

function stopAutoRefresh() {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }
}

function toggleAutoRefresh() {
  autoRefreshOn = !autoRefreshOn;
  saveAutoRefreshPref();
  updateRefreshButton();
  if (autoRefreshOn) {
    ensureAutoRefresh();
  } else {
    stopAutoRefresh();
  }
}

function ensureAutoRefresh() {
  if (autoRefreshOn && (currentHandle || currentFile || currentUrl)) {
    startAutoRefresh();
  }
}

function manualRefresh() {
  if (!currentHandle && !currentFile && !currentUrl) {
    toast(t('reload-no-content'), 'warn');
    return;
  }
  toast(t('reload-loading'), 'info');
  if (currentHandle) {
    // File System Access API — 根治方案
    currentHandle.getFile().then(function (file) {
      return file.text();
    }).then(function (text) {
      if (text !== currentRaw) {
        var scrollY = window.scrollY;
        render(text, currentFileName);
        window.scrollTo(0, scrollY);
        toast(t('reload-ok'), 'ok');
      } else {
        toast(t('reload-unchanged'), 'info');
      }
    }).catch(function () {
      toast(t('reload-error'), 'error');
    });
  } else if (currentFile) {
    // Fallback: 传统 File API
    var reader = new FileReader();
    reader.onload = function () {
      if (reader.result !== currentRaw) {
        var scrollY = window.scrollY;
        render(reader.result, currentFileName);
        window.scrollTo(0, scrollY);
        toast(t('reload-ok'), 'ok');
      } else {
        toast(t('reload-unchanged'), 'info');
      }
    };
    reader.onerror = function () {
      stopAutoRefresh();
      currentFile = null;
      toast(t('reload-replaced'), 'error', 4000);
    };
    reader.readAsText(currentFile);
  } else if (currentUrl) {
    fetch(currentUrl, { cache: 'no-store' }).then(function (resp) {
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return resp.text();
    }).then(function (text) {
      if (text !== currentRaw) {
        var scrollY = window.scrollY;
        render(text, currentFileName);
        window.scrollTo(0, scrollY);
        toast(t('reload-ok'), 'ok');
      } else {
        toast(t('reload-unchanged'), 'info');
      }
    }).catch(function (err) {
      toast(t('reload-error'), 'error');
    });
  }
}

function updateRefreshButton() {
  if (!btnRefresh) return;
  btnRefresh.textContent = autoRefreshOn ? t('refresh-on') : t('refresh-off');
  btnRefresh.className = 'btn small' + (autoRefreshOn ? ' refresh-on' : '');
}

// ══════════════════════════════════════════
// Feature 3: 可分享链接 (Shareable Link)
// deflate-raw via browser CompressionStream + base64url
// ══════════════════════════════════════════

// --- base64url helpers (RFC 4648 §5) ---
function base64urlFromBytes(buf) {
  var binary = '';
  for (var i = 0; i < buf.length; i++) {
    binary += String.fromCharCode(buf[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function bytesFromBase64url(str) {
  var base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  var binary = atob(base64);
  var buf = new Uint8Array(binary.length);
  for (var i = 0; i < binary.length; i++) {
    buf[i] = binary.charCodeAt(i);
  }
  return buf;
}

// --- deflate helpers ---
function compressionSupported() {
  return typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';
}

async function deflateCompress(raw) {
  var encoder = new TextEncoder();
  var stream = new CompressionStream('deflate-raw');
  var writer = stream.writable.getWriter();
  writer.write(encoder.encode(raw));
  writer.close();
  var reader = stream.readable.getReader();
  var chunks = [];
  while (true) {
    var chunk = await reader.read();
    if (chunk.done) break;
    chunks.push(chunk.value);
  }
  var total = chunks.reduce(function (s, c) { return s + c.length; }, 0);
  var merged = new Uint8Array(total);
  var offset = 0;
  for (var i = 0; i < chunks.length; i++) {
    merged.set(chunks[i], offset);
    offset += chunks[i].length;
  }
  return base64urlFromBytes(merged);
}

async function deflateDecompress(encoded) {
  var buf = bytesFromBase64url(encoded);
  var stream = new DecompressionStream('deflate-raw');
  var writer = stream.writable.getWriter();
  writer.write(buf);
  writer.close();
  var reader = stream.readable.getReader();
  var chunks = [];
  while (true) {
    var chunk = await reader.read();
    if (chunk.done) break;
    chunks.push(chunk.value);
  }
  var decoder = new TextDecoder();
  var parts = [];
  for (var i = 0; i < chunks.length; i++) {
    parts.push(decoder.decode(chunks[i]));
  }
  return parts.join('');
}

async function encodeShare(raw) {
  if (!compressionSupported()) {
    console.error('[share] CompressionStream not supported');
    return null;
  }
  try {
    return await deflateCompress(raw);
  } catch (e) {
    console.error('[share] encode error:', e);
    return null;
  }
}

async function decodeShare(encoded) {
  if (!compressionSupported()) {
    console.error('[share] DecompressionStream not supported');
    return null;
  }
  try {
    return await deflateDecompress(encoded);
  } catch (e) {
    console.error('[share] decode error:', e);
    return null;
  }
}

async function loadFromHash() {
  var hash = location.hash;
  if (!hash || !hash.startsWith('#s=')) return false;
  var encoded = hash.slice(3);
  if (!encoded) return false;
  var decoded = await decodeShare(encoded);
  if (decoded === null || decoded === '') {
    toast(t('share-decode-error'), 'error');
    return true;
  }
  currentFileName = '';
  currentFile = null;
  currentHandle = null;
  currentUrl = null;
  render(decoded, t('share-title'));
  return true;
}

async function copyShareLink() {
  if (!currentRaw) {
    toast(t('share-no-content'), 'warn');
    return;
  }
  var encoded = await encodeShare(currentRaw);
  if (!encoded) {
    toast(t('share-error'), 'warn');
    return;
  }
  var url = location.origin + location.pathname + '#s=' + encoded;
  if (url.length > 4000) {
    toast(t('share-too-large'), 'warn');
  }
  try {
    await ensureQrLib();
    showShareDialog(url, currentFileName, encoded.length);
  } catch (e) {
    // QR lib failed to load — fallback to direct copy
    if (await copyTextFallback(url)) {
      toast(t('share-copied'), 'ok');
    } else {
      toast(t('share-error'), 'warn');
    }
  }
}

// ——— Share dialog (QR code) ———
var qrLibReady = false;

function ensureQrLib() {
  return new Promise(function (resolve, reject) {
    if (qrLibReady) return resolve();
    if (typeof qrcode !== 'undefined') { qrLibReady = true; return resolve(); }
    var script = document.createElement('script');
    script.src = '/assets/qrcode.min.js';
    script.onload = function () { qrLibReady = true; resolve(); };
    script.onerror = function () { reject(new Error('qrcode load failed')); };
    document.head.appendChild(script);
  });
}

function showShareDialog(url, filename, compressedLen) {
  var overlay = document.getElementById('shareOverlay');
  var qrEl = document.getElementById('shareQr');
  var metaEl = document.getElementById('shareMeta');
  var copyBtn = document.getElementById('shareCopyBtn');

  // Generate QR code
  var typeNumber = 0; // auto
  var qr = qrcode(typeNumber, 'M');
  qr.addData(url);
  qr.make();
  qrEl.innerHTML = qr.createSvgTag(5, 1);

  // Meta info
  metaEl.innerHTML =
    '<span>' + escapeHtml(t('share-dialog-size')) + ': ' + escapeHtml(filename || '—') + '</span>' +
    '<span>' + escapeHtml(t('share-dialog-chars')) + ': ' + compressedLen + ' chars</span>';

  // Reset copy button
  copyBtn.textContent = t('share-dialog-copy');
  copyBtn.disabled = false;

  // Show overlay
  overlay.hidden = false;
  requestAnimationFrame(function () { overlay.classList.add('open'); });

  // Copy button handler (replace to avoid duplicate listeners)
  copyBtn.onclick = async function () {
    if (await copyTextFallback(url)) {
      copyBtn.textContent = t('share-dialog-copied');
      copyBtn.disabled = true;
    }
  };
}

function hideShareDialog() {
  var overlay = document.getElementById('shareOverlay');
  overlay.classList.remove('open');
  setTimeout(function () { overlay.hidden = true; }, 250);
}

// Wire up dialog close events
function initShareDialog() {
  var overlay = document.getElementById('shareOverlay');
  var closeBtn = document.getElementById('shareClose');

  closeBtn.addEventListener('click', hideShareDialog);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) hideShareDialog();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden && overlay.classList.contains('open')) {
      hideShareDialog();
    }
  });
}

// ——— Helpers ———
function toast(msg, type, duration) {
  // type: 'ok' | 'error' | 'warn' | 'info'
  duration = duration || 2500;
  var el = document.createElement('div');
  el.className = 'toast toast-' + (type || 'info');
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(function () {
    el.classList.add('show');
  });
  setTimeout(function () {
    el.classList.remove('show');
    setTimeout(function () { el.remove(); }, 300);
  }, duration);
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

// 剪贴板 fallback：支持非 HTTPS 环境（execCommand）
async function copyTextFallback(text) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch { /* 降级到 execCommand */ }
  }
  // 传统方案：临时 textarea + execCommand
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  ta.style.top = '-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  var ok = false;
  try {
    ok = document.execCommand('copy');
  } catch (e) { /* ignore */ }
  document.body.removeChild(ta);
  return ok;
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
  toast(t('install-done'), 'ok');
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

function showDemo() {
  render(buildDemo(), 'demo.md');
  toast(t('status-demo'), 'ok');
  addHistory({ type: 'url', name: 'demo.md', url: location.origin + location.pathname + '?demo', time: Date.now(), snippet: t('demo-h1') });
}

// ══════════════════════════════════════════
// 初始化
// ══════════════════════════════════════════

async function initFeatures() {
  loadAutoRefreshPref();
  updateRefreshButton();

  // 不支持 File System Access API → 历史记录和手动刷新都不可靠，隐藏
  if (!hasFSA) {
    if (btnReload) btnReload.hidden = true;
    if (historyPanel) historyPanel.hidden = true;
  }

  // Wire up new toolbar buttons
  if (btnReload) btnReload.addEventListener('click', manualRefresh);
  if (btnRefresh) btnRefresh.addEventListener('click', toggleAutoRefresh);
  if (btnShare) btnShare.addEventListener('click', copyShareLink);

  // Wire up share dialog
  initShareDialog();

  // Load shared content from hash first (before demo)
  var loadedFromHash = await loadFromHash();

  // Load demo if ?demo and no hash content
  if (!loadedFromHash && new URLSearchParams(location.search).has('demo')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showDemo);
    } else {
      showDemo();
    }
  }

  // Render history panel
  renderHistory();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFeatures);
} else {
  initFeatures();
}
