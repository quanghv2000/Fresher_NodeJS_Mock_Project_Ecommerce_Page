import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';
import { ProductDTO } from './product.dto';

/**
 * An Media DTO object.
 */
export class MediaDTO extends BaseDTO {
    type: string;
    fileName: string;
    product?: ProductDTO;
}
