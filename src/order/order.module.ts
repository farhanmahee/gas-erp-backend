import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from '../entity/Order';
import { OrderItem } from '../entity/OrderItem';
import { Product } from '../entity/Product';
import { Stock } from '../entity/Stock';
import { StockMovement } from '../entity/StockMovement';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, Stock, StockMovement]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
