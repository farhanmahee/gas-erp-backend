import { IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class DateRangeDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class DailyInventoryQueryDto {
  @IsDateString()
  date: string;
}

export class MaintenanceReportQueryDto extends DateRangeDto {}

export class DistributionReportQueryDto extends DateRangeDto {
  @IsNumber()
  @Type(() => Number)
  storeId: number;
}