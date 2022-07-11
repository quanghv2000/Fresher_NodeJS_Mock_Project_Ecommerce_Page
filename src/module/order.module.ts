import { Module } from '@nestjs/common';
import { OrderController } from '../web/rest/order.controller';
import { ManagementController } from '../web/rest/management.controller';
import { OrderRepository } from '../repository/order.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from '../service/order.service';
import { OrderItemService } from '../service/orderitem.service';
import { OrderItemRepository } from '../repository/orderitem.repository';
import { ProductModule } from './product.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRepository, OrderItemRepository]), ProductModule],
  controllers: [OrderController, ManagementController],
  providers: [OrderService, OrderItemService],
  exports: [OrderService, OrderItemService],
})
export class OrderModule {}
