-- Drop existing tables and recreate with correct schema
-- WARNING: This will delete all existing data

-- Drop triggers first
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_expenses_updated_at ON public.expenses;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS public.expenses;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.users;

-- Drop indexes (they will be dropped with tables, but just to be safe)
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_expenses_user_id;
DROP INDEX IF EXISTS idx_expenses_date;
DROP INDEX IF EXISTS idx_expenses_category;
DROP INDEX IF EXISTS idx_expenses_user_date;