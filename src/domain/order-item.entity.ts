import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_item')
export class OrderItem extends BaseEntity {
    @ManyToOne(() => Order)
    order: Order;

    @ManyToOne(() => Order)
    product: Product;

    @Column({ nullable: true, type: "float" })
    unitPrice: number;

    @Column()
    quantity: number;
}
