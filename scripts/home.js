/* =========================================================================
   HIMEMIRO 官网交互脚本 — 零依赖
   ========================================================================= */

/* ---------- Flash 风格入场 ---------- */
(function intro() {
  const el = document.getElementById('intro');
  const enter = document.getElementById('introEnter');
  const skip = document.getElementById('introSkip');
  if (!el) return;
  // reduced-motion 用户直接跳过
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.remove(); return; }
  function dismiss() { el.classList.add('intro--fade'); setTimeout(() => el.remove(), 600); }
  enter?.addEventListener('click', dismiss);
  skip?.addEventListener('click', dismiss);
  skip?.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dismiss(); }});
  // 点击 body 空白处也能跳过
  el.addEventListener('click', (e) => { if (e.target === el) dismiss(); });
  // ESC 键
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') dismiss(); });
})();

/* ---------- 日历小部件 ---------- */
(function calendar() {
  const box = document.getElementById('calendarWidget');
  if (!box) return;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const head = ['日','一','二','三','四','五','六'];
  let html = '<div class="cal-row">';
  head.forEach(h => html += `<span class="cal-head">${h}</span>`);
  html += '</div><div class="cal-row">';
  for (let i = 0; i < first; i++) html += '<span></span>';
  for (let d = 1; d <= days; d++) {
    html += `<span class="${d === today ? 'today' : ''}">${d}</span>`;
  }
  html += '</div>';
  box.innerHTML = `<div style="font-size:11px;color:var(--c-gray-brown);margin-bottom:6px;">${year}年 ${month + 1}月</div>${html}`;
})();

/* ---------- 占卜 ---------- */
const fortunes = [
  '★ 今天适合拿起画笔 ✦',
  '◆ 一个新的世界正在萌芽',
  '✿ 你的收藏里藏着惊喜',
  '✦ 试试混合两种旧素材',
  '♡ 给自己留一点手工时间',
  '★ 下一扇橱窗值得打开',
  '◆ 耐心一点，灵感会找到你',
  '✧ 旧项目里可能有新发现',
];
function drawFortune() {
  const result = document.getElementById('fortuneResult');
  if (!result) return;
  result.textContent = fortunes[Math.floor(Math.random() * fortunes.length)];
}

/* ---------- 音乐（placeholder，不自动播放） ---------- */
let musicPlaying = false;
function toggleMusic() {
  musicPlaying = !musicPlaying;
  const track = document.getElementById('musicTrack');
  if (track) track.textContent = musicPlaying ? '♪ 占位曲目 · 待替换' : '暂无曲目';
}

/* =========================================================================
   🎲 古早日杂概率拼贴引擎 — 直接抄 dict.json 的逻辑
   5 层独立抽样：基底 → 织物 → 装饰 → 时间痕迹 → 色彩系统
   每层按权重随机抽，得到配方后动态注入 HTML + CSS 类
   ========================================================================= */

const COLLAGE_DICT = {
  基底: [
    { name: 'collage-base--washi',     w: 0.60 },  // 和纸
    { name: 'collage-base--kraft',     w: 0.25 },  // 牛皮纸
    { name: 'collage-base--newsprint', w: 0.15 },  // 旧报纸
  ],
  织物: [
    { name: 'collage-lace--scallop',   w: 0.50 },  // 扇贝边蕾丝
    { name: 'collage-lace--ruffle',    w: 0.30 },  // 褶皱蕾丝
    { name: null,                       w: 0.20 },  // 20% 概率完全不出
  ],
  装饰: [
    { name: 'collage-sticker',         w: 0.90 },  // 描边贴纸
    { name: null,                       w: 0.10 },
  ],
  时间痕迹: [
    { name: 'collage-clipping',        w: 0.70 },  // 旧杂志剪报
    { name: 'collage-handwrite-note',  w: 0.40 },  // 手写便签
    { name: null,                       w: 0.15 },  // 多层独立抽样，每层都有自己的权重
  ],
  色彩: [
    { name: 'collage-egg',             w: 0.35 },  // egg 系荧光撞色
    { name: 'collage-olive',           w: 0.40 },  // Olive 帕斯特尔（默认）
    { name: 'collage-ageha',           w: 0.25 },  // ageha 银白闪亮
  ],
};

