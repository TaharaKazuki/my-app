import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ダッシュボード</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">今週の支出</h2>
          <p className="text-3xl font-bold text-gray-900">¥0</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">今月の支出</h2>
          <p className="text-3xl font-bold text-gray-900">¥0</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">登録件数</h2>
          <p className="text-3xl font-bold text-gray-900">0件</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">支出記録</h2>
        <p className="text-gray-600">まだ支出記録がありません。</p>
      </div>
    </div>
  )
}