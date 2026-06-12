import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { KpiCard } from '../components/common/KpiCard';
import { DrilldownTableRow } from '../components/common/DrilldownTableRow';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { BarChartPanel } from '../components/charts/BarChartPanel';
import { AIInsightBox } from '../components/common/AIInsightBox';
import { colors } from '../theme/colors';
import {
  adoptionByDomain,
  bestPracticeLibrary,
  getBestPracticesKpis,
  highRiskGaps,
  recommendedPractices,
} from '../data/bestPracticesData';

const kpis = getBestPracticesKpis();

function statusColor(status: 'Adopted' | 'Pending') {
  return status === 'Adopted' ? colors.success : colors.warning;
}

export function BestPracticesPage() {
  return (
    <Box>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Approved Best Practices" value={kpis.approvedBestPractices} suffix="" trend={6.4} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Adoption Rate" value={kpis.adoptionRate} trend={4.1} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="High-Risk Gaps" value={kpis.highRiskGapsCount} suffix="" trend={-9.8} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Compliance Coverage" value={kpis.complianceCoverage} trend={2.2} /></Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Best Practice Library" subtitle="Approved operations and governance practices with adoption posture" />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Practice</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Domain</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Owner</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bestPracticeLibrary.map((practice) => (
                    <TableRow key={practice.id} hover sx={{ '& td': { borderColor: colors.border.subtle } }}>
                      <TableCell>
                        <DrilldownTableRow
                          chartId="best-practices.library"
                          segment={practice.id}
                          label={practice.practice}
                          value={practice.status}
                          suffix=""
                        >
                          <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>
                            {practice.practice}
                          </Typography>
                        </DrilldownTableRow>
                      </TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.secondary }}>{practice.domain}</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: statusColor(practice.status), fontWeight: 700 }}>{practice.status}</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.secondary }}>{practice.owner}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="High-Risk Gap Watchlist" subtitle="Outstanding control gaps requiring immediate closure" />
            {highRiskGaps.map((gap) => (
              <Box key={gap.id} sx={{ py: 0.9, borderBottom: `1px solid ${colors.border.subtle}` }}>
                <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>{gap.service}</Typography>
                <Typography variant="caption" sx={{ color: colors.warning, display: 'block', mt: 0.3 }}>{gap.missingPractice}</Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.72rem', lineHeight: 1.4 }}>{gap.riskReason}</Typography>
              </Box>
            ))}
          </GlassCard>
        </Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Recommended Practices" subtitle="AI-prioritized actions based on current operational and governance posture" />
            {recommendedPractices.map((item) => (
              <Box key={item.recommendation} sx={{ mb: 1.2, pb: 1, borderBottom: `1px solid ${colors.border.subtle}` }}>
                <AIInsightBox insight={item.recommendation} />
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.72rem', lineHeight: 1.4, display: 'block', mt: 0.4 }}>
                  Reason: {item.reason}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.info, fontSize: '0.72rem', display: 'block', mt: 0.25 }}>
                  Impacted Service: {item.impactedService}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.success, fontSize: '0.72rem', display: 'block', mt: 0.2 }}>
                  Expected Benefit: {item.expectedBenefit}
                </Typography>
              </Box>
            ))}
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Adoption By Domain" subtitle="Practice adoption levels across critical operating domains" />
            <BarChartPanel
              chartId="best-practices.adoption-domain"
              data={adoptionByDomain}
              categoryKey="domain"
              series={[{ dataKey: 'adoptedRate', name: 'Adoption %', fill: colors.primary, barSize: 26, radius: [4, 4, 0, 0] }]}
              height={230}
            />
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
