export type RepeatRule = 'none' | 'daily' | 'weekly' | 'monthly'

export interface Reminder {
  id: string
  title: string
  description?: string
  icon?: string
  allDay: boolean
  startDate: string
  startTime?: string
  repeat: RepeatRule
  repeatDayOfWeek?: number
  endRepeat: 'never' | 'date'
  endDate?: string
  remindTime: string
  notifyEnabled: boolean
  status: 'active' | 'paused'
  createdAt: number
  updatedAt: number
}

export type ReminderCreatePayload = Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: 'active' | 'paused' }

