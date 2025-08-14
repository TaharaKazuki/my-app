import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase'

export async function GET() {
  try {
    // Clerk認証チェック
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Supabaseクライアント取得
    const supabase = getSupabaseServerClient(userId)

    // データベース接続テスト
    const results = await Promise.all([
      // テーブル存在確認
      supabase.from('users').select('count', { count: 'exact', head: true }),
      supabase.from('categories').select('count', { count: 'exact', head: true }),
      supabase.from('expenses').select('count', { count: 'exact', head: true }),
      
      // カテゴリデータ確認
      supabase.from('categories').select('*').limit(5)
    ])

    const [usersResult, categoriesResult, expensesResult, sampleCategories] = results

    return NextResponse.json({
      userId,
      tables: {
        users: {
          exists: !usersResult.error,
          count: usersResult.count,
          error: usersResult.error?.message
        },
        categories: {
          exists: !categoriesResult.error,
          count: categoriesResult.count,
          error: categoriesResult.error?.message
        },
        expenses: {
          exists: !expensesResult.error,
          count: expensesResult.count,
          error: expensesResult.error?.message
        }
      },
      sampleCategories: sampleCategories.data,
      categoriesError: sampleCategories.error?.message
    })

  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}