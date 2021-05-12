import {
    Entity,
    Column,
    PrimaryGeneratedColumn, CreateDateColumn,
} from 'typeorm';

export enum OrderStatus {
    PENDING = 1,
    DONE = 2
}

@Entity({name: 'orders'})
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    driver_id: string;

    @Column()
    driver_name: string;

    @Column()
    location_id: number; //arquivo que o simulador irá ler.

    @Column("simple-array")
    location_geo: number[]; // As posições retornadas pelo simulador.

    @Column()
    status: OrderStatus = OrderStatus.PENDING;

    @CreateDateColumn() // Cria automaticamente a data.
    created_at: Date;
}

