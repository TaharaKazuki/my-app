import { Header } from "@/components/layout/header"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
    </div>
  )
}