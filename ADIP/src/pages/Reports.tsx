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
import { calculatePortfolioHealthScore, portfolioHealthTrend } from '../data/portfolioHealthDrilldownData';
import { operationalRiskRegister } from '../data/operationalRiskHeatRegisterData';

const portfolioTrendData = [
  { month: 'Jan', retail: 84, cards: 81, lending: 79 },
  { month: 'Feb', retail: 85, cards: 82, lending: 80 },
  { month: 'Mar', retail: 86, cards: 83, lending: 81 },
  { month: 'Apr', retail: 88, cards: 84, lending: 83 },
  { month: 'May', retail: 89, cards: 86, lending: 85 },
  { month: 'Jun', retail: 91, cards: 88, lending: 86 },
];

const domainHealthTrendData = [
  { month: 'Jan', healthy: 78, watchlist: 16, critical: 6 },
  { month: 'Feb', healthy: 80, watchlist: 15, critical: 5 },
  { month: 'Mar', healthy: 82, watchlist: 13, critical: 5 },
  { month: 'Apr', healthy: 84, watchlist: 12, critical: 4 },
  { month: 'May', healthy: 86, watchlist: 11, critical: 3 },
  { month: 'Jun', healthy: 88, watchlist: 10, critical: 2 },
];

const domainHealthTableRows = [
  { domain: 'Retail Banking', healthScore: 92, riskRating: 'Low', owner: 'Anita Rao' },
  { domain: 'Digital Payments', healthScore: 89, riskRating: 'Low', owner: 'Karan Mehta' },
  { domain: 'Corporate Lending', healthScore: 84, riskRating: 'Medium', owner: 'Naveen Iyer' },
  { domain: 'Trade Finance', healthScore: 81, riskRating: 'Medium', owner: 'Priya Sharma' },
  { domain: 'Fraud & AML', healthScore: 76, riskRating: 'High', owner: 'Ritika Nair' },
];

export function Reports() {
  const { release, requirements, architecture, development, testing, operations, governance } = useFilteredSimulation();
  const portfolioHealth = calculatePortfolioHealthScore();
  const maturityBase = (
    requirements.qualityScore * 0.17 +
    architecture.readiness * 0.16 +
    development.health * 0.17 +
    testing.effectiveness * 0.2 +
    release.confidence * 0.16 +
    operations.operationalHealth * 0.14
  );
  const maturityPenalty = (testing.manualTests / testing.totalTests) * 8 + (governance.findingSeverity.find((f) => f.name === 'Critical')?.value ?? 0) * 0.8;
  const aiSdlcMaturity = Math.round(maturityBase - maturityPenalty);
  const releaseWindowTotal = 42;
  const highRiskReleases = release.releases.filter((r) => r.risk === 'high').length;
  const failedReleases = Math.max(1, Math.round((100 - release.confidence) / 12 + highRiskReleases * 0.2));
  const successfulReleases = releaseWindowTotal - failedReleases;
  const releaseSuccessRate = Number(((successfulReleases / releaseWindowTotal) * 100).toFixed(1));
  const criticalRisks = operationalRiskRegister
    .filter((risk) => risk.severity === 'Critical' || risk.severity === 'High')
    .sort((a, b) => b.residualRiskScore - a.residualRiskScore)
    .slice(0, 7);

  const executiveKpis = [
    {
      label: 'Portfolio Health',
      value: portfolioHealth,
      trend: 2.1,
      data: portfolioHealthTrend,
    },
    {
      label: 'AI SDLC Maturity',
      value: aiSdlcMaturity,
      trend: 1.4,
      data: [
        { day: 'Jan', value: Math.max(78, aiSdlcMaturity - 4) },
        { day: 'Feb', value: Math.max(79, aiSdlcMaturity - 3) },
        { day: 'Mar', value: Math.max(80, aiSdlcMaturity - 2) },
        { day: 'Apr', value: Math.max(81, aiSdlcMaturity - 1) },
        { day: 'May', value: Math.max(82, aiSdlcMaturity) },
        { day: 'Jun', value: aiSdlcMaturity },
      ],
    },
    {
      label: 'Release Success Rate',
      value: releaseSuccessRate,
      trend: 0.8,
      data: [
        { day: 'Jan', value: Math.max(95, releaseSuccessRate - 1.8) },
        { day: 'Feb', value: Math.max(95.4, releaseSuccessRate - 1.4) },
        { day: 'Mar', value: Math.max(95.8, releaseSuccessRate - 1.1) },
        { day: 'Apr', value: Math.max(96.3, releaseSuccessRate - 0.7) },
        { day: 'May', value: Math.max(96.8, releaseSuccessRate - 0.4) },
        { day: 'Jun', value: releaseSuccessRate },
      ],
    },
    {
      label: 'Critical Risks',
      value: criticalRisks.length,
      suffix: '',
      trend: -12.5,
      data: [
        { day: 'Jan', value: 10 },
        { day: 'Feb', value: 9 },
        { day: 'Mar', value: 9 },
        { day: 'Apr', value: 8 },
        { day: 'May', value: 8 },
        { day: 'Jun', value: criticalRisks.length },
      ],
    },
  ];

  return (
    <Box>
      <Grid container spacing={1.5}>
        {executiveKpis.map((kpi, index) => (
          <Grid key={kpi.label} size={{ xs: 6, md: 3 }}>
            <KpiCard
              label={kpi.label}
              value={kpi.value}
              suffix={kpi.suffix}
              trend={kpi.trend}
              data={kpi.data}
              delay={index * 0.05}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Portfolio Trend" subtitle="Retail Banking · Cards · Lending" />
            <MultiLineChart
              data={portfolioTrendData}
              series={[
                { key: 'retail', color: colors.primary, name: 'Retail Banking' },
                { key: 'cards', color: colors.info, name: 'Cards' },
                { key: 'lending', color: colors.warning, name: 'Lending' },
              ]}
              height={240}
            />
          </GlassCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Domain Health Trend" subtitle="Healthy · Watchlist · Critical distribution" />
            <MultiLineChart
              data={domainHealthTrendData}
              series={[
                { key: 'healthy', color: colors.success, name: 'Healthy' },
                { key: 'watchlist', color: colors.warning, name: 'Watchlist' },
                { key: 'critical', color: colors.critical, name: 'Critical' },
              ]}
              height={240}
            />
          </GlassCard>
        </Grid>
      </Grid>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="Domain Health Register" subtitle="Executive ownership and risk posture" />
        <TableContainer>
          <Table size="small" aria-label="domain health table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Domain</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Health Score</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Risk Rating</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Owner</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {domainHealthTableRows.map((row) => (
                <TableRow key={row.domain} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                  <TableCell sx={{ borderColor: colors.border.subtle }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: colors.text.primary }}>{row.domain}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.healthScore}%</TableCell>
                  <TableCell sx={{ borderColor: colors.border.subtle }}>
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: row.riskRating === 'High' ? `${colors.critical}22` : row.riskRating === 'Medium' ? `${colors.warning}22` : `${colors.success}22`,
                        color: row.riskRating === 'High' ? colors.critical : row.riskRating === 'Medium' ? colors.warning : colors.success,
                        fontWeight: 700,
                      }}
                    >
                      {row.riskRating}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.owner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>
    </Box>
  );
}
