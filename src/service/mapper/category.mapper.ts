import { Category } from '../../domain/category.entity';
import { CategoryDTO } from '../dto/category.dto';

/**
 * An Category mapper object.
 */
export class CategoryMapper {
    static fromDTOtoEntity(categoryDTO: CategoryDTO): Category {
        if (!categoryDTO) {
            return;
        }
        const category = new Category();
        const fields = Object.getOwnPropertyNames(categoryDTO);
        fields.forEach(field => {
            category[field] = categoryDTO[field];
        });
        return category;
    }

    static fromEntityToDTO(category: Category): CategoryDTO {
        if (!category) {
            return;
        }
        const categoryDTO = new CategoryDTO();

        const fields = Object.getOwnPropertyNames(category);

        fields.forEach(field => {
            categoryDTO[field] = category[field];
        });

        return categoryDTO;
    }
}
