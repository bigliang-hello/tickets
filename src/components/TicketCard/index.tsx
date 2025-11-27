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
              <View className='iconfont icon-huoche' style={{ fontSize: '16px', color: '#ffffff' }}></View>
            </View>
            <Text className='train-code'>{ticket.trainCode}</Text>
          </View>
          <View className='date-badge'>
            <Text className='date-text'>{ticket.departDate}</Text>
          </View>
        </View>
        <View className='row mid'>
          <View className='col'>
            <View className='label'>始发站</View>
            <View className='station'>{ticket.fromStationName}</View>
            <View className='time'>{ticket.departTime || '-'}</View>
          </View>
          <View className='arrow'>
            <View className='iconfont icon-jiantou arrow-text'></View>
          </View>
          <View className='col right'>
            <View className='label'>终点站</View>
            <View className='station'>{ticket.toStationName}</View>
            <View className='time'>{ticket.arriveTime || '-'}</View>
          </View>
        </View>
        <View className='info'>
          <View className='info-grid'>
            <View className='info-item'>
              <Text className='info-label'>座位号</Text>
              <Text className='info-value'>{ticket.seatCar && ticket.seatNo ? `${ticket.seatCar}车${ticket.seatNo}` : '-'}</Text>
            </View>
            <View className='info-item'>
              <Text className='info-label'>检票口</Text>
              <Text className='info-value'>{ticket.gate || '-'}</Text>
            </View>
             <View className='info-item'>
              <Text className='info-label'>价格</Text>
              <Text className='info-value price'>¥{ticket.price}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
