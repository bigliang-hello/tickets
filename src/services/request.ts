import Taro from '@tarojs/taro'

const TOKEN_KEY = 'auth:token'
const USER_KEY = 'auth:user'
const API_BASE = 'https://api.ttickets.top'

export function getToken(): string { return Taro.getStorageSync(TOKEN_KEY) || '' }
export function setToken(t: string) { Taro.setStorageSync(TOKEN_KEY, t) }
export function getUser(): any { const s = Taro.getStorageSync(USER_KEY); return s ? JSON.parse(s) : null }
export function setUser(u: any) { Taro.setStorageSync(USER_KEY, JSON.stringify(u || null)) }

export function getApiBase(): string { return API_BASE }

function withBase(url: string) {
  const base = getApiBase()
  if (url.startsWith('http')) return url
  return base ? `${base}${url}` : url
}

let refreshing: Promise<void> | null = null
async function refreshLoginInternal() {
  const { code } = await Taro.login()
  const res = await Taro.request({ url: withBase('/api/auth/wechat/login'), method: 'POST', data: { code }, header: { 'Content-Type': 'application/json' } })
  const data = res.data as any
  if (res.statusCode >= 400 || !data?.token) throw new Error('login failed')
  setToken(data.token)
  setUser(data.user)
}

async function ensureAuth() {
  if (!refreshing) refreshing = refreshLoginInternal().finally(() => { refreshing = null })
  return refreshing
}

export async function apiRequest<T>(opts: { url: string, method?: 'GET'|'POST'|'PUT'|'DELETE', data?: any, headers?: any }): Promise<T> {
  const token = getToken()
  const headers = { ...(opts.headers || {}), 'Content-Type': 'application/json' } as any
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await Taro.request({ url: withBase(opts.url), method: opts.method || 'GET', data: opts.data, header: headers })
  if (res.statusCode === 401 || res.statusCode === 403) {
    await ensureAuth()
    const retryHeaders = { ...(opts.headers || {}), 'Content-Type': 'application/json' } as any
    const t2 = getToken()
    if (t2) retryHeaders['Authorization'] = `Bearer ${t2}`
    const retry = await Taro.request({ url: withBase(opts.url), method: opts.method || 'GET', data: opts.data, header: retryHeaders })
    if (retry.statusCode >= 400) throw new Error(String(retry.statusCode))
    return retry.data as T
  }
  if (res.statusCode >= 400) throw new Error(String(res.statusCode))
  return res.data as T
}

export async function apiUpload<T>(url: string, filePath: string, name = 'file', formData?: Record<string, any>, headers?: any): Promise<T> {
  const token = getToken()
  const h = { ...(headers || {}) } as any
  if (token) h['Authorization'] = `Bearer ${token}`
  const res = await Taro.uploadFile({ url: withBase(url), filePath, name, formData, header: h })
  if ((res.statusCode as number) === 401 || (res.statusCode as number) === 403) {
    await ensureAuth()
    const h2 = { ...(headers || {}) } as any
    const t2 = getToken()
    if (t2) h2['Authorization'] = `Bearer ${t2}`
    const retry = await Taro.uploadFile({ url: withBase(url), filePath, name, formData, header: h2 })
    const d2 = retry.data
    try { return JSON.parse(d2) as T } catch { return (d2 as unknown) as T }
  }
  const data = res.data
  try { return JSON.parse(data) as T } catch { return (data as unknown) as T }
}