import {
  Box,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { KpiCard } from '../components/common/KpiCard';
import { DrilldownTableRow } from '../components/common/DrilldownTableRow';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { MultiLineChart } from '../components/charts/MultiLineChart';
import { colors } from '../theme/colors';
import {
  aiInitiatives,
  aiProgramTrend,
  getAiProgramStatusBreakdown,
} from '../data/aiInitiativePortfolioData';

const statusBreakdown = getAiProgramStatusBreakdown();
const statusCountByName = statusBreakdown.reduce<Record<string, number>>((acc, item) => {
  acc[item.status] = item.count;
  return acc;
}, {});

const activePrograms = aiInitiatives.length;
const onTrackPrograms = statusCountByName['On Track'] ?? 0;
const delayedPrograms = statusCountByName.Delayed ?? 0;
const watchlistPrograms = statusCountByName.Watchlist ?? 0;

const kpis = [
  { label: 'Active AI Programs', value: activePrograms, suffix: '', trend: 9.1 },
  { label: 'Programs On Track', value: onTrackPrograms, suffix: '', trend: 14.3 },
  { label: 'Programs Delayed', value: delayedPrograms, suffix: '', trend: -25.0 },
  { label: 'Programs Watchlist', value: watchlistPrograms, suffix: '', trend: -12.5 },
];

function statusStyle(status: string) {
  if (status === 'On Track') return { c: colors.success, b: `${colors.success}22` };
  if (status === 'Watchlist') return { c: colors.warning, b: `${colors.warning}22` };
  return { c: colors.critical, b: `${colors.critical}22` };
}

export function AIProgramStatusPage() {
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
        <ModuleHeader title="AI Program Progress" subtitle="Planned vs actual progress across active AI initiatives" />
        <MultiLineChart
          data={aiProgramTrend}
          series={[
            { key: 'planned', color: colors.primary, name: 'Planned Progress' },
            { key: 'actual', color: colors.success, name: 'Actual Progress' },
          ]}
          height={240}
        />
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="AI Initiative Portfolio" subtitle="Enterprise banking AI transformation programs" />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Program</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Business Unit</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Sponsor</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Progress</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aiInitiatives.map((row) => {
                const s = statusStyle(row.status);
                return (
                  <TableRow key={row.id} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                    <TableCell sx={{ borderColor: colors.border.subtle }}>
                      <DrilldownTableRow chartId="ai-program-status.portfolio" segment={row.id} label={row.name} value={row.progress} suffix="%">
                        <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 600 }}>{row.name}</Typography>
                      </DrilldownTableRow>
                    </TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.businessUnit}</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.owner}</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, minWidth: 160 }}>
                      <LinearProgress
                        variant="determinate"
                        value={row.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.08)',
                          '& .MuiLinearProgress-bar': { bgcolor: colors.primary },
                        }}
                      />
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>{row.progress}%</Typography>
                    </TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle }}>
                      <Typography variant="caption" sx={{ px: 1, py: 0.25, borderRadius: 1, color: s.c, bgcolor: s.b, fontWeight: 700 }}>{row.status}</Typography>
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
