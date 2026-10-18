/* =========================================================================
   HIMEMIRO v3 增强脚本 — Gallery + Worlds 模块升级
   全部使用事件委托，兼容 SPA 动态 append 的元素
   ========================================================================= */

/* ---------- 单一共享 SPA 切换观察器 ---------- */
(function SharedPageObserver() {
  const callbacks = new Map(); // pageName -> Set<fn>
  function onPage(page, fn) {
    if (!callbacks.has(page)) callbacks.set(page, new Set());
    callbacks.get(page).add(fn);
    return () => callbacks.get(page)?.delete(fn);
  }
  new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.target.classList.contains('page--active')) {
        const page = m.target.dataset.page;
        if (page) {
          setTimeout(() => {
            const fns = callbacks.get(page);
            fns?.forEach(fn => { try { fn(); } catch(e) { console.warn('[SPA observer]', page, e); } });
          }, 400); // 给 SPA_Init 的 append 留时间
        }
      }
    }
  }).observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });
  window.__onPage = onPage;
})();

/* ==========================================================================
   Gallery · G-A1 拍立得点击放大 Modal
   ========================================================================== */
(function GalleryZoom_Init() {
  let modalEl = null, modalInner = null, closeBtn = null;

  function ensureModal() {
    if (modalEl) return;
    modalEl = document.createElement('div');
    modalEl.className = 'gallery-modal';
    modalEl.innerHTML = `
      <button class="gallery-modal-closes" aria-label="关闭">✕</button>
      <div class="gallery-modal-card"></div>
    `;
    document.body.appendChild(modalEl);
    modalInner = modalEl.querySelector('.gallery-modal-card');
    closeBtn = modalEl.querySelector('.gallery-modal-closes');
    closeBtn.addEventListener('click', close);
    modalEl.addEventListener('click', (e) => { if (e.target === modalEl) close(); });
  }
  function open(polaroid) {
    ensureModal();
    modalInner.innerHTML = '';
    const clone = polaroid.cloneNode(true);
    // 重置 clone 的 transform 让动画生效
    clone.style.transform = '';
    clone.style.position = 'static';
    clone.style.left = clone.style.top = 'auto';
    clone.style.opacity = '1';
    modalInner.appendChild(clone);
    modalEl.classList.add('is-open');
    window.playClickSound?.();
  }
  function close() {
    modalEl?.classList.remove('is-open');
  }

  // 事件委托：只有 Gallery 页面内的拍立得才触发 Modal
  document.addEventListener('click', (e) => {
    const polaroid = e.target.closest('.polaroid');
    if (polaroid && document.querySelector('.page--active[data-page="gallery"]')) {
      // 拖拽刚松手（300ms 内）→ 不触发 Modal，避免 drag-zoom 冲突
      if (Date.now() - (window.__galleryJustDragged || 0) < 300) return;
      e.stopPropagation();
      open(polaroid);
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

/* ==========================================================================
   Gallery · G-A4 WORK SHEET 便签折叠
   ========================================================================== */
(function GalleryPaperToggle_Init() {
  document.addEventListener('dblclick', (e) => {
    const paper = e.target.closest('.gallery-paper--torn');
    if (paper && document.querySelector('.page--active[data-page="gallery"]')) {
      window.playClickSound?.();
      paper.classList.toggle('is-collapsed');
    }
  });
})();

/* ==========================================================================
   Gallery · G-D1 图钉连连看
   ========================================================================== */
(function GalleryTackGame_Init() {
  // 配色池（与 .pin--xxx 对应）
  const COLORS = ['#C95770', '#4A7BB8', '#D4A24C', '#F0643B']; // 红/蓝/黄/橘
  const LABELS = ['🎀', '🎵', '✂', '♡'];
  let tackGrid, btnEls, selected = [], matchedCount = 0;

  function build() {
    const board = document.querySelector('.page.page--active[data-page="gallery"] .gallery-corkboard');
    if (!board || board.querySelector('.gallery-mini-tack')) return;

    const wrap = document.createElement('div');
    wrap.className = 'gallery-mini-tack';
    wrap.innerHTML = `
      <div class="gallery-mini-tack-title">🎯 TACK MATCH · 30s</div>
      <div class="gallery-mini-tack-grid"></div>
      <div class="gallery-mini-tack-score">PAIRS 0/4</div>
    `;
    board.appendChild(wrap);

    tackGrid = wrap.querySelector('.gallery-mini-tack-grid');
    const score = wrap.querySelector('.gallery-mini-tack-score');

    // 4 对 = 8 个图钉（4 颜色 × 2）
    const pool2 = [...COLORS, ...COLORS];
    // 洗牌
    for (let i = pool2.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool2[i], pool2[j]] = [pool2[j], pool2[i]];
    }

    btnEls = pool2.map((color, i) => {
      const btn = document.createElement('button');
      btn.className = 'gallery-mini-tack-btn';
      btn.style.background = color;
      btn.dataset.color = color;
      btn.dataset.idx = i;
      btn.title = LABELS[COLORS.indexOf(color)];
      btn.addEventListener('click', () => handleClick(btn, score));
      tackGrid.appendChild(btn);
      return btn;
    });

    matchedCount = 0;
    selected = [];
  }

  function handleClick(btn, scoreEl) {
    if (btn.classList.contains('is-matched') || selected.includes(btn)) return;
    window.playClickSound?.();

    btn.classList.add('is-selected');
    selected.push(btn);

    if (selected.length === 2) {
      const [a, b] = selected;
      if (a.dataset.color === b.dataset.color && a !== b) {
        // 配对成功
        setTimeout(() => {
          a.classList.remove('is-selected');
          b.classList.add('is-selected');
          a.classList.add('is-matched');
          b.classList.add('is-matched');
          matchedCount += 1;
          scoreEl.textContent = `PAIRS ${matchedCount}/4`;
          window.playClickSound?.();
          if (matchedCount === 4) {
            scoreEl.textContent = `★ ALL CLEAR! ★`;
          }
        }, 280);
      } else {
        // 配对失败
        setTimeout(() => {
          a.classList.remove('is-selected');
          b.classList.remove('is-selected');
        }, 500);
      }
      selected = [];
    }
  }

  // SPA 切换到 Gallery 时重建
  window.__onPage('gallery', () => { setTimeout(build, 800); });
})();

/* ==========================================================================
   Gallery · G-D2 神秘纸条抽取
   ========================================================================== */
(function GalleryMystic_Init() {
  // 文案池（12 条）
  const NOTES = [
    '煤咪露今天心情：开心 🎀',
    '煤咪露今天心情：摸鱼 😴',
    '煤咪露今天心情：想晒太阳 ☀️',
    '巡夢姬今天心情：喝伯爵茶 🍵',
    '巡夢姬今天心情：整理古董 🏺',
    '巡夢姬今天心情：看书 📖',
    '工作室今日：无咖啡 ☕💔',
    '工作室今日：有小蛋糕 🎂',
    '明日计划：画一张新立绘',
    '明日计划：拍一张新表情包',
    '巡夢姬偷偷：煤咪露又在摆烂',
    '煤咪露偷偷：巡夢姬的伯爵茶好香',
  ];
  const drawn = new Set();

  function injectDrawer() {
    const board = document.querySelector('.page.page--active[data-page="gallery"] .gallery-corkboard');
    if (!board || board.querySelector('.gallery-mini-drawer')) return;

    const drawer = document.createElement('div');
    drawer.className = 'gallery-mini-drawer';
    drawer.innerHTML = `<div class="gallery-mini-drawer-label">✉ 抽一张</div><div>MYSTIC NOTE</div>`;
    drawer.addEventListener('click', drawNote);
    board.appendChild(drawer);
  }

  function drawNote() {
    window.playClickSound?.();
    // 选一个没抽过的
    let pick;
    if (drawn.size >= NOTES.length) drawn.clear();
    do { pick = NOTES[Math.floor(Math.random() * NOTES.length)]; }
    while (drawn.has(pick));
    drawn.add(pick);

    // 创建神秘纸条
    const board = document.querySelector('.page.page--active[data-page="gallery"] .gallery-board');
    if (!board) return;
    const note = document.createElement('div');
    note.className = 'gallery-mystic-note';
    note.style.setProperty('--r', `${(Math.random() * 16 - 8).toFixed(1)}deg`);
    note.style.left = `${(10 + Math.random() * 70).toFixed(1)}%`;
    note.style.top  = `${(20 + Math.random() * 60).toFixed(1)}%`;
    note.textContent = pick;
    note.addEventListener('dblclick', () => { note.remove(); window.playClickSound?.(); });
    board.appendChild(note);
  }

  // SPA 切换到 Gallery 时注入
  window.__onPage('gallery', () => { setTimeout(injectDrawer, 900); });
})();

/* ==========================================================================
   Worlds · W-A3 街道行人（煤咪露/巡夢姬 chibi 飘过）
   ========================================================================== */
(function WorldsPed_Init() {
  const PEDS = [
    { img: 'assets/characters/angel-chibi/粉毛锁天使_04_干饭.png', name: '煤咪露', bubbles: ['🍙 好饿...', '干饭去！', '帮我留一口～'] },
    { img: 'assets/characters/purple-chibi/紫玫瑰大小姐_05_软笑抱兔.png', name: '巡夢姬', bubbles: ['♡ 兔子好软', '今天阳光真好', '喝茶吗？'] },
    { img: 'assets/characters/angel-chibi/粉毛锁天使_05_摆烂.png', name: '煤咪露（摆烂）', bubbles: ['不想动...', '再躺会儿', '别叫我...'] },
  ];
  let injected = false;

  function inject() {
    const scene = document.querySelector('.page.page--active[data-page="worlds"] .street-scene');
    if (!scene || scene.querySelector('.street-ped')) return;

    const heights = ['16%', '24%', '19%'];
    const delays = ['6s', '11s', '16s'];
    const durations = ['22s', '28s', '34s'];

    PEDS.forEach((ped, i) => {
      const el = document.createElement('div');
      el.className = 'street-ped';
      el.style.top = heights[i];
      el.style.left = `calc(-100px - ${i * 20}px)`;
      el.style.animation = `ped-walk ${durations[i]} linear ${delays[i]} infinite`;
      const bubble = ped.bubbles[Math.floor(Math.random() * ped.bubbles.length)];
      el.innerHTML = `<span class="ped-bubble">${bubble}</span>
        <img loading="lazy" src="${ped.img}" alt="${ped.name}" onerror="this.style.display='none'">`;
      scene.appendChild(el);
    });

    // 注入 @keyframes（只注入一次）
    if (!document.getElementById('ped-walk-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ped-walk-keyframes';
      style.textContent = `
        @keyframes ped-walk {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(100vw + 200px)); }
        }
      `;
      document.head.appendChild(style);
    }

    injected = true;
  }

  window.__onPage('worlds', () => { injected = false; setTimeout(inject, 800); });
})();

/* ==========================================================================
   Worlds · W-D1 煤咪露躲猫猫
   ========================================================================== */
(function WorldsHideSeek_Init() {
  let active = false, peekEl = null, score = 0;

  function startGame() {
    if (active) return;
    const page = document.querySelector('.page.page--active[data-page="worlds"]');
    if (!page) return;
    active = true; score = 0;

    // 顶部分数面板
    const panel = document.createElement('div');
    panel.className = 'street-hide-hint';
    panel.textContent = '🙀 煤咪露躲猫猫 · 点击窗户！· 0';
    panel.addEventListener('click', stopGame);
    page.querySelector('.street-scene').appendChild(panel);

    // 随机选一家店的窗户让煤咪露探出头
    scheduleNextPeek();
  }

  function scheduleNextPeek() {
    if (!active) return;
    // 清掉上一个
    if (peekEl) { peekEl.classList.remove('is-peeking', 'is-caught'); peekEl = null; }

    const shops = document.querySelectorAll('.page.page--active[data-page="worlds"] .shop:not(.shop--empty)');
    if (!shops.length) { active = false; return; }
    const shop = shops[Math.floor(Math.random() * shops.length)];
    peekEl = shop.querySelector('.shop-window');
    if (!peekEl) { active = false; return; }
    peekEl.classList.add('is-peeking');
    peekEl.style.cursor = 'crosshair';

    // 超时没点 → 煤咪露自己缩回去，换下一个
    const timeout = setTimeout(() => {
      if (active && peekEl && peekEl.classList.contains('is-peeking')) {
        peekEl.classList.remove('is-peeking');
        peekEl.style.cursor = '';
        peekEl = null;
        scheduleNextPeek();
      }
    }, 3500);

    // 点到了
    const hitHandler = (e) => {
      if (!active) return;
      if (!e.target.closest('.shop-window.is-peeking')) return;
      e.stopPropagation();
      clearTimeout(timeout);
      score += 1;
      window.playClickSound?.();
      peekEl.classList.remove('is-peeking');
      peekEl.classList.add('is-caught');
      peekEl.style.cursor = '';
      panel.textContent = `🙀 抓到啦！· ${score} · 再玩一轮？`;
      peekEl = null;
      setTimeout(() => { panel.remove(); active = false; }, 1400);
    };
    document.addEventListener('click', hitHandler, { once: true });
  }

  function stopGame() {
    active = false;
    if (peekEl) { peekEl.classList.remove('is-peeking'); peekEl.style.cursor = ''; peekEl = null; }
    const panel = document.querySelector('.street-hide-hint');
    if (panel) panel.remove();
  }

  // 注入开始按钮（右下）
  function injectStartBtn() {
    const scene = document.querySelector('.page.page--active[data-page="worlds"] .street-scene');
    if (!scene || scene.querySelector('.hide-seek-start')) return;
    const btn = document.createElement('div');
    btn.className = 'gallery-mini-drawer hide-seek-start';
    btn.style.top = 'auto'; btn.style.bottom = '72px'; btn.style.left = 'auto'; btn.style.right = '24px';
    btn.style.transform = 'rotate(-1deg)';
    btn.innerHTML = `<div class="gallery-mini-drawer-label">🙀 躲猫猫</div><div>START</div>`;
    btn.addEventListener('click', startGame);
    scene.appendChild(btn);
  }

  window.__onPage('worlds', () => { setTimeout(injectStartBtn, 1000); });
})();

/* ==========================================================================
   Worlds · SPA 注入后补装饰云/地面杂物/路牌（HTML 注入而非纯 CSS，因为需要动态位置）
   ========================================================================== */
(function WorldsDecor_Init() {
  const CLOUDS = [
    { top: '6%',  left: '10%', w: 120, dur: '20s', delay: '0s' },
    { top: '12%', left: '42%', w: 160, dur: '26s', delay: '5s' },
    { top: '4%',  left: '72%', w: 100, dur: '18s', delay: '10s' },
    { top: '20%', left: '85%', w: 90,  dur: '22s', delay: '3s' },
    { top: '28%', left: '22%', w: 70,  dur: '16s', delay: '8s' },
  ];
  const GROUND = ['🍂', '🪙', '🐾', '🍂', '💿', '🪙', '🍂', '🐾'];

  function inject() {
    const scene = document.querySelector('.page.page--active[data-page="worlds"] .street-scene');
    if (!scene) return;
    const sky = scene.querySelector('.street-sky');
    const ground = scene.querySelector('.street-ground');
    const scroll = scene.querySelector('.street-scroll');
    if (!sky || !ground || !scroll) return;

    // 棉花糖云
    CLOUDS.forEach(c => {
      const el = document.createElement('div');
      el.className = 'street-cloud';
      Object.assign(el.style, {
        top: c.top, left: c.left,
        width: c.w + 'px', height: (c.w * 0.36) + 'px',
        animationDuration: c.dur, animationDelay: c.delay,
      });
      sky.appendChild(el);
    });

    // 地面杂物
    GROUND.forEach((g, i) => {
      const el = document.createElement('span');
      el.className = 'ground-deco';
      el.textContent = g;
      const left = 5 + Math.random() * 90;
      const bottom = 3 + Math.random() * 20;
      Object.assign(el.style, {
        left: left + '%', bottom: bottom + '%',
        transform: `rotate(${(Math.random() * 60 - 30).toFixed(0)}deg)`,
      });
      ground.appendChild(el);
    });

    // 下一个街区路牌
    if (!scroll.querySelector('.street-next-block')) {
      const next = document.createElement('div');
      next.className = 'street-next-block';
      next.innerHTML = `
        <div style="padding-right:30px;">
          → NEXT BLOCK<br>
          <span style="font-size:9px;opacity:.65;">COMING SOON · HIMEMIRO v3.1</span>
        </div>`;
      scroll.appendChild(next);
    }
  }

  window.__onPage('worlds', () => { setTimeout(inject, 400); });
})();

/* ==========================================================================
   Gallery · SPA 注入后补装饰画框 + 抬头信笺 + 散落杂物
   ========================================================================== */
(function WorldsGalleryDecor_Init() {
  const DECOS = ['📎', '✂', '📌', '✎', '🧷', '🖇'];

  function inject() {
    const board = document.querySelector('.page.page--active[data-page="gallery"] .gallery-board');
    if (!board || board.querySelector('.gallery-header-strip')) return;

    // 抬头信笺
    const strip = document.createElement('div');
    strip.className = 'gallery-header-strip';
    strip.innerHTML = `
      <span class="hs-label">✦ HIMEMIRO STUDIO ✦</span>
      <span>· EXHIBIT №001 · 2026.10 ·</span>
    `;
    board.appendChild(strip);

    // 4 个角画框
    ['tl', 'tr', 'bl', 'br'].forEach((pos, i) => {
      const frame = document.createElement('div');
      frame.className = `gallery-frame-tip gallery-frame-tip--${pos}`;
      const icons = ['♡', '✿', '♪', '❀'];
      frame.textContent = icons[i];
      board.appendChild(frame);
    });

    // 散落杂物
    DECOS.forEach(d => {
      const el = document.createElement('span');
      el.className = 'gallery-deco';
      el.textContent = d;
      el.style.left = (Math.random() * 88 + 4).toFixed(1) + '%';
      el.style.top  = (Math.random() * 88 + 4).toFixed(1) + '%';
      el.style.transform = `rotate(${(Math.random() * 50 - 25).toFixed(1)}deg)`;
      el.style.fontSize = (14 + Math.random() * 8).toFixed(0) + 'px';
      board.appendChild(el);
    });
  }

  window.__onPage('gallery', () => { setTimeout(inject, 500); });
})();

/* =========================================================================
   Space Jam Games Hub — 嵌套子页面切换
   ========================================================================= */
(() => {
  function switchView(viewName) {
    const views = document.querySelectorAll('.sj-view');
    const planets = document.querySelectorAll('.sj-planet');
    if (!views.length) return;

    views.forEach(v => v.classList.toggle('is-active', v.dataset.gameView === viewName));
    planets.forEach(p => p.classList.toggle('is-current', p.dataset.gameView === viewName));
  }

  // 事件委托：星球按钮 + Site Map 卡片点击
  document.addEventListener('click', (e) => {
    const planet = e.target.closest('.sj-planet[data-game-view]');
    if (planet) {
      e.preventDefault(); e.stopPropagation();
      switchView(planet.dataset.gameView);
      return;
    }
    const sitemapCard = e.target.closest('.sj-sitemap-card[data-game-view]');
    if (sitemapCard) {
      e.preventDefault(); e.stopPropagation();
      switchView(sitemapCard.dataset.gameView);
      return;
    }
  });

  // SPA 切到 Games page 时重置回 Hub 视图
  window.__onPage('games', () => switchView('hub'));
})();

/* =========================================================================
   Gallery · 真实上传功能（localStorage + Canvas 压缩）
   - 隐藏 <input type="file" accept="image/*" multiple>
   - Canvas 等比缩放（max 800px 长边，JPEG 0.8）→ 避免 localStorage 5MB 上限
   - localStorage key: "himemiro_gallery_user" — JSON array
   - 动态生成 .polaroid 到 .gallery-board，附随机位置/旋转 + 删除按钮
   ========================================================================= */
(() => {
  const LS_KEY = 'himemiro_gallery_user';
  let fileInput = null;

  function ensureFileInput() {
    if (fileInput) return fileInput;
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', onFilesSelected);
    document.body.appendChild(fileInput);
    return fileInput;
  }

  // Canvas 压缩图片 — 最长边 800px，JPEG 0.8
  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('FileReader failed'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Image load failed'));
        img.onload = () => {
          const MAX = 800;
          let { width: w, height: h } = img;
          if (w > MAX || h > MAX) {
            const ratio = Math.min(MAX / w, MAX / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
  }
  function saveAll(arr) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch(e) {
      alert('localStorage 存储已满！请删除一些照片后重试。');
      console.warn('localStorage quota exceeded:', e);
    }
  }

  // 生成随机位置（避开边缘 + 避开标题区域 top 60%）
  function randomPos() {
    const r = (Math.random() * 16 - 8).toFixed(1); // -8 ~ +8 deg
    const x = (5 + Math.random() * 60).toFixed(1);  // 5% ~ 65%（避开右侧）
    const y = (5 + Math.random() * 50).toFixed(1);  // 5% ~ 55%（避开底部标题）
    return { r, x, y };
  }

  function pinColor() {
    const colors = ['pin--red', 'pin--blue', 'pin--yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // 单张 polaroid DOM
  function buildPolaroid(item) {
    const pos = item.x !== undefined ? item : randomPos();
    const el = document.createElement('div');
    el.className = 'polaroid polaroid--user';
    el.dataset.galleryId = item.id;
    el.style.setProperty('--r', `${pos.r}deg`);
    el.style.setProperty('--x', `${pos.x}%`);
    el.style.setProperty('--y', `${pos.y}%`);
    el.style.setProperty('--transition', 'opacity .4s ease');
    el.style.opacity = '0';
    el.innerHTML = `
      <div class="pin ${pinColor()}"></div>
      <button class="hm-polaroid-del" aria-label="删除" title="从相册移除">✕</button>
      <div class="polaroid-frame">
        <div class="polaroid-photo">
          <img src="${item.dataUrl}" alt="${item.caption || '上传照片'}" loading="lazy">
        </div>
        <div class="polaroid-caption">${item.caption || '— my photo —'}</div>
      </div>
    `;
    requestAnimationFrame(() => { el.style.opacity = '1'; });
    return el;
  }

  // 渲染所有用户照片到 board
  function renderAll() {
    const board = document.querySelector('.page.page--active[data-page="gallery"] .gallery-board');
    if (!board) return;
    board.querySelectorAll('.polaroid--user').forEach(n => n.remove());
    const items = loadAll();
    items.forEach(item => board.appendChild(buildPolaroid(item)));
  }

  async function onFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const existing = loadAll();
    let saved = 0, failed = 0;
    for (const file of files) {
      if (!file.type.startsWith('image/')) { failed++; continue; }
      try {
        const dataUrl = await compressImage(file);
        existing.push({
          id: 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
          dataUrl,
          caption: '— ' + (file.name.replace(/\.[^.]+$/, '').slice(0, 14) || 'photo') + ' —',
          ...randomPos(),
          createdAt: Date.now()
        });
        saved++;
      } catch(err) { failed++; console.warn('Upload fail:', err); }
    }
    saveAll(existing);
    renderAll();
    e.target.value = ''; // 重置，允许重复选同一文件
    if (saved) flashToast(`✅ 已上传 ${saved} 张${failed ? `（失败 ${failed}）` : ''}`);
    else if (failed) flashToast(`❌ ${failed} 张上传失败`);
  }

  // 浮动提示条
  function flashToast(msg) {
    const t = document.createElement('div');
    t.className = 'hm-toast';
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,.85)', color: '#fff', padding: '10px 18px',
      borderRadius: '8px', fontSize: '14px', zIndex: 9999,
      boxShadow: '0 4px 20px rgba(0,0,0,.3)', opacity: '0',
      transition: 'opacity .25s ease, transform .25s ease'
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(-4px)'; });
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 280); }, 2200);
  }

  // 删除单张
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.hm-polaroid-del');
    if (!btn) return;
    e.stopPropagation();
    const polaroid = btn.closest('.polaroid--user');
    if (!polaroid) return;
    if (!confirm('从相册中删除这张照片？')) return;
    const id = polaroid.dataset.galleryId;
    const arr = loadAll().filter(i => i.id !== id);
    saveAll(arr);
    polaroid.style.opacity = '0';
    polaroid.style.transform += ' scale(.85)';
    setTimeout(() => polaroid.remove(), 300);
  });

  // 暴露 trigger 给占位按钮的 handler 调用
  window.__galleryTriggerUpload = () => { ensureFileInput(); fileInput.click(); };

  // SPA 切到 Gallery 时渲染
  window.__onPage('gallery', () => { setTimeout(renderAll, 500); });
})();

/* =========================================================================
   各模块占位按钮（Gallery 上传 / Worlds 文档 / Music MP3 / Studio 跳转）
   纯 UI，无后端逻辑 — 后续接后端时替换即可
   ========================================================================= */
(() => {
  // SPA 切页面时，隐藏所有非 active 页面里的 hm-placeholder-bar
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-page-link]')) {
      setTimeout(() => {
        document.querySelectorAll('.hm-placeholder-bar').forEach(bar => {
          const page = bar.closest('.page');
          if (page) bar.style.display = page.classList.contains('page--active') ? '' : 'none';
        });
      }, 80);
    }
  });

  window.__onPage('gallery', () => {
    setTimeout(() => {
      const board = document.querySelector('.gallery-board, .gallery-corkboard');
      if (!board || board.querySelector('.hm-placeholder-bar')) return;
      const bar = document.createElement('div');
      bar.className = 'hm-placeholder-bar';
      bar.style.cssText = `
        position:absolute; top:12px; right:12px; z-index:50;
        display:flex; gap:8px; align-items:center;
      `;
      bar.innerHTML = `
        <button class="hm-placeholder-btn" data-hm-action="gallery-upload">📤 Upload Photos</button>
        <span class="hm-placeholder-badge hm-badge-live">READY · localStorage</span>
      `;
      board.style.position = board.style.position || 'relative';
      board.appendChild(bar);
    }, 400);
  });

  window.__onPage('worlds', () => {
    setTimeout(() => {
      const scene = document.querySelector('.street-scene');
      if (!scene || scene.querySelector('.hm-placeholder-bar')) return;
      const bar = document.createElement('div');
      bar.className = 'hm-placeholder-bar';
      bar.style.cssText = `
        position:absolute; top:12px; right:12px; z-index:50;
        display:flex; gap:8px; align-items:center;
      `;
      bar.innerHTML = `
        <button class="hm-placeholder-btn" data-hm-action="worlds-doc">📝 Upload Doc</button>
        <button class="hm-placeholder-btn" data-hm-action="worlds-workshop">⚙ Link Workshop</button>
        <span class="hm-placeholder-badge">PLACEHOLDERS</span>
      `;
      scene.style.position = scene.style.position || 'relative';
      scene.appendChild(bar);
    }, 400);
  });

  window.__onPage('studio', () => {
    setTimeout(() => {
      const scene = document.querySelector('.page[data-page="studio"]');
      if (!scene || scene.querySelector('.hm-placeholder-bar')) return;
      scene.style.position = 'relative';
      const bar = document.createElement('div');
      bar.className = 'hm-placeholder-bar';
      bar.style.cssText = `
        position:absolute; top:12px; right:12px; z-index:999;
        display:flex; gap:8px; align-items:center;
      `;
      bar.innerHTML = `
        <button class="hm-placeholder-btn" data-hm-action="studio-workshop">⚙ Open Workshop Editor</button>
        <span class="hm-placeholder-badge">PLACEHOLDER</span>
      `;
      scene.appendChild(bar);
    }, 400);
  });

  window.__onPage('music', () => {
    setTimeout(() => {
      const scene = document.querySelector('.page[data-page="music"]');
      if (!scene || scene.querySelector('.hm-placeholder-bar')) return;
      scene.style.position = 'relative';
      const bar = document.createElement('div');
      bar.className = 'hm-placeholder-bar';
      bar.style.cssText = `
        position:absolute; top:12px; right:12px; z-index:999;
        display:flex; gap:8px; align-items:center;
      `;
      bar.innerHTML = `
        <button class="hm-placeholder-btn" data-hm-action="music-upload">🎵 Upload MP3</button>
        <span class="hm-placeholder-badge">PLACEHOLDER</span>
      `;
      scene.appendChild(bar);
    }, 400);
  });

  // 占位按钮统一事件委托 — Gallery 上传已升级为真实功能，其余仍 alert
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-hm-action]');
    if (!btn) return;
    const action = btn.dataset.hmAction;
    if (action === 'gallery-upload') {
      e.preventDefault(); e.stopPropagation();
      if (window.__galleryTriggerUpload) window.__galleryTriggerUpload();
      return;
    }
    const map = {
      'worlds-doc':       '📝 Worlds 上传文档功能 — 等后端方案确认后实现',
      'worlds-workshop':  '⚙ 链接 Workshop 编辑器 — 等 Workshop 部署后填入真实 URL',
      'studio-workshop':  '⚙ 链接 Workshop 编辑器 — 等 Workshop 部署后填入真实 URL',
      'music-upload':     '🎵 Music MP3 上传 — 准备好 MP3 文件后填入 src 或 localStorage'
    };
    alert(map[action] || 'Coming Soon');
  });
})();

