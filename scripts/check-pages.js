// check-pages.js — 查 Pages 真实状态 + builds
const { spawnSync } = require('child_process');
const GH = 'C:/Program Files/GitHub CLI/gh.exe';

function run(args) {
  const r = spawnSync(GH, args, { encoding: 'utf8', timeout: 15000 });
  return r.stdout.trim() + '\n' + (r.stderr.trim() ? 'ERR: ' + r.stderr.trim() : '');
}

console.log('=== Pages API ===');
console.log(run(['api', 'repos/azimish027/himemiro-website/pages']));

console.log('\n=== Pages Builds ===');
console.log(run(['api', 'repos/azimish027/himemiro-website/pages/builds', '--jq', '.[0]']));

console.log('\n=== gh-pages branch files ===');
console.log(run(['api', 'repos/azimish027/himemiro-website/contents?ref=gh-pages']));
