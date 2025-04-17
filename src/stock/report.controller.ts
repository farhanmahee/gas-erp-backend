import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportService } from './report.service';
import {
  DailyInventoryReport,
  MaintenanceReport,
  DistributionReport,
} from './types/report.types';
import {
  DailyInventoryQueryDto,
  MaintenanceReportQueryDto,
  DistributionReportQueryDto,
} from './dto/report-query.dto';

interface ReportResponse<T> {
  data: T;
  timestamp: string;
}

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('daily-inventory')
  async getDailyInventoryReport(
    @Query() query: DailyInventoryQueryDto,
  ): Promise<ReportResponse<DailyInventoryReport>> {
    const report = await this.reportService.generateDailyInventoryReport(
      new Date(query.date),
    );
    return {
      data: report,
      timestamp: new Date().toISOString(),
    } as const;
  }

  @Get('maintenance')
  async getMaintenanceReport(
    @Query() query: MaintenanceReportQueryDto,
  ): Promise<ReportResponse<MaintenanceReport>> {
    const report = await this.reportService.generateMaintenanceReport(
      new Date(query.startDate),
      new Date(query.endDate),
    );
    return {
      data: report,
      timestamp: new Date().toISOString(),
    } as const;
  }

  @Get('distribution')
  async getDistributionReport(
    @Query() query: DistributionReportQueryDto,
  ): Promise<ReportResponse<DistributionReport>> {
    const report = await this.reportService.generateDistributionReport(
      query.storeId,
      new Date(query.startDate),
      new Date(query.endDate),
    );
    return {
      data: report,
      timestamp: new Date().toISOString(),
    } as const;
  }
}
