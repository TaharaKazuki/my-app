'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              システムエラーが発生しました
            </h2>
            <p className="text-gray-600 mb-6">
              申し訳ございません。システムに問題が発生しました。
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              再読み込み
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}