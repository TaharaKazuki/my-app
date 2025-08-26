'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { categories } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { format, startOfDay, endOfDay, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { ExpenseWithCategory } from '@/types/expense'

interface CategoryBarChartProps {
  expenses: ExpenseWithCategory[]
  period: 'daily' | 'weekly' | 'monthly'
}

export function CategoryBarChart({ expenses, period }: CategoryBarChartProps) {
  // 期間ごとのデータを生成
  const generateChartData = () => {
    if (expenses.length === 0) return []

    // 日付の範囲を取得
    const dates = expenses.map(e => new Date(e.date))
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))

    let intervals: Date[] = []
    let formatStr = ''

    switch (period) {
      case 'daily':
        intervals = eachDayOfInterval({ start: minDate, end: maxDate })
        formatStr = 'M/d'
        break
      case 'weekly':
        intervals = eachWeekOfInterval({ start: minDate, end: maxDate }, { weekStartsOn: 1 })
        formatStr = 'M/d週'
        break
      case 'monthly':
        intervals = eachMonthOfInterval({ start: minDate, end: maxDate })
        formatStr = 'yyyy年M月'
        break
    }

    // 各期間のデータを集計
    const data = intervals.map(interval => {
      let periodStart: Date, periodEnd: Date
      
      switch (period) {
        case 'daily':
          periodStart = startOfDay(interval)
          periodEnd = endOfDay(interval)
          break
        case 'weekly':
          periodStart = startOfWeek(interval, { weekStartsOn: 1 })
          periodEnd = endOfWeek(interval, { weekStartsOn: 1 })
          break
        case 'monthly':
          periodStart = startOfMonth(interval)
          periodEnd = endOfMonth(interval)
          break
      }

      const periodExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date)
        return expenseDate >= periodStart && expenseDate <= periodEnd
      })

      // カテゴリ別に集計
      const categoryTotals: Record<string, number> = {}
      categories.forEach(category => {
        const total = periodExpenses
          .filter(e => e.category_id === category.id)
          .reduce((sum, e) => sum + e.amount, 0)
        if (total > 0) {
          categoryTotals[category.name] = total
        }
      })

      return {
        date: format(interval, formatStr, { locale: ja }),
        ...categoryTotals,
        total: periodExpenses.reduce((sum, e) => sum + e.amount, 0)
      }
    }).filter(d => d.total > 0) // 支出がない期間は除外

    return data
  }

  const data = generateChartData()

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0)
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between gap-4 text-sm">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-semibold">{formatCurrency(entry.value)}</span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 flex justify-between font-bold">
            <span>合計:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500">
        データがありません
      </div>
    )
  }

  // 使用されているカテゴリを取得
  const usedCategories = new Set<string>()
  data.forEach(d => {
    Object.keys(d).forEach(key => {
      if (key !== 'date' && key !== 'total') {
        usedCategories.add(key)
      }
    })
  })

  const COLORS = [
    '#f59e0b', // amber-500
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
    '#64748b', // slate-500
  ]

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          angle={period === 'monthly' ? -45 : 0}
          textAnchor={period === 'monthly' ? 'end' : 'middle'}
          height={period === 'monthly' ? 80 : 30}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="rect"
        />
        {Array.from(usedCategories).map((category, index) => (
          <Bar
            key={category}
            dataKey={category}
            stackId="a"
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}