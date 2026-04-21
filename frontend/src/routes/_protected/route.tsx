import { createFileRoute, redirect, Outlet, Link } from "@tanstack/react-router"

import { userQueryOptions } from "@/features/auth/queries/user-query"
import { useAuth } from "@/features/auth/contexts/AuthContext"

import { Button } from "@ui/button"

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(userQueryOptions)
    if (!user) {
      throw redirect({
        to: "/login",
      })
    }
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-xl font-bold">Notes App</h1>
        <nav className="flex items-center space-x-4">
          <div className="mr-4 flex space-x-4">
            <Link to="/notes" className="text-blue-600 hover:underline">
              Notes
            </Link>
            <Link
              to="/notes/archived"
              className="text-blue-600 hover:underline"
            >
              Archived
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-700">Hello, {user?.nickname}</span>
            <Button
              onClick={logout}
              className="text-sm hover:underline"
              type="button"
            >
              Logout
            </Button>
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
