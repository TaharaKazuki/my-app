// 支出フォームから送信されるデータの型
export interface ExpenseSubmitData {
  amount: number
  category_id: number
  description: string | null
  date: string
}

// APIレスポンスやDBから取得する支出データの完全な型
export interface ExpenseData extends ExpenseSubmitData {
  id: string
  user_id: string
  created_at: string
  updated_at: string
}

// カテゴリ情報を含む支出データ
export interface ExpenseWithCategory extends ExpenseData {
  categories: {
    id: number
    name: string
    slug: string
    icon: string
  }
}