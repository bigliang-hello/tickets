import { useEffect, useMemo, useState } from 'react'
import { View, Button, Input, Textarea } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { Ticket } from '../../types/ticket'
import { saveTicket, getTickets } from '../../services/storage'
import { wechatLogin } from '../../services/auth'
import { apiRequest } from '../../services/api'
import SMSParserInput from '../../components/SMSParserInput'
import ImageOCRUploader from '../../components/ImageOCRUploader'
import StationPicker from '../../components/StationPicker'

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function Add() {
  const { params } = useRouter()
  const [tab, setTab] = useState<'sms'|'ocr'|'manual'>('sms')
  const [form, setForm] = useState<Partial<Ticket>>({ departDate: '' })

  useEffect(() => {
    if (params.id) {
      const found = getTickets().find(t => t.id === params.id)
      if (found) setForm(found)
    }
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
      saveTicket(created)
      Taro.showToast({ title: '已保存', icon: 'success' })
      Taro.navigateBack()
    }).catch(() => {
      Taro.showToast({ title: '保存失败', icon: 'none' })
    })
  }

  return (
    <View style={{ padding: 16 }}>
      <View style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Button size='mini' onClick={() => setTab('sms')}>短信识别</Button>
        <Button size='mini' onClick={() => setTab('ocr')}>截图识别</Button>
        <Button size='mini' onClick={() => setTab('manual')}>手动填写</Button>
      </View>
      <View style={{ marginBottom: 12 }}>
        <Button onClick={() => wechatLogin()}>微信登录</Button>
      </View>
      {tab === 'sms' && (
        <View style={{ marginBottom: 12 }}>
          <SMSParserInput onParsed={data => setForm({ ...form, ...data })} />
        </View>
      )}
      {tab === 'ocr' && (
        <View style={{ marginBottom: 12 }}>
          <ImageOCRUploader onParsed={(data) => setForm({ ...form, ...data })} />
        </View>
      )}
      <View style={{ marginBottom: 12 }}>
        <Input value={form.trainCode || ''} onInput={e => setForm({ ...form, trainCode: e.detail.value })} placeholder='车次号' />
      </View>
      <View style={{ marginBottom: 12 }}>
        <Input value={form.fromStationName || ''} onInput={e => setForm({ ...form, fromStationName: e.detail.value })} placeholder='始发站' />
      </View>
      <View style={{ marginBottom: 12 }}>
        <Input value={form.toStationName || ''} onInput={e => setForm({ ...form, toStationName: e.detail.value })} placeholder='终点站' />
      </View>
      <View style={{ marginBottom: 12 }}>
        <StationPicker trainCode={form.trainCode || ''} departDate={form.departDate || ''} onSelect={(name, arrive) => setForm({ ...form, toStationName: name, arriveTime: arrive })} />
      </View>
      <View style={{ marginBottom: 12 }}>
        <Input value={form.departDate || ''} onInput={e => setForm({ ...form, departDate: e.detail.value })} placeholder='出发日期 YYYY-MM-DD' />
      </View>
      <View style={{ marginBottom: 12 }}>
        <Input value={form.departTime || ''} onInput={e => setForm({ ...form, departTime: e.detail.value })} placeholder='出发时间 HH:mm（可选）' />
      </View>
      <View style={{ marginBottom: 12 }}>
        <Input value={form.arriveTime || ''} onInput={e => setForm({ ...form, arriveTime: e.detail.value })} placeholder='到达时间 HH:mm（可选）' />
      </View>
      <View style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <Input value={form.seatCar || ''} onInput={e => setForm({ ...form, seatCar: e.detail.value })} placeholder='车厢（可选）' />
        <Input value={form.seatNo || ''} onInput={e => setForm({ ...form, seatNo: e.detail.value })} placeholder='座位（可选）' />
      </View>
      <View style={{ marginBottom: 12 }}>
        <Input value={form.gate || ''} onInput={e => setForm({ ...form, gate: e.detail.value })} placeholder='检票口（可选）' />
      </View>
      <View style={{ marginBottom: 12 }}>
        <Input type='number' value={typeof form.price === 'number' ? String(form.price) : ''} onInput={e => setForm({ ...form, price: Number(e.detail.value) })} placeholder='票价（可选）' />
      </View>
      <View style={{ marginBottom: 12 }}>
        <Textarea value={form.rawText || ''} onInput={e => setForm({ ...form, rawText: e.detail.value })} placeholder='原始短信/识别文本（可选）' />
      </View>
      <Button onClick={submit}>保存</Button>
    </View>
  )
}