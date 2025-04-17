import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StockMonitorService } from './stock-monitor.service';
import { ReportService } from './report.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly stockMonitorService: StockMonitorService,
    private readonly reportService: ReportService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkStockLevels() {
    this.logger.log('Running scheduled stock level check');
    await this.stockMonitorService.checkStockLevels();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyInventoryReport() {
    this.logger.log('Generating daily inventory report');
    const report = await this.reportService.generateDailyInventoryReport(
      new Date(),
    );
    this.eventEmitter.emit('report.daily.generated', { report });
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async generateMonthlyMaintenanceReport() {
    this.logger.log('Generating monthly maintenance report');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    const report = await this.reportService.generateMaintenanceReport(
      startDate,
      endDate,
    );
    this.eventEmitter.emit('report.maintenance.generated', { report });
  }

  @Cron(CronExpression.EVERY_DAY_AT_6PM)
  async checkCylinderInspectionDates() {
    this.logger.log('Checking cylinder inspection dates');
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const maintenanceReport =
      await this.reportService.generateMaintenanceReport(
        today,
        thirtyDaysFromNow,
      );

    if (maintenanceReport.upcomingInspections.length > 0) {
      this.eventEmitter.emit('cylinder.inspection.due', {
        cylinders: maintenanceReport.upcomingInspections,
      });
    }
  }
}
