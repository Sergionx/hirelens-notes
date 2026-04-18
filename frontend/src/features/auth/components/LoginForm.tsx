import * as React from "react"
import { useServerFn } from "@tanstack/react-start"
import { ZodError } from "zod"
import { loginFn } from "../server"
import { type LoginAction, loginSchema } from "./schema"

export function LoginForm() {
  const [formData, setFormData] = React.useState<LoginAction>({
    username: "",
    password: "",
  })
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof LoginAction, string>>
  >({})
  const [serverError, setServerError] = React.useState("")
  const loginMutation = useServerFn(loginFn)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setServerError("")

    try {
      const parsed = loginSchema.parse(formData)
      const res = await loginMutation({ data: parsed })
      if (res?.error) {
        setServerError(res.error)
        return
      }
      // redirect is handled in server function
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {}
        for (const issue of err.issues) {
          newErrors[issue.path[0] as string] = issue.message
        }
        setErrors(newErrors)
      } else {
        setServerError((err as Error).message)
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>

        {serverError && (
          <div className="mb-4 text-sm text-red-500">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="mt-1 w-full rounded-md border p-2"
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mt-1 w-full rounded-md border p-2"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
