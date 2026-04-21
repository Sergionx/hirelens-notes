import { createServerFn } from "@tanstack/react-start"
import { updateSession } from "@tanstack/react-start/server"
import { redirect } from "@tanstack/react-router"
import { jwtDecode } from "jwt-decode"

import { sessionConfig, useAppSession, type SessionData } from "@utils/session"
import { apiFetch, authenticatedFetch } from "@/lib/config/fetch"

import {
  loginSchema,
  type LoginSchema,
} from "@/features/auth/components/LoginForm/schema"
import {
  signupSchema,
  type SignupSchema,
} from "@/features/auth/components/SignupForm/schema"

import type { User } from "@/features/auth/schemas/user-schema"

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((data: LoginSchema) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const result = await apiFetch<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: {
        email: data.email,
        password: data.password,
      },
    })

    if (!result.success) return { error: result.message }

    const token = result.data.access_token

    if (!token) return { error: "No token received" }

    // Decode token to get user info
    const decoded = jwtDecode<{ username: string; sub: number; exp: number }>(
      token
    )

    await updateSession<SessionData>(
      {
        ...sessionConfig,
        maxAge: data.rememberMe ? 30 * 24 * 60 * 60 : undefined, // 30 days vs session
      },
      {
        token,
        userId: decoded.sub,
      }
    )
  })

export const signupFn = createServerFn({ method: "POST" })
  .inputValidator((data: SignupSchema) => signupSchema.parse(data))
  .handler(async ({ data }) => {
    const result = await apiFetch<{ access_token: string }>("/auth/register", {
      method: "POST",
      body: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    })

    if (!result.success) return { error: result.message }

    const token = result.data.access_token

    if (!token) return { error: "No token received" }

    const decoded = jwtDecode<{ username: string; sub: number; exp: number }>(
      token
    )

    const session = await useAppSession()
    await session.update({
      token,
      userId: decoded.sub,
    })
  })

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession()
  await session.clear()
  throw redirect({ to: "/login" })
})

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession()

    if (!session.data.token || !session.data.userId) {
      return null
    }

    const result = await authenticatedFetch<User>("/auth/current-user", {
      method: "GET",
    })

    if (!result.success) {
      await session.clear()
      return null
    }

    return result.data
  }
)
