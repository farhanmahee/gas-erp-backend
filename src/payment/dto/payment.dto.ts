import { IsNumber, IsString, IsOptional } from 'class-validator';

export class ProcessPaymentDto {
  @IsNumber()
  orderId: number;

  @IsString()
  paymentMethodId: string;
}

export class RefundPaymentDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
