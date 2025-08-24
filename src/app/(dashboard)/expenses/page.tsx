import { Suspense } from 'react';
import { ExpenseList } from './expense-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExpensesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">支出履歴</h1>
        <p className="text-muted-foreground mt-2">
          過去の支出を確認・管理できます
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>支出一覧</CardTitle>
          <CardDescription>
            カテゴリや日付で絞り込みができます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ExpenseListSkeleton />}>
            <ExpenseList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function ExpenseListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}