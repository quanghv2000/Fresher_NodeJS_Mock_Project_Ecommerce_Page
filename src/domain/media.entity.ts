import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Product } from './product.entity';

@Entity('media')
export class Media extends BaseEntity {
    @Column()
    type: string;
    
    @Column({type: "text"})
    fileName: string;

    @ManyToOne(() => Product, product => product.theMedia)
    product?: Product;
}
