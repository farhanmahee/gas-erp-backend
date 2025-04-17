import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Store } from './Store';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column({ unique: true })
  product_code: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  unit_price: number;

  @Column('int')
  quantity: number;

  @Column('int')
  min_quantity: number;

  @Column('int')
  max_quantity: number;

  @Column('int')
  reorder_level: number;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('int')
  supplier_id: number;

  @Column('int')
  warehouse_id: number;

  @ManyToOne(() => Store, (store) => store.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ nullable: true })
  store_id: number;
}
