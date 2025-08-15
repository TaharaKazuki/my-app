'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { getCategoryById } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import type { ExpenseWithCategory } from '@/types/expense'

interface ExpenseDeleteDialogProps {
  expense: ExpenseWithCategory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
}

export function ExpenseDeleteDialog({
  expense,
  open,
  onOpenChange,
  onConfirm,
}: ExpenseDeleteDialogProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!expense) return null

  const category = expense.categories || getCategoryById(expense.category_id)

  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>支出を削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            以下の支出を削除します。この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4 rounded-lg border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">日付</span>
            <span className="font-medium">
              {isMounted 
                ? format(new Date(expense.date), 'yyyy年M月d日', { locale: ja })
                : format(new Date(expense.date), 'yyyy/M/d')
              }
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">カテゴリ</span>
            <span className="font-medium flex items-center">
              <span className="mr-1">{category?.icon}</span>
              {category?.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">金額</span>
            <span className="font-semibold text-lg">
              {formatCurrency(expense.amount)}
            </span>
          </div>
          {expense.description && (
            <div className="pt-2 border-t">
              <span className="text-sm text-muted-foreground">メモ: </span>
              <span className="text-sm">{expense.description}</span>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}