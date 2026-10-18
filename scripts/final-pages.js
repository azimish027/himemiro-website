// final-pages.js — 最简 PUT 尝试
const { spawnSync } = require('child_process');
const GH = 'C:/Program Files/GitHub CLI/gh.exe';

function run(args) {
  const r = spawnSync(GH, args, { encoding: 'utf8', timeout: 15000 });
  return { out: r.stdout.trim(), err: r.stderr.trim(), status: r.status };
}

// 先试：单独改 source
console.log('=== 尝试 source-only PUT ===');
const r1 = run(['api', 'repos/azimish027/himemiro-website/pages',
  '-X', 'PUT',
  '--field', 'source[branch]=gh-pages',
  '--field', 'source[path]=/']);
console.log('status:', r1.status);
console.log(r1.out || r1.err);

console.log('\n=== 最终 GET ===');
const r2 = run(['api', 'repos/azimish027/himemiro-website/pages',
  '--jq', '{build_type: .build_type, source_branch: .source.branch, source_path: .source.path}']);
console.log(r2.out || r2.err);
