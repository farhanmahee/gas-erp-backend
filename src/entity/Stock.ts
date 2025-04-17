import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from './Store';
import { CylinderType } from './CylinderType';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Store)
  store: Store;

  @ManyToOne(() => CylinderType)
  cylinderType: CylinderType;

  @Column()
  quantityAvailable: number;

  @Column()
  quantityBooked: number;

  @Column()
  minimumQuantity: number;

  @Column()
  maximumQuantity: number;

  @Column()
  reorderLevel: number;

  @Column('decimal', { precision: 10, scale: 2 })
  averageCost: number;

  @Column({ type: 'jsonb', nullable: true })
  locationDetails: {
    aisle?: string;
    rack?: string;
    shelf?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
