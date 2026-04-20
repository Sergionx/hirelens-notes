import { createFileRoute } from "@tanstack/react-router"
import { SignupForm } from "@/features/auth/components/SignupForm/SignupForm"

export const Route = createFileRoute("/signup")({
  component: SignupPage,
})

function SignupPage() {
  return <SignupForm />
}
