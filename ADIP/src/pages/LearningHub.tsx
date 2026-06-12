import { Box, Grid, Typography, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { KpiCard } from '../components/common/KpiCard';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { SeverityChip } from '../components/common/SeverityChip';
import { AIInsightBox } from '../components/common/AIInsightBox';
import { colors } from '../theme/colors';
import {
  getLearningKpis,
  lessonsCaptured,
  reusableAssetsCreated,
  similarChanges,
} from '../data/learningHubData';

export function LearningHub() {
  const [tab, setTab] = useState(0);
  const learningKpis = getLearningKpis();

  return (
    <Box>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Lessons Captured" value={learningKpis.lessonsCapturedCount} suffix="" trend={9} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Reusable Assets Created" value={learningKpis.reusableAssetsCount} suffix="" trend={6} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Knowledge Reuse Rate" value={learningKpis.knowledgeReuseRate} trend={4} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Tech Debt Logged" value={learningKpis.techDebtLogged} suffix="" trend={3} /></Grid>
      </Grid>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 32, mb: 2 }}>
          <Tab label="Lessons from Incidents" />
          <Tab label="Reusable Assets" />
          <Tab label="Similar Changes" />
        </Tabs>
        {tab === 0 && lessonsCaptured.slice(0, 12).map((lesson) => (
          <Box
            key={lesson.id}
            sx={{
              display: 'flex',
              gap: 2,
              py: 0.9,
              px: 1,
              borderRadius: 1,
              borderBottom: `1px solid ${colors.border.subtle}`,
              cursor: 'pointer',
              transition: 'background-color 120ms ease',
              '&:hover': { bgcolor: colors.bg.glass },
            }}
          >
            <Typography variant="caption" sx={{ flex: 1, color: colors.text.primary, fontWeight: 700 }}>
              {lesson.title}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
              {lesson.source} · {lesson.date}
            </Typography>
            <Box sx={{ '& .MuiChip-root': { fontWeight: 800, borderWidth: 1.25 } }}>
              <SeverityChip severity={lesson.severity} />
            </Box>
          </Box>
        ))}
        {tab === 1 && reusableAssetsCreated.map((asset) => (
          <Box
            key={asset.id}
            sx={{
              display: 'flex',
              gap: 2,
              py: 0.9,
              px: 1,
              borderRadius: 1,
              borderBottom: `1px solid ${colors.border.subtle}`,
              cursor: 'pointer',
              transition: 'background-color 120ms ease',
              '&:hover': { bgcolor: colors.bg.glass },
            }}
          >
            <Typography variant="caption" sx={{ flex: 1, fontWeight: 700, color: colors.text.primary }}>{asset.title}</Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>{asset.source}</Typography>
            <Typography variant="caption" sx={{ color: colors.primary, fontWeight: 700 }}>{asset.reuseCount} reuses</Typography>
          </Box>
        ))}
        {tab === 2 && similarChanges.map((item) => (
          <Box
            key={item.text}
            sx={{
              mb: 1,
              py: 0.8,
              px: 1,
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'background-color 120ms ease',
              '&:hover': { bgcolor: colors.bg.glass },
            }}
          >
            <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 650 }}>{item.text}</Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.65rem', display: 'block', mt: 0.35 }}>{item.time}</Typography>
          </Box>
        ))}
      </GlassCard>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Knowledge Base" />
            {reusableAssetsCreated.map((asset) => (
              <Box
                key={asset.id}
                sx={{
                  py: 1,
                  px: 1,
                  borderRadius: 1,
                  borderBottom: `1px solid ${colors.border.subtle}`,
                  cursor: 'pointer',
                  transition: 'background-color 120ms ease',
                  '&:hover': { bgcolor: colors.bg.glass },
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, color: colors.text.primary }}>{asset.title}</Typography>
                <Typography variant="caption" sx={{ ml: 1.2, color: colors.text.secondary, fontWeight: 500 }}>{asset.source}</Typography>
              </Box>
            ))}
          </GlassCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Learning Analytics" />
            {[
              { label: 'Lessons captured this cycle', value: String(learningKpis.lessonsCapturedCount) },
              { label: 'Assets created', value: String(learningKpis.reusableAssetsCount) },
              { label: 'Knowledge reuse', value: `${learningKpis.knowledgeReuseRate}%` },
              { label: 'Tech debt logged', value: String(learningKpis.techDebtLogged) },
            ].map((metric) => (
              <Box key={metric.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: `1px solid ${colors.border.subtle}` }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>{metric.label}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: colors.success }}>{metric.value}</Typography>
              </Box>
            ))}
            <AIInsightBox insight="Fraud Engine and UPI Switch learning assets drive the highest reuse, with incident and capacity playbooks accounting for most adoption." />
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
