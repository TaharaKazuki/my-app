'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          エラーが発生しました
        </h1>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          申し訳ございません。予期しないエラーが発生しました。
          問題が続く場合は、サポートまでお問い合わせください。
        </p>
        <div className="space-x-4">
          <Button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            もう一度試す
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="rounded-lg"
          >
            ホームに戻る
          </Button>
        </div>
      </div>
    </div>
  )
}