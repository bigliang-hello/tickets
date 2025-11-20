import { useState } from 'react'
import { View, Button, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiUpload } from '../../services/request'
import styles from './index.module.scss'

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
    <View className={styles['ocr-uploader']}>
      <View className={styles['upload-box']} onClick={pick}>
        {img ? (
          <Image className={styles.preview} src={img} mode='widthFix' />
        ) : (
          <View className={styles.placeholder}>
            <View className={styles['upload-icon']}>
              <Text className={styles['icon-text']}>🖼️+</Text>
            </View>
            <Text className={styles['upload-desc']}>点击上传车票截图</Text>
            <Text className={styles['upload-tip']}>支持JPG、 PNG格式</Text>
          </View>
        )}
      </View>
      <Button className={styles['ocr-primary']} disabled={!img} loading={loading} onClick={recognize}>识别信息</Button>
    </View>
  )
}