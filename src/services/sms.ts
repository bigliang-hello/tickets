import Taro from '@tarojs/taro'
import { parseSMS } from '../utils/parser'
import { Ticket } from '../types/ticket'

function extractUrl(text: string): string {
  const m = text.match(/https?:\/\/\S+/)
  if (m) return m[0]
  const m2 = text.match(/\b\w+\.12306\.cn\/\S+/)
  if (m2) return 'https://' + m2[0]
  return ''
}

function parsePage(html: string): Partial<Ticket> {
  const train = (html.match(/\b([GDFZTKC]\d{1,4})\b/) || [])[1]
  const date = (html.match(/(\d{4}-\d{2}-\d{2}|\d{1,2}月\d{1,2}日)/) || [])[1]
  const time = (html.match(/(\d{1,2}:\d{2})/) || [])[1]
  const fromMatch = html.match(/([\u4e00-\u9fa5]{2,})站/)
  const toMatch = html.match(/至([\u4e00-\u9fa5]{2,})/) || html.match(/到达[：:]?([\u4e00-\u9fa5]{2,})/)
  return {
    trainCode: train || '',
    fromStationName: (fromMatch?.[1] || '').replace(/站$/, ''),
    toStationName: (toMatch?.[1] || '')?.replace(/站$/, ''),
    departDate: date || '',
    departTime: time || ''
  }
}

export async function parseSMSPreferUrl(text: string): Promise<Partial<Ticket>> {
  const url = extractUrl(text)
  console.log('url:', url)
  if (!url) return parseSMS(text)
  try {
    const res = await Taro.request({ url, method: 'GET' })
    const html = typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
    const data = parsePage(html)
    const fallback = parseSMS(text)
    return { ...fallback, ...data, rawText: text }
  } catch {
    return parseSMS(text)
  }
}