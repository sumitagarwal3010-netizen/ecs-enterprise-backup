export interface LessonRecord {
  id: string;
  title: string;
  source: 'Incidents' | 'Production' | 'Availability' | 'Capacity' | 'Governance';
  service: 'Fraud Engine' | 'UPI Switch' | 'Payment Gateway' | 'Notification Hub';
  date: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface ReusableAssetRecord {
  id: string;
  title: string;
  service: 'Fraud Engine' | 'UPI Switch' | 'Payment Gateway' | 'Notification Hub';
  source: 'Incidents' | 'Production' | 'Availability' | 'Capacity' | 'Governance';
  createdOn: string;
  reuseCount: number;
}

export const lessonsCaptured: LessonRecord[] = [
  { id: 'L-001', title: 'Fraud scoring timeout guardrails', source: 'Incidents', service: 'Fraud Engine', date: '2026-05-06', severity: 'critical' },
  { id: 'L-002', title: 'UPI failover route validation cadence', source: 'Incidents', service: 'UPI Switch', date: '2026-05-07', severity: 'high' },
  { id: 'L-003', title: 'Gateway retry budget tuning after partner lag', source: 'Incidents', service: 'Payment Gateway', date: '2026-05-09', severity: 'medium' },
  { id: 'L-004', title: 'Notification queue node drain playbook', source: 'Incidents', service: 'Notification Hub', date: '2026-05-10', severity: 'low' },
  { id: 'L-005', title: 'Fraud Engine JVM thread pool baseline', source: 'Production', service: 'Fraud Engine', date: '2026-05-12', severity: 'high' },
  { id: 'L-006', title: 'UPI switch packet loss early detection', source: 'Production', service: 'UPI Switch', date: '2026-05-13', severity: 'high' },
  { id: 'L-007', title: 'Gateway acquirer timeout alert threshold', source: 'Production', service: 'Payment Gateway', date: '2026-05-14', severity: 'medium' },
  { id: 'L-008', title: 'Notification lag SLA observation window', source: 'Production', service: 'Notification Hub', date: '2026-05-15', severity: 'low' },
  { id: 'L-009', title: 'Fraud Engine below-SLA recovery checklist', source: 'Availability', service: 'Fraud Engine', date: '2026-05-17', severity: 'high' },
  { id: 'L-010', title: 'UPI Switch degradation communication template', source: 'Availability', service: 'UPI Switch', date: '2026-05-18', severity: 'medium' },
  { id: 'L-011', title: 'Gateway availability drift response matrix', source: 'Availability', service: 'Payment Gateway', date: '2026-05-19', severity: 'medium' },
  { id: 'L-012', title: 'Notification SLA exception closure process', source: 'Availability', service: 'Notification Hub', date: '2026-05-20', severity: 'low' },
  { id: 'L-013', title: 'Fraud capacity hotspot scale-up trigger', source: 'Capacity', service: 'Fraud Engine', date: '2026-05-22', severity: 'critical' },
  { id: 'L-014', title: 'UPI throughput allocation optimization', source: 'Capacity', service: 'UPI Switch', date: '2026-05-23', severity: 'high' },
  { id: 'L-015', title: 'Gateway near-capacity monitoring threshold', source: 'Capacity', service: 'Payment Gateway', date: '2026-05-24', severity: 'medium' },
  { id: 'L-016', title: 'Notification low-utilization rebalancing', source: 'Capacity', service: 'Notification Hub', date: '2026-05-25', severity: 'low' },
  { id: 'L-017', title: 'Fraud model governance signoff checkpoints', source: 'Governance', service: 'Fraud Engine', date: '2026-05-27', severity: 'high' },
  { id: 'L-018', title: 'UPI release control evidence packaging', source: 'Governance', service: 'UPI Switch', date: '2026-05-28', severity: 'medium' },
  { id: 'L-019', title: 'Gateway policy exception audit trail format', source: 'Governance', service: 'Payment Gateway', date: '2026-05-29', severity: 'medium' },
  { id: 'L-020', title: 'Notification control attestation reminders', source: 'Governance', service: 'Notification Hub', date: '2026-05-30', severity: 'low' },
  { id: 'L-021', title: 'Fraud incident commander handoff standard', source: 'Incidents', service: 'Fraud Engine', date: '2026-06-01', severity: 'critical' },
  { id: 'L-022', title: 'UPI rollback readiness validation', source: 'Production', service: 'UPI Switch', date: '2026-06-02', severity: 'high' },
  { id: 'L-023', title: 'Gateway SLA breach escalation protocol', source: 'Availability', service: 'Payment Gateway', date: '2026-06-03', severity: 'medium' },
  { id: 'L-024', title: 'Notification governance evidence indexing', source: 'Governance', service: 'Notification Hub', date: '2026-06-04', severity: 'low' },
];

export const reusableAssetsCreated: ReusableAssetRecord[] = [
  { id: 'A-001', title: 'Fraud Incident RCA Template', service: 'Fraud Engine', source: 'Incidents', createdOn: '2026-05-06', reuseCount: 13 },
  { id: 'A-002', title: 'UPI Degradation Triage Checklist', service: 'UPI Switch', source: 'Incidents', createdOn: '2026-05-07', reuseCount: 12 },
  { id: 'A-003', title: 'Gateway Timeout Recovery Runbook', service: 'Payment Gateway', source: 'Incidents', createdOn: '2026-05-09', reuseCount: 9 },
  { id: 'A-004', title: 'Notification Queue Recovery SOP', service: 'Notification Hub', source: 'Incidents', createdOn: '2026-05-10', reuseCount: 7 },
  { id: 'A-005', title: 'Fraud Service Health Review Template', service: 'Fraud Engine', source: 'Production', createdOn: '2026-05-12', reuseCount: 11 },
  { id: 'A-006', title: 'UPI Production Stability Checklist', service: 'UPI Switch', source: 'Production', createdOn: '2026-05-13', reuseCount: 10 },
  { id: 'A-007', title: 'Gateway Performance Baseline Sheet', service: 'Payment Gateway', source: 'Production', createdOn: '2026-05-14', reuseCount: 8 },
  { id: 'A-008', title: 'Notification Latency Baseline Pack', service: 'Notification Hub', source: 'Production', createdOn: '2026-05-15', reuseCount: 6 },
  { id: 'A-009', title: 'Fraud Availability Breach Playbook', service: 'Fraud Engine', source: 'Availability', createdOn: '2026-05-17', reuseCount: 9 },
  { id: 'A-010', title: 'UPI SLA Compliance Tracker', service: 'UPI Switch', source: 'Availability', createdOn: '2026-05-18', reuseCount: 8 },
  { id: 'A-011', title: 'Gateway Uptime Exception Register', service: 'Payment Gateway', source: 'Availability', createdOn: '2026-05-19', reuseCount: 7 },
  { id: 'A-012', title: 'Notification SLA Deviation Log', service: 'Notification Hub', source: 'Availability', createdOn: '2026-05-20', reuseCount: 5 },
  { id: 'A-013', title: 'Fraud Capacity Scale Plan', service: 'Fraud Engine', source: 'Capacity', createdOn: '2026-05-22', reuseCount: 8 },
  { id: 'A-014', title: 'UPI Throughput Allocation Matrix', service: 'UPI Switch', source: 'Capacity', createdOn: '2026-05-23', reuseCount: 7 },
  { id: 'A-015', title: 'Gateway Capacity Alert Guide', service: 'Payment Gateway', source: 'Capacity', createdOn: '2026-05-24', reuseCount: 6 },
  { id: 'A-016', title: 'Fraud Governance Evidence Pack', service: 'Fraud Engine', source: 'Governance', createdOn: '2026-05-27', reuseCount: 5 },
  { id: 'A-017', title: 'UPI Governance Control Checklist', service: 'UPI Switch', source: 'Governance', createdOn: '2026-05-28', reuseCount: 4 },
  { id: 'A-018', title: 'Gateway Policy Compliance Workbook', service: 'Payment Gateway', source: 'Governance', createdOn: '2026-05-29', reuseCount: 2 },
];

export const similarChanges = [
  { text: 'Fraud Engine rollback readiness checklist reused for UPI switch release gating.', time: '2h ago' },
  { text: 'Payment Gateway timeout mitigation pattern mirrored from Fraud Engine incident response.', time: '4h ago' },
  { text: 'Notification Hub SLA tracking adapted from gateway reliability dashboard controls.', time: 'Today' },
  { text: 'UPI switch escalation workflow reused in governance evidence closure process.', time: 'Yesterday' },
];

export const techDebtBreakdown = [
  { category: 'Reliability Hardening', count: 34 },
  { category: 'Observability Gaps', count: 22 },
  { category: 'Capacity Optimization', count: 18 },
  { category: 'Governance Automation', count: 14 },
  { category: 'Runbook Standardization', count: 10 },
];

export function getLearningKpis() {
  const lessonsCapturedCount = lessonsCaptured.length; // 24
  const reusableAssetsCount = reusableAssetsCreated.length; // 18
  const reusedAssets = 137;
  const totalAssetUsages = 180;
  const knowledgeReuseRate = Math.round((reusedAssets / totalAssetUsages) * 100); // 76%
  const techDebtLogged = techDebtBreakdown.reduce((sum, item) => sum + item.count, 0); // 98

  return {
    lessonsCapturedCount,
    reusableAssetsCount,
    knowledgeReuseRate,
    techDebtLogged,
    reusedAssets,
    totalAssetUsages,
  };
}