function weightedPick(items) {
  const total = items.reduce((s, x) => s + x.w, 0);
  let r = Math.random() * total;
  for (const item of items) { r -= item.w; if (r <= 0) return item.name; }
  return items[0].name;
}

/* 便签纸候选文案（手写体日杂风格短句） */
const NOTE_LINES = [
  '本日の気分\n♡ ♡ ♡',
  '今週の予定\n· 素材整理\n· 世界観更新',
  '好きなもの\nレース · リボン\n苺ミルク',
  '夢の中の\nお人形さん',
  '明日も\nがんばろうね ♡',
  '気分転換に\nお茶でも',
];

/* 当前角色（用于 standee 切换）：'angel' = 煤咪露（粉毛锁天使）, 'purple' = 巡夢姬（紫玫瑰大小姐） */
let COLLAGE_CHARACTER = 'angel';
const CHIBI_POOL_ANGEL = [
  'assets/characters/angel-chibi/粉毛锁天使_01_不服.png',
  'assets/characters/angel-chibi/粉毛锁天使_02_得意.png',
  'assets/characters/angel-chibi/粉毛锁天使_03_困倦.png',
  'assets/characters/angel-chibi/粉毛锁天使_04_干饭.png',
  'assets/characters/angel-chibi/粉毛锁天使_05_摆烂.png',
  'assets/characters/angel-chibi/粉毛锁天使_06_生气.png',
  'assets/characters/angel-chibi/粉毛锁天使_07_委屈.png',
  'assets/characters/angel-chibi/粉毛锁天使_08_傲娇.png',
  'assets/characters/angel-chibi/粉毛锁天使_09_开心.png',
  'assets/characters/angel-chibi/粉毛锁天使_10_emo.png',
];
const CHIBI_POOL_PURPLE = [
  'assets/characters/purple-chibi/紫玫瑰大小姐_01_害羞.png',
  'assets/characters/purple-chibi/紫玫瑰大小姐_02_打瞌睡.png',
  'assets/characters/purple-chibi/紫玫瑰大小姐_03_委屈.png',
  'assets/characters/purple-chibi/紫玫瑰大小姐_04_抿茶.png',
  'assets/characters/purple-chibi/紫玫瑰大小姐_05_软笑抱兔.png',
  'assets/characters/purple-chibi/紫玫瑰大小姐_06_发呆.png',
  'assets/characters/purple-chibi/紫玫瑰大小姐_07_撒娇拽袖.png',
  'assets/characters/purple-chibi/紫玫瑰大小姐_08_emo.png',
];
const STANDANTEE_ANGEL  = 'assets/characters/angel-full.png';
const STANDANTEE_PURPLE = 'assets/characters/purple-full.png';

