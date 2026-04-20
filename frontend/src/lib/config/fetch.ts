// Helper for API fetches
// Uses Vite `import.meta.env` for base URL configuration. On the server
// side (server functions) `process.env.API_BASE_URL` will be used as fallback.

type FetchOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: any
  headers?: Record<string, string>
}

function getBaseUrl() {
  // Vite exposes env vars via import.meta.env for client builds
  // Use VITE_API_BASE_URL in .env for front-end; fallback to NODE env for server usage.
  // Example .env: VITE_API_BASE_URL=http://localhost:3001
  // For server functions running under Nitro/Node, use process.env.API_BASE_URL
  const client = typeof import.meta !== "undefined" && import.meta.env
  if (client && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }

  if (typeof process !== "undefined" && process.env?.API_BASE_URL) {
    return process.env.API_BASE_URL
  }

  return ""
}

export type ResponseData<T> =
  | { success: true; message: string; data: T; error?: never }
  | {
      success: false
      message: string
      error: { statusCode: number }
      data?: never
    }

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<ResponseData<T>> {
  const base = getBaseUrl()
  const url = base
    ? `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
    : path

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  const init: RequestInit = {
    method: options.method || "GET",
    headers,
  }

  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body)
  }

  if (options.credentials) init.credentials = options.credentials
  if (options.mode) init.mode = options.mode
  if (options.cache) init.cache = options.cache

  try {
    const response = await fetch(url, init)
    const result = await response.json()
    const message = result.message || (response.ok ? "Success" : "Error")

    if (!response.ok) {
      return {
        success: false,
        message,
        error: {
          statusCode: response.status,
        },
      }
    }

    return { success: true, data: result.data as T, message }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
      error: {
        statusCode: 500,
      },
    }
  }
}
