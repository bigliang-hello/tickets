import { View, Text } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import styles from './index.module.scss'
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

  return (
    <View className={styles.index}>
      <View className={styles.hero}>
        <View className={styles['hero-left']}>
          <View className={styles['hero-icon']}>
            <Text className={styles['hero-icon-text']}>🚆</Text>
          </View>
          <View>
            <Text className={styles.title}>我的车票收藏</Text>
            <Text className={styles.subtitle}>用心记录每一次旅程</Text>
          </View>
        </View>
        <View className={styles['add-btn']} onClick={handleAddClick}>
          <Text>+</Text>
        </View>
      </View>
      <View className={styles['list-wrapper']}>
        {tickets.length === 0 ? (
          <View className={styles.empty}>
            <Text>暂无收藏，点击右上角「+」添加车票</Text>
          </View>
        ) : (
          <View className={styles.list}>
            {tickets.map(t => (
              <View
                key={t.id}
                className={styles.item}
                onClick={() => Taro.navigateTo({ url: `/pages/detail/index?id=${t.id}` })}
              >
                <TicketCard ticket={t} />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}
