export interface StockStatus {
  available: number;
  booked: number;
  status: 'CRITICAL' | 'LOW' | 'MODERATE' | 'GOOD' | 'OPTIMAL';
}

export interface StockAlert {
  store: string;
  cylinderType: string;
  current: number;
  minimum: number;
  reorderLevel: number;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
}

export interface MovementSummary {
  total: number;
  byType: Record<string, number>;
  byLocation: Record<string, { inbound: number; outbound: number }>;
}

export interface DailyInventoryReport {
  date: Date;
  movements: MovementSummary;
  stockLevels: Record<string, StockStatus>;
  alerts: StockAlert[];
}

export interface InspectionSummary {
  id: number;
  type: string;
  serialNumber: string;
  lastInspection: Date;
  nextInspection: Date;
  status: string;
}

export interface MaintenanceRecord {
  date: Date;
  cylinderId: number;
  cylinderType: string;
  remarks: string;
  status: string;
}

export interface MaintenanceReport {
  period: {
    start: Date;
    end: Date;
  };
  upcomingInspections: InspectionSummary[];
  completedMaintenance: MaintenanceRecord[];
}

export interface DistributionSummary {
  totalInbound: number;
  totalOutbound: number;
  inboundByType: Record<string, number>;
  outboundByType: Record<string, number>;
}

export interface DistributionReport {
  store: {
    id: number;
    name: string;
  };
  period: {
    start: Date;
    end: Date;
  };
  inboundMovements: any[];
  outboundMovements: any[];
  summary: DistributionSummary;
}