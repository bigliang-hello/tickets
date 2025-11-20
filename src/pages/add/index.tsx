import { useEffect, useMemo, useState } from 'react'
import { View, Button, Input, Textarea } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { Ticket } from '../../types/ticket'
import { getTicketById } from '../../services/storage'
import { wechatLogin } from '../../services/auth'
import { apiRequest } from '../../services/request'
import SMSParserInput from '../../components/SMSParserInput'
import ImageOCRUploader from '../../components/ImageOCRUploader'
import StationPicker from '../../components/StationPicker'
import styles from './index.module.scss'

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function Add() {
  const { params } = useRouter()
  const [tab, setTab] = useState<'sms'|'ocr'|'manual'>('sms')
  const [form, setForm] = useState<Partial<Ticket>>({ departDate: '' })

  useEffect(() => {
    (async () => {
      if (params.id) {
        const found = await getTicketById(params.id)
        if (found) setForm(found)
      }
    })()
  }, [params.id])

  const valid = useMemo(() => !!form.trainCode && !!form.fromStationName && !!form.toStationName && !!form.departDate, [form])

  const submit = () => {
    if (!valid) { Taro.showToast({ title: '请完善必填项', icon: 'none' }); return }
    const now = Date.now()
    const ticket: Ticket = {
      id: (form.id as string) || uuid(),
      trainCode: form.trainCode as string,
      fromStationName: form.fromStationName as string,
      toStationName: form.toStationName as string,
      departDate: form.departDate as string,
      departTime: form.departTime,
      arriveTime: form.arriveTime,
      seatCar: form.seatCar,
      seatNo: form.seatNo,
      seatType: form.seatType,
      gate: form.gate,
      price: form.price,
      sourceType: form.sourceType || 'MANUAL',
      rawText: form.rawText,
      imageUrl: form.imageUrl,
      notes: form.notes,
      createdAt: form.createdAt || now,
      updatedAt: now
    }
    apiRequest<Ticket>({ url: '/api/tickets', method: 'POST', data: ticket }).then(created => {
      Taro.showToast({ title: '已保存', icon: 'success' })
      Taro.navigateBack()
    }).catch(() => {
      Taro.showToast({ title: '保存失败', icon: 'none' })
    })
  }

  return (
    <View className={styles['add-page']}>
      <View className={styles.tabs}>
        <View className={`${styles.tab} ${tab === 'sms' ? styles.active : ''}`} onClick={() => setTab('sms')}>短信识别</View>
        <View className={`${styles.tab} ${tab === 'ocr' ? styles.active : ''}`} onClick={() => setTab('ocr')}>截图识别</View>
        <View className={`${styles.tab} ${tab === 'manual' ? styles.active : ''}`} onClick={() => setTab('manual')}>手动输入</View>
      </View>
      <View className={styles['login-row']}>
        <Button className={styles['login-btn']} onClick={() => wechatLogin()}>微信登录</Button>
      </View>
      {tab === 'sms' && (
        <View className={styles.card}>
          <View className={styles['card-title']}>粘贴12306短信</View>
          <SMSParserInput onParsed={data => setForm({ ...form, ...data })} />
        </View>
      )}
      {tab === 'ocr' && (
        <View className={styles.card}>
          <ImageOCRUploader onParsed={(data) => setForm({ ...form, ...data })} />
        </View>
      )}
      <View className={styles['form-card']}>
        <View className={styles['form-row']}>
          <View className={styles.label}>车次号</View>
          <Input className={styles.input} value={form.trainCode || ''} onInput={e => setForm({ ...form, trainCode: e.detail.value })} placeholder='如：G123' />
        </View>
        <View className={styles['form-row']}>
          <View className={styles.label}>始发站</View>
          <Input className={styles.input} value={form.fromStationName || ''} onInput={e => setForm({ ...form, fromStationName: e.detail.value })} placeholder='如：北京南' />
        </View>
        <View className={`${styles['form-row']} ${styles.align}`}>
          <View className={styles.label}>终点站</View>
          <View className={styles.inline}>
            <Input className={styles.input} value={form.toStationName || ''} onInput={e => setForm({ ...form, toStationName: e.detail.value })} placeholder='如：上海虹桥' />
            <View className={styles['inline-btn']}>
              <StationPicker trainCode={form.trainCode || ''} departDate={form.departDate || ''} onSelect={(name, arrive) => setForm({ ...form, toStationName: name, arriveTime: arrive })} />
            </View>
          </View>
        </View>
        <View className={styles['grid-2']}>
          <View className={styles['form-row']}>
            <View className={styles.label}>出发日期</View>
            <Input className={styles.input} value={form.departDate || ''} onInput={e => setForm({ ...form, departDate: e.detail.value })} placeholder='如：2024-03-15' />
          </View>
          <View className={styles['form-row']}>
            <View className={styles.label}>到达时间</View>
            <Input className={styles.input} value={form.arriveTime || ''} onInput={e => setForm({ ...form, arriveTime: e.detail.value })} placeholder='如：14:30' />
          </View>
        </View>
        <View className={styles['grid-2']}>
          <View className={styles['form-row']}>
            <View className={styles.label}>座位车厢</View>
            <Input className={styles.input} value={form.seatCar || ''} onInput={e => setForm({ ...form, seatCar: e.detail.value })} placeholder='如：05' />
          </View>
          <View className={styles['form-row']}>
            <View className={styles.label}>座位号</View>
            <Input className={styles.input} value={form.seatNo || ''} onInput={e => setForm({ ...form, seatNo: e.detail.value })} placeholder='如：06A' />
          </View>
        </View>
        <View className={styles['grid-2']}>
          <View className={styles['form-row']}>
            <View className={styles.label}>检票口</View>
            <Input className={styles.input} value={form.gate || ''} onInput={e => setForm({ ...form, gate: e.detail.value })} placeholder='如：3A' />
          </View>
          <View className={styles['form-row']}>
            <View className={styles.label}>票价</View>
            <Input className={styles.input} type='number' value={typeof form.price === 'number' ? String(form.price) : ''} onInput={e => setForm({ ...form, price: Number(e.detail.value) })} placeholder='如：553.5' />
          </View>
        </View>
        <View className={styles['form-row']}>
          <View className={styles.label}>识别文本</View>
          <Textarea className={styles.textarea} value={form.rawText || ''} onInput={e => setForm({ ...form, rawText: e.detail.value })} placeholder='原始短信/识别文本' />
        </View>
      </View>
      <Button className={styles.primary} onClick={submit}>保存</Button>
    </View>
  )
}