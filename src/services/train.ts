export interface RouteStation {
  name: string
  arriveTime?: string
  departTime?: string
}

export async function getRouteStations(trainCode: string, departDate: string): Promise<RouteStation[]> {
  const sample: RouteStation[] = [
    { name: '始发站', departTime: '08:00' },
    { name: '中途站', arriveTime: '09:30', departTime: '09:35' },
    { name: '终点站', arriveTime: '11:00' }
  ]
  return sample
}