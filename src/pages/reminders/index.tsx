import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import styles from './index.module.scss'
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
    <View className={styles.page}>
      <View className={styles.hero}>
        <Text className={styles.title}>买票提醒</Text>
      </View>
      <View className={styles.listWrapper}>
        {list.length === 0 ? (
          <View className={styles.empty}><Text>暂无提醒，点击右下角「+」新建</Text></View>
        ) : (
          <View className={styles.list}>
            {list.map(item => (
              <View key={item.id} className={styles.item} onClick={() => Taro.navigateTo({ url: `/pages/reminders/new?id=${item.id}` })}>
                <View className={styles.card}>
                  <View className={styles.row}>
                    <View className={styles.left}>
                      <View className={styles.icon}><Text>{item.icon || '📘'}</Text></View>
                      <View>
                        <Text className={styles.itemTitle}>{item.title}</Text>
                        {!!item.description && (<Text className={styles.itemDesc}>{item.description}</Text>)}
                      </View>
                    </View>
                    <View className={styles.badge}><Text>{item.remindTime}</Text></View>
                  </View>
                  <View className={styles.ops}>
                    <View className={styles.btn} onClick={(e) => { e.stopPropagation(); remove(item.id) }}><Text>删除</Text></View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      <View className={styles.fab} onClick={toNew}><Text>+</Text></View>
    </View>
  )
}

