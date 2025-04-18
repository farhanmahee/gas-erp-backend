import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { Order } from '../entity/Order';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderFilterDto,
} from './dto/order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body(new ValidationPipe()) createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Put(':id/status')
  async updateOrderStatus(
    @Param('id') orderId: number,
    @Body(new ValidationPipe()) updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(orderId, updateStatusDto);
  }

  @Get(':id')
  async getOrder(@Param('id') orderId: number): Promise<Order> {
    return this.orderService.getOrderById(orderId);
  }

  @Get()
  async listOrders(
    @Query(new ValidationPipe({ transform: true })) filters: OrderFilterDto,
  ): Promise<Order[]> {
    return this.orderService.listOrders(filters);
  }
}
