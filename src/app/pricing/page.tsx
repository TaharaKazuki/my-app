import { PricingTable } from '@/components/pricing-table'
import { CheckCircle } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            シンプルな料金プラン
          </h1>
          <p className="text-xl text-gray-600">
            必要な機能を、適正な価格で
          </p>
        </div>

        {/* プラン比較 */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* 無料プラン */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">無料プラン</h2>
              <p className="text-gray-600 mb-4">個人の支出管理に最適</p>
              <div className="text-4xl font-bold">
                ¥0
                <span className="text-lg font-normal text-gray-600">/月</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>支出の記録・管理</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>9種類のカテゴリ分類</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>今週・今月の集計</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>支出履歴の検索</span>
              </li>
            </ul>
          </div>

          {/* プレミアムプラン */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                人気プラン
              </span>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">プレミアムプラン</h2>
              <p className="text-blue-100 mb-4">詳細な分析で賢く節約</p>
              <div className="text-4xl font-bold">
                ¥500
                <span className="text-lg font-normal text-blue-100">/月</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-200 mr-3 mt-0.5 flex-shrink-0" />
                <span>無料プランの全機能</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-200 mr-3 mt-0.5 flex-shrink-0" />
                <span className="font-semibold">📊 カテゴリ別グラフ分析</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-200 mr-3 mt-0.5 flex-shrink-0" />
                <span className="font-semibold">📈 期間別比較レポート</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-200 mr-3 mt-0.5 flex-shrink-0" />
                <span className="font-semibold">💾 CSVエクスポート</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-200 mr-3 mt-0.5 flex-shrink-0" />
                <span className="font-semibold">🎯 支出目標の設定</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Clerk Pricing Table */}
        <div className="max-w-4xl mx-auto">
          <PricingTable />
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">よくある質問</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-2">いつでも解約できますか？</h3>
              <p className="text-gray-600">
                はい、いつでも解約可能です。解約後も当月末まではプレミアム機能をご利用いただけます。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-2">支払い方法は？</h3>
              <p className="text-gray-600">
                クレジットカード（Visa、Mastercard、American Express）でのお支払いに対応しています。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-2">無料プランに戻すことはできますか？</h3>
              <p className="text-gray-600">
                はい、プレミアムプランを解約すると自動的に無料プランに戻ります。データは引き続き保持されます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}