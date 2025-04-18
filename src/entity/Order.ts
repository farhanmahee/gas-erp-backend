import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Store } from './Store';
import { Payment } from './Payment';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderNumber: string;

  @ManyToOne(() => User)
  customer: User;

  @ManyToOne(() => Store)
  store: Store;

  @Column({
    type: 'enum',
    enum: [
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
    ],
    default: 'PENDING',
  })
  status: string;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  tax: number;

  @Column('decimal', { precision: 10, scale: 2 })
  shippingCost: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items: OrderItem[];

  @ManyToOne(() => Payment, { nullable: true })
  payment: Payment;

  @Column({ type: 'jsonb', nullable: true })
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone: string;
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
