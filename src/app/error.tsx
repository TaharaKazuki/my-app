'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-2">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                エラーが発生しました
              </h1>
              <p className="text-muted-foreground">
                申し訳ございません。予期しないエラーが発生しました。
                {isDevelopment && error.digest && (
                  <span className="block text-xs mt-1 text-muted-foreground">
                    Error ID: {error.digest}
                  </span>
                )}
              </p>
            </div>

            {isDevelopment && (
              <Card className="mt-4 border-destructive/20">
                <CardContent className="pt-4">
                  <div className="text-left text-xs">
                    <p className="font-mono text-destructive mb-2">
                      {error.name}: {error.message}
                    </p>
                    {error.stack && (
                      <pre className="text-muted-foreground overflow-auto max-h-32 whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={reset}
                className="flex-1"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                もう一度試す
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="flex-1"
                size="sm"
              >
                <Home className="w-4 h-4 mr-2" />
                ホーム
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}