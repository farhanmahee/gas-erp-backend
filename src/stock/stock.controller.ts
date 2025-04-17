import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StockMonitorService } from './stock-monitor.service';

@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly stockMonitorService: StockMonitorService) {}

  @Get('check-levels')
  async checkStockLevels(): Promise<{ message: string }> {
    await this.stockMonitorService.checkStockLevels();
    return { message: 'Stock levels checked' };
  }

  @Get('report')
  async getStockReport() {
    const report = await this.stockMonitorService.generateStockReport();
    return { data: report };
  }
}