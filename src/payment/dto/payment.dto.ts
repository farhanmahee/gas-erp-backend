import { IsNumber, IsString, IsOptional, IsObject, Min } from 'class-validator';

export class ProcessPaymentDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  paymentMethod: string;

  @IsNumber()
  customerId: number;

  @IsNumber()
  storeId: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class RefundPaymentDto {
  @IsString()
  reason: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;
}

export class PaymentFilterDto {
  @IsOptional()
  @IsNumber()
  storeId?: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
