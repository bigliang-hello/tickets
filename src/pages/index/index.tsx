import { View, Text, Button } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import './index.scss'
import { getTickets } from '../../services/storage'
import { useEffect, useState } from 'react'
import TicketCard from '../../components/TicketCard'

export default function Index () {
  const [tickets, setTickets] = useState(getTickets())

  useLoad(() => {
    setTickets(getTickets())
  })

  useDidShow(() => {
    setTickets(getTickets())
  })

  return (
    <View className='index'>
      <View className='toolbar'>
        <Button onClick={() => Taro.navigateTo({ url: '/pages/add/index' })}>添加车票</Button>
        <Button onClick={() => Taro.navigateTo({ url: '/pages/settings/index' })}>设置</Button>
      </View>
      {tickets.length === 0 ? (
        <View className='empty'>
          <Text>暂无收藏，点击「添加车票」开始</Text>
        </View>
      ) : (
        <View className='list'>
          {tickets.map(t => (
            <View key={t.id} className='item' onClick={() => Taro.navigateTo({ url: `/pages/detail/index?id=${t.id}` })}>
              <TicketCard ticket={t} />
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
