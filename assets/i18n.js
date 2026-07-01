// MD 阅读器 — i18n: zh-CN / en. Auto-detect, manual toggle, localStorage.
window.I18N = {
  'zh-CN': {
    // -- brand --
    'brand': 'MD<span>·</span>阅读器',
    'brand-short': 'MD 阅读器',

    // -- index.html --
    'page-title': 'MD 阅读器 — 在线打开 Markdown 文件，免上传',
    'meta-desc': '在浏览器里直接打开、预览 .md / Markdown 文件。支持本地文件、链接导入，免登录、免上传、不联网也能用。可添加到桌面当 App 用。',
    'og-title': 'MD 阅读器 — 在线打开 Markdown 文件',
    'og-desc': '拖入 .md 文件即可阅读，全程在本地，免上传。可添加到桌面当 App 用。',
    'schema-name': 'MD 阅读器',
    'schema-desc': '在浏览器里打开、预览 Markdown 文件，免上传，可添加到桌面。',
    'nav-about': '介绍',
    'btn-install': '＋ 添加到桌面',
    'hero-title': 'Markdown 阅读器',
    'hero-sub': '拖入 .md 文件就能看，自动排版成网页。全程在本地，不上传、不登录。',
    'dropzone-big': '点击选择，或把 .md 文件拖到这里',
    'dropzone-small': '支持 .md / .markdown / .txt · 文件不会离开你的设备',
    'url-placeholder': '或粘贴链接导入，如 https://raw.githubusercontent.com/…',
    'url-btn': '打开',
    'demo-link': '看个示例 →',
    'howto-link': '怎么添加到桌面？',
    'toolbar-source': '查看源码',
    'toolbar-rendered': '查看排版',
    'toolbar-save': '存为网页',
    'toolbar-pdf': '导出 PDF',
    'toolbar-copy': '复制',
    'toolbar-expand': '网页全屏',
    'toolbar-expand-exit': '退出',
    'toolbar-fullscreen': '全屏',
    'toolbar-fullscreen-exit': '退出全屏',
    'footer-home': 'MD 阅读器 · 免费 · 不上传 · 可添加到桌面 — <a href="/about">详细介绍</a> · <a href="/privacy">隐私说明</a>',
    'install-done': '✅ 已添加到桌面，下次从桌面图标直接打开。',
    'empty-file': '（空文件）',

    // status messages (app.js)
    'status-not-md': '⚠️ 不是 Markdown 文件，请选择 .md / .markdown / .txt 文件。',
    'status-reading': '正在读取…',
    'status-ok-local': '✅ 已在本地打开，文件未上传。',
    'status-read-error': '❌ 文件读取失败。',
    'status-no-url': '请先粘贴一个链接。',
    'status-bad-url': '链接需以 http:// 或 https:// 开头。',
    'status-fetching': '正在导入…',
    'status-ok-url': '✅ 已从链接导入。',
    'status-fetch-error': '❌ 导入失败：{0}。请确认是 Markdown 直链（如 raw.githubusercontent.com/…），或下载到本地再打开。',
    'status-copied-rich': '📋 已复制（带格式，可直接粘贴到微信/飞书/Word）。',
    'status-copied-plain': '📋 已复制为纯文本。',
    'status-demo': '✅ 示例已载入。把你自己的 .md 文件拖进来试试。',
    'status-refreshed': '🔄 内容已自动更新',

    // history
    'history-title': '最近打开',
    'history-empty': '暂无打开记录',
    'history-reopen': '打开',
    'history-reselect': '重新选择',
    'history-delete': '删除',

    // manual reload
    'reload-btn': '🔄',
    'reload-loading': '刷新中…',
    'reload-ok': '✅ 已刷新',
    'reload-unchanged': '内容未变化',
    'reload-no-content': '请先打开一个文件',
    'reload-error': '❌ 刷新失败',
    'reload-replaced': '⚠️ 文件已被外部编辑器替换，请重新选择文件',

    // auto-refresh
    'refresh-on': 'Auto',
    'refresh-off': 'Auto',

    // share link
    'share-copy': '分享',
    'share-copied': '✅ 链接已复制！',
    'share-too-large': '⚠️ 内容过长，链接可能被截断',
    'share-title': '分享内容',
    'share-decode-error': '⚠️ 无法解析分享链接',
    'share-no-content': '请先打开一个文件',
    'share-error': '生成链接失败',
    'share-dialog-title': '分享文档',
    'share-dialog-copy': '复制链接',
    'share-dialog-copied': '✅ 已复制',
    'share-dialog-close': '关闭',
    'share-dialog-size': '文件',
    'share-dialog-chars': '压缩后',

    // demo content
    'demo-h1': 'Markdown 示例',
    'demo-h2': '欢迎使用 MD 阅读器 🎉',
    'demo-p': '下面是 <strong>GitHub 风格 Markdown</strong> 的实时预览效果。',
    'demo-h3-features': '它能做什么',
    'demo-li1': '🚀 即点即看，秒出排版',
    'demo-li2': '🔒 全程本地，文件不上传',
    'demo-li3': '📱 手机、平板、电脑都能用',
    'demo-li4': '📲 可添加到桌面当 App 用',
    'demo-h3-code': '代码块',
    'demo-code': '你好，{0}！',
    'demo-h3-table': '表格',
    'demo-th1': '功能',
    'demo-th2': '支持',
    'demo-td1': '表格',
    'demo-td2': '任务清单',
    'demo-td3': '删除线',
    'demo-td4': '~~有~~ ✅',
    'demo-td5': '代码块',
    'demo-h3-tasks': '任务清单',
    'demo-task1': '打开本地 .md 文件',
    'demo-task2': '粘贴链接导入',
    'demo-task3': '上传到服务器（永远不会）',
    'demo-tip': '提示：点右上角「＋ 添加到桌面」，或看添加步骤，就能像 App 一样从桌面打开。',
    'demo-link-gfm': 'GitHub 风格 Markdown 规范',
    'demo-link-how': '添加步骤',

    // about.html
    'about-title': '介绍 — MD 阅读器',
    'about-meta-desc': 'MD 阅读器是一个免上传、免登录的在线 Markdown 阅读工具，可添加到桌面当 App 用。这里有功能说明、添加到桌面的步骤、常见问题。',
    'about-nav-home': '回到首页',
    'about-nav-privacy': '隐私说明',
    'about-h1': '关于 MD 阅读器',
    'about-lead': '做这个工具的原因很简单：手机上收到一个 <code>.md</code> 文件，想看一眼，不该还要专门装个 App、还要把文件传到别人服务器上。',
    'about-h2-features': '它能做什么',
    'about-f1': '<strong>打开本地文件</strong>：点一下或拖进来，<code>.md</code> / <code>.markdown</code> / <code>.txt</code> 立刻排版成网页。',
    'about-f2': '<strong>链接导入</strong>：粘贴一个 Markdown 文件的直链（如 GitHub raw 链接），点「打开」即可。',
    'about-f3': '<strong>导出</strong>：可导出 PDF、存为网页文件、一键复制（带格式，能直接粘进微信/飞书/Word）。',
    'about-f4': '<strong>源码切换</strong>：随时在「排版后」和「原始 Markdown」之间切换。',
    'about-f5': '<strong>添加到桌面</strong>：像装 App 一样放到桌面，离线也能用。',
    'about-h2-install': '怎么添加到桌面',
    'about-install-intro': '添加后，桌面会多一个图标，点开就是这个工具，跟原生 App 一样，断网也能打开本地文件。各系统的步骤：',
    'about-install-harmonyos': '🟢 鸿蒙 HarmonyOS',
    'about-install-harmonyos-desc': '浏览器打开本页 → 点底部/右上角菜单 → 选「<strong>添加到桌面</strong>」/「<strong>添加到主屏幕</strong>」→ 确认。',
    'about-install-android': '🤖 安卓 Android',
    'about-install-android-desc': '用 Chrome / 自带浏览器打开 → 右上角菜单「⋮」→「<strong>添加到主屏幕</strong>」/「安装应用」→ 确认。',
    'about-install-ios': '🍎 iPhone / iPad',
    'about-install-ios-desc': '必须用 <strong>Safari</strong> 打开 → 点底部「分享」按钮（方框+箭头）→「<strong>添加到主屏幕</strong>」→ 添加。',
    'about-install-desktop': '💻 电脑 Windows / Mac',
    'about-install-desktop-desc': '用 Chrome / Edge 打开 → 地址栏右侧的「安装」图标（屏幕带下箭头）→ 安装。也可在浏览器菜单里找「安装此应用」。',
    'about-install-tip': '💡 如果首页右上角出现了「＋ 添加到桌面」按钮，直接点它最省事。',
    'about-h2-privacy': '为什么免上传更好',
    'about-privacy-desc': '所有解析、排版都在你自己的浏览器里完成，文件不会发到任何服务器。这意味着：更快（没有上传等待）、更私密（公司文档、合同、笔记不外泄）、断网也能用。打开浏览器的开发者工具看网络请求就能验证——页面加载完之后，看文件不会再产生任何上传请求。',
    'about-h2-syntax': '支持哪些 Markdown 语法',
    'about-syntax-desc': '完整支持 GitHub 风格 Markdown（GFM）：标题、列表、表格、任务清单、删除线、引用、链接、图片、代码块（带语言识别）、行内 HTML。排版效果和 GitHub、Notion 上看到的基本一致。',
    'about-h2-faq': '常见问题',
    'about-faq-q1': '我的文件会被上传吗？',
    'about-faq-a1': '不会。全部处理都在浏览器本地用 <code>marked.js</code> 完成，文件不发往任何服务器。',
    'about-faq-q2': '断网能用吗？',
    'about-faq-a2': '能。第一次访问后会缓存到本地，之后离线也能打开本地 <code>.md</code> 文件。添加到桌面后体验更接近原生 App。',
    'about-faq-q3': '和手机自带的「文本查看」有什么区别？',
    'about-faq-a3': '自带查看器显示的是原始符号（<code># 标题</code>、<code>**加粗**</code>），看着乱。这个工具会把它排版成真正的标题、加粗、表格、代码块，跟在 GitHub 上看一样。',
    'about-faq-q4': '链接导入打不开 / 报错？',
    'about-faq-a4': '需要是 Markdown 文件的<strong>直链（raw）</strong>，比如 <code>raw.githubusercontent.com/…</code>，不是网页地址。部分站点限制跨域访问也会失败，这种情况把文件下载到本地再打开即可。',
    'about-faq-q5': '收费吗？要登录吗？',
    'about-faq-a5': '完全免费，不用登录、不用注册，没有任何账号体系。',
    'about-h2-tech': '技术说明',
    'about-tech-desc': '纯静态页面，前端 HTML + CSS + 原生 JS，没有后端、没有数据库、没有打包步骤。Markdown 解析用 <a href="https://github.com/markedjs/marked" target="_blank" rel="noopener">marked.js</a>，本地文件读取用浏览器 File API，离线用 Service Worker 缓存，添加到桌面靠 Web App Manifest（PWA）。无埋点、无第三方统计。',
    'about-back': '← 回首页打开文件',
    'about-footer': 'MD 阅读器 · 免费 · 不上传 — <a href="/">首页</a> · <a href="/about">详细介绍</a> · <a href="/privacy">隐私说明</a>',

    // privacy.html
    'privacy-title': '隐私说明 — MD 阅读器',
    'privacy-meta-desc': 'MD 阅读器隐私说明：不收集数据、不上传文件、无追踪。',
    'privacy-h1': '隐私说明',
    'privacy-updated': '最后更新：2026 年 6 月 24 日',
    'privacy-h2-tldr': '一句话',
    'privacy-tldr': '我们什么都不收集。你的文件不会离开你的设备，没有统计、没有 Cookie、没有追踪。',
    'privacy-h2-nope': '我们不做的事',
    'privacy-nope1': '<strong>不上传文件</strong>：所有 Markdown 解析都在你的浏览器本地用 <code>marked.js</code> 完成，<code>.md</code> 文件始终留在你的设备上。',
    'privacy-nope2': '<strong>不做统计</strong>：不用任何第三方统计或追踪像素。',
    'privacy-nope3': '<strong>不用 Cookie</strong>：不设置任何 Cookie（仅有用于离线的 Service Worker 缓存，存在你本地）。',
    'privacy-nope4': '<strong>不要个人信息</strong>：不需要姓名、邮箱或任何账号信息。',
    'privacy-h2-host': '托管方可能记录的',
    'privacy-host': '本站托管在 Cloudflare Pages，Cloudflare 作为基础设施可能记录匿名访问数据（如请求数、带宽），这是所有托管在 Cloudflare 上的网站的通用情况。详见 <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare 隐私政策</a>。',
    'privacy-h2-cdn': '第三方 CDN',
    'privacy-cdn': '本站从 jsDelivr（<code>cdn.jsdelivr.net</code>）加载 <code>marked.js</code>，jsDelivr 可能按其隐私政策记录匿名请求数据。详见 <a href="https://www.jsdelivr.com/terms/privacy-policy" target="_blank" rel="noopener">jsDelivr 隐私政策</a>。',
    'privacy-h2-contact': '联系',
    'privacy-contact': '有问题可邮件 <a href="mailto:hello@mdreader.xyz">hello@mdreader.xyz</a>。',
    'privacy-back': '← 回首页',
    'privacy-footer': 'MD 阅读器 · 免费 · 不上传 — <a href="/">首页</a> · <a href="/about">详细介绍</a> · <a href="/privacy">隐私说明</a>',

    // manifest.json
    'manifest-name': 'MD 阅读器 — Markdown 预览',
    'manifest-short': 'MD 阅读器',
    'manifest-desc': '在浏览器里打开、预览 Markdown 文件，免上传，可添加到桌面。',

    // lang switcher
    'lang-label': 'EN',
  },

  'en': {
    // -- brand --
    'brand': 'MD<span>·</span>Reader',
    'brand-short': 'MD Reader',

    // -- index.html --
    'page-title': 'MD Reader — Open Markdown Files Online, No Upload',
    'meta-desc': 'Open and preview .md Markdown files right in your browser. Supports local files and URL import. No login, no upload, works offline. Add to home screen as an app.',
    'og-title': 'MD Reader — Open Markdown Files Online',
    'og-desc': 'Drop a .md file and read it instantly. 100% local, no upload. Add to home screen.',
    'schema-name': 'MD Reader',
    'schema-desc': 'Open and preview Markdown files in your browser. No upload, add to home screen.',
    'nav-about': 'About',
    'btn-install': '+ Add to Home Screen',
    'hero-title': 'Markdown Reader',
    'hero-sub': 'Drop a .md file and read it right here — beautifully formatted. No upload, no login, 100% in your browser.',
    'dropzone-big': 'Tap to select, or drop a .md file here',
    'dropzone-small': 'Supports .md / .markdown / .txt · Your file never leaves your device',
    'url-placeholder': 'Or paste a link, e.g. https://raw.githubusercontent.com/…',
    'url-btn': 'Open',
    'demo-link': 'Try a demo →',
    'howto-link': 'How to add to home screen?',
    'toolbar-source': 'View Source',
    'toolbar-rendered': 'View Rendered',
    'toolbar-save': 'Save .html',
    'toolbar-pdf': 'Print PDF',
    'toolbar-copy': 'Copy',
    'toolbar-expand': 'Expand',
    'toolbar-expand-exit': 'Exit',
    'toolbar-fullscreen': 'Fullscreen',
    'toolbar-fullscreen-exit': 'Exit fullscreen',
    'footer-home': 'MD Reader · Free · No Upload · Add to Home Screen — <a href="/about">About</a> · <a href="/privacy">Privacy</a>',
    'install-done': '✅ Added to home screen. Open from your home screen next time.',
    'empty-file': '(empty file)',

    // status messages (app.js)
    'status-not-md': '⚠️ Not a Markdown file. Please select a .md / .markdown / .txt file.',
    'status-reading': 'Reading…',
    'status-ok-local': '✅ Opened locally. Your file was not uploaded.',
    'status-read-error': '❌ Failed to read file.',
    'status-no-url': 'Please paste a link first.',
    'status-bad-url': 'URL must start with http:// or https://',
    'status-fetching': 'Fetching…',
    'status-ok-url': '✅ Imported from URL.',
    'status-fetch-error': '❌ Import failed: {0}. Make sure it is a raw Markdown URL (e.g. raw.githubusercontent.com/…), or download the file and open it locally.',
    'status-copied-rich': '📋 Copied (rich text — paste into Word, email, etc.).',
    'status-copied-plain': '📋 Copied as plain text.',
    'status-demo': '✅ Demo loaded. Drop your own .md file to try it out.',
    'status-refreshed': '🔄 Content auto-refreshed',

    // history
    'history-title': 'Recent',
    'history-empty': 'No history',
    'history-reopen': 'Open',
    'history-reselect': 'Reselect',
    'history-delete': 'Delete',

    // manual reload
    'reload-btn': '🔄',
    'reload-loading': 'Refreshing…',
    'reload-ok': '✅ Refreshed',
    'reload-unchanged': 'No changes',
    'reload-no-content': 'Open a file first',
    'reload-error': '❌ Refresh failed',
    'reload-replaced': '⚠️ File was replaced by editor, please reselect',

    // auto-refresh
    'refresh-on': 'Auto',
    'refresh-off': 'Auto',

    // share link
    'share-copy': 'Share',
    'share-copied': '✅ Link copied!',
    'share-too-large': '⚠️ Content too long, link may be truncated',
    'share-title': 'Shared content',
    'share-decode-error': '⚠️ Cannot decode share link',
    'share-no-content': 'Open a file first',
    'share-error': 'Failed to generate link',
    'share-dialog-title': 'Share document',
    'share-dialog-copy': 'Copy link',
    'share-dialog-copied': '✅ Copied',
    'share-dialog-close': 'Close',
    'share-dialog-size': 'File',
    'share-dialog-chars': 'Compressed',

    // demo content
    'demo-h1': 'Markdown Demo',
    'demo-h2': 'Welcome to MD Reader 🎉',
    'demo-p': 'This is a live preview of <strong>GitHub-Flavored Markdown</strong>.',
    'demo-h3-features': 'Features',
    'demo-li1': '🚀 Instant rendering',
    'demo-li2': '🔒 100% local, no upload',
    'demo-li3': '📱 Works on phone, tablet, desktop',
    'demo-li4': '📲 Installable as an app',
    'demo-h3-code': 'Code Block',
    'demo-code': 'Hello, {0}!',
    'demo-h3-table': 'Table',
    'demo-th1': 'Feature',
    'demo-th2': 'Supported',
    'demo-td1': 'Tables',
    'demo-td2': 'Task lists',
    'demo-td3': 'Strikethrough',
    'demo-td4': '~~yes~~ ✅',
    'demo-td5': 'Code blocks',
    'demo-h3-tasks': 'Task List',
    'demo-task1': 'Open a local .md file',
    'demo-task2': 'Import from a URL',
    'demo-task3': 'Upload to a server (never!)',
    'demo-tip': 'Tip: tap "+ Add to Home Screen" in the top right to install this as an app.',
    'demo-link-gfm': 'GitHub-Flavored Markdown Spec',
    'demo-link-how': 'Installation steps',

    // about.html
    'about-title': 'About — MD Reader',
    'about-meta-desc': 'MD Reader is a free online Markdown reader — no upload, no login. Add to home screen as an app. Read about features, installation steps, and FAQ.',
    'about-nav-home': 'Home',
    'about-nav-privacy': 'Privacy',
    'about-h1': 'About MD Reader',
    'about-lead': 'Built for a simple reason: you get sent a <code>.md</code> file on your phone, and you just want to read it — without installing an app or uploading it to someone else\'s server.',
    'about-h2-features': 'What it does',
    'about-f1': '<strong>Open local files</strong>: tap or drop a <code>.md</code> / <code>.markdown</code> / <code>.txt</code> file and see it rendered instantly.',
    'about-f2': '<strong>Import from a URL</strong>: paste a raw Markdown link (e.g. a GitHub raw URL) and open it.',
    'about-f3': '<strong>Export</strong>: save as PDF, download as .html, or copy as rich text to paste into Word, email, etc.',
    'about-f4': '<strong>Toggle views</strong>: switch between rendered output and raw source anytime.',
    'about-f5': '<strong>Install as an app</strong>: add to your home screen for offline access, just like a native app.',
    'about-h2-install': 'How to add to your home screen',
    'about-install-intro': 'Once added, you will see an icon on your home screen. Tap it to open the reader — just like a native app, even offline. Instructions by platform:',
    'about-install-harmonyos': '🟢 HarmonyOS',
    'about-install-harmonyos-desc': 'Open this page in your browser → tap the menu (bottom or top-right) → select "<strong>Add to home screen</strong>" → confirm.',
    'about-install-android': '🤖 Android',
    'about-install-android-desc': 'Open in Chrome or your default browser → tap the menu "⋮" → "<strong>Add to Home Screen</strong>" / "Install app" → confirm.',
    'about-install-ios': '🍎 iPhone / iPad',
    'about-install-ios-desc': 'You must use <strong>Safari</strong>. Open this page → tap the Share button (box with arrow) → "<strong>Add to Home Screen</strong>" → Add.',
    'about-install-desktop': '💻 Windows / Mac',
    'about-install-desktop-desc': 'Open in Chrome or Edge → click the Install icon in the address bar (screen with down arrow) → Install. You can also find "Install this app" in the browser menu.',
    'about-install-tip': '💡 If you see an "+ Add to Home Screen" button at the top of the homepage, just tap that.',
    'about-h2-privacy': 'Why no-upload matters',
    'about-privacy-desc': 'All parsing and rendering happens right in your browser. Your files are never sent to any server. This means: faster (no upload wait), more private (contracts, notes, documents stay on your device), and works offline. You can verify this — open browser DevTools and check the Network tab: after the page loads, there are zero upload requests.',
    'about-h2-syntax': 'Supported Markdown syntax',
    'about-syntax-desc': 'Full GitHub-Flavored Markdown (GFM) support: headings, lists, tables, task lists, strikethrough, blockquotes, links, images, fenced code blocks with language detection, and inline HTML. Renders just like GitHub or Notion.',
    'about-h2-faq': 'FAQ',
    'about-faq-q1': 'Are my files uploaded?',
    'about-faq-a1': 'No. All processing is done locally in your browser with <code>marked.js</code>. Your files never leave your device.',
    'about-faq-q2': 'Does it work offline?',
    'about-faq-a2': 'Yes. The first visit caches the app locally. After that you can open local <code>.md</code> files even without internet. Installing to your home screen gives the best offline experience.',
    'about-faq-q3': 'How is this different from the built-in text viewer?',
    'about-faq-a3': 'Your phone\'s text viewer shows raw markup (<code># Title</code>, <code>**bold**</code>) — hard to read. This tool renders it into proper headings, bold text, tables, and code blocks, just like you\'d see on GitHub.',
    'about-faq-q4': 'Why does URL import fail?',
    'about-faq-a4': 'You need to use a <strong>raw</strong> Markdown URL, e.g. <code>raw.githubusercontent.com/…</code>, not a regular web page. Some sites block cross-origin requests — if that happens, download the file and open it locally.',
    'about-faq-q5': 'Is it free? Do I need an account?',
    'about-faq-a5': 'Completely free. No login, no signup, no account system at all.',
    'about-h2-tech': 'Tech',
    'about-tech-desc': 'Static site — HTML + CSS + vanilla JS, no backend, no database, no build step. Markdown parsing by <a href="https://github.com/markedjs/marked" target="_blank" rel="noopener">marked.js</a>. Local file reading via the browser File API. Offline support via Service Worker. Installation via Web App Manifest (PWA). No tracking, no third-party analytics.',
    'about-back': '← Back to reader',
    'about-footer': 'MD Reader · Free · No Upload — <a href="/">Home</a> · <a href="/about">About</a> · <a href="/privacy">Privacy</a>',

    // privacy.html
    'privacy-title': 'Privacy — MD Reader',
    'privacy-meta-desc': 'MD Reader privacy policy: no data collection, no file upload, no tracking.',
    'privacy-h1': 'Privacy Policy',
    'privacy-updated': 'Last updated: June 24, 2026',
    'privacy-h2-tldr': 'TL;DR',
    'privacy-tldr': 'We collect nothing. Your files never leave your device. No analytics, no cookies, no tracking.',
    'privacy-h2-nope': 'What we don\'t do',
    'privacy-nope1': '<strong>No file upload</strong>: all Markdown parsing runs locally in your browser with <code>marked.js</code>. Your <code>.md</code> files stay on your device.',
    'privacy-nope2': '<strong>No analytics</strong>: we don\'t use any third-party analytics or tracking pixels.',
    'privacy-nope3': '<strong>No cookies</strong>: we don\'t set any cookies (the only local storage is the Service Worker cache for offline use).',
    'privacy-nope4': '<strong>No personal data</strong>: we don\'t ask for your name, email, or any account information.',
    'privacy-h2-host': 'What our host may log',
    'privacy-host': 'This site is hosted on Cloudflare Pages. Cloudflare may log anonymous infrastructure data (e.g. request counts, bandwidth). This is standard for any site hosted on Cloudflare. See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare\'s Privacy Policy</a>.',
    'privacy-h2-cdn': 'Third-party CDN',
    'privacy-cdn': 'We load <code>marked.js</code> from jsDelivr (<code>cdn.jsdelivr.net</code>). jsDelivr may log anonymous request data per their privacy policy. See <a href="https://www.jsdelivr.com/terms/privacy-policy" target="_blank" rel="noopener">jsDelivr Privacy Policy</a>.',
    'privacy-h2-contact': 'Contact',
    'privacy-contact': 'Questions? Email <a href="mailto:hello@mdreader.xyz">hello@mdreader.xyz</a>.',
    'privacy-back': '← Back home',
    'privacy-footer': 'MD Reader · Free · No Upload — <a href="/">Home</a> · <a href="/about">About</a> · <a href="/privacy">Privacy</a>',

    // manifest.json
    'manifest-name': 'MD Reader — Markdown Preview',
    'manifest-short': 'MD Reader',
    'manifest-desc': 'Open and preview Markdown files in your browser. No upload. Add to home screen.',

    // lang switcher
    'lang-label': '中文',
  }
};

