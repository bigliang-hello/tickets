import { View, Text } from '@tarojs/components'
import Taro, { useLoad, useDidShow, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import './index.module.scss'
import { getTicketsPaged } from '../../services/storage'
import { useEffect, useState } from 'react'
import TicketCard from '../../components/TicketCard'
import { guardNavigate } from '../../services/auth'

export default function Index () {
  const [tickets, setTickets] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 10

  const loadList = async () => {
    try {
      setLoading(true)
      const list = await getTicketsPaged(1, PAGE_SIZE)
      setTickets(Array.isArray(list) ? list : [])
      setPage(1)
      setHasMore((Array.isArray(list) ? list.length : 0) >= PAGE_SIZE)
    } catch {
      setTickets([])
      setPage(1)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const nextPage = page + 1
      const list = await getTicketsPaged(nextPage, PAGE_SIZE)
      setTickets(prev => [...prev, ...list])
      setPage(nextPage)
      if (list.length < PAGE_SIZE) setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  useLoad(() => {
    loadList()
  })

  useDidShow(() => {
    loadList()
  })

  usePullDownRefresh(() => {
    loadList().finally(() => {
      Taro.stopPullDownRefresh()
    })
  })

  useReachBottom(() => {
    loadMore()
  })

  const handleAddClick = async () => {
    await guardNavigate('/pages/add/index')
  }

  const handleBellClick = async () => {
    await guardNavigate('/pages/reminders/index')
  }

  return (
    <View className='index'>
      <View className='list-wrapper'>
        {tickets.length === 0 ? (
          <View className='empty'>
            <View className='iconfont icon-fapiaojia' style={{ fontSize: '80px', marginBottom: '20px' }}></View>
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
            {tickets.length > 0 && (
              <View style={{ textAlign: 'center', color: '#8598b3', padding: '12rpx' }}>
                <Text>{loading ? '加载中...' : (hasMore ? '上拉加载更多' : '没有更多了')}</Text>
              </View>
            )}
          </View>
        )}
      </View>
      <View className='fab' onClick={handleAddClick}>
        <View className='iconfont icon-jiahao' style={{ fontSize: '24px' }}></View>
      </View>
    </View>
  )
}
