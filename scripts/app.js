(function SPA_Init() {
  // 防重入（万一某些浏览器 SPA_Init 被触发两次）
  if (window.__spaLoaded) return; window.__spaLoaded = true;

  // 1. 把现有 body children（除了 script）全部 move 到 home page
  //    ⚠️ script 标签绝对不能再 append 回 body——否则前面所有 IIFE 会重执行、事件监听器 double-bind
  const home = document.createElement('div');
  home.className = 'page page--active'; home.dataset.page = 'home';
  Array.from(document.body.childNodes).forEach(n => {
    if (n.nodeType === 1 && n.tagName === 'SCRIPT') return;
    if (n.nodeType === 3 && !n.textContent.trim()) return;
    home.appendChild(n);
  });
  document.body.appendChild(home);
  // scripts 留在原位置，不再动！

  // 2. 注入 Gallery 子页面（公告栏 + 翻页书）
  const gallery = document.createElement('div');
  gallery.className = 'page'; gallery.dataset.page = 'gallery';
  gallery.innerHTML = `
    <!-- Gallery 公告栏（软木板 + 拍立得 + 图钉 + 手写批注） -->
    <div class="gallery-corkboard" aria-label="Gallery 公告栏">
      <!-- 软木板背景 -->
      <div class="gallery-cork" aria-hidden="true"></div>

      <!-- 左侧导航：返回首页 + 其他子页面链接 -->
      <div class="gallery-sidebar">
        <div class="gallery-return" data-return-home="true">
          <span class="return-scissors">✂</span>
          <span class="return-label">返回桌面</span>
        </div>
        <div class="gallery-nav-title">· MUSEUM MAP ·</div>
        <a class="gallery-nav-link" data-page-link="worlds">🏘 Worlds &amp; IP · 商业街</a>
        <a class="gallery-nav-link is-current">📸 Gallery · 公告栏</a>
        <a class="gallery-nav-link" data-page-link="games">🎮 Games · Space Jam Hub</a>
        <a class="gallery-nav-link" data-page-link="studio">🎨 Studio · 工具箱</a>
        <a class="gallery-nav-link" data-page-link="music">🎵 Music · 点唱机</a>
        <a class="gallery-nav-link" data-page-link="archives">📁 Archives · 档案柜</a>
      </div>

      <!-- 公告栏内容：拍立得照片 + 撕纸 + 手写批注 -->
      <div class="gallery-board">

        <!-- 拍立得 1：煤咪露立绘 + 图钉 -->
        <div class="polaroid polaroid--1" style="--r:-6deg; --x:12%; --y:14%;">
          <div class="pin pin--red"></div>
          <div class="polaroid-frame">
            <div class="polaroid-photo">
              <img loading="lazy" src="assets/characters/angel-full.png" alt="煤咪露" onerror="this.style.display='none'; this.parentNode.classList.add('photo-fallback');">
              <span class="photo-fallback-text">♀ 煤咪露</span>
            </div>
            <div class="polaroid-caption">— 煤咪露 · 粉毛锁天使 —</div>
          </div>
          <!-- 手写体批注 -->
          <span class="gallery-handwrite" style="top:-8px; right:-40px; --r:12deg;">初めての立絵 ♡</span>
        </div>

        <!-- 拍立得 2：巡夢姬立绘 -->
        <div class="polaroid polaroid--2" style="--r:5deg; --x:48%; --y:10%;">
          <div class="pin pin--blue"></div>
          <div class="polaroid-frame">
            <div class="polaroid-photo">
              <img loading="lazy" src="assets/characters/purple-full.png" alt="巡夢姬" onerror="this.style.display='none'; this.parentNode.classList.add('photo-fallback');">
              <span class="photo-fallback-text">♀ 巡夢姬</span>
            </div>
            <div class="polaroid-caption">— 巡夢姬 · 紫玫瑰大小姐 —</div>
          </div>
          <span class="gallery-handwrite" style="bottom:-10px; left:-30px; --r:-8deg;">金髪と紫バラ</span>
        </div>

        <!-- 拍立得 3：表情包 + 便签 -->
        <div class="polaroid polaroid--3" style="--r:-3deg; --x:75%; --y:20%;">
          <div class="pin pin--yellow"></div>
          <div class="polaroid-frame">
            <div class="polaroid-photo">
              <img loading="lazy" src="assets/characters/angel-chibi/粉毛锁天使_09_开心.png" alt="开心" onerror="this.style.display='none'; this.parentNode.classList.add('photo-fallback');">
              <span class="photo-fallback-text">♡ 开心</span>
            </div>
            <div class="polaroid-caption">— 今日の気分 —</div>
          </div>
        </div>

        <!-- 拍立得 4：便签纸 + 胶带 -->
        <div class="gallery-paper gallery-paper--torn" style="--r:4deg; --x:18%; --y:50%;">
          <div class="gallery-tape gallery-tape--pink" style="top:-10px; left:20%; --r:-14deg;"></div>
          <div class="gallery-tape gallery-tape--mint" style="bottom:-10px; right:12%; --r:10deg;"></div>
          <div class="gallery-paper-inner">
            <div class="gallery-paper-title" style="font-family:var(--font-pixel); letter-spacing:.15em; border-bottom:2px dashed var(--c-deep-chocolate); padding-bottom:4px; margin-bottom:8px;">✦ WORKSHEET ✦</div>
            <div class="gallery-paper-line">2026.10.17 — 煤咪露</div>
            <div class="gallery-paper-line" style="text-indent:1em;">· 立絵 × 1</div>
            <div class="gallery-paper-line" style="text-indent:1em;">· 表情包 × 10</div>
            <div class="gallery-paper-line" style="text-indent:1em;">· 素材表 × 3</div>
          </div>
        </div>

        <!-- 拍立得 5：撕纸 + 手写体 -->
        <div class="gallery-paper gallery-paper--handwrite" style="--r:-5deg; --x:52%; --y:55%;">
          <span class="gallery-handwrite" style="top:8px; left:10px; font-size:14px;">今日のお気に入り ♡</span>
          <span class="gallery-handwrite" style="bottom:6px; right:12px; --r:-3deg; font-size:11px; opacity:.55;">by HIMEMIRO</span>
        </div>

        <!-- 拍立得 6：迷你拍立得（表情包） -->
        <div class="polaroid polaroid--tiny1" style="--r:8deg; --x:70%; --y:55%;">
          <div class="pin pin--red"></div>
          <div class="polaroid-frame">
            <div class="polaroid-photo">
              <img loading="lazy" src="assets/characters/purple-chibi/紫玫瑰大小姐_05_软笑抱兔.png" alt="抱兔" onerror="this.style.display='none'; this.parentNode.classList.add('photo-fallback');">
              <span class="photo-fallback-text">♡ 抱兔</span>
            </div>
            <div class="polaroid-caption">— for u —</div>
          </div>
        </div>

        <!-- 拍立得 7 -->
        <div class="polaroid polaroid--tiny2" style="--r:-10deg; --x:85%; --y:72%;">
          <div class="pin pin--blue"></div>
          <div class="polaroid-frame">
            <div class="polaroid-photo">
              <img loading="lazy" src="assets/characters/angel-chibi/粉毛锁天使_05_摆烂.png" alt="摆烂" onerror="this.style.display='none'; this.parentNode.classList.add('photo-fallback');">
              <span class="photo-fallback-text">摆烂中</span>
            </div>
            <div class="polaroid-caption">— 怠け者 —</div>
          </div>
        </div>

        <!-- 复古挂历（撕页 · 放大版） -->
        <div class="hm-calendar hm-calendar--lg" data-tear-calendar style="position:absolute; right:64px; top:48px; transform:rotate(3deg);">
          <div class="hm-calendar-month" id="hmCalMonth">OCTOBER 2026</div>
          <div class="hm-calendar-day is-today" id="hmCalDay">17</div>
          <div class="hm-calendar-weekday">· FRIDAY ·</div>
          <div class="hm-calendar-tear"></div>
        </div>

        <!-- 桌面文具店（底部居中，不挡照片） -->
        <button data-toolbar-toggle="true" style="position:absolute; left:50%; bottom:24px; transform:translateX(-50%); z-index:50;
          background:#fff8f0; border:2px solid #c48a4e; border-radius:6px;
          padding:8px 16px; font-weight:700; font-size:12px; letter-spacing:2px;
          cursor:pointer; box-shadow:2px 2px 10px rgba(0,0,0,.15);">
          ✂ 桌面文具店 · 点我打开
        </button>

        <!-- 中央大标题（打字机 + 橘红横线） -->
        <div class="gallery-big-title">
          <h1 class="gallery-title-main">GALLERY</h1>
          <div class="gallery-title-sub">· 插画与视觉 ·</div>
          <div class="gallery-title-line"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(gallery);

  // 3. 注入 Games · Space Jam Hub（替换原 CRT 电脑）
  const games = document.createElement('div');
  games.className = 'page page--games-sj'; games.dataset.page = 'games';
  games.innerHTML = `
    <div class="sj-scene" aria-label="Games · Space Jam Hub">
      <!-- 主品牌顶栏 -->
      <header class="sj-topbar">
        <span class="sj-brand">◆ HIMEMIRO GAMES ◆</span>
        <nav class="sj-topbar-nav">
          <a data-page-link="home">MUSEUM</a>
          <a data-page-link="gallery">GALLERY</a>
          <a data-page-link="worlds">WORLDS</a>
          <a data-page-link="sweets">SWEETS</a>
          <a data-page-link="studio">STUDIO</a>
          <a class="is-current">GAMES</a>
          <a data-page-link="music">MUSIC</a>
          <a data-page-link="archives">ARCHIVES</a>
        </nav>
      </header>

      <!-- 左侧垂直星球导航 -->
      <aside class="sj-planet-nav">
        <button class="sj-planet sj-planet--jam is-current" data-game-view="hub">
          <span class="sj-planet-label">JAM<br>CENTRAL</span>
        </button>
        <button class="sj-planet sj-planet--games" data-game-view="mygames">
          <span class="sj-planet-label">MY<br>GAMES</span>
        </button>
        <button class="sj-planet sj-planet--flash" data-game-view="flash">
          <span class="sj-planet-label">FLASH<br>ARCHIVE</span>
        </button>
        <button class="sj-planet sj-planet--external" data-game-view="external">
          <span class="sj-planet-label">EXTERNAL<br>LINKS</span>
        </button>
      </aside>

      <!-- 主内容区：内部嵌套子页面 -->
      <main class="sj-main">

        <!-- 视图 0: Hub（Space Jam Site Map 风格）-->
        <section class="sj-view sj-view--hub is-active" data-game-view="hub">
          <div class="sj-hero-title">
            <div class="sj-ellipse sj-ellipse--purple">
              <span class="sj-ellipse-text">JAM CENTRAL</span>
            </div>
          </div>
          <p class="sj-body">Welcome to the Games Hub — your portal to the HIMEMIRO arcade. Explore original creations, browse the flash archive, and jump out to external collections.</p>
          <div class="sj-sitemap">
            <!-- Row 1 -->
            <a class="sj-sitemap-card sj-sitemap-card--games" data-game-view="mygames">
              <div class="sj-sitemap-planet sj-planet--games"></div>
              <div class="sj-sitemap-info">
                <div class="sj-sitemap-title">MY GAMES</div>
                <div class="sj-sitemap-desc">Original HIMEMIRO creations + upcoming titles</div>
              </div>
            </a>
            <a class="sj-sitemap-card sj-sitemap-card--flash" data-game-view="flash">
              <div class="sj-sitemap-planet sj-planet--flash"></div>
              <div class="sj-sitemap-info">
                <div class="sj-sitemap-title">FLASH ARCHIVE</div>
                <div class="sj-sitemap-desc">Curated collection of classic 2000s flash games</div>
              </div>
            </a>
            <a class="sj-sitemap-card sj-sitemap-card--external" data-game-view="external">
              <div class="sj-sitemap-planet sj-planet--external"></div>
              <div class="sj-sitemap-info">
                <div class="sj-sitemap-title">EXTERNAL LINKS</div>
                <div class="sj-sitemap-desc">Hand-picked indie game portfolios &amp; archives</div>
              </div>
            </a>
            <!-- Row 2 -->
            <a class="sj-sitemap-card sj-sitemap-card--behind" href="#" onclick="return false;">
              <div class="sj-sitemap-planet sj-planet--behind"></div>
              <div class="sj-sitemap-info">
                <div class="sj-sitemap-title">BEHIND THE SCENES</div>
                <div class="sj-sitemap-desc">→ Coming Soon — development diaries &amp; lore</div>
              </div>
            </a>
            <!-- IP 创作工作台 · 外部跳转（workshop 部署后替换 URL） -->
            <a class="sj-sitemap-card sj-sitemap-card--community sj-sitemap-card--external" href="#" data-ip-workshop target="_blank" rel="noopener">
              <div class="sj-sitemap-planet sj-planet--community"></div>
              <div class="sj-sitemap-info">
                <div class="sj-sitemap-title">IP 创作工作台 <span class="sj-sitemap-card-ext-tag">↗ EXTERNAL</span></div>
                <div class="sj-sitemap-desc">拼贴工坊 · 立绘/表情包/海报无代码创作</div>
              </div>
            </a>
            <a class="sj-sitemap-card sj-sitemap-card--merch" href="#" onclick="return false;">
              <div class="sj-sitemap-planet sj-planet--merch"></div>
              <div class="sj-sitemap-info">
                <div class="sj-sitemap-title">STELLAR SOUVENIRS</div>
                <div class="sj-sitemap-desc">→ Coming Soon — printable stickers &amp; assets</div>
              </div>
            </a>
          </div>
        </section>

        <!-- 视图 1: My Games（Planet B-Ball 风格）-->
        <section class="sj-view sj-view--mygames" data-game-view="mygames">
          <div class="sj-hero-title">
            <div class="sj-ellipse sj-ellipse--green">
              <span class="sj-ellipse-text">MY GAMES</span>
            </div>
          </div>
          <p class="sj-body">Games made or curated by the HIMEMIRO studio. One released, many more in development.</p>
          <div class="sj-game-grid">
            <!-- 占位 1: 你已有的游戏（mmm 文件夹那个）-->
            <a class="sj-game-card" href="#" target="_blank" rel="noopener" data-placeholder="game">
              <div class="sj-game-thumb sj-game-thumb--placeholder">
                <span class="sj-game-placeholder-emoji">🎮</span>
              </div>
              <div class="sj-game-info">
                <div class="sj-game-title">YOUR GAME</div>
                <div class="sj-game-meta">Release · 2026 · [LINK PENDING]</div>
                <div class="sj-game-desc">Your original game — replace this placeholder with the real link &amp; screenshot.</div>
              </div>
              <div class="sj-game-badge sj-badge--green">PLAY</div>
            </a>
            <!-- 占位 2: Coming Soon -->
            <div class="sj-game-card sj-game-card--coming">
              <div class="sj-game-thumb sj-game-thumb--placeholder">
                <span class="sj-game-placeholder-emoji">👻</span>
              </div>
              <div class="sj-game-info">
                <div class="sj-game-title">TITLE TBD</div>
                <div class="sj-game-meta">In Development</div>
                <div class="sj-game-desc">A new HIMEMIRO original — concept &amp; mechanics in progress.</div>
              </div>
              <div class="sj-game-badge sj-badge--yellow">SOON</div>
            </div>
            <!-- 占位 3: Coming Soon -->
            <div class="sj-game-card sj-game-card--coming">
              <div class="sj-game-thumb sj-game-thumb--placeholder">
                <span class="sj-game-placeholder-emoji">✨</span>
              </div>
              <div class="sj-game-info">
                <div class="sj-game-title">TITLE TBD</div>
                <div class="sj-game-meta">In Development</div>
                <div class="sj-game-desc">Another slot reserved for a future release.</div>
              </div>
              <div class="sj-game-badge sj-badge--yellow">SOON</div>
            </div>
          </div>
        </section>

        <!-- 视图 2: Flash Archive（Photos from the Film 风格）-->
        <section class="sj-view sj-view--flash" data-game-view="flash">
          <div class="sj-hero-title">
            <div class="sj-ellipse sj-ellipse--orange">
              <span class="sj-ellipse-text">FLASH ARCHIVE</span>
            </div>
          </div>
          <p class="sj-body">Curated classics from the Web Design Museum. All open in a new tab — click to jump.</p>
          <div class="sj-flash-grid">
            <a class="sj-flash-card" href="https://www.webdesignmuseum.org/flash-games/my-new-room-in-2008" target="_blank" rel="noopener">
              <div class="sj-flash-thumb sj-flash-thumb--placeholder">🛋️</div>
              <div class="sj-flash-title">MY NEW ROOM</div>
              <div class="sj-flash-meta">2008 · Miniclip · Dress-up</div>
              <div class="sj-flash-external">↗ WEBDESIGNMUSEUM.ORG</div>
            </a>
            <a class="sj-flash-card" href="https://www.webdesignmuseum.org/flash-games/goofys-silly-slide-in-2006" target="_blank" rel="noopener">
              <div class="sj-flash-thumb sj-flash-thumb--placeholder">🏄</div>
              <div class="sj-flash-title">GOOFY'S SILLY SLIDE</div>
              <div class="sj-flash-meta">2006 · Disney · Platform</div>
              <div class="sj-flash-external">↗ WEBDESIGNMUSEUM.ORG</div>
            </a>
            <a class="sj-flash-card" href="https://www.webdesignmuseum.org/flash-games/happy-tree-friends-cuddles-pet-smoochie-in-2003" target="_blank" rel="noopener">
              <div class="sj-flash-thumb sj-flash-thumb--placeholder">🌳</div>
              <div class="sj-flash-title">HAPPY TREE FRIENDS</div>
              <div class="sj-flash-meta">2003 · Mondo · Arcade</div>
              <div class="sj-flash-external">↗ WEBDESIGNMUSEUM.ORG</div>
            </a>
            <a class="sj-flash-card" href="https://www.webdesignmuseum.org/flash-game-exhibitions/spongebob-coloring-book-in-2000" target="_blank" rel="noopener">
              <div class="sj-flash-thumb sj-flash-thumb--placeholder">🧽</div>
              <div class="sj-flash-title">SPONGEBOB COLORING</div>
              <div class="sj-flash-meta">2000 · Nickelodeon · Art</div>
              <div class="sj-flash-external">↗ WEBDESIGNMUSEUM.ORG</div>
            </a>
            <a class="sj-flash-card" href="https://www.webdesignmuseum.org/flash-games/doras-matching-game-in-2003" target="_blank" rel="noopener">
              <div class="sj-flash-thumb sj-flash-thumb--placeholder">🗺️</div>
              <div class="sj-flash-title">DORA'S MATCHING</div>
              <div class="sj-flash-meta">2003 · Nickelodeon · Puzzle</div>
              <div class="sj-flash-external">↗ WEBDESIGNMUSEUM.ORG</div>
            </a>
            <a class="sj-flash-card" href="https://www.webdesignmuseum.org/flash-games/sushi-cat-2-in-2011" target="_blank" rel="noopener">
              <div class="sj-flash-thumb sj-flash-thumb--placeholder">🍣</div>
              <div class="sj-flash-title">SUSHI CAT 2</div>
              <div class="sj-flash-meta">2011 · Freeware · Casual</div>
              <div class="sj-flash-external">↗ WEBDESIGNMUSEUM.ORG</div>
            </a>
            <a class="sj-flash-card" href="https://www.webdesignmuseum.org/flash-games/bear-in-the-big-blue-house-cake-bake-in-2001" target="_blank" rel="noopener">
              <div class="sj-flash-thumb sj-flash-thumb--placeholder">🧁</div>
              <div class="sj-flash-title">BEAR'S CAKE BAKE</div>
              <div class="sj-flash-meta">2001 · Jim Henson · Cooking</div>
              <div class="sj-flash-external">↗ WEBDESIGNMUSEUM.ORG</div>
            </a>
            <a class="sj-flash-card" href="https://www.webdesignmuseum.org/flash-games/kindergarten-in-2007" target="_blank" rel="noopener">
              <div class="sj-flash-thumb sj-flash-thumb--placeholder">🎨</div>
              <div class="sj-flash-title">KINDERGARTEN</div>
              <div class="sj-flash-meta">2007 · Freeware · Education</div>
              <div class="sj-flash-external">↗ WEBDESIGNMUSEUM.ORG</div>
            </a>
          </div>
        </section>

        <!-- 视图 3: External Links（Lunar Tunes 风格）-->
        <section class="sj-view sj-view--external" data-game-view="external">
          <div class="sj-hero-title">
            <div class="sj-ellipse sj-ellipse--red">
              <span class="sj-ellipse-text">EXTERNAL LINKS</span>
            </div>
          </div>
          <p class="sj-body">Hand-picked links to sites that inspired HIMEMIRO — indie collections, museum archives, and developer diaries.</p>
          <div class="sj-ext-grid">
            <div class="sj-ext-card">
              <div class="sj-ext-thumb sj-ext-thumb--placeholder">📚</div>
              <div class="sj-ext-title">WEBDESIGNMUSEUM.ORG</div>
              <div class="sj-ext-meta">Web design &amp; flash game archive</div>
              <a class="sj-ext-link" href="https://www.webdesignmuseum.org" target="_blank" rel="noopener">VISIT →</a>
            </div>
            <div class="sj-ext-card">
              <div class="sj-ext-thumb sj-ext-thumb--placeholder">🎪</div>
              <div class="sj-ext-title">[ADD YOUR LINK]</div>
              <div class="sj-ext-meta">Placeholder slot — edit to add more</div>
              <span class="sj-ext-link sj-ext-link--disabled">PENDING</span>
            </div>
            <div class="sj-ext-card">
              <div class="sj-ext-thumb sj-ext-thumb--placeholder">🔗</div>
              <div class="sj-ext-title">[ADD YOUR LINK]</div>
              <div class="sj-ext-meta">Placeholder slot — edit to add more</div>
              <span class="sj-ext-link sj-ext-link--disabled">PENDING</span>
            </div>
            <div class="sj-ext-card">
              <div class="sj-ext-thumb sj-ext-thumb--placeholder">🌟</div>
              <div class="sj-ext-title">[ADD YOUR LINK]</div>
              <div class="sj-ext-meta">Placeholder slot — edit to add more</div>
              <span class="sj-ext-link sj-ext-link--disabled">PENDING</span>
            </div>
          </div>
        </section>
      </main>

      <!-- 底部版权 -->
      <footer class="sj-footer">
        SPACE JAM IN HIMEMIRO — © 2026 HIMEMIRO STUDIO
      </footer>
    </div>
  `;
  document.body.appendChild(games);

  // 4. 注入 Worlds · 商业街
  const worlds = document.createElement('div');
  worlds.className = 'page'; worlds.dataset.page = 'worlds';
  worlds.innerHTML = `
    <div class="street-scene" aria-label="Worlds & IP · 商业街">
      <!-- 左侧导航 -->
      <div class="gallery-sidebar">
        <div class="gallery-return" data-return-home="true">
          <span class="return-scissors">✂</span>
          <span class="return-label">返回桌面</span>
        </div>
        <div class="gallery-nav-title">· MUSEUM MAP ·</div>
        <a class="gallery-nav-link is-current">🏘 Worlds &amp; IP · 商业街</a>
        <a class="gallery-nav-link" data-page-link="gallery">📸 Gallery · 公告栏</a>
        <a class="gallery-nav-link" data-page-link="games">🎮 Games · Space Jam Hub</a>
        <a class="gallery-nav-link" data-page-link="studio">🎨 Studio · 工具箱</a>
        <a class="gallery-nav-link" data-page-link="music">🎵 Music · 点唱机</a>
        <a class="gallery-nav-link" data-page-link="archives">📁 Archives · 档案柜</a>
      </div>

      <!-- 远景天空 + 店铺 -->
      <div class="street-sky"></div>
      <div class="street-ground"></div>

      <div class="street-scroll">
        <!-- 店铺 1：煤咪露喫茶店 -->
        <div class="shop shop--cafe" data-shop="cafe">
          <div class="shop-awning shop-awning--orange"></div>
          <div class="shop-sign" style="--ws:240px; --s:14px;">
            <span class="shop-sign-text" style="writing-mode:vertical-rl;">煤咪露喫茶店</span>
          </div>
          <div class="shop-front">
            <div class="shop-window">
              <img loading="lazy" src="assets/characters/angel-chibi/粉毛锁天使_04_干饭.png" alt="干饭" onerror="this.style.display='none';">
            </div>
            <div class="shop-door" data-shop-open="true">→ OPEN</div>
          </div>
        </div>

        <!-- 店铺 2：巡夢姬古董屋 -->
        <div class="shop shop--antique" data-shop="antique">
          <div class="shop-awning shop-awning--mint"></div>
          <div class="shop-sign" style="--ws:220px; --s:13px;">
            <span class="shop-sign-text" style="writing-mode:vertical-rl;">巡夢姬古董屋</span>
          </div>
          <div class="shop-front">
            <div class="shop-window">
              <img loading="lazy" src="assets/characters/purple-chibi/紫玫瑰大小姐_05_软笑抱兔.png" alt="抱兔" onerror="this.style.display='none';">
            </div>
            <div class="shop-door" data-shop-open="true">→ OPEN</div>
          </div>
        </div>

        <!-- 店铺 3：HIMEMIRO 画材店 -->
        <div class="shop shop--art" data-shop="art">
          <div class="shop-awning shop-awning--cranberry"></div>
          <div class="shop-sign" style="--ws:200px; --s:14px;">
            <span class="shop-sign-text" style="writing-mode:vertical-rl;">画材工房</span>
          </div>
          <div class="shop-front">
            <div class="shop-window">🎨✿♡</div>
            <div class="shop-door" data-shop-open="true">→ OPEN</div>
          </div>
        </div>

        <!-- 店铺 4：深夜唱片行 -->
        <div class="shop shop--record" data-shop="record">
          <div class="shop-awning shop-awning--choco"></div>
          <div class="shop-sign" style="--ws:220px; --s:13px;">
            <span class="shop-sign-text" style="writing-mode:vertical-rl;">深夜唱片行</span>
          </div>
          <div class="shop-front">
            <div class="shop-window">♪♫♪</div>
            <div class="shop-door" data-shop-open="true">→ OPEN</div>
          </div>
        </div>

        <!-- 店铺 5：糖果店 HIMEMIRO スイーツ店 -->
        <div class="shop shop--sweets" data-shop="sweets">
          <div class="shop-awning shop-awning--pink"></div>
          <div class="shop-sign" style="--ws:200px; --s:14px;">
            <span class="shop-sign-text" style="writing-mode:vertical-rl;">HIMEMIRO スイーツ店</span>
          </div>
          <div class="shop-front">
            <div class="shop-window">🍫<br>🍭<br>🎰</div>
            <div class="shop-door" data-shop-open="true">→ OPEN</div>
          </div>
        </div>

        <!-- 店铺 6：Y2K 文具店（占位） -->
        <div class="shop shop--stationery" data-shop="stationery">
          <div class="shop-awning shop-awning--mint2"></div>
          <div class="shop-sign" style="--ws:180px; --s:13px;">
            <span class="shop-sign-text" style="writing-mode:vertical-rl;">Y2K 文房具店</span>
          </div>
          <div class="shop-front">
            <div class="shop-window">✏<br>📎<br>🖊</div>
            <div class="shop-door shop-door--soon">COMING</div>
          </div>
        </div>

        <!-- 店铺 7：扭蛋专门店（占位） -->
        <div class="shop shop--gashapon-store" data-shop="gashapon">
          <div class="shop-awning shop-awning--purple"></div>
          <div class="shop-sign" style="--ws:180px; --s:13px;">
            <span class="shop-sign-text" style="writing-mode:vertical-rl;">ガシャポン専門店</span>
          </div>
          <div class="shop-front">
            <div class="shop-window">🎰<br>🪙<br>🎁</div>
            <div class="shop-door shop-door--soon">COMING</div>
          </div>
        </div>

        <!-- 店铺 8：花店（占位） -->
        <div class="shop shop--florist" data-shop="florist">
          <div class="shop-awning shop-awning--cream2"></div>
          <div class="shop-sign" style="--ws:180px; --s:13px;">
            <span class="shop-sign-text" style="writing-mode:vertical-rl;">蔷薇の花屋</span>
          </div>
          <div class="shop-front">
            <div class="shop-window">🌸<br>🌹<br>💐</div>
            <div class="shop-door shop-door--soon">COMING</div>
          </div>
        </div>
      </div>

      <!-- 左右箭头提示横向滚动 -->
      <div class="street-hint">← 拖动或滚轮横向浏览街道 →</div>
    </div>
  `;
  document.body.appendChild(worlds);

  // 5. 注入 Studio · 工具箱（多层抽屉 + HTML5 拖拽）
  const studio = document.createElement('div');
  studio.className = 'page'; studio.dataset.page = 'studio';
  studio.innerHTML = `
    <div class="studio-scene" aria-label="Creative Studio · 工具箱">
      <div class="gallery-sidebar">
        <div class="gallery-return" data-return-home="true">
          <span class="return-scissors">✂</span><span class="return-label">返回桌面</span>
        </div>
        <div class="gallery-nav-title">· MUSEUM MAP ·</div>
        <a class="gallery-nav-link" data-page-link="worlds">🏘 Worlds · 商业街</a>
        <a class="gallery-nav-link" data-page-link="gallery">📸 Gallery · 公告栏</a>
        <a class="gallery-nav-link" data-page-link="games">📺 Games · CRT</a>
        <a class="gallery-nav-link is-current">🎨 Studio · 工具箱</a>
        <a class="gallery-nav-link" data-page-link="music">🎵 Music · 点唱机</a>
        <a class="gallery-nav-link" data-page-link="archives">📁 Archives · 档案柜</a>
      </div>

      <div class="workbench">
        <!-- 工具箱左列：素材抽屉 -->
        <div class="toolbox">
          <div class="toolbox-handle">✿ HIMEMIRO WORKBENCH</div>
          <!-- 抽屉 1：蕾丝丝带 -->
          <div class="drawer drawer--1" data-drawer="true">
            <div class="drawer-front">
              <div class="drawer-knob"></div>
              <span class="drawer-label">蕾丝 &amp; 丝带</span>
            </div>
            <div class="drawer-inner">
              <div class="material material--lace" draggable="true">🧷 白色蕾丝</div>
              <div class="material material--lace2" draggable="true">🧷 粉蕾丝</div>
              <div class="material material--ribbon" draggable="true">🎀 橘红缎带</div>
              <div class="material material--ribbon2" draggable="true">🎀 蔓越莓缎带</div>
            </div>
          </div>
          <!-- 抽屉 2：贴纸 -->
          <div class="drawer drawer--2" data-drawer="true">
            <div class="drawer-front">
              <div class="drawer-knob"></div>
              <span class="drawer-label">贴纸 &amp; 装饰</span>
            </div>
            <div class="drawer-inner">
              <div class="material material--sticker" draggable="true">✦ 五角星</div>
              <div class="material material--sticker2" draggable="true">♡ 爱心</div>
              <div class="material material--sticker3" draggable="true">✚ 十字架</div>
              <div class="material material--sticker4" draggable="true">✧ 闪光</div>
              <div class="material material--sticker5" draggable="true">❀ 花朵</div>
            </div>
          </div>
          <!-- 抽屉 3：素材表参考 -->
          <div class="drawer drawer--3" data-drawer="true">
            <div class="drawer-front">
              <div class="drawer-knob"></div>
              <span class="drawer-label">角色 &amp; 立绘</span>
            </div>
            <div class="drawer-inner">
              <div class="material material--char" draggable="true" data-char="angel">
                <img loading="lazy" src="assets/characters/angel-chibi/粉毛锁天使_09_开心.png" alt="立绘" onerror="this.style.display='none';">
                <span>煤咪露</span>
              </div>
              <div class="material material--char" draggable="true" data-char="purple">
                <img loading="lazy" src="assets/characters/purple-chibi/紫玫瑰大小姐_05_软笑抱兔.png" alt="立绘" onerror="this.style.display='none';">
                <span>巡夢姬</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 中央画布 -->
        <div class="canvas-drop" id="canvasDrop" data-drop-zone="true">
          <div class="canvas-paper">
            <div class="canvas-title">· CANVAS · 拼贴画布</div>
            <div class="canvas-hint">← 从左侧抽屉拖素材到这里 →</div>
            <div class="canvas-items" id="canvasItems"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(studio);

  // 6. 注入 Music · 点唱机
  const music = document.createElement('div');
  music.className = 'page'; music.dataset.page = 'music';
  music.innerHTML = `
    <div class="jukebox-scene" aria-label="Music · 点唱机">
      <div class="gallery-sidebar">
        <div class="gallery-return" data-return-home="true">
          <span class="return-scissors">✂</span><span class="return-label">返回桌面</span>
        </div>
        <div class="gallery-nav-title">· MUSEUM MAP ·</div>
        <a class="gallery-nav-link" data-page-link="worlds">🏘 Worlds · 商业街</a>
        <a class="gallery-nav-link" data-page-link="gallery">📸 Gallery · 公告栏</a>
        <a class="gallery-nav-link" data-page-link="games">📺 Games · CRT</a>
        <a class="gallery-nav-link" data-page-link="studio">🎨 Studio · 工具箱</a>
        <a class="gallery-nav-link is-current">🎵 Music · 点唱机</a>
        <a class="gallery-nav-link" data-page-link="archives">📁 Archives · 档案柜</a>
      </div>

      <!-- 点唱机 -->
      <div class="jukebox">
        <!-- 顶部：唱片转盘 -->
        <div class="jukebox-top">
          <div class="jukebox-vinyl">
            <div class="vinyl-inner"></div>
            <div class="vinyl-label">HIMEMIRO</div>
            <div class="vinyl-hole"></div>
          </div>
          <div class="jukebox-vinyl-arm"></div>
        </div>
        <!-- 抽屉式磁带仓 -->
        <div class="jukebox-drawers">
          <div class="jukebox-drawer" data-jbox-drawer="0">
            <div class="jbox-knob"></div>
            <div class="jbox-label">磁带 · 001</div>
          </div>
          <div class="jukebox-drawer" data-jbox-drawer="1">
            <div class="jbox-knob"></div>
            <div class="jbox-label">磁带 · 002</div>
          </div>
          <div class="jukebox-drawer" data-jbox-drawer="2">
            <div class="jbox-knob"></div>
            <div class="jbox-label">磁带 · 003</div>
          </div>
          <div class="jukebox-drawer jbox-active" id="jboxDrawerActive">
            <div class="jbox-knob"></div>
            <div class="jbox-label">▶ NOW PLAYING</div>
          </div>
        </div>
        <!-- 磁带详情（真实曲目表 + HTML5 Audio） -->
        <div class="jukebox-tracklist" id="jboxTracklist">
          <!-- 播放器 -->
          <div class="jbox-player">
            <button class="jbox-player-btn" id="jboxPlayBtn" aria-label="播放/暂停">▶</button>
            <div class="jbox-player-info">
              <div class="jbox-player-title" id="jboxTitle">选一首来听 ♡</div>
              <div class="jbox-player-time"><span id="jboxCur">0:00</span> / <span id="jboxDur">0:00</span></div>
              <div class="jbox-player-bar" id="jboxBar"><div class="jbox-player-bar-fill" id="jboxFill"></div></div>
            </div>
            <audio id="jboxAudio" preload="metadata"></audio>
          </div>

          <!-- 频谱 canvas + EQ + 音量 -->
          <div class="jbox-effects">
            <!-- 频谱可视化 -->
            <canvas id="jboxSpectrum" width="300" height="60" class="jbox-spectrum"></canvas>
            <!-- EQ 预设 -->
            <div class="jbox-eq-row">
              <span class="jbox-eq-label">EQ</span>
              <button class="jbox-eq-btn is-active" data-eq="flat">Flat</button>
              <button class="jbox-eq-btn" data-eq="pop">Pop</button>
              <button class="jbox-eq-btn" data-eq="rock">Rock</button>
              <button class="jbox-eq-btn" data-eq="classical">Classical</button>
              <button class="jbox-eq-btn" data-eq="vocal">Vocal</button>
              <button class="jbox-eq-btn" data-eq="night">Night</button>
            </div>
            <!-- 音量 slider -->
            <div class="jbox-vol-row">
              <span class="jbox-vol-icon">🔊</span>
              <input type="range" id="jboxVol" min="0" max="100" value="70" class="jbox-vol-slider" aria-label="音量">
            </div>
          </div>

          <!-- 真实曲目列表 -->
          <div class="jbox-tracklist-real" id="jboxTracks"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(music);

  // 7. 注入 Archives · 档案柜
  const archives = document.createElement('div');
  archives.className = 'page'; archives.dataset.page = 'archives';
  archives.innerHTML = `
    <div class="archives-scene" aria-label="Archives · 档案柜">
      <div class="gallery-sidebar">
        <div class="gallery-return" data-return-home="true">
          <span class="return-scissors">✂</span><span class="return-label">返回桌面</span>
        </div>
        <div class="gallery-nav-title">· MUSEUM MAP ·</div>
        <a class="gallery-nav-link" data-page-link="worlds">🏘 Worlds · 商业街</a>
        <a class="gallery-nav-link" data-page-link="gallery">📸 Gallery · 公告栏</a>
        <a class="gallery-nav-link" data-page-link="games">📺 Games · CRT</a>
        <a class="gallery-nav-link" data-page-link="studio">🎨 Studio · 工具箱</a>
        <a class="gallery-nav-link" data-page-link="music">🎵 Music · 点唱机</a>
        <a class="gallery-nav-link is-current">📁 Archives · 档案柜</a>
      </div>

      <!-- 档案柜 + 索引卡片 -->
      <div class="archive-cabinet">
        <div class="archive-title">· CURATOR'S CARD CATALOG ·</div>
        <div class="archive-sub">2026 策展人の索引卡</div>

        <!-- 抽屉式档案 -->
        <div class="archive-drawer" data-archive-drawer="2026-Q3">
          <div class="archive-drawer-label">2026.Q3 · 煤咪露 / 巡夢姬 立绘 &amp; 表情包</div>
          <div class="archive-drawer-handle"></div>
          <div class="archive-cards">
            <div class="archive-card" data-archive-card="true">
              <div class="ac-num">#001</div>
              <div class="ac-title">粉毛锁天使 · 煤咪露</div>
              <div class="ac-meta">2026.10.17 · A3 · Digital</div>
            </div>
            <div class="archive-card" data-archive-card="true">
              <div class="ac-num">#002</div>
              <div class="ac-title">紫玫瑰大小姐 · 巡夢姬</div>
              <div class="ac-meta">2026.10.17 · A3 · Digital</div>
            </div>
            <div class="archive-card" data-archive-card="true">
              <div class="ac-num">#003</div>
              <div class="ac-title">煤咪露表情包 × 10</div>
              <div class="ac-meta">2026.10.17 · Set</div>
            </div>
            <div class="archive-card" data-archive-card="true">
              <div class="ac-num">#004</div>
              <div class="ac-title">巡夢姬表情包 × 8</div>
              <div class="ac-meta">2026.10.17 · Set</div>
            </div>
          </div>
        </div>

        <div class="archive-drawer" data-archive-drawer="2026-Q2">
          <div class="archive-drawer-label">2026.Q2 · 哥特萝莉素材表 &amp; UI 组件</div>
          <div class="archive-drawer-handle"></div>
          <div class="archive-cards">
            <div class="archive-card" data-archive-card="true">
              <div class="ac-num">#005</div>
              <div class="ac-title">角色素材表 × 3</div>
              <div class="ac-meta">2026.08 · Reference</div>
            </div>
            <div class="archive-card" data-archive-card="true">
              <div class="ac-num">#006</div>
              <div class="ac-title">UI 组件拆解</div>
              <div class="ac-meta">2026.08 · Reference</div>
            </div>
          </div>
        </div>

        <div class="archive-drawer archive-drawer--future" data-archive-drawer="future">
          <div class="archive-drawer-label">???.?? · 未来的项目</div>
          <div class="archive-drawer-handle"></div>
          <div class="archive-cards" style="opacity:.35;">
            <div class="archive-card">
              <div class="ac-num">???</div>
              <div class="ac-title">待创作...</div>
              <div class="ac-meta">—</div>
            </div>
          </div>
        </div>

        <!-- 留言板 Widget -->
        <div id="hbGuestbook" class="hb-guestbook-slot"></div>
      </div>
    </div>
  `;
  document.body.appendChild(archives);

  // 6. 注入 Sweets Shop · 糖果店（纯 CSS 甜品 + 扭蛋 + 愿望罐 + 万花筒）
  const sweets = document.createElement('div');
  sweets.className = 'page page--sweets'; sweets.dataset.page = 'sweets';
  sweets.innerHTML = `
    <div class="sweets-scene" aria-label="Sweets Shop · 糖果店">
      <div class="gallery-sidebar">
        <div class="gallery-return" data-return-home="true">
          <span class="return-scissors">✂</span><span class="return-label">返回桌面</span>
        </div>
        <div class="gallery-nav-title">· MUSEUM MAP ·</div>
        <a class="gallery-nav-link" data-page-link="gallery">📸 Gallery · 公告栏</a>
        <a class="gallery-nav-link" data-page-link="worlds">🏘 Worlds · 商业街</a>
        <a class="gallery-nav-link is-current">🍭 Sweets · 糖果店</a>
        <a class="gallery-nav-link" data-page-link="games">🎮 Games · Space Jam Hub</a>
        <a class="gallery-nav-link" data-page-link="studio">🎨 Studio · 工具箱</a>
        <a class="gallery-nav-link" data-page-link="music">🎵 Music · 点唱机</a>
        <a class="gallery-nav-link" data-page-link="archives">📁 Archives · 档案柜</a>
      </div>

      <div class="hm-sweets-header">
        <div class="hm-sweets-title">🍫 SWEETS SHOP ♡</div>
        <div class="hm-sweets-subtitle">Y2K CANDY STORE · SINCE 2026 · お菓子屋さん</div>
      </div>

      <!-- Sub-view 切换 Tab -->
      <div class="hm-sweets-tabs">
        <button class="hm-sweets-tab is-active" data-sweets-view="shop">🍬 お菓子屋 · Shop</button>
        <button class="hm-sweets-tab" data-sweets-view="icecream">🍦 アイスクリーム屋 · DIY Ice Cream</button>
      </div>

      <!-- === View 1: Shop（糖果店 · 3 柜台） === -->
      <div class="hm-sweets-view is-active" data-sweets-view="shop">
        <!-- 糖果店 3 区柜台布局 -->
        <div class="hm-sweets-counter">
        <!-- 左区：甜品展示柜 -->
        <div class="hm-counter hm-counter--sweets">
          <div class="hm-counter-top"></div>
          <div class="hm-counter-label">🍬 ディスプレイ · DISPLAY</div>
          <div class="hm-counter-body">
            <div class="hm-shelf">
              <div class="hm-choco-bar bitten" style="transform:rotate(-5deg); width:150px; height:75px;"></div>
              <div class="hm-choco-bar" style="transform:rotate(3deg); width:150px; height:75px;"></div>
              <div class="hm-lollipop" style="transform:rotate(-2deg); width:78px; height:78px;">
                <div class="hm-lollipop-stick"></div>
              </div>
            </div>
            <div class="hm-shelf">
              <div class="hm-macaron pink" style="transform:rotate(-4deg); width:90px; height:40px;"><div class="hm-macaron-fill"></div></div>
              <div class="hm-macaron mint" style="transform:rotate(5deg); width:90px; height:40px;"><div class="hm-macaron-fill"></div></div>
              <div class="hm-macaron lavender" style="transform:rotate(-2deg); width:90px; height:40px;"><div class="hm-macaron-fill"></div></div>
            </div>
            <div class="hm-shelf">
              <div class="hm-candy-jar" style="width:100px; height:128px;">
                <div class="hm-candy-jar-lid"></div>
                <div class="hm-candy-jar-body"></div>
              </div>
              <div class="hm-gummy-heart" style="transform:rotate(8deg); width:72px; height:66px;"><div class="gummy-bottom"></div></div>
              <div class="hm-choco-coin" style="transform:rotate(-10deg); width:52px; height:52px;"></div>
              <div class="hm-choco-coin" style="transform:rotate(6deg); width:52px; height:52px;"></div>
            </div>
          </div>
          <!-- 万花筒（角落摆件） -->
          <div class="hm-kaleidoscope hm-kaleidoscope--corner">
            <div class="hm-kaleidoscope-barrel">
              <div class="hm-kaleidoscope-lens" id="hmKaleiLens">
                <div class="hm-kaleidoscope-sector" style="transform: rotate(0deg);">
                  <div><div class="hm-kaleidoscope-inner"><div class="hm-kaleidoscope-colors" id="hmKaleiColors">
                    <span style="background:#ff6b9d"></span><span style="background:#ffd93d"></span><span style="background:#6bcb77"></span><span style="background:#4d96ff"></span>
                    <span style="background:#d4c1ec"></span><span style="background:#f7d774"></span><span style="background:#ff9ec4"></span><span style="background:#b8e0d2"></span>
                    <span style="background:#ff6b9d"></span><span style="background:#ffd93d"></span><span style="background:#6bcb77"></span><span style="background:#4d96ff"></span>
                    <span style="background:#d4c1ec"></span><span style="background:#f7d774"></span><span style="background:#ff9ec4"></span><span style="background:#b8e0d2"></span>
                  </div></div></div>
                </div>
                <div class="hm-kaleidoscope-sector" style="transform: rotate(60deg) scaleX(-1);">
                  <div><div class="hm-kaleidoscope-inner"><div class="hm-kaleidoscope-colors">
                    <span style="background:#6bcb77"></span><span style="background:#ff6b9d"></span><span style="background:#d4c1ec"></span><span style="background:#ffd93d"></span>
                    <span style="background:#4d96ff"></span><span style="background:#ff9ec4"></span><span style="background:#b8e0d2"></span><span style="background:#f7d774"></span>
                    <span style="background:#6bcb77"></span><span style="background:#ff6b9d"></span><span style="background:#d4c1ec"></span><span style="background:#ffd93d"></span>
                    <span style="background:#4d96ff"></span><span style="background:#ff9ec4"></span><span style="background:#b8e0d2"></span><span style="background:#f7d774"></span>
                  </div></div></div>
                </div>
                <div class="hm-kaleidoscope-sector" style="transform: rotate(120deg);">
                  <div><div class="hm-kaleidoscope-inner"><div class="hm-kaleidoscope-colors">
                    <span style="background:#ffd93d"></span><span style="background:#d4c1ec"></span><span style="background:#ff6b9d"></span><span style="background:#6bcb77"></span>
                    <span style="background:#ff9ec4"></span><span style="background:#4d96ff"></span><span style="background:#f7d774"></span><span style="background:#b8e0d2"></span>
                    <span style="background:#ffd93d"></span><span style="background:#d4c1ec"></span><span style="background:#ff6b9d"></span><span style="background:#6bcb77"></span>
                    <span style="background:#ff9ec4"></span><span style="background:#4d96ff"></span><span style="background:#f7d774"></span><span style="background:#b8e0d2"></span>
                  </div></div></div>
                </div>
                <div class="hm-kaleidoscope-sector" style="transform: rotate(180deg) scaleX(-1);">
                  <div><div class="hm-kaleidoscope-inner"><div class="hm-kaleidoscope-colors">
                    <span style="background:#4d96ff"></span><span style="background:#b8e0d2"></span><span style="background:#ffd93d"></span><span style="background:#f7d774"></span>
                    <span style="background:#ff6b9d"></span><span style="background:#ff9ec4"></span><span style="background:#d4c1ec"></span><span style="background:#6bcb77"></span>
                    <span style="background:#4d96ff"></span><span style="background:#b8e0d2"></span><span style="background:#ffd93d"></span><span style="background:#f7d774"></span>
                    <span style="background:#ff6b9d"></span><span style="background:#ff9ec4"></span><span style="background:#d4c1ec"></span><span style="background:#6bcb77"></span>
                  </div></div></div>
                </div>
                <div class="hm-kaleidoscope-sector" style="transform: rotate(240deg);">
                  <div><div class="hm-kaleidoscope-inner"><div class="hm-kaleidoscope-colors">
                    <span style="background:#d4c1ec"></span><span style="background:#6bcb77"></span><span style="background:#4d96ff"></span><span style="background:#b8e0d2"></span>
                    <span style="background:#f7d774"></span><span style="background:#ff6b9d"></span><span style="background:#ff9ec4"></span><span style="background:#ffd93d"></span>
                    <span style="background:#d4c1ec"></span><span style="background:#6bcb77"></span><span style="background:#4d96ff"></span><span style="background:#b8e0d2"></span>
                    <span style="background:#f7d774"></span><span style="background:#ff6b9d"></span><span style="background:#ff9ec4"></span><span style="background:#ffd93d"></span>
                  </div></div></div>
                </div>
                <div class="hm-kaleidoscope-sector" style="transform: rotate(300deg) scaleX(-1);">
                  <div><div class="hm-kaleidoscope-inner"><div class="hm-kaleidoscope-colors">
                    <span style="background:#b8e0d2"></span><span style="background:#4d96ff"></span><span style="background:#f7d774"></span><span style="background:#d4c1ec"></span>
                    <span style="background:#6bcb77"></span><span style="background:#ffd93d"></span><span style="background:#ff6b9d"></span><span style="background:#ff9ec4"></span>
                    <span style="background:#b8e0d2"></span><span style="background:#4d96ff"></span><span style="background:#f7d774"></span><span style="background:#d4c1ec"></span>
                    <span style="background:#6bcb77"></span><span style="background:#ffd93d"></span><span style="background:#ff6b9d"></span><span style="background:#ff9ec4"></span>
                  </div></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 中区：扭蛋机 -->
        <div class="hm-counter hm-counter--gashapon">
          <div class="hm-counter-top"></div>
          <div class="hm-counter-label">🎰 ガシャポン · GASHAPON</div>
          <div class="hm-counter-body hm-counter-body--center">
            <div class="hm-gashapon hm-gashapon--lg" id="hmGashapon">
              <div class="hm-gashapon-label">GASHAPON · 100円</div>
              <div class="hm-gashapon-top">
                <div class="hm-gashapon-window"><div class="hm-gashapon-eggs"></div></div>
              </div>
              <div class="hm-gashapon-base">
                <div class="hm-gashapon-knob" id="hmGashaponKnob" title="点击扭蛋！"></div>
                <div class="hm-gashapon-chute"></div>
              </div>
              <div class="hm-gashapon-egg-drop"></div>
              <div class="hm-gashapon-egg-burst"></div>
            </div>
            <!-- 价格便签 -->
            <div class="hm-price-tag hm-price-tag--pink">100円 1回</div>
          </div>
        </div>

        <!-- 右区：愿望投币罐 -->
        <div class="hm-counter hm-counter--wish">
          <div class="hm-counter-top"></div>
          <div class="hm-counter-label">💰 願い事 · WISH JAR</div>
          <div class="hm-counter-body hm-counter-body--center">
            <div class="hm-wish-jar hm-wish-jar--lg" id="hmWishJar">
              <div class="hm-wish-jar-input">
                <input type="text" id="hmWishInput" maxlength="24" placeholder="输入愿望..." />
                <button id="hmWishBtn">投币许愿 ♡</button>
              </div>
              <div class="hm-wish-jar-lid"></div>
              <div class="hm-wish-jar-body">
                <div class="hm-wish-jar-coins" id="hmWishCoins"></div>
              </div>
              <div class="hm-wish-note" id="hmWishNote">
                <div style="font-size:10px; color:#8a6e1a; letter-spacing:2px;">WISH · 願い事</div>
                <div style="font-size:14px; margin:8px 0; color:#4a2c1a;" id="hmWishText">— — —</div>
                <div class="hm-wish-note-stamp">魔法封印</div>
              </div>
            </div>
            <!-- 金币计数便签 -->
            <div class="hm-price-tag hm-price-tag--gold">🪙 今日の金币: <span id="hmWishCounter">0</span></div>
          </div>
        </div>
      </div>

      <!-- 柜台底部散点装饰 + 手写便签 -->
      <div class="hm-sweets-footer-decor">
        <div class="hm-choco-coin" style="transform:rotate(-15deg);"></div>
        <div class="hm-choco-coin" style="transform:rotate(8deg);"></div>
        <div class="hm-choco-coin" style="transform:rotate(-3deg);"></div>
        <div class="hm-choco-coin" style="transform:rotate(12deg);"></div>
        <div class="hm-choco-coin" style="transform:rotate(-7deg);"></div>
        <div class="hm-hand-note hm-hand-note--menu">
          <div class="hm-hand-note-title">★ 本日のメニュー ★</div>
          <div class="hm-hand-note-item">🍫 黑巧克力 ¥88</div>
          <div class="hm-hand-note-item">🌸 马卡龙 ¥120</div>
          <div class="hm-hand-note-item">🍭 棒棒糖 ¥50</div>
          <div class="hm-hand-note-item">🍬 糖果罐 ¥180</div>
          <div class="hm-hand-note-item">🎰 扭蛋 ¥100</div>
        </div>
        <div class="hm-hand-note hm-hand-note--special">
          ✦ 今日限定 ♡<br>
          愿望投币罐开放中<br>
          金箔巧克力 先着10名様
        </div>
      </div>
      </div><!-- / View 1 shop -->

      <!-- === View 2: DIY Ice Cream 安静书 === -->
      <div class="hm-sweets-view" data-sweets-view="icecream">
        <div class="hm-icecream-scene">
          <!-- 左：冰箱/素材库 -->
          <div class="hm-ic-inventory">
            <div class="hm-ic-fridge">
              <div class="hm-ic-fridge-door" id="hmIcFridgeDoor">
                <div class="hm-ic-fridge-handle"></div>
                <span class="hm-ic-fridge-label">REFRIGERATOR</span>
              </div>
              <div class="hm-ic-fridge-inside" id="hmIcFridgeInside">
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
              </div>
            </div>
          </div>

          <!-- 中：操作台 -->
          <div class="hm-ic-canvas" id="hmIcCanvas">
            <div class="hm-ic-canvas-label">操作台 · DIY Desk</div>
            <!-- Zone 1: 甜筒 -->
            <div class="hm-ic-zone hm-ic-zone--cone" data-ic-zone="cone">
              <div class="hm-ic-cone"></div>
              <div class="hm-ic-zone-label">コーン</div>
              <div class="hm-ic-zone-items"></div>
            </div>
            <!-- Zone 2: 纸杯 -->
            <div class="hm-ic-zone hm-ic-zone--cup" data-ic-zone="cup">
              <div class="hm-ic-cup"></div>
              <div class="hm-ic-zone-label">カップ</div>
              <div class="hm-ic-zone-items"></div>
            </div>
            <!-- Zone 3: 空盘子 -->
            <div class="hm-ic-zone hm-ic-zone--plate" data-ic-zone="plate">
              <div class="hm-ic-plate"></div>
              <div class="hm-ic-zone-label">プレート</div>
              <div class="hm-ic-zone-items"></div>
            </div>
          </div>

          <!-- 右：操作面板 -->
          <div class="hm-ic-actions">
            <div class="hm-ic-action-btn hm-ic-action--eat" id="hmIcEatBtn">🍴 开吃</div>
            <div class="hm-ic-action-btn hm-ic-action--photo" id="hmIcPhotoBtn">📷 拍照</div>
            <div class="hm-ic-action-btn hm-ic-action--reset" id="hmIcResetBtn">♻ 重做</div>
            <div class="hm-ic-hint">
              拖拽冰淇淋球和配料 →<br>
              靠近甜筒/纸杯/盘子自动吸附<br>
              想吃几个叠几个 ♡
            </div>
          </div>

          <!-- 拖拽中的 item 渲染层 -->
          <div class="hm-ic-drag-layer" id="hmIcDragLayer"></div>
        </div>
      </div>

      <!-- 浮动气泡装饰 -->
      <div class="hm-bubble hm-bubble--1"></div>
      <div class="hm-bubble hm-bubble--2"></div>
      <div class="hm-bubble hm-bubble--3"></div>
      <div class="hm-bubble hm-bubble--4"></div>
      <div class="hm-bubble hm-bubble--5"></div>
    </div>
  `;
  document.body.appendChild(sweets);

  // 3. SPA 切换逻辑
  const allPages = document.querySelectorAll('.page');
  function switchTo(pageName) {
    const current = document.querySelector('.page--active');
    const target = document.querySelector(`.page[data-page="${pageName}"]`);
    if (!target || current === target) return;

    // 首页的话，同时把 sticky-note/washi-tape 那些 home-only 元素隐藏
    allPages.forEach(p => p.classList.remove('page--active'));
    target.classList.add('page--active');

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  // 绑定 header nav 的 anchor → SPA 切换
  document.querySelectorAll('.header__nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = href.slice(1);
        if (['entrance','widgets','exhibit','explore','colophon'].includes(targetId)) {
          switchTo('home');
          setTimeout(() => document.getElementById(targetId)?.scrollIntoView({behavior:'smooth'}), 50);
        } else if (['worlds','gallery','games','studio','music','archives'].includes(targetId)) {
          switchTo(targetId);
        }
      });
    }
  });

  // 绑定 explore__card 点击 → 切换到对应子页面（如果存在）
  document.querySelectorAll('.explore__card[data-page-link], .explore__card').forEach(card => {
    const page = card.dataset.pageLink || card.id;
    if (page && page !== 'archives' && document.querySelector(`.page[data-page="${page}"]`)) {
      card.addEventListener('click', (e) => {
        // 阻止原来的 scale(10) 放大（现在用 SPA 切换）
        e.stopPropagation();
        window.playClickSound?.();
        switchTo(page);
      }, { once: true });  // 覆盖之前的 is-opening 绑定
    }
  });

  // World 地图也绑定 data-page-link 自动切 SPA
document.querySelectorAll('[data-page-link]').forEach(el => {
  if (!el.dataset.pageLinkBound) {
    el.dataset.pageLinkBound = '1';
    el.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      window.playClickSound?.();
      switchTo(el.dataset.pageLink);
    });
  }

  // 暴露给 enhance.js 的 hook — SPA 切换统一入口
  window.__spaInit = { switchTo };
});
})();

/* =========================================================================
   Studio · 抽屉展开 + HTML5 拖拽到画布
   ========================================================================= */
(function Studio_Init() {
  // 抽屉展开
  document.addEventListener('click', (e) => {
    const front = e.target.closest('.drawer-front');
    if (front) {
      window.playClickSound?.();
      front.closest('.drawer').classList.toggle('is-open');
    }
  });

  // HTML5 拖拽：素材 → 画布
  let draggedData = null;
  document.addEventListener('dragstart', (e) => {
    const m = e.target.closest('.material');
    if (!m) return;
    draggedData = {
      type: m.className.match(/material--(\w+)/)?.[1] || 'generic',
      text: m.textContent.trim(),
      char: m.dataset.char || null,
      html: m.outerHTML,
    };
    e.dataTransfer.effectAllowed = 'copy';
    // 同时让画布上已有的 item 也可以被拖（再次 dragstart）
  });
  document.addEventListener('dragend', () => { draggedData = null; });

  const dropZone = document.getElementById('canvasDrop');
  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('is-drop-over');
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('is-drop-over');
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('is-drop-over');
      if (!draggedData) return;
      window.playClickSound?.();

      const rect = dropZone.getBoundingClientRect();
      const x = e.clientX - rect.left - 40;
      const y = e.clientY - rect.top - 20;

      const item = document.createElement('div');
      item.className = `canvas-item canvas-item--${draggedData.type}`;
      item.style.left = `${Math.max(0, Math.min(x, rect.width - 80))}px`;
      item.style.top  = `${Math.max(0, Math.min(y, 360))}px`;
      item.style.transform = `rotate(${(Math.random() * 10 - 5).toFixed(1)}deg)`;

      if (draggedData.char === 'angel') {
        item.innerHTML = `<img loading="lazy" src="assets/characters/angel-chibi/粉毛锁天使_09_开心.png" alt="">`;
      } else if (draggedData.char === 'purple') {
        item.innerHTML = `<img loading="lazy" src="assets/characters/purple-chibi/紫玫瑰大小姐_05_软笑抱兔.png" alt="">`;
      } else if (draggedData.type === 'sticker') {
        const icon = {'sticker':'✦','sticker2':'♡','sticker3':'✚','sticker4':'✧','sticker5':'❀'}[draggedData.type] || '✦';
        item.textContent = icon;
      } else if (draggedData.type === 'lace' || draggedData.type === 'lace2') {
        item.textContent = draggedData.type === 'lace2' ? '🧷 粉蕾丝' : '🧷 白蕾丝';
      } else if (draggedData.type === 'ribbon' || draggedData.type === 'ribbon2') {
        item.textContent = draggedData.type === 'ribbon2' ? '🎀 蔓越莓缎带' : '🎀 橘红缎带';
      } else {
        item.textContent = draggedData.text.slice(0, 14);
      }

      const items = document.getElementById('canvasItems');
      if (items) items.appendChild(item);

      // 让画布上的 item 可以点击删除（双击清除）
      item.addEventListener('dblclick', () => { item.remove(); });
    });
  }
})();

/* =========================================================================
   Archives · 抽屉展开
   ========================================================================= */
(function Archives_Init() {
  document.addEventListener('click', (e) => {
    const label = e.target.closest('.archive-drawer-label');
    if (label) {
      window.playClickSound?.();
      label.parentElement.classList.toggle('is-open');
    }
  });
})();

/* =========================================================================
   CRT 频道切换逻辑
   ========================================================================= */
(function CRT_Init() {
  let channel = 0;
  const channels = document.querySelectorAll('.crt-channel');
  const staticEl = document.getElementById('crtStatic');
  const chNumEl = document.getElementById('crtChNum');

  function showChannel(n) {
    channels.forEach(c => c.classList.remove('is-channel'));
    if (channels[n]) channels[n].classList.add('is-channel');
    chNumEl.textContent = `CH ${String(n + 1).padStart(2, '0')}`;
  }

  function next() {
    staticEl.classList.add('is-on');
    channel = (channel + 1) % channels.length;
    setTimeout(() => {
      staticEl.classList.remove('is-on');
      showChannel(channel);
    }, 300);
  }
  function prev() {
    staticEl.classList.add('is-on');
    channel = (channel - 1 + channels.length) % channels.length;
    setTimeout(() => {
      staticEl.classList.remove('is-on');
      showChannel(channel);
    }, 300);
  }

  // 绑定旋钮（事件委托，因为 page 是动态构建的）
  document.addEventListener('click', (e) => {
    const knob = e.target.closest('.crt-knob');
    if (!knob) return;
    window.playClickSound?.();
    if (knob.dataset.channelNext !== undefined) next();
    if (knob.dataset.channelPrev !== undefined) prev();
  });

  // 键盘支持（左右键换频道）
  document.addEventListener('keydown', (e) => {
    const gamesPage = document.querySelector('.page[data-page="games"]');
    if (!gamesPage || !gamesPage.classList.contains('page--active')) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // 电源键
  const power = document.getElementById('crtPower');
  if (power) {
    power.addEventListener('click', () => {
      window.playClickSound?.();
      const screen = document.querySelector('.crt-screen');
      if (screen) {
        screen.style.filter = 'brightness(.1)';
        setTimeout(() => { screen.style.filter = ''; }, 180);
        setTimeout(() => { screen.style.filter = 'brightness(.08)'; }, 220);
        setTimeout(() => { screen.style.filter = 'brightness(1.2) blur(.3px)'; }, 300);
        setTimeout(() => { screen.style.filter = ''; }, 380);
      }
    });
  }
})();

/* =========================================================================
   Worlds 街道：鼠标滚轮 → 横向滚动
   ========================================================================= */
(function Street_Init() {
  document.addEventListener('wheel', (e) => {
    const scroll = document.querySelector('.page.page--active .street-scroll');
    if (!scroll) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scroll.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });
})();

/* =========================================================================
   Gallery · 拍立得拖拽重排（鼠标 + 触摸）
   ========================================================================= */
(function GalleryDrag_Init() {
  let dragging = null, offsetX = 0, offsetY = 0, startRot = 0;

  function onDown(e) {
    const p = e.target.closest('.polaroid');
    if (!p) return;
    e.preventDefault();
    dragging = p;
    window.playClickSound?.();
    const rect = p.getBoundingClientRect();
    offsetX = (e.clientX || e.touches[0].clientX) - rect.left;
    offsetY = (e.clientY || e.touches[0].clientY) - rect.top;
    startRot = parseFloat(getComputedStyle(p).getPropertyValue('--r')) || 0;
    p.classList.add('is-dragging');
    p.setPointerCapture?.(e.pointerId);
  }
  function onMove(e) {
    if (!dragging) return;
    const cx = e.clientX || e.touches?.[0]?.clientX;
    const cy = e.clientY || e.touches?.[0]?.clientY;
    if (cx == null) return;
    const board = dragging.closest('.gallery-board').getBoundingClientRect();
    const x = ((cx - board.left - offsetX) / board.width) * 100;
    const y = ((cy - board.top - offsetY) / board.height) * 100;
    dragging.style.left = `${Math.max(2, Math.min(94, x)).toFixed(1)}%`;
    dragging.style.top  = `${Math.max(4, Math.min(88, y)).toFixed(1)}%`;
    dragging.style.setProperty('--r', `${startRot + (Math.random() * 2 - 1).toFixed(1)}deg`);
  }
  function onUp() {
    if (!dragging) return;
    dragging.classList.remove('is-dragging');
    dragging = null;
    window.__galleryJustDragged = Date.now(); // 标记，防止紧接着的 click 触发 Zoom Modal
  }

  // 事件委托（Gallery 是 SPA 动态 append 的）
  document.addEventListener('pointerdown', (e) => {
    if (document.querySelector('.page--active[data-page="gallery"]')) onDown(e);
  });
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
  document.addEventListener('pointercancel', onUp);
})();

/* =========================================================================
   Worlds · 店铺木门推开 + 弹出面板
   ========================================================================= */
(function WorldsDoor_Init() {
  const SHOP_DATA = {
    cafe: { title: '煤咪露喫茶店', sub: 'Charcoal Café · since 2026',
      body: '主打炭烧乌龙奶盖 + 粉毛小蛋糕。煤咪露本人亲自端盘子（偶尔打翻），店内播放 90s city pop。靠窗的位置能看到整条商业街。' },
    antique: { title: '巡夢姬古董屋', sub: 'Purple Rose Antiques · since 2001',
      body: '欧洲进口瓷器、真丝手帕、旧书和 6 套绝版手办。巡夢姬会用银勺给你泡伯爵茶，聊 3 小时维多利亚时代的花边新闻。' },
    art: { title: '画材工房', sub: 'HIMEMIRO Art Supply',
      body: '进口水彩、手账贴纸、和纸胶带、马克笔……如果你在 Studio 里拼贴缺素材，这里补满。角落有免费画台，随便画。' },
    record: { title: '深夜唱片行', sub: 'Midnight Wax · open 22:00–04:00',
      body: '只收现金，不挂招牌，推门要敲三下。店主一个人守着 3000 张黑胶，什么都能聊，就是不卖 CD。点唱机免费，随你播。' },
    future: { title: '???', sub: 'COMING SOON',
      body: '还在装修……可能是糖果店？可能是猫咖？煤咪露说要保密，巡夢姬说她早就知道了但不说。' },
    sweets: { title: 'HIMEMIRO スイーツ店', sub: 'Y2K Candy Shop · since 2026',
      body: `
        <p style="margin:0 0 14px 0;">整条街最甜的角落。黑巧克力排配咬痕、粉色马卡龙、彩虹棒棒糖、玻璃糖果罐、Y2K 塑料扭蛋机和复古愿望投币罐。</p>
        <div style="display:flex; gap:10px; align-items:center; margin:10px 0; flex-wrap:wrap;">
          <div class="hm-choco-bar bitten" style="width:80px; height:40px; transform:rotate(-5deg);"></div>
          <div class="hm-macaron pink" style="width:44px; height:20px; transform:rotate(3deg);"><div class="hm-macaron-fill"></div></div>
          <div class="hm-lollipop" style="width:38px; height:38px; transform:rotate(-3deg);"><div class="hm-lollipop-stick"></div></div>
          <div class="hm-gummy-heart" style="width:42px; height:40px; transform:rotate(6deg);"><div class="gummy-bottom"></div></div>
          <div class="hm-choco-coin" style="width:28px; height:28px; transform:rotate(-8deg);"></div>
        </div>
        <div style="display:flex; gap:12px; margin-top:10px;">
          <div style="background:#fff3d6; padding:8px 12px; border-radius:4px; font-family:cursive; font-size:12px; transform:rotate(-3deg); box-shadow:2px 2px 6px rgba(0,0,0,.1);">
            🍫 黑巧克力 ¥88<br>🌸 马卡龙 ¥120<br>🍭 棒棒糖 ¥50
          </div>
          <div style="background:#fde2e4; padding:8px 12px; border-radius:4px; font-family:cursive; font-size:11px; transform:rotate(4deg); box-shadow:2px 2px 6px rgba(0,0,0,.1);">
            🎰 扭蛋 ¥100<br>💰 愿望罐 投币自由
          </div>
        </div>
        <p style="margin:14px 0 0 0; font-size:12px; color:#c48a4e; font-weight:700;">→ 点顶栏 SWEETS 进入全屏糖果店 ♡</p>
      ` },
    stationery: { title: 'Y2K 文房具店', sub: 'Coming Soon · 2026 Winter',
      body: `<p>整条街最安静的角落，卖 90s-00s 的复古文具。彩色水笔、金属直尺、贴纸簿、修正带、半透明便签。</p>
             <p style="color:#d6336c; font-weight:700;">✦ 开发中 · 即将登场 ✦</p>
             <p style="font-size:11px; color:#888;">未来计划：彩笔涂鸦功能 + 贴纸簿克隆</p>` },
    gashapon: { title: 'ガシャポン専門店', sub: 'Coming Soon · 2026 Winter',
      body: `<p>整条街最吵的角落（扭蛋机马达声 24h）。100円 1回，每天限定 5 签运势卡。</p>
             <p style="color:#d6336c; font-weight:700;">✦ 糖果店已经有扭蛋机了，这里会有更大的 ✦</p>
             <p style="font-size:11px; color:#888;">未来计划：多台扭蛋机排列 + 运势卡收集册</p>` },
    florist: { title: '蔷薇の花屋', sub: 'Coming Soon · 2027 Spring',
      body: `<p>巡夢姬最喜欢的角落。门口永远摆着新鲜的玫瑰、马卡龙色满天星、薰衣草花束。</p>
             <p style="color:#d6336c; font-weight:700;">✦ 还在策划中 ✦</p>
             <p style="font-size:11px; color:#888;">未来计划：SVG 花朵贴纸 + 花束组合玩法</p>` }
  };

  function closeAllPanels() {
    document.querySelectorAll('.shop-panel.is-open').forEach(p => p.classList.remove('is-open'));
    document.querySelectorAll('.shop-door.is-open').forEach(d => d.classList.remove('is-open'));
    document.querySelectorAll('.shop-window.is-reveal').forEach(w => w.classList.remove('is-reveal'));
  }

  // 事件委托（点整个 shop div 都能弹 modal，包括 COMING SOON 店铺）
  document.addEventListener('click', (e) => {
    const shopEl = e.target.closest('.shop');
    // 排除 panel 内部的点击
    if (e.target.closest('.shop-panel')) {
      // 点 panel 内的 ✕ → 关闭
      if (e.target.closest('.shop-panel-closes')) {
        closeAllPanels();
        return;
      }
      return;
    }
    if (shopEl) {
      const key = shopEl.dataset.shop;
      if (!key || !SHOP_DATA[key]) return;
      window.playClickSound?.();
      closeAllPanels();

      // door 高亮（如果有）
      const door = shopEl.querySelector('.shop-door');
      if (door && !door.classList.contains('shop-door--soon')) door.classList.add('is-open');
      const win = shopEl.querySelector('.shop-window');
      if (win) win.classList.add('is-reveal');

      shopEl.style.position = 'relative';

      let panel = shopEl.querySelector('.shop-panel');
      if (!panel) {
        const d = SHOP_DATA[key];
        panel = document.createElement('div');
        panel.className = 'shop-panel';
        panel.innerHTML = `
          <button class="shop-panel-closes" aria-label="关闭">✕</button>
          <div class="shop-panel-title">${d.title}</div>
          <div class="shop-panel-sub">${d.sub}</div>
          <div class="shop-panel-body">${d.body}</div>
        `;
        shop.appendChild(panel);
      }
      requestAnimationFrame(() => panel.classList.add('is-open'));
      return;
    }

    // 点 panel 内的 ✕ 或点外部 → 关闭
    if (e.target.closest('.shop-panel-closes')) {
      closeAllPanels();
      return;
    }
    if (!e.target.closest('.shop-panel') && !e.target.closest('.shop')) {
      closeAllPanels();
    }
  });
})();

/* =========================================================================
   Studio · 画布 canvas-item 自由拖拽 + 双击旋转
   ========================================================================= */
(function StudioCanvasEnhance_Init() {
  let itemDrag = null, itemOffX = 0, itemOffY = 0;

  function onDown(e) {
    const item = e.target.closest('.canvas-item');
    if (!item) return;
    e.preventDefault();
    itemDrag = item;
    item.classList.add('is-dragging');
    const rect = item.getBoundingClientRect();
    itemOffX = (e.clientX || e.touches[0].clientX) - rect.left;
    itemOffY = (e.clientY || e.touches[0].clientY) - rect.top;
    item.setPointerCapture?.(e.pointerId);
  }
  function onMove(e) {
    if (!itemDrag) return;
    const cx = e.clientX || e.touches?.[0]?.clientX;
    const cy = e.clientY || e.touches?.[0]?.clientY;
    if (cx == null) return;
    const canvas = document.getElementById('canvasDrop').getBoundingClientRect();
    itemDrag.style.left = `${Math.max(0, Math.min(cx - canvas.left - itemOffX, canvas.width - 80))}px`;
    itemDrag.style.top  = `${Math.max(0, Math.min(cy - canvas.top - itemOffY, canvas.height - 40))}px`;
  }
  function onUp() {
    if (!itemDrag) return;
    itemDrag.classList.remove('is-dragging');
    itemDrag = null;
  }

  document.addEventListener('pointerdown', (e) => {
    if (document.querySelector('.page--active[data-page="studio"]')) onDown(e);
  });
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);

  // 双击旋转 canvas-item
  document.addEventListener('dblclick', (e) => {
    const item = e.target.closest('.canvas-item');
    if (!item) return;
    window.playClickSound?.();
    const cur = parseFloat(item.dataset.rot || '0');
    const next = cur + 15;
    item.style.transform = `rotate(${next}deg)`;
    item.dataset.rot = next;
  });
})();

/* =========================================================================
   Archives · 索引卡片点击放大预览 Modal
   ========================================================================= */
(function ArchivesCardZoom_Init() {
  let modal = null, modalCard = null, modalClose = null;

  function ensureModal() {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'archive-modal';
    modal.innerHTML = `
      <button class="archive-modal-closes" aria-label="关闭">✕</button>
      <div class="archive-modal-card"></div>
    `;
    document.body.appendChild(modal);
    modalCard = modal.querySelector('.archive-modal-card');
    modalClose = modal.querySelector('.archive-modal-closes');
    modalClose.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }
  function open(card) {
    ensureModal();
    // 深拷贝卡片到 modal 里
    modalCard.innerHTML = '';
    const clone = card.cloneNode(true);
    clone.style.transform = 'scale(2.2) rotate(-2deg)';
    clone.style.margin = '80px auto';
    modalCard.appendChild(clone);
    modal.classList.add('is-open');
    window.playClickSound?.();
  }
  function close() {
    modal?.classList.remove('is-open');
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.archive-card[data-archive-card]');
    if (card) { open(card); return; }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
