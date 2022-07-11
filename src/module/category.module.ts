import { Module } from '@nestjs/common';
import { CategoryController } from '../web/rest/category.controller';
import { ManagementController } from '../web/rest/management.controller';
import { CategoryRepository } from '../repository/category.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from '../service/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryRepository])],
  controllers: [CategoryController, ManagementController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
