'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseForm } from '@/components/forms/expense-form'
import { ExpenseManager } from '@/components/expense-manager'
import { formatCurrency } from '@/lib/utils'
import { expenseApi } from '@/lib/api'
import type { ExpenseSubmitData, ExpenseWithCategory } from '@/types/expense'

interface DashboardClientProps {
  userId: string
}

export function DashboardClient({ }: DashboardClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

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
    setIsMounted(true)
    fetchExpenses()
  }, [])

  const handleExpenseSubmit = async (data: ExpenseSubmitData) => {
    setIsSubmitting(true)
    try {
      const result = await expenseApi.create(data)
      
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
          
          {/* 支出履歴 - ExpenseManagerコンポーネントを使用 */}
          {isMounted && (
            <ExpenseManager 
              initialExpenses={expenses}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  )
}