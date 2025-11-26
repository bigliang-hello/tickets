import { useEffect, useMemo, useState } from 'react'
import { View, Button, Input, Textarea, Text, Picker } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { Ticket } from '../../types/ticket'
import { getTicketById } from '../../services/storage'
import { apiRequest } from '../../services/request'
import SMSParserInput from '../../components/SMSParserInput'
import ImageOCRUploader from '../../components/ImageOCRUploader'
import './index.module.scss'

export default function Add() {
  const { params } = useRouter()
  const [tab, setTab] = useState<'manual'|'ocr'>('manual')
  const [form, setForm] = useState<Partial<Ticket>>({ departDate: '' })
  const [priceText, setPriceText] = useState('')

  useEffect(() => {
    (async () => {
      if (params.id) {
        const found = await getTicketById(params.id)
        if (found) {
          setForm(found)
          setPriceText(typeof found.price === 'number' ? String(found.price) : '')
        }
      }
    })()
  }, [params.id])

  const valid = useMemo(() => !!form.trainCode && !!form.fromStationName && !!form.toStationName && !!form.departDate, [form])

  const submit = () => {
    if (!valid) { Taro.showToast({ title: '请完善必填项', icon: 'none' }); return }
    const now = Date.now()
    const sourceType = String(form.sourceType || 'MANUAL').toLowerCase() as 'manual'|'sms'|'ocr'
    const payload: any = {
      train_code: form.trainCode,
      from_station: form.fromStationName,
      to_station: form.toStationName,
      start_date: form.departDate,
      depart_time: form.departTime,
      arrive_time: form.arriveTime,
      seat_no: form.seatNo,
      gate: form.gate,
      carriage_no: form.seatCar,
      price: typeof form.price === 'number' ? form.price : undefined,
      source_type: sourceType,
      raw_sms: sourceType === 'sms' ? (form.rawText || '') : undefined,
      raw_ocr_json: sourceType === 'ocr' ? (form.rawText ? { text: form.rawText } : undefined) : undefined,
      note: form.notes
    }
    apiRequest<any>({ url: '/api/tickets', method: 'POST', data: payload }).then(created => {
      Taro.showToast({ title: '已保存', icon: 'success' })
      Taro.navigateBack()
    }).catch(() => {
      Taro.showToast({ title: '保存失败', icon: 'none' })
    })
  }

  const onPriceInput = (e: any) => {
    const v = e.detail.value as string
    setPriceText(v)
    const num = parseFloat(v)
    setForm({ ...form, price: v === '' || Number.isNaN(num) ? undefined : num })
  }

  const tabs = [
    { key: 'manual', label: '手动输入', icon: '✍️' },
    { key: 'ocr', label: '截图识别', icon: '🖼️' }
  ] as const

  return (
    <View className='add-page'>
      <View className='tabsContainer'>
        {tabs.map(item => (
          <View
            key={item.key}
            className={`tab ${tab === item.key ? 'active' : ''}`}
            onClick={() => setTab(item.key)}
          >
            <Text className='tab-icon'>{item.icon}</Text>
            <Text>{item.label}</Text>
          </View>
        ))}
      </View>
      {tab === 'manual' && (
        <View className='card'>
          <SMSParserInput onParsed={data => setForm({ ...form, ...data })} />
        </View>
      )}
      {tab === 'ocr' && (
        <View className='card'>
          <ImageOCRUploader onParsed={(data) => setForm({ ...form, ...data })} />
        </View>
      )}
      <View className='form-card'>
        <View className='grid-2'>
          <View className='form-row'>
            <View className='label'>车次号</View>
            <Input className='input' value={form.trainCode || ''} onInput={e => setForm({ ...form, trainCode: e.detail.value })} placeholder='如：G123' />
          </View>
          <View className='form-row'>
            <View className='label'>出发日期</View>
            <Picker mode='date' value={form.departDate || ''} onChange={e => setForm({ ...form, departDate: e.detail.value })}>
              <View className='input'>{form.departDate || '选择出发日期'}</View>
            </Picker>
          </View>
        </View>
        
        <View className='grid-2'>
          <View className='form-row'>
            <View className='label'>始发站</View>
            <Input className='input' value={form.fromStationName || ''} onInput={e => setForm({ ...form, fromStationName: e.detail.value })} placeholder='如：北京南' />
          </View>
          <View className={`form-row align`}>
            <View className='label'>终点站</View>
            <View className='inline'>
              <Input className='input' value={form.toStationName || ''} onInput={e => setForm({ ...form, toStationName: e.detail.value })} placeholder='如：上海虹桥' />
            </View>
          </View>
        </View>
        <View className='grid-2'>
          <View className='form-row'>
            <View className='label'>出发时间</View>
            <Picker mode='time' value={form.departTime || ''} onChange={e => setForm({ ...form, departTime: e.detail.value })}>
              <View className='input'>{form.departTime || '选择出发时间'}</View>
            </Picker>
          </View>
          <View className='form-row'>
            <View className='label'>到达时间</View>
            <Picker mode='time' value={form.arriveTime || ''} onChange={e => setForm({ ...form, arriveTime: e.detail.value })}>
              <View className='input'>{form.arriveTime || '选择到达时间'}</View>
            </Picker>
          </View>
        </View>
        <View className='grid-2'>
          <View className='form-row'>
            <View className='label'>座位车厢</View>
            <Input className='input' value={form.seatCar || ''} onInput={e => setForm({ ...form, seatCar: e.detail.value })} placeholder='如：05' />
          </View>
          <View className='form-row'>
            <View className='label'>座位号</View>
            <Input className='input' value={form.seatNo || ''} onInput={e => setForm({ ...form, seatNo: e.detail.value })} placeholder='如：06A' />
          </View>
        </View>
        <View className='grid-2'>
          <View className='form-row'>
            <View className='label'>检票口</View>
            <Input className='input' value={form.gate || ''} onInput={e => setForm({ ...form, gate: e.detail.value })} placeholder='如：3A' />
          </View>
          <View className='form-row'>
            <View className='label'>票价</View>
            <Input className='input' type='digit' value={priceText} onInput={onPriceInput} placeholder='如：553.5' />
          </View>
        </View>
        <View className='form-row'>
            <View className='label'>描述</View>
            <Textarea className='textarea' value={form.notes || ''} onInput={e => setForm({ ...form, notes: e.detail.value })} placeholder='如：备注' />
          </View>
      </View>
      <Button className='primary' onClick={submit}>保存</Button>
    </View>
  )
}
