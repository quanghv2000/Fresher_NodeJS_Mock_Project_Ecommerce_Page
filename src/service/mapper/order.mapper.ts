import _ from 'lodash';
import { Order } from '../../domain/order.entity';
import { OrderDTO } from '../dto/order.dto';
import { ProductMapper } from './product.mapper';

/**
 * An Order mapper object.
 */
export class OrderMapper {
    static fromDTOtoEntity(orderDTO: OrderDTO): Order {
        if (!orderDTO) {
            return;
        }
        const order = new Order();
        const fields = Object.getOwnPropertyNames(orderDTO);
        fields.forEach(field => {
            order[field] = orderDTO[field];
        });
        return order ;
    }

    static fromEntityToDTO(order: Order): OrderDTO {
        if (!order) {
            return;
        }
        const orderDTO = new OrderDTO();

        const fields = Object.getOwnPropertyNames(order);

        fields.forEach(field => {
            if (field == 'orderItem') {
                orderDTO.products = _.map(order.orderItem, item => ProductMapper.fromOrderItemEntityToDTO(item));
            } else {
                orderDTO[field] = order[field];
            }
        });

        return orderDTO;
    }
}
