export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function withBasePath(path: string) {
  if (!path) return BASE_PATH || '/'
  if (/^(?:https?:)?\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('tel:')) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${BASE_PATH}${normalized}` || '/'
}
