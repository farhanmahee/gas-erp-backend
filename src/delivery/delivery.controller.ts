import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeliveryService } from './delivery.service';
import { Delivery } from '../entity/Delivery';

@Controller('deliveries')
@UseGuards(JwtAuthGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  async createDelivery(
    @Body()
    deliveryData: {
      driverId: number;
      sourceStoreId: number;
      destinationStoreId: number;
      scheduledDate: string;
    },
  ): Promise<Delivery> {
    const { driverId, sourceStoreId, destinationStoreId, scheduledDate } =
      deliveryData;
    return this.deliveryService.createDelivery(
      { id: driverId } as any,
      { store_id: sourceStoreId } as any,
      { store_id: destinationStoreId } as any,
      new Date(scheduledDate),
    );
  }

  @Put(':id/location')
  async updateLocation(
    @Param('id') deliveryId: number,
    @Body() locationData: { lat: number; lng: number; speed?: number },
  ): Promise<Delivery> {
    return this.deliveryService.updateDeliveryLocation(
      deliveryId,
      locationData,
    );
  }

  @Post(':id/complete')
  async completeDelivery(
    @Param('id') deliveryId: number,
    @Body()
    proof: {
      signature?: string;
      photos?: string[];
      receivedBy: string;
      notes?: string;
    },
  ): Promise<Delivery> {
    return this.deliveryService.completeDelivery(deliveryId, proof);
  }

  @Get(':id')
  async getDeliveryStatus(@Param('id') deliveryId: number): Promise<Delivery> {
    return this.deliveryService.getDeliveryStatus(deliveryId);
  }

  @Get()
  async listDeliveries(
    @Query('status') status?: string,
    @Query('driverId') driverId?: number,
    @Query('storeId') storeId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Delivery[]> {
    // TODO: Implement delivery listing with filters
    return [];
  }
}
