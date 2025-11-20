export type SourceType = 'SMS' | 'OCR' | 'MANUAL'

export interface Ticket {
  id: string
  trainCode: string
  fromStationName: string
  fromStationCode?: string
  toStationName: string
  toStationCode?: string
  departDate: string
  departTime?: string
  arriveTime?: string
  seatCar?: string
  seatNo?: string
  seatType?: string
  gate?: string
  price?: number
  sourceType: SourceType
  rawText?: string
  imageUrl?: string
  notes?: string
  createdAt: number
  updatedAt: number
}