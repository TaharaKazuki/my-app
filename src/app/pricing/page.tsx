import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Check, Star } from 'lucide-react'

export default async function PricingPage() {
  const { userId } = await auth()

  return (
    <>
      <Header />
      <main>
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                シンプルな料金プラン
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                必要な機能だけを厳選。続けやすい価格で家計管理を始めましょう。
              </p>
            </div>
          </div>
        </section>

        {/* 料金プラン */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* 無料プラン */}
                <div className="relative bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 lg:p-10">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      無料プラン
                    </h3>
                    <div className="mb-6">
                      <span className="text-5xl lg:text-6xl font-bold text-gray-900">¥0</span>
                      <span className="text-xl text-gray-600 ml-2">/月</span>
                    </div>
                    <p className="text-gray-600">
                      基本機能で家計管理をスタート
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="text-green-500 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">支出記録（無制限）</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-green-500 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">9つの固定カテゴリ</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-green-500 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">週次・月次の合計表示</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-green-500 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">支出履歴の閲覧・編集</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-green-500 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-700">データのバックアップ</span>
                    </li>
                  </ul>

                  <Link href={userId ? "/dashboard" : "/sign-up"} className="block">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-4 text-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                      {userId ? "ダッシュボードへ" : "無料で始める"}
                    </Button>
                  </Link>
                </div>

                {/* プレミアムプラン */}
                <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 lg:p-10 text-white">
                  {/* 人気バッジ */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      人気プラン
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                      プレミアムプラン
                    </h3>
                    <div className="mb-6">
                      <span className="text-5xl lg:text-6xl font-bold">$10</span>
                      <span className="text-xl opacity-90 ml-2">/月</span>
                    </div>
                    <p className="opacity-90">
                      詳細分析で支出パターンを把握
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="text-blue-200 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span>無料プランの全機能</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-blue-200 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span>カテゴリ別詳細グラフ</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-blue-200 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span>期間比較分析（前月・前年比）</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-blue-200 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span>支出トレンド分析</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-blue-200 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span>データエクスポート（CSV）</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-blue-200 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span>優先サポート</span>
                    </li>
                  </ul>

                  <Link href={userId ? "/dashboard" : "/sign-up"} className="block">
                    <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 rounded-xl py-4 text-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                      {userId ? "アップグレード" : "プレミアムで始める"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ セクション */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                よくある質問
              </h2>
              
              <div className="space-y-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    無料プランでずっと使い続けられますか？
                  </h3>
                  <p className="text-gray-600">
                    はい、無料プランに期限はありません。基本的な家計管理機能を永続的にご利用いただけます。
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    プレミアムプランはいつでも解約できますか？
                  </h3>
                  <p className="text-gray-600">
                    はい、いつでも解約可能です。解約後も無料プランとして継続利用できます。
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    データの安全性は保証されますか？
                  </h3>
                  <p className="text-gray-600">
                    最新のセキュリティ技術を使用してデータを保護しています。定期的なバックアップも実施しています。
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    モバイルアプリはありますか？
                  </h3>
                  <p className="text-gray-600">
                    現在はWebアプリのみですが、モバイル端末でも快適にご利用いただけるよう最適化されています。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA セクション */}
        <section className="py-16 lg:py-20 bg-blue-600">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                今すぐ家計管理を始めませんか？
              </h2>
              <p className="text-xl mb-8 opacity-90">
                シンプルで続けやすい家計簿で、お金の流れを見える化しましょう。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={userId ? "/dashboard" : "/sign-up"}>
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 rounded-xl px-8 py-4 text-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                    {userId ? "ダッシュボードへ" : "無料で始める"}
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-xl px-8 py-4 text-lg font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200">
                    詳しく見る
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