function applyCollage() {
  const stage = document.querySelector('.stage');
  const widgets = document.querySelector('.widgets');
  const exhibit = document.querySelector('.exhibit');
  const explore = document.querySelector('.explore');
  const body = document.body;
  if (!stage) return;

  // ---- 0. 清理旧装饰 ----
  document.querySelectorAll('.collage-sticker, .collage-ribbon, .collage-clipping, .collage-handwrite-note, .collage-chibi, .collage-pearl, .collage-coffee, .hero-standee').forEach(el => el.remove());

  // ---- 1. 抽基底 ----
  const base = weightedPick(COLLAGE_DICT.基底);
  for (const el of [stage, widgets, exhibit, explore]) {
    if (el) {
      el.classList.remove('collage-base--washi', 'collage-base--kraft', 'collage-base--newsprint');
      if (base) el.classList.add(base);
    }
  }

  // ---- 2. 抽织物（蕾丝） ----
  const lace = weightedPick(COLLAGE_DICT.织物);
  document.querySelectorAll('.exhibit__frame').forEach(el => {
    el.classList.remove('collage-lace--scallop', 'collage-lace--ruffle');
    if (lace) el.classList.add(lace);
  });

  // ---- 3. 抽装饰（贴纸 + 缎带）—— 密度翻倍 ----
  const types = ['heart', 'star', 'cross'];
  const stickerCount = 6 + Math.floor(Math.random() * 7);   // 6~12
  for (let i = 0; i < stickerCount; i++) {
    const sticker = document.createElement('div');
    sticker.className = 'collage-sticker collage-sticker--' + types[Math.floor(Math.random() * types.length)];
    const top = Math.floor(Math.random() * 900 + 80);
    const left = Math.floor(Math.random() * 1100 + 20);
    sticker.style.cssText = `top:${top}px;left:${left}px;--r:${Math.floor(Math.random()*24-12)}deg;position:absolute;z-index:5;`;
    document.body.appendChild(sticker);
  }
  for (let i = 0; i < 3; i++) {                             // 2 → 3 缎带
    const ribbon = document.createElement('div');
    ribbon.className = 'collage-ribbon collage-ribbon--' + (Math.random() > 0.5 ? 'bow' : 'strip');
    ribbon.style.cssText = `top:${Math.floor(Math.random()*700+60)}px;left:${Math.floor(Math.random()*1000+50)}px;transform:rotate(${Math.floor(Math.random()*30-15)}deg);`;
    document.body.appendChild(ribbon);
  }

  // ---- 4. 抽时间痕迹 —— 剪报 1~3 张 + 便签 1~2 张 ----
  const clipCount = Math.random() < 0.70 ? 1 + Math.floor(Math.random() * 3) : 0;  // 1~3
  for (let i = 0; i < clipCount; i++) {
    const clip = document.createElement('div');
    clip.className = 'collage-clipping';
    const w = 70 + Math.floor(Math.random() * 60);
    const h = 90 + Math.floor(Math.random() * 60);
    clip.style.cssText = `width:${w}px;height:${h}px;top:${200+Math.floor(Math.random()*600)}px;left:${30+Math.floor(Math.random()*1000)}px;--r:${Math.floor(Math.random()*16-8)}deg;`;
    document.body.appendChild(clip);
  }
  const noteCount = Math.random() < 0.40 ? 1 + Math.floor(Math.random() * 2) : 0;  // 1~2
  for (let i = 0; i < noteCount; i++) {
    const note = document.createElement('div');
    note.className = 'collage-handwrite-note';
    note.textContent = NOTE_LINES[Math.floor(Math.random() * NOTE_LINES.length)];
    note.style.cssText = `top:${240+Math.floor(Math.random()*500)}px;${Math.random()>0.5?'right':'left'}:${40+Math.floor(Math.random()*200)}px;`;
    document.body.appendChild(note);
  }

  // ---- 5. 抽色彩系统 ----
  body.classList.remove('collage-egg', 'collage-olive', 'collage-ageha');
  const color = weightedPick(COLLAGE_DICT.色彩);
  if (color) body.classList.add(color);

  // ====== 新增层：真实角色资产 ======

  // ---- 6. 角色立绘 standee（右下角，挡住部分内容） ----
  const standeeImg = COLLAGE_CHARACTER === 'angel' ? STANDANTEE_ANGEL : STANDANTEE_PURPLE;
  const standeeAlt = COLLAGE_CHARACTER === 'angel' ? '煤咪露' : '巡夢姬';
  if (Math.random() < 0.95) {
    const standee = document.createElement('img');
    standee.className = 'hero-standee is-visible';
    standee.src = standeeImg;
    standee.alt = standeeAlt;
    standee.onerror = () => { standee.style.opacity = 0; };   // 文件不存在就隐藏
    document.body.appendChild(standee);
  }

  // ---- 7. 真实表情包散排（概率 60%，出 2-4 张 chibi） ----
  const pool = COLLAGE_CHARACTER === 'angel' ? CHIBI_POOL_ANGEL : CHIBI_POOL_PURPLE;
  if (Math.random() < 0.60) {
    const chibiCount = 2 + Math.floor(Math.random() * 3);  // 2~4
    for (let i = 0; i < chibiCount; i++) {
      const chibi = document.createElement('img');
      chibi.className = 'collage-chibi';
      chibi.src = pool[Math.floor(Math.random() * pool.length)];
      chibi.alt = 'chibi sticker';
      const size = 48 + Math.floor(Math.random() * 40);   // 48~88px
      const rot = Math.floor(Math.random() * 24 - 12);
      chibi.style.cssText = `
        position:absolute;
        top:${250 + Math.floor(Math.random()*600)}px;
        left:${40 + Math.floor(Math.random()*1000)}px;
        width:${size}px;height:auto;
        transform:rotate(${rot}deg);
        filter:drop-shadow(2px 3px 4px rgba(64,42,42,.30));
        opacity:.92;z-index:8;pointer-events:none;user-select:none;
      `;
      chibi.onerror = () => chibi.remove();
      document.body.appendChild(chibi);
    }
  }

  // ---- 8. 珍珠串（概率 25%，顶部挂一串） ----
  if (Math.random() < 0.25) {
    const pearlCount = 8 + Math.floor(Math.random() * 6);  // 8~13 颗
    const pearlTop = document.createElement('div');
    pearlTop.className = 'collage-pearl';
    pearlTop.style.cssText = `
      position:absolute;top:0;left:${Math.floor(Math.random()*400+100)}px;
      display:flex;gap:4px;flex-direction:column;align-items:center;
      pointer-events:none;opacity:.75;z-index:9;
    `;
    for (let i = 0; i < pearlCount; i++) {
      const pearl = document.createElement('div');
      const psize = 6 + Math.floor(Math.random() * 5);
      pearl.style.cssText = `
        width:${psize}px;height:${psize}px;border-radius:50%;
        background:radial-gradient(circle at 30% 30%, #fff, #d4b896);
        box-shadow:0 1px 2px rgba(64,42,42,.25);
      `;
      pearlTop.appendChild(pearl);
    }
    document.body.appendChild(pearlTop);
  }

  // ---- 9. 咖啡渍（概率 20%，底部一滩半透明棕） ----
  if (Math.random() < 0.20) {
    const coffee = document.createElement('div');
    coffee.className = 'collage-coffee';
    coffee.style.cssText = `
      position:absolute;bottom:${40+Math.floor(Math.random()*100)}px;left:${Math.floor(Math.random()*800+100)}px;
      width:${60+Math.floor(Math.random()*50)}px;height:${40+Math.floor(Math.random()*40)}px;
      background:rgba(120,60,30,.18);border-radius:50% 40% 55% 45% / 50% 45% 55% 50%;
      filter:blur(.4px);opacity:.55;pointer-events:none;z-index:3;
    `;
    document.body.appendChild(coffee);
  }
}

