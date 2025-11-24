import Taro from '@tarojs/taro'
import { apiRequest, setToken, setUser } from './request'

export async function wechatLogin(): Promise<void> {
  const { code } = await Taro.login()
  const resp = await apiRequest<{ token: string, user: any }>({ url: '/api/auth/wechat/login', method: 'POST', data: { code } })
  setToken(resp.token)
  setUser(resp.user)
}

export function isLoggedIn(): boolean { return !!Taro.getStorageSync('auth:token') }

export async function refreshLogin(): Promise<void> {
  await wechatLogin()
}

export function clearAuth() {
  Taro.removeStorageSync('auth:token')
  Taro.removeStorageSync('auth:user')
}

export async function ensureLogin(): Promise<boolean> {
  if (isLoggedIn()) return true
  if (Taro.getEnv() === 'WEAPP') {
    const res = await Taro.showModal({ title: '需要登录', content: '请先微信登录后再继续', confirmText: '登录', cancelText: '取消' })
    if (res.confirm) {
      try {
        await wechatLogin()
        Taro.showToast({ title: '登录成功', icon: 'success' })
        return true
      } catch {
        Taro.showToast({ title: '登录失败', icon: 'none' })
        return false
      }
    }
    return false
  }
  Taro.showToast({ title: '请在微信小程序内登录', icon: 'none' })
  return false
}

export async function guardNavigate(url: string) {
  // const ok = await ensureLogin()
  // if (ok) Taro.navigateTo({ url })
  Taro.navigateTo({ url })
}

export async function guardAction(action: () => void | Promise<void>) {
  const ok = await ensureLogin()
  if (ok) await action()
}