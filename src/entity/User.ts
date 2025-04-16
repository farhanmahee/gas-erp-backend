import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number; // Primary key, auto-incremented, unique identifier, not null

    @Column()
    firstName: string; // First name of the user

    @Column()
    lastName: string; // Last name of the user

    @Column()
    isActive: boolean; // Indicates if the user is active or not
}