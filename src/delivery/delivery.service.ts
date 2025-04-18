import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);
  private readonly googleMapsClient: GoogleMapsClient;

  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    private readonly configService: ConfigService,
  ) {
    this.googleMapsClient = new GoogleMapsClient({});
  }

  async createDelivery(
    driver: User,
    sourceStore: Store,
    destinationStore: Store,
    scheduledDate: Date,
  ): Promise<Delivery> {
    const route = await this.calculateRoute(sourceStore, destinationStore);

    const delivery = this.deliveryRepository.create({
      trackingNumber: this.generateTrackingNumber(),
      driver,
      sourceStore,
      destinationStore,
      scheduledDate,
      route,
      status: 'PENDING',
    });

    return this.deliveryRepository.save(delivery);
  }

  async updateDeliveryLocation(
    deliveryId: number,
    location: { lat: number; lng: number; speed?: number },
  ): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
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

    return this.deliveryRepository.save(delivery);
  }

  async completeDelivery(
    deliveryId: number,
    proof: {
      signature?: string;
      photos?: string[];
      receivedBy: string;
      notes?: string;
    },
  ): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    delivery.status = 'DELIVERED';
    delivery.deliveredAt = new Date();
    delivery.deliveryProof = proof;

    return this.deliveryRepository.save(delivery);
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
