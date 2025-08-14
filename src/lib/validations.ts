import { z } from "zod"

// 支出記録フォームのバリデーションスキーマ
export const expenseFormSchema = z.object({
  amount: z
    .string()
    .min(1, "金額を入力してください")
    .refine((value) => {
      const num = parseFloat(value)
      return !isNaN(num) && num > 0
    }, "有効な金額を入力してください")
    .refine((value) => {
      const num = parseFloat(value)
      return num <= 9999999.99
    }, "金額は999万円以下で入力してください"),
  
  category_id: z
    .string()
    .min(1, "カテゴリを選択してください")
    .refine((value) => {
      const num = parseInt(value)
      return !isNaN(num) && num >= 1 && num <= 9
    }, "有効なカテゴリを選択してください"),
  
  description: z
    .string()
    .max(200, "説明は200文字以下で入力してください")
    .optional(),
  
  date: z
    .string()
    .min(1, "日付を選択してください")
    .refine((dateString) => {
      const date = new Date(dateString)
      const today = new Date()
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(today.getFullYear() - 1)
      
      return date <= today && date >= oneYearAgo
    }, "日付は今日から1年前の範囲で選択してください")
})

export type ExpenseFormData = z.infer<typeof expenseFormSchema>

// 支出データの変換用関数
export function transformExpenseFormData(data: ExpenseFormData) {
  return {
    amount: parseFloat(data.amount),
    category_id: parseInt(data.category_id),
    description: data.description || null,
    date: data.date
  }
}

// カテゴリバリデーション
export const categorySchema = z.object({
  id: z.number().min(1).max(9),
  name: z.string(),
  slug: z.string(),
  icon: z.string(),
  order_index: z.number(),
  created_at: z.string()
})

// ユーザーバリデーション
export const userSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  created_at: z.string(),
  updated_at: z.string()
})