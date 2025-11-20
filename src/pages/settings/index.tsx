import { useState, useEffect } from 'react'
import { View, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getSecretId, getSecretKey, getRegion, setSecrets } from '../../services/keys'
import './index.scss'

export default function Settings() {
  const [secretId, setSecretId] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [region, setRegionState] = useState('ap-beijing')
  const regions = ['ap-beijing', 'ap-shanghai', 'ap-guangzhou']

  useEffect(() => {
    setSecretId(getSecretId())
    setSecretKey(getSecretKey())
    setRegionState(getRegion())
  }, [])

  const save = () => {
    setSecrets(secretId.trim(), secretKey.trim(), region)
    Taro.showToast({ title: '已保存', icon: 'success' })
  }

  return (
    <View className='settings'>
      <View className='row'>
        <View className='label'>SecretId</View>
        <Input value={secretId} onInput={e => setSecretId(e.detail.value)} placeholder='输入 SecretId' />
      </View>
      <View className='row'>
        <View className='label'>SecretKey</View>
        <Input value={secretKey} onInput={e => setSecretKey(e.detail.value)} placeholder='输入 SecretKey' password />
      </View>
      <View className='row'>
        <View className='label'>Region</View>
        <Picker mode='selector' range={regions} onChange={e => setRegionState(regions[Number(e.detail.value)])}>
          <View className='picker'>{region}</View>
        </Picker>
      </View>
      <Button className='save' onClick={save}>保存</Button>
    </View>
  )
}