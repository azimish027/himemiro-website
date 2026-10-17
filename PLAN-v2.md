# HIMEMIRO 官网重构落地方案（v2）

**日期**：2026-10-17
**前提**：逐图拆解 txt 文档（30 批 × 组件拆解）+ 双女主角色立绘/素材表 + 24 张表情包 + 6 张贴纸素材
**当前首页**：单页 hero + widgets + exhibit + explore + footer（≈ 2026 年企业官网结构）
**目标骨架**：三栏 Neocities 个人站（≈ 2008–2012 日本女生博客结构）

---

## 一、你提供的真实资产（全部用上，不自己画/生成）

| 资产 | 文件路径 | 数量 | 怎么用 |
|---|---|---|---|
| 粉毛锁天使 · 全身立绘 | `...粉发绿眸哥特萝莉角色立绘.png`（你导出成单独 PNG 后） | 1 | **入口页右下角 Hero standee**（挡住部分弹窗） |
| 紫玫瑰大小姐 · 全身立绘 | `...哥特洛丽塔少女与复古兔偶.png`（单独 PNG） | 1 | **HeroBanner 主视觉**（和粉毛锁天使并排做双子横幅） |
| 粉毛锁天使 · 素材表（抠图） | `...哥特萝莉天使恶魔角色素材表.png` | ≈ 50 元素 | 8 张背景纹理 → section 背景；表情组 → 状态小部件 Q 版小人；场景道具（教堂窗/蜡烛/十字架书）→ 装饰 |
| 粉毛锁天使 · UI 组件素材表 | `...粉色哥特萝莉角色素材表.png` | ≈ 30 元素 | 2 种花边框 → 卡片框；笔记本卡片 → WelcomeCard/ProfileCard；密码锁/进度条 → 状态 UI |
| 紫玫瑰大小姐 · 素材表 | `...哥特洛丽塔角色资产贴纸表.png` | ≈ 40 元素 | Q 版全身小人（从大到小 6 张）→ 头像 tab 导航；配色板 → 主色调 |
| 粉毛锁天使表情包 | `D:\品牌项目\粉毛锁天使表情包\*.png` | 10 张 | **状态小部件**"当前心情/当前表情"随机显示；**立绘装饰**（hover 时切换） |
| 紫玫瑰大小姐表情包 | `D:\品牌项目\紫玫瑰大小姐表情包\*.png` | 8 张 | 同上（第二角色状态） |
| 紫玫瑰大小姐贴纸 | `D:\品牌项目\紫玫瑰大小姐表情包\*贴纸*.png` | 6 张 | 页面装饰（哥特配饰/道具/聊天元素） |

### ⚠️ 前提：素材表需要抠图
你给的 5 张"素材表"是**拼图总览**（所有元素堆在一张大 PNG 上），落地前需要先把每个元素单独抠出来存成透明底 PNG。这一步可以我来做（用 HTML canvas 或 Node sharp 裁剪），也可以你自己抠好放 `website/assets/` 目录。

**建议目录结构**：
```
D:\品牌项目\website\assets\
├── characters\
│   ├── angel-full.png          # 粉毛锁天使全身立绘
│   ├── angel-chibi-01~10.png   # 10 张表情包（不服/得意/困倦/干饭/摆烂/生气/委屈/傲娇/开心/emo）
│   ├── angel-materials\*.png   # 从素材表抠的表情/Q版/发饰/配件
│   ├── purple-full.png         # 紫玫瑰大小姐全身立绘
│   ├── purple-chibi-01~08.png  # 8 张表情包
│   └── purple-materials\*.png  # 从素材表抠的表情/Q版/发饰/配件
├── backgrounds\
│   ├── starry-purple.png       # 星空紫
│   ├── dark-paper.png          # 深色纸
│   ├── rose-paper.png          # 玫瑰纸
│   └── ...                     # 其他 6 种
├── decorations\
│   ├── lace-pattern.png        # 蕾丝
│   ├── purple-ribbon.png       # 紫丝带
│   ├── heart-chain.png         # 爱心链
│   ├── gothic-stickers\*.png   # 紫玫瑰贴纸 6 张
│   └── ...
└── scenes\
    ├── church-window.png      # 教堂彩窗
    ├── candlestand.png         # 蜡烛架
    ├── cross-book.png          # 十字架书
    └── perfume-bottle.png      # 香水瓶
```

