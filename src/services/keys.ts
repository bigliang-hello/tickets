import Taro from '@tarojs/taro'

const ID_KEY = 'ocr:secretId'
const SK_KEY = 'ocr:secretKey'
const REGION_KEY = 'ocr:region'

export function getSecretId(): string {
  return Taro.getStorageSync(ID_KEY) || ''
}

export function getSecretKey(): string {
  return Taro.getStorageSync(SK_KEY) || ''
}

export function getRegion(): string {
  return Taro.getStorageSync(REGION_KEY) || 'ap-beijing'
}

export function setSecrets(id: string, key: string, region: string) {
  Taro.setStorageSync(ID_KEY, id)
  Taro.setStorageSync(SK_KEY, key)
  Taro.setStorageSync(REGION_KEY, region || 'ap-beijing')
}