export type ExpenseCategory = 
  | '食費'
  | '日用品'
  | '交通費'
  | '娯楽'
  | '衣服・美容'
  | '医療・健康'
  | '住居費'
  | '通信費'
  | 'その他'

export interface Category {
  id: number
  name: ExpenseCategory
  slug: string
  icon: string
  order_index: number
  created_at: string
}

export interface Expense {
  id: string
  user_id: string
  category_id: number
  amount: number
  description?: string
  date: string
  created_at: string
  updated_at: string
}

export interface ExpenseWithCategory extends Expense {
  categories?: {
    id: number
    name: string
    slug: string
    icon: string
  }
}

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export type PlanType = 'free' | 'premium'

export interface DashboardSummary {
  weeklyTotal: number
  monthlyTotal: number
  categoryTotals?: Record<ExpenseCategory, number>
}

export type PeriodType = 'daily' | 'weekly' | 'monthly'

export interface PeriodData {
  startDate: Date
  endDate: Date
  total: number
  categoryData: Record<ExpenseCategory, number>
  previousPeriodTotal?: number
  dailyAverage?: number
}