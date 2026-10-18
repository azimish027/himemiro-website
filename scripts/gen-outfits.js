// HIMEMIRO AI Outfit Generator v1.0
// 硅基流动 Qwen-Image-Edit-2509 换装素材批量生成
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const API_KEY = process.env.SILICONFLOW_API_KEY;
if (!API_KEY) { console.error('❌ SILICONFLOW_API_KEY not set'); process.exit(1); }

const API_URL = 'https://api.siliconflow.cn/v1/images/generations';
const MODEL = 'Qwen/Qwen-Image-Edit-2509';
const BASE_DIR = 'D:/品牌项目/website/assets/dressup';

// ===== 工具函数 =====
function fileToBase64(filePath) {
  const data = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1);
  return `data:image/${ext};base64,${data.toString('base64')}`;
}

function httpsRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname, port: u.port || 443, path: u.pathname + u.search,
      method: options.method || 'POST',
      headers: options.headers || {}
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      const out = fs.createWriteStream(destPath);
      res.pipe(out);
      out.on('finish', () => { out.close(); resolve(destPath); });
      out.on('error', reject);
    }).on('error', reject);
  });
}

// ===== 换装 Prompt 模板库 =====
// 煤咪露 (angel) 粉发绿眸哥特萝莉
// 巡夢姬 (purple) 金紫发哥特洛丽塔
const OUTFITS = [
  {
    name: 'angel-sweater-cream',
    desc: '奶油毛衣',
    prompt: "Keep the character's face, hair, body pose and identity EXACTLY the same. Only change her clothing: replace the current gothic outfit with a cozy cream-colored oversized knit sweater, slightly baggy, with soft rolled cuffs. Keep everything else unchanged - same face, same pink hair with black bows, same halo, same crucifix earrings, same pose. Photorealistic anime style, soft pastel lighting."
  },
  {
    name: 'angel-dress-candy',
    desc: '糖果色连衣裙',
    prompt: "Keep the character's face, hair, body pose and identity EXACTLY the same. Only change her clothing: replace the current gothic outfit with a cute candy-colored pinafore dress in orange-red and cranberry pink, with a white blouse underneath, ruffles at the hem. Keep everything else unchanged - same face, same pink hair, same accessories, same pose. Anime style, pastel color palette."
  },
  {
    name: 'angel-uniform-school',
    desc: '哥特校服',
    prompt: "Keep the character's face, hair, body pose and identity EXACTLY the same. Only change her clothing: replace current outfit with a dark gothic school uniform - black blazer jacket with gold trim, white lace collar, pleated dark skirt, black ribbon tie. Keep halo, crucifix accessories, pink hair with black bows completely unchanged. Same pose. Dark chocolate and orange-red color scheme."
  },
  {
    name: 'purple-elegant-lolita',
    desc: '紫色优雅洛丽塔',
    prompt: "Keep the character's face, hair, body pose and identity EXACTLY the same. Only change her clothing: replace the current outfit with an elegant violet-purple gothic lolita dress with intricate lace details, a fitted bodice, and a full layered skirt with black ribbon bows. Keep her long wavy blonde-purple hair with rose decorations, the stuffed rabbit plush, and her pose completely unchanged. Rich dark purple and black palette with cream lace accents."
  },
  {
    name: 'purple-summer-light',
    desc: '夏季清凉装',
    prompt: "Keep the character's face, hair, body pose and identity EXACTLY the same. Only change her clothing: replace current outfit with a light summer dress in soft mint green and cream, sleeveless with thin straps, delicate eyelet lace pattern, flowing midi length skirt. Keep her long wavy hair, plush rabbit, and pose completely unchanged. Bright airy pastel lighting."
  }
];

// ===== 主流程 =====
async function run() {
  const baseImages = {
    angel: path.join(BASE_DIR, 'base', 'angel-gothic-full.png'),
    purple: path.join(BASE_DIR, 'base', 'purple-lolita-full.png')
  };

  // 验证文件存在
  Object.entries(baseImages).forEach(([char, p]) => {
    if (!fs.existsSync(p)) { console.error(`❌ Missing: ${p}`); process.exit(1); }
  });

  console.log('🎀 HIMEMIRO AI Outfit Generator');
  console.log('🎯 Target models:', OUTFITS.length);
  console.log('📂 Output:', path.join(BASE_DIR, 'outfits'));
  console.log('═'.repeat(50));

  for (let i = 0; i < OUTFITS.length; i++) {
    const outfit = OUTFITS[i];
    const isPurple = outfit.name.startsWith('purple');
    const charKey = isPurple ? 'purple' : 'angel';
    const base64 = fileToBase64(baseImages[charKey]);

    console.log(`\n[${i+1}/${OUTFITS.length}] ${outfit.desc} (${outfit.name}) — ${charKey === 'purple' ? '巡夢姬' : '煤咪露'}`);
    process.stdout.write('  ⏳ Generating... ');

    try {
      const res = await httpsRequest(API_URL, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'X-Enable-Watermark': '0'
        }
      }, {
        model: MODEL,
        prompt: outfit.prompt,
        image: base64,
        num_inference_steps: 28,
        seed: Math.floor(Math.random() * 9999999999)
      });

      if (res.status !== 200) {
        console.log(`❌ HTTP ${res.status}`);
        console.log('   ', res.body.slice(0, 300));
        continue;
      }

      const json = JSON.parse(res.body);
      if (!json.images || !json.images[0]) {
        console.log(`❌ No image in response`);
        console.log('   ', JSON.stringify(json).slice(0, 300));
        continue;
      }

      const imgUrl = json.images[0].url;
      const outPath = path.join(BASE_DIR, 'outfits', `${outfit.name}.png`);
      await downloadImage(imgUrl, outPath);
      const size = (fs.statSync(outPath).size / 1024).toFixed(0);
      console.log(`✅ Done! ${size}KB → ${outfit.name}.png`);

    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    }

    // 限速：每 3 秒一张
    if (i < OUTFITS.length - 1) await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n' + '═'.repeat(50));
  console.log('🎉 All done! Check outputs in assets/dressup/outfits/');

  // 列出输出
  const outDir = path.join(BASE_DIR, 'outfits');
  if (fs.existsSync(outDir)) {
    fs.readdirSync(outDir).forEach(f => {
      const s = (fs.statSync(path.join(outDir, f)).size / 1024).toFixed(0);
      console.log(`  📦 ${f} (${s}KB)`);
    });
  }
}

run().catch(e => console.error('💥 Fatal:', e));
