// trigger-pages.js — gh-pages 空 commit 触发 Pages 构建
const { spawnSync } = require('child_process');
const GIT = 'D:/Git/cmd/git.exe';
const PROXY = ['-c', 'http.proxy=http://127.0.0.1:7897', '-c', 'https.proxy=http://127.0.0.1:7897'];
const REPO = 'D:/品牌项目/website';

function run(args) {
  const r = spawnSync(GIT, [...PROXY, '-C', REPO, ...args], { encoding: 'utf8', timeout: 30000 });
  return r.stdout.trim() + '\n' + (r.stderr.trim() || '');
}

try {
  console.log('=== 切 gh-pages ===');
  console.log(run(['checkout', 'gh-pages']));

  console.log('\n=== 空 commit (触发 Pages) ===');
  // 触碰 .nojekyll 来制造变更
  const fs = require('fs');
  const p = REPO + '/.nojekyll';
  fs.utimesSync(p, new Date(), new Date());
  console.log(run(['add', '.nojekyll']));
  console.log(run(['commit', '-m', 'chore: trigger pages build']));

  console.log('\n=== push ===');
  console.log(run(['push', 'origin', 'gh-pages', '--force']));

  console.log('\n=== 切回 main ===');
  console.log(run(['checkout', 'main']));

  console.log('\n✅ Pages 构建已触发，等 1-2 分钟后访问 https://azimish027.github.io/himemiro-website/');
} catch (e) {
  console.error('FAILED:', e.message);
  process.exit(1);
}
