// HIMEMIRO 官网 — 本地开发预览 server（Node 原生 http，零依赖）
// 用法：node website/server.js
// 打开：http://127.0.0.1:4331/
// 注意：这不是生产部署用的。生产部署到 Neocities 时只需要 website/index.html + shared/tokens.css 两个文件。
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const mime = {
  '.html': 'text/html;charset=utf-8',
  '.css':  'text/css;charset=utf-8',
  '.js':   'application/javascript;charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.gif':  'image/gif',
};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url === '/' ? '/website/index.html' : req.url);
  // 路径修正：除了 /shared/ 开头的共享资源，其余都指向 /website/ 目录
  if (!p.startsWith('/shared/') && !p.startsWith('/website/')) {
    p = '/website' + p;
  }
  const fp = path.join(root, p);
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found: ' + fp); return; }
    const ext = path.extname(fp).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(4331, () => console.log('HIMEMIRO server running at http://127.0.0.1:4331'));
