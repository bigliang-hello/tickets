import { View, Text } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import './index.module.scss'
import { getTickets } from '../../services/storage'
import { useEffect, useState } from 'react'
import TicketCard from '../../components/TicketCard'
import { guardNavigate } from '../../services/auth'

export default function Index () {
  const [tickets, setTickets] = useState<any[]>([])

  const loadList = async () => {
    const list = await getTickets()
    setTickets(Array.isArray(list) ? list : [])
  }

  useLoad(() => {
    loadList()
  })

  useDidShow(() => {
    loadList()
  })

  const handleAddClick = async () => {
    await guardNavigate('/pages/add/index')
  }

  const handleBellClick = async () => {
    await guardNavigate('/pages/reminders/index')
  }

  return (
    <View className='index'>
      <View className='hero'>
        <View className='hero-left'>
          <View className='hero-icon'>
            <Text className='hero-icon-text'>🚆</Text>
          </View>
          <View className='hero-text'>
            <Text className='title'>我的车票收藏</Text>
            <Text className='subtitle'>用心记录每一次旅程</Text>
          </View>
        </View>
        <View className='bell-btn' onClick={handleBellClick}>
          <Text>🔔</Text>
        </View>
      </View>
      <View className='list-wrapper'>
        {tickets.length === 0 ? (
          <View className='empty'>
            <Text>暂无车票，点击右下角「+」添加车票</Text>
          </View>
        ) : (
          <View className='list'>
            {tickets.map(t => (
              <View
                key={t.id}
                className='item'
                onClick={() => Taro.navigateTo({ url: `/pages/detail/index?id=${t.id}` })}
              >
                <TicketCard ticket={t} />
              </View>
            ))}
          </View>
        )}
      </View>
      <View className='fab' onClick={handleAddClick}>
        <Text>+</Text>
      </View>
    </View>
  )
}
