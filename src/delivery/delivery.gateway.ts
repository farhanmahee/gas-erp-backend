import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeliveryService } from './delivery.service';
import { LocationUpdateDto } from './dto/delivery.dto';

@WebSocketGateway({
  namespace: 'deliveries',
  cors: {
    origin: '*', // Configure according to your frontend domain
  },
})
export class DeliveryGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly deliveryRooms = new Map<number, Set<string>>();

  constructor(private readonly deliveryService: DeliveryService) {}

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    const deliveryId = client.handshake.query.deliveryId as string;
    if (deliveryId) {
      await this.joinDeliveryRoom(client, parseInt(deliveryId, 10));
    }
  }

  handleDisconnect(client: Socket) {
    this.leaveAllRooms(client);
  }

  @SubscribeMessage('track-delivery')
  async handleTrackDelivery(client: Socket, deliveryId: number) {
    await this.joinDeliveryRoom(client, deliveryId);
  }

  @SubscribeMessage('update-location')
  async handleLocationUpdate(
    client: Socket,
    payload: { deliveryId: number; location: LocationUpdateDto },
  ) {
    const { deliveryId, location } = payload;
    const delivery = await this.deliveryService.updateDeliveryLocation(
      deliveryId,
      location,
    );

    this.server.to(`delivery:${deliveryId}`).emit('location-updated', {
      deliveryId,
      location: delivery.currentLocation,
      timestamp: new Date(),
    });
  }

  private async joinDeliveryRoom(client: Socket, deliveryId: number) {
    const roomName = `delivery:${deliveryId}`;
    await client.join(roomName);

    if (!this.deliveryRooms.has(deliveryId)) {
      this.deliveryRooms.set(deliveryId, new Set());
    }
    this.deliveryRooms.get(deliveryId).add(client.id);

    // Send initial delivery status
    const delivery = await this.deliveryService.getDeliveryStatus(deliveryId);
    client.emit('delivery-status', delivery);
  }

  private leaveAllRooms(client: Socket) {
    this.deliveryRooms.forEach((clients, deliveryId) => {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        if (clients.size === 0) {
          this.deliveryRooms.delete(deliveryId);
        }
      }
    });
  }

  // Method to broadcast delivery status updates
  public broadcastDeliveryUpdate(deliveryId: number, update: any) {
    this.server.to(`delivery:${deliveryId}`).emit('delivery-updated', update);
  }
}
