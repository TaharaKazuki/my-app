import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/expenses(.*)',
])

// 将来の拡張用に保持
// const isPublicRoute = createRouteMatcher([
//   '/',
//   '/sign-in(.*)',
//   '/sign-up(.*)',
//   '/pricing',
//   '/api/webhooks(.*)',
// ])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  
  // 保護されたルートへのアクセスをチェック
  if (isProtectedRoute(req) && !userId) {
    const { redirectToSignIn } = await auth()
    return redirectToSignIn()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}