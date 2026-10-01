export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface Options {
  method?: string
  body?: unknown
  token?: string | null
}

// Small wrapper around fetch: sends JSON, adds the token, and throws ApiError on failure.
// Paths like /api/... are forwarded to Spring Boot by the proxy in vite.config.ts.
export async function api<T>(path: string, { method = 'GET', body, token }: Options = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
  } catch {
    throw new ApiError(0, "Can't reach the server. Is the backend running?")
  }

  const text = await res.text()
  if (!res.ok) {
    // Your backend's error handler returns plain text messages.
    const message = text && !text.startsWith('{') ? text : `Request failed (${res.status})`
    throw new ApiError(res.status, message)
  }
  return (text ? JSON.parse(text) : null) as T
}
