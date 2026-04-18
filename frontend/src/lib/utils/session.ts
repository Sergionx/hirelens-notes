import { useSession } from '@tanstack/react-start/server'

type SessionData = {
  token?: string
  username?: string
  userId?: number
}

export function useAppSession() {
  return useSession<SessionData>({
    // Session configuration
    name: 'app-session',
    password: process.env.SESSION_SECRET || 'fallback-secret-for-development-only-at-least-32-chars', // At least 32 characters
    // Optional: customize cookie settings
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
    },
  })
}
