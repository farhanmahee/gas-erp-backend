import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../auth/role.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.INVENTORY_MANAGER,
  })
  role: Role;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}