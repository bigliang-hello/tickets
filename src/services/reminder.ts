import { apiRequest } from './request'
import type { Reminder, ReminderCreatePayload } from '../types/reminder'

export async function getReminders(): Promise<Reminder[]> {
  const resp: any = await apiRequest<any>({ url: '/api/reminders', method: 'GET' })
  return Array.isArray(resp) ? (resp as Reminder[]) : []
}

export async function getReminderById(id: string): Promise<Reminder | null> {
  try {
    const r = await apiRequest<Reminder>({ url: `/api/reminders/${encodeURIComponent(id)}`, method: 'GET' })
    return r
  } catch {
    return null
  }
}

export async function createReminder(payload: ReminderCreatePayload): Promise<Reminder> {
  const created = await apiRequest<Reminder>({ url: '/api/reminders', method: 'POST', data: payload })
  return created
}

export async function updateReminder(id: string, patch: Partial<Reminder>): Promise<Reminder> {
  const updated = await apiRequest<Reminder>({ url: `/api/reminders/${encodeURIComponent(id)}`, method: 'PUT', data: patch })
  return updated
}

export async function deleteReminder(id: string): Promise<void> {
  await apiRequest<void>({ url: `/api/reminders/${encodeURIComponent(id)}`, method: 'DELETE' })
}

export async function subscribeReminder(id: string, tmplIds: string[], data?: Record<string, any>): Promise<void> {
  await apiRequest<void>({ url: `/api/reminders/${encodeURIComponent(id)}/subscribe`, method: 'POST', data: { tmplIds, ...(data || {}) } })
}
