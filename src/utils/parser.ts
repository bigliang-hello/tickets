import { Ticket } from '../types/ticket'
import Taro from '@tarojs/taro'

function normalizeDate(s: string) {
  const m1 = s.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (m1) return `${m1[1]}-${m1[2]}-${m1[3]}`
  const m2 = s.match(/(\d{1,2})月(\d{1,2})日/)
  if (m2) {
    const y = new Date().getFullYear()
    const mm = String(Number(m2[1])).padStart(2, '0')
    const dd = String(Number(m2[2])).padStart(2, '0')
    return `${y}-${mm}-${dd}`
  }
  return ''
}

export function parseSMS(text: string): Partial<Ticket> {
  const t = text.replace(/\s+/g, ' ').replace(/[：:]/g, ':')
  const train = (t.match(/\b([GDFZTKC] \d{1,4}|[GDFZTKC]\d{1,4})\b/) || [])[1]?.replace(' ', '')
  const dateMatch = t.match(/(\d{4}-\d{2}-\d{2}|\d{1,2}月\d{1,2}日)/)
  const timeMatch = t.match(/(\d{1,2}:\d{2})/)
  const departTimeFromKai = (t.match(/(\d{1,2}:\d{2})开/) || [])[1]
  const seatMatch = t.match(/(\d{1,2})车(\d{1,3})([A-F])座|座位号(\d{1,2})车(\d{1,3})([A-F])/)
  const gateMatch = t.match(/检票口(?:第)?\s*([A-Z]?\d{1,3})/)
  const stationWithZhan = t.match(/([\u4e00-\u9fa5]{2,})站/) || []
  const stations = t.match(/[\u4e00-\u9fa5]{2,}/g) || []
  const from = (stationWithZhan[1] || stations[0] || '').replace(/站$/, '')
  const toViaZhi = (t.match(/至([\u4e00-\u9fa5]{2,})站/) || [])[1]
  const to = (toViaZhi || stations[1] || '').replace(/站$/, '')
  const seatCar = seatMatch ? (seatMatch[1] || seatMatch[4]) : ''
  const seatNo = seatMatch ? (seatMatch[2] || seatMatch[5]) + (seatMatch[3] || seatMatch[6] || '') : ''
  return {
    trainCode: train || '',
    fromStationName: from,
    toStationName: to,
    departDate: dateMatch ? normalizeDate(dateMatch[1]) : '',
    departTime: departTimeFromKai || (timeMatch ? timeMatch[1] : ''),
    seatCar: seatCar || undefined,
    seatNo: seatNo || undefined,
    gate: gateMatch ? gateMatch[1] : undefined,
    rawText: text,
    sourceType: 'SMS'
  }
}

function extractUrl(text: string) {
  const m = text.match(/(https?:\/\/)?(s\.12306\.cn\/[\w\-\/]+|12306\.cn\/[\w\-\/]+)/i)
  if (!m) return ''
  const u = m[0]
  return u.startsWith('http') ? u : `https://${u}`
}

function parseTextBlob(blob: string): Partial<Ticket> {
  const t = blob.replace(/\s+/g, ' ')
  const train = (t.match(/\b([GDFZTKC] ?\d{1,4})\b/) || [])[1]?.replace(' ', '')
  const dateMatch = t.match(/(\d{4}-\d{2}-\d{2}|\d{1,2}月\d{1,2}日)/)
  const departTime = (t.match(/(\d{1,2}:\d{2})\s*开/) || [])[1] || (t.match(/(\d{1,2}:\d{2})/) || [])[1]
  const from = (t.match(/([\u4e00-\u9fa5]{2,})站\s*\(/) || [])[1] || (t.match(/从([\u4e00-\u9fa5]{2,})站/) || [])[1]
  const to = (t.match(/至([\u4e00-\u9fa5]{2,})站/) || [])[1] || (t.match(/到([\u4e00-\u9fa5]{2,})站/) || [])[1]
  const seat = t.match(/(\d{1,2})车\s*(\d{1,3})([A-F])/)
  const gate = (t.match(/检票口(?:第)?\s*(\d{1,3})/) || [])[1]
  return {
    trainCode: train || '',
    departDate: dateMatch ? normalizeDate(dateMatch[1]) : '',
    departTime: departTime || '',
    fromStationName: from || '',
    toStationName: to || '',
    seatCar: seat ? seat[1] : undefined,
    seatNo: seat ? `${seat[2]}${seat[3]}` : undefined,
    gate: gate || undefined
  }
}

export async function parseSMSWithUrl(text: string): Promise<Partial<Ticket>> {
  const base = parseSMS(text)
  const url = extractUrl(text)
  if (!url) return base
  try {
    const res = await Taro.request({ url, method: 'GET' })
    const data = res.data as any
    const html = typeof data === 'string' ? data : JSON.stringify(data)
    const ext = parseTextBlob(html)
    return { ...base, ...ext }
  } catch {
    return base
  }
}