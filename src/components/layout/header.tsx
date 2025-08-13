'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up')

  if (isAuthPage) return null

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
              <UserButton
                afterSignOutUrl="/"
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