'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { ExpenseWithCategory } from '@/types';
import { categories } from '@/lib/constants';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth } from 'date-fns';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function ExpenseList() {
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const fetchExpenses = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      if (dateRange?.from) {
        params.append('from', format(dateRange.from, 'yyyy-MM-dd'));
      }
      if (dateRange?.to) {
        params.append('to', format(dateRange.to, 'yyyy-MM-dd'));
      }

      const response = await fetch(`/api/expenses?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }

      const data = await response.json();
      setExpenses(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, dateRange]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchExpenses(newPage);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  if (loading && expenses.length === 0) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* フィルター */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="カテゴリを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal',
                !dateRange && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'yyyy/MM/dd', { locale: ja })} -{' '}
                    {format(dateRange.to, 'yyyy/MM/dd', { locale: ja })}
                  </>
                ) : (
                  format(dateRange.from, 'yyyy/MM/dd', { locale: ja })
                )
              ) : (
                <span>期間を選択</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={ja}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* 支出リスト */}
      <div className="divide-y">
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            該当する支出がありません
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="py-4 flex items-center justify-between hover:bg-muted/50 px-2 -mx-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">
                  {expense.categories?.icon || '💰'}
                </div>
                <div>
                  <div className="font-medium">
                    {expense.description || '（説明なし）'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(expense.date), 'yyyy年MM月dd日', {
                      locale: ja,
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  {expense.categories?.name || 'その他'}
                </Badge>
                <div className="font-semibold text-lg">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ページネーション */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            全 {pagination.total} 件中 {(pagination.page - 1) * pagination.limit + 1} -{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} 件を表示
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              前へ
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={pagination.page === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {pagination.totalPages > 5 && (
                <>
                  <span className="px-2">...</span>
                  <Button
                    variant={
                      pagination.page === pagination.totalPages
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => handlePageChange(pagination.totalPages)}
                  >
                    {pagination.totalPages}
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              次へ
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}