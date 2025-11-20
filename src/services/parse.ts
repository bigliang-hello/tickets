import { apiRequest } from './api'
import { Ticket } from '../types/ticket'

export async function parseSmsRemote(text: string): Promise<Partial<Ticket>> {
  const resp = await apiRequest<Partial<Ticket>>({ url: '/api/parse/sms', method: 'POST', data: { text } })
  return resp
}