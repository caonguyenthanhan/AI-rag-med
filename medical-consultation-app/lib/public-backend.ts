const LOCAL_BACKEND_FALLBACK = "http://127.0.0.1:8000"

export function getPublicBackendBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_BACKEND_URL?.trim()
  const base = configured || LOCAL_BACKEND_FALLBACK
  return base.replace(/\/$/, "")
}

export function buildPublicBackendUrl(endpoint: string) {
  const normalized = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  return `${getPublicBackendBaseUrl()}${normalized}`
}
