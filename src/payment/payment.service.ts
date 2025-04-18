import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Payment } from '../entity/Payment';
import { User } from '../entity/User';
import { Store } from '../entity/Store';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async processPayment(
    amount: number,
    currency: string,
    paymentMethod: string,
    customer: User,
    store: Store,
    metadata?: Record<string, any>,
  ): Promise<Payment> {
    try {
      // Create Stripe payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        payment_method: paymentMethod,
        confirm: true,
        metadata,
      });

      // Create payment record
      const payment = this.paymentRepository.create({
        transactionId: paymentIntent.id,
        amount,
        currency,
        paymentMethod,
        paymentGateway: 'stripe',
        status: this.mapStripeStatus(paymentIntent.status),
        gatewayResponse: paymentIntent,
        metadata,
        customer,
        store,
        receiptUrl: paymentIntent.charges.data[0]?.receipt_url,
      });

      return this.paymentRepository.save(payment);
    } catch (error) {
      this.logger.error('Payment processing failed:', error);
      throw error;
    }
  }

  async refundPayment(
    paymentId: number,
    reason: string,
    amount?: number,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: payment.transactionId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: this.mapRefundReason(reason),
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
      throw error;
    }
  }

  async getPaymentStatus(paymentId: number): Promise<string> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.paymentGateway === 'stripe') {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        payment.transactionId,
      );
      payment.status = this.mapStripeStatus(paymentIntent.status);
      await this.paymentRepository.save(payment);
    }

    return payment.status;
  }

  private mapStripeStatus(stripeStatus: string): string {
    const statusMap = {
      succeeded: 'COMPLETED',
      processing: 'PENDING',
      requires_payment_method: 'PENDING',
      requires_confirmation: 'PENDING',
      requires_action: 'PENDING',
      canceled: 'FAILED',
    };
    return statusMap[stripeStatus] || 'FAILED';
  }

  private mapRefundReason(reason: string): Stripe.RefundCreateParams.Reason {
    const reasonMap = {
      duplicate: 'duplicate',
      fraudulent: 'fraudulent',
      requested_by_customer: 'requested_by_customer',
    };
    return reasonMap[reason] || 'requested_by_customer';
  }
}
