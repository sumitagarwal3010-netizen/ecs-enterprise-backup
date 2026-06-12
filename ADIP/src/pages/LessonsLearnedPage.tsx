import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { KpiCard } from '../components/common/KpiCard';
import { DrilldownTableRow } from '../components/common/DrilldownTableRow';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { BarChartPanel } from '../components/charts/BarChartPanel';
import { SeverityChip } from '../components/common/SeverityChip';
import { AIInsightBox } from '../components/common/AIInsightBox';
import { colors } from '../theme/colors';
import {
  getLessonsManagementKpis,
  implementationTracker,
  lessonsAiRecommendations,
  lessonsRepository,
  recurrenceTrend,
  remainingProblemAreas,
} from '../data/lessonsManagementData';

const kpis = getLessonsManagementKpis();

function statusColor(status: string) {
  if (status === 'Implemented') return colors.success;
  if (status === 'In Progress') return colors.warning;
  return colors.text.secondary;
}

export function LessonsLearnedPage() {
  return (
    <Box>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Lessons Captured" value={kpis.lessonsCaptured} suffix="" trend={8.3} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Lessons Implemented" value={kpis.lessonsImplemented} suffix="" trend={7.1} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Recurrence Reduction" value={kpis.recurrenceReduction} trend={5.5} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Learning Adoption" value={kpis.learningAdoption} trend={4.8} /></Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Lessons Repository" subtitle="Captured learning records across operations and governance domains" />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Lesson</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Source</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Severity</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Owner</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lessonsRepository.map((lesson) => (
                    <TableRow key={lesson.id} hover sx={{ '& td': { borderColor: colors.border.subtle } }}>
                      <TableCell>
                        <DrilldownTableRow chartId="lessons.repository" segment={lesson.id} label={lesson.lesson} value={lesson.status} suffix="">
                          <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>{lesson.lesson}</Typography>
                        </DrilldownTableRow>
                      </TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.secondary }}>{lesson.source}</Typography></TableCell>
                      <TableCell><SeverityChip severity={lesson.severity} /></TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.secondary }}>{lesson.date}</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: statusColor(lesson.status), fontWeight: 700 }}>{lesson.status}</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.secondary }}>{lesson.owner}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Implementation Tracker" subtitle="Implemented lesson actions with completion status" />
            {implementationTracker.map((item) => (
              <Box key={item.lessonId} sx={{ py: 0.8, borderBottom: `1px solid ${colors.border.subtle}` }}>
                <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>{item.lesson}</Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', fontSize: '0.72rem' }}>{item.actionTaken}</Typography>
                <Typography variant="caption" sx={{ color: colors.success, fontWeight: 700 }}>{item.status} · {item.completion}%</Typography>
              </Box>
            ))}
          </GlassCard>
        </Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Repeat Incident Analysis" subtitle="Prevented incidents, recurrence trend, and unresolved risk areas" />
            <BarChartPanel
              chartId="lessons.recurrence-trend"
              data={recurrenceTrend}
              categoryKey="month"
              series={[
                { dataKey: 'recurring', name: 'Recurring Incidents', fill: colors.critical, barSize: 22, radius: [4, 4, 0, 0] },
                { dataKey: 'prevented', name: 'Prevented Incidents', fill: colors.success, barSize: 22, radius: [4, 4, 0, 0] },
              ]}
              height={220}
              showLegend
            />
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ color: colors.warning, fontWeight: 700, display: 'block', mb: 0.5 }}>Remaining problem areas</Typography>
              {remainingProblemAreas.map((area) => (
                <Typography key={area} variant="caption" sx={{ color: colors.text.secondary, display: 'block' }}>- {area}</Typography>
              ))}
            </Box>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="AI Recommendations" subtitle="Promote lessons into reusable operational assets" />
            {lessonsAiRecommendations.map((recommendation) => (
              <AIInsightBox key={recommendation} insight={recommendation} />
            ))}
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
