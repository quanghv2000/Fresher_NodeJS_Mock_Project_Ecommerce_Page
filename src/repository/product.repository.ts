import { Media } from '../domain/media.entity';
import { EntityRepository, getManager, getRepository, Repository } from 'typeorm';
import { Product } from '../domain/product.entity';
import { SearchProductDTO } from '../service/dto/search-product.dto';
import { MediaMapper } from '../service/mapper/media.mapper';
import { MediaDTO } from '../service/dto/media.dto';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
    async search(searchProductDTO: SearchProductDTO): Promise<any> {
        const { categoryId, name, fromPrice, toPrice, pageIndex, pageSize } = searchProductDTO;
        const skip = (pageIndex - 1) * pageSize;

        const result = await getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.categories', 'category')
            .leftJoinAndSelect('product.theMedia', 'media')
            .where(`category.id = ${categoryId}`)
            .andWhere(`product.price BETWEEN ${fromPrice} and ${toPrice}`)
            .andWhere(`product.name LIKE '%${name}%'`)
            .orderBy('product.id', 'ASC')
            .limit(pageSize)
            .offset(skip)
            .getMany();

        return result;
    }

    async countBySearch(searchProductDTO: SearchProductDTO): Promise<number> {
        const { categoryId, name, fromPrice, toPrice } = searchProductDTO;

        const result = await getRepository(Product)
            .createQueryBuilder('product')
            .select('COUNT(product.id)')
            .leftJoin('product_catalogs', 'product_catalogs', 'product.id = product_catalogs.productId')
            .where(`product_catalogs.categoryId = ${categoryId}`)
            .andWhere(`product.price BETWEEN ${fromPrice} and ${toPrice}`)
            .andWhere(`product.name LIKE '%${name}%'`)
            .getRawOne();

        return result.count;
    }

    async saveWithTheMedia(product: Product): Promise<any> {
        return await getManager().transaction(async transactionalEntityManager => {
            const productCreated = await transactionalEntityManager.save(product);
            
            let theMedia: Media[] = product.theMedia.map((media: MediaDTO) => {
                return MediaMapper.fromDTOtoEntity(media)
            })

            theMedia.forEach((media) => {
                media.product = productCreated;
            })
            
            await transactionalEntityManager.save(theMedia);

            return productCreated;
        });
    }

    async updateWithTheMedia(product: Product): Promise<any> {
        return await getManager().transaction(async transactionalEntityManager => {
            const productUpdated = await transactionalEntityManager.save(product);
            
            let theMedia: Media[] = product.theMedia.map((media: MediaDTO) => {
                return MediaMapper.fromDTOtoEntity(media)
            })

            theMedia.forEach((media) => {
                media.product = productUpdated;
            })
            
            await transactionalEntityManager.save(theMedia);

            return productUpdated;
        });
    }
}
