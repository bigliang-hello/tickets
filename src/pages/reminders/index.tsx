import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import './index.module.scss'
import { getReminders, deleteReminder } from '../../services/reminder'
import { guardNavigate } from '../../services/auth'
import type { Reminder } from '../../types/reminder'

export default function RemindersIndex() {
  const [list, setList] = useState<Reminder[]>([])

  const load = async () => {
    try {
      const data = await getReminders()
      setList(Array.isArray(data) ? data : [])
    } catch {
      setList([])
    }
  }

  useEffect(() => { load() }, [])
  useDidShow(() => { load() })

  const toNew = async () => { await guardNavigate('/pages/reminders/new') }
  const remove = async (id: string) => {
    try { await deleteReminder(id); Taro.showToast({ title: '已删除', icon: 'success' }); load() } catch { Taro.showToast({ title: '删除失败', icon: 'none' }) }
  }

  return (
    <View className='page'>
      <View className='hero'>
        <Text className='title'>买票提醒</Text>
      </View>
      <View className='listWrapper'>
        {list.length === 0 ? (
          <View className='empty'><Text>暂无提醒，点击右下角「+」新建</Text></View>
        ) : (
          <View className='list'>
            {list.map(item => (
              <View key={item.id} className='item' onClick={() => Taro.navigateTo({ url: `/pages/reminders/new?id=${item.id}` })}>
                <View className='card'>
                  <View className='row'>
                    <View className='left'>
                      <View className='icon'><Text>{item.icon || '📘'}</Text></View>
                      <View>
                        <Text className='itemTitle'>{item.title}</Text>
                        {!!item.description && (<Text className='itemDesc'>{item.description}</Text>)}
                      </View>
                    </View>
                    <View className='badge'><Text>{item.remindTime}</Text></View>
                  </View>
                  <View className='ops'>
                    <View className='btn' onClick={(e) => { e.stopPropagation(); remove(item.id) }}><Text>删除</Text></View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      <View className='fab' onClick={toNew}><Text>+</Text></View>
    </View>
  )
}
