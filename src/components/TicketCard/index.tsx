import { View, Image, Text } from '@tarojs/components'
import { Ticket } from '../../types/ticket'
import placeholder from '../../assets/ticket-placeholder.svg'
import './index.scss'

interface Props { ticket: Ticket }

export default function TicketCard({ ticket }: Props) {
  return (
    <View className='ticket-card'>
      <Image className='bg' src={placeholder} mode='widthFix' />
      <View className='overlay'>
        <Text className='train'>{ticket.trainCode}</Text>
        <Text className='from'>{ticket.fromStationName}</Text>
        <Text className='to'>{ticket.toStationName}</Text>
        <Text className='date'>{ticket.departDate}</Text>
        {!!ticket.departTime && <Text className='depart'>{ticket.departTime}</Text>}
        {!!ticket.arriveTime && <Text className='arrive'>{ticket.arriveTime}</Text>}
        {!!ticket.seatCar && !!ticket.seatNo && (
          <Text className='seat'>{`${ticket.seatCar}车${ticket.seatNo}座`}</Text>
        )}
        {!!ticket.gate && <Text className='gate'>{`检票口 ${ticket.gate}`}</Text>}
        {typeof ticket.price === 'number' && <Text className='price'>{`¥${ticket.price.toFixed(2)}`}</Text>}
      </View>
    </View>
  )
}