/* 按钮组：🎲 随机拼贴 + 🔄 角色切换 */
(function initCollageButtons() {
  const btnStyle = {
    position: 'fixed', zIndex: '9998',
    padding: '10px 18px', fontFamily: 'var(--font-rounded)', fontWeight: '700',
    fontSize: '12px', letterSpacing: '.1em',
    background: 'var(--c-deep-chocolate)', color: 'var(--c-vanilla)',
    border: '2px solid var(--c-candy-orange)',
    borderRadius: 'var(--radius-lg)', cursor: 'pointer',
    transition: 'all var(--transition-base)',
    boxShadow: 'var(--btn-shadow-candy)',
  };

  // 随机拼贴按钮
  const rnd = document.createElement('button');
  Object.assign(rnd.style, btnStyle, { right: '16px', bottom: '64px' });
  rnd.type = 'button';
  rnd.textContent = '🎲 COLLAGE';
  rnd.title = '按古早日杂概率权重随机生成拼贴';
  rnd.addEventListener('click', () => {
    rnd.classList.add('collage-random-btn--rolling');
    setTimeout(() => rnd.classList.remove('collage-random-btn--rolling'), 400);
    applyCollage();
  });
  document.body.appendChild(rnd);

  // 角色切换按钮
  const char = document.createElement('button');
  Object.assign(char.style, btnStyle, { right: '16px', bottom: '16px', borderColor: 'var(--c-cranberry)' });
  char.type = 'button';
  char.textContent = '🔄 ' + (COLLAGE_CHARACTER === 'angel' ? '煤咪露' : '巡夢姬');
  char.title = '切换主角（立绘 + 表情包池）';
  char.addEventListener('click', () => {
    COLLAGE_CHARACTER = COLLAGE_CHARACTER === 'angel' ? 'purple' : 'angel';
    char.textContent = '🔄 ' + (COLLAGE_CHARACTER === 'angel' ? '煤咪露' : '巡夢姬');
    applyCollage();
  });
  document.body.appendChild(char);

  // 首次加载自动生成一次
  applyCollage();
})();

