import { Ticket, SourceType } from '../types/ticket'
import { apiRequest } from './request'

function mapSourceType(s: any): SourceType {
  const v = String(s || '').toLowerCase()
  if (v === 'sms') return 'SMS'
  if (v === 'ocr') return 'OCR'
  return 'MANUAL'
}

function toTicket(x: any): Ticket {
  const now = Date.now()
  return {
    id: String(x.id || x.uuid || x._id || ''),
    trainCode: String(x.train_code || x.trainCode || ''),
    fromStationName: String(x.from_station || x.fromStationName || ''),
    fromStationCode: x.from_station_code || x.fromStationCode,
    toStationName: String(x.to_station || x.toStationName || ''),
    toStationCode: x.to_station_code || x.toStationCode,
    departDate: String(x.start_date || x.departDate || ''),
    departTime: x.depart_time || x.departTime,
    arriveTime: x.arrive_time || x.arriveTime,
    seatCar: x.carriage_no || x.seatCar,
    seatNo: x.seat_no || x.seatNo,
    seatType: x.seat_type || x.seatType,
    gate: x.gate,
    price: typeof x.price === 'number' ? x.price : undefined,
    sourceType: mapSourceType(x.source_type || x.sourceType),
    rawText: x.raw_sms || x.rawText,
    imageUrl: x.image_url || x.imageUrl,
    notes: x.note || x.notes,
    createdAt: typeof x.created_at === 'number' ? x.created_at : (x.createdAt || now),
    updatedAt: typeof x.updated_at === 'number' ? x.updated_at : (x.updatedAt || now)
  }
}

export async function getTickets(): Promise<Ticket[]> {
  try {
    const resp: any = await apiRequest<any>({ url: '/api/tickets', method: 'GET' })
    const list: any[] = Array.isArray(resp) ? resp : (Array.isArray(resp?.data) ? resp.data : (Array.isArray(resp?.items) ? resp.items : []))
    return list.map(toTicket)
  } catch {
    return []
  }
}

export async function getTicketsPaged(page: number, pageSize: number): Promise<Ticket[]> {
  try {
    const resp: any = await apiRequest<any>({ url: '/api/tickets', method: 'GET', data: { page, pageSize } })
    const list: any[] = Array.isArray(resp) ? resp : (Array.isArray(resp?.data) ? resp.data : (Array.isArray(resp?.items) ? resp.items : []))
    return list.map(toTicket)
  } catch {
    return []
  }
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  try {
    const resp: any = await apiRequest<any>({ url: `/api/tickets/${encodeURIComponent(id)}`, method: 'GET' })
    const obj = resp && typeof resp === 'object' && !Array.isArray(resp) ? (resp.data || resp.item || resp) : null
    return obj ? toTicket(obj) : null
  } catch {
    return null
  }
}

export async function saveTicket(ticket: Ticket): Promise<Ticket> {
  const created = await apiRequest<Ticket>({ url: '/api/tickets', method: 'POST', data: ticket })
  return created
}

export async function updateTicket(id: string, patch: Partial<Ticket>): Promise<Ticket> {
  const updated = await apiRequest<Ticket>({ url: `/api/tickets/${encodeURIComponent(id)}`, method: 'PUT', data: patch })
  return updated
}

export async function deleteTicket(id: string): Promise<void> {
  await apiRequest<void>({ url: `/api/tickets/${encodeURIComponent(id)}`, method: 'DELETE' })
}