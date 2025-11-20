import Taro from '@tarojs/taro'
import { getSecretId, getSecretKey, getRegion } from './keys'
import { buildTC3Headers } from '../utils/tc3'

export async function ocrGeneralBase64(imageBase64: string): Promise<string[]> {
  const secretId = getSecretId()
  const secretKey = getSecretKey()
  const region = getRegion()
  if (!secretId || !secretKey) throw new Error('缺少OCR密钥')
  const action = 'GeneralBasicOCR'
  const version = '2018-11-19'
  const service = 'ocr'
  const payload = { ImageBase64: imageBase64 }
  const h = buildTC3Headers(service, action, version, region, payload, secretId, secretKey)
  const headers = {
    Authorization: h.authorization,
    'Content-Type': h.contentType,
    Host: h.host,
    'X-TC-Action': h.action,
    'X-TC-Timestamp': String(h.timestamp),
    'X-TC-Version': version,
    'X-TC-Region': region
  }
  const res = await Taro.request({ url: `https://${h.host}`, method: 'POST', header: headers, data: payload })
  if (res.statusCode !== 200 || !res.data) throw new Error('OCR请求失败')
  const data = res.data as any
  const lines: string[] = data?.Response?.TextDetections?.map((x: any) => x.DetectedText) || []
  return lines
}