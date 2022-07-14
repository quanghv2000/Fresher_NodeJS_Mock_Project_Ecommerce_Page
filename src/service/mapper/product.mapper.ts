import { Product } from '../../domain/product.entity';
import { ProductDTO } from '../dto/product.dto';

/**
 * An Product mapper object.
 */
export class ProductMapper {
    static fromDTOtoEntity(productDTO: ProductDTO): Product {
        if (!productDTO) {
            return;
        }
        const product = new Product();
        const fields = Object.getOwnPropertyNames(productDTO);
        fields.forEach(field => {
            product[field] = productDTO[field];
        });
        return product;
    }

    static fromEntityToDTO(product: Product): ProductDTO {
        if (!product) {
            return;
        }
        const productDTO = new ProductDTO();

        const fields = Object.getOwnPropertyNames(product);

        fields.forEach(field => {
            productDTO[field] = product[field];
        });

        return productDTO;
    }
}
