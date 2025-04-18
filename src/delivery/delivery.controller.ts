import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeliveryService } from './delivery.service';
import { Delivery } from '../entity/Delivery';
import {
  CreateDeliveryDto,
  LocationUpdateDto,
  DeliveryProofDto,
  DeliveryFilterDto,
} from './dto/delivery.dto';

@Controller('deliveries')
@UseGuards(JwtAuthGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  async createDelivery(
    @Body(new ValidationPipe()) createDeliveryDto: CreateDeliveryDto,
  ): Promise<Delivery> {
    return this.deliveryService.createDelivery(createDeliveryDto);
  }

  @Put(':id/location')
  async updateLocation(
    @Param('id') deliveryId: number,
    @Body(new ValidationPipe()) location: LocationUpdateDto,
  ): Promise<Delivery> {
    return this.deliveryService.updateDeliveryLocation(deliveryId, location);
  }

  @Post(':id/complete')
  async completeDelivery(
    @Param('id') deliveryId: number,
    @Body(new ValidationPipe()) proof: DeliveryProofDto,
  ): Promise<Delivery> {
    return this.deliveryService.completeDelivery(deliveryId, proof);
  }

  @Get(':id')
  async getDeliveryStatus(@Param('id') deliveryId: number): Promise<Delivery> {
    return this.deliveryService.getDeliveryStatus(deliveryId);
  }

  @Get()
  async listDeliveries(
    @Query(new ValidationPipe({ transform: true })) filters: DeliveryFilterDto,
  ): Promise<Delivery[]> {
    return this.deliveryService.listDeliveries(filters);
  }
}
