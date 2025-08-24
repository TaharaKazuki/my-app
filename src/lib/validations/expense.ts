import { z } from 'zod'

export const expenseSchema = z.object({
  amount: z
    .number()
    .positive('金額は0より大きい値を入力してください')
    .max(9999999.99, '金額は9,999,999円以下で入力してください'),
  category_id: z
    .number()
    .int()
    .min(1, 'カテゴリを選択してください')
    .max(9, '無効なカテゴリです'),
  date: z
    .date({
      message: '有効な日付を入力してください',
    }),
  description: z
    .string()
    .max(500, 'メモは500文字以内で入力してください')
    .optional()
    .default(''),
})

export type ExpenseFormData = z.infer<typeof expenseSchema>