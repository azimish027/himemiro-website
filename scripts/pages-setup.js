// pages-setup.js — 创建 gh-pages 分支 + 设置 Pages 源
const { spawnSync } = require('child_process');
const GIT = 'D:/Git/cmd/git.exe';
const REPO = 'D:/品牌项目/website';
const PROXY = ['-c', 'http.proxy=http://127.0.0.1:7897', '-c', 'https.proxy=http://127.0.0.1:7897'];

function run(args) {
  const r = spawnSync(GIT, [...PROXY, '-C', REPO, ...args], { encoding: 'utf8', timeout: 30000 });
  if (r.error) throw r.error;
  return r.stdout.trim() + '\n' + (r.stderr.trim() || '');
}

try {
  console.log('=== 检查 gh-pages 分支是否存在 ===');
  const lsRemote = run(['ls-remote', '--heads', 'origin']);
  console.log(lsRemote);

  if (!lsRemote.includes('gh-pages')) {
    console.log('\n=== 创建 gh-pages 分支 (从 main 切出) ===');
    console.log(run(['checkout', '-b', 'gh-pages']));
    console.log(run(['push', '-u', 'origin', 'gh-pages']));
    console.log(run(['checkout', 'main']));
  } else {
    console.log('\n=== gh-pages 已存在，直接推送 ===');
    console.log(run(['checkout', 'gh-pages']));
    console.log(run(['merge', 'main', '--no-edit']));
    console.log(run(['push', 'origin', 'gh-pages']));
    console.log(run(['checkout', 'main']));
  }

  console.log('\n✅ gh-pages 分支就绪');
} catch (e) {
  console.error('❌ FAILED:', e.message);
  process.exit(1);
}