---

## 二、当前首页 vs 目标骨架（对比 + 承认推倒）

### 当前（2026 年官网结构）
```
[sticky header 巧克力]
[大拱门 hero + 探索按钮]
[3 个 widget 横排]
[Featured Exhibition 画框]
[6 卡片 Explore 网格]
[footer 巧克力]
```

### 目标（2008 年 Neocities 个人站结构 · 三栏）
```
[顶部 WARNING 弹窗（入口页）] → 点 enter 后 →
├─ 【顶部】
│   ├─ 粉白条纹遮阳篷（CSS，不是图）
│   ├─ HeroBanner：双子立绘（紫玫瑰抱兔偶 + 粉毛锁天使）+ 站名泡泡字
│   ├─ 音乐播放器条（KHA - Comm 00:00/03:56 样式）
│   └─ 一排头像 tab 导航（6 个紫玫瑰 Q 版小人）
│
├─ 【主体 三栏】
│   ├─ 左栏 180px
│   │   ├─ 渐变胶囊导航按钮（home / about / diary / worlds / gallery）
│   │   ├─ Mood 状态卡（用表情包：angel-chibi-08 傲娇 + "现在心情：摆烂"）
│   │   ├─ Now Playing 小部件
│   │   ├─ 粉表头月历（橘红高亮今天，复用 tokens.css 橘红）
│   │   ├─ 链接列表（friends / credits / sitemap）
│   │   └─ 底部 visitor counter（第三方嵌入）
│   │
│   ├─ 中栏 自适应 600px（核心内容区）
│   │   ├─ WelcomeCard（蕾丝边框 + 粉毛锁天使 Q 版小人 + 手写体欢迎文案）
│   │   ├─ DiaryEntry（最近一条博客/日记摘录 + 时间戳）
│   │   ├─ Current Exhibition（用真实紫玫瑰大小姐表情包做缩略图）
│   │   ├─ 投票组件（必须有"secret 3rd option"彩蛋）
│   │   ├─ Update Log（日期 + 改动列表）
│   │   └─ Cbox 评论框（cbox.ws 免费嵌入）
│   │
│   └─ 右栏 220px
│       ├─ Discord 式 Status Widget（头像 + 名字 + 时间 + 当前表情）
│       ├─ CharacterProfileCard（粉毛锁天使档案卡：姓名/身高/生日/表情）
│       ├─ MP3 播放器 widget（粉色 UI + 循环 BGM）
│       ├─ 垂直紫丝带装饰 + 垂下来的道具挂件（香水瓶/礼盒/蜡烛，CSS 摆动动画）
│       ├─ Link Me 按钮（黄色椭圆）
│       └─ 站点地图/导航
│
└─ 【底部】
    ├─ 88×31px 友情链接 button 排（最后一个彩蛋粗口按钮）
    └─ 手写体版权 "HIMEMIRO 2026 ~ till I die of old age ☆"
```

---

## 三、视觉令牌保留 / 修改 / 新增方案

### ✅ 完全保留（工坊的令牌继续用）
```css
--c-chocolate: #402A2A
--c-deep-chocolate: #3A2424
--c-cream: #F3E5C8
--c-vanilla: #FFF8E9
--c-candy-orange: #F0643B      /* 橘红边带保留，但会是点缀色，不是主色 */
--c-cranberry: #C95770
--c-ink-dark: #2A1818
```

### ❌ 主色调迁移（官网脱离工坊奶油，切换到紫玫瑰素材表的配色板）
紫玫瑰素材表给了 5 色板：
```css
--v-deep-purple: #4A2D4A       /* 深紫，替代巧克力做导航/标题 */
--v-gray-purple: #8B6B8B       /* 灰紫，替代灰棕做次级文字 */
--v-cream-paper: #F5E6C8       /* 米色纸，替代奶油做整页底 */
--v-lavender-bg: #E6D5E6       /* 淡紫背景（波点/格纹 section） */
--v-black: #1A1212             /* 纯黑（装饰/描边/阴影） */
```

