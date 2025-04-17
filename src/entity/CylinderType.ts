import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cylinder } from './Cylinder';

@Entity('cylinder_types')
export class CylinderType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string;

    @Column()
    name: string;

    @Column()
    capacity: number;

    @Column()
    material: string;

    @Column('decimal', { precision: 10, scale: 2 })
    weight: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Cylinder, cylinder => cylinder.type)
    cylinders: Cylinder[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}