import _ from 'lodash';
import { OrderItem } from '../../domain/order-item.entity';
import { OrderDTO } from '../dto/order.dto';
import { OrderMapper } from './order.mapper';
import { ProductMapper } from './product.mapper';

/**
 * An Order mapper object.
 */
export class OrderItemMapper {
    static fromOrderDTOToEntity(orderDTO: OrderDTO): OrderItem[] {
        const order = OrderMapper.fromDTOtoEntity(orderDTO);
        const listOrderItem: OrderItem[] = []
        _.forEach(orderDTO.products, productDTO => {
            const orderItem = new OrderItem();
            const product = ProductMapper.fromDTOtoEntity(productDTO);
            orderItem.order = order;
            orderItem.product = product;
            orderItem.quantity = productDTO.quantity
            orderItem.unitPrice = productDTO.price;
            listOrderItem.push(orderItem );
        })
        return listOrderItem;
    }
}
