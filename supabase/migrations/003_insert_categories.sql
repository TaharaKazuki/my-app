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