# MD 阅读器

在线 Markdown 阅读工具 — 在浏览器里打开 .md 文件。免费、本地、不上传、可添加到桌面。

面向中国用户（鸿蒙 / 安卓 / iOS / 电脑全支持），PWA 可安装到桌面。

## 本地预览

```bash
python3 -m http.server 8080
# 打开 http://localhost:8080
# 加 ?demo 看示例内容
```

## 功能

- 拖入本地 .md 文件 → 即时排版
- 粘贴 Markdown 直链 → 导入渲染
- 添加到桌面（PWA，支持离线）
- 导出 PDF / 存为网页 / 一键复制（带格式）
- 排版 ↔ 源码 切换
- ⌘V / Ctrl+V 从剪贴板粘贴文件
- 100% 前端，无后端

## 页面分工

- `index.html` — 极简工具页（首页只放工具）
- `about.html` — 详细介绍 + 添加到桌面步骤 + 常见问题
- `privacy.html` — 隐私说明

## 部署

```bash
./set-domain.sh https://your-domain.com hello@your-domain.com
# 部署到 Cloudflare Pages
```

## 文件

- `index.html` — 主应用（极简）
- `assets/app.js` — 逻辑（文件/链接加载、marked.js 渲染、导出、添加到桌面）
- `assets/styles.css` — 简洁浅色主题，移动优先，跟随系统夜间
- `manifest.json` / `sw.js` — PWA
- `about.html` / `privacy.html` — 静态页
- `robots.txt` / `sitemap.xml` — SEO
- `set-domain.sh` — 域名占位替换
