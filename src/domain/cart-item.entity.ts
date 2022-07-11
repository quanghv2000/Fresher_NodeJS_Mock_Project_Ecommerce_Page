import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('cart_item')
export class CartItem extends BaseEntity {
    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Product)
    product: Product;

    @Column()
    quantity: number;
}
