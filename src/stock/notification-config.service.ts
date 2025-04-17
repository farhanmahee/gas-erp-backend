import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationConfigEntity } from '../entity/NotificationConfig';
import {
  NotificationSettings,
  NotificationConfig,
  NotificationType,
  RecipientConfig,
} from './types/notification.types';
import { Role } from '../auth/role.enum';

@Injectable()
export class NotificationConfigService implements OnModuleInit {
  private readonly logger = new Logger(NotificationConfigService.name);
  private settings: NotificationSettings;

  constructor(
    @InjectRepository(NotificationConfigEntity)
    private readonly configRepository: Repository<NotificationConfigEntity>,
  ) {}

  async onModuleInit() {
    await this.loadConfigurations();
  }

  private async loadConfigurations() {
    const savedConfigs = await this.configRepository.find();

    // Initialize with default settings
    this.settings = {
      stockAlerts: this.getDefaultStockAlertConfig(),
      dailyReports: this.getDefaultDailyReportConfig(),
      maintenanceReports: this.getDefaultMaintenanceReportConfig(),
      inspectionReminders: this.getDefaultInspectionReminderConfig(),
      movementConfirmations: this.getDefaultMovementConfirmationConfig(),
    };

    // Override defaults with saved configurations
    for (const config of savedConfigs) {
      this.settings[this.getSettingsKey(config.type)] = config.config;
    }
  }

  private getSettingsKey(type: NotificationType): keyof NotificationSettings {
    const map: Record<NotificationType, keyof NotificationSettings> = {
      [NotificationType.STOCK_ALERT]: 'stockAlerts',
      [NotificationType.DAILY_REPORT]: 'dailyReports',
      [NotificationType.MAINTENANCE_REPORT]: 'maintenanceReports',
      [NotificationType.INSPECTION_REMINDER]: 'inspectionReminders',
      [NotificationType.MOVEMENT_CONFIRMATION]: 'movementConfirmations',
    };
    return map[type];
  }

  getNotificationConfig(type: NotificationType): NotificationConfig {
    return this.settings[this.getSettingsKey(type)];
  }

  getRecipients(type: NotificationType): RecipientConfig[] {
    const config = this.getNotificationConfig(type);
    return config.enabled ? config.recipients : [];
  }

  async updateNotificationConfig(
    type: NotificationType,
    updates: Partial<NotificationConfig>,
  ): Promise<void> {
    const key = this.getSettingsKey(type);
    const currentConfig = this.settings[key];
    const updatedConfig = { ...currentConfig, ...updates };
    this.settings[key] = updatedConfig;

    await this.saveConfiguration(type, updatedConfig);
  }

  async updateRecipient(
    type: NotificationType,
    email: string,
    updates: Partial<RecipientConfig>,
  ): Promise<void> {
    const config = this.getNotificationConfig(type);
    const recipientIndex = config.recipients.findIndex(
      (r) => r.email === email,
    );

    if (recipientIndex >= 0) {
      config.recipients[recipientIndex] = {
        ...config.recipients[recipientIndex],
        ...updates,
      };
      await this.saveConfiguration(type, config);
    }
  }

  async addRecipient(
    type: NotificationType,
    recipient: RecipientConfig,
  ): Promise<void> {
    const config = this.getNotificationConfig(type);
    if (!config.recipients.some((r) => r.email === recipient.email)) {
      config.recipients.push(recipient);
      await this.saveConfiguration(type, config);
    }
  }

  async removeRecipient(type: NotificationType, email: string): Promise<void> {
    const config = this.getNotificationConfig(type);
    config.recipients = config.recipients.filter((r) => r.email !== email);
    await this.saveConfiguration(type, config);
  }

  private async saveConfiguration(
    type: NotificationType,
    config: NotificationConfig,
  ): Promise<void> {
    try {
      await this.configRepository.upsert(
        {
          type,
          config,
          updatedAt: new Date(),
        },
        ['type'],
      );
    } catch (error) {
      this.logger.error(
        `Failed to save notification config for type ${type}:`,
        error,
      );
      throw error;
    }
  }

  private getDefaultStockAlertConfig(): NotificationConfig {
    return {
      enabled: true,
      recipients: [
        {
          email: 'inventory@example.com',
          role: Role.INVENTORY_MANAGER,
          notificationTypes: [NotificationType.STOCK_ALERT],
        },
        {
          email: 'warehouse@example.com',
          role: Role.WAREHOUSE_MANAGER,
          notificationTypes: [NotificationType.STOCK_ALERT],
        },
      ],
      throttleInterval: 30,
    };
  }

  private getDefaultDailyReportConfig(): NotificationConfig {
    return {
      enabled: true,
      recipients: [
        {
          email: 'manager@example.com',
          role: Role.SUPER_ADMIN,
          notificationTypes: [NotificationType.DAILY_REPORT],
        },
        {
          email: 'inventory@example.com',
          role: Role.INVENTORY_MANAGER,
          notificationTypes: [NotificationType.DAILY_REPORT],
        },
      ],
    };
  }

  private getDefaultMaintenanceReportConfig(): NotificationConfig {
    return {
      enabled: true,
      recipients: [
        {
          email: 'maintenance@example.com',
          role: Role.SYSTEM_ADMIN,
          notificationTypes: [NotificationType.MAINTENANCE_REPORT],
        },
        {
          email: 'operations@example.com',
          role: Role.SUPER_ADMIN,
          notificationTypes: [NotificationType.MAINTENANCE_REPORT],
        },
      ],
    };
  }

  private getDefaultInspectionReminderConfig(): NotificationConfig {
    return {
      enabled: true,
      recipients: [
        {
          email: 'maintenance@example.com',
          role: Role.SYSTEM_ADMIN,
          notificationTypes: [NotificationType.INSPECTION_REMINDER],
        },
        {
          email: 'quality@example.com',
          role: Role.WAREHOUSE_MANAGER,
          notificationTypes: [NotificationType.INSPECTION_REMINDER],
        },
      ],
      throttleInterval: 1440,
    };
  }

  private getDefaultMovementConfirmationConfig(): NotificationConfig {
    return {
      enabled: true,
      recipients: [
        {
          email: 'warehouse@example.com',
          role: Role.WAREHOUSE_MANAGER,
          notificationTypes: [NotificationType.MOVEMENT_CONFIRMATION],
        },
        {
          email: 'inventory@example.com',
          role: Role.INVENTORY_MANAGER,
          notificationTypes: [NotificationType.MOVEMENT_CONFIRMATION],
        },
      ],
    };
  }
}
