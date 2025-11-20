import { useEffect, useState } from 'react'
import { View, Button, Picker } from '@tarojs/components'
import { getRouteStations } from '../../services/train'

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
    getRouteStations(trainCode, departDate).then(list => {
      setStations(list.map(x => x.name))
      const m: Record<string, string> = {}
      list.forEach(x => { if (x.arriveTime) m[x.name] = x.arriveTime })
      setArriveTimes(m)
    })
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