import _ from 'lodash'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDTO } from './dto/order.dto';
import { OrderMapper } from './mapper/order.mapper';
import { OrderRepository } from '../repository/order.repository';
import { User } from '../domain/user.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(@InjectRepository(OrderRepository) private orderRepository: OrderRepository) {}

    async findAll(skip: number, take: number, orderField: string, orderDirection): Promise<OrderDTO[] | undefined> {
        const orders = await this.orderRepository.createQueryBuilder('order')
            .skip(skip)
            .take(take)
            .orderBy(orderField, orderDirection)
            .getMany();

        const ordersDTO: OrderDTO[] = [];

        orders.forEach((order) => {
            ordersDTO.push(OrderMapper.fromEntityToDTO(order))
        })

        return ordersDTO;
    }

    async countAll(): Promise<number> {
        return this.orderRepository.count();
    }

    async getListUserOrder(userId: number, skip: number, take: number, orderField: string, orderDirection): Promise<OrderDTO[]> {
        const orders = await this.orderRepository.createQueryBuilder('order')
            .where('order.userId = :userId', { userId })
            .skip(skip)
            .take(take)
            .orderBy(orderField, orderDirection)
            .getMany();

        const ordersDTO: OrderDTO[] = [];
        orders.forEach((order) => {
            ordersDTO.push(OrderMapper.fromEntityToDTO(order))
        })
        return ordersDTO;
    }

    async countUserOrder(userId: number): Promise<number> {
        const result = await this.orderRepository.createQueryBuilder('order')
            .select('count(order.id)')
            .where('order.userId = :userId', { userId })
            .getRawOne();

        return result.count;
    }

    // async findAndCount(options: FindManyOptions<OrderDTO>): Promise<[OrderDTO[], number]> {
    //     options.relations = ['authorities'];
    //     const resultList = await this.orderRepository.findAndCount(options);
    //     const ordersDTO: OrderDTO[] = [];
    //     if (resultList && resultList[0]) {
    //         resultList[0].forEach(order => ordersDTO.push(OrderMapper.fromEntityToDTO(order)));
    //     }
    //     return [ordersDTO, resultList[1]];
    // } 

    async findById(id: number): Promise<OrderDTO | undefined> {
        const order = await this.orderRepository.findOne(id);

        return OrderMapper.fromEntityToDTO(order);
    }

    async getDetailById(id: number): Promise<OrderDTO | undefined> {
        const order = await this.orderRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.orderItem', 'item')
            .leftJoinAndSelect('item.product', 'product')
            .where('order.id = :id', { id })
            .getOne();

        return OrderMapper.fromEntityToDTO(order);
    }

    async save(orderDTO: OrderDTO): Promise<OrderDTO | undefined> {
        const newOrder = OrderMapper.fromDTOtoEntity(orderDTO);
        const user = new User
        user.id = orderDTO.userId;
        newOrder.user = user;
        const orderCreated = await this.orderRepository.save(newOrder);

        return OrderMapper.fromEntityToDTO(orderCreated);
    }

    async update(orderDTO: OrderDTO, updater?: string): Promise<OrderDTO | undefined> {
        const orderToUpdate = OrderMapper.fromDTOtoEntity(orderDTO);
        const orderUpdated = await this.orderRepository.save(orderToUpdate);

        return OrderMapper.fromEntityToDTO(orderUpdated);
    }

    async delete(orderDTO: OrderDTO): Promise<OrderDTO | undefined> {
        const orderToDelete = OrderMapper.fromDTOtoEntity(orderDTO);
        const orderDeleted = await this.orderRepository.remove(orderToDelete);

        return OrderMapper.fromEntityToDTO(orderDeleted);
    }

    async saveMany(ordersDTO: [OrderDTO]): Promise<OrderDTO | undefined> {
        const orders = _.map(ordersDTO, orderDTO => OrderMapper.fromDTOtoEntity(orderDTO));
        const ordersCreated = await this.orderRepository.save(orders);

        return _.map(ordersCreated, order => OrderMapper.fromEntityToDTO(order));
    }
}
