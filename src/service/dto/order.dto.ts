import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';
import { ProductDTO } from './product.dto';

/**
 * An Category DTO object.
 */
export type OrderStatus = "pending" | "approved" | "rejected" | "canceled";

export class OrderDTO extends BaseDTO {
    @ApiModelProperty({ example: '500', description: 'Category name', required: false })
    totalAmount: number;
    products: ProductDTO[];
    status: OrderStatus;
    userId: number;
}
