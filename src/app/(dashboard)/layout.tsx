import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
        {children}
      </main>
    </>
  )
}