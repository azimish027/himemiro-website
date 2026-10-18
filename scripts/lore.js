/* ============================================================
 * HIMEMIRO CHARACTER LORE DATABASE
 * 角色设定与世界观 — Phase 1 灵魂注入核心素材
 * 作者原创设定，AI 辅助整理结构化
 * ============================================================ */

window.HIMEMIRO_LORE = {

  // ============ 角色 A：Meromiro / 煤咪露 ============
  meromiro: {
    // --- 基本信息 ---
    id: 'meromiro',
    fullName: '惨叫☆残虐☆極刑輪廻 断罪の天使 Meromiro',
    shortName: 'Meromiro',
    cnName: '煤咪露',
    nicknames: ['爱露', 'Ailu', 'memi', '爱露碳❤️', '煤咪'],
    selfRefer: '爱露碳❤️',
    role: '地狱极刑虐杀轮回层 · 刽子手',
    age: null, // 未定
    era: '地狱侧',
    hairColor: '红 / 暗红色（未定）',
    visualStyle: '古早哥特 × 黑暗朋克 × 校园风 × 可爱',
    signatureWeapon: '巨大钻头（可变电钻，需力量供能，有按钮）',

    // --- 性格（反套路设计） ---
    personality: {
      core: '天生残暴 · 血腥猎奇 · 缺乏同理心',
      contrast: '智商高 · 对冷门学科感兴趣 · 习惯下意识装傻',
      selfAwareness: '心智停留在儿童 · 恶性自恋',
      antiTrope: '反"天真偶尔暴力"套路 — 是真正的残暴',
      traits: [
        '下意识装傻，外人看不出智商',
        '对冷门学科有强烈兴趣（冷门≠没用）',
        '恶性自恋，无法真正共情',
        '心智停留在儿童水平',
        '残暴是本性，不是设定'
      ]
    },

    // --- 背景故事 ---
    background: {
      origin: '地狱极刑虐杀轮回层',
      occupation: '刽子手（Executioner）',
      mentor: {
        name: '美丽魅魔（姓名未定）',
        traits: '力量强但随性堕落 · 抽烟喝酒',
        relationship: '师傅 — 力量强大但不靠谱'
      },
      goal: '成为世界一流刽子手',
      currentGoal: '力争测验第一',
      mishap: '导师忘记确认地址 → 被调错至"荆棘迷宫"别馆 → 掉落人间'
    },

    // --- 人际关系 ---
    relationships: [
      { target: '巡夢姬 (Meguri Yumehime)', relation: '朋友（主动提出）', note: '觉得她像公主，为其起名 Yumehime' },
      { target: '师傅魅魔', relation: '师徒', note: '力量强但随性堕落' },
      { target: '校长（姨母）', relation: '姨母', note: '地狱学校校长' }
    ],

    // --- 在商业街的店铺 ---
    shop: {
      name: '煤咪露喫茶店',
      type: '地狱料理店（人间分店）',
      note: '从地狱掉落后在人间开的店 — 菜单全是地狱食物'
    },

    // --- 签名台词 ---
    catchphrases: [
      '爱露碳❤️ 今日の極刑をお楽しみに～',
      '钻头按钮…等下我按一下——'
    ]
  },

  // ============ 角色 B：Yumehime / 巡夢姬 ============
  yumehime: {
    id: 'yumehime',
    fullName: '巡 夢姫（Meguri Yumehime）',
    shortName: 'Meguri',
    cnName: '巡夢姬',
    originalName: '被诅咒遗忘 — Meromiro 为其起名',
    role: '中世纪黑死病唯一幸存者',
    age: null,
    era: '中世纪 → 现代（被困古堡 1998-2007+）',
    hairColor: '未定',
    skinColor: '苍白',
    visualStyle: '中世纪厚重感 × 2007 时代交织 × 全身黑 × 抱着玩偶',
    signatureElement: '蔷薇（内心防线 / 可操控）',

    personality: {
      core: '高冷 · 冷淡 · 纯洁 · 不善表达',
      hiddenTraits: ['会偷偷跟踪或观察别人', '天生运气差'],
      defenseMechanism: '蔷薇（内心防线，可操控）',
      depth: '看似冷淡是因为经历太多 — 把家人做成蜡像留在身边'
    },

    background: {
      trauma: '中世纪黑死病唯一幸存者',
      curse: '被传为诅咒魔女',
      prison: '被困古堡 · 无法死亡',
      dailyLife: '画画、看书、把死去的家人做成蜡像',
      meetingMeromiro: 'Meromiro 主动提出交朋友 · Meromiro 觉得她像公主 · 为其起名"巡夢姬"'
    },

    relationships: [
      { target: 'Meromiro', relation: '朋友（对方主动）', note: '第一个发现她不是诅咒而是活人的人' },
      { target: '家人', relation: '蜡像', note: '已故家人被做成蜡像留在古堡陪伴' }
    ],

    shop: {
      name: '巡夢姬古董屋',
      type: '中世纪收藏 / 蜡像（私人）',
      note: '从古堡搬来的藏品 — 包括家人蜡像'
    },

    catchphrases: [
      '……'（很少说话）,
      '别碰蔷薇。'
    ]
  },

  // ============ 世界观 ============
  world: {
    // --- 地狱 ---
    hell: {
      structure: '有专门世界与培训（像学校）',
      education: '地狱学校体系（极刑测验、刽子手培训）',
      power: '力量不叫魔法 — 需念咒语和古早的印',
      connection: '地狱与人间力量联通 — 地狱更发达',
      locations: ['极刑虐杀轮回层', '荆棘迷宫别馆', '地狱学校（校长=Meromiro 姨母）']
    },

    // --- 人间（商业街所在） ---
    human: {
      era: '现代日本',
      location: '商业街（HIMEMIRO WORLD）',
      shopCount: 8,
      shops: [
        { id:'cafe',    name:'煤咪露喫茶店',     owner:'Meromiro', type:'地狱料理',      era:'现代' },
        { id:'antique', name:'巡夢姬古董屋',     owner:'Yumehime', type:'中世纪收藏',    era:'中世纪→现代' },
        { id:'art',     name:'HIMEMIRO 画材工房', owner:'共用',     type:'画材/素材',    era:'现代' },
        { id:'record',  name:'深夜唱片行',         owner:'共用',     type:'音乐',         era:'现代' },
        { id:'sweets',  name:'HIMEMIRO スイーツ店',owner:'Meromiro', type:'糖果/周边',    era:'现代' },
        { id:'stationery', name:'Y2K 文房具店',   owner:'TBD',      type:'文具',         status:'COMING SOON' },
        { id:'gashapon',  name:'ガシャポン専門店', owner:'TBD',      type:'扭蛋',         status:'COMING SOON' },
        { id:'florist',   name:'蔷薇の花屋',       owner:'Yumehime', type:'蔷薇/花束',    status:'COMING SOON — Yumehime 操控蔷薇' }
      ]
    },

    // --- 核心剧情（未定性） ---
    plot: {
      incitingIncident: '导师忘记确认地址 → Meromiro 被调错至荆棘迷宫 → 掉落人间',
      firstMeeting: 'Meromiro 向 Yumehime 提出交朋友 → Yumehime 忘记真名 → Meromiro 为其起名',
      storylines: [
        '校园日常（地狱学校 vs 人间生活双线）',
        '导师出场（那个不靠谱的魅魔师傅）',
        '罪犯潜逃（极刑对象从地狱逃到人间）',
        '行刑权开放（Meromiro 在人间能否行使刽子手职责？）',
        '姨母是校长（地狱学校校长 = Meromiro 姨母）'
      ]
    }
  },

  // ============ 展览 ============
  exhibitions: [
    {
      id: 'ex-001',
      title: '断罪の天使 × 诅咒の魔女 — 调错人间的第一天',
      subtitle: 'HIMEMIRO WORLD · 首展',
      date: '2026.10 — 2027.01',
      curator: 'HIMEMIRO',
      exhibits: [
        'Meromiro 立绘（地狱侧原始形象）',
        'Yumehime 立绘（黑死病幸存者形象）',
        '商业街 8 家店概念图',
        '表情包 × 18',
        '角色素材表 × 3',
        '9 首主题曲'
      ],
      description: '一场关于"两个异世界角色调错到现代日本商业街"的喜剧 × 黑暗奇幻的首次联展。Meromiro 需要在人间继续刽子手测验，Yumehime 需要面对"有人不再躲着她"的全新日常。'
    }
  ]
};

