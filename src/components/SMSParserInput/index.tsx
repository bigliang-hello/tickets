import { useState } from 'react'
import { View, Textarea, Button } from '@tarojs/components'
import { parseSMS } from '../../utils/parser'

interface Props { onParsed: (data: any) => void }

export default function SMSParserInput({ onParsed }: Props) {
  const [text, setText] = useState('')
  const submit = () => {
    const data = parseSMS(text)
    onParsed(data)
  }
  return (
    <View>
      <Textarea value={text} onInput={e => setText(e.detail.value)} placeholder='粘贴 12306 短信内容' />
      <Button onClick={submit}>识别并填充</Button>
    </View>
  )
}