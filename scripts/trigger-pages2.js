// trigger-pages2.js — allow-empty commit
const { spawnSync } = require('child_process');
const GIT = 'D:/Git/cmd/git.exe';
const PROXY = ['-c', 'http.proxy=http://127.0.0.1:7897', '-c', 'https.proxy=http://127.0.0.1:7897'];
const REPO = 'D:/品牌项目/website';

function run(args) {
  const r = spawnSync(GIT, [...PROXY, '-C', REPO, ...args], { encoding: 'utf8', timeout: 30000 });
  return r.stdout.trim() + '\n' + (r.stderr.trim() || '');
}

try {
  run(['checkout', 'gh-pages']);
  const fs = require('fs');
  fs.writeFileSync(REPO + '/.nojekyll', `# HIMEMIRO Pages\n# Trigger build ${Date.now()}\n`);
  console.log(run(['add', '.nojekyll']));
  console.log(run(['commit', '-m', 'chore(pages): trigger rebuild', '--allow-empty']));
  console.log(run(['push', 'origin', 'gh-pages', '-f']));
  run(['checkout', 'main']);
  console.log('✅ DONE! 等 60s 访问 https://azimish027.github.io/himemiro-website/');
} catch(e) { console.error(e.message); process.exit(1); }
