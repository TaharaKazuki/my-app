import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AnalyticsClient } from './analytics-client'
import { checkPremiumStatus } from '@/lib/auth'

export default async function AnalyticsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const isPremium = await checkPremiumStatus()
  
  if (!isPremium) {
    redirect('/pricing')
  }

  return <AnalyticsClient userId={userId} />
}