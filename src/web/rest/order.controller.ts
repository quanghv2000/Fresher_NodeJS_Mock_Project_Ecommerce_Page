import _ from 'lodash';
import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseIntPipe,
    HttpException,
    HttpStatus,
    Query,
} from '@nestjs/common';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { OrderDTO, OrderStatus } from '../../service/dto/order.dto';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { OrderService } from '../..//service/order.service';
import { OrderItemService } from '../../service/orderitem.service';
import { ProductDTO } from '../../service/dto/product.dto';
import { ProductService } from '../../service/product.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { HeaderUtil } from '../../client/header-util';

@Controller('api/order')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
// @UseGuards(AuthGuard, RolesGuard)
// @ApiBearerAuth()
@ApiUseTags('order-resource')
export class OrderController {
    logger = new Logger('OrderController');

    constructor(
        private readonly orderService: OrderService,
        private readonly orderItemService: OrderItemService,
        private readonly productService: ProductService
    ) {}

    @Get('/get-all')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Get the list of categories' })
    @ApiResponse({
        status: 200,
        description: 'List all categories',
        type: OrderDTO,
    })
    async getAllOrder(@Req() req: Request): Promise<OrderDTO[]> {
        const sortField = req.query.sort;
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, sortField);
        const skip = +pageRequest.page * pageRequest.size;
        const take = +pageRequest.size;
        const order = pageRequest.sort;
        const [results, count] = await Promise.all([
            this.orderService.findAll(skip, take, order.property, order.direction),
            this.orderService.countAll()
        ]) 
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/get-my-orders')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Get the list of categories' })
    @ApiResponse({
        status: 200,
        description: 'List all categories',
        type: OrderDTO,
    })
    async getMyListOrder(@Req() req: Request): Promise<OrderDTO[]> {
        const userId = req.user.id;
        const sortField = req.query.sort;
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, sortField);
        const skip = +pageRequest.page * pageRequest.size;
        const take = +pageRequest.size;
        const order = pageRequest.sort;
        const [results, count] = await Promise.all([
            this.orderService.getListUserOrder(userId, skip, take, order.property, order.direction),
            this.orderService.countUserOrder(userId)
        ]) 
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/detail')
    // @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Get the list of categories' })
    @ApiResponse({
        status: 200,
        description: 'List all categories',
        type: OrderDTO,
    })
    async getDetailOrder(@Query('id', ParseIntPipe) id: number): Promise<OrderDTO> {
        const categoryFound = await this.orderService.getDetailById(id);

        if (!categoryFound) {
            throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        }

        return categoryFound;
    }

    @Post('/create')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create order' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: OrderDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async createOrder(@Req() req: Request, @Body() orderDTO: OrderDTO): Promise<OrderDTO> {
        const userReq = req.user ?.login;
        orderDTO.createdBy = userReq;
        orderDTO.userId = req.user.id;
        const listProductId = [];
        const mapQuantity = new Map<string, number>();
        _.forEach(orderDTO.products, product => {
            if (product.id) { 
                listProductId.push(product.id);
                mapQuantity.set(product.id, product.quantity);
            }
        });
        const listProductDTO = await this.productService.findByIds(listProductId);

        let totalAmount = 0
        _.forEach(listProductDTO, item => {
            item.quantity = mapQuantity.get(item.id);
            totalAmount += (item.quantity) * (item.price);
        })

        orderDTO.totalAmount = totalAmount;
        orderDTO.status = "pending";
        const orderCreatedDTO = await this.orderService.save(orderDTO);
        orderCreatedDTO.products = listProductDTO;
        await this.orderItemService.saveMany(orderCreatedDTO);
        return orderCreatedDTO;
    }

    @Post('/cancel')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Cancel order' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
        type: OrderDTO,
    })
    async cancelOrder(@Query('id') id: number): Promise<OrderDTO> {
        const orderToCancel = await this.orderService.findById(id);

        if (!orderToCancel) {
            throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        }
        orderToCancel.status = 'canceled';
        return await this.orderService.update(orderToCancel);
    }

    @Post('/approve')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Get the list of categories' })
    @ApiResponse({
        status: 200,
        description: 'List all categories',
        type: OrderDTO,
    })
    async approveOrder(@Body('id') id: number, @Body('status') status: OrderStatus): Promise<OrderDTO> {
        const orderToApprove = await this.orderService.findById(id);

        if (!orderToApprove) {
            throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        }
        if (_.includes(['approved', 'rejected'], status)) {
            orderToApprove.status = status;
        }
        return await this.orderService.update(orderToApprove);
    }
}
