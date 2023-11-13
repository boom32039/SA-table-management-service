import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import {CheckIn} from './checkInRequest.entity'

export enum TABLE_STATUS {
  FULL = "full",
  RESERVED = "reserved",
  AVAILABLE = "available"
}

@Entity('table')
export class Table {
    @PrimaryGeneratedColumn('uuid', {name: 'id',})
    id: string

    @Column({unique: true})
    label: number

    @Column()
    size: number

    @Column()
    status: TABLE_STATUS

    @Column({default : null,nullable: true})
    userId: string

    @OneToMany(() => CheckIn, (checkIn) => checkIn.table)
    checkIns: CheckIn[]

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}