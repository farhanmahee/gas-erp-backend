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
  async createDelivery(): Promise<Delivery> {
    @Body(new ValidationPipe()) createDeliveryDto: CreateDeliveryDto,urceStoreId, destinationStoreId, scheduledDate } =
  ): Promise<Delivery> {
    return this.deliveryService.createDelivery(createDeliveryDto);iveryService.createDelivery(
  }
d } as any,
  @Put(':id/location') any,
  async updateLocation(
    @Param('id') deliveryId: number,
    @Body(new ValidationPipe()) location: LocationUpdateDto,
  ): Promise<Delivery> {
    return this.deliveryService.updateDeliveryLocation(deliveryId, location);  @Put(':id/location')
  }(
ryId: number,
  @Post(':id/complete')ber; lng: number; speed?: number },
  async completeDelivery(
    @Param('id') deliveryId: number,Service.updateDeliveryLocation(
    @Body(new ValidationPipe()) proof: DeliveryProofDto,
  ): Promise<Delivery> {a,
    return this.deliveryService.completeDelivery(deliveryId, proof);
  }

  @Get(':id')  @Post(':id/complete')
  async getDeliveryStatus(@Param('id') deliveryId: number): Promise<Delivery> {y(
    return this.deliveryService.getDeliveryStatus(deliveryId);Id: number,
  }
{
  @Get()ure?: string;
  async listDeliveries(
    @Query(new ValidationPipe({ transform: true })) filters: DeliveryFilterDto,;
  ): Promise<Delivery[]> {
    return this.deliveryService.listDeliveries(filters);
  }romise<Delivery> {
}Service.completeDelivery(deliveryId, proof);
