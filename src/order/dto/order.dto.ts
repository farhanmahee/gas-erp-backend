import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
  Min,
} from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  productId: number;

  @IsOptional()
  @IsNumber()
  cylinderId?: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsObject()
  customizations?: Record<string, any>;
}

export class ShippingAddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  postalCode: string;

  @IsString()
  phone: string;
}

export class CreateOrderDto {
  @IsNumber()
  customerId: number;

  @IsNumber()
  storeId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  status: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class OrderFilterDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  storeId?: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}