import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Wallet, TrendingUp, PieChart, Calendar } from 'lucide-react'

export default async function HomePage() {
  const { userId } = await auth()
  
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <>
      <Header />
      <main>
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Wallet className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                3つの機能だけ。
                <br />
                続けられる家計簿
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                支出記録、カテゴリ分け、ダッシュボード表示。
                <br />
                必要最小限の機能で、誰でも簡単に継続できます。
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                    無料で始める
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button size="lg" variant="outline" className="rounded-xl px-8 py-6 text-lg">
                    ログイン
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              シンプルな3つの機能
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  支出記録
                </h3>
                <p className="text-gray-600">
                  金額とカテゴリを選ぶだけ。
                  10秒で記録完了。
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <PieChart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  カテゴリ分け
                </h3>
                <p className="text-gray-600">
                  9種類の固定カテゴリで
                  迷わず分類。
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ダッシュボード
                </h3>
                <p className="text-gray-600">
                  週次・月次の支出を
                  一目で把握。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 料金セクション */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              料金プラン
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  無料プラン
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-6">
                  ¥0<span className="text-lg text-gray-600">/月</span>
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">支出記録（無制限）</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">週次・月次の合計表示</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">支出履歴の閲覧</span>
                  </li>
                </ul>
                <Link href="/sign-up" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3">
                    無料で始める
                  </Button>
                </Link>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  プレミアムプラン
                </h3>
                <p className="text-3xl font-bold mb-6">
                  $10<span className="text-lg opacity-90">/月</span>
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>無料プランの全機能</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>カテゴリ別詳細グラフ</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>期間比較分析</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>支出トレンド分析</span>
                  </li>
                </ul>
                <Link href="/sign-up" className="block">
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 rounded-lg py-3">
                    プレミアムで始める
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              © 2025 Money Tracker. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}