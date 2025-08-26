'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { categories } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import type { ExpenseWithCategory } from '@/types/expense'

interface CategoryPieChartProps {
  expenses: ExpenseWithCategory[]
}

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

export function CategoryPieChart({ expenses }: CategoryPieChartProps) {
  // カテゴリ別に集計
  const categoryTotals = expenses.reduce((acc, expense) => {
    const categoryId = expense.category_id
    if (!acc[categoryId]) {
      acc[categoryId] = 0
    }
    acc[categoryId] += expense.amount
    return acc
  }, {} as Record<number, number>)

  // グラフ用データ作成
  const data = Object.entries(categoryTotals).map(([categoryId, total]) => {
    const category = categories.find(c => c.id === parseInt(categoryId))
    return {
      name: category ? `${category.icon} ${category.name}` : '不明',
      value: total,
      percentage: (total / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100
    }
  }).sort((a, b) => b.value - a.value)

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { percentage: number } }> }) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-gray-600">
            {payload[0].payload.percentage.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null // 5%未満は表示しない

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500">
        データがありません
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={CustomLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value, entry) => (
            <span className="text-sm">
              {value} ({formatCurrency(entry.payload.value)})
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}