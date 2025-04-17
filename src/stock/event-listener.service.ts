import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import {
  StockReorderEvent,
  DailyReportEvent,
  MaintenanceReportEvent,
  CylinderInspectionEvent,
  MovementCompletedEvent,
} from './types/event.types';

@Injectable()
export class StockEventListenerService {
  private readonly logger = new Logger(StockEventListenerService.name);

  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent('stock.reorder.needed')
  async handleStockReorderEvent(payload: StockReorderEvent) {
    try {
      await this.notificationService.sendStockAlert({
        store: payload.store.name,
        cylinderType: payload.cylinderType.name,
        current: payload.currentQuantity,
        minimum: 0, // TODO: Get from store settings
        reorderLevel: payload.reorderLevel,
        severity: payload.currentQuantity === 0 ? 'CRITICAL' : 'HIGH',
      });
    } catch (error) {
      this.logger.error('Failed to process stock reorder event:', error);
    }
  }

  @OnEvent('report.daily.generated')
  async handleDailyReportGeneration(payload: DailyReportEvent) {
    try {
      const criticalAlerts = payload.report.alerts.filter(
        (alert) => alert.severity === 'CRITICAL',
      ).length;

      await this.notificationService.sendDailyReportNotification(
        criticalAlerts,
      );

      // Send individual alerts for critical items
      if (criticalAlerts > 0) {
        for (const alert of payload.report.alerts.filter(
          (a) => a.severity === 'CRITICAL',
        )) {
          await this.notificationService.sendStockAlert(alert);
        }
      }
    } catch (error) {
      this.logger.error('Failed to process daily report event:', error);
    }
  }

  @OnEvent('report.maintenance.generated')
  async handleMaintenanceReportGeneration(payload: MaintenanceReportEvent) {
    try {
      await this.notificationService.sendMaintenanceReport(new Date());
    } catch (error) {
      this.logger.error('Failed to process maintenance report event:', error);
    }
  }

  @OnEvent('cylinder.inspection.due')
  async handleCylinderInspectionDue(payload: CylinderInspectionEvent) {
    try {
      await this.notificationService.sendInspectionReminder(payload.cylinders);
    } catch (error) {
      this.logger.error('Failed to process cylinder inspection event:', error);
    }
  }

  @OnEvent('movement.*.completed')
  async handleMovementCompleted(payload: MovementCompletedEvent) {
    try {
      await this.notificationService.sendMovementConfirmation(
        payload.movementId,
        payload.type,
        payload.cylinderId,
        payload.source,
        payload.destination,
      );
    } catch (error) {
      this.logger.error('Failed to process movement completion event:', error);
    }
  }
}
