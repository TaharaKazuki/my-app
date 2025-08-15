'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseForm } from '@/components/forms/expense-form'
import { ExpenseManager } from '@/components/expense-manager'
import { formatCurrency } from '@/lib/utils'
import { expenseApi } from '@/lib/api'
import { DashboardCardSkeleton, FormSkeleton } from '@/components/ui/skeleton'
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
      await expenseApi.create(data)
      
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
    <div className="container mx-auto px-4 py-4 lg:py-8 max-w-7xl">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">ダッシュボード</h1>
      
      {/* モバイル: 縦並び, デスクトップ: 横並び */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        {/* 支出記録フォーム */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          {!isMounted ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-blue-600 rounded" />
                  支出を記録
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormSkeleton />
              </CardContent>
            </Card>
          ) : (
            <ExpenseForm 
              onSubmit={handleExpenseSubmit}
              isLoading={isSubmitting}
            />
          )}
        </div>

        {/* サマリーカードと支出履歴 */}
        <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
          {/* サマリーカード */}
          {!isMounted || isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <DashboardCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">今週の支出</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl lg:text-2xl font-bold">{formatCurrency(summary.weeklyTotal)}</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">今月の支出</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl lg:text-2xl font-bold">{formatCurrency(summary.monthlyTotal)}</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">登録件数</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl lg:text-2xl font-bold">{summary.totalCount}件</p>
                </CardContent>
              </Card>
            </div>
          )}
          
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