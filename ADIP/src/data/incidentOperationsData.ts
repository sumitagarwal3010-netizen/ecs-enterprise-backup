export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'Investigating' | 'Mitigating' | 'Monitoring' | 'Resolved';
export type IncidentRootCause = 'Application' | 'Infrastructure' | 'Database' | 'Network' | 'External Dependency';

export interface IncidentTimelineEvent {
  label: string;
  time: string;
  note: string;
}

export interface IncidentRecord {
  id: string;
  service: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  owner: string;
  escalated: boolean;
  escalationStatus: string;
  mttrMinutes: number;
  impact: string;
  rootCause: IncidentRootCause;
  rca: string;
  mitigationProgress: number;
  timeline: IncidentTimelineEvent[];
}

export const incidentOperationsData: IncidentRecord[] = [
  {
    id: 'INC-240601',
    service: 'Fraud Engine',
    severity: 'critical',
    status: 'Mitigating',
    owner: 'Fraud Ops L2',
    escalated: true,
    escalationStatus: 'War-room active',
    mttrMinutes: 58,
    impact: 'Real-time fraud scoring latency increased, affecting payment authorization confidence.',
    rootCause: 'Application',
    rca: 'Thread pool starvation after model refresh increased queue wait time in scoring workers.',
    mitigationProgress: 72,
    timeline: [
      { label: 'Alert Triggered', time: '08:11', note: 'Spike in fraud scoring timeout threshold breach.' },
      { label: 'Incident Created', time: '08:13', note: 'P1 incident auto-created from monitoring policy.' },
      { label: 'Assigned', time: '08:15', note: 'Assigned to Fraud Ops bridge and Platform SRE.' },
      { label: 'Investigation Started', time: '08:19', note: 'Correlated release logs and JVM pressure.' },
      { label: 'Root Cause Identified', time: '08:31', note: 'Thread pool starvation after model refresh.' },
      { label: 'Mitigation Applied', time: '08:42', note: 'Rollback model artifact and scale worker pods.' },
      { label: 'Monitoring', time: '08:54', note: 'Latency stabilized below 180ms; watch for 60 minutes.' },
    ],
  },
  {
    id: 'INC-240602',
    service: 'UPI Switch',
    severity: 'high',
    status: 'Investigating',
    owner: 'Payments SRE',
    escalated: true,
    escalationStatus: 'L3 network review',
    mttrMinutes: 44,
    impact: 'UPI reversals increased during morning peak, with intermittent payment retries.',
    rootCause: 'Network',
    rca: 'Intermittent packet drops on core router pair caused switch path instability.',
    mitigationProgress: 51,
    timeline: [
      { label: 'Alert Triggered', time: '09:02', note: 'Increased UPI reversal ratio from NPCI rail.' },
      { label: 'Incident Created', time: '09:05', note: 'P2 incident raised for degraded transaction flow.' },
      { label: 'Assigned', time: '09:07', note: 'Assigned to switch operations and network team.' },
      { label: 'Investigation Started', time: '09:10', note: 'Tracing packet loss across primary link.' },
      { label: 'Root Cause Identified', time: '09:24', note: 'Intermittent packet drops on core router pair.' },
      { label: 'Mitigation Applied', time: '09:33', note: 'Traffic rerouted through secondary path.' },
      { label: 'Monitoring', time: '09:41', note: 'Reversal ratio normalized under threshold.' },
    ],
  },
  {
    id: 'INC-240603',
    service: 'Payment Gateway',
    severity: 'medium',
    status: 'Monitoring',
    owner: 'Card Platform Ops',
    escalated: false,
    escalationStatus: 'Under service watch',
    mttrMinutes: 31,
    impact: 'Card authorization timeout variance observed for one acquirer route.',
    rootCause: 'External Dependency',
    rca: 'Acquirer partner maintenance window overlapped with peak transaction slot.',
    mitigationProgress: 88,
    timeline: [
      { label: 'Alert Triggered', time: '10:18', note: 'Third-party acquirer response latency increase.' },
      { label: 'Incident Created', time: '10:21', note: 'P3 incident created for payment timeout variance.' },
      { label: 'Assigned', time: '10:23', note: 'Assigned to gateway support pod.' },
      { label: 'Investigation Started', time: '10:26', note: 'Dependency check on acquirer API.' },
      { label: 'Root Cause Identified', time: '10:37', note: 'Acquirer maintenance window overlap.' },
      { label: 'Mitigation Applied', time: '10:43', note: 'Enabled fallback route and retry policy.' },
      { label: 'Monitoring', time: '10:50', note: 'Success rate recovered to 99.2%.' },
    ],
  },
  {
    id: 'INC-240604',
    service: 'Notification Hub',
    severity: 'low',
    status: 'Resolved',
    owner: 'Digital Channels Ops',
    escalated: false,
    escalationStatus: 'Closed',
    mttrMinutes: 22,
    impact: 'Customer SMS and push notifications delayed for low-priority events.',
    rootCause: 'Infrastructure',
    rca: 'One messaging node turned unhealthy due to storage burst cap exhaustion.',
    mitigationProgress: 100,
    timeline: [
      { label: 'Alert Triggered', time: '07:42', note: 'Queue lag exceeded message SLA by 4 minutes.' },
      { label: 'Incident Created', time: '07:45', note: 'P4 incident opened by observer alarm.' },
      { label: 'Assigned', time: '07:47', note: 'Assigned to messaging infrastructure engineer.' },
      { label: 'Investigation Started', time: '07:49', note: 'Consumer lag and disk IO checked.' },
      { label: 'Root Cause Identified', time: '07:56', note: 'One node unhealthy due to storage burst cap.' },
      { label: 'Mitigation Applied', time: '08:01', note: 'Node drained and workload shifted.' },
      { label: 'Monitoring', time: '08:05', note: 'Queue depth normalized and incident closed.' },
    ],
  },
  {
    id: 'INC-240605',
    service: 'Net Banking Portal',
    severity: 'high',
    status: 'Investigating',
    owner: 'Channel Reliability Team',
    escalated: true,
    escalationStatus: 'DBA bridge active',
    mttrMinutes: 47,
    impact: 'Intermittent session failures impacted login and account summary retrieval.',
    rootCause: 'Database',
    rca: 'Read replica lag after failover caused connection pool saturation.',
    mitigationProgress: 61,
    timeline: [
      { label: 'Alert Triggered', time: '11:12', note: 'Login session error rate crossed 2.8%.' },
      { label: 'Incident Created', time: '11:15', note: 'P2 incident opened from APM breach.' },
      { label: 'Assigned', time: '11:17', note: 'Assigned to app support and DBA on-call.' },
      { label: 'Investigation Started', time: '11:21', note: 'Connection pool saturation observed.' },
      { label: 'Root Cause Identified', time: '11:33', note: 'Stale read replica lag after patch failover.' },
      { label: 'Mitigation Applied', time: '11:41', note: 'Replica resync and pool cap tuning applied.' },
      { label: 'Monitoring', time: '11:52', note: 'Session stability restored.' },
    ],
  },
];

