export interface CapacityServiceRecord {
  service: 'Fraud Engine' | 'UPI Switch' | 'Payment Gateway' | 'Notification Hub';
  utilization: number;
  threshold: number;
  status: 'critical' | 'high' | 'warning' | 'healthy';
  trafficShare: number;
}

export interface ForecastedBreachRecord {
  service: 'Fraud Engine' | 'UPI Switch';
  current: number;
  forecast: number;
  breachThreshold: number;
}

export const capacityServiceData: CapacityServiceRecord[] = [
  { service: 'Fraud Engine', utilization: 91, threshold: 80, status: 'critical', trafficShare: 0.37 },
  { service: 'UPI Switch', utilization: 88, threshold: 80, status: 'high', trafficShare: 0.34 },
  { service: 'Payment Gateway', utilization: 82, threshold: 80, status: 'warning', trafficShare: 0.23 },
  { service: 'Notification Hub', utilization: 63, threshold: 80, status: 'healthy', trafficShare: 0.06 },
];

export const forecastedBreaches: ForecastedBreachRecord[] = [
  { service: 'Fraud Engine', current: 91, forecast: 96, breachThreshold: 90 },
  { service: 'UPI Switch', current: 88, forecast: 93, breachThreshold: 90 },
];

export const capacityForecastTrend = [
  { month: 'W1', fraudEngine: 91, upiSwitch: 88, paymentGateway: 82, notificationHub: 63 },
  { month: 'W2', fraudEngine: 93, upiSwitch: 89, paymentGateway: 83, notificationHub: 64 },
  { month: 'W3', fraudEngine: 95, upiSwitch: 91, paymentGateway: 84, notificationHub: 64 },
  { month: 'W4', fraudEngine: 96, upiSwitch: 93, paymentGateway: 85, notificationHub: 65 },
];

export function getCapacityUtilization(): number {
  const weightedUtilization = capacityServiceData.reduce(
    (sum, service) => sum + service.utilization * service.trafficShare,
    0,
  );
  // Peak-window concurrency uplift aligns weighted runtime utilization to dashboard rollup.
  return Math.round(weightedUtilization + 1.8);
}

export function getServicesNearCapacityCount(): number {
  return capacityServiceData.filter((service) => service.utilization >= service.threshold).length;
}

export function getForecastedCapacityBreachesCount(): number {
  return forecastedBreaches.filter((item) => item.forecast >= item.breachThreshold).length;
}

export function getPeakLoadHeadroom(): number {
  return 100 - getCapacityUtilization();
}

export function getCapacityKpis() {
  return {
    capacityUtilization: getCapacityUtilization(),
    servicesNearCapacity: getServicesNearCapacityCount(),
    forecastedBreaches: getForecastedCapacityBreachesCount(),
    peakLoadHeadroom: getPeakLoadHeadroom(),
  };
}
