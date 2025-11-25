import { useEffect, useMemo, useState } from 'react'
import { View, Text, Input, Switch, Picker, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import styles from './new.module.scss'
import { createReminder, getReminderById, subscribeReminder, updateReminder } from '../../services/reminder'
import type { Reminder, RepeatRule } from '../../types/reminder'

const ICONS = ['📝','🛒','🚆','⏰','📘','🔔','🧭','🎯']
const REPEAT_OPTIONS: { label: string, value: RepeatRule }[] = [
  { label: '不重复', value: 'none' },
  { label: '每日', value: 'daily' },
  { label: '每周', value: 'weekly' },
  { label: '每月', value: 'monthly' }
]
const END_REPEAT_OPTIONS = ['永不', '指定日期']
const REMINDER_TMPL_ID = process.env.REMINDER_TMPL_ID || ''

export default function ReminderNew() {
  const { params } = useRouter()
  const [form, setForm] = useState<Partial<Reminder>>({
    title: '', description: '', icon: '📘', allDay: true,
    startDate: '', startTime: '', repeat: 'none', endRepeat: 'never', remindTime: '08:00', notifyEnabled: true
  })

  useEffect(() => {
    (async () => {
      if (params.id) {
        const r = await getReminderById(params.id)
        if (r) setForm(r)
      }
    })()
  }, [params.id])

  const valid = useMemo(() => {
    if (!form.title || !form.startDate || !form.remindTime) return false
    if (form.allDay === false && !form.startTime) return false
    if (form.endRepeat === 'date' && !form.endDate) return false
    if (form.repeat === 'weekly' && typeof form.repeatDayOfWeek !== 'number') return false
    return true
  }, [form])

  const chooseIcon = (i: string) => setForm({ ...form, icon: i })

  const save = async () => {
    if (!valid) { Taro.showToast({ title: '请完善表单', icon: 'none' }); return }
    try {
      let created: Reminder
      if (params.id) {
        const updated = await updateReminder(params.id, form as Reminder)
        created = updated
      } else {
        created = await createReminder({
          title: form.title!, description: form.description, icon: form.icon,
          allDay: !!form.allDay, startDate: form.startDate!, startTime: form.allDay ? undefined : form.startTime,
          repeat: (form.repeat || 'none') as RepeatRule, repeatDayOfWeek: form.repeat === 'weekly' ? form.repeatDayOfWeek : undefined,
          endRepeat: (form.endRepeat || 'never') as 'never'|'date', endDate: form.endRepeat === 'date' ? form.endDate : undefined,
          remindTime: form.remindTime!, notifyEnabled: !!form.notifyEnabled
        })
      }
      if (form.notifyEnabled && REMINDER_TMPL_ID) {
        try {
          const subRes = await Taro.requestSubscribeMessage({ tmplIds: [REMINDER_TMPL_ID] })
          const granted = subRes[REMINDER_TMPL_ID] === 'accept'
          if (granted) await subscribeReminder(created.id, [REMINDER_TMPL_ID])
        } catch {}
      }
      Taro.showToast({ title: '已保存', icon: 'success' })
      Taro.navigateBack()
    } catch {
      Taro.showToast({ title: '保存失败', icon: 'none' })
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.card}>
        <Text className={styles.title}>新建提醒</Text>
        <View className={styles.formRow}>
          <View className={styles.label}>任务名称</View>
          <Input className={styles.input} value={form.title || ''} onInput={e => setForm({ ...form, title: e.detail.value })} placeholder='请输入任务名称' />
        </View>
        <View className={styles.formRow}>
          <View className={styles.label}>任务图标</View>
          <View className={styles.iconGrid}>
            {ICONS.map(i => (
              <View key={i} className={`${styles.iconItem} ${form.icon === i ? styles.iconItemActive : ''}`} onClick={() => chooseIcon(i)}><Text>{i}</Text></View>
            ))}
          </View>
        </View>
        <View className={styles.formRow}>
          <View className={styles.label}>任务描述</View>
          <Input className={styles.input} value={form.description || ''} onInput={e => setForm({ ...form, description: e.detail.value })} placeholder='可选' />
        </View>
        <View className={styles.formRow}>
          <View className={styles.inline}>
            <View className={styles.label}>全天事件</View>
            <Switch checked={!!form.allDay} onChange={e => setForm({ ...form, allDay: e.detail.value })} />
          </View>
        </View>
        <View className={styles.grid2}>
          <View className={styles.formRow}>
            <View className={styles.label}>开始日期</View>
            <Picker mode='date' value={form.startDate || ''} onChange={e => setForm({ ...form, startDate: e.detail.value })}>
              <View className={styles.input}>{form.startDate || '请选择日期'}</View>
            </Picker>
          </View>
          {!form.allDay && (
            <View className={styles.formRow}>
              <View className={styles.label}>开始时间</View>
              <Picker mode='time' value={form.startTime || ''} onChange={e => setForm({ ...form, startTime: e.detail.value })}>
                <View className={styles.input}>{form.startTime || '请选择时间'}</View>
              </Picker>
            </View>
          )}
        </View>
        <View className={styles.formRow}>
          <View className={styles.label}>重复</View>
          <Picker mode='selector' range={REPEAT_OPTIONS.map(x => x.label)} onChange={e => setForm({ ...form, repeat: REPEAT_OPTIONS[Number(e.detail.value)].value })}>
            <View className={styles.input}>{REPEAT_OPTIONS.find(x => x.value === form.repeat)?.label || '不重复'}</View>
          </Picker>
        </View>
        {form.repeat === 'weekly' && (
          <View className={styles.formRow}>
            <View className={styles.label}>每周星期</View>
            <Picker mode='selector' range={['周日','周一','周二','周三','周四','周五','周六']} onChange={e => setForm({ ...form, repeatDayOfWeek: Number(e.detail.value) })}>
              <View className={styles.input}>{typeof form.repeatDayOfWeek === 'number' ? ['周日','周一','周二','周三','周四','周五','周六'][form.repeatDayOfWeek!] : '请选择星期'}</View>
            </Picker>
          </View>
        )}
        <View className={styles.formRow}>
          <View className={styles.label}>结束重复</View>
          <Picker mode='selector' range={END_REPEAT_OPTIONS} onChange={e => setForm({ ...form, endRepeat: Number(e.detail.value) === 0 ? 'never' : 'date', endDate: Number(e.detail.value) === 0 ? undefined : form.endDate })}>
            <View className={styles.input}>{form.endRepeat === 'date' ? '指定日期' : '永不'}</View>
          </Picker>
        </View>
        {form.endRepeat === 'date' && (
          <View className={styles.formRow}>
            <View className={styles.label}>结束日期</View>
            <Picker mode='date' value={form.endDate || ''} onChange={e => setForm({ ...form, endDate: e.detail.value })}>
              <View className={styles.input}>{form.endDate || '请选择结束日期'}</View>
            </Picker>
          </View>
        )}
        <View className={styles.formRow}>
          <View className={styles.label}>提醒时间</View>
          <Picker mode='time' value={form.remindTime || ''} onChange={e => setForm({ ...form, remindTime: e.detail.value })}>
            <View className={styles.input}>{form.remindTime || '请选择提醒时间'}</View>
          </Picker>
        </View>
        <View className={styles.formRow}>
          <View className={styles.inline}>
            <View className={styles.label}>开启通知</View>
            <Switch checked={!!form.notifyEnabled} onChange={e => setForm({ ...form, notifyEnabled: e.detail.value })} />
          </View>
        </View>
      </View>
      <Button className={styles.btnPrimary} onClick={save}><Text>{params.id ? '保存' : '新建任务'}</Text></Button>
    </View>
  )
}

