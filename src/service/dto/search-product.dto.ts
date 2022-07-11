import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * An SearchProduct DTO object.
 */
export class SearchProductDTO extends BaseDTO {
    @ApiModelProperty({ example: 1, description: 'categoryId', required: false })
    categoryId: number;

    @ApiModelProperty({ example: 'Converse', description: 'name', required: false })
    name: string;

    @ApiModelProperty({ example: 1000000, description: 'fromPrice', required: false })
    fromPrice: number;

    @ApiModelProperty({ example: 1500000, description: 'toPrice', required: false })
    toPrice: number;

    @ApiModelProperty({ example: 1, description: 'pageIndex', required: false })
    pageIndex: number;

    @ApiModelProperty({ example: 10, description: 'pageSize', required: false })
    pageSize: number;
}
