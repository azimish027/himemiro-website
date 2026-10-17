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
        <a class="gallery-nav-link" data-page-link="games">📺 Games · CRT 电脑</a>
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
              <img src="assets/characters/angel-full.png" alt="煤咪露" onerror="this.style.display='none'; this.parentNode.classList.add('photo-fallback');">
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
              <img src="assets/characters/purple-full.png" alt="巡夢姬" onerror="this.style.display='none'; this.parentNode.classList.add('photo-fallback');">
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
              <img src="assets/characters/angel-chibi/粉毛锁天使_09_开心.png" alt="开心" onerror="this.style.display='none'; this.parentNode.classList.add('photo-fallback');">
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
              <img src="assets/characters/purple-chibi/紫玫瑰大小姐_05_软笑抱兔.png" alt="抱兔" onerror="this.style.display='none'; this.parentNode.classList.add('photo-fallback');">
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
              <img src="assets/characters/angel-chibi/粉毛锁天使_05_摆烂.png" alt="摆烂" onerror="this.style.display='none'; this.parentNode.classList.add('photo-fallback');">
              <span class="photo-fallback-text">摆烂中</span>
            </div>
            <div class="polaroid-caption">— 怠け者 —</div>
          </div>
        </div>

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

  // 3. 注入 Games · CRT 电脑
  const games = document.createElement('div');
  games.className = 'page'; games.dataset.page = 'games';
  games.innerHTML = `
    <div class="crt-scene" aria-label="Games · CRT 电脑">
      <!-- 左侧导航（复用 Gallery 侧栏结构） -->
      <div class="gallery-sidebar">
        <div class="gallery-return" data-return-home="true">
          <span class="return-scissors">✂</span>
          <span class="return-label">返回桌面</span>
        </div>
        <div class="gallery-nav-title">· MUSEUM MAP ·</div>
        <a class="gallery-nav-link" data-page-link="worlds">🏘 Worlds &amp; IP · 商业街</a>
        <a class="gallery-nav-link" data-page-link="gallery">📸 Gallery · 公告栏</a>
        <a class="gallery-nav-link is-current">📺 Games · CRT 电脑</a>
        <a class="gallery-nav-link" data-page-link="studio">🎨 Studio · 工具箱</a>
        <a class="gallery-nav-link" data-page-link="music">🎵 Music · 点唱机</a>
        <a class="gallery-nav-link" data-page-link="archives">📁 Archives · 档案柜</a>
      </div>

      <!-- CRT 电脑外壳 + 屏幕 -->
      <div class="crt-wrapper">
        <!-- 显示器外壳 -->
        <div class="crt-monitor">
          <div class="crt-bezel">
            <!-- CRT 屏幕 -->
            <div class="crt-screen">
              <!-- 扫描线 + 玻璃反光 -->
              <div class="crt-scanlines" aria-hidden="true"></div>
              <div class="crt-glow" aria-hidden="true"></div>
              <!-- 屏幕内容（频道切换） -->
              <div class="crt-content" id="crtContent">
                <div class="crt-channel crt-channel--0 is-channel">
                  <div class="crt-pong">
                    <div class="pong-paddle pong-left"></div>
                    <div class="pong-paddle pong-right"></div>
                    <div class="pong-ball"></div>
                    <div class="pong-score">00 · 00</div>
                    <div class="crt-label">▶ PONG · 1972</div>
                  </div>
                </div>
                <div class="crt-channel crt-channel--1">
                  <div class="crt-tetris">
                    <div class="tetris-grid">
                      ${Array.from({length:20}).map((_,i)=>`<div class="tetris-cell ${Math.random()<.3?'is-block':''}" style="--d:${i%4};"></div>`).join('')}
                    </div>
                    <div class="crt-label">▶ BLOCKS · 1984</div>
                  </div>
                </div>
                <div class="crt-channel crt-channel--2">
                  <div class="crt-snake">
                    ${Array.from({length:16}).map((_,i)=>`<div class="snake-seg" style="left:${10+i*14}px;top:${60+Math.sin(i)*20}px;animation-delay:${i*.1}s;"></div>`).join('')}
                    <div class="crt-label">▶ SNAKE · 1997</div>
                  </div>
                </div>
                <div class="crt-channel crt-channel--3">
                  <div class="crt-demo">
                    <pre class="crt-demo-text">
 HIMEMIRO COMPUTER v0.1
 -----------------------
 > HELLO, DREAMER...
 > WELCOME TO THE MUSEUM
 > CURRENT EXHIBIT: GALLERY
 > PRESS [SPACE] TO PLAY
                    </pre>
                  </div>
                </div>
              </div>
              <!-- 雪花噪点（切换时出现） -->
              <div class="crt-static" id="crtStatic"></div>
              <!-- 频道号显示 -->
              <div class="crt-channel-indicator" id="crtChNum">CH 01</div>
            </div>
            <!-- 屏幕边框小标签 -->
            <div class="crt-brand">HIMEMIRO · COLOR</div>
          </div>
          <!-- 显示器底座 -->
          <div class="crt-base"></div>
          <!-- 旋钮区 -->
          <div class="crt-knobs">
            <button class="crt-knob crt-knob--left" data-channel-prev="true" aria-label="上一个频道"></button>
            <span class="crt-knob-label">CHANNEL</span>
            <button class="crt-knob crt-knob--right" data-channel-next="true" aria-label="下一个频道"></button>
            <button class="crt-power" id="crtPower" aria-label="电源">⚡</button>
          </div>
        </div>

        <!-- 桌面（屏幕下方） -->
        <div class="crt-desk">
          <div class="crt-icon" data-page-link="gallery">📸 Gallery</div>
          <div class="crt-icon" data-page-link="worlds">🏘 Worlds</div>
          <div class="crt-icon" data-page-link="studio">🎨 Studio</div>
          <div class="crt-icon crt-icon--trash">🗑 TRASH</div>
          <!-- 开始菜单 -->
          <div class="crt-start">▶ START</div>
        </div>
      </div>
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
        <a class="gallery-nav-link" data-page-link="games">📺 Games · CRT 电脑</a>
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
              <img src="assets/characters/angel-chibi/粉毛锁天使_04_干饭.png" alt="干饭" onerror="this.style.display='none';">
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
              <img src="assets/characters/purple-chibi/紫玫瑰大小姐_05_软笑抱兔.png" alt="抱兔" onerror="this.style.display='none';">
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

        <!-- 店铺 5：未来的空格 -->
        <div class="shop shop--empty" data-shop="future">
          <div class="shop-awning shop-awning--cream"></div>
          <div class="shop-sign" style="--ws:180px; --s:13px;">
            <span class="shop-sign-text" style="writing-mode:vertical-rl;">募集中...</span>
          </div>
          <div class="shop-front">
            <div class="shop-window">?</div>
            <div class="shop-door" style="opacity:.3;">COMING</div>
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
                <img src="assets/characters/angel-chibi/粉毛锁天使_09_开心.png" alt="" onerror="this.style.display='none';">
                <span>煤咪露</span>
              </div>
              <div class="material material--char" draggable="true" data-char="purple">
                <img src="assets/characters/purple-chibi/紫玫瑰大小姐_05_软笑抱兔.png" alt="" onerror="this.style.display='none';">
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
        <!-- 磁带详情（打字机曲目表） -->
        <div class="jukebox-tracklist" id="jboxTracklist">
          <pre class="jbox-typewriter">
TITLE  · 夢と魔法の物語
ARTIST · HIMEMIRO BAND
YEAR   · 2001
TRACKS · 12
──────────────────────────
01. はじまりのメロディ    3:12
02. 蝶々の秘密            4:05
03. 薔薇と十字架          3:58
04. 星屑のダンス          4:22
05. 君に会いたくて        3:45
          </pre>
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
      </div>
    </div>
  `;
  document.body.appendChild(archives);

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
        item.innerHTML = `<img src="assets/characters/angel-chibi/粉毛锁天使_09_开心.png" alt="">`;
      } else if (draggedData.char === 'purple') {
        item.innerHTML = `<img src="assets/characters/purple-chibi/紫玫瑰大小姐_05_软笑抱兔.png" alt="">`;
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
  };

  function closeAllPanels() {
    document.querySelectorAll('.shop-panel.is-open').forEach(p => p.classList.remove('is-open'));
    document.querySelectorAll('.shop-door.is-open').forEach(d => d.classList.remove('is-open'));
    document.querySelectorAll('.shop-window.is-reveal').forEach(w => w.classList.remove('is-reveal'));
  }

  // 事件委托
  document.addEventListener('click', (e) => {
    const door = e.target.closest('.shop-door[data-shop-open]');
    if (door) {
      const shop = door.closest('.shop');
      const key = shop?.dataset.shop;
      if (!key || !SHOP_DATA[key]) return;
      window.playClickSound?.();
      closeAllPanels();

      door.classList.add('is-open');
      const win = shop.querySelector('.shop-window');
      if (win) win.classList.add('is-reveal');

      // 确保 shop 有 position: relative
      shop.style.position = 'relative';

      // 如果没有 panel 就创建一个
      let panel = shop.querySelector('.shop-panel');
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
