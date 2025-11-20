import { View, Text } from '@tarojs/components'
import { Ticket } from '../../types/ticket'
import styles from './index.module.scss'

interface Props { ticket: Ticket, onDelete?: (id: string) => void }

export default function TicketCard({ ticket, onDelete }: Props) {
  return (
    <View className={styles['ticket-card']}>
      <View className={styles.card}>
        <View className={`${styles.row} ${styles.top}`}>
          <View className={styles['train-pill']}>
            <View className={styles['train-icon']}>
              <Text className={styles['train-icon-text']}>🚄</Text>
            </View>
            <Text className={styles['train-code']}>{ticket.trainCode}</Text>
          </View>
          <View className={styles['date-badge']}>
            <Text className={styles['date-text']}>{ticket.departDate}</Text>
            {onDelete && (
              <View className={styles.del} onClick={(e) => { e.stopPropagation(); onDelete(ticket.id) }}>
                <Text>🗑️</Text>
              </View>
            )}
          </View>
        </View>
        <View className={`${styles.row} ${styles.mid}`}>
          <View className={styles.col}>
            <Text className={styles.label}>始发站</Text>
            <Text className={styles.station}>{ticket.fromStationName}</Text>
          </View>
          <View className={styles.arrow}>
            <Text className={styles['arrow-text']}>→</Text>
          </View>
          <View className={`${styles.col} ${styles.right}`}>
            <Text className={styles.label}>终点站</Text>
            <Text className={styles.station}>{ticket.toStationName}</Text>
          </View>
        </View>
        <View className={styles.info}>
          <View className={styles['info-grid']}>
            <View className={styles['info-item']}>
              <Text className={styles['info-label']}>到达时间</Text>
              <Text className={styles['info-value']}>{ticket.arriveTime || '-'}</Text>
            </View>
            <View className={styles['info-item']}>
              <Text className={styles['info-label']}>座位号</Text>
              <Text className={styles['info-value']}>{ticket.seatCar && ticket.seatNo ? `${ticket.seatCar}车${ticket.seatNo}` : '-'}</Text>
            </View>
            <View className={styles['info-item']}>
              <Text className={styles['info-label']}>检票口</Text>
              <Text className={styles['info-value']}>{ticket.gate || '-'}</Text>
            </View>
          </View>
          {typeof ticket.price === 'number' && (
            <Text className={styles.price}>¥{ticket.price.toFixed(2)}</Text>
          )}
        </View>
      </View>
    </View>
  )
}