### ➕ 新增 Y2K 粉紫按钮体系（替代糖果夹心）
```css
/* 复古 2008 粉紫立体按钮（上高光/下阴影/粉紫渐变/按下下沉 4px） */
--btn-y2k-pink: linear-gradient(180deg, #ffb6d9 0%, #ff69b4 100%);
--btn-y2k-purple: linear-gradient(180deg, #c9a8e8 0%, #7e57c2 100%);
--btn-y2k-shadow:
  0 4px 0 rgba(80, 20, 60, .40),         /* 厚底阴影，按下消失 */
  inset 0 2px 0 rgba(255, 255, 255, .55),/* 上高光 */
  inset 0 -1px 0 rgba(80, 20, 60, .20); /* 下暗边 */

/* 蕾丝边框（SVG pattern，不是 CSS border） */
--deco-lace: url('assets/decorations/lace-pattern.svg');

/* 粉白条纹遮阳篷 */
--pattern-awning: repeating-linear-gradient(
  90deg, #ff9ec7 0 30px, #fff 30px 60px
);

/* 紫白格纹底 */
--pattern-gingham: repeating-conic-gradient(#d8bde0 0 25%, #fff 0 50%) 0 0/40px 40px;
```

---

## 四、分阶段实施计划

### 阶段 0：资产预处理（前置，我或你手动）
**产出**：`D:\品牌项目\website\assets\` 完整目录（按上文结构）
**动作**：
- 用 Node sharp / canvas 或 Photoshop 把 5 张素材表抠成单独透明 PNG
- 把表情包文件夹复制进 assets/characters/
- 把立绘 PNG（粉毛锁天使 + 紫玫瑰大小姐）单独导出

### 阶段 1：三栏主站骨架 + 基础令牌迁移
**改文件**：
- `shared/tokens.css`：**追加**紫玫瑰配色板 + Y2K 按钮体系 + 遮阳篷/格纹 pattern（保留工坊令牌不删，避免工坊引用出问题）
- `website/styles.css`：**全部推倒重写**（从 hero+widgets 改为三栏 grid 布局 `grid-template-columns: 180px 1fr 220px`）
- `website/index.html`：**全部推倒重写**（Header → HeroBanner → 音乐条 → 头像 tab → 三栏主体 → Footer）

**关键组件落地顺序**（按依赖关系）：
1. 三栏 grid 骨架（CSS 先立起来，先不管内容）
2. 粉白条纹遮阳篷（CSS repeating-linear-gradient，不是图）
3. HeroBanner（双子立绘背景 + 泡泡字站名 `HIMEMIRO`）
4. 渐变胶囊导航按钮（home/about/worlds/gallery）
5. WelcomeCard（蕾丝边框 + 紫玫瑰抱兔偶 Q 版 + 手写体欢迎文案）
6. Mood 状态卡（引用 angel-chibi-08 傲娇表情包 + "现在心情"）
7. Now Playing / MP3 播放器 widget

### 阶段 2：入口页 + WARNING 弹窗 + Flash 风格增强
**改文件**：
- 新建 `website/entry.html`（入口页，单独文件）
- 修改 `website/index.html` 加 BGM audio tag（默认不自动播，点 enter 后播放）

**入口页流程**（图 05 逐图拆解）：
```
打开站 →
全屏粉底波点（pattern-dot + 粉底色） →
居中 WARNING 弹窗（白底粉边 + 粉粗体字）：
  "⚠ WARNING ⚠"
  "This site contains:"
  "· Flashing colors (be careful! ♥)"
  "· Auto-playing music (sorry not sorry ♡)"
  "· A weird amount of bunny rabbits"
  "· No actual original content yet"
  [ Pink Round Button: "ENTER →" ]
