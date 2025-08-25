'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PremiumGuardProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * プレミアム機能を保護するクライアントコンポーネント
 */
export function PremiumGuard({ 
  children, 
  fallback,
  redirectTo 
}: PremiumGuardProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  
  const hasPremium = user?.publicMetadata?.plan === 'premium' || 
                     user?.publicMetadata?.subscription_status === 'active'
  
  useEffect(() => {
    if (isLoaded && !hasPremium && redirectTo) {
      router.push(redirectTo)
    }
  }, [isLoaded, hasPremium, redirectTo, router])
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (!hasPremium) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    return (
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
  
  return <>{children}</>
}

/**
 * プレミアムステータスをチェックするフック
 */
export function usePremiumStatus() {
  const { user, isLoaded } = useUser()
  
  const hasPremium = user?.publicMetadata?.plan === 'premium' || 
                     user?.publicMetadata?.subscription_status === 'active'
  
  return {
    isPremium: hasPremium,
    isLoading: !isLoaded
  }
}