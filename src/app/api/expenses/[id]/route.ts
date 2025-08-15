import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { expenseFormSchema, transformExpenseFormData } from '@/lib/validations'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Clerk認証チェック
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const expenseId = params.id

    // UUID形式のバリデーション
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(expenseId)) {
      return NextResponse.json(
        { error: 'Invalid expense ID format' },
        { status: 400 }
      )
    }

    // リクエストボディの取得とバリデーション
    const body = await request.json()
    const validationResult = expenseFormSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.issues 
        },
        { status: 400 }
      )
    }

    // データ変換
    const expenseData = transformExpenseFormData(validationResult.data)
    
    // Supabaseクライアント取得
    const supabase = getSupabaseServerClient(userId)

    // 支出記録の存在確認と所有者チェック
    const { data: existingExpense, error: fetchError } = await supabase
      .from('expenses')
      .select('id, user_id')
      .eq('id', expenseId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !existingExpense) {
      return NextResponse.json(
        { error: 'Expense not found or access denied' },
        { status: 404 }
      )
    }

    // 支出記録の更新（カテゴリ情報も含めて取得）
    const { data, error } = await supabase
      .from('expenses')
      .update({
        category_id: expenseData.category_id,
        amount: expenseData.amount,
        description: expenseData.description,
        date: expenseData.date,
        updated_at: new Date().toISOString()
      })
      .eq('id', expenseId)
      .eq('user_id', userId)
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          icon
        )
      `)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to update expense' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Expense updated successfully',
      data
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Clerk認証チェック
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const expenseId = params.id

    // UUID形式のバリデーション
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(expenseId)) {
      return NextResponse.json(
        { error: 'Invalid expense ID format' },
        { status: 400 }
      )
    }

    // Supabaseクライアント取得
    const supabase = getSupabaseServerClient(userId)

    // 支出記録の存在確認と所有者チェック
    const { data: existingExpense, error: fetchError } = await supabase
      .from('expenses')
      .select('id, user_id')
      .eq('id', expenseId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !existingExpense) {
      return NextResponse.json(
        { error: 'Expense not found or access denied' },
        { status: 404 }
      )
    }

    // 支出記録の削除
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', userId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to delete expense' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Expense deleted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Clerk認証チェック
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const expenseId = params.id

    // UUID形式のバリデーション
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(expenseId)) {
      return NextResponse.json(
        { error: 'Invalid expense ID format' },
        { status: 400 }
      )
    }

    // Supabaseクライアント取得
    const supabase = getSupabaseServerClient(userId)

    // 支出記録の取得（カテゴリ情報も含む）
    const { data, error } = await supabase
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
      .eq('id', expenseId)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Expense not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}