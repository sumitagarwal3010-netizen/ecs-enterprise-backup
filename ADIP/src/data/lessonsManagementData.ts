export type LessonService =
  | 'Fraud Engine'
  | 'UPI Switch'
  | 'Payment Gateway'
  | 'Notification Hub'
  | 'Net Banking Portal';

export type LessonSource = 'Incidents' | 'Production' | 'Availability' | 'Capacity' | 'Governance';
export type LessonSeverity = 'critical' | 'high' | 'medium' | 'low';
export type LessonStatus = 'Implemented' | 'In Progress' | 'Open';

export interface LessonRepositoryRecord {
  id: string;
  lesson: string;
  source: LessonSource;
  severity: LessonSeverity;
  date: string;
  status: LessonStatus;
  owner: string;
  service: LessonService;
  reason: string;
}

export interface LessonImplementationRecord {
  lessonId: string;
  lesson: string;
  actionTaken: string;
  status: 'Implemented' | 'In Progress';
  completion: number;
}

const services: LessonService[] = ['Fraud Engine', 'UPI Switch', 'Payment Gateway', 'Notification Hub', 'Net Banking Portal'];
const sources: LessonSource[] = ['Incidents', 'Production', 'Availability', 'Capacity', 'Governance'];
const severities: LessonSeverity[] = ['critical', 'high', 'medium', 'low'];
const owners = ['Fraud Ops Lead', 'Payments SRE Lead', 'Card Platform Lead', 'Messaging Ops Lead', 'Channel Reliability Lead'];

export const lessonsRepository: LessonRepositoryRecord[] = Array.from({ length: 24 }, (_, i) => {
  const service = services[i % services.length];
  const source = sources[i % sources.length];
  const severity = severities[i % severities.length];
  return {
    id: `LSN-${String(i + 1).padStart(3, '0')}`,
    lesson: `${service} ${source} lesson ${i + 1}`,
    source,
    severity,
    date: `2026-06-${String((i % 28) + 1).padStart(2, '0')}`,
    status: i < 18 ? 'Implemented' : i < 21 ? 'In Progress' : 'Open',
    owner: owners[i % owners.length],
    service,
    reason: `${service} control refinement derived from ${source.toLowerCase()} learning cycle.`,
  };
});

export const implementationTracker: LessonImplementationRecord[] = lessonsRepository
  .filter((lesson) => lesson.status === 'Implemented')
  .map((lesson, idx) => ({
    lessonId: lesson.id,
    lesson: lesson.lesson,
    actionTaken: `Converted into ${idx % 2 === 0 ? 'runbook' : 'monitoring template'} and deployed to delivery teams`,
    status: 'Implemented',
    completion: 100,
  }));

export const recurrenceTrend = [
  { month: 'Jan', recurring: 20, prevented: 2 },
  { month: 'Feb', recurring: 19, prevented: 3 },
  { month: 'Mar', recurring: 18, prevented: 4 },
  { month: 'Apr', recurring: 18, prevented: 5 },
  { month: 'May', recurring: 17, prevented: 6 },
];

export const remainingProblemAreas = [
  'Fraud Engine peak-window thread saturation',
  'UPI Switch network-path jitter',
  'Payment Gateway partner-timeout variance',
];

export const learningAdoptionTeams = Array.from({ length: 25 }, (_, i) => ({
  team: `Team-${String(i + 1).padStart(2, '0')}`,
  adopted: i < 19,
}));

export const lessonsAiRecommendations = [
  'Promote high-severity Fraud Engine lessons into standardized incident runbooks.',
  'Convert UPI rollback learnings into reusable control templates for release checks.',
  'Expand Payment Gateway monitoring lessons into shared reliability assets.',
  'Operationalize capacity learnings for Net Banking and Notification Hub alerting.',
];

export function getLessonsManagementKpis() {
  const lessonsCaptured = lessonsRepository.length; // 24
  const lessonsImplemented = implementationTracker.length; // 18
  const recurrenceReduction = Math.round(((20 - 17) / 20) * 100); // 15%
  const adoptedTeams = learningAdoptionTeams.filter((team) => team.adopted).length; // 19
  const totalTeams = learningAdoptionTeams.length; // 25
  const learningAdoption = Math.round((adoptedTeams / totalTeams) * 100); // 76%

  return {
    lessonsCaptured,
    lessonsImplemented,
    recurrenceReduction,
    learningAdoption,
    adoptedTeams,
    totalTeams,
  };
}
