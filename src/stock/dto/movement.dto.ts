import { IsNumber, IsString, IsEnum, IsOptional, Min } from 'class-validator';

export enum MovementType {
  INWARD = 'INWARD',
  OUTWARD = 'OUTWARD',
  TRANSFER = 'TRANSFER',
  RETURN = 'RETURN',
  MAINTENANCE = 'MAINTENANCE',
  SCRAP = 'SCRAP',
}

export class CreateMovementDto {
  @IsNumber()
  cylinderId: number;

  @IsNumber()
  sourceLocationId: number;

  @IsNumber()
  destinationLocationId: number;

  @IsEnum(MovementType)
  movementType: MovementType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}