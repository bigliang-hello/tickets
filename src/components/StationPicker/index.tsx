import { useEffect, useState } from 'react'
import { View, Button, Picker } from '@tarojs/components'
import { apiRequest } from '../../services/api'

interface Props {
  trainCode: string
  departDate: string
  onSelect: (name: string, arriveTime?: string) => void
}

export default function StationPicker({ trainCode, departDate, onSelect }: Props) {
  const [stations, setStations] = useState<string[]>([])
  const [arriveTimes, setArriveTimes] = useState<Record<string, string>>({})
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!trainCode || !departDate) return
    apiRequest<{ stations: { name: string, arriveTime?: string }[] }>({ url: `/api/train/${encodeURIComponent(trainCode)}/stations`, method: 'GET', data: { date: departDate } }).then(resp => {
      const list = resp.stations || []
      setStations(list.map(x => x.name))
      const m: Record<string, string> = {}
      list.forEach(x => { if (x.arriveTime) m[x.name] = x.arriveTime })
      setArriveTimes(m)
    }).catch(() => {})
  }, [trainCode, departDate])

  return (
    <View>
      <Picker mode='selector' range={stations} onChange={e => setIndex(Number(e.detail.value))}>
        <Button disabled={stations.length === 0}>选择目的地</Button>
      </Picker>
      {stations.length > 0 && (
        <Button onClick={() => onSelect(stations[index], arriveTimes[stations[index]])}>填充</Button>
      )}
    </View>
  )
}