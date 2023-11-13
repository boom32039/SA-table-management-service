import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm"
import { Table } from "./table.entitiy";

@Entity('checkInRequest')
export class CheckIn {
    @PrimaryGeneratedColumn()
    id: number
    
    @ManyToOne(() => Table, (table) => table.checkIns)
    table: Table

    @Column()
    userId: string

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}