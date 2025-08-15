import type { ExpenseSubmitData, ExpenseData, ExpenseWithCategory } from '@/types/expense'

const API_BASE_URL = '/api'

// APIエラーレスポンスの型
interface ApiError {
  error: string
  details?: unknown
}

// APIレスポンスの型
interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// カスタムエラークラス
export class ApiRequestError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

// 基本的なfetch関数
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiRequestError(response.status, data.error || 'API request failed', data.details)
  }

  return data
}

// 支出API関数
export const expenseApi = {
  // 支出作成
  async create(expenseData: ExpenseSubmitData): Promise<ExpenseData> {
    const response = await apiRequest<ApiResponse<ExpenseData>>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    })
    return response.data!
  },

  // 支出一覧取得
  async getAll(params?: {
    page?: number
    limit?: number
  }): Promise<{ data: ExpenseWithCategory[]; pagination: ApiResponse['pagination'] }> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const endpoint = `/expenses${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    const response = await apiRequest<ApiResponse<ExpenseWithCategory[]>>(endpoint)
    
    return {
      data: response.data || [],
      pagination: response.pagination
    }
  },

  // 支出詳細取得
  async getById(id: string): Promise<ExpenseData> {
    const response = await apiRequest<ApiResponse<ExpenseData>>(`/expenses/${id}`)
    return response.data!
  },

  // 支出更新
  async update(id: string, expenseData: ExpenseSubmitData): Promise<ExpenseWithCategory> {
    // APIは文字列型を期待しているので変換
    const formData = {
      amount: expenseData.amount.toString(),
      category_id: expenseData.category_id.toString(),
      description: expenseData.description || '',
      date: expenseData.date
    }
    
    const response = await apiRequest<ApiResponse<ExpenseWithCategory>>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    })
    return response.data!
  },

  // 支出削除
  async delete(id: string): Promise<void> {
    await apiRequest(`/expenses/${id}`, {
      method: 'DELETE',
    })
  },
}

// エクスポート用のヘルパー関数
export const updateExpense = expenseApi.update
export const deleteExpense = expenseApi.delete

// 統計API（将来の実装用）
export const statsApi = {
  // 週次サマリー
  async getWeeklySummary(): Promise<{ total: number; categoryBreakdown: Record<string, number> }> {
    // TODO: 将来実装
    throw new Error('Not implemented yet')
  },

  // 月次サマリー
  async getMonthlySummary(): Promise<{ total: number; categoryBreakdown: Record<string, number> }> {
    // TODO: 将来実装
    throw new Error('Not implemented yet')
  },
}