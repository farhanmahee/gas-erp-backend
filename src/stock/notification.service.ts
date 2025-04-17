import { Injectable, Logger } from '@nestjs/common';
import { StockAlert } from './types/report.types';
import { InspectionSummary } from './types/report.types';
import { NotificationConfigService } from './notification-config.service';
import { EmailService } from './email.service';
import { NotificationType, RecipientConfig } from './types/notification.types';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly lastNotificationTime: Map<string, Date> = new Map();

  constructor(
    private readonly configService: NotificationConfigService,
    private readonly emailService: EmailService,
  ) {}

  async sendStockAlert(alert: StockAlert): Promise<void> {
    const recipients = this.configService.getRecipients(
      NotificationType.STOCK_ALERT,
    );
    if (!this.shouldSendNotification(NotificationType.STOCK_ALERT)) {
      return;
    }

    const subject = `[STOCK ALERT - ${alert.severity}] Low Stock Level for ${alert.cylinderType}`;
    const text = `
      STOCK ALERT - ${alert.severity}
      Store: ${alert.store}
      Product: ${alert.cylinderType}
      Current Level: ${alert.current}
      Minimum Level: ${alert.minimum}
      Reorder Level: ${alert.reorderLevel}
      
      Please take appropriate action to maintain optimal stock levels.
    `;

    await this.sendNotification(
      subject,
      text,
      recipients,
      NotificationType.STOCK_ALERT,
    );
  }

  async sendInspectionReminder(cylinders: InspectionSummary[]): Promise<void> {
    const recipients = this.configService.getRecipients(
      NotificationType.INSPECTION_REMINDER,
    );
    if (!this.shouldSendNotification(NotificationType.INSPECTION_REMINDER)) {
      return;
    }

    const subject = `Cylinder Inspection Reminder - ${cylinders.length} Cylinders Due`;
    const text = `
      CYLINDER INSPECTION REMINDER
      Number of cylinders requiring inspection: ${cylinders.length}
      
      Details:
      ${cylinders
        .map(
          (c) =>
            `- ${c.serialNumber} (${c.type}): Due by ${
              c.nextInspection.toISOString().split('T')[0]
            }`,
        )
        .join('\n')}
      
      Please schedule these cylinders for inspection as soon as possible.
    `;

    await this.sendNotification(
      subject,
      text,
      recipients,
      NotificationType.INSPECTION_REMINDER,
    );
  }

  async sendDailyReportNotification(criticalAlerts: number): Promise<void> {
    const recipients = this.configService.getRecipients(
      NotificationType.DAILY_REPORT,
    );
    const today = new Date().toISOString().split('T')[0];

    const subject = `Daily Inventory Report - ${today}`;
    const text = `
      DAILY INVENTORY REPORT
      Date: ${today}
      Critical Alerts: ${criticalAlerts}
      
      ${criticalAlerts > 0 ? 'IMMEDIATE ATTENTION REQUIRED' : 'All stock levels are within acceptable ranges'}
      
      Please review the full report in the system for detailed information.
      Access the report at: [System URL]/reports/daily/${today}
    `;

    await this.sendNotification(
      subject,
      text,
      recipients,
      NotificationType.DAILY_REPORT,
    );
  }

  async sendMaintenanceReport(reportDate: Date): Promise<void> {
    const recipients = this.configService.getRecipients(
      NotificationType.MAINTENANCE_REPORT,
    );
    const subject = `Monthly Maintenance Report - ${reportDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    const text = `
      MONTHLY MAINTENANCE REPORT
      Period: ${reportDate.toISOString().split('T')[0]}
      
      The monthly maintenance report has been generated and is ready for review.
      Please access the system to view the full report and schedule necessary maintenance activities.
      
      Access the report at: [System URL]/reports/maintenance/${reportDate.toISOString().split('T')[0]}
    `;

    await this.sendNotification(
      subject,
      text,
      recipients,
      NotificationType.MAINTENANCE_REPORT,
    );
  }

  async sendMovementConfirmation(
    movementId: number,
    type: string,
    cylinderId: number,
    source: string,
    destination: string,
  ): Promise<void> {
    const recipients = this.configService.getRecipients(
      NotificationType.MOVEMENT_CONFIRMATION,
    );
    const subject = `Movement Confirmation - ${type} #${movementId}`;
    const text = `
      MOVEMENT CONFIRMATION
      Movement ID: ${movementId}
      Type: ${type}
      Cylinder ID: ${cylinderId}
      From: ${source}
      To: ${destination}
      Time: ${new Date().toISOString()}
      
      This movement has been successfully recorded in the system.
      View movement details at: [System URL]/movements/${movementId}
    `;

    await this.sendNotification(
      subject,
      text,
      recipients,
      NotificationType.MOVEMENT_CONFIRMATION,
    );
  }

  private shouldSendNotification(type: NotificationType): boolean {
    const config = this.configService.getNotificationConfig(type);
    if (!config.enabled) {
      return false;
    }

    if (config.throttleInterval) {
      const lastSent = this.lastNotificationTime.get(type);
      if (lastSent) {
        const timeSinceLastNotification =
          new Date().getTime() - lastSent.getTime();
        const throttleMs = config.throttleInterval * 60 * 1000; // Convert minutes to milliseconds
        if (timeSinceLastNotification < throttleMs) {
          this.logger.debug(
            `Notification of type ${type} throttled. Will be available in ${
              (throttleMs - timeSinceLastNotification) / 1000
            } seconds`,
          );
          return false;
        }
      }
    }

    return true;
  }

  private async sendNotification(
    subject: string,
    text: string,
    recipients: RecipientConfig[],
    type: NotificationType,
  ): Promise<void> {
    if (recipients.length === 0) {
      this.logger.warn(
        `No recipients configured for notification type: ${type}`,
      );
      return;
    }

    const emails = recipients.map((r) => r.email);

    try {
      await this.emailService.sendEmail({
        to: emails,
        subject,
        text,
      });

      // Update last notification time for throttling
      this.lastNotificationTime.set(type, new Date());
    } catch (error) {
      this.logger.error(
        `Failed to send ${type} notification to ${emails.join(', ')}:`,
        error,
      );
      throw error;
    }
  }
}
