import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { expenseSubmitSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    // Clerk認証チェック
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // リクエストボディの取得とバリデーション
    const body = await request.json()
    console.log('Received request body:', body)
    
    const validationResult = expenseSubmitSchema.safeParse(body)
    
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.issues)
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.issues,
          receivedData: body
        },
        { status: 400 }
      )
    }

    // バリデーション済みのデータを使用（変換不要）
    const expenseData = validationResult.data
    
    // Supabaseクライアント取得
    const supabase = getSupabaseServerClient(userId)

    // ユーザーの存在確認（初回アクセス時に作成）
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (!existingUser) {
      // ユーザーが存在しない場合は作成
      try {
        const clerk = await clerkClient()
        const user = await clerk.users.getUser(userId)
        const email = user.emailAddresses.find(emailItem => emailItem.id === user.primaryEmailAddressId)?.emailAddress || 'unknown@example.com'
        
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: email
          })

        if (userError) {
          console.error('Failed to create user:', userError)
          return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
          )
        }
      } catch (clerkError) {
        console.error('Failed to fetch user from Clerk:', clerkError)
        // Clerkからユーザー情報取得に失敗した場合でも、デフォルトで作成
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: 'unknown@example.com'
          })

        if (userError) {
          console.error('Failed to create user with fallback:', userError)
          return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
          )
        }
      }
    }

    // 支出記録の作成
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: userId,
        category_id: expenseData.category_id,
        amount: expenseData.amount,
        description: expenseData.description,
        date: expenseData.date
      })
      .select('*')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create expense' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Expense created successfully',
        data 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Clerk認証チェック
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // クエリパラメータの取得
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // 最大100件
    const offset = (page - 1) * limit

    // Supabaseクライアント取得
    const supabase = getSupabaseServerClient(userId)

    // 支出一覧の取得（カテゴリ情報も含む）
    const { data, error, count } = await supabase
      .from('expenses')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          icon
        )
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
      .limit(limit)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch expenses' },
        { status: 500 }
      )
    }

    // 件数取得
    const { count: totalCount, error: countError } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countError) {
      console.error('Count error:', countError)
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit)
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}