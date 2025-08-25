import { UserProfile } from '@clerk/nextjs'

export default function UserProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile 
        path="/user-profile"
        routing="path"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg"
          }
        }}
      />
    </div>
  )
}