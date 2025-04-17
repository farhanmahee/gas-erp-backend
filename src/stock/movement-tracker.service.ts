import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovement } from '../entity/StockMovement';
import { Cylinder } from '../entity/Cylinder';
import { Store } from '../entity/Store';
import { User } from '../entity/User';
import * as QRCode from 'qrcode';

@Injectable()
export class MovementTrackerService {
  private readonly logger = new Logger(MovementTrackerService.name);

  constructor(
    @InjectRepository(StockMovement)
    private readonly movementRepository: Repository<StockMovement>,
    @InjectRepository(Cylinder)
    private readonly cylinderRepository: Repository<Cylinder>,
  ) {}

  async recordMovement(
    cylinderId: number,
    sourceLocationId: number,
    destinationLocationId: number,
    movementType: string,
    performedBy: User,
    price?: number,
    remarks?: string,
  ): Promise<StockMovement> {
    // Validate cylinder exists and is available
    const cylinder = await this.cylinderRepository.findOne({
      where: { id: cylinderId },
      relations: ['type'],
    });

    if (!cylinder) {
      throw new BadRequestException('Cylinder not found');
    }

    // Validate movement type based on cylinder status
    await this.validateMovement(cylinder, movementType);

    const movement = this.movementRepository.create({
      cylinder,
      sourceLocation: { store_id: sourceLocationId } as Store,
      destinationLocation: { store_id: destinationLocationId } as Store,
      movementType,
      movementDate: new Date(),
      price,
      remarks,
      performedBy,
      status: 'PENDING',
      referenceNumber: this.generateReferenceNumber(),
    });

    // Generate QR code for movement tracking
    const qrCode = await this.generateMovementQR(movement);
    movement.additionalDetails = { qrCode };

    const savedMovement = await this.movementRepository.save(movement);

    // Update cylinder status and location
    await this.updateCylinderStatus(cylinder, movementType, destinationLocationId);

    return savedMovement;
  }

  private async validateMovement(cylinder: Cylinder, movementType: string): Promise<void> {
    const validTransitions = {
      AVAILABLE: ['OUTWARD', 'MAINTENANCE'],
      IN_USE: ['RETURN', 'MAINTENANCE'],
      MAINTENANCE: ['OUTWARD', 'SCRAP'],
      SCRAPPED: [],
    };

    const currentStatus = cylinder.status;
    const allowedMovements = validTransitions[currentStatus];

    if (!allowedMovements.includes(movementType)) {
      throw new BadRequestException(
        `Invalid movement type ${movementType} for cylinder in ${currentStatus} status`,
      );
    }
  }

  private async updateCylinderStatus(
    cylinder: Cylinder,
    movementType: string,
    destinationLocationId: number,
  ): Promise<void> {
    const statusMap = {
      OUTWARD: 'IN_USE',
      RETURN: 'AVAILABLE',
      MAINTENANCE: 'MAINTENANCE',
      SCRAP: 'SCRAPPED',
    };

    cylinder.status = statusMap[movementType];
    cylinder.currentLocationId = destinationLocationId;

    if (movementType === 'OUTWARD') {
      cylinder.refillCount += 1;
    }

    await this.cylinderRepository.save(cylinder);
  }

  private generateReferenceNumber(): string {
    return `MOV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async generateMovementQR(movement: StockMovement): Promise<string> {
    const data = {
      referenceNumber: movement.referenceNumber,
      cylinderId: movement.cylinder.id,
      movementType: movement.movementType,
      timestamp: movement.movementDate,
    };

    return QRCode.toDataURL(JSON.stringify(data));
  }

  async getMovementHistory(cylinderId: number): Promise<StockMovement[]> {
    return this.movementRepository.find({
      where: { cylinder: { id: cylinderId } },
      relations: ['cylinder', 'sourceLocation', 'destinationLocation', 'performedBy'],
      order: { movementDate: 'DESC' },
    });
  }
}