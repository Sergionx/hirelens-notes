import { useSession, type SessionConfig } from "@tanstack/react-start/server"

export type SessionData = {
  token: string
  userId: number
}

export const sessionConfig: SessionConfig = {
  name: "app-session",
  password:
    process.env.SESSION_SECRET ||
    "fallback-secret-for-development-only-at-least-32-chars", // At least 32 characters
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  },
}

export function useAppSession() {
  return useSession<SessionData>(sessionConfig)
}
