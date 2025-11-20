import { apiRequest } from './request'
import { Ticket } from '../types/ticket'

export async function parseSmsRemote(text: string): Promise<Partial<Ticket>> {
  const resp = await apiRequest<Partial<Ticket>>({ url: '/api/parse/sms', method: 'POST', data: { text } })
  return resp
}

export async function parseSMSPreferUrl(text: string): Promise<Partial<Ticket>> {
  const resp = await parseSmsRemote(text)
  return { ...resp, rawText: text }
}