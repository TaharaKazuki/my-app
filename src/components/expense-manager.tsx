'use client'

import { useState, useCallback, useOptimistic, useEffect, startTransition } from 'react'
import { toast } from 'sonner'
import { ExpenseList } from '@/components/expense-list'
import { ExpenseEditDialog } from '@/components/expense-edit-dialog'
import { ExpenseDeleteDialog } from '@/components/expense-delete-dialog'
import { updateExpense, deleteExpense } from '@/lib/api'
import type { ExpenseWithCategory } from '@/types/expense'
import type { z } from 'zod'
import type { expenseSchema } from '@/lib/validations/expense'

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseManagerProps {
  initialExpenses: ExpenseWithCategory[]
  isLoading?: boolean
}

export function ExpenseManager({ 
  initialExpenses, 
  isLoading = false 
}: ExpenseManagerProps) {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [editingExpense, setEditingExpense] = useState<ExpenseWithCategory | null>(null)
  const [deletingExpense, setDeletingExpense] = useState<ExpenseWithCategory | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // initialExpensesが変更されたらexpensesを更新
  useEffect(() => {
    setExpenses(initialExpenses)
  }, [initialExpenses])

  // オプティミスティックUI用のstate
  const [optimisticExpenses, updateOptimisticExpenses] = useOptimistic(
    expenses,
    (state, action: { type: 'update' | 'delete'; expense: ExpenseWithCategory }) => {
      switch (action.type) {
        case 'update':
          return state.map((e) => 
            e.id === action.expense.id ? action.expense : e
          )
        case 'delete':
          return state.filter((e) => e.id !== action.expense.id)
        default:
          return state
      }
    }
  )

  const handleEdit = useCallback((expense: ExpenseWithCategory) => {
    setEditingExpense(expense)
    setIsEditDialogOpen(true)
  }, [])

  const handleDelete = useCallback((expense: ExpenseWithCategory) => {
    setDeletingExpense(expense)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleEditSubmit = async (data: ExpenseFormData) => {
    if (!editingExpense) return


    const submitData = {
      ...data,
      date: data.date.toISOString().split('T')[0],
    }


    const updatedExpense: ExpenseWithCategory = {
      ...editingExpense,
      ...submitData,
      updated_at: new Date().toISOString(),
    }

    // オプティミスティックアップデートをtransitionでラップ
    startTransition(() => {
      updateOptimisticExpenses({ type: 'update', expense: updatedExpense })
    })

    try {
      const result = await updateExpense(editingExpense.id, submitData)
      
      // 成功時は実際のデータで更新
      setExpenses((prev) => 
        prev.map((e) => e.id === editingExpense.id ? result : e)
      )
      
      toast.success('支出を更新しました')
      setIsEditDialogOpen(false)
      setEditingExpense(null)
    } catch (error) {
      console.error('Update failed:', error)
      // エラー時は元に戻す
      setExpenses((prev) => [...prev])
      toast.error('支出の更新に失敗しました')
      throw error
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return

    // オプティミスティックアップデートをtransitionでラップ
    startTransition(() => {
      updateOptimisticExpenses({ type: 'delete', expense: deletingExpense })
    })

    try {
      await deleteExpense(deletingExpense.id)
      
      // 成功時は実際にデータを削除
      setExpenses((prev) => 
        prev.filter((e) => e.id !== deletingExpense.id)
      )
      
      toast.success('支出を削除しました')
      setIsDeleteDialogOpen(false)
      setDeletingExpense(null)
    } catch {
      // エラー時は元に戻す
      setExpenses((prev) => [...prev])
      toast.error('支出の削除に失敗しました')
    }
  }

  return (
    <>
      <ExpenseList
        expenses={optimisticExpenses}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ExpenseEditDialog
        expense={editingExpense}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditSubmit}
      />

      <ExpenseDeleteDialog
        expense={deletingExpense}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}