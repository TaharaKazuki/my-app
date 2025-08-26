'use client'

import { formatCurrency } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar } from 'lucide-react'

interface PeriodComparisonProps {
  current: number
  previous: number
  percentageChange: number
  dateRange: 'today' | 'week' | 'month' | 'custom'
}

export function PeriodComparison({ current, previous, percentageChange, dateRange }: PeriodComparisonProps) {
  const isIncrease = percentageChange > 0
  const periodLabel = dateRange === 'today' ? '前日' : dateRange === 'week' ? '先週' : '先月'
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 現在期間 */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">
              {dateRange === 'today' ? '今日' : dateRange === 'week' ? '今週' : '今月'}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(current)}
          </p>
        </div>

        {/* 前期間 */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">
              {periodLabel}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(previous)}
          </p>
        </div>

        {/* 変化率 */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">変化率</span>
          </div>
          <div className="flex items-center gap-2">
            {isIncrease ? (
              <ArrowUpRight className="h-5 w-5 text-red-500" />
            ) : (
              <ArrowDownRight className="h-5 w-5 text-green-500" />
            )}
            <span className={`text-2xl font-bold ${isIncrease ? 'text-red-500' : 'text-green-500'}`}>
              {Math.abs(percentageChange).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* 分析コメント */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          {isIncrease ? (
            <>
              <span className="font-semibold">{periodLabel}と比べて支出が増加しています。</span>
              <br />
              差額: <span className="font-bold text-red-600">+{formatCurrency(current - previous)}</span>
            </>
          ) : percentageChange === 0 ? (
            <>
              <span className="font-semibold">{periodLabel}と同じ支出額です。</span>
            </>
          ) : (
            <>
              <span className="font-semibold">{periodLabel}と比べて支出が減少しています。</span>
              <br />
              差額: <span className="font-bold text-green-600">-{formatCurrency(previous - current)}</span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}