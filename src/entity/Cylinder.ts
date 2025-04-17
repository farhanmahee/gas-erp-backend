import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CylinderType } from './CylinderType';
import { StockMovement } from './StockMovement';

@Entity('cylinders')
export class Cylinder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  serialNumber: string;

  @Column({ unique: true })
  barcodeNumber: string;

  @Column()
  manufacturingDate: Date;

  @Column()
  lastInspectionDate: Date;

  @Column()
  nextInspectionDate: Date;

  @Column({
    type: 'enum',
    enum: ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'SCRAPPED'],
    default: 'AVAILABLE',
  })
  status: string;

  @Column({ default: 0 })
  refillCount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => CylinderType, (type) => type.cylinders)
  type: CylinderType;

  @OneToMany(() => StockMovement, (movement) => movement.cylinder)
  movements: StockMovement[];

  @Column({ nullable: true })
  currentLocationId: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
