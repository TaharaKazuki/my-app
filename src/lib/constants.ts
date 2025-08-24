import { ExpenseCategory, Category } from '@/types'

export const categories = [
  { id: 1, name: '食費', slug: 'food', icon: '🍔' },
  { id: 2, name: '日用品', slug: 'daily-needs', icon: '🛍️' },
  { id: 3, name: '交通費', slug: 'transportation', icon: '🚗' },
  { id: 4, name: '娯楽', slug: 'entertainment', icon: '🎉' },
  { id: 5, name: '衣服・美容', slug: 'clothing-beauty', icon: '👔' },
  { id: 6, name: '医療・健康', slug: 'health', icon: '🏥' },
  { id: 7, name: '住居費', slug: 'housing', icon: '🏠' },
  { id: 8, name: '通信費', slug: 'communication', icon: '📱' },
  { id: 9, name: 'その他', slug: 'other', icon: '💡' },
]

export const EXPENSE_CATEGORIES: Array<Pick<Category, 'id' | 'name' | 'icon' | 'slug'>> = [
  { id: 1, name: '食費', slug: 'food', icon: '🍔' },
  { id: 2, name: '日用品', slug: 'daily-needs', icon: '🛍️' },
  { id: 3, name: '交通費', slug: 'transportation', icon: '🚗' },
  { id: 4, name: '娯楽', slug: 'entertainment', icon: '🎉' },
  { id: 5, name: '衣服・美容', slug: 'clothing-beauty', icon: '👔' },
  { id: 6, name: '医療・健康', slug: 'health', icon: '🏥' },
  { id: 7, name: '住居費', slug: 'housing', icon: '🏠' },
  { id: 8, name: '通信費', slug: 'communication', icon: '📱' },
  { id: 9, name: 'その他', slug: 'other', icon: '💡' },
]

export const EXPENSE_CATEGORY_NAMES: ExpenseCategory[] = [
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
  '食費': '🍔',
  '日用品': '🛍️',
  '交通費': '🚗',
  '娯楽': '🎉',
  '衣服・美容': '👔',
  '医療・健康': '🏥',
  '住居費': '🏠',
  '通信費': '📱',
  'その他': '💡',
}

// カテゴリをIDで検索するヘルパー関数
export function getCategoryById(id: number): Pick<Category, 'id' | 'name' | 'icon' | 'slug'> | undefined {
  return EXPENSE_CATEGORIES.find(category => category.id === id)
}

// カテゴリを名前で検索するヘルパー関数  
export function getCategoryByName(name: ExpenseCategory): Pick<Category, 'id' | 'name' | 'icon' | 'slug'> | undefined {
  return EXPENSE_CATEGORIES.find(category => category.name === name)
}