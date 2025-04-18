import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cylinder } from './Cylinder';
import { User } from './User';
import { Store } from './Store';
import { Delivery } from './Delivery';

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['INWARD', 'OUTWARD', 'TRANSFER', 'RETURN', 'MAINTENANCE', 'SCRAP'],
  })
  movementType: string;

  @ManyToOne(() => Cylinder, (cylinder) => cylinder.movements)
  cylinder: Cylinder;

  @ManyToOne(() => Store, { nullable: true })
  sourceLocation: Store;

  @ManyToOne(() => Store, { nullable: true })
  destinationLocation: Store;

  @Column()
  movementDate: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @ManyToOne(() => User)
  performedBy: User;

  @Column({ type: 'jsonb', nullable: true })
  additionalDetails: Record<string, any>;

  @Column({ default: 'COMPLETED' })
  status: string;

  @Column({ type: 'text', nullable: true })
  referenceNumber: string;

  @ManyToOne(() => Delivery, (delivery) => delivery.movements, {
    nullable: true,
  })
  delivery: Delivery;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
