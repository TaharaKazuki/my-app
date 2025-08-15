'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ExpenseListSkeleton } from '@/components/ui/skeleton'
import { getCategoryById } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import type { ExpenseWithCategory } from '@/types/expense'

interface ExpenseListProps {
  expenses: ExpenseWithCategory[]
  isLoading?: boolean
  onEdit?: (expense: ExpenseWithCategory) => void
  onDelete?: (expense: ExpenseWithCategory) => void
}

export function ExpenseList({ 
  expenses, 
  isLoading = false,
  onEdit,
  onDelete 
}: ExpenseListProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (isLoading) {
    return <ExpenseListSkeleton />
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-muted-foreground">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium">支出履歴がありません</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            支出を記録すると、ここに表示されます
          </p>
        </CardContent>
      </Card>
    )
  }

  // 日付でグループ化
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = format(new Date(expense.date), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(expense)
    return acc
  }, {} as Record<string, ExpenseWithCategory[]>)

  // 日付降順でソート
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>支出履歴</CardTitle>
        <CardDescription>
          最近の支出を確認できます
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {sortedDates.map((date) => (
            <div key={date}>
              <div className="bg-muted/50 px-6 py-2">
                <p className="text-sm font-medium">
                  {isMounted 
                    ? format(new Date(date), 'M月d日（E）', { locale: ja })
                    : format(new Date(date), 'M/d')
                  }
                </p>
              </div>
              <div className="divide-y">
                {groupedExpenses[date].map((expense) => {
                  // ExpenseWithCategoryには既にcategoriesが含まれている
                  const category = expense.categories || getCategoryById(expense.category_id)
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {category?.icon || '💰'}
                        </div>
                        <div>
                          <p className="font-medium">
                            {category?.name || 'その他'}
                          </p>
                          {expense.description && (
                            <p className="text-sm text-muted-foreground">
                              {expense.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-semibold text-lg">
                          {formatCurrency(expense.amount)}
                        </p>
                        {(onEdit || onDelete) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">メニューを開く</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {onEdit && (
                                <DropdownMenuItem
                                  onClick={() => onEdit(expense)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  編集
                                </DropdownMenuItem>
                              )}
                              {onDelete && (
                                <DropdownMenuItem
                                  onClick={() => onDelete(expense)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  削除
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}