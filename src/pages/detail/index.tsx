import { useEffect, useState } from 'react'
import { View, Button, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { getTicketById, deleteTicket } from '../../services/storage'
// import TicketCard from '../../components/TicketCard'
import { Ticket } from '../../types/ticket'

export default function Detail() {
  const { params } = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    (async () => {
      const found = await getTicketById(params.id as string)
      setTicket(found || null)
    })()
  }, [params.id])

  const remove = async () => {
    if (!ticket) return
    await deleteTicket(ticket.id)
    Taro.showToast({ title: '已删除', icon: 'success' })
    Taro.navigateBack()
  }

  return (
    <View style={{ padding: 16 }}>
      {ticket && (
        <View className='ticket-card'>
          <Text>标题：{ticket.gate}</Text>
          <Text>内容：{ticket.notes}</Text>
        </View>
      )}
      <View style={{ marginTop: 16 }}>
        <Button onClick={() => Taro.navigateTo({ url: `/pages/add/index?id=${ticket?.id}` })}>编辑</Button>
        <Button onClick={remove}>删除</Button>
      </View>
    </View>
  )
}