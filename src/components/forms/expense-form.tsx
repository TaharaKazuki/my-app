'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingButton } from '@/components/ui/loading'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { expenseFormSchema, transformExpenseFormData, type ExpenseFormData } from '@/lib/validations'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import { formatCurrency, cn } from '@/lib/utils'
import type { ExpenseSubmitData } from '@/types/expense'

interface ExpenseFormProps {
  onSubmit?: (data: ExpenseSubmitData) => Promise<void>
  defaultValues?: Partial<ExpenseFormData>
  isLoading?: boolean
}

export function ExpenseForm({ onSubmit, defaultValues, isLoading = false }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: '',
      category_id: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      ...defaultValues
    }
  })

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = form
  const watchAmount = watch('amount')

  const handleFormSubmit = async (data: ExpenseFormData) => {
    if (!onSubmit) return
    
    setIsSubmitting(true)
    try {
      const transformedData = transformExpenseFormData(data)
      await onSubmit(transformedData)
      
      toast.success('支出を記録しました', {
        description: `${formatCurrency(transformedData.amount)} - ${EXPENSE_CATEGORIES.find(cat => cat.id === transformedData.category_id)?.name}`,
      })
      
      // フォームをリセット（日付は今日の日付を保持）
      reset({
        amount: '',
        category_id: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd')
      })
    } catch (error) {
      console.error('Expense submission error:', error)
      toast.error('支出の記録に失敗しました', {
        description: 'しばらく待ってから再度お試しください'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // リアルタイムプレビュー用の金額表示
  const previewAmount = watchAmount ? parseFloat(watchAmount) : 0

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          支出を記録
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* 金額入力 */}
          <div className="space-y-2">
            <Label htmlFor="amount">金額 *</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="1"
                min="1"
                max="9999999"
                placeholder="1000"
                className="pl-8"
                {...register('amount')}
              />
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
            {previewAmount > 0 && (
              <p className="text-sm text-muted-foreground">
                {formatCurrency(previewAmount)}
              </p>
            )}
          </div>

          {/* カテゴリ選択 */}
          <div className="space-y-2">
            <Label htmlFor="category_id">カテゴリ *</Label>
            <Select
              value={watch('category_id')}
              onValueChange={(value) => setValue('category_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-sm text-destructive">{errors.category_id.message}</p>
            )}
          </div>

          {/* 日付選択 */}
          <div className="space-y-2">
            <Label htmlFor="date">日付 *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watch('date') && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch('date') ? (
                    format(new Date(watch('date')), 'yyyy年M月d日', { locale: ja })
                  ) : (
                    <span>日付を選択</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watch('date') ? new Date(watch('date')) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setValue('date', format(date, 'yyyy-MM-dd'))
                    }
                  }}
                  disabled={(date) => {
                    const today = new Date()
                    const oneYearAgo = new Date()
                    oneYearAgo.setFullYear(today.getFullYear() - 1)
                    return date > today || date < oneYearAgo
                  }}
                  locale={ja}
                  formatters={{
                    formatCaption: (date) => format(date, 'yyyy年M月', { locale: ja })
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* 説明（オプション） */}
          <div className="space-y-2">
            <Label htmlFor="description">説明 (任意)</Label>
            <Textarea
              id="description"
              placeholder="メモや詳細を入力..."
              rows={3}
              maxLength={200}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {watch('description')?.length || 0}/200文字
            </p>
          </div>

          {/* 送信ボタン */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <LoadingButton>記録中...</LoadingButton>
            ) : (
              '支出を記録'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}