import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * An Category DTO object.
 */
export class CategoryDTO extends BaseDTO {
    @ApiModelProperty({ uniqueItems: true, example: 'C001', description: 'Category code' })
    code: string;

    @ApiModelProperty({ example: 'Clothes', description: 'Category name', required: false })
    name: string;
}
