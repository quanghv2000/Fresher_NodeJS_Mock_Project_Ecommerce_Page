import _ from 'lodash'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDTO } from './dto/order.dto';
import { OrderMapper } from './mapper/order.mapper';
import { OrderItemRepository } from '../repository/orderitem.repository';
import { OrderItemMapper } from './mapper/orderitem.mapper';

@Injectable()
export class OrderItemService {
    constructor(@InjectRepository(OrderItemRepository) private orderItemRepository: OrderItemRepository) {}

    // async findAll(): Promise<OrderDTO[] | undefined> {
    //     const orders = await this.orderRepository.find();

    //     const ordersDTO: OrderDTO[] = [];

    //     orders.forEach((order) => {
    //         ordersDTO.push(OrderMapper.fromEntityToDTO(order))
    //     })

    //     return ordersDTO;
    // }

    // async findById(id: number): Promise<OrderDTO | undefined> {
    //     const order = await this.orderRepository.findOne(id);

    //     return OrderMapper.fromEntityToDTO(order);
    // }

    // async save(orderDTO: OrderDTO): Promise<OrderDTO | undefined> {
    //     const newOrder = OrderMapper.fromDTOtoEntity(orderDTO);
    //     const orderCreated = await this.orderRepository.save(newOrder);

    //     return OrderMapper.fromEntityToDTO(orderCreated);
    // }

    // async update(orderDTO: OrderDTO, updater?: string): Promise<OrderDTO | undefined> {
    //     const orderToUpdate = OrderMapper.fromDTOtoEntity(orderDTO);
    //     const orderUpdated = await this.orderRepository.save(orderToUpdate);

    //     return OrderMapper.fromEntityToDTO(orderUpdated);
    // }

    // async delete(orderDTO: OrderDTO): Promise<OrderDTO | undefined> {
    //     const orderToDelete = OrderMapper.fromDTOtoEntity(orderDTO);
    //     const orderDeleted = await this.orderRepository.remove(orderToDelete);

    //     return OrderMapper.fromEntityToDTO(orderDeleted);
    // }

    async saveMany(ordersDTO: OrderDTO): Promise<any> {
        const listOrderItem = OrderItemMapper.fromOrderDTOToEntity(ordersDTO)
        await this.orderItemRepository.save(listOrderItem);
    }
}
