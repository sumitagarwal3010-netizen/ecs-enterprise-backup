import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { KpiCard } from '../components/common/KpiCard';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { MultiLineChart } from '../components/charts/MultiLineChart';
import { colors } from '../theme/colors';
import { useFilteredSimulation } from '../hooks/useFilteredSimulation';
import {
  atRiskProjects,
  criticalEscalations,
  escalationTrend,
  getPortfolioHealthKpis,
  onTrackTrend,
  onTrackProjects,
  portfolioHealthTrend,
} from '../data/portfolioHealthDrilldownData';

const portfolioKpis = getPortfolioHealthKpis();
const kpis = [
  { label: 'Portfolio Health Score', value: portfolioKpis.portfolioHealthScore, trend: 2.3 },
  { label: 'Projects On Track', value: portfolioKpis.projectsOnTrack, suffix: '', trend: 12.5 },
  { label: 'Projects At Risk', value: portfolioKpis.projectsAtRisk, suffix: '', trend: -14.3 },
  { label: 'Critical Escalations', value: portfolioKpis.criticalEscalations, suffix: '', trend: -50.0 },
];

const compactTrendSummaries = [
  {
    label: 'Projects On Track',
    value: onTrackProjects.length,
    trend: onTrackTrend[onTrackTrend.length - 1].value - onTrackTrend[onTrackTrend.length - 2].value,
  },
  {
    label: 'Projects At Risk',
    value: atRiskProjects.length,
    trend: -1,
  },
  {
    label: 'Critical Escalations',
    value: criticalEscalations.length,
    trend: escalationTrend[escalationTrend.length - 1].value - escalationTrend[escalationTrend.length - 2].value,
  },
];

const portfolioPrograms = [
  { project: 'Core Banking Modernization', healthScore: 91, risk: 'Low', owner: 'Anurag Sharma', status: 'On Track' },
  { project: 'UPI 3.0 Scale Readiness', healthScore: 89, risk: 'Low', owner: 'Ritika Menon', status: 'On Track' },
  { project: 'Loan Origination Digitization', healthScore: 86, risk: 'Medium', owner: 'Siddharth Rao', status: 'On Track' },
  { project: 'Enterprise Fraud Detection Revamp', healthScore: 83, risk: 'Medium', owner: 'Neha Iyer', status: 'Watchlist' },
  { project: 'Trade Finance Workflow Automation', healthScore: 82, risk: 'Medium', owner: 'Karthik Nair', status: 'Watchlist' },
  { project: 'Card Switch Resilience Program', healthScore: 76, risk: 'High', owner: 'Mehul Desai', status: 'At Risk' },
  { project: 'Executive Escalations (Active)', healthScore: 74, risk: 'High', owner: 'Executive Steering Group', status: `${criticalEscalations.length} Open` },
];

function riskStyle(risk: string) {
  if (risk === 'High') return { c: colors.critical, b: `${colors.critical}22` };
  if (risk === 'Medium') return { c: colors.warning, b: `${colors.warning}22` };
  return { c: colors.success, b: `${colors.success}22` };
}

function statusStyle(status: string) {
  if (status === 'At Risk') return { c: colors.critical, b: `${colors.critical}22` };
  if (status === 'Watchlist') return { c: colors.warning, b: `${colors.warning}22` };
  return { c: colors.success, b: `${colors.success}22` };
}

export function PortfolioHealthPage() {
  const { release, governance, testing } = useFilteredSimulation();
  const portfolioTrend = portfolioHealthTrend.map((item, idx) => ({
    month: item.day,
    health: item.value,
    releaseReadiness: Math.max(82, Math.round(release.confidence - (5 - idx))),
    controlCoverage: Math.max(90, Math.round(governance.policyCompliance - (4 - idx))),
    testQuality: Math.max(88, Math.round(testing.effectiveness - (5 - idx))),
  }));

  return (
    <Box>
      <Grid container spacing={1.5}>
        {kpis.map((kpi, i) => (
          <Grid key={kpi.label} size={{ xs: 6, md: 3 }}>
            <KpiCard label={kpi.label} value={kpi.value} suffix={kpi.suffix} trend={kpi.trend} compact delay={i * 0.05} />
          </Grid>
        ))}
      </Grid>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="Portfolio Health Trend" subtitle="Health score with percentage-based contributing metrics" />
        <MultiLineChart
          data={portfolioTrend}
          series={[
            { key: 'health', color: colors.primary, name: 'Health Score' },
            { key: 'releaseReadiness', color: colors.info, name: 'Release Readiness %' },
            { key: 'controlCoverage', color: colors.success, name: 'Control Coverage %' },
            { key: 'testQuality', color: colors.warning, name: 'Test Quality %' },
          ]}
          height={240}
        />
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {compactTrendSummaries.map((item) => (
            <Grid key={item.label} size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 1, borderRadius: 1, border: `1px solid ${colors.border.subtle}`, bgcolor: colors.bg.glass }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                  {item.label}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.25 }}>
                  <Typography variant="subtitle1" sx={{ color: '#FFFFFF', fontWeight: 800 }}>{item.value}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 0.7,
                      py: 0.2,
                      borderRadius: 1,
                      fontWeight: 700,
                      color: item.trend > 0 ? colors.success : item.trend < 0 ? colors.critical : colors.info,
                      bgcolor: item.trend > 0 ? `${colors.success}22` : item.trend < 0 ? `${colors.critical}22` : `${colors.info}22`,
                    }}
                  >
                    {item.trend > 0 ? '↑' : item.trend < 0 ? '↓' : '→'} {Math.abs(item.trend)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="Transformation Program Register" subtitle="Retail, payments, lending and platform modernization" />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Project</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Health Score</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Risk</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Owner</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolioPrograms.map((row) => {
                const rs = riskStyle(row.risk);
                const ss = statusStyle(row.status);
                return (
                  <TableRow key={row.project} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                    <TableCell sx={{ borderColor: colors.border.subtle }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: colors.text.primary }}>{row.project}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.healthScore}%</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle }}>
                      <Typography variant="caption" sx={{ px: 1, py: 0.25, borderRadius: 1, color: rs.c, bgcolor: rs.b, fontWeight: 700 }}>{row.risk}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.owner}</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle }}>
                      <Typography variant="caption" sx={{ px: 1, py: 0.25, borderRadius: 1, color: ss.c, bgcolor: ss.b, fontWeight: 700 }}>{row.status}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>
    </Box>
  );
}
