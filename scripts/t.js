// t.js — 单命令触发 Pages
const { execSync } = require('child_process');
const fs = require('fs');

const repo = 'D:/品牌项目/website';
const git = 'D:/Git/cmd/git.exe';
const proxies = '-c http.proxy=http://127.0.0.1:7897 -c https.proxy=http://127.0.0.1:7897';

function run(cmd) {
  console.log('$ ' + cmd);
  try {
    return execSync(cmd, { encoding: 'utf8', timeout: 30000 }).trim();
  } catch(e) {
    return (e.stdout || '').trim() + '\nERR: ' + (e.stderr || '').trim();
  }
}

// 先改 .nojekyll
fs.writeFileSync(repo + '/.nojekyll', `trigger ${Date.now()}\n`);

run(`"${git}" ${proxies} -C "${repo}" checkout gh-pages`);
run(`"${git}" ${proxies} -C "${repo}" add .nojekyll`);
run(`"${git}" ${proxies} -C "${repo}" commit -m "chore: trigger pages" --allow-empty`);
run(`"${git}" ${proxies} -C "${repo}" push origin gh-pages -f`);
run(`"${git}" ${proxies} -C "${repo}" checkout main`);
console.log('\n✅ DONE! Wait 60s then open: https://azimish027.github.io/himemiro-website/');
