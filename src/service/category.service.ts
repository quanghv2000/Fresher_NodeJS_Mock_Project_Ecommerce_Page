import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDTO } from './dto/category.dto';
import { CategoryMapper } from './mapper/category.mapper';
import { CategoryRepository } from '../repository/category.repository';

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(CategoryRepository) private categoryRepository: CategoryRepository) {}

    async findAll(): Promise<CategoryDTO[] | undefined> {
        const categories = await this.categoryRepository.find();

        const categoriesDTO: CategoryDTO[] = [];

        categories.forEach((category) => {
            categoriesDTO.push(CategoryMapper.fromEntityToDTO(category))
        })

        return categoriesDTO;
    }

    async findById(id: number): Promise<CategoryDTO | undefined> {
        const category = await this.categoryRepository.findOne(id);

        return CategoryMapper.fromEntityToDTO(category);
    }

    async findByCode(code: string): Promise<CategoryDTO | undefined> {
        const category = await this.categoryRepository.findOne({
            where: {
                code: code,
            }
        });

        return CategoryMapper.fromEntityToDTO(category);
    }

    async save(categoryDTO: CategoryDTO): Promise<CategoryDTO | undefined> {
        const categoryFoundByCode = await this.findByCode(categoryDTO.code);
        if (categoryFoundByCode) {
            throw new HttpException("Code already exists", HttpStatus.BAD_REQUEST)
        }
        
        const newCategory = CategoryMapper.fromDTOtoEntity(categoryDTO);
        const categoryCreated = await this.categoryRepository.save(newCategory);

        return CategoryMapper.fromEntityToDTO(categoryCreated);
    }

    async update(categoryDTO: CategoryDTO): Promise<CategoryDTO | undefined> {
        const categoryFoundByCode = await this.findByCode(categoryDTO.code);
        if (categoryFoundByCode && categoryFoundByCode?.id !== categoryDTO.id) {
            throw new HttpException("Code already exists", HttpStatus.BAD_REQUEST)
        }
        
        const categoryToUpdate = CategoryMapper.fromDTOtoEntity(categoryDTO);
        const categoryUpdated = await this.categoryRepository.save(categoryToUpdate);

        return CategoryMapper.fromEntityToDTO(categoryUpdated);
    }

    async delete(categoryDTO: CategoryDTO): Promise<CategoryDTO | undefined> {
        const categoryToDelete = CategoryMapper.fromDTOtoEntity(categoryDTO);
        const categoryDeleted = await this.categoryRepository.remove(categoryToDelete);

        return CategoryMapper.fromEntityToDTO(categoryDeleted);
    }

}
