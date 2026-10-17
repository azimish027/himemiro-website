// HIMEMIRO 素材表自动抠图脚本
// 用法：node scripts/extract-assets.mjs
// 原理：sharp 读取每张素材表 PNG，检测 alpha 通道 → 找每个不透明区域的 bounding box → 裁剪导出
// 依赖：npm i sharp（如果没装，用 esbuild 单文件 bundle 或直接 npm install）
//
// 注意：素材表如果是**白底拼图**（不是透明底），alpha 通道检测会失败。
//       脚本会先报告每张素材表的背景类型（transparent / white / mixed），
//       只有 transparent 才自动切，其他的报告坐标让你手动抠。

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_DIR = 'C:/Users/13458/.trae-cn/attachments';
const OUTPUT_DIR = 'D:/品牌项目/website/assets';

const SHEETS = [
  { file: '023e71bf-b04a-44ae-857f-5ca9f748da6c_858d6621-df62-4819-85df-a44619ae7dfb_哥特萝莉天使恶魔角色素材表.png', name: 'angel-materials' },
  { file: '199eea17-0a3e-43a9-b97c-3892023489d7_12978e22-250b-41be-9791-a9d32fab638f_粉色哥特萝莉角色素材表.png', name: 'angel-ui-materials' },
  { file: 'ebdd4948-599c-4c1b-85d5-d01667f513eb_a50df2e8-559a-4f0b-aee5-755541b806a5_哥特洛丽塔角色资产贴纸表.png', name: 'purple-materials' },
];

// 立绘 PNG（直接单独保存，不需要抠）
const STANDALONE = [
  { file: '3a90a8e2-5de4-493f-af93-d488ff95014f_dbae72c5-6a02-4f3b-bf93-9fc638df8a4d_粉发绿眸哥特萝莉角色立绘.png', name: 'characters/angel-full' },
  { file: 'f66221f3-12ca-4ed7-9459-4b83a569d7cc_f15712e1-dd36-4dff-9515-7c6a14e856bd_哥特洛丽塔少女与复古兔偶.png', name: 'characters/purple-full' },
];

// 表情包文件夹（直接复制）
const EMOJI_DIRS = [
  { src: 'D:/品牌项目/粉毛锁天使表情包', dst: 'characters/angel-chibi' },
  { src: 'D:/品牌项目/紫玫瑰大小姐表情包', dst: 'characters/purple-chibi' },
];

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(path.join(OUTPUT_DIR, 'characters'), { recursive: true });

// ---- 阶段 1：先把立绘和表情包复制过去 ----
console.log('== 阶段 1：复制立绘 + 表情包 ==');
for (const s of STANDALONE) {
  const src = path.join(INPUT_DIR, s.file);
  const dst = path.join(OUTPUT_DIR, `${s.name}.png`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`  ✅ ${s.name}.png`);
  } else {
    console.log(`  ❌ 找不到 ${src}`);
  }
}
for (const d of EMOJI_DIRS) {
  const dstDir = path.join(OUTPUT_DIR, d.dst);
  fs.mkdirSync(dstDir, { recursive: true });
  if (fs.existsSync(d.src)) {
    for (const f of fs.readdirSync(d.src)) {
      if (f.endsWith('.png')) {
        fs.copyFileSync(path.join(d.src, f), path.join(dstDir, f));
      }
    }
    console.log(`  ✅ ${d.dst}/ (${fs.readdirSync(d.src).filter(f=>f.endsWith('.png')).length} files)`);
  } else {
    console.log(`  ❌ 找不到 ${d.src}`);
  }
}

