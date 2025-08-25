'use client'

import { PricingTable as ClerkPricingTable } from '@clerk/clerk-react'
import { useAuth, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'
import Link from 'next/link'

export function PricingTable() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()

  // プレミアムプランに登録済みかチェック
  const hasPremium = user?.publicMetadata?.plan === 'premium' || 
                     user?.publicMetadata?.subscriptionStatus === 'active'

  if (hasPremium) {
    return (
      <div className="text-center py-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Crown className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-green-800">
          🎉 プレミアムプランをご利用中です
        </h3>
        <p className="text-green-700 mb-6">
          すべてのプレミアム機能をご利用いただけます
        </p>
        <Link href="/user-profile">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            サブスクリプションを管理
          </Button>
        </Link>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold mb-4">
            プレミアムプランにアップグレード
          </h3>
          <p className="mb-6 text-blue-100">
            まずはアカウントを作成してください
          </p>
          <div className="mb-6">
            <span className="text-5xl font-bold">¥500</span>
            <span className="text-xl text-blue-200">/月</span>
          </div>
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg"
            >
              無料でアカウント作成
            </Button>
          </Link>
          <p className="mt-4 text-sm text-blue-200">
            アカウント作成後、プレミアムプランにアップグレードできます
          </p>
        </div>
      </div>
    )
  }

  // Clerk謹製のPricingTableコンポーネント
  return (
    <div className="max-w-4xl mx-auto">
      <ClerkPricingTable 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg rounded-2xl border-0",
            cardHeader: "text-center pb-4",
            cardBody: "px-6 pb-6",
            planName: "text-2xl font-bold mb-2",
            planPrice: "text-4xl font-bold mb-4",
            planDescription: "text-gray-600 mb-6",
            featureList: "space-y-3 mb-8",
            featureListItem: "flex items-center text-gray-700",
            subscribeButton: "w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200",
            manageSubscriptionButton: "w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
          },
          variables: {
            colorPrimary: "#3B82F6",
            colorText: "#1F2937",
            colorTextSecondary: "#6B7280",
            colorBackground: "#FFFFFF",
            colorInputBackground: "#F9FAFB",
            colorInputText: "#1F2937",
            borderRadius: "0.75rem"
          }
        }}
      />
    </div>
  )
}