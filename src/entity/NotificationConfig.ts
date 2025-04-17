import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {
  NotificationType,
  NotificationConfig as INotificationConfig,
} from '../stock/types/notification.types';

@Entity('notification_configs')
export class NotificationConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
    unique: true,
  })
  type: NotificationType;

  @Column('json')
  config: INotificationConfig;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
