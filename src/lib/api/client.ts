const API_BASE_URL =
  import.meta.env.VITE_JSON_SERVER_URL?.replace(/\/$/, '') ??
  'http://localhost:3001'

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

function pathFor(resource: string, id?: string) {
  const cleanResource = resource.startsWith('/') ? resource : `/${resource}`
  return id ? `${cleanResource}/${encodeURIComponent(id)}` : cleanResource
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, ...fetchOptions } = options
  const headers = new Headers(options.headers)
  const init: RequestInit = {
    ...fetchOptions,
    headers,
  }

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
    init.body = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, init)
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(
      `JSON server request failed (${response.status})${detail ? `: ${detail}` : ''}`,
    )
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const apiClient = {
  get: <T>(resource: string, id?: string) => request<T>(pathFor(resource, id)),
  post: <T>(resource: string, body: unknown) =>
    request<T>(pathFor(resource), { method: 'POST', body }),
  patch: <T>(resource: string, id: string, body: unknown) =>
    request<T>(pathFor(resource, id), { method: 'PATCH', body }),
  delete: (resource: string, id: string) =>
    request<void>(pathFor(resource, id), { method: 'DELETE' }),
  raw: request,
}
