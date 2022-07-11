import { Module } from '@nestjs/common';
import { ProductController } from '../web/rest/product.controller';
import { ManagementController } from '../web/rest/management.controller';
import { ProductRepository } from '../repository/product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from '../service/product.service';
import { MediaModule } from './media.module';

@Module({
    imports: [TypeOrmModule.forFeature([ProductRepository]), MediaModule],
    controllers: [ProductController, ManagementController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