/* =========================================================================
   Sweets Shop Init — 万花筒换色 + 扭蛋机抽卡 + 愿望投币罐 + 小火车
   ========================================================================= */
(() => {
  const LUCKY_TAGS = [
    '大吉 · 今日の運勢は最高 ♡',
    '中吉 · ちょっといいことあるかも',
    '小吉 · 普通の一日です',
    '吉 · 推しに会えるかもしれない',
    '恋愛運 ↑ ↑ ↑ · 勇気出して',
    '金運 ↑ · ちりも積もれば山となる',
    '願い事 · 少しずつ叶う',
    '今日のスイーツ · チョコレートが吉'
  ];

  const KALEI_PALETTES = [
    ['#ff6b9d','#ffd93d','#6bcb77','#4d96ff','#d4c1ec','#f7d774','#ff9ec4','#b8e0d2'],
    ['#00f5d4','#00bbf9','#fee440','#f15bb5','#9b5de5','#ff006e','#8338ec','#3a86ff'],
    ['#ffadad','#ffd6a5','#fdffb6','#caffbf','#9bf6ff','#a0c4ff','#bdb2ff','#ffc6ff'],
    ['#ff0a54','#ff477e','#ff7096','#ff85a1','#fbb1bd','#f9bec7','#f7cad0','#fae0e4'],
    ['#264653','#2a9d8f','#e9c46a','#f4a261','#e76f51','#2b2d42','#8d99ae','#edf2f4']
  ];

  // ---------- 万花筒换色 ----------
  document.addEventListener('click', (e) => {
    const kalei = e.target.closest('.hm-kaleidoscope');
    if (!kalei) return;
    const colors = kalei.querySelectorAll('.hm-kaleidoscope-colors');
    if (!colors.length) return;
    const palette = KALEI_PALETTES[Math.floor(Math.random() * KALEI_PALETTES.length)];
    colors.forEach((grid, gi) => {
      grid.querySelectorAll('span').forEach((sp, i) => {
        sp.style.background = palette[(i + gi * 2) % palette.length];
      });
    });
    window.playClickSound?.();
  });

  // ---------- 扭蛋机抽卡 ----------
  document.addEventListener('click', (e) => {
    const knob = e.target.closest('#hmGashaponKnob');
    if (!knob) return;
    const gashapon = knob.closest('.hm-gashapon');
    if (!gashapon || gashapon.classList.contains('is-dropping')) return;

    gashapon.classList.add('is-dropping');
    window.playClickSound?.();

    setTimeout(() => {
      gashapon.classList.remove('is-dropping');
      gashapon.classList.add('is-bursting');

      const lucky = LUCKY_TAGS[Math.floor(Math.random() * LUCKY_TAGS.length)];
      // 弹 toast 显示运势
      flashLucky(lucky);
      // 愿望罐金币 +1
      addWishCoin();

      setTimeout(() => gashapon.classList.remove('is-bursting'), 600);
    }, 1200);
  });

  function flashLucky(text) {
    const t = document.createElement('div');
    t.style.cssText = `
      position:fixed; top:30%; left:50%; transform:translate(-50%,-50%) scale(.5);
      background:linear-gradient(180deg,#fff8f0,#fff0e0);
      border:2px solid #c48a4e; border-radius:6px; padding:18px 28px;
      color:#4a2c1a; font-size:16px; font-weight:700;
      box-shadow:0 8px 30px rgba(0,0,0,.25); text-align:center;
      opacity:0; z-index:10000; font-family:cursive;
    `;
    t.innerHTML = `🎰 おみくじ ♡<br><span style="font-size:14px; color:#c48a4e; margin-top:6px; display:block;">${text}</span>`;
    document.body.appendChild(t);
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translate(-50%,-50%) scale(1)';
    });
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translate(-50%,-50%) scale(.9)';
      setTimeout(() => t.remove(), 300);
    }, 2800);
  }

  // ---------- 愿望投币罐 ----------
  function addWishCoin() {
    const jar = document.getElementById('hmWishJar');
    if (!jar) return;
    const coinsContainer = document.getElementById('hmWishCoins');
    if (!coinsContainer) return;

    const total = parseInt(localStorage.getItem('himemiro_wish_coins') || '0', 10) + 1;
    localStorage.setItem('himemiro_wish_coins', total);

    // 更新 UI 计数标签
    const counter = document.getElementById('hmWishCounter');
    if (counter) counter.textContent = total;

    const coin = document.createElement('span');
    const offset = (Math.random() * 30 - 15).toFixed(1);
    coin.style.left = `calc(50% + ${offset}px)`;
    coin.style.bottom = (10 + coinsContainer.children.length * 2) + 'px';
    coin.style.animation = 'hm-coin-fall 1s ease-out forwards';
    coin.style.setProperty('--x', offset + 'px');
    coinsContainer.appendChild(coin);

    jar.classList.add('is-glowing');
    setTimeout(() => jar.classList.remove('is-glowing'), 600);
  }

  // 愿望罐输入框提交
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#hmWishBtn');
    if (!btn) return;
    const jar = document.getElementById('hmWishJar');
    const input = document.getElementById('hmWishInput');
    const note = document.getElementById('hmWishNote');
    const textEl = document.getElementById('hmWishText');
    if (!jar || !input || !note || !textEl) return;

    const text = input.value.trim() || 'なんでも願い事...';
    textEl.textContent = text;
    input.value = '';

    addWishCoin();

    // 弹出许愿签
    note.style.opacity = '0';
    note.style.transform = 'translate(-50%, -50%) scale(.4) rotate(-8deg)';
    jar.classList.add('is-popping');
    setTimeout(() => {
      jar.classList.remove('is-popping');
      note.style.opacity = '';
      note.style.transform = '';
    }, 500);

    // 持久化最近愿望
    try {
      const wishes = JSON.parse(localStorage.getItem('himemiro_wishes') || '[]');
      wishes.unshift({ text, ts: Date.now() });
      localStorage.setItem('himemiro_wishes', JSON.stringify(wishes.slice(0, 5)));
    } catch {}

    window.playClickSound?.();
  });

  // 初始化愿望罐金币堆积（从 localStorage 恢复）
  window.__onPage('sweets', () => {
    setTimeout(() => {
      const coinsContainer = document.getElementById('hmWishCoins');
      if (!coinsContainer) return;
      const total = parseInt(localStorage.getItem('himemiro_wish_coins') || '0', 10);
      coinsContainer.innerHTML = '';
      for (let i = 0; i < Math.min(total, 30); i++) {
        const c = document.createElement('span');
        c.style.left = `calc(50% + ${(Math.random() * 40 - 20).toFixed(1)}px)`;
        c.style.bottom = (10 + (i % 10) * 2) + 'px';
        coinsContainer.appendChild(c);
      }
    }, 500);
  });

  // ---------- 小火车 ----------
  const trainHTML = `
    <div class="hm-train">
      <div class="hm-train-body">
        <div class="hm-train-coach hm-train-engine"></div>
        <div class="hm-train-coach"></div>
        <div class="hm-train-coach"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', trainHTML);

})();

/* =========================================================================
   DIY Ice Cream 安静书 · 拖拽吸附引擎 + sub-view 切换
   ========================================================================= */
(() => {
  const SNAP_DIST = 60; // 吸附阈值（px）
  const ZONE_OFFSET = {
    cone:  { x: 0, y: -40 },
    cup:   { x: 0, y: -50 },
    plate: { x: 0, y: -20 }
  };

  /* ---------- Web Audio · 音效 ---------- */
  let _audCtx = null;
  function aud() {
    if (!_audCtx) _audCtx = new (window.AudioContext || window.webkitAudioContext)();
    return _audCtx;
  }
  // 短促 POP 吸附声
  function playPop() {
    try {
      const c = aud(); const t = c.currentTime;
      const o = c.createOscillator(); const g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(900, t);
      o.frequency.exponentialRampToValueAtTime(280, t + 0.12);
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g).connect(c.destination);
      o.start(t); o.stop(t + 0.2);
    } catch(e){}
  }
  // 开心 Mua~ 开吃声（三连 beep 渐弱）
  function playMua() {
    try {
      const c = aud();
      [0, 0.12, 0.26].forEach((delay, i) => {
        const t = c.currentTime + delay;
        const o = c.createOscillator(); const g = c.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(660 - i*80, t);
        g.gain.setValueAtTime(0.25 - i*0.06, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        o.connect(g).connect(c.destination);
        o.start(t); o.stop(t + 0.22);
      });
    } catch(e){}
  }
  // 拍照咔哒声
  function playSnap() {
    try {
      const c = aud(); const t = c.currentTime;
      // 短促白噪声模拟快门
      const buf = c.createBuffer(1, c.sampleRate * 0.08, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * (1 - i/d.length);
      const src = c.createBufferSource(); src.buffer = buf;
      const g = c.createGain(); g.gain.value = 0.5;
      src.connect(g).connect(c.destination); src.start(t);
      // 高频叮
      const o = c.createOscillator(); const g2 = c.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(1800, t+0.06);
      g2.gain.setValueAtTime(0.2, t+0.06);
      g2.gain.exponentialRampToValueAtTime(0.001, t+0.2);
      o.connect(g2).connect(c.destination);
      o.start(t+0.06); o.stop(t+0.25);
    } catch(e){}
  }

  /* ---------- 素材数据（名称 + 价格 ¥） ---------- */
  const FLAVOR_NAME = {
    vanilla: '香草', strawberry: '草莓', chocolate: '巧克力', matcha: '抹茶'
  };
  const TOPPING_NAME = {
    sprinkles: '彩虹糖针', 'choco-sauce': '巧克力酱', cherry: '樱桃', oreo: '奥利奥碎'
  };
  const ITEM_PRICE = {
    vanilla: 15, strawberry: 16, chocolate: 18, matcha: 20,
    sprinkles: 3, 'choco-sauce': 5, cherry: 4, oreo: 6
  };

  /* ---------- Zone 状态更新 ---------- */
  const ZONE_MAX = 7;       // 最多 7 层
  const ZONE_WOBBLY = 5;    // ≥5 层开始倾斜

  function updateZoneStates() {
    document.querySelectorAll('.hm-ic-zone').forEach(zone => {
      const count = zone.querySelectorAll('.hm-ic-snap-item').length;
      zone.classList.toggle('is-empty', count === 0);
      zone.classList.toggle('is-full', count >= ZONE_MAX);
      zone.classList.toggle('is-wobbly', count >= ZONE_WOBBLY && count < ZONE_MAX);
    });
  }

  /* ---------- 冰箱剩余数量 badge ---------- */
  function updateFridgeCount() {
    const fridge = document.querySelector('.hm-ic-fridge');
    if (!fridge) return;
    let badge = fridge.querySelector('.hm-ic-fridge-count');
    const remaining = fridge.querySelectorAll('.hm-ic-item').length;
    if (remaining === 8) {
      if (badge) badge.remove();
      return;
    }
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'hm-ic-fridge-count';
      fridge.appendChild(badge);
    }
    badge.textContent = remaining;
    badge.style.display = remaining > 0 ? 'flex' : 'none';
    // 最后 2 个变淡
    fridge.querySelectorAll('.hm-ic-item').forEach((el, i, arr) => {
      el.classList.toggle('hm-ic-item--last', arr.length - i <= 2);
    });
  }

  /* ---------- 订单小票（动态生成在 zone 底部） ---------- */
  function updateReceipt(zone) {
    let receipt = zone.querySelector('.hm-ic-receipt');
    const items = zone.querySelectorAll('.hm-ic-snap-item');
    if (items.length === 0) { if (receipt) receipt.remove(); return; }
    if (!receipt) {
      receipt = document.createElement('div');
      receipt.className = 'hm-ic-receipt';
      zone.style.position = 'relative';
      zone.appendChild(receipt);
    }
    const lines = []; let total = 0;
    items.forEach((el, idx) => {
      const flavor = el.dataset.flavor; const type = el.dataset.type;
      const name = type === 'ball' ? (FLAVOR_NAME[flavor] || flavor) + '球' : (TOPPING_NAME[flavor] || flavor);
      const price = ITEM_PRICE[flavor] || 5;
      lines.push(`<div class="hm-ic-receipt-line"><span>${idx+1}. ${name}</span><span>¥${price}</span></div>`);
      total += price;
    });
    receipt.innerHTML = `
      <div class="hm-ic-receipt-title">★ HIMEMIRO ★</div>
      ${lines.join('')}
      <div class="hm-ic-receipt-total">合計 ¥${total}</div>
    `;
  }

  /* ---------- Drop hint（拖拽时显示层级/位置） ---------- */
  let _dropHint = null;
  function showDropHint(x, y, zone, nextIdx) {
    if (!_dropHint) {
      _dropHint = document.createElement('div');
      _dropHint.className = 'hm-ic-drop-hint';
      document.body.appendChild(_dropHint);
    }
    _dropHint.style.left = x + 'px'; _dropHint.style.top = (y - 36) + 'px';
    if (zone) {
      _dropHint.classList.add('is-target');
      _dropHint.textContent = `↓ 第 ${nextIdx + 1} 层 · SNAP!`;
    } else {
      _dropHint.classList.remove('is-target');
      _dropHint.textContent = '🖐️ 松开丢弃';
    }
  }
  function hideDropHint() { if (_dropHint) { _dropHint.remove(); _dropHint = null; } }

  /* ---------- 真实拍立得生成 ---------- */
  function generatePolaroidFromCanvas() {
    const canvas = document.getElementById('hmIcCanvas');
    if (!canvas) return;
    const zones = canvas.querySelectorAll('.hm-ic-zone');
    let totalItems = 0;
    const photos = [];
    zones.forEach((zone, zi) => {
      const zoneKey = zone.dataset.icZone;
      const zoneItems = zone.querySelectorAll('.hm-ic-snap-item');
      if (zoneItems.length === 0) return;
      totalItems += zoneItems.length;
      zoneItems.forEach(item => {
        photos.push({
          zone: zoneKey,
          type: item.dataset.type,
          flavor: item.dataset.flavor,
          icon: item.textContent.trim()
        });
      });
    });
    if (totalItems === 0) return null;
    // 保存到 localStorage
    const store = JSON.parse(localStorage.getItem('himemiro_icecream_photos') || '[]');
    const entry = { ts: Date.now(), items: photos };
    store.unshift(entry);
    localStorage.setItem('himemiro_icecream_photos', JSON.stringify(store.slice(0, 10)));

    // 在 canvas 里生成 DOM 版拍立得（不是真拍照，是视觉效果）
    const pol = document.createElement('div');
    pol.style.cssText = `
      position:absolute; right:-20px; top:-10px; width:120px;
      background:#fff; padding:8px 8px 28px;
      box-shadow: 4px 6px 16px rgba(0,0,0,.2);
      transform: rotate(-8deg); z-index: 10;
      border-radius: 2px;
      font-family: monospace;
    `;
    // 拍立得内容：emoji 堆叠显示最终作品
    const zoneEmojis = {};
    photos.forEach(p => { zoneEmojis[p.zone] = (zoneEmojis[p.zone] || '') + p.icon; });
    const emojiStr = photos.map(p => p.icon).join('');
    pol.innerHTML = `
      <div style="background:#fdf4e4; height:90px; border:1px solid #eee;
        display:flex; align-items:center; justify-content:center;
        font-size:28px; letter-spacing:4px; line-height:1.1;
        text-align:center; padding:4px;">
        ${emojiStr.slice(0,16)}
      </div>
      <div style="text-align:center; color:#d6336c; font-size:10px; margin-top:4px;">
        ✦ ${new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})} ✦
      </div>
    `;
    canvas.appendChild(pol);
    // 3 秒后飞走
    setTimeout(() => {
      pol.style.transition = 'all 1s cubic-bezier(.3,1.5,.6,1)';
      pol.style.transform = 'translate(200px, -120px) rotate(25deg)';
      pol.style.opacity = '0';
    }, 1800);
    setTimeout(() => pol.remove(), 2900);
    return true;
  }

  // Flavor → 颜色类映射
  const FLAVOR_CLASS = {
    vanilla:    'hm-ic-flavor-vanilla',
    strawberry: 'hm-ic-flavor-strawberry',
    chocolate:  'hm-ic-flavor-chocolate',
    matcha:     'hm-ic-flavor-matcha'
  };
  const TOPPING_CLASS = {
    'sprinkles':    'hm-ic-topping-sprinkles',
    'choco-sauce':  'hm-ic-topping-choco-sauce',
    'cherry':       'hm-ic-topping-cherry',
    'oreo':         'hm-ic-topping-oreo'
  };

  // ---------- sub-view tab 切换 ----------
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.hm-sweets-tab');
    if (!tab) return;
    const target = tab.dataset.sweetsView;
    document.querySelectorAll('.hm-sweets-tab').forEach(t => t.classList.toggle('is-active', t === tab));
    document.querySelectorAll('.hm-sweets-view').forEach(v => {
      v.classList.toggle('is-active', v.dataset.sweetsView === target);
    });
    if (target === 'icecream') {
      setTimeout(() => initDragEngine(), 200);
    }
  });

  // ---------- 冰箱开门 ----------
  document.addEventListener('click', (e) => {
    const door = e.target.closest('#hmIcFridgeDoor');
    if (door) door.closest('.hm-ic-fridge').classList.toggle('is-open');
  });

  // ---------- 全局拖拽状态 ----------
  let drag = null; // { itemEl, flavor, type, dragEl, startX, startY, offsetX, offsetY }

  function initDragEngine() {
    // 给冰箱里所有 item 绑 pointerdown
    document.querySelectorAll('.hm-ic-item').forEach(el => {
      el.addEventListener('pointerdown', onItemDown);
    });
    document.querySelectorAll('.hm-ic-snap-item').forEach(el => {
      el.addEventListener('pointerdown', onSnapItemDown);
    });
    // 每次进冰淇淋店自动打开冰箱门（方便）
    const fridge = document.querySelector('.hm-ic-fridge');
    if (fridge && !fridge.classList.contains('is-open')) fridge.classList.add('is-open');
    // 初始状态刷新
    updateZoneStates();
    updateFridgeCount();
    document.querySelectorAll('.hm-ic-zone').forEach(z => updateReceipt(z));
  }

  // 新建拖拽（从冰箱拿）
  function onItemDown(e) {
    if (drag) return;
    const el = e.currentTarget;
    const flavor = el.dataset.flavor;
    const type = el.dataset.icType; // 'ball' | 'topping'
    el.setPointerCapture?.(e.pointerId);

    drag = {
      source: 'inventory',
      itemEl: el,
      flavor, type,
      icon: el.textContent.trim(),
      colorClass: type === 'ball' ? FLAVOR_CLASS[flavor] : TOPPING_CLASS[flavor],
      dragEl: createDragGhost(flavor, type, el.textContent.trim()),
      startX: e.clientX, startY: e.clientY,
      x: e.clientX, y: e.clientY,
      count: 0
    };
    window.playClickSound?.();
    document.addEventListener('pointermove', onDragMove);
    document.addEventListener('pointerup', onDragUp);
  }

  // 从 zone 内已吸附的 item 再拖（移除）
  function onSnapItemDown(e) {
    const el = e.currentTarget;
    el.setPointerCapture?.(e.pointerId);
    const zone = el.closest('.hm-ic-zone');
    const zoneKey = zone?.dataset.icZone;

    drag = {
      source: 'zone',
      snapItemEl: el,
      zoneKey,
      dragEl: createDragGhost(el.dataset.flavor, el.dataset.type, el.textContent.trim()),
      startX: e.clientX, startY: e.clientY,
      x: e.clientX, y: e.clientY,
      offsetX: 26, offsetY: 26,
      count: 0,
      type: el.dataset.type,
      flavor: el.dataset.flavor
    };
    el.remove(); // 先从 zone 移除，drag 结束再决定
    document.addEventListener('pointermove', onDragMove);
    document.addEventListener('pointerup', onDragUp);
  }

  function createDragGhost(flavor, type, icon) {
    const layer = document.getElementById('hmIcDragLayer');
    if (!layer) return null;
    const d = document.createElement('div');
    d.className = 'hm-ic-drag-item ' + (type === 'topping' ? 'topping' : '');
    d.classList.add(FLAVOR_CLASS[flavor] || TOPPING_CLASS[flavor] || '');
    d.textContent = icon || '';
    d.style.left = drag?.x + 'px' || '0';
    d.style.top  = drag?.y + 'px' || '0';
    layer.appendChild(d);
    return d;
  }

  function onDragMove(e) {
    if (!drag) return;
    drag.x = e.clientX; drag.y = e.clientY;
    if (drag.dragEl) drag.dragEl.style.left = e.clientX + 'px', drag.dragEl.style.top = e.clientY + 'px';

    // Zone hover 高亮
    document.querySelectorAll('.hm-ic-zone').forEach(z => z.classList.remove('is-hover'));
    const hoveredZone = findZoneAt(e.clientX, e.clientY);
    if (hoveredZone) hoveredZone.classList.add('is-hover');

    // Drop hint 跟随
    if (hoveredZone) {
      const nextIdx = hoveredZone.querySelectorAll('.hm-ic-snap-item').length;
      showDropHint(e.clientX, e.clientY, hoveredZone, nextIdx);
    } else {
      showDropHint(e.clientX, e.clientY, null, 0);
    }
  }

  function findZoneAt(cx, cy) {
    const zones = document.querySelectorAll('.hm-ic-zone');
    let closest = null, minD = Infinity;
    zones.forEach(z => {
      const r = z.getBoundingClientRect();
      const zx = r.left + r.width / 2 + 20; // zone-items 容器位置
      const zy = r.top + r.height - 40;
      const d = Math.hypot(cx - zx, cy - zy);
      if (d < minD) { minD = d; closest = z; }
    });
    return minD < SNAP_DIST ? closest : null;
  }

  function onDragUp(e) {
    document.removeEventListener('pointermove', onDragMove);
    document.removeEventListener('pointerup', onDragUp);

    // 清除 zone hover + drop hint
    document.querySelectorAll('.hm-ic-zone').forEach(z => z.classList.remove('is-hover'));
    hideDropHint();

    if (!drag) return;

    const hovered = findZoneAt(e.clientX, e.clientY);
    if (hovered) {
      snapToZone(hovered);
    } else {
      // 丢到桌面 — 从 zone 拖的 item 因为已经 remove 了，需要恢复它原来的 zone 状态
      if (drag.source === 'zone') {
        updateZoneStates();
        updateReceipt(document.querySelector(`.hm-ic-zone[data-ic-zone="${drag.zoneKey}"]`));
      }
      // 从冰箱拖的 item — 丢了不恢复（消失），更有真实感
      else {
        updateFridgeCount();
      }
    }

    if (drag.dragEl) drag.dragEl.remove();
    drag = null;
  }

  function snapToZone(zone) {
    const container = zone.querySelector('.hm-ic-zone-items');
    if (!container) return;

    const snap = document.createElement('div');
    snap.className = 'hm-ic-snap-item ' + (drag.type === 'topping' ? 'topping' : '');
    snap.classList.add(drag.colorClass || '');
    snap.textContent = drag.icon || '';
    snap.dataset.type = drag.type;
    snap.dataset.flavor = drag.flavor;
    snap.style.setProperty('--i', container.children.length);

    container.appendChild(snap);
    snap.addEventListener('pointerdown', onSnapItemDown);

    // ---- 交互增强 ----
    playPop();
    zone.classList.remove('is-bounce');
    void zone.offsetWidth; // 强制 reflow 重启动画
    zone.classList.add('is-bounce');
    setTimeout(() => zone.classList.remove('is-bounce'), 400);

    updateZoneStates();
    updateReceipt(zone);

    // 移除冰箱里的 item
    if (drag.source === 'inventory') {
      drag.itemEl.remove();
      updateFridgeCount();
    }
  }

  // ---------- 操作按钮 ----------
  document.addEventListener('click', (e) => {
    const canvas = document.getElementById('hmIcCanvas');
    if (!canvas) return;

    // 开吃
    if (e.target.closest('#hmIcEatBtn')) {
      let anyItem = false;
      document.querySelectorAll('.hm-ic-snap-item').forEach(el => {
        anyItem = true;
        const zone = el.closest('.hm-ic-zone');
        if (zone) zone.classList.add('is-eating');
      });
      playMua();
      // Mua~ 文字
      const mua = document.createElement('div');
      mua.className = 'hm-ic-mua';
      mua.textContent = anyItem ? 'Mua~' : '🫗 还没装呢';
      mua.style.left = '50%'; mua.style.top = '40%';
      canvas.appendChild(mua);

      if (anyItem) {
        // 逐个 zone 清空 receipt
        document.querySelectorAll('.hm-ic-receipt').forEach(r => r.remove());
        setTimeout(() => {
          mua.remove();
          document.querySelectorAll('.hm-ic-zone').forEach(z => {
            z.classList.remove('is-eating');
            z.querySelector('.hm-ic-zone-items').innerHTML = '';
          });
          updateZoneStates();
          updateFridgeCount();
        }, 1500);
      } else {
        setTimeout(() => mua.remove(), 1200);
      }
    }

    // 拍照 —— playSnap + 真实拍立得
    if (e.target.closest('#hmIcPhotoBtn')) {
      const count = document.querySelectorAll('.hm-ic-snap-item').length;
      if (count === 0) {
        const toast = document.createElement('div');
        toast.className = 'hm-ic-photo-toast';
        toast.innerHTML = '📷 先拼一份甜品再拍照哦~';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1400);
        return;
      }
      playSnap();
      generatePolaroidFromCanvas();

      const emojis = Array.from(document.querySelectorAll('.hm-ic-snap-item')).map(i => i.textContent.trim()).join('');
      const toast = document.createElement('div');
      toast.className = 'hm-ic-photo-toast';
      toast.innerHTML = `📷 拍立得 · ${emojis}<br><span style="font-size:11px; color:#888;">已保存 ✦</span>`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 1800);
    }

    // 重做
    if (e.target.closest('#hmIcResetBtn')) {
      // 清空 zone + receipt
      document.querySelectorAll('.hm-ic-zone-items').forEach(c => c.innerHTML = '');
      document.querySelectorAll('.hm-ic-receipt').forEach(r => r.remove());
      // 恢复冰箱
      const fridgeInside = document.getElementById('hmIcFridgeInside');
      const hasItems = fridgeInside?.querySelector('.hm-ic-item');
      if (fridgeInside && !hasItems) {
        fridgeInside.innerHTML = `
          <div class="hm-ic-category"><div class="hm-ic-cat-title">🍦 アイス · Ice Cream</div>
            <div class="hm-ic-item" data-ic-type="ball" data-flavor="vanilla">🍨</div>
            <div class="hm-ic-item" data-ic-type="ball" data-flavor="strawberry">🍓</div>
            <div class="hm-ic-item" data-ic-type="ball" data-flavor="chocolate">🍫</div>
            <div class="hm-ic-item" data-ic-type="ball" data-flavor="matcha">🍵</div>
          </div>
          <div class="hm-ic-category"><div class="hm-ic-cat-title">🍬 トッピング · Toppings</div>
            <div class="hm-ic-item" data-ic-type="topping" data-flavor="sprinkles">🌈</div>
            <div class="hm-ic-item" data-ic-type="topping" data-flavor="choco-sauce">💧</div>
            <div class="hm-ic-item" data-ic-type="topping" data-flavor="cherry">🍒</div>
            <div class="hm-ic-item" data-ic-type="topping" data-flavor="oreo">🟤</div>
          </div>
        `;
        initDragEngine();
      }
      updateZoneStates();
      updateFridgeCount();
    }
  });

  // 进 SPA sweets 时，如果上次在 icecream 视图，恢复
  window.__onPage('sweets', () => {
    setTimeout(() => {
      initDragEngine();
      const fridge = document.querySelector('.hm-ic-fridge');
      if (fridge && !fridge.classList.contains('is-open')) fridge.classList.add('is-open');
    }, 600);
  });

})();

/* =========================================================================
   R1 · 复古挂历 · 撕页 + 废纸山堆积
   ========================================================================= */
(() => {
  const MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  const WEEKDAYS = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
  let currentDay = 17, currentMonth = 9, currentYear = 2026;

  // 初始化挂历日期（用系统真实日期）
  window.__onPage('gallery', () => {
    setTimeout(() => {
      const cal = document.querySelector('[data-tear-calendar]');
      if (!cal) return;
      const now = new Date();
      currentDay = now.getDate(); currentMonth = now.getMonth(); currentYear = now.getFullYear();
      document.getElementById('hmCalMonth').textContent = MONTHS[currentMonth] + ' ' + currentYear;
      document.getElementById('hmCalDay').textContent = currentDay;
      document.querySelector('.hm-calendar-weekday').textContent = '· ' + WEEKDAYS[now.getDay()] + ' ·';
    }, 500);
  });

  // 挂历点击撕页
  document.addEventListener('click', (e) => {
    const cal = e.target.closest('[data-tear-calendar]');
    if (!cal || cal.classList.contains('is-tearing')) return;

    cal.classList.add('is-tearing');
    window.playClickSound?.();

    setTimeout(() => {
      cal.classList.remove('is-tearing');
      // 更新日期
      currentDay++;
      if (currentDay > new Date(currentYear, currentMonth + 1, 0).getDate()) {
        currentDay = 1; currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      }
      document.getElementById('hmCalDay').textContent = currentDay;
      document.getElementById('hmCalMonth').textContent = MONTHS[currentMonth] + ' ' + currentYear;
      const wd = new Date(currentYear, currentMonth, currentDay).getDay();
      document.querySelector('.hm-calendar-weekday').textContent = '· ' + WEEKDAYS[wd] + ' ·';
      // 新的一天都是红圈重点
      document.getElementById('hmCalDay').classList.add('is-today');
      // 废纸山 +1
      addTrashPiece();
    }, 1400);
  });

  // 废纸山
  function addTrashPiece() {
    let pile = document.querySelector('.hm-trash-pile');
    if (!pile) {
      pile = document.createElement('div');
      pile.className = 'hm-trash-pile';
      document.body.appendChild(pile);
    }
    const s = document.createElement('span');
    const w = 18 + Math.random() * 18;
    s.style.width = w + 'px';
    s.style.height = (w * .6) + 'px';
    s.style.left = (Math.random() * 260 + 20) + 'px';
    s.style.bottom = (Math.random() * 40) + 'px';
    s.style.transform = `rotate(${(Math.random()*60-30).toFixed(1)}deg)`;
    pile.appendChild(s);
  }

})();

/* =========================================================================
   R2+R3 · 桌面文具店 — 彩笔涂鸦 + 橡皮擦 + 打孔机 + 剪刀
   ========================================================================= */
(() => {
  let activeTool = null; // 'crayon' | 'eraser' | 'puncher' | 'scissors' | null
  let activeColor = '#ff6b9d';
  let canvasEl = null, ctx2d = null, isDrawing = false, lastX = 0, lastY = 0;
  let tempLine = null, tempLinePoints = [];

  const CRAYON_COLORS = ['#ff6b9d','#ffd93d','#6bcb77','#4d96ff','#d4c1ec','#ff9ec4','#2d1810','#fff'];

  function toggleToolbar() {
    let tb = document.querySelector('.hm-toolbar');
    if (tb) { tb.remove(); closeDoodle(); return; }
    tb = document.createElement('div');
    tb.className = 'hm-toolbar';
    tb.innerHTML = `
      <button class="hm-tool-btn hm-tool-crayon is-active" data-tool="crayon" style="--crayon:${activeColor}" title="彩笔">🎨</button>
      <button class="hm-tool-btn hm-tool-eraser" data-tool="eraser" title="橡皮">🧽</button>
      <button class="hm-tool-btn hm-tool-puncher" data-tool="puncher" title="打孔">⭕</button>
      <button class="hm-tool-btn hm-tool-scissors" data-tool="scissors" title="剪刀">✂</button>
      ${CRAYON_COLORS.map(c => `<button class="hm-tool-btn hm-tool-crayon-color" data-color="${c}" style="--crayon:${c}; background:${c}" title="选色"></button>`).join('')}
      <button class="hm-tool-btn hm-tool-close" data-tool="close" title="关闭">✕</button>
    `;
    document.body.appendChild(tb);
  }

  document.addEventListener('click', (e) => {
    // 入口按钮
    if (e.target.closest('[data-toolbar-toggle]')) { toggleToolbar(); return; }

    // 工具栏按钮
    const btn = e.target.closest('.hm-tool-btn');
    if (!btn) return;
    const tool = btn.dataset.tool;

    if (tool === 'close') { toggleToolbar(); return; }
    if (tool === 'eraser' || tool === 'puncher' || tool === 'scissors' || tool === 'crayon') {
      document.querySelectorAll('.hm-tool-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeTool = tool;
      if (tool === 'crayon' || tool === 'eraser') openDoodle(); else closeDoodle();
      return;
    }
    if (btn.dataset.color) {
      activeColor = btn.dataset.color;
      document.querySelectorAll('[data-tool="crayon"]').forEach(b => b.style.setProperty('--crayon', activeColor));
      if (canvasEl) canvasEl.style.cursor = 'crosshair';
    }
  });

  function openDoodle() {
    if (canvasEl) return;
    canvasEl = document.createElement('canvas');
    canvasEl.className = 'hm-doodle-canvas';
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    canvasEl.style.cursor = activeTool === 'eraser' ? 'cell' : 'crosshair';
    document.body.appendChild(canvasEl);
    ctx2d = canvasEl.getContext('2d');
    ctx2d.lineCap = 'round';
    ctx2d.lineJoin = 'round';
  }

  function closeDoodle() {
    if (canvasEl) { canvasEl.remove(); canvasEl = null; ctx2d = null; }
    isDrawing = false; activeTool = null;
  }

  // 窗口 resize 时 canvas 自适应
  window.addEventListener('resize', () => {
    if (canvasEl) {
      const data = canvasEl.toDataURL();
      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;
      const img = new Image();
      img.onload = () => ctx2d.drawImage(img, 0, 0);
      img.src = data;
    }
  });

  // 涂鸦 / 橡皮 / 打孔 / 剪刀 交互
  document.addEventListener('pointerdown', (e) => {
    if (!activeTool) return;
    const x = e.clientX, y = e.clientY;

    if (activeTool === 'crayon' && canvasEl) {
      isDrawing = true; lastX = x; lastY = y;
      drawCrayon(x, y, x, y); // 起点画一个点
      canvasEl.setPointerCapture?.(e.pointerId);
    } else if (activeTool === 'eraser') {
      spawnCrumbs(x, y);
      // 橡皮效果：在 canvas 上擦除一小块区域（半透明）
      if (canvasEl) {
        ctx2d.globalCompositeOperation = 'destination-out';
        ctx2d.beginPath(); ctx2d.arc(x, y, 24, 0, Math.PI * 2); ctx2d.fill();
        ctx2d.globalCompositeOperation = 'source-over';
      }
      isDrawing = true; lastX = x; lastY = y;
    } else if (activeTool === 'puncher') {
      const hole = document.createElement('div');
      hole.className = 'hm-hole-punch';
      hole.style.left = (x - 12) + 'px'; hole.style.top = (y - 12) + 'px';
      document.body.appendChild(hole);
      setTimeout(() => hole.remove(), 400);
      window.playClickSound?.();
    } else if (activeTool === 'scissors') {
      // 开始画剪裁线
      tempLinePoints = [{ x, y }];
    }
  });

  document.addEventListener('pointermove', (e) => {
    if (!activeTool) return;
    const x = e.clientX, y = e.clientY;

    if (activeTool === 'crayon' && canvasEl && isDrawing) {
      drawCrayon(lastX, lastY, x, y);
      lastX = x; lastY = y;
    } else if (activeTool === 'eraser' && isDrawing && canvasEl) {
      ctx2d.globalCompositeOperation = 'destination-out';
      ctx2d.beginPath(); ctx2d.arc(x, y, 24, 0, Math.PI * 2); ctx2d.fill();
      ctx2d.globalCompositeOperation = 'source-over';
      spawnCrumbs(x, y);
      lastX = x; lastY = y;
    } else if (activeTool === 'scissors' && tempLinePoints.length) {
      tempLinePoints.push({ x, y });
    }
  });

  document.addEventListener('pointerup', () => {
    if (activeTool === 'crayon' || activeTool === 'eraser') isDrawing = false;
    if (activeTool === 'scissors' && tempLinePoints.length >= 2) {
      // 画一条红色剪裁线
      for (let i = 1; i < tempLinePoints.length; i++) {
        const p1 = tempLinePoints[i-1], p2 = tempLinePoints[i];
        const line = document.createElement('div');
        line.className = 'hm-cut-line';
        const dx = p2.x - p1.x, dy = p2.y - p1.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        const ang = Math.atan2(dy, dx) * 180 / Math.PI;
        line.style.left = p1.x + 'px';
        line.style.top = p1.y + 'px';
        line.style.width = len + 'px';
        line.style.transform = `rotate(${ang}deg)`;
        line.style.transformOrigin = '0 50%';
        document.body.appendChild(line);
        setTimeout(() => line.remove(), 1200);
      }
      tempLinePoints = [];
    }
  });

  // 彩笔效果：粗糙边缘（多层淡线叠加）
  function drawCrayon(x1, y1, x2, y2) {
    if (!ctx2d) return;
    ctx2d.strokeStyle = activeColor;
    ctx2d.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx2d.globalAlpha = 1 - i * 0.25;
      ctx2d.lineWidth = 3 - i * 0.8;
      ctx2d.beginPath();
      ctx2d.moveTo(x1 + (Math.random()*1.5-0.75), y1 + (Math.random()*1.5-0.75));
      ctx2d.lineTo(x2 + (Math.random()*1.5-0.75), y2 + (Math.random()*1.5-0.75));
      ctx2d.stroke();
    }
    ctx2d.globalAlpha = 1;
  }

  // 橡皮屑粒子
  function spawnCrumbs(x, y) {
    for (let i = 0; i < 6; i++) {
      const c = document.createElement('div');
      c.className = 'hm-crumb';
      c.style.left = (x + Math.random()*20-10) + 'px';
      c.style.top  = (y + Math.random()*10) + 'px';
      c.style.background = ['#f48a9e','#ff6b9d','#ff9ec4'][Math.floor(Math.random()*3)];
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 1500);
    }
  }

})();

/* =========================================================================
   Music · 点唱机 真实曲目 + Web Audio 播放器（修复暂停 + 音量 + EQ + 频谱）
   ========================================================================= */
(() => {
  const TRACKS = [
    { idx: 1,  title: 'きみのいる世界',        src: 'assets/music/01-kimi-no-iru-sekai.mp3' },
    { idx: 2,  title: '輪廻ブルーインナー',    src: 'assets/music/02-rinne-blue-inner.mp3' },
    { idx: 3,  title: 'Meido-in-hell 9999',    src: 'assets/music/03-meido-in-hell-9999.mp3' },
    { idx: 4,  title: 'Factory Below',         src: 'assets/music/04-factory-below.mp3' },
    { idx: 5,  title: 'Jade Door After Rain',  src: 'assets/music/05-jade-door-after-rain.mp3' },
    { idx: 6,  title: 'The Fragile Pulse',     src: 'assets/music/06-the-fragile-pulse.mp3' },
    { idx: 7,  title: 'BURN IT DOWN',          src: 'assets/music/07-burn-it-down.mp3' },
    { idx: 8,  title: '余響（よきょう）',       src: 'assets/music/08-yokyo-start-chikyu-gacha.mp3' },
    { idx: 9,  title: '琥珀色シュガー',        src: 'assets/music/09-kohakuiro-sugar.mp3' }
  ];
  let _curIdx = -1;

  /* ---------- Web Audio Graph: audio → source → bass → mid → treble → masterGain → analyser → destination ---------- */
  let _audCtx = null, _src = null, _gBass = null, _gMid = null, _gTreble = null, _gMaster = null, _analyser = null, _dataArr = null;
  let _vol = 0.7;

  function ensureWebAudio(audio) {
    if (_audCtx) return;
    _audCtx = new (window.AudioContext || window.webkitAudioContext)();
    _src = _audCtx.createMediaElementSource(audio);
    // 三段 EQ
    _gBass   = _audCtx.createBiquadFilter(); _gBass.type = 'lowshelf';    _gBass.frequency.value = 120; _gBass.gain.value = 0;
    _gMid    = _audCtx.createBiquadFilter(); _gMid.type = 'peaking';      _gMid.frequency.value = 1000; _gMid.Q.value = 0.7; _gMid.gain.value = 0;
    _gTreble = _audCtx.createBiquadFilter(); _gTreble.type = 'highshelf';  _gTreble.frequency.value = 8000; _gTreble.gain.value = 0;
    // 总音量
    _gMaster = _audCtx.createGain(); _gMaster.gain.value = _vol;
    // 频谱分析
    _analyser = _audCtx.createAnalyser(); _analyser.fftSize = 64;
    _dataArr = new Uint8Array(_analyser.frequencyBinCount);
    // 串联
    _src.connect(_gBass).connect(_gMid).connect(_gTreble).connect(_gMaster).connect(_analyser).connect(_audCtx.destination);
  }

  const EQ_PRESETS = {
    flat:    { bass: 0,  mid: 0,  treble: 0  },
    pop:     { bass: 5,  mid: 0,  treble: 4  },
    rock:    { bass: 7,  mid: -2, treble: 6  },
    classical:{ bass: 4, mid: 3,  treble: 3  },
    vocal:   { bass: -3, mid: 5,  treble: 2  },
    night:   { bass: 2,  mid: 2,  treble: -4 }
  };

  function applyEQPreset(name) {
    if (!_audCtx) return;
    const p = EQ_PRESETS[name]; if (!p) return;
    _gBass.gain.value = p.bass;
    _gMid.gain.value = p.mid;
    _gTreble.gain.value = p.treble;
  }

  function fmt(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60); const s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* ---------- 频谱可视化 ---------- */
  function drawSpectrum() {
    if (!_analyser) { requestAnimationFrame(drawSpectrum); return; }
    const canvas = document.getElementById('jboxSpectrum');
    if (!canvas) { requestAnimationFrame(drawSpectrum); return; }
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    _analyser.getByteFrequencyData(_dataArr);
    ctx.clearRect(0, 0, w, h);
    const barW = w / _dataArr.length * 0.8;
    for (let i = 0; i < _dataArr.length; i++) {
      const v = _dataArr[i] / 255;
      const bh = v * h;
      const grad = ctx.createLinearGradient(0, h - bh, 0, h);
      grad.addColorStop(0, '#ff6b9d'); grad.addColorStop(1, '#c9a0ff');
      ctx.fillStyle = grad;
      ctx.fillRect(i * barW * 1.2, h - bh, barW, bh);
    }
    requestAnimationFrame(drawSpectrum);
  }

  /* ---------- 曲目列表 ---------- */
  function buildTracklist() {
    const container = document.getElementById('jboxTracks');
    if (!container) return;
    container.innerHTML = TRACKS.map(t => `
      <div class="jbox-track-row" data-jbox-track="${t.idx - 1}">
        <div class="jbox-track-idx">${String(t.idx).padStart(2, '0')}</div>
        <div class="jbox-track-name">${t.title}</div>
        <div class="jbox-track-dur" id="jboxDur${t.idx - 1}">—</div>
      </div>
    `).join('');

    container.addEventListener('click', (e) => {
      const row = e.target.closest('.jbox-track-row');
      if (!row) return;
      playTrack(parseInt(row.dataset.jboxTrack));
    });
  }

  function playTrack(idx) {
    const audio = document.getElementById('jboxAudio');
    const titleEl = document.getElementById('jboxTitle');
    const btn = document.getElementById('jboxPlayBtn');
    if (!audio) return;

    ensureWebAudio(audio);
    // 浏览器首次 user gesture 后恢复 AudioContext
    if (_audCtx && _audCtx.state === 'suspended') _audCtx.resume();

    // 同一首：切换播放/暂停
    if (_curIdx === idx) {
      if (audio.paused) { audio.play().catch(() => {}); btn.textContent = '❚❚'; }
      else              { audio.pause(); btn.textContent = '▶'; }
      return;
    }

    // 切歌
    _curIdx = idx;
    const t = TRACKS[idx];
    audio.pause();
    audio.src = t.src;
    audio.load();                // ← 关键！确保资源就绪
    audio.currentTime = 0;
    audio.play().then(() => {
      btn.textContent = '❚❚';
    }).catch(err => {
      console.warn('jbox play failed:', err.message);
      btn.textContent = '▶';
    });

    if (titleEl) titleEl.textContent = t.title;
    document.querySelectorAll('.jbox-track-row').forEach((row, i) => {
      row.classList.toggle('is-active', i === idx);
    });
  }

  /* ---------- 初始化 ---------- */
  function initJukebox() {
    buildTracklist();
    const audio = document.getElementById('jboxAudio');
    const btn = document.getElementById('jboxPlayBtn');
    if (!audio) return;

    // 大按钮：播放/暂停
    btn?.addEventListener('click', () => {
      ensureWebAudio(audio);
      if (_audCtx && _audCtx.state === 'suspended') _audCtx.resume();
      if (_curIdx < 0) { playTrack(0); return; }
      if (audio.paused) { audio.play().catch(() => {}); btn.textContent = '❚❚'; }
      else              { audio.pause(); btn.textContent = '▶'; }
    });

    // 进度
    audio.addEventListener('timeupdate', () => {
      const cur = document.getElementById('jboxCur');
      const fill = document.getElementById('jboxFill');
      if (cur) cur.textContent = fmt(audio.currentTime);
      if (fill && audio.duration) fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    });
    audio.addEventListener('loadedmetadata', () => {
      const rowDur = document.getElementById('jboxDur' + _curIdx);
      if (rowDur) rowDur.textContent = fmt(audio.duration);
      document.querySelectorAll('.jbox-track-row').forEach((r, i) => {
        if (i === _curIdx) r.querySelector('.jbox-track-dur').textContent = fmt(audio.duration);
      });
    });
    audio.addEventListener('play',  () => { btn.textContent = '❚❚'; });
    audio.addEventListener('pause', () => { btn.textContent = '▶'; });
    audio.addEventListener('ended', () => {
      if (_curIdx < TRACKS.length - 1) playTrack(_curIdx + 1);
      else { _curIdx = -1; btn.textContent = '▶'; }
    });

    // 进度条点击跳转
    const bar = document.getElementById('jboxBar');
    bar?.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const r = bar.getBoundingClientRect();
      audio.currentTime = (e.clientX - r.left) / r.width * audio.duration;
    });

    // 音量 slider
    const volSlider = document.getElementById('jboxVol');
    if (volSlider) {
      volSlider.value = _vol * 100;
      volSlider.addEventListener('input', (e) => {
        _vol = e.target.value / 100;
        if (_gMaster) _gMaster.gain.value = _vol;
        else audio.volume = _vol;
      });
    }

    // EQ 预设按钮
    document.querySelectorAll('.jbox-eq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.jbox-eq-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        applyEQPreset(btn.dataset.eq);
      });
    });

    // 启动频谱
    setTimeout(drawSpectrum, 500);
  }

  window.__onPage?.('music', () => { setTimeout(initJukebox, 300); });
})();

/* =========================================================================
   首页 id-wall 入场动画（风格统一后补上 is-visible 触发）
   ========================================================================= */
(() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.id-wall').forEach(w => obs.observe(w));
    // explore__card 也顺便补入场（styles.css 里有 opacity:0）
    document.querySelectorAll('.explore__grid').forEach(g => {
      g.querySelectorAll('.explore__card').forEach((c, i) => {
        setTimeout(() => { c.style.opacity = '1'; c.style.transform = 'none'; }, 100 + i * 80);
      });
    });
  });
})();