/* ============================================================
 * HIMEMIRO LIBRARY — 渲染函数集合
 * 由 enhance.js 在 DOMContentLoaded 后调用
 * ============================================================ */
window.HIMEMIRO_LIB = {

  // --- 注入 Gallery 页面角色档案 + About + 表情包 ---
  mountGalleryCards: function() {
    var lore = window.HIMEMIRO_LORE;
    if (!lore) return;
    var gallery = document.querySelector('.page[data-page="gallery"]');
    if (!gallery) return;
    if (gallery.dataset.loreMounted) return; // 防止重复
    gallery.dataset.loreMounted = '1';

    var container = document.createElement('div');
    container.className = 'gallery-lore-section';
    container.style.cssText = 'margin-top:60px;padding:40px 32px;background:rgba(255,250,240,0.95);border-top:3px dashed #c48a4e;border-radius:0 0 12px 12px;';

    container.innerHTML = this._aboutBlock() + this._charCard(lore.meromiro, 'angel-full.png', 'angel-chibi/粉毛锁天使_09_开心.png') + this._charCard(lore.yumehime, 'purple-full.png', 'purple-chibi/紫玫瑰大小姐_05_软笑抱兔.png') + this._stickerGrid();

    gallery.appendChild(container);
  },

  _aboutBlock: function() {
    return `
      <div style="margin-bottom:40px;text-align:center;">
        <div style="font-family:'BigShoulders',sans-serif;font-size:28px;color:#c87533;letter-spacing:0.08em;margin-bottom:8px;">
          ✦ ABOUT HIMEMIRO ✦
        </div>
        <div style="width:80px;height:2px;background:#c87533;margin:0 auto 20px;"></div>
        <p style="max-width:640px;margin:0 auto;font-size:15px;line-height:1.9;color:#4a3a2e;">
          HIMEMIRO 是一个<strong>调错人间的数字博物馆</strong>。<br>
          地狱极刑刽子手 Meromiro 被导师调错地址，从"荆棘迷宫"别馆掉落现代日本；
          中世纪黑死病唯一幸存者 Yumehime 被困古堡四百年，被传为诅咒魔女。<br>
          <span style="color:#c87533;font-weight:600;">她向她提出交朋友。她为她起名"巡夢姬"。</span><br>
          于是两个异世界角色在一条不知名的商业街开始了……现代日常？
        </p>
        <div style="margin-top:18px;font-size:12px;color:#a08070;letter-spacing:0.15em;">
          — 角色 & 世界观 & 音乐 & 拼贴 — © HIMEMIRO
        </div>
      </div>
    `;
  },

  _charCard: function(c, fullImg, chibiImg) {
    var nicknames = c.nicknames ? c.nicknames.join(' · ') : '';
    var traits = c.personality && c.personality.traits ? c.personality.traits : [];
    var bg = c.background || {};
    var rels = c.relationships || [];

    return `
      <div style="display:flex;gap:28px;margin-bottom:36px;padding:28px;background:#fff;border-radius:12px;border:1px solid #e5dcd0;box-shadow:0 4px 18px rgba(200,117,51,0.08);">
        <!-- 左列：立绘 -->
        <div style="flex-shrink:0;width:200px;">
          <div style="background:#faf3eb;border-radius:10px;padding:16px;text-align:center;margin-bottom:12px;">
            <img loading="lazy" src="assets/characters/${fullImg}" alt="${c.shortName}" style="max-width:100%;max-height:280px;border-radius:6px;" onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\\'color:#a08070;padding:40px 0;font-size:28px;\\'>${c.shortName}</div>';">
          </div>
          <div style="background:#faf3eb;border-radius:8px;padding:8px;text-align:center;">
            <img loading="lazy" src="assets/characters/${chibiImg}" style="max-width:80px;border-radius:6px;">
          </div>
        </div>

        <!-- 右列：档案 -->
        <div style="flex:1;min-width:0;">
          <div style="font-family:'BigShoulders',sans-serif;font-size:26px;color:#1a1a2e;line-height:1.2;">${c.shortName}</div>
          <div style="font-size:13px;color:#c87533;margin-top:4px;font-weight:600;">${c.fullName}</div>
          <div style="font-size:12px;color:#8a7868;margin-top:4px;letter-spacing:0.05em;">${nicknames}</div>

          <div style="margin-top:14px;display:grid;grid-template-columns:110px 1fr;gap:6px 12px;font-size:13px;">
            <div style="color:#a08070;">角色定位</div><div style="font-weight:600;">${c.role}</div>
            <div style="color:#a08070;">视觉风格</div><div>${c.visualStyle}</div>
            <div style="color:#a08070;">发色</div><div>${c.hairColor}</div>
            <div style="color:#a08070;">签名元素</div><div>${c.signatureElement || c.signatureWeapon || '—'}</div>
            <div style="color:#a08070;">时间线</div><div>${c.era || '—'}</div>
          </div>

          <div style="margin-top:16px;padding:12px;background:#fff8f0;border-radius:8px;border-left:3px solid #c87533;">
            <div style="font-size:11px;color:#c87533;font-weight:700;letter-spacing:0.08em;margin-bottom:4px;">✦ 背景</div>
            <div style="font-size:13px;line-height:1.7;color:#4a3a2e;">
              ${c.role === '地狱极刑虐杀轮回层 · 刽子手' ?
                `地狱极刑虐杀轮回层的刽子手之一。师傅是美丽魅魔（力量强但随性堕落）。目标是<strong>成为世界一流刽子手</strong>，力争测验第一。<br>
                导师忘记确认地址，<strong>被调错至"荆棘迷宫"别馆 → 掉落人间</strong>。` :
                `中世纪黑死病<strong>唯一幸存者</strong>，被传为诅咒魔女。无法死亡，被困古堡。可操控蔷薇作为内心防线。<br>
                把死去的家人做成蜡像留在身边，在古堡画画、看书。<strong>1998-2007 年间</strong>。`}
            </div>
          </div>

          <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
            ${traits.map(function(t){return '<span style="font-size:11px;background:#f0e8dc;color:#6a5a4a;padding:3px 10px;border-radius:12px;">'+t+'</span>';}).join('')}
          </div>

          <div style="margin-top:12px;font-size:12px;color:#8a7868;">
            <strong style="color:#4a3a2e;">关系：</strong>
            ${rels.map(function(r){return r.target+'（'+r.relation+'）';}).join(' · ')}
          </div>
        </div>
      </div>
    `;
  },

  _stickerGrid: function() {
    var angels = ['粉毛锁天使_01_不服','粉毛锁天使_02_得意','粉毛锁天使_03_困倦','粉毛锁天使_04_干饭','粉毛锁天使_05_摆烂','粉毛锁天使_06_生气','粉毛锁天使_07_委屈','粉毛锁天使_08_傲娇','粉毛锁天使_09_开心','粉毛锁天使_10_emo'];
    var purples = ['紫玫瑰大小姐_01_害羞','紫玫瑰大小姐_02_打瞌睡','紫玫瑰大小姐_03_委屈','紫玫瑰大小姐_04_抿茶','紫玫瑰大小姐_05_软笑抱兔','紫玫瑰大小姐_06_发呆','紫玫瑰大小姐_07_撒娇拽袖','紫玫瑰大小姐_08_emo'];
    var all = [];
    angels.forEach(function(n){ all.push({char:'angel', name:n}); });
    purples.forEach(function(n){ all.push({char:'purple', name:n}); });

    var cells = all.map(function(s){
      return '<div style="background:#fff;border-radius:8px;padding:8px;text-align:center;border:1px solid #e5dcd0;"><img loading="lazy" src="assets/characters/'+s.char+'-chibi/'+s.name+'.png" style="max-width:60px;border-radius:4px;"></div>';
    }).join('');

    return `
      <div style="border-top:2px dashed #c87533;padding-top:24px;margin-top:20px;">
        <div style="font-family:'BigShoulders',sans-serif;font-size:20px;color:#c87533;margin-bottom:4px;">✦ 表情包作品集 ✦</div>
        <div style="font-size:12px;color:#a08070;margin-bottom:14px;">共 ${all.length} 张 · 粉毛锁天使 × ${angels.length} · 紫玫瑰大小姐 × ${purples.length}</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">${cells}</div>
      </div>
    `;
  },

  // --- 注入 Featured Exhibition（首页） ---
  mountFeaturedExhibition: function() {
    var feature = document.querySelector('.exhibit__title');
    var featureDesc = document.querySelector('.exhibit__desc');
    var featureVisual = document.querySelector('.exhibit__visual');
    var featureLabel = document.querySelector('.exhibit__label');
    if (!feature && !featureDesc) return;

    if (feature) feature.textContent = '断罪の天使 × 诅咒の魔女';
    if (featureDesc) featureDesc.innerHTML = `
      <strong style="color:#c87533;">调错人间的第一天 — HIMEMIRO WORLD 首展</strong><br><br>
      地狱刽子手 Meromiro 被导师调错地址，从荆棘迷宫别馆掉落现代日本。<br>
      中世纪黑死病幸存者 Yumehime 被困古堡四百年，第一次有人向她伸出手。<br><br>
      <span style="color:#8a7868;">两个异世界角色、一条商业街、8 家店铺、9 首主题曲。</span>
    `;
    if (featureLabel) featureLabel.textContent = 'CURRENT EXHIBITION · 2026.10 — 2027.01';
    if (featureVisual) {
      featureVisual.innerHTML = `
        <div style="position:relative;width:100%;height:100%;">
          <img loading="lazy" src="assets/characters/angel-full.png" style="position:absolute;left:15%;bottom:0;max-height:100%;opacity:0.9;" onerror="this.style.display='none';">
          <img loading="lazy" src="assets/characters/purple-full.png" style="position:absolute;right:15%;bottom:0;max-height:100%;opacity:0.9;" onerror="this.style.display='none';">
          <div style="position:absolute;top:12px;left:12px;font-family:'BigShoulders',sans-serif;font-size:14px;color:#c87533;background:rgba(255,255,255,0.85);padding:4px 10px;border-radius:4px;">HIMEMIRO EXH. 001</div>
        </div>
      `;
      featureVisual.style.background = '#faf3eb';
    }
  },

  // --- 给 Worlds 商业街店铺加点击弹窗 ---
  setupWorldsShops: function() {
    var lore = window.HIMEMIRO_LORE;
    if (!lore) return;
    var shops = document.querySelectorAll('[data-shop]');
    shops.forEach(function(shopEl) {
      if (shopEl.dataset.modalBound) return;
      shopEl.dataset.modalBound = '1';
      shopEl.style.cursor = 'pointer';
      shopEl.addEventListener('click', function() {
        var id = this.dataset.shop;
        var shop = lore.world.human.shops.find(function(s){ return s.id === id; });
        if (!shop) return;
        showShopModal(shop);
      });
    });

    // 全局关闭
    document.addEventListener('click', function(e) {
      if (e.target.classList && e.target.classList.contains('hm-shop-modal-overlay')) {
        e.target.remove();
      }
    });
  }
};

