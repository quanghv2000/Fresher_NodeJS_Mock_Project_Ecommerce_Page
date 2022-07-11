import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { Category } from 'src/domain/category.entity';
import { Product } from 'src/domain/product.entity';
import { Media } from 'src/domain/media.entity';

export class SeedCategoryProducts1656396754030 implements MigrationInterface {
    category1: Category = {
        code: 'C001',
        name: 'Clothes',
    };

    category2: Category = {
        code: 'C002',
        name: 'Footwear',
    };

    category3: Category = {
        code: 'C003',
        name: `Men's Fashion`,
    };

    category4: Category = {
        code: 'C004',
        name: `Women's Fashion`,
    };

    product1: Product = {
        name: 'Converse 1970s',
        description:
            'Phiên bản Converse 1970s bao gồm các màu đen, trắng, vàng tươi, đỏ, xám da chuột, xanh da trời và màu hồng',
        price: 1290000,
        quantity: 20,
    };

    product2: Product = {
        name: 'Converse Classic',
        description:
            'Giày Converse Classic với 6 màu cơ bản: đen, trắng, đỏ, xanh navy, full đen, kem và tất cả các phiên bản của giày này đều được yêu thích và được xem như là đôi giày “thanh xuân”, gắn bó với thời học sinh, sinh viên của rất nhiều người.',
        price: 1390000,
        quantity: 15,
    };

    product3: Product = {
        name: 'Áo Sơ mi burberry',
        description:
            'Áo được làm từ chất vải cotton thoáng mát, thấm hút mồ hôi tốt mang lại cảm giác thoải mái cho người mặc.',
        price: 490000,
        quantity: 17,
    };

    product4: Product = {
        name: 'Quần Kaki Excool',
        description: 'Chất liệu: 43% Sợi Sorona + 57% Polyester co giãn',
        price: 420000,
        quantity: 11,
    };

    media1: Media = {
        type: 'video',
        fileName: 'video.mp4',
    };

    media2: Media = {
        type: 'image',
        fileName: 'image.jpg',
    };

    media3: Media = {
        type: 'image',
        fileName: 'image.png',
    };

    media4: Media = {
        type: 'video',
        fileName: 'video.mp4',
    };

    media5: Media = {
        type: 'image',
        fileName: 'image.jpg',
    };

    media6: Media = {
        type: 'image',
        fileName: 'image.png',
    };

    media7: Media = {
        type: 'video',
        fileName: 'video.mp4',
    };

    media8: Media = {
        type: 'image',
        fileName: 'image.jpg',
    };

    media9: Media = {
        type: 'image',
        fileName: 'image.png',
    };

    // eslint-disable-next-line
    public async up(queryRunner: QueryRunner): Promise<any> {
        const categoryRepository = getRepository('category');

        const ClothesCategory = await categoryRepository.save(this.category1);
        const FootwearCategory = await categoryRepository.save(this.category2);
        const MenFashionCategory = await categoryRepository.save(this.category3);
        const WomenFashionCategory = await categoryRepository.save(this.category4);

        const productRepository = getRepository('product');

        this.product1.categories = [FootwearCategory, MenFashionCategory, WomenFashionCategory];
        this.product2.categories = [FootwearCategory, MenFashionCategory, WomenFashionCategory];
        this.product3.categories = [ClothesCategory, MenFashionCategory];
        this.product4.categories = [ClothesCategory, MenFashionCategory];

        const product1Created = await productRepository.save(this.product1);
        const product2Created = await productRepository.save(this.product2);
        const product3Created = await productRepository.save(this.product3);
        const product4Created = await productRepository.save(this.product4);

        const mediaRepository = getRepository('media');
        
        this.media1.product = product1Created;
        this.media2.product = product1Created;
        this.media3.product = product1Created;
        this.media4.product = product2Created;
        this.media5.product = product2Created;
        this.media6.product = product3Created;
        this.media7.product = product3Created;
        this.media8.product = product4Created;
        this.media9.product = product4Created;

        await mediaRepository.save([
            this.media1,
            this.media2,
            this.media3,
            this.media4,
            this.media5,
            this.media6,
            this.media7,
            this.media8,
            this.media9,
        ]);
    }

    // eslint-disable-next-line
    public async down(queryRunner: QueryRunner): Promise<any> {}
}
