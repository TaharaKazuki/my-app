'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseForm } from '@/components/forms/expense-form'
import { formatCurrency } from '@/lib/utils'
import type { ExpenseSubmitData } from '@/types/expense'

interface DashboardClientProps {
  userId: string
}

export function DashboardClient({ userId }: DashboardClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleExpenseSubmit = async (data: ExpenseSubmitData) => {
    setIsSubmitting(true)
    try {
      // TODO: API呼び出しを実装
      console.log('Submitting expense:', { ...data, user_id: userId })
      
      // 仮の遅延を追加してローディング状態をテスト
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Expense submitted successfully')
    } catch (error) {
      console.error('Failed to submit expense:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

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
                <p className="text-2xl font-bold">{formatCurrency(0)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">今月の支出</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(0)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">登録件数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0件</p>
              </CardContent>
            </Card>
          </div>
          
          {/* 支出履歴 */}
          <Card>
            <CardHeader>
              <CardTitle>最近の支出</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">まだ支出記録がありません。</p>
                <p className="text-sm text-muted-foreground mt-1">
                  左側のフォームから支出を記録してみましょう。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}