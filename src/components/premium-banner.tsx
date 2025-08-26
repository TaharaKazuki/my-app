'use client'

import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Crown, TrendingUp, PieChart, FileDown, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function PremiumBanner() {
  const { has } = useAuth()
  const [isDismissed, setIsDismissed] = useState(false)
  // Clerkのhas関数でプレミアムプランをチェック
  const isPremium = has && has({ plan: 'premium' })

  // プレミアムユーザーまたは非表示の場合は何も表示しない
  if (isPremium || isDismissed) {
    return null
  }

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mb-6">
      <div className="p-6 relative">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                プレミアムプランで詳細分析
              </h3>
            </div>
            <p className="text-gray-600 mb-3">
              グラフ分析、期間比較、CSVエクスポートなど、より高度な機能をご利用いただけます。
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-1 text-gray-700">
                <PieChart className="h-4 w-4" />
                カテゴリ別グラフ
              </span>
              <span className="inline-flex items-center gap-1 text-gray-700">
                <TrendingUp className="h-4 w-4" />
                期間比較
              </span>
              <span className="inline-flex items-center gap-1 text-gray-700">
                <FileDown className="h-4 w-4" />
                CSVエクスポート
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-2xl font-bold text-gray-900">¥500</div>
              <div className="text-sm text-gray-600">月額</div>
            </div>
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md">
                <Crown className="h-4 w-4 mr-2" />
                プレミアムプランを見る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}