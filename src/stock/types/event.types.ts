import {
  DailyInventoryReport,
  MaintenanceReport,
  InspectionSummary,
} from './report.types';

export interface StockReorderEvent {
  stockId: number;
  store: {
    id: number;
    name: string;
  };
  cylinderType: {
    id: number;
    name: string;
  };
  currentQuantity: number;
  reorderLevel: number;
}

export interface DailyReportEvent {
  report: DailyInventoryReport;
}

export interface MaintenanceReportEvent {
  report: MaintenanceReport;
}

export interface CylinderInspectionEvent {
  cylinders: InspectionSummary[];
}

export interface MovementCompletedEvent {
  movementId: number;
  type: string;
  cylinderId: number;
  source: string;
  destination: string;
  // Additional metadata that might be useful for tracking
  timestamp: Date;
  performedBy: {
    id: number;
    email: string;
    role: string;
  };
}
