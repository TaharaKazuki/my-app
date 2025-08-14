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