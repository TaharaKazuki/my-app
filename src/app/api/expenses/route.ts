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
    const category = searchParams.get('category')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    // Supabaseクライアント取得
    const supabase = getSupabaseServerClient(userId)

    // クエリビルダーの構築
    let query = supabase
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

    // カテゴリフィルタ
    if (category && category !== 'all') {
      query = query.eq('category_id', parseInt(category))
    }

    // 日付範囲フィルタ
    if (from) {
      query = query.gte('date', from)
    }
    if (to) {
      query = query.lte('date', to)
    }

    // ソートとページネーション
    const { data, error } = await query
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

    // 件数取得（フィルタを適用）
    let countQuery = supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // カテゴリフィルタ
    if (category && category !== 'all') {
      countQuery = countQuery.eq('category_id', parseInt(category))
    }

    // 日付範囲フィルタ
    if (from) {
      countQuery = countQuery.gte('date', from)
    }
    if (to) {
      countQuery = countQuery.lte('date', to)
    }

    const { count: totalCount, error: countError } = await countQuery

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