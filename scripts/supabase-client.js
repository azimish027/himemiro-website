/* =========================================================================
   Supabase Client · 单一数据层（所有动态 widget 都从这里取数据）
   -------------------------------------------------------------------------
   特性：
   1. 没有 Supabase 凭据 → 自动降级为 MOCK 模式（本地 localStorage 数据）
   2. 所有 widget 调用统一走这个文件，数据层可随时换掉
   3. 每个 API 都返回 Promise<data | null>，失败不崩 UI

   Supabase 初始化：
   1. 去 https://supabase.com/dashboard → 你的项目 → Project Settings → API
   2. 复制 Project URL 和 anon public key
   3. 填到下面 SUPABASE_URL / SUPABASE_ANON_KEY
   4. 在 Supabase SQL Editor 跑 migrations/ 里的建表 SQL
   ========================================================================= */

// ---------- 配置 ----------
const SUPABASE_URL = '';        // ← 填这里: https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = '';   // ← 填这里: eyJhbGciOi...

let _supabase = null;
let _initialized = false;

/* ---------- Mock 数据（无 Supabase 时用 localStorage 跑） ---------- */
const MOCK = {
  visitors: null,     // { count, today, updated_at }
  posts: null,         // [{id, name, content, emotion, created_at}]
  online: new Set()    // Set of sessionIds
};

function mockInit() {
  try {
    const cached = JSON.parse(localStorage.getItem('himemiro_mock') || 'null');
    if (cached) {
      MOCK.visitors = cached.visitors || { count: 1247, today: 23, updated_at: Date.now() };
      MOCK.posts = cached.posts || [
        { id: 1, name: '煤咪露', content: '今天也超可爱！☁', emotion: 'happy', created_at: Date.now() - 86400000 * 2 },
        { id: 2, name: '巡夢姬', content: '...又来串门了。', emotion: 'smirk', created_at: Date.now() - 86400000 },
        { id: 3, name: '访客', content: '网站好有感觉！糖霜滤镜爱了♡', emotion: 'love', created_at: Date.now() - 3600000 * 3 }
      ];
    }
  } catch(e) {}
  if (!MOCK.visitors) MOCK.visitors = { count: 1247, today: 23, updated_at: Date.now() };
  if (!MOCK.posts) MOCK.posts = [];
  // 记录本次在线
  const sid = localStorage.getItem('himemiro_sid') || ('s_' + Math.random().toString(36).slice(2, 10));
  localStorage.setItem('himemiro_sid', sid);
  MOCK.online.add(sid);
  mockSave();
}

function mockSave() {
  localStorage.setItem('himemiro_mock', JSON.stringify({
    visitors: MOCK.visitors,
    posts: MOCK.posts,
    online: [...MOCK.online]
  }));
}

/* ---------- Supabase CDN 动态加载 ---------- */
async function loadSupabase() {
  if (_supabase) return _supabase;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) { mockInit(); return null; }
  return new Promise((resolve) => {
    // 注入 CDN script
    if (document.getElementById('supabase-sdk')) {
      const s = document.getElementById('supabase-sdk');
      s.onload = () => {
        _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        _initialized = true;
        resolve(_supabase);
      };
      s.onerror = () => { mockInit(); resolve(null); };
      return;
    }
    const script = document.createElement('script');
    script.id = 'supabase-sdk';
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = () => {
      _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      _initialized = true;
      resolve(_supabase);
    };
    script.onerror = () => { mockInit(); resolve(null); };
    document.head.appendChild(script);
  });
}

/* ---------- 导出 API ---------- */
export const HB = {
  // === 访客数 ===
  async getVisitors() {
    const sb = await loadSupabase();
    if (!sb) return MOCK.visitors;
    const { data } = await sb.from('visitors').select('*').maybeSingle();
    return data;
  },

  async incrementVisitors() {
    const sb = await loadSupabase();
    if (!sb) {
      MOCK.visitors.count++;
      MOCK.visitors.today++;
      MOCK.visitors.updated_at = Date.now();
      mockSave();
      return MOCK.visitors;
    }
    await sb.from('visitors').update({ count: 'count + 1', today: 'today + 1', updated_at: new Date().toISOString() });
    return HB.getVisitors();
  },

  // === 留言板 ===
  async getPosts(limit = 50) {
    const sb = await loadSupabase();
    if (!sb) return MOCK.posts.slice(0, limit);
    const { data } = await sb.from('posts').select('*').order('created_at', { ascending: false }).limit(limit);
    return data || [];
  },

  async createPost(name, content, emotion = 'happy') {
    const sb = await loadSupabase();
    if (!sb) {
      const p = { id: Date.now(), name: (name || '匿名').slice(0, 20), content: content.slice(0, 200), emotion, created_at: Date.now() };
      MOCK.posts.unshift(p);
      mockSave();
      return p;
    }
    const { data } = await sb.from('posts').insert([{ name: name.slice(0, 20), content: content.slice(0, 200), emotion }]).select();
    return data?.[0] || null;
  },

  // === 在线数（Supabase Realtime 预留） ===
  async getOnlineCount() {
    if (!SUPABASE_URL) return MOCK.online.size;
    // Supabase Presence 接口（等你跑了 migrations 再启用）
    return MOCK.online.size;
  },

  /* ---------- 模式检测 ---------- */
  isMock() { return !SUPABASE_URL || !_supabase; },
  getConfig() {
    return {
      mode: (!SUPABASE_URL || !_supabase) ? 'MOCK' : 'SUPABASE',
      hasSupabase: !!SUPABASE_URL
    };
  }
};

// 兼容全局访问（非 ES module 环境下）
window.HB = HB;
window.HB_MOCK = MOCK;
