import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';
import { CategoryDTO } from './category.dto';
import { MediaDTO } from './media.dto';
import { UserDTO } from './user.dto';

/**
 * An Product DTO object.
 */
export class ProductDTO extends BaseDTO {
    @ApiModelProperty({ example: 'Converse 1970s', description: 'Product name', required: false })
    name: string;

    @ApiModelProperty({
        example: 'Converse 1970s cổ thấp chính hãng',
        description: 'Product description',
        required: false,
    })
    description?: string;

    @ApiModelProperty({ example: 1290000, description: 'Product price', required: false })
    price: number;

    @ApiModelProperty({ example: 362, description: 'Product quantity', required: false })
    quantity: number;
    
    creator: UserDTO;
    theMedia: MediaDTO[];
    categories: any;
}
