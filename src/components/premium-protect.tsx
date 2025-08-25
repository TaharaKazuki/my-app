'use client'

import { Protect } from '@clerk/nextjs'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PremiumProtectProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Clerkの標準Protectコンポーネントを使用したプレミアム機能保護
 */
export function PremiumProtect({ children, fallback }: PremiumProtectProps) {
  return (
    <Protect
      condition={(has) => has({ plan: 'premium' })}
      fallback={
        fallback || (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                プレミアム機能です
              </h3>
              <p className="text-gray-600 mb-6">
                この機能を利用するには、プレミアムプランへのアップグレードが必要です。
              </p>
              <Link href="/pricing">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  プレミアムプランを見る
                </Button>
              </Link>
            </div>
          </div>
        )
      }
    >
      {children}
    </Protect>
  )
}