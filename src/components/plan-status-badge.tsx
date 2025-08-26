'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Crown, User, Calendar, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export function PlanStatusBadge() {
  const { has } = useAuth()
  const { user } = useUser()
  const isPremium = has && has({ plan: 'premium' })

  return (
    <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 mb-6">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isPremium ? 'bg-amber-100' : 'bg-gray-100'}`}>
              {isPremium ? (
                <Crown className="h-5 w-5 text-amber-600" />
              ) : (
                <User className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-gray-900">
                  現在のプラン
                </h3>
                {isPremium ? (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    プレミアム
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    無料プラン
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {isPremium ? (
              <>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>全機能利用可能</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    登録日: {user?.createdAt && format(new Date(user.createdAt), 'yyyy年M月d日', { locale: ja })}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  利用開始: {user?.createdAt && format(new Date(user.createdAt), 'yyyy年M月d日', { locale: ja })}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {!isPremium && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              プレミアムプランにアップグレードすると、グラフ分析、期間比較、CSVエクスポートなどの高度な機能が利用できます。
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}