// 店铺弹窗（全局函数，shop 对象作为参数）
function showShopModal(shop) {
  var lore = window.HIMEMIRO_LORE;
  if (!lore) return;
  var character = null;
  if (shop.owner === 'Meromiro') character = lore.meromiro;
  else if (shop.owner === 'Yumehime') character = lore.yumehime;

  var overlay = document.createElement('div');
  overlay.className = 'hm-shop-modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(20,10,5,0.65);z-index:9999;display:flex;align-items:center;justify-content:center;';

  var isComing = shop.status && shop.status.includes('COMING');

  var html = `
    <div style="background:#fffaf2;border-radius:14px;max-width:520px;width:92%;max-height:80vh;overflow-y:auto;padding:28px;box-shadow:0 20px 60px rgba(0,0,0,0.3);border:2px solid #c87533;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">
        <div>
          <div style="font-family:'BigShoulders',sans-serif;font-size:22px;color:#1a1a2e;">${shop.name}</div>
          <div style="font-size:12px;color:#c87533;margin-top:2px;letter-spacing:0.08em;">${shop.type}${isComing ? ' · COMING SOON' : ''}</div>
        </div>
        <button onclick="this.closest('.hm-shop-modal-overlay').remove()" style="background:none;border:none;font-size:22px;cursor:pointer;color:#a08070;">×</button>
      </div>
      ${character ? `
        <div style="padding:12px;background:#fff8f0;border-radius:8px;border-left:3px solid #c87533;margin-bottom:14px;">
          <div style="font-size:11px;color:#c87533;font-weight:700;letter-spacing:0.08em;margin-bottom:4px;">✦ 店主</div>
          <div style="font-weight:700;font-size:15px;">${character.shortName}</div>
          <div style="font-size:12px;color:#8a7868;margin-top:2px;">${character.role}</div>
          <div style="font-size:12px;color:#4a3a2e;margin-top:6px;">${shop.note || ''}</div>
        </div>
      ` : shop.owner === '共用' ? `
        <div style="padding:12px;background:#fff8f0;border-radius:8px;border-left:3px solid #7a9e7e;margin-bottom:14px;">
          <div style="font-size:11px;color:#7a9e7e;font-weight:700;letter-spacing:0.08em;margin-bottom:4px;">✦ 店主</div>
          <div style="font-size:12px;color:#4a3a2e;">Meromiro 与 Yumehime 共用的店 · 商业街公共设施</div>
        </div>
      ` : ''}
      ${isComing ? `
        <div style="text-align:center;padding:24px;color:#a08070;font-size:13px;">
          🚧 正在装修中…敬请期待
        </div>
      ` : `
        <div style="font-size:13px;line-height:1.8;color:#4a3a2e;">
          ${shop.name} — 位于 HIMEMIRO WORLD 商业街。<br>
          ${character ? `更多 ${character.shortName} 的故事请前往 Gallery → 角色档案查看。` : '与周围店铺共同构成这条小小的异世界商业街。'}
        </div>
      `}
    </div>
  `;

  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}
