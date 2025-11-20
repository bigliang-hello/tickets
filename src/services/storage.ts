import Taro from '@tarojs/taro'
import { Ticket } from '../types/ticket'

const KEY = 'tickets:data'

export function getTickets(): Ticket[] {
  const data = Taro.getStorageSync(KEY)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveTicket(ticket: Ticket) {
  const list = getTickets()
  const exists = list.findIndex(t => t.id === ticket.id)
  if (exists >= 0) list[exists] = ticket
  else list.unshift(ticket)
  Taro.setStorageSync(KEY, JSON.stringify(list))
}

export function updateTicket(id: string, patch: Partial<Ticket>) {
  const list = getTickets()
  const idx = list.findIndex(t => t.id === id)
  if (idx >= 0) {
    const merged: Ticket = { ...list[idx], ...patch, updatedAt: Date.now() }
    list[idx] = merged
    Taro.setStorageSync(KEY, JSON.stringify(list))
  }
}

export function deleteTicket(id: string) {
  const list = getTickets().filter(t => t.id !== id)
  Taro.setStorageSync(KEY, JSON.stringify(list))
}