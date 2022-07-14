import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';

@Entity('order')
export class Order extends BaseEntity {
    @ManyToOne(() => User)
    user: User;

    @Column({ nullable: true, type: "float" })
    totalAmount: number;
}