// ---- 阶段 2：检测素材表背景类型 ----
console.log('\n== 阶段 2：检测素材表背景 ==');
for (const sheet of SHEETS) {
  const src = path.join(INPUT_DIR, sheet.file);
  if (!fs.existsSync(src)) { console.log(`  ❌ ${sheet.name}: file not found`); continue; }

  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const bgSample = { transparent: 0, white: 0, other: 0 };
  const borderThickness = 8;

  // 采样四条边的像素判断背景
  for (let x = 0; x < w; x++) {
    for (const y of [0, borderThickness-1, h-borderThickness, h-1]) {
      const i = (y * w + x) * 4;
      const a = data[i+3];
      if (a < 10) bgSample.transparent++;
      else if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) bgSample.white++;
      else bgSample.other++;
    }
  }
  for (let y = 0; y < h; y++) {
    for (const x of [0, borderThickness-1, w-borderThickness, w-1]) {
      const i = (y * w + x) * 4;
      const a = data[i+3];
      if (a < 10) bgSample.transparent++;
      else if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) bgSample.white++;
      else bgSample.other++;
    }
  }

  const total = bgSample.transparent + bgSample.white + bgSample.other;
  const bgType = bgSample.transparent / total > 0.5 ? 'TRANSPARENT' : bgSample.white / total > 0.5 ? 'WHITE' : 'MIXED';
  console.log(`  ${sheet.name}: ${bgType} (透明${bgSample.transparent}/${total}, 白${bgSample.white}/${total}, 其他${bgSample.other}/${total})`);

  // 只有透明底才自动切
  if (bgType === 'TRANSPARENT') {
    await autoExtractTransparent(src, sheet.name, w, h);
  } else {
    console.log(`    → 白底/混合底，跳过自动切图。需要你手动抠或提供坐标。`);
  }
}

// ---- 阶段 3：透明底自动抠图 ----
async function autoExtractTransparent(src, sheetName, w, h) {
  console.log(`    → 尝试自动抠图...`);
  const outDir = path.join(OUTPUT_DIR, sheetName);
  fs.mkdirSync(outDir, { recursive: true });

  // binarize alpha channel → 找连通区域
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const mask = new Uint8Array(info.width * info.height);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    mask[p] = data[i+3] > 10 ? 1 : 0;
  }

  // 简单洪水填充找连通区域
  const labeled = new Int32Array(info.width * info.height);
  let label = 0;
  const boxes = []; // {label, x0, y0, x1, y1}
  const queue = [];

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = y * info.width + x;
      if (mask[idx] && !labeled[idx]) {
        label++;
        const box = { label, x0: x, y0: y, x1: x, y1: y, count: 0 };
        queue.push([x, y]);
        labeled[idx] = label;
        while (queue.length) {
          const [cx, cy] = queue.shift();
          box.x0 = Math.min(box.x0, cx); box.x1 = Math.max(box.x1, cx);
          box.y0 = Math.min(box.y0, cy); box.y1 = Math.max(box.y1, cy);
          box.count++;
          for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nx = cx+dx, ny = cy+dy;
            const ni = ny*info.width+nx;
            if (nx>=0 && nx<info.width && ny>=0 && ny<info.height && mask[ni] && !labeled[ni]) {
              labeled[ni] = label; queue.push([nx, ny]); labeled[ni] = label;
            }
          }
        }
        // 只保留面积 > 300px 的区域（过滤杂点）
        if (box.count > 300) boxes.push(box);
      }
    }
  }

  console.log(`    检测到 ${boxes.length} 个独立元素 (过滤 <300px)`);

  // 裁剪导出
  for (const box of boxes) {
    const x = box.x0 - 2, y = box.y0 - 2;
    const bw = box.x1 - box.x0 + 4, bh = box.y1 - box.y0 + 4;
    const outFile = path.join(outDir, `${sheetName}-${String(box.label).padStart(3,'0')}.png`);
    try {
      await sharp(src).extract({ left: Math.max(0,x), top: Math.max(0,y), width: bw, height: bh }).png().toFile(outFile);
    } catch(e) { console.log(`    ❌ ${sheetName}-${box.label}: ${e.message}`); }
  }
  console.log(`    ✅ 导出 ${boxes.length} 张到 ${outDir}/`);
}

console.log('\n完成！');
