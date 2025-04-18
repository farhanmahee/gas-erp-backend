import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../entity/Order';
import { OrderItem } from '../entity/OrderItem';
import { Product } from '../entity/Product';
import { User } from '../entity/User';
import { Store } from '../entity/Store';
import { Stock } from '../entity/Stock';
import { StockMovement } from '../entity/StockMovement';
import { Payment } from '../entity/Payment';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderFilterDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
    private readonly dataSource: DataSource,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { customerId, storeId, items, shippingAddress, notes } =
        createOrderDto;

      // Validate customer and store
      const customer = await queryRunner.manager.findOne(User, {
        where: { id: customerId },
      });
      const store = await queryRunner.manager.findOne(Store, {
        where: { store_id: storeId },
      });

      if (!customer || !store) {
        throw new NotFoundException('Customer or store not found');
      }

      // Create order
      const order = queryRunner.manager.create(Order, {
        orderNumber: this.generateOrderNumber(),
        customer,
        store,
        shippingAddress,
        notes,
        status: 'PENDING',
      });

      // Process order items
      let subtotal = 0;
      const orderItems: OrderItem[] = [];

      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }

        // Check stock availability
        const stock = await queryRunner.manager.findOne(Stock, {
          where: {
            store: { store_id: storeId },
            cylinderType: { id: product.id },
          },
        });

        if (!stock || stock.quantityAvailable < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}`,
          );
        }

        // Calculate item subtotal
        const itemSubtotal = product.unit_price * item.quantity;
        subtotal += itemSubtotal;

        // Create order item
        const orderItem = queryRunner.manager.create(OrderItem, {
          product,
          quantity: item.quantity,
          unitPrice: product.unit_price,
          subtotal: itemSubtotal,
          customizations: item.customizations,
        });

        orderItems.push(orderItem);

        // Update stock
        stock.quantityAvailable -= item.quantity;
        stock.quantityBooked += item.quantity;
        await queryRunner.manager.save(Stock, stock);

        // Record stock movement
        const movement = queryRunner.manager.create(StockMovement, {
          movementType: 'OUTWARD',
          cylinder: item.cylinderId ? { id: item.cylinderId } : null,
          sourceLocation: store,
          quantity: item.quantity,
          status: 'PENDING',
          referenceNumber: order.orderNumber,
        });
        await queryRunner.manager.save(StockMovement, movement);
      }

      // Calculate order totals
      const tax = subtotal * 0.1; // 10% tax rate
      const shippingCost = 10; // Fixed shipping cost
      const total = subtotal + tax + shippingCost;

      // Update order with financial details
      order.subtotal = subtotal;
      order.tax = tax;
      order.shippingCost = shippingCost;
      order.total = total;

      // Save order and items
      const savedOrder = await queryRunner.manager.save(Order, order);
      orderItems.forEach((item) => (item.order = savedOrder));
      await queryRunner.manager.save(OrderItem, orderItems);

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrderStatus(
    orderId: number,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'store'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transition
    this.validateStatusTransition(order.status, updateStatusDto.status);

    order.status = updateStatusDto.status;
    if (updateStatusDto.notes) {
      order.notes = updateStatusDto.notes;
    }

    // Handle status-specific actions
    if (updateStatusDto.status === 'CANCELLED') {
      await this.handleOrderCancellation(order);
    }

    return this.orderRepository.save(order);
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'store', 'items', 'items.product', 'payment'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async listOrders(filters: OrderFilterDto): Promise<Order[]> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (filters.status) {
      queryBuilder.andWhere('order.status = :status', {
        status: filters.status,
      });
    }

    if (filters.customerId) {
      queryBuilder.andWhere('customer.id = :customerId', {
        customerId: filters.customerId,
      });
    }

    if (filters.storeId) {
      queryBuilder.andWhere('store.store_id = :storeId', {
        storeId: filters.storeId,
      });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('order.createdAt >= :startDate', {
        startDate: new Date(filters.startDate),
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('order.createdAt <= :endDate', {
        endDate: new Date(filters.endDate),
      });
    }

    return queryBuilder.getMany();
  }

  private generateOrderNumber(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private validateStatusTransition(
    currentStatus: string,
    newStatus: string,
  ): void {
    const validTransitions = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED', 'CANCELLED'],
      DELIVERED: [],
      CANCELLED: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  private async handleOrderCancellation(order: Order): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Restore stock quantities
      for (const item of order.items) {
        const stock = await queryRunner.manager.findOne(Stock, {
          where: {
            store: { store_id: order.store.store_id },
            cylinderType: { id: item.product.id },
          },
        });

        if (stock) {
          stock.quantityBooked -= item.quantity;
          stock.quantityAvailable += item.quantity;
          await queryRunner.manager.save(Stock, stock);
        }

        // Record cancellation movement
        const movement = queryRunner.manager.create(StockMovement, {
          movementType: 'RETURN',
          cylinder: item.cylinder,
          destinationLocation: order.store,
          quantity: item.quantity,
          status: 'COMPLETED',
          referenceNumber: order.orderNumber,
          remarks: 'Order cancelled',
        });
        await queryRunner.manager.save(StockMovement, movement);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
