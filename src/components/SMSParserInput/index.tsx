import { useState } from 'react'
import { View, Textarea, Button, Text } from '@tarojs/components'
import { parseSmsRemote } from '../../services/sms'
import styles from './index.module.scss'

interface Props { onParsed: (data: any) => void }

export default function SMSParserInput({ onParsed }: Props) {
  const [text, setText] = useState('')
  const submit = async () => {
    const data = await parseSmsRemote(text)
    onParsed(data)
  }
  return (
    <View className={styles['sms-card']}>
      <View className={styles['sms-title']}>粘贴12306短信</View>
      <Textarea className={styles['sms-input']} value={text} onInput={e => setText(e.detail.value)} placeholder='粘贴12306购票短信，自动识别车次、座位等信息...' />
      <Button className={styles['sms-primary']} onClick={submit}><Text>识别信息</Text></Button>
    </View>
  )
}