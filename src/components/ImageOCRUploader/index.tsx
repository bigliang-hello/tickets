import { useState } from 'react'
import { View, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiUpload } from '../../services/api'

interface Props { onParsed: (data: any, raw: string[]) => void }

export default function ImageOCRUploader({ onParsed }: Props) {
  const [img, setImg] = useState('')
  const [loading, setLoading] = useState(false)

  const pick = async () => {
    const res = await Taro.chooseImage({ count: 1, sizeType: ['compressed'] })
    const path = res.tempFilePaths[0]
    setImg(path)
  }

  const recognize = async () => {
    if (!img) return
    setLoading(true)
    try {
      const resp = await apiUpload<{ lines: string[] }>('/api/ocr', img, 'file')
      const lines = resp.lines || []
      const joined = lines.join(' ')
      onParsed({ rawText: joined, sourceType: 'OCR' }, lines)
    } catch (e: any) {
      Taro.showToast({ title: e.message || '识别失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View>
      <Button onClick={pick}>选取截图</Button>
      {!!img && <Image src={img} mode='widthFix' />}
      <Button disabled={!img} loading={loading} onClick={recognize}>OCR 识别</Button>
    </View>
  )
}