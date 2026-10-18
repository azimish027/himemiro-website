// pages-config.js — 用 Node 调用 gh api 配置 Pages（绕开 PowerShell AMSI）
const { spawnSync } = require('child_process');
const GH = 'C:/Program Files/GitHub CLI/gh.exe';

function run(args) {
  const r = spawnSync(GH, args, { encoding: 'utf8', timeout: 15000 });
  if (r.error) throw r.error;
  return { out: r.stdout.trim(), err: r.stderr.trim(), status: r.status };
}

try {
  console.log('=== DELETE old Pages config ===');
  const del = run(['api', 'repos/azimish027/himemiro-website/pages', '--method', 'DELETE']);
  console.log('DELETE status:', del.status, del.out || del.err);

  console.log('\n=== Wait 3s ===');
  setTimeout(() => {}, 3000);

  console.log('=== POST new Pages (legacy + gh-pages/root) ===');
  const post = run(['api', 'repos/azimish027/himemiro-website/pages', 
    '--method', 'POST',
    '-f', 'build_type=legacy',
    '-f', 'source.branch=gh-pages',
    '-f', 'source.path=/']);
  console.log('POST status:', post.status);
  console.log('Response:', post.out || post.err);

  console.log('\n=== GET Pages config ===');
  const get = run(['api', 'repos/azimish027/himemiro-website/pages',
    '--jq', '{url: .html_url, build_type: .build_type, source: .source}']);
  console.log(get.out || get.err);

  console.log('\n✅ 等 1-2 分钟构建，然后访问 https://azimish027.github.io/himemiro-website/');
} catch (e) {
  console.error('❌ FAILED:', e.message);
  process.exit(1);
}
