import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Stock } from '../entity/Stock';
import { StockMovement } from '../entity/StockMovement';
import { Cylinder } from '../entity/Cylinder';
import { Store } from '../entity/Store';
import { NotificationConfigEntity } from '../entity/NotificationConfig';
import { StockMonitorService } from './stock-monitor.service';
import { MovementTrackerService } from './movement-tracker.service';
import { ReportService } from './report.service';
import { SchedulerService } from './scheduler.service';
import { StockEventListenerService } from './event-listener.service';
import { NotificationService } from './notification.service';
import { NotificationConfigService } from './notification-config.service';
import { StockController } from './stock.controller';
import { MovementController } from './movement.controller';
import { ReportController } from './report.controller';
import { NotificationController } from './notification.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stock,
      StockMovement,
      Cylinder,
      Store,
      NotificationConfigEntity,
    ]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  providers: [
    StockMonitorService,
    MovementTrackerService,
    ReportService,
    SchedulerService,
    StockEventListenerService,
    NotificationService,
    NotificationConfigService,
  ],
  controllers: [
    StockController,
    MovementController,
    ReportController,
    NotificationController,
  ],
  exports: [
    StockMonitorService,
    MovementTrackerService,
    ReportService,
    NotificationService,
    NotificationConfigService,
  ],
})
export class StockModule {}
