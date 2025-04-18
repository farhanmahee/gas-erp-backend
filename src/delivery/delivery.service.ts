import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  Client as GoogleMapsClient,
  LatLng,
} from '@googlemaps/google-maps-services-js';
import { Delivery } from '../entity/Delivery';
import { User } from '../entity/User';
import { Store } from '../entity/Store';
import { DeliveryGateway } from './delivery.gateway';
import {
  CreateDeliveryDto,
  LocationUpdateDto,
  DeliveryProofDto,
  DeliveryFilterDto,
} from './dto/delivery.dto';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);
  private readonly googleMapsClient: GoogleMapsClient;

  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => DeliveryGateway))
    private readonly deliveryGateway: DeliveryGateway,
  ) {
    this.googleMapsClient = new GoogleMapsClient({});
  }

  async createDelivery(
    createDeliveryDto: CreateDeliveryDto,
  ): Promise<Delivery> {
    const { driverId, sourceStoreId, destinationStoreId, scheduledDate } =
      createDeliveryDto;

    const driver = { id: driverId } as User;
    const sourceStore = { store_id: sourceStoreId } as Store;
    const destinationStore = { store_id: destinationStoreId } as Store;

    const route = await this.calculateRoute(sourceStore, destinationStore);

    const delivery = this.deliveryRepository.create({
      trackingNumber: this.generateTrackingNumber(),
      driver,
      sourceStore,
      destinationStore,
      scheduledDate: new Date(scheduledDate),
      route,
      status: 'PENDING',
    });

    const savedDelivery = await this.deliveryRepository.save(delivery);
    this.deliveryGateway.broadcastDeliveryUpdate(savedDelivery.id, {
      type: 'DELIVERY_CREATED',
      delivery: savedDelivery,
    });

    return savedDelivery;
  }

  async updateDeliveryLocation(
    deliveryId: number,
    location: LocationUpdateDto,
  ): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
      relations: ['driver', 'sourceStore', 'destinationStore'],
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    delivery.currentLocation = {
      ...location,
      timestamp: new Date(),
    };

    if (delivery.status === 'PENDING') {
      delivery.status = 'IN_TRANSIT';
    }

    const updatedDelivery = await this.deliveryRepository.save(delivery);
    this.deliveryGateway.broadcastDeliveryUpdate(deliveryId, {
      type: 'LOCATION_UPDATED',
      delivery: updatedDelivery,
    });

    return updatedDelivery;
  }

  async completeDelivery(
    deliveryId: number,
    proof: DeliveryProofDto,
  ): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
      relations: ['driver', 'sourceStore', 'destinationStore'],
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    delivery.status = 'DELIVERED';
    delivery.deliveredAt = new Date();
    delivery.deliveryProof = proof;

    const completedDelivery = await this.deliveryRepository.save(delivery);
    this.deliveryGateway.broadcastDeliveryUpdate(deliveryId, {
      type: 'DELIVERY_COMPLETED',
      delivery: completedDelivery,
    });

    return completedDelivery;
  }

  async getDeliveryStatus(deliveryId: number): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
      relations: ['driver', 'sourceStore', 'destinationStore'],
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    return delivery;
  }

  async listDeliveries(filters: DeliveryFilterDto): Promise<Delivery[]> {
    const queryBuilder = this.deliveryRepository
      .createQueryBuilder('delivery')
      .leftJoinAndSelect('delivery.driver', 'driver')
      .leftJoinAndSelect('delivery.sourceStore', 'sourceStore')
      .leftJoinAndSelect('delivery.destinationStore', 'destinationStore');

    if (filters.status) {
      queryBuilder.andWhere('delivery.status = :status', {
        status: filters.status,
      });
    }

    if (filters.driverId) {
      queryBuilder.andWhere('driver.id = :driverId', {
        driverId: filters.driverId,
      });
    }

    if (filters.storeId) {
      queryBuilder.andWhere(
        '(sourceStore.store_id = :storeId OR destinationStore.store_id = :storeId)',
        { storeId: filters.storeId },
      );
    }

    if (filters.startDate) {
      queryBuilder.andWhere('delivery.scheduledDate >= :startDate', {
        startDate: new Date(filters.startDate),
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('delivery.scheduledDate <= :endDate', {
        endDate: new Date(filters.endDate),
      });
    }

    return queryBuilder.getMany();
  }

  private async calculateRoute(
    sourceStore: Store,
    destinationStore: Store,
  ): Promise<Delivery['route']> {
    try {
      const response = await this.googleMapsClient.directions({
        params: {
          origin: `${sourceStore.address}, ${sourceStore.city}, ${sourceStore.country}`,
          destination: `${destinationStore.address}, ${destinationStore.city}, ${destinationStore.country}`,
          key: this.configService.get('GOOGLE_MAPS_API_KEY'),
        },
      });

      const route = response.data.routes[0];
      const leg = route.legs[0];

      return {
        startLocation: {
          lat: leg.start_location.lat,
          lng: leg.start_location.lng,
        },
        endLocation: {
          lat: leg.end_location.lat,
          lng: leg.end_location.lng,
        },
        waypoints: route.overview_path?.map((point: LatLng) => ({
          lat: point.lat,
          lng: point.lng,
        })),
      };
    } catch (error) {
      this.logger.error('Failed to calculate route:', error);
      throw error;
    }
  }

  private generateTrackingNumber(): string {
    return `DEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
