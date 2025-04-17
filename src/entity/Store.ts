import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './Product';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  store_id: number;

  @Column({ unique: true })
  store_code: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  postal_code: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_sales: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.store, {
    cascade: true,
  })
  products: Product[];
}
