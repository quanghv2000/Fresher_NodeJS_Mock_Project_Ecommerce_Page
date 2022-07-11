import { Entity, Column, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Category } from './category.entity';
import { Media } from './media.entity';
import { User } from './user.entity';

@Entity('product')
export class Product extends BaseEntity {
    @Column({ nullable: true })
    name: string;
    @Column({ nullable: true })
    description?: string;
    @Column({ nullable: true, type: 'float' })
    price: number;
    @Column({ nullable: true })
    quantity: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'creator' })
    creator?: User;

    @OneToMany(
        () => Media,
        media => media.product,
    )
    theMedia?: Media[];

    @ManyToMany(() => Category)
    @JoinTable({ name: 'product_catalogs' })
    categories?: any[];
}
