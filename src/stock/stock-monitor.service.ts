import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '../entity/Stock';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StockMonitorService {
  private readonly logger = new Logger(StockMonitorService.name);

  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private eventEmitter: EventEmitter2,
  ) {}

  async checkStockLevels(): Promise<void> {
    const stocks = await this.stockRepository.find({
      relations: ['store', 'cylinderType'],
    });

    for (const stock of stocks) {
      if (stock.quantityAvailable <= stock.reorderLevel) {
        this.eventEmitter.emit('stock.reorder.needed', {
          stockId: stock.id,
          store: stock.store,
          cylinderType: stock.cylinderType,
          currentQuantity: stock.quantityAvailable,
          reorderLevel: stock.reorderLevel,
        });

        this.logger.warn(
          `Stock level alert: Store ${stock.store.name} has low stock of ${stock.cylinderType.name}`,
        );
      }
    }
  }

  async generateStockReport(): Promise<any> {
    const stocks = await this.stockRepository.find({
      relations: ['store', 'cylinderType'],
    });

    return stocks.map(stock => ({
      storeId: stock.store.store_id,
      storeName: stock.store.name,
      cylinderType: stock.cylinderType.name,
      available: stock.quantityAvailable,
      booked: stock.quantityBooked,
      reorderLevel: stock.reorderLevel,
      status: this.getStockStatus(stock),
    }));
  }

  private getStockStatus(stock: Stock): string {
    const availablePercentage = (stock.quantityAvailable / stock.maximumQuantity) * 100;
    
    if (availablePercentage <= 20) return 'CRITICAL';
    if (availablePercentage <= 40) return 'LOW';
    if (availablePercentage <= 60) return 'MODERATE';
    if (availablePercentage <= 80) return 'GOOD';
    return 'OPTIMAL';
  }
}