import { useState } from 'react'
import { View, Textarea, Button, Text } from '@tarojs/components'
import { parseSmsRemote } from '../../services/sms'
import './index.module.scss'

interface Props { onParsed: (data: any) => void }

export default function SMSParserInput({ onParsed }: Props) {
  const [text, setText] = useState('')
  const submit = async () => {
    const data = await parseSmsRemote(text)
    onParsed(data)
  }
  return (
    <View className='sms-card'>
      <View className='sms-title'>粘贴12306短信</View>
      <View className='sms-input-box'>
        <Textarea
          className='sms-input'
          value={text}
          onInput={e => setText(e.detail.value)}
          placeholder='如：您已成功购买G1234次列车05车06A座...'
        />
      </View>
      <Button className='sms-primary' onClick={submit}><Text>识别信息</Text></Button>
    </View>
  )
}
