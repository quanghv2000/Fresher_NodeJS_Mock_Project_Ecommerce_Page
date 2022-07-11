import { ViewEntity, ViewColumn } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@ViewEntity({
    expression: `
        SELECT product_catalogs."categoryId" as category_id,
        product.id as product_id, product.name as product_name, product.price as product_price,
        media.id as media_id, media.type as media_type, media."fileName" as media_file_name
        FROM product product
        LEFT JOIN product_catalogs product_catalogs
        on product.id = product_catalogs."productId"
        LEFT JOIN media media
        on product.id = media."productId"
    `,
})
export class ProductSearchView extends BaseEntity {
    @ViewColumn()
    category_id: number;

    @ViewColumn()
    product_id: number;

    @ViewColumn()
    product_name: string;

    @ViewColumn()
    product_price: string;

    @ViewColumn()
    theMedia: any[];
}
