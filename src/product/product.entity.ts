import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Store } from '../entity/Store';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number; // Primary key

  @Column()
  name: string; // Product name

  @Column()
  category: string; // Product category (e.g., LPG, CNG)

  @Column('decimal', { precision: 10, scale: 2 })
  unit_price: number; // Unit price of the product

  @Column()
  warehouse_id: number; // ID of the warehouse where the product is stored

  @ManyToOne(() => Store, (store) => store.products)
  store: Store; // Relation to Store entity
}
