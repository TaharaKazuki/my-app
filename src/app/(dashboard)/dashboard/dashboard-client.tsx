'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseForm } from '@/components/forms/expense-form'
import { formatCurrency, cn } from '@/lib/utils'
import { expenseApi } from '@/lib/api'
import { LoadingSpinner } from '@/components/ui/loading'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { ExpenseSubmitData, ExpenseWithCategory } from '@/types/expense'

interface DashboardClientProps {
  userId: string
}

export function DashboardClient({ userId }: DashboardClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 支出一覧の取得
  const fetchExpenses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await expenseApi.getAll({ limit: 10 })
      setExpenses(response.data)
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
      setError('支出データの取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  // コンポーネント初期化時に支出一覧を取得
  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleExpenseSubmit = async (data: ExpenseSubmitData) => {
    setIsSubmitting(true)
    try {
      console.log('Submitting expense data:', data)
      const result = await expenseApi.create(data)
      console.log('Expense created:', result)
      
      // 支出一覧を再取得して最新の状態に更新
      await fetchExpenses()
      
    } catch (error) {
      console.error('Failed to submit expense:', error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
      }
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  // サマリー計算
  const calculateSummary = () => {
    const now = new Date()
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const weeklyTotal = expenses
      .filter(expense => new Date(expense.date) >= startOfWeek)
      .reduce((sum, expense) => sum + expense.amount, 0)

    const monthlyTotal = expenses
      .filter(expense => new Date(expense.date) >= startOfMonth)
      .reduce((sum, expense) => sum + expense.amount, 0)

    return {
      weeklyTotal,
      monthlyTotal,
      totalCount: expenses.length
    }
  }

  const summary = calculateSummary()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ダッシュボード</h1>
      
      <div className="grid gap-6 lg:grid-cols-12">
        {/* 支出記録フォーム */}
        <div className="lg:col-span-4">
          <ExpenseForm 
            onSubmit={handleExpenseSubmit}
            isLoading={isSubmitting}
          />
        </div>

        {/* サマリーカードと支出履歴 */}
        <div className="lg:col-span-8 space-y-6">
          {/* サマリーカード */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">今週の支出</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(summary.weeklyTotal)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">今月の支出</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(summary.monthlyTotal)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">登録件数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{summary.totalCount}件</p>
              </CardContent>
            </Card>
          </div>
          
          {/* 支出履歴 */}
          <Card>
            <CardHeader>
              <CardTitle>最近の支出</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-destructive">{error}</p>
                  <button 
                    onClick={fetchExpenses}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    再試行
                  </button>
                </div>
              ) : expenses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">まだ支出記録がありません。</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    左側のフォームから支出を記録してみましょう。
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{expense.categories.icon}</div>
                        <div>
                          <p className="font-medium">{expense.categories.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{format(new Date(expense.date), 'M月d日', { locale: ja })}</span>
                            {expense.description && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[200px]">{expense.description}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(expense.amount)}</p>
                      </div>
                    </div>
                  ))}
                  {expenses.length >= 10 && (
                    <div className="text-center pt-4">
                      <p className="text-sm text-muted-foreground">
                        最新10件を表示中
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}