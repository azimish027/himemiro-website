// pages-put.js — PUT 修改 Pages 配置
const { spawnSync } = require('child_process');
const GH = 'C:/Program Files/GitHub CLI/gh.exe';

function run(args) {
  const r = spawnSync(GH, args, { encoding: 'utf8', timeout: 15000 });
  return { out: r.stdout.trim(), err: r.stderr.trim(), status: r.status };
}

try {
  // 尝试 PUT 修改
  console.log('=== PUT 修改 Pages ===');
  const put = run(['api', 'repos/azimish027/himemiro-website/pages',
    '--method', 'PUT',
    '-f', 'build_type=legacy',
    '-f', 'source.branch=gh-pages',
    '-f', 'source.path=/']);
  console.log('PUT status:', put.status);
  console.log('Response:', put.out || put.err);

  // 如果 PUT 不行，试直接设置 source
  if (put.status !== 0 || put.err.includes('422')) {
    console.log('\n=== PUT v2 (只改 source) ===');
    const put2 = run(['api', 'repos/azimish027/himemiro-website/pages',
      '--method', 'PUT',
      '--input', '-'], '{"build_type":"legacy","source":{"branch":"gh-pages","path":"/"}}');
    // 不行，直接传 JSON body
    const put3 = run(['api', 'repos/azimish027/himemiro-website/pages',
      '--method', 'PUT',
      '--field', 'build_type=legacy',
      '--field', 'source.branch=gh-pages',
      '--field', 'source.path=/']);
    console.log('PUT v2 status:', put3.status);
    console.log('PUT v2 response:', put3.out || put3.err);
  }

  console.log('\n=== 最终状态 ===');
  const get = run(['api', 'repos/azimish027/himemiro-website/pages', '--jq', '{url: .html_url, build_type: .build_type, source: .source}']);
  console.log(get.out || get.err);
} catch (e) {
  console.error('FAILED:', e.message);
}
