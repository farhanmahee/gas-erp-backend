import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentService } from './payment.service';
import { Payment } from '../entity/Payment';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('process')
  async processPayment(
    @Body()
    paymentData: {
      amount: number;
      currency: string;
      paymentMethod: string;
      customerId: number;
      storeId: number;
      metadata?: Record<string, any>;
    },
  ): Promise<Payment> {
    const { amount, currency, paymentMethod, customerId, storeId, metadata } =
      paymentData;
    return this.paymentService.processPayment(
      amount,
      currency,
      paymentMethod,
      { id: customerId } as any,
      { store_id: storeId } as any,
      metadata,
    );
  }

  @Post(':id/refund')
  async refundPayment(
    @Param('id') paymentId: number,
    @Body() refundData: { reason: string; amount?: number },
  ): Promise<Payment> {
    return this.paymentService.refundPayment(
      paymentId,
      refundData.reason,
      refundData.amount,
    );
  }

  @Get(':id/status')
  async getPaymentStatus(@Param('id') paymentId: number): Promise<string> {
    return this.paymentService.getPaymentStatus(paymentId);
  }

  @Get('transactions')
  async getTransactions(
    @Query('storeId') storeId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Payment[]> {
    // TODO: Implement transaction listing with filters
    return [];
  }
}
