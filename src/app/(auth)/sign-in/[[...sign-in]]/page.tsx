import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ログイン
          </h1>
          <p className="text-gray-600">
            アカウントにサインインしてください
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border-0 rounded-2xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "rounded-lg",
              formButtonPrimary: 
                "bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all",
              footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
              formFieldInput: 
                "rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500",
              identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
              formFieldInputShowPasswordButton: "text-gray-500 hover:text-gray-700",
            },
          }}
        />
      </div>
    </div>
  )
}