export const incidentTrend7d = [
  { day: 'Mon', value: 6 },
  { day: 'Tue', value: 5 },
  { day: 'Wed', value: 5 },
  { day: 'Thu', value: 4 },
  { day: 'Fri', value: 4 },
  { day: 'Sat', value: 4 },
  { day: 'Sun', value: 4 },
];

export const mttrTrend7d = [
  { day: 'Mon', value: 54 },
  { day: 'Tue', value: 51 },
  { day: 'Wed', value: 48 },
  { day: 'Thu', value: 46 },
  { day: 'Fri', value: 45 },
  { day: 'Sat', value: 42 },
  { day: 'Sun', value: 40 },
];

export function getOpenIncidents() {
  return incidentOperationsData.filter((incident) => incident.status !== 'Resolved');
}

export function getIncidentOperationsKpis() {
  const openIncidents = getOpenIncidents();
  const criticalIncidents = openIncidents.filter((incident) => incident.severity === 'critical');
  const escalatedIncidents = openIncidents.filter((incident) => incident.escalated);
  const mttrMinutes = Math.round(
    incidentOperationsData.reduce((sum, incident) => sum + incident.mttrMinutes, 0) / incidentOperationsData.length,
  );

  return {
    openIncidents: openIncidents.length,
    criticalIncidents: criticalIncidents.length,
    escalatedIncidents: escalatedIncidents.length,
    mttrMinutes,
  };
}

export function getRootCauseDistribution() {
  const counts = incidentOperationsData.reduce<Record<IncidentRootCause, number>>(
    (acc, incident) => {
      acc[incident.rootCause] = (acc[incident.rootCause] ?? 0) + 1;
      return acc;
    },
    {
      Application: 0,
      Infrastructure: 0,
      Database: 0,
      Network: 0,
      'External Dependency': 0,
    },
  );

  return counts;
}
