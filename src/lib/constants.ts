import { ExpenseCategory } from '@/types'

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  '食費',
  '日用品',
  '交通費',
  '娯楽',
  '衣服・美容',
  '医療・健康',
  '住居費',
  '通信費',
  'その他',
]

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  '食費': '#3B82F6',
  '日用品': '#10B981',
  '交通費': '#F59E0B',
  '娯楽': '#EF4444',
  '衣服・美容': '#8B5CF6',
  '医療・健康': '#EC4899',
  '住居費': '#6B7280',
  '通信費': '#06B6D4',
  'その他': '#71717A',
}

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  '食費': 'utensils',
  '日用品': 'shopping-bag',
  '交通費': 'train',
  '娯楽': 'gamepad-2',
  '衣服・美容': 'shirt',
  '医療・健康': 'heart-pulse',
  '住居費': 'home',
  '通信費': 'wifi',
  'その他': 'more-horizontal',
}