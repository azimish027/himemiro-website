const { spawnSync } = require('child_process');
const GH = 'C:/Program Files/GitHub CLI/gh.exe';
function run(args) {
  const r = spawnSync(GH, args, { encoding: 'utf8', timeout: 15000 });
  return r.stdout.trim() + ' ' + (r.stderr.trim() ? 'ERR:' + r.stderr.trim() : '');
}
console.log('=== Pages ===');
console.log(run(['api','repos/azimish027/himemiro-website/pages']));
console.log('\n=== Builds ===');
console.log(run(['api','repos/azimish027/himemiro-website/pages/builds']));
console.log('\n=== Latest build ===');
console.log(run(['api','repos/azimish027/himemiro-website/pages/latest-build']));
