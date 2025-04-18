import {
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDeliveryDto {
  @IsNumber()
  driverId: number;

  @IsNumber()
  sourceStoreId: number;

  @IsNumber()
  destinationStoreId: number;

  @IsDateString()
  scheduledDate: string;
}

export class LocationUpdateDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsOptional()
  @IsNumber()
  speed?: number;
}

export class DeliveryProofDto {
  @IsOptional()
  @IsString()
  signature?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @IsString()
  receivedBy: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class DeliveryFilterDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  driverId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  storeId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
