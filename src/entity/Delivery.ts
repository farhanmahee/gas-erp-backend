import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Store } from './Store';
import { StockMovement } from './StockMovement';

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  trackingNumber: string;

  @ManyToOne(() => User)
  driver: User;

  @ManyToOne(() => Store)
  sourceStore: Store;

  @ManyToOne(() => Store)
  destinationStore: Store;

  @OneToMany(() => StockMovement, (movement) => movement.delivery)
  movements: StockMovement[];

  @Column({
    type: 'enum',
    enum: ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: string;

  @Column('jsonb')
  route: {
    startLocation: { lat: number; lng: number };
    endLocation: { lat: number; lng: number };
    waypoints?: { lat: number; lng: number }[];
  };

  @Column('jsonb', { nullable: true })
  currentLocation: {
    lat: number;
    lng: number;
    timestamp: Date;
    speed?: number;
  };

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  deliveryProof: {
    signature?: string;
    photos?: string[];
    receivedBy?: string;
    notes?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
