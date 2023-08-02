import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Phone {
    @PrimaryGeneratedColumn()
    id: number

    @Index({ unique: true })
    @Column({ 
        nullable: false,
        name: 'phone_number'
     })
    phoneNumber: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;
}