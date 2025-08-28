'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CategoryPieChart } from '@/components/charts/category-pie-chart'
import { CategoryBarChart } from '@/components/charts/category-bar-chart'
import { PeriodComparison } from '@/components/charts/period-comparison'
import { ExpenseTrendChart } from '@/components/charts/expense-trend-chart'
import { expenseApi } from '@/lib/api'
import { Crown, Calendar, TrendingUp, PieChart, BarChart3, LineChart } from 'lucide-react'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths } from 'date-fns'
import type { ExpenseWithCategory } from '@/types/expense'

interface AnalyticsClientProps {
  userId: string
}

type PeriodType = 'daily' | 'weekly' | 'monthly'
type DateRange = 'today' | 'week' | 'month' | 'custom'

export function AnalyticsClient({ }: AnalyticsClientProps) {
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<PeriodType>('monthly')
  const [dateRange, setDateRange] = useState<DateRange>('month')
  const [comparisonData, setComparisonData] = useState<{
    current: number
    previous: number
    percentageChange: number
  } | null>(null)

  // 日付範囲に応じた推奨される集計単位を取得
  const getRecommendedPeriod = (range: DateRange): PeriodType => {
    switch (range) {
      case 'today':
        return 'daily' // 今日を選んだら日次表示
      case 'week':
        return 'daily' // 今週を選んだら日次表示
      case 'month':
        return 'weekly' // 今月を選んだら週次表示
      default:
        return 'monthly'
    }
  }

  const getDateRange = (range: DateRange): { start: Date; end: Date } => {
    const now = new Date()
    switch (range) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) }
      case 'week':
        // 週の開始を月曜日に設定（weekStartsOn: 1）
        return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) }
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) }
    }
  }

  const getPreviousDateRange = (range: DateRange, current: { start: Date; end: Date }): { start: Date; end: Date } => {
    switch (range) {
      case 'today':
        return { start: subDays(current.start, 1), end: subDays(current.end, 1) }
      case 'week':
        return { start: subWeeks(current.start, 1), end: subWeeks(current.end, 1) }
      case 'month':
        return { start: subMonths(current.start, 1), end: subMonths(current.end, 1) }
      default:
        return { start: subMonths(current.start, 1), end: subMonths(current.end, 1) }
    }
  }

  const fetchExpenses = async () => {
    try {
      setIsLoading(true)
      const { start, end } = getDateRange(dateRange)
      
      // デバッグ用ログ
      console.log('Current period:', {
        range: dateRange,
        start: format(start, 'yyyy-MM-dd HH:mm:ss'),
        end: format(end, 'yyyy-MM-dd HH:mm:ss')
      })
      
      // 現在期間のデータ取得
      const currentResponse = await expenseApi.getAll({
        date_from: format(start, 'yyyy-MM-dd'),
        date_to: format(end, 'yyyy-MM-dd'),
        limit: 1000 // 全データを取得
      })
      setExpenses(currentResponse.data)

      // 前期間のデータ取得
      const previousRange = getPreviousDateRange(dateRange, { start, end })
      
      console.log('Previous period:', {
        start: format(previousRange.start, 'yyyy-MM-dd HH:mm:ss'),
        end: format(previousRange.end, 'yyyy-MM-dd HH:mm:ss')
      })
      
      const previousResponse = await expenseApi.getAll({
        date_from: format(previousRange.start, 'yyyy-MM-dd'),
        date_to: format(previousRange.end, 'yyyy-MM-dd'),
        limit: 1000 // 全データを取得
      })

      // 比較データの計算
      const currentTotal = currentResponse.data.reduce((sum, exp) => sum + exp.amount, 0)
      const previousTotal = previousResponse.data.reduce((sum, exp) => sum + exp.amount, 0)
      const percentageChange = previousTotal === 0 
        ? (currentTotal > 0 ? 100 : 0)
        : ((currentTotal - previousTotal) / previousTotal) * 100

      console.log('Comparison data:', {
        currentCount: currentResponse.data.length,
        previousCount: previousResponse.data.length,
        currentTotal,
        previousTotal,
        percentageChange
      })

      setComparisonData({
        current: currentTotal,
        previous: previousTotal,
        percentageChange
      })

    } catch (error) {
      console.error('Failed to fetch expenses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange])

  const handlePeriodChange = (value: string) => {
    setPeriod(value as PeriodType)
  }

  const handleDateRangeChange = (value: string) => {
    const newDateRange = value as DateRange
    setDateRange(newDateRange)
    // 日付範囲に応じて集計単位を自動調整
    setPeriod(getRecommendedPeriod(newDateRange))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
            <Crown className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">プレミアム分析</h1>
            <p className="text-sm text-gray-600">詳細な支出分析とレポート</p>
          </div>
        </div>
      </div>

      {/* コントロール */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={dateRange} onValueChange={handleDateRangeChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="期間を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">今日</SelectItem>
            <SelectItem value="week">今週</SelectItem>
            <SelectItem value="month">今月</SelectItem>
          </SelectContent>
        </Select>

        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <BarChart3 className="h-4 w-4 mr-2" />
            <SelectValue placeholder="集計単位" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">日次</SelectItem>
            <SelectItem value="weekly">週次</SelectItem>
            <SelectItem value="monthly">月次</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 前期間比較 */}
      {comparisonData && (
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              前期間比較
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PeriodComparison
              current={comparisonData.current}
              previous={comparisonData.previous}
              percentageChange={comparisonData.percentageChange}
              dateRange={dateRange}
            />
          </CardContent>
        </Card>
      )}

      {/* 支出推移グラフ（常時表示） */}
      <Card className="mb-6 bg-gradient-to-br from-white via-blue-50/20 to-cyan-50/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-600" />
            支出推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse text-gray-400">読み込み中...</div>
            </div>
          ) : (
            <ExpenseTrendChart expenses={expenses} period={period} dateRange={dateRange} />
          )}
        </CardContent>
      </Card>

      {/* カテゴリ分析タブ */}
      <Tabs defaultValue="pie" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-100 to-gray-200">
          <TabsTrigger value="pie" className="data-[state=active]:bg-white">
            <PieChart className="h-4 w-4 mr-2" />
            円グラフ
          </TabsTrigger>
          <TabsTrigger value="bar" className="data-[state=active]:bg-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            棒グラフ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pie" className="space-y-4">
          <Card className="bg-gradient-to-br from-white via-amber-50/20 to-orange-50/20">
            <CardHeader>
              <CardTitle>カテゴリ別支出割合</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">読み込み中...</div>
                </div>
              ) : (
                <CategoryPieChart expenses={expenses} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bar" className="space-y-4">
          <Card className="bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/20">
            <CardHeader>
              <CardTitle>カテゴリ別支出金額</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">読み込み中...</div>
                </div>
              ) : (
                <CategoryBarChart expenses={expenses} period={period} dateRange={dateRange} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}