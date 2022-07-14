import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDTO } from './dto/product.dto';
import { ProductMapper } from './mapper/product.mapper';
import { ProductRepository } from '../repository/product.repository';
import { SearchProductDTO } from './dto/search-product.dto';
import { MediaService } from './media.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductRepository) private productRepository: ProductRepository,
        private mediaService: MediaService,
    ) {}

    async findAll(): Promise<ProductDTO[]> {
        const products = await this.productRepository.find({
            relations: ['theMedia'],
        });

        const productsDTO: ProductDTO[] = [];

        products.forEach(product => {
            productsDTO.push(ProductMapper.fromEntityToDTO(product));
        });

        return productsDTO;
    }

    async search(searchProductDTO: SearchProductDTO): Promise<ProductDTO[]> {
        const products = await this.productRepository.search(searchProductDTO);
        const productsDTO: ProductDTO[] = [];

        products.forEach(product => {
            productsDTO.push(ProductMapper.fromEntityToDTO(product));
        });

        return productsDTO;
    }

    async findById(id: number): Promise<ProductDTO | undefined> {
        const product = await this.productRepository.findOne({
            where: {
                id: id,
            },
            relations: ['theMedia', 'categories'],
        });

        return ProductMapper.fromEntityToDTO(product);
    }

    async save(productDTO: ProductDTO): Promise<ProductDTO | undefined> {
        const newProduct = ProductMapper.fromDTOtoEntity(productDTO);
        const productCreated = await this.productRepository.save(newProduct);

        return ProductMapper.fromEntityToDTO(productCreated);
    }

    async update(productDTO: ProductDTO): Promise<ProductDTO | undefined> {
        const productToUpdate = ProductMapper.fromDTOtoEntity(productDTO);
        const productUpdated = await this.productRepository.save(productToUpdate);

        return ProductMapper.fromEntityToDTO(productUpdated);
    }

    async delete(productDTO: ProductDTO): Promise<ProductDTO | undefined> {
        const productToDelete = ProductMapper.fromDTOtoEntity(productDTO);
        const productDeleted = await this.productRepository.remove(productToDelete);

        return ProductMapper.fromEntityToDTO(productDeleted);
    }

    async count(): Promise<number> {
        return await this.productRepository.count();
    }

    async countBySearch(searchProductDTO: SearchProductDTO): Promise<number> {
        return await this.productRepository.countBySearch(searchProductDTO);
    }

    async saveWithTheMedia(productDTO: ProductDTO): Promise<ProductDTO | undefined> {
        const newProduct = ProductMapper.fromDTOtoEntity(productDTO);
        const result = await this.productRepository.saveWithTheMedia(newProduct);

        const productCreated = await this.productRepository.findOne({
            where: { id: result.id },
            relations: ['theMedia', 'categories'],
        });

        return ProductMapper.fromEntityToDTO(productCreated);
    }

    async updateWithTheMedia(productDTO: ProductDTO): Promise<ProductDTO | undefined> {
        const productToUpdate = ProductMapper.fromDTOtoEntity(productDTO);
        const result = await this.productRepository.updateWithTheMedia(productToUpdate);

        const productCreated = await this.productRepository.findOne({
            where: { id: result.id },
            relations: ['theMedia', 'categories'],
        });

        return ProductMapper.fromEntityToDTO(productCreated);
    }
}
