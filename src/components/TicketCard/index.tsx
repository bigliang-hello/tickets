import { View, Text } from '@tarojs/components'
import { Ticket } from '../../types/ticket'
import './index.module.scss'

interface Props { ticket: Ticket, onDelete?: (id: string) => void }

export default function TicketCard({ ticket, onDelete }: Props) {
  return (
    <View className='ticket-card'>
      <View className='card'>
        <View className='row top'>
          <View className='train-pill'>
            <View className='train-icon'>
              <Text className='train-icon-text'>🚄</Text>
            </View>
            <Text className='train-code'>{ticket.trainCode}</Text>
          </View>
          <View className='date-badge'>
            <Text className='date-text'>{ticket.departDate}</Text>
            {onDelete && (
              <View className='del' onClick={(e) => { e.stopPropagation(); onDelete(ticket.id) }}>
                <Text>🗑️</Text>
              </View>
            )}
          </View>
        </View>
        <View className='row mid'>
          <View className='col'>
            <Text className='label'>始发站</Text>
            <Text className='station'>{ticket.fromStationName}</Text>
          </View>
          <View className='arrow'>
            <Text className='arrow-text'>→</Text>
          </View>
          <View className='col right'>
            <Text className='label'>终点站</Text>
            <Text className='station'>{ticket.toStationName}</Text>
          </View>
        </View>
        <View className='info'>
          <View className='info-grid'>
            <View className='info-item'>
              <Text className='info-label'>到达时间</Text>
              <Text className='info-value'>{ticket.arriveTime || '-'}</Text>
            </View>
            <View className='info-item'>
              <Text className='info-label'>座位号</Text>
              <Text className='info-value'>{ticket.seatCar && ticket.seatNo ? `${ticket.seatCar}车${ticket.seatNo}` : '-'}</Text>
            </View>
            <View className='info-item'>
              <Text className='info-label'>检票口</Text>
              <Text className='info-value'>{ticket.gate || '-'}</Text>
            </View>
          </View>
          {typeof ticket.price === 'number' && (
            <Text className='price'>¥{ticket.price.toFixed(2)}</Text>
          )}
        </View>
      </View>
    </View>
  )
}
