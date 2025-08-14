// 完全なデータベースセットアップ用SQLスクリプト
// 使い方: node scripts/setup-database-complete.js

const sql = `
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,  -- Clerk user ID
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES public.categories(id),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, date DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE
  ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_expenses_updated_at ON public.expenses;
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE
  ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Categories are readable by all" ON public.categories;
DROP POLICY IF EXISTS "Users can view own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can insert own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can update own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete own expenses" ON public.expenses;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (id = current_setting('request.headers')::json->>'x-user-id');

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT
  WITH CHECK (id = current_setting('request.headers')::json->>'x-user-id');

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (id = current_setting('request.headers')::json->>'x-user-id')
  WITH CHECK (id = current_setting('request.headers')::json->>'x-user-id');

-- RLS Policies for categories table (read-only for all authenticated users)
CREATE POLICY "Categories are readable by all" ON public.categories
  FOR SELECT
  USING (true);

-- RLS Policies for expenses table
CREATE POLICY "Users can view own expenses" ON public.expenses
  FOR SELECT
  USING (user_id = current_setting('request.headers')::json->>'x-user-id');

CREATE POLICY "Users can insert own expenses" ON public.expenses
  FOR INSERT
  WITH CHECK (user_id = current_setting('request.headers')::json->>'x-user-id');

CREATE POLICY "Users can update own expenses" ON public.expenses
  FOR UPDATE
  USING (user_id = current_setting('request.headers')::json->>'x-user-id')
  WITH CHECK (user_id = current_setting('request.headers')::json->>'x-user-id');

CREATE POLICY "Users can delete own expenses" ON public.expenses
  FOR DELETE
  USING (user_id = current_setting('request.headers')::json->>'x-user-id');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.categories TO anon, authenticated;
GRANT ALL ON public.expenses TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.categories_id_seq TO anon, authenticated;

-- Insert category master data
INSERT INTO public.categories (name, slug, icon, order_index) VALUES
  ('食費', 'food', '🍔', 1),
  ('日用品', 'daily-needs', '🛍️', 2),
  ('交通費', 'transportation', '🚗', 3),
  ('娯楽', 'entertainment', '🎉', 4),
  ('衣服・美容', 'clothing-beauty', '👔', 5),
  ('医療・健康', 'health', '🏥', 6),
  ('住居費', 'housing', '🏠', 7),
  ('通信費', 'communication', '📱', 8),
  ('その他', 'other', '💡', 9)
ON CONFLICT (name) DO NOTHING;
`;

console.log('📋 以下のSQLをSupabaseダッシュボードのSQL Editorで実行してください:');
console.log('========================================');
console.log(sql);
console.log('========================================');
console.log('\n📌 実行手順:');
console.log('1. Supabaseダッシュボードにログイン');
console.log('2. SQL Editor タブを開く');
console.log('3. 上記のSQLをコピー＆ペースト');
console.log('4. "Run" ボタンをクリック');
console.log('\n✅ 実行後、以下のテーブルが作成されます:');
console.log('- users テーブル（Clerkユーザー情報）');
console.log('- categories テーブル（9種類の支出カテゴリ）');
console.log('- expenses テーブル（支出記録）');
console.log('- RLSポリシー（ユーザー別データ分離）');