import { incidentOperationsData } from './incidentOperationsData';

export type AvailabilityStatus = 'Healthy' | 'Degraded' | 'At Risk';

export interface ServiceAvailabilityRecord {
  service: string;
  uptime: number;
  slaTarget: number;
  status: AvailabilityStatus;
}

export const serviceAvailabilityData: ServiceAvailabilityRecord[] = [
  { service: 'Fraud Engine', uptime: 99.85, slaTarget: 99.9, status: 'At Risk' },
  { service: 'UPI Switch', uptime: 99.88, slaTarget: 99.9, status: 'At Risk' },
  { service: 'Payment Gateway', uptime: 99.95, slaTarget: 99.9, status: 'Degraded' },
  { service: 'Net Banking Portal', uptime: 99.93, slaTarget: 99.9, status: 'Degraded' },
  { service: 'Notification Hub', uptime: 99.99, slaTarget: 99.9, status: 'Healthy' },
];

export const availabilityTrend30d = Array.from({ length: 30 }, (_, index) => {
  const day = index + 1;
  const base = day / 30;
  return {
    day: `D${day}`,
    upiSwitch: Number((99.08 + base * 0.72 + Math.sin(day / 3) * 0.06).toFixed(2)),
    paymentGateway: Number((99.52 + base * 0.35 + Math.cos(day / 4) * 0.04).toFixed(2)),
    fraudEngine: Number((98.86 + base * 0.88 + Math.sin(day / 2.6) * 0.07).toFixed(2)),
    netBankingPortal: Number((99.24 + base * 0.56 + Math.cos(day / 5) * 0.05).toFixed(2)),
  };
});

export const slaComplianceTracker = [
  { service: 'Fraud Engine', compliance: 98.9, breaches: 3 },
  { service: 'UPI Switch', compliance: 99.0, breaches: 2 },
  { service: 'Payment Gateway', compliance: 99.4, breaches: 1 },
  { service: 'Net Banking Portal', compliance: 99.8, breaches: 1 },
  { service: 'Notification Hub', compliance: 98.9, breaches: 1 },
];

export const serviceDependencyImpact = [
  {
    service: 'Fraud Engine',
    dependency: 'Model Serving Cluster',
    risk: 'high',
    impact: 'High scoring latency can delay payment authorization and increase manual review queue.',
  },
  {
    service: 'UPI Switch',
    dependency: 'Core Network Router Pair',
    risk: 'high',
    impact: 'Packet loss causes increased reversals and customer-visible payment retries.',
  },
  {
    service: 'Payment Gateway',
    dependency: 'External Acquirer API',
    risk: 'medium',
    impact: 'Partner-side latency increases card authorization timeout variance.',
  },
  {
    service: 'Net Banking Portal',
    dependency: 'Read Replica Database',
    risk: 'medium',
    impact: 'Replica lag affects login/session stability during peak usage.',
  },
];

export function getAvailabilityKpis() {
  const overallAvailability = Number(
    (
      serviceAvailabilityData.reduce((sum, service) => sum + service.uptime, 0) /
      serviceAvailabilityData.length
    ).toFixed(2),
  );
  const slaCompliance = Number(
    (
      slaComplianceTracker.reduce((sum, service) => sum + service.compliance, 0) /
      slaComplianceTracker.length
    ).toFixed(1),
  );
  const servicesBelowSla = serviceAvailabilityData.filter((service) => service.uptime < service.slaTarget).length;
  const degradedServices = serviceAvailabilityData.filter((service) => service.status !== 'Healthy').length;

  return {
    overallAvailability,
    slaCompliance,
    servicesBelowSla,
    degradedServices,
  };
}

export function getServiceIncidentMap() {
  return serviceAvailabilityData.map((service) => ({
    service: service.service,
    incidents: incidentOperationsData.filter((incident) => incident.service === service.service),
  }));
}