右下角 Hero standee（粉毛锁天使立绘 PNG，挡住部分弹窗底部）
底部一排 dock 小图标（日历/链接/头像/…）
```

### 阶段 3：填充真实内容 + 装饰贴纸 + 交互
**改文件**：
- `website/index.html`（填真实内容替换 placeholder）
- 新建 `website/diary.html`（日记页）
- 新建 `website/worlds.html`（世界观页）

**填充优先级**：
1. DiaryEntry（最近一条你真实写过的日记/碎碎念）
2. Current Exhibition（用紫玫瑰大小姐 + 粉毛锁天使素材表做缩略图）
3. Cbox 嵌入（去 cbox.ws 注册免费号，拿 embed code）
4. 投票组件（选项："你更喜欢粉毛锁天使还是紫玫瑰大小姐？" + secret 3rd option "我更喜欢复古兔偶"）
5. Visitor counter（freecounter.com 嵌入）
6. 装饰贴纸散排（哥特配饰/道具/聊天元素 → 绝对定位在页面边缘）
7. gltich RGB 色差标题（紫玫瑰素材表的紫色 + text-shadow 2px 0 #f0f, -2px 0 #0ff）

### 阶段 4：响应式 + Accessibility + 验收
- 三栏 → 窄屏（<768px）堆叠成单列
- 键盘导航 focus ring（紫玫瑰色 + 足够对比度）
- `prefers-reduced-motion` 停掉摆动/闪烁
- 所有 `<img>` 加 alt 属性

---

## 五、工坊 vs 官网：共享 vs 分离

| 维度 | 工坊（workshop/） | 官网（website/） | 共享（shared/） |
|---|---|---|---|
| 视觉主题 | 巧克力奶油 × 功能编辑器 | 紫玫瑰哥特萝莉 × Y2K 博客 | 颜色令牌（都在 tokens.css 里，官网**追加**紫板，不删奶油板） |
| CSS 框架 | Vue scoped + 全局 panels.css | 纯静态 styles.css + index.html | tokens.css（全部颜色/阴影/pattern） |
| 部署 | Vite build → 你自己的 | 纯静态 → Neocities | 无 |
| 字符资产 | ❌ 不用角色立绘（编辑器里的素材是用户的） | ✅ 双女主 + 表情包 + 贴纸 + 背景纹理 | **不共享**（工坊是功能工具，官网是展示门面） |

---

## 六、需要你确认的 5 个决策点

| # | 问题 | 选项 | 影响范围 |
|---|---|---|---|
| 1 | **双女主角色定位** | A. 紫玫瑰大小姐 = 主主角（左栏 + HeroBanner + 头像 tab），粉毛锁天使 = 副角（状态卡 + 装饰） / B. 粉毛锁天使 = 主，紫玫瑰大小姐 = 副 / C. 完全平等（HeroBanner 并排双人） | 所有角色引用位置 |
| 2 | **主色调方向** | A. 紫玫瑰素材表配色板（深紫 #4A2D4A 做导航标题） / B. 保留工坊巧克力奶油（但加紫粉点缀） | 整站 |
| 3 | **Cbox 评论是否现在加** | A. 现在加（需要你去 cbox.ws 注册免费号拿 embed code） / B. 先留 placeholder 后面加 | 中栏内容 |
| 4 | **BGM 音频资产** | A. 你给我一段 mp3 我放进去 / B. 先用 Web Audio API 合成一个循环短旋律 placeholder（会很简陋） | 入口页 + 主站 |
| 5 | **素材表抠图** | A. 你来抠，我写好 assets 目录等你放文件 / B. 我用 Node sharp/canvas 自动裁剪（需要你告诉我每个元素在素材表里的 x,y,w,h 坐标） | 阶段 0 前置 |

---

## 七、风险 & 约束（永不违反）

1. ✅ tokens.css **追加**，不删除已有奶油令牌（工坊继续引用不出问题）
2. ✅ 官网代码独立 website/ 目录，不碰 workshop/
3. ✅ 所有装饰素材用真实资产，**不生成 AI 图/不用 emoji 代替**
4. ✅ 每阶段单独 build + screenshot 验收，等你勾确认再进下一阶段
5. ✅ BGM 默认不自动播放，尊重系统 `prefers-reduced-motion`
6. ✅ 不硬写版权物（Sanrio/Hello Kitty/Bape/Pucca 全部替换成双女主）

---

**确认后，按阶段 0 → 1 → 2 → 3 → 4 逐步实施。每阶段完成都先截图验收。**
