import { createServerFn } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"
import { jwtDecode } from "jwt-decode"
import { z } from "zod"

import { useAppSession } from "@utils/session"
import { apiFetch } from "@/lib/config/fetch"

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof loginSchema>) =>
    loginSchema.parse(data)
  )
  .handler(async ({ data }) => {
    // Call the NestJS backend
    // Use shared apiFetch helper to apply base URL and stringify body
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: {
        username: data.username,
        password: data.password,
      },
    })

    if (!response.ok) {
      return { error: "Invalid credentials" }
    }

    const result = await response.json()
    const token = result.access_token

    if (!token) {
      return { error: "No token received" }
    }

    // Decode token to get user info
    const decoded = jwtDecode<{ username: string; sub: number; exp: number }>(
      token
    )

    // Create session
    const session = await useAppSession()
    await session.update({
      token,
      userId: decoded.sub,
      username: decoded.username,
    })

    // Redirect to protected area
    throw redirect({ to: "/" })
  })

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession()
  await session.clear()
  throw redirect({ to: "/login" })
})

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession()

    if (!session.data.token || !session.data.userId || !session.data.username) {
      return null
    }

    // We can also check token expiration here
    try {
      const decoded = jwtDecode<{ exp: number }>(session.data.token)
      if (decoded.exp * 1000 < Date.now()) {
        await session.clear()
        return null
      }
    } catch {
      return null
    }

    return {
      userId: session.data.userId,
      username: session.data.username,
      token: session.data.token,
    }
  }
)
