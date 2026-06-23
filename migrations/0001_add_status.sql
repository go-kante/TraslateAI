-- words テーブルに学習状態を追加
-- learning  = 学習単語欄（クイズ対象）
-- mastered  = 理解済み単語欄
ALTER TABLE words ADD COLUMN status TEXT NOT NULL DEFAULT 'learning';

-- 既存データはすべて学習単語として扱う（DEFAULT により自動付与済み）
-- 絞り込み高速化のためのインデックス
CREATE INDEX IF NOT EXISTS idx_words_user_status ON words (user_id, status, created_at);
