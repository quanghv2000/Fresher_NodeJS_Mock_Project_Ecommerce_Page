import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { OrderItem } from './order-item.entity';
import { User } from './user.entity';

@Entity('order')
export class Order extends BaseEntity {
    @ManyToOne(() => User)
    user: User;

    @Column({ nullable: true, type: "float" })
    totalAmount: number;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItem?: OrderItem[];

    @Column({ nullable: true })
    status: "pending" | "approved" | "rejected" | "canceled"
}
