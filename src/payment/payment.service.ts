import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Payment } from '../entity/Payment';
import { Order } from '../entity/Order';
import { User } from '../entity/User';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async processPayment(
    orderId: number,
    paymentMethodId: string,
  ): Promise<Payment> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['customer', 'store'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    try {
      // Create or get Stripe customer
      const stripeCustomerId = await this.getOrCreateStripeCustomer(
        order.customer,
      );

      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(order.total * 100), // Convert to cents
        currency: 'usd',
        customer: stripeCustomerId,
        payment_method: paymentMethodId,
        confirm: true,
        metadata: {
          orderId: order.id.toString(),
          orderNumber: order.orderNumber,
        },
      });

      // Create payment record
      const payment = this.paymentRepository.create({
        transactionId: paymentIntent.id,
        amount: order.total,
        currency: paymentIntent.currency,
        status: this.mapStripeStatus(paymentIntent.status),
        paymentMethod: 'card',
        paymentGateway: 'stripe',
        gatewayResponse: paymentIntent,
        customer: order.customer,
        store: order.store,
        receiptUrl: paymentIntent.charges.data[0]?.receipt_url,
      });

      const savedPayment = await this.paymentRepository.save(payment);

      // Update order with payment reference
      order.payment = savedPayment;
      if (payment.status === 'COMPLETED') {
        order.status = 'CONFIRMED';
      }
      await this.orderRepository.save(order);

      return savedPayment;
    } catch (error) {
      this.logger.error('Payment processing failed:', error);
      throw new BadRequestException(
        error.message || 'Payment processing failed',
      );
    }
  }

  async refundPayment(
    paymentId: number,
    amount?: number,
    reason?: string,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment || payment.status !== 'COMPLETED') {
      throw new BadRequestException('Payment not found or cannot be refunded');
    }

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: payment.transactionId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason as Stripe.RefundCreateParams.Reason,
      });

      payment.status = 'REFUNDED';
      payment.refundReason = reason;
      payment.gatewayResponse = {
        ...payment.gatewayResponse,
        refund,
      };

      return this.paymentRepository.save(payment);
    } catch (error) {
      this.logger.error('Refund processing failed:', error);
      throw new BadRequestException(
        error.message || 'Refund processing failed',
      );
    }
  }

  private async getOrCreateStripeCustomer(user: User): Promise<string> {
    try {
      // Search for existing customer
      const customers = await this.stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        return customers.data[0].id;
      }

      // Create new customer
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: user.id.toString(),
        },
      });

      return customer.id;
    } catch (error) {
      this.logger.error('Failed to get/create Stripe customer:', error);
      throw new BadRequestException('Failed to process customer information');
    }
  }

  private mapStripeStatus(stripeStatus: string): string {
    const statusMap = {
      requires_payment_method: 'PENDING',
      requires_confirmation: 'PENDING',
      requires_action: 'PENDING',
      processing: 'PENDING',
      succeeded: 'COMPLETED',
      canceled: 'FAILED',
    };

    return statusMap[stripeStatus] || 'FAILED';
  }
}
