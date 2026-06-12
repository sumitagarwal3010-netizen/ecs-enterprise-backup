export type AssetService =
  | 'Fraud Engine'
  | 'UPI Switch'
  | 'Payment Gateway'
  | 'Notification Hub'
  | 'Net Banking Portal';

export interface ReusableDeliveryAsset {
  id: string;
  name: string;
  category: 'Runbook' | 'Template' | 'Checklist' | 'Model' | 'Control Pack' | 'Test Pack';
  owner: string;
  reuseCount: number;
  lastUpdated: string;
  service: AssetService;
  description: string;
  reuseHistory: string[];
  consumers: string[];
  businessImpact: string;
  impactHoursSaved: number;
  reuseSuccessful: number;
  reuseOpportunities: number;
}

export const activeConsumerTeams = [
  'Fraud Ops L2',
  'Payments SRE',
  'Card Platform Ops',
  'Digital Messaging Ops',
  'Channel Reliability Team',
  'Production Command Center',
  'Availability Engineering',
  'Capacity Engineering',
  'Governance Compliance Office',
  'Release Management Office',
  'QE Platform Team',
  'Architecture Review Board',
];

const services: AssetService[] = ['Fraud Engine', 'UPI Switch', 'Payment Gateway', 'Notification Hub', 'Net Banking Portal'];
const categories: ReusableDeliveryAsset['category'][] = ['Template', 'Runbook', 'Checklist', 'Model', 'Control Pack', 'Test Pack'];
const owners = [
  'Fraud Platform Lead',
  'Payments Reliability Lead',
  'Cards Delivery Lead',
  'Messaging Operations Lead',
  'Digital Channels Lead',
  'Governance Controls Lead',
];

function assetName(index: number, service: AssetService) {
  const prefixes = [
    'RCA Template',
    'Rollback Checklist',
    'Capacity Forecast Model',
    'Incident Triage Pack',
    'SLA Compliance Workbook',
    'Control Evidence Bundle',
    'Release Readiness Checklist',
    'Service Recovery Playbook',
  ];
  return `${service} ${prefixes[index % prefixes.length]} ${Math.floor(index / prefixes.length) + 1}`;
}

function buildAssets(): ReusableDeliveryAsset[] {
  const assets: ReusableDeliveryAsset[] = Array.from({ length: 48 }, (_, index) => {
    const service = services[index % services.length];
    const category = categories[index % categories.length];
    const owner = owners[index % owners.length];
    const teamA = activeConsumerTeams[index % activeConsumerTeams.length];
    const teamB = activeConsumerTeams[(index + 4) % activeConsumerTeams.length];
    const isTopTier = index < 8;
    return {
      id: `ASSET-${String(index + 1).padStart(3, '0')}`,
      name: assetName(index, service),
      category,
      owner,
      reuseCount: isTopTier ? 14 - (index % 4) : 5 + (index % 5),
      lastUpdated: `2026-06-${String((index % 27) + 1).padStart(2, '0')}`,
      service,
      description: `${service} ${category.toLowerCase()} standardizes repeatable delivery controls and reduces execution variance across teams.`,
      reuseHistory: [
        `Applied in ${service} release gate rehearsal`,
        `Referenced during ${service} incident simulation`,
        `Used in monthly governance evidence cycle`,
      ],
      consumers: [teamA, teamB],
      businessImpact: `Improved ${service} delivery consistency and reduced manual handoff overhead.`,
      impactHoursSaved: index < 40 ? 25 : 30,
      reuseSuccessful: isTopTier ? 4 : 3,
      reuseOpportunities: isTopTier ? 5 : 4,
    };
  });

  return assets;
}

export const reusableDeliveryAssets = buildAssets();

export function getReusableAssetsKpis() {
  const reusableAssetsAvailable = reusableDeliveryAssets.length; // 48
  const totalReuseSuccessful = reusableDeliveryAssets.reduce((sum, asset) => sum + asset.reuseSuccessful, 0); // 152
  const totalReuseOpportunities = reusableDeliveryAssets.reduce((sum, asset) => sum + asset.reuseOpportunities, 0); // 200
  const assetReuseRate = Math.round((totalReuseSuccessful / totalReuseOpportunities) * 100); // 76
  const deliveryHoursSaved = reusableDeliveryAssets.reduce((sum, asset) => sum + asset.impactHoursSaved, 0); // 1240
  const activeAssetConsumers = activeConsumerTeams.length; // 12

  return {
    reusableAssetsAvailable,
    totalReuseSuccessful,
    totalReuseOpportunities,
    assetReuseRate,
    deliveryHoursSaved,
    activeAssetConsumers,
  };
}

export const topReusedAssets = [...reusableDeliveryAssets]
  .sort((a, b) => b.reuseCount - a.reuseCount)
  .slice(0, 10);
