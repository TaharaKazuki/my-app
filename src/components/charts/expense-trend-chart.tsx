'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { format, startOfDay, endOfDay, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { ExpenseWithCategory } from '@/types/expense'

interface ExpenseTrendChartProps {
  expenses: ExpenseWithCategory[]
  period: 'daily' | 'weekly' | 'monthly'
  dateRange?: 'today' | 'week' | 'month' | 'custom'
}

export function ExpenseTrendChart({ expenses, period, dateRange }: ExpenseTrendChartProps) {
  const generateChartData = () => {
    if (expenses.length === 0) return []

    // 日付の範囲を取得
    const dates = expenses.map(e => new Date(e.date))
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))

    let intervals: Date[] = []
    let formatStr = ''

    // 期間に応じた間隔とフォーマットを設定
    switch (period) {
      case 'daily':
        intervals = eachDayOfInterval({ start: minDate, end: maxDate })
        if (dateRange === 'today') {
          // 今日の場合、時間別に表示
          const hourlyIntervals: Date[] = []
          for (let hour = 0; hour < 24; hour++) {
            const date = new Date(minDate)
            date.setHours(hour, 0, 0, 0)
            hourlyIntervals.push(date)
          }
          intervals = hourlyIntervals
          formatStr = 'HH:mm'
        } else if (dateRange === 'week') {
          formatStr = 'M/d (eee)' // 曜日付き
        } else {
          formatStr = 'M/d'
        }
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
      
      if (period === 'daily' && dateRange === 'today') {
        // 時間単位の集計
        periodStart = new Date(interval)
        periodEnd = new Date(interval)
        periodEnd.setHours(periodStart.getHours(), 59, 59, 999)
      } else {
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
      }

      const periodExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date)
        return expenseDate >= periodStart && expenseDate <= periodEnd
      })

      const total = periodExpenses.reduce((sum, e) => sum + e.amount, 0)

      return {
        date: format(interval, formatStr, { locale: ja }),
        amount: total,
        count: periodExpenses.length
      }
    })

    // 支出がない期間も0として表示（連続性のため）
    return data
  }

  const data = generateChartData()

  const CustomTooltip = ({ active, payload, label }: { 
    active?: boolean
    payload?: Array<{ value: number; payload: { count: number } }>
    label?: string 
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(payload[0].value)}
            </div>
            <div className="text-sm text-gray-600">
              支出件数: {payload[0].payload.count}件
            </div>
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

  // 最大値を計算してY軸の範囲を決定
  const maxAmount = Math.max(...data.map(d => d.amount))
  const yAxisMax = Math.ceil(maxAmount / 10000) * 10000 || 10000

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: period === 'monthly' ? 80 : 50 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          angle={period === 'monthly' ? -45 : period === 'weekly' ? -30 : 0}
          textAnchor={period === 'monthly' ? 'end' : period === 'weekly' ? 'end' : 'middle'}
          height={period === 'monthly' ? 80 : period === 'weekly' ? 60 : 30}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
          domain={[0, yAxisMax]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="line"
        />
        <Line
          type="monotone"
          dataKey="amount"
          name="支出額"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}