/* =========================================================================
   第二批交互层：IntersectionObserver 滚动贴上去 + 时间敏感便签 + 视差
   ========================================================================= */

// 1. 滚动触发"贴上去"动画 — 用 IntersectionObserver
(function initStickOnScroll() {
  const targets = document.querySelectorAll('.widget, .exhibit__frame, .explore__card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 逐个错开贴上（每张卡延迟不同）
        const delay = Array.from(targets).indexOf(entry.target) * 60;
        setTimeout(() => entry.target.classList.add('is-stuck'), delay);
        io.unobserve(entry.target);   // 只触发一次
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(el => io.observe(el));
})();

// 2. 时间敏感便签 — 白天/深夜换文案 + 深夜自动加月星星星
(function initTimeAwareNotes() {
  const h = new Date().getHours();
  const isNight = h < 6 || h >= 22;
  const isMorning = h >= 6 && h < 11;
  const isAfternoon = h >= 11 && h < 18;

  // 动态扩展便签文案
  if (isNight) {
    NOTE_LINES.push('夜更かし中 🌙\nおやすみなさい\n...', '星を見ながら\n一人で考える', '深夜の\nインスピレーション ♡');
    // 深夜主题：body 暗一点 + 加星星
    document.body.style.backgroundImage =
      'radial-gradient(circle, rgba(255,255,255,.35) 1px, transparent 1.5px), var(--pattern-stripe-45)';
  } else if (isMorning) {
    NOTE_LINES.push('おはよう 🌞\n今日もがんばろう', '朝ごはんは\nパンと紅茶');
  } else if (isAfternoon) {
    NOTE_LINES.push('お昼休み\n散歩でも', '午後のおやつ\nクッキーとお茶 ♡');
  }
})();

// 3. 滚动视差 — body 的 45° 斜条纹以 0.3x 速度滚动
(function initParallaxBg() {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      document.body.style.backgroundPosition = `${y * -0.15}px ${y * -0.08}px`;
      ticking = false;
    });
  }, { passive: true });
})();

/* =========================================================================
   第四批：音效合成 + Curator's Room Modal + 垂直侧边文字
   ========================================================================= */

// 1. 音效合成器 — Web Audio API 生成"咔哒"声（不依赖外部文件）
(function initClickSound() {
  let ctx = null;
  window.playClickSound = function() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch(e) { return; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    const c = ctx;
    const t = c.currentTime;
    // 短白噪声爆破
    const noise = c.createBufferSource();
    const buf = c.createBuffer(1, c.sampleRate * 0.04, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    noise.buffer = buf;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    noise.connect(gain).connect(c.destination);
    noise.start(t);
    // 高频"叮"音
    const osc = c.createOscillator();
    const g2 = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.06);
    g2.gain.setValueAtTime(0.08, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(g2).connect(c.destination);
    osc.start(t); osc.stop(t + 0.07);
  };
  // 自动绑定：所有 button 和 clickable 元素
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, .explore__card, .widget-fortune button, .music-btn');
    if (target) window.playClickSound();
  }, { passive: true });
})();

