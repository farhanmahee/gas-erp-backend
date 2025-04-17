import { Role } from '../../auth/role.enum';

export interface NotificationConfig {
  enabled: boolean;
  recipients: RecipientConfig[];
  throttleInterval?: number; // in minutes
}

export interface RecipientConfig {
  email: string;
  role: Role;
  notificationTypes: NotificationType[];
}

export enum NotificationType {
  STOCK_ALERT = 'STOCK_ALERT',
  DAILY_REPORT = 'DAILY_REPORT',
  MAINTENANCE_REPORT = 'MAINTENANCE_REPORT',
  INSPECTION_REMINDER = 'INSPECTION_REMINDER',
  MOVEMENT_CONFIRMATION = 'MOVEMENT_CONFIRMATION',
}

export interface NotificationSettings {
  stockAlerts: NotificationConfig;
  dailyReports: NotificationConfig;
  maintenanceReports: NotificationConfig;
  inspectionReminders: NotificationConfig;
  movementConfirmations: NotificationConfig;
}
