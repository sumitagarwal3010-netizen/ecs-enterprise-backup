import { useState } from 'react';
import { Box, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { KpiCard } from '../components/common/KpiCard';
import { DrilldownTableRow } from '../components/common/DrilldownTableRow';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { BarChartPanel } from '../components/charts/BarChartPanel';
import { AIInsightBox } from '../components/common/AIInsightBox';
import { colors } from '../theme/colors';
import {
  getReusableAssetsKpis,
  reusableDeliveryAssets,
  topReusedAssets,
} from '../data/reusableDeliveryAssetsData';

const kpis = getReusableAssetsKpis();
const COLLAPSED_ASSET_COUNT = 10;

export function ReusableAssetsPage() {
  const [catalogExpanded, setCatalogExpanded] = useState(false);
  const visibleAssets = catalogExpanded
    ? reusableDeliveryAssets
    : reusableDeliveryAssets.slice(0, COLLAPSED_ASSET_COUNT);

  return (
    <Box>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Reusable Assets Available" value={kpis.reusableAssetsAvailable} suffix="" trend={5.6} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Asset Reuse Rate" value={kpis.assetReuseRate} trend={4.2} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Delivery Hours Saved" value={kpis.deliveryHoursSaved.toLocaleString()} suffix="" trend={8.1} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Active Asset Consumers" value={kpis.activeAssetConsumers} suffix="" trend={3.8} /></Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Asset Catalog" subtitle="Reusable delivery assets for operations, reliability, and governance execution" />
            <TableContainer
              sx={{
                maxHeight: catalogExpanded ? 680 : 340,
                overflowY: 'auto',
                transition: 'max-height 260ms ease',
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Asset Name</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Owner</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Reuse Count</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleAssets.map((asset) => (
                    <TableRow key={asset.id} hover sx={{ '& td': { borderColor: colors.border.subtle } }}>
                      <TableCell>
                        <DrilldownTableRow chartId="reusable-assets.catalog" segment={asset.id} label={asset.name} value={asset.reuseCount} suffix="">
                          <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>
                            {asset.name}
                          </Typography>
                        </DrilldownTableRow>
                      </TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.secondary }}>{asset.category}</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.secondary }}>{asset.owner}</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: colors.primary, fontWeight: 700 }}>{asset.reuseCount}</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.secondary }}>{asset.lastUpdated}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.25 }}>
              <Button
                size="small"
                variant="text"
                onClick={() => setCatalogExpanded((prev) => !prev)}
                sx={{
                  color: colors.primary,
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': { bgcolor: `${colors.primary}1A` },
                }}
              >
                {catalogExpanded ? 'Show Less' : 'Show More'}
              </Button>
            </Box>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Top Reused Assets" subtitle="Ranked by reuse count across consuming teams" />
            {topReusedAssets.map((asset, idx) => (
              <Box key={asset.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: `1px solid ${colors.border.subtle}` }}>
                <Box sx={{ pr: 1 }}>
                  <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>
                    #{idx + 1} {asset.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.72rem' }}>
                    {asset.service} · {asset.category}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: colors.info, fontWeight: 700 }}>
                  {asset.reuseCount}
                </Typography>
              </Box>
            ))}
          </GlassCard>
        </Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Reuse Impact" subtitle="Quantified delivery and governance impact from reusable assets" />
            <BarChartPanel
              chartId="reusable-assets.impact"
              data={[
                { metric: 'Hours Saved', value: 1240 },
                { metric: 'Faster Delivery', value: 28 },
                { metric: 'Reduced Incidents', value: 17 },
                { metric: 'Reduced Audit Effort', value: 22 },
              ]}
              categoryKey="metric"
              series={[{ dataKey: 'value', name: 'Impact', fill: colors.success, barSize: 28, radius: [4, 4, 0, 0] }]}
              height={240}
            />
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="AI Recommendations" subtitle="Suggested actions to increase reusable delivery asset value" />
            <AIInsightBox insight="Promote Fraud RCA template to enterprise standard to improve consistency of high-severity post-incident reviews." />
            <AIInsightBox insight="Convert UPI rollback checklist into reusable asset with versioned governance signoff and mandatory release gates." />
            <AIInsightBox insight="Expand capacity forecasting model adoption to Net Banking and Notification Hub teams for proactive load planning." />
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
