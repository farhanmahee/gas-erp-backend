import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DeliveryGateway } from './delivery.gateway';
import { Delivery } from '../entity/Delivery';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery]), ConfigModule],
  providers: [DeliveryService, DeliveryGateway],
  controllers: [DeliveryController],
  exports: [DeliveryService],
})
export class DeliveryModule {}