window._lang = 'en';

// Detect or load language preference
(function initLang() {
  var saved = localStorage.getItem('mdreader_lang');
  if (saved && window.I18N[saved]) {
    window._lang = saved;
  } else {
    var nav = navigator.language || '';
    window._lang = nav.startsWith('zh') ? 'zh-CN' : 'en';
  }
  document.documentElement.lang = window._lang === 'zh-CN' ? 'zh-CN' : 'en';
})();

// Translate helper — call from anywhere
function t(key) {
  var dict = window.I18N[window._lang] || window.I18N['en'];
  return dict[key] !== undefined ? dict[key] : key;
}

// Apply translations to DOM
function initI18n() {
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    var text = t(key);
    if (!text) return;
    // Handle inputs: translate placeholder
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.setAttribute('placeholder', text);
      return;
    }
    // Handle meta tags: translate content attribute
    if (el.tagName === 'META') {
      el.setAttribute('content', text);
      return;
    }
    // Default: translate innerHTML
    el.innerHTML = text;
  });

  // Update title and meta
  var titleKey = (function() {
    var path = location.pathname.replace(/\/$/, '');
    if (path === '' || path === '/') return 'page-title';
    if (path === '/about' || path === '/about.html') return 'about-title';
    if (path === '/privacy' || path === '/privacy.html') return 'privacy-title';
    return 'page-title';
  })();
  document.title = t(titleKey);

  var metaKey = (function() {
    var path = location.pathname.replace(/\/$/, '');
    if (path === '' || path === '/') return 'meta-desc';
    if (path === '/about' || path === '/about.html') return 'about-meta-desc';
    if (path === '/privacy' || path === '/privacy.html') return 'privacy-meta-desc';
    return 'meta-desc';
  })();
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t(metaKey));

  // Update og tags
  var ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', t('og-title'));
  var ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', t('og-desc'));

  // Update lang switch button text
  var ls = document.getElementById('langSwitch');
  if (ls) ls.textContent = t('lang-label');
}

function switchLang() {
  window._lang = (window._lang === 'zh-CN') ? 'en' : 'zh-CN';
  localStorage.setItem('mdreader_lang', window._lang);
  document.documentElement.lang = window._lang === 'zh-CN' ? 'zh-CN' : 'en';
  initI18n();
  // Re-render markdown if viewer is visible (updates demo content)
  if (typeof currentRaw !== 'undefined' && currentRaw) {
    if (typeof render === 'function') render(currentRaw, currentFileName);
  }
}

document.addEventListener('DOMContentLoaded', initI18n);
