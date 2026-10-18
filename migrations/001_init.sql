/* =========================================================================
   Supabase SQL Migrations
   -------------------------------------------------------------------------
   在 Supabase Dashboard → SQL Editor 里逐条执行：
   ========================================================================= */

/* --- 1. 访客计数 --- */
CREATE TABLE IF NOT EXISTS visitors (
  id SERIAL PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  today INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO visitors (count, today, updated_at) VALUES (1000, 0, NOW())
ON CONFLICT DO NOTHING;

/* RLS：允许匿名读 */
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon read visitors" ON visitors FOR SELECT USING (true);
CREATE POLICY "anon update visitors" ON visitors FOR UPDATE USING (true);

/* --- 2. 留言板 --- */
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '匿名',
  content TEXT NOT NULL CHECK (char_length(content) <= 200),
  emotion TEXT DEFAULT 'happy',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "anon insert posts" ON posts FOR INSERT WITH CHECK (true);

/* --- 3. 每日重置（可选：每天 00:00 把 today 清零）--- */
-- 这个需要 Supabase Cron，暂时忽略
-- 也可以在前端做：每天第一次访问时 update today=0

/* --- 4. 在线数（Realtime Presence）--- */
-- Supabase Realtime 需要单独在 Dashboard → Replication → Supabase_realtime 里
-- 勾选 posts 和 presence 表（或用 Broadcast channel）
-- 前端已经有 broadcast client 预留

/* --- 5. 常用 Index --- */
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
