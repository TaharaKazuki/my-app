import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
          <span className="text-4xl font-bold text-blue-600">404</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ページが見つかりません
        </h1>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="space-x-4">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              ホームに戻る
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-lg">
              ダッシュボードへ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}