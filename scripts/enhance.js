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
        <img src="${ped.img}" alt="${ped.name}" onerror="this.style.display='none'">`;
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

