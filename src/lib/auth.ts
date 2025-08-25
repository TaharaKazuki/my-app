import { auth } from '@clerk/nextjs/server'
import { currentUser } from '@clerk/nextjs/server'

/**
 * ユーザーがプレミアムプランに加入しているかチェック
 * サーバーサイドで使用
 */
export async function checkPremiumStatus() {
  const { userId, has } = await auth()
  
  if (!userId) {
    return false
  }
  
  // Clerkのhas()関数でプレミアムプランをチェック
  const hasPremium = has({ plan: 'premium' })
  
  return hasPremium
}

/**
 * プレミアム機能へのアクセスを保護するためのヘルパー関数
 */
export async function requirePremium() {
  const isPremium = await checkPremiumStatus()
  
  if (!isPremium) {
    throw new Error('プレミアムプランへの加入が必要です')
  }
  
  return true
}

/**
 * 認証とプレミアムステータスを同時にチェック
 */
export async function getAuthStatus() {
  const { userId } = await auth()
  
  if (!userId) {
    return {
      isAuthenticated: false,
      isPremium: false,
      userId: null
    }
  }
  
  const isPremium = await checkPremiumStatus()
  
  return {
    isAuthenticated: true,
    isPremium,
    userId
  }
}