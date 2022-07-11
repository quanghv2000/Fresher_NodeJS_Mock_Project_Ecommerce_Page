import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('product_reviews')
export class ProductReviews extends BaseEntity {
    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Product)
    product: Product;

    @Column({ type: "text" })
    content: string;

    @Column()
    numberOfStar: number;
}
