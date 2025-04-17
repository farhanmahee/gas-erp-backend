import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual } from 'typeorm';
import { StockMovement } from '../entity/StockMovement';
import { Cylinder } from '../entity/Cylinder';
import { Stock } from '../entity/Stock';
import { Store } from '../entity/Store';
import {
  DailyInventoryReport,
  MaintenanceReport,
  DistributionReport,
  StockStatus,
  MovementSummary,
  StockAlert,
  InspectionSummary,
  MaintenanceRecord,
  DistributionSummary,
} from './types/report.types';

type GroupableRecord = {
  [key: string]: string | number;
};

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly movementRepository: Repository<StockMovement>,
    @InjectRepository(Cylinder)
    private readonly cylinderRepository: Repository<Cylinder>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async generateDailyInventoryReport(
    date: Date,
  ): Promise<DailyInventoryReport> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const movements = await this.movementRepository.find({
      where: {
        movementDate: Between(startOfDay, endOfDay),
      },
      relations: [
        'cylinder',
        'cylinder.type',
        'sourceLocation',
        'destinationLocation',
      ],
    });

    const stocks = await this.stockRepository.find({
      relations: ['store', 'cylinderType'],
    });

    return {
      date: date,
      movements: this.summarizeMovements(movements),
      stockLevels: this.summarizeStockLevels(stocks),
      alerts: this.generateStockAlerts(stocks),
    };
  }

  async generateMaintenanceReport(
    startDate: Date,
    endDate: Date,
  ): Promise<MaintenanceReport> {
    const cylinders = await this.cylinderRepository.find({
      where: [
        { lastInspectionDate: Between(startDate, endDate) },
        { nextInspectionDate: LessThanOrEqual(endDate) },
      ],
      relations: ['type'],
    });

    const maintenanceMovements = await this.movementRepository.find({
      where: {
        movementType: 'MAINTENANCE',
        movementDate: Between(startDate, endDate),
      },
      relations: ['cylinder', 'cylinder.type'],
    });

    return {
      period: { start: startDate, end: endDate },
      upcomingInspections: this.summarizeInspections(cylinders),
      completedMaintenance: this.summarizeMaintenance(maintenanceMovements),
    };
  }

  async generateDistributionReport(
    storeId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<DistributionReport> {
    const store = await this.storeRepository.findOne({
      where: { store_id: storeId },
      relations: ['products'],
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    const movements = await this.movementRepository.find({
      where: [
        {
          sourceLocation: { store_id: storeId },
          movementDate: Between(startDate, endDate),
        },
        {
          destinationLocation: { store_id: storeId },
          movementDate: Between(startDate, endDate),
        },
      ],
      relations: [
        'cylinder',
        'cylinder.type',
        'sourceLocation',
        'destinationLocation',
      ],
    });

    return {
      store: {
        id: store.store_id,
        name: store.name,
      },
      period: { start: startDate, end: endDate },
      inboundMovements: movements.filter(
        (m) => m.destinationLocation?.store_id === storeId,
      ),
      outboundMovements: movements.filter(
        (m) => m.sourceLocation?.store_id === storeId,
      ),
      summary: this.summarizeDistribution(movements, storeId),
    };
  }

  private summarizeMovements(movements: StockMovement[]): MovementSummary {
    return {
      total: movements.length,
      byType: this.groupBy(movements as GroupableRecord[], 'movementType'),
      byLocation: this.groupByLocation(movements),
    };
  }

  private summarizeStockLevels(stocks: Stock[]): Record<string, StockStatus> {
    return stocks.reduce<Record<string, StockStatus>>((acc, stock) => {
      const key = `${stock.store.name}-${stock.cylinderType.name}`;
      acc[key] = {
        available: stock.quantityAvailable,
        booked: stock.quantityBooked,
        status: this.getStockStatus(stock),
      };
      return acc;
    }, {});
  }

  private generateStockAlerts(stocks: Stock[]): StockAlert[] {
    return stocks
      .filter((stock) => stock.quantityAvailable <= stock.reorderLevel)
      .map((stock) => ({
        store: stock.store.name,
        cylinderType: stock.cylinderType.name,
        current: stock.quantityAvailable,
        minimum: stock.minimumQuantity,
        reorderLevel: stock.reorderLevel,
        severity: this.getAlertSeverity(stock),
      }));
  }

  private summarizeInspections(cylinders: Cylinder[]): InspectionSummary[] {
    return cylinders.map((cylinder) => ({
      id: cylinder.id,
      type: cylinder.type.name,
      serialNumber: cylinder.serialNumber,
      lastInspection: cylinder.lastInspectionDate,
      nextInspection: cylinder.nextInspectionDate,
      status: cylinder.status,
    }));
  }

  private summarizeMaintenance(
    movements: StockMovement[],
  ): MaintenanceRecord[] {
    return movements.map((movement) => ({
      date: movement.movementDate,
      cylinderId: movement.cylinder.id,
      cylinderType: movement.cylinder.type.name,
      remarks: movement.remarks,
      status: movement.status,
    }));
  }

  private summarizeDistribution(
    movements: StockMovement[],
    storeId: number,
  ): DistributionSummary {
    const inbound = movements.filter(
      (m) => m.destinationLocation?.store_id === storeId,
    );
    const outbound = movements.filter(
      (m) => m.sourceLocation?.store_id === storeId,
    );

    return {
      totalInbound: inbound.length,
      totalOutbound: outbound.length,
      inboundByType: this.groupBy(inbound as GroupableRecord[], 'movementType'),
      outboundByType: this.groupBy(
        outbound as GroupableRecord[],
        'movementType',
      ),
    };
  }

  private groupBy(
    array: GroupableRecord[],
    key: string,
  ): Record<string, number> {
    return array.reduce<Record<string, number>>((acc, item) => {
      const groupKey = String(item[key] || '');
      acc[groupKey] = (acc[groupKey] || 0) + 1;
      return acc;
    }, {});
  }

  private groupByLocation(
    movements: StockMovement[],
  ): Record<string, { inbound: number; outbound: number }> {
    return movements.reduce<
      Record<string, { inbound: number; outbound: number }>
    >((acc, movement) => {
      const source = movement.sourceLocation?.name || 'Unknown';
      const destination = movement.destinationLocation?.name || 'Unknown';

      if (!acc[source]) {
        acc[source] = { inbound: 0, outbound: 0 };
      }
      if (!acc[destination]) {
        acc[destination] = { inbound: 0, outbound: 0 };
      }

      acc[source].outbound++;
      acc[destination].inbound++;

      return acc;
    }, {});
  }

  private getStockStatus(stock: Stock): StockStatus['status'] {
    const availablePercentage =
      (stock.quantityAvailable / stock.maximumQuantity) * 100;

    if (availablePercentage <= 20) return 'CRITICAL';
    if (availablePercentage <= 40) return 'LOW';
    if (availablePercentage <= 60) return 'MODERATE';
    if (availablePercentage <= 80) return 'GOOD';
    return 'OPTIMAL';
  }

  private getAlertSeverity(stock: Stock): StockAlert['severity'] {
    const availablePercentage =
      (stock.quantityAvailable / stock.minimumQuantity) * 100;

    if (availablePercentage <= 50) return 'CRITICAL';
    if (availablePercentage <= 75) return 'HIGH';
    return 'MODERATE';
  }
}
