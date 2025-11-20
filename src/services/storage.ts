import { Ticket } from '../types/ticket'
import { apiRequest } from './request'

export async function getTickets(): Promise<Ticket[]> {
  const resp = await apiRequest<Ticket[]>({ url: '/api/tickets', method: 'GET' })
  return resp
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  try {
    const resp = await apiRequest<Ticket>({ url: `/api/tickets/${encodeURIComponent(id)}`, method: 'GET' })
    return resp
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