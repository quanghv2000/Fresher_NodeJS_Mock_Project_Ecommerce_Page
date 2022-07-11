import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Product } from './product.entity';
@Entity('category')
export class Category extends BaseEntity {
    @Column({ unique: true })
    code: string;
    @Column()
    name: string;

    @ManyToMany(() => Product)
    @JoinTable({ name: 'product_catalogs' })
    products?: any[];
}