// 2. Curator's Room Modal — 点击 explore__card 第 6 个（archives/Curator's Room）触发展开
(function initCuratorModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-book">
      <button class="modal-book__close" type="button">✕ とじる</button>
      <div class="modal-book__inner">
        <h2 class="modal-book__title">Curator's Room — 策展人の机</h2>
        <div class="modal-book__item">
          <span class="modal-book__tag">📜 草稿</span>
          <span>煤咪露（粉毛锁天使）和巡夢姬（紫玫瑰大小姐）的世界观设定集，共 12 页手稿。<br><span style="opacity:.6;font-size:11px">[ 点击查看原图 → ]</span></span>
        </div>
        <div class="modal-book__item">
          <span class="modal-book__tag modal-book__tag--purple">🎀 角色</span>
          <span>煤咪露 立绘 × 1 + 表情包 × 10 &nbsp;/&nbsp; 巡夢姬 立绘 × 1 + 表情包 × 8</span>
        </div>
        <div class="modal-book__item">
          <span class="modal-book__tag modal-book__tag--mint">🎨 素材</span>
          <span>哥特萝莉素材表 × 3（含描边贴纸、蕾丝、蝴蝶、珍珠等 UI 组件）</span>
        </div>
        <div class="modal-book__item">
          <span class="modal-book__tag">🎼 音乐</span>
          <span>占位 BGM 待上传。推荐使用 2000s 日系少女风格（MALICE MIZER 系）。</span>
        </div>
        <div class="modal-book__item">
          <span class="modal-book__tag modal-book__tag--purple">✦ 工坊</span>
          <span><a href="../workshop/" style="text-decoration:underline;">→ 前往 HIMEMIRO 拼贴工坊</a> · 数字拼贴编辑器（Vite + Vue 3）</span>
        </div>
        <div style="margin-top:24px;padding:12px;border-top:2px dashed rgba(64,42,42,.30);font-size:11px;opacity:.55;">
          📖 这是一本打开的草稿本。每一页都是手工贴上去的便签、草稿、装饰贴纸。<br>
          点击右下角任意贴纸可以拖出来看详情。（拖拽功能开发中）
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const close = modal.querySelector('.modal-book__close');
  close.addEventListener('click', () => modal.classList.remove('is-open'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('is-open'); });

  // 触发：点击 Curator's Room / Archives 卡片
  const archiveCard = document.querySelector('.explore__card#archives');
  if (archiveCard) {
    archiveCard.addEventListener('click', () => {
      window.playClickSound?.();
      modal.classList.add('is-open');
    });
  } else {
    // 没找到 id=archives，就给最后一个 explore__card 绑定
    const allCards = document.querySelectorAll('.explore__card');
    if (allCards.length) allCards[allCards.length-1].addEventListener('click', () => {
      window.playClickSound?.();
      modal.classList.add('is-open');
    });
  }

  // 4. 点击卡片放大过渡（拿起这张照片凑近看的物理感）
  document.querySelectorAll('.explore__card').forEach(card => {
    card.addEventListener('click', () => {
      // 如果是 archives，已经绑定了 modal，不走放大
      if (card.id === 'archives') return;
      card.classList.add('is-opening');
      setTimeout(() => {
        // 过渡结束后移除 class（目前没有子页面，只做视觉演示）
        setTimeout(() => card.classList.remove('is-opening'), 400);
      }, 600);
    });
  });
})();

// 3. 垂直侧边文字（动态注入）
(function initSideRails() {
  const left = document.createElement('div');
  left.className = 'side-rail side-rail--left';
  const d = new Date();
  const dateStr = `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  left.textContent = `HIMEMIRO ・ 魔法工房 ・ DREAM FACTORY ・ ${dateStr}`;
  document.body.appendChild(left);

  const right = document.createElement('div');
  right.className = 'side-rail side-rail--right';
  const h = d.getHours();
  const period = h < 6 ? '夜更かし' : h < 11 ? 'おはよう' : h < 18 ? 'おやつ' : 'おやすみ';
  right.textContent = `煤咪露 ♡ 巡夢姬 ・ ${period} ・ MADE WITH ♡ IN DREAMLAND`;
  document.body.appendChild(right);
})();

// 4. 迷你播放器状态切换
(function initMusicState() {
  const btn = document.querySelector('.widget-music .music-btn');
  const track = document.querySelector('.widget-music .music-track');
  if (!btn) return;
  btn.classList.add('is-idle');
  document.querySelector('.widget-music').classList.add('is-idle');

  btn.addEventListener('click', () => {
    const isPlaying = document.querySelector('.widget-music').classList.contains('is-playing');
    const widget = document.querySelector('.widget-music');
    if (isPlaying) {
      widget.classList.remove('is-playing'); widget.classList.add('is-idle');
      btn.classList.remove('is-idle');
      track.textContent = '暂无曲目';
    } else {
      widget.classList.remove('is-idle'); widget.classList.add('is-playing');
      btn.classList.remove('is-idle');
      track.textContent = '♪ 占位曲目 · 待替换';
    }
  });
})();
