'use client'

import Link from 'next/link'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Wallet, Crown } from 'lucide-react'

export function Header() {
  
  // 一旦プレミアムチェックを無効化（Clerk Billingの設定完了後に有効化）
  const isPremium = false
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Money Tracker</span>
          </Link>

          <nav className="flex items-center space-x-4">
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="ghost" className="rounded-lg">
                  ダッシュボード
                </Button>
              </Link>
              <Link href="/expenses">
                <Button variant="ghost" className="rounded-lg">
                  支出履歴
                </Button>
              </Link>
              {!isPremium && (
                <Link href="/pricing">
                  <Button 
                    variant="outline" 
                    className="rounded-lg border-amber-500 text-amber-600 hover:bg-amber-50 group"
                  >
                    <Crown className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                    プレミアム
                  </Button>
                </Link>
              )}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
            </SignedIn>
            
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" className="rounded-lg">
                  ログイン
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  無料で始める
                </Button>
              </Link>
            </SignedOut>
          </nav>
        </div>
      </div>
    </header>
  )
}