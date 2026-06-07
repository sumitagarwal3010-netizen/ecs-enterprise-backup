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
import { DonutChart } from '../components/charts/DonutChart';
import { MultiLineChart } from '../components/charts/MultiLineChart';
import { HorizontalBarChart } from '../components/charts/HorizontalBarChart';
import { RequirementIntakeWorkflow } from '../components/requirements/RequirementIntakeWorkflow';
import { AnalyzeWithAIPanel } from '../components/workflow/AnalyzeWithAIPanel';
import { colors } from '../theme/colors';

export function RequirementsHub() {
  return (
    <Box>
      <AnalyzeWithAIPanel
        phase="requirements"
        number={2}
        title="Requirement Analysis"
        subtitle="Banking requirements queue"
        placeholder="e.g. UPI Limit Enhancement, Merchant Auto Settlement..."
        glow="purple"
      />
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
        18 items in requirements analysis queue
      </Typography>

      <GlassCard sx={{ p: 2, mb: 1.5 }}>
        <ModuleHeader title="1. Business Requirements" subtitle="Core requirement health and prioritization" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Total Requirements" value={148} suffix="" trend={5.0} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Approved Requirements" value={112} suffix="" trend={7.2} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Pending Review" value={24} suffix="" trend={-8.1} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Business Priority Distribution" value={76} trend={2.4} compact /></Grid>
        </Grid>
      </GlassCard>

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 5 }}>
          <GlassCard sx={{ p: 2, height: '100%' }}>
            <ModuleHeader title="Business Priority Distribution" />
            <DonutChart
              data={[
                { name: 'High', value: 58, color: colors.critical },
                { name: 'Medium', value: 61, color: colors.warning },
                { name: 'Low', value: 29, color: colors.success },
              ]}
              centerLabel="Total"
              centerValue={148}
              height={220}
            />
          </GlassCard>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <GlassCard sx={{ p: 2, height: '100%' }}>
            <ModuleHeader title="Requirement Intake Snapshot" />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Domain</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Requirements</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Approved</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Pending</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { domain: 'Retail Banking', total: 41, approved: 33, pending: 6 },
                    { domain: 'Mobile Banking', total: 36, approved: 28, pending: 5 },
                    { domain: 'Payments', total: 44, approved: 31, pending: 9 },
                    { domain: 'Fraud Monitoring', total: 27, approved: 20, pending: 4 },
                  ].map((row) => (
                    <TableRow key={row.domain} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.domain}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.total}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.approved}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.pending}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>
        </Grid>
      </Grid>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="2. AI Use Cases" subtitle="AI governance posture within requirement planning" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Registered AI Use Cases" value={34} suffix="" trend={9.7} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="High Risk Use Cases" value={6} suffix="" trend={-14.3} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="AI Models Used" value={18} suffix="" trend={5.9} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Approval Status" value={82} trend={3.5} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <HorizontalBarChart
              data={[
                { name: 'Approved', value: 82 },
                { name: 'In Review', value: 14 },
                { name: 'Rejected', value: 4 },
              ]}
              height={180}
              barColor={colors.primary}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Use Case</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Domain</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Risk</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { useCase: 'UPI Fraud Alert Prioritization', domain: 'Payments', risk: 'Medium', status: 'Approved' },
                    { useCase: 'Loan Eligibility Copilot', domain: 'Retail Banking', risk: 'High', status: 'In Review' },
                    { useCase: 'Smart Dispute Classification', domain: 'Cards', risk: 'Low', status: 'Approved' },
                  ].map((row) => (
                    <TableRow key={row.useCase} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.useCase}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.domain}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.risk}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="3. User Stories" subtitle="Sprint-level execution health for approved requirements" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Stories Created" value={216} suffix="" trend={11.3} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Stories Completed" value={168} suffix="" trend={8.5} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Stories In Progress" value={34} suffix="" trend={-2.9} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Sprint Alignment" value={87} trend={1.9} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MultiLineChart
              data={[
                { month: 'Jan', created: 24, completed: 18, inProgress: 9 },
                { month: 'Feb', created: 29, completed: 22, inProgress: 10 },
                { month: 'Mar', created: 31, completed: 24, inProgress: 11 },
                { month: 'Apr', created: 34, completed: 28, inProgress: 10 },
                { month: 'May', created: 37, completed: 34, inProgress: 8 },
                { month: 'Jun', created: 41, completed: 42, inProgress: 7 },
              ]}
              series={[
                { key: 'created', color: colors.info, name: 'Created' },
                { key: 'completed', color: colors.success, name: 'Completed' },
                { key: 'inProgress', color: colors.warning, name: 'In Progress' },
              ]}
              height={200}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Sprint</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Committed</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Completed</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Alignment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { sprint: 'Sprint 42', committed: 32, completed: 29, alignment: '91%' },
                    { sprint: 'Sprint 43', committed: 34, completed: 30, alignment: '88%' },
                    { sprint: 'Sprint 44', committed: 36, completed: 31, alignment: '86%' },
                  ].map((row) => (
                    <TableRow key={row.sprint} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.sprint}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.committed}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.completed}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.alignment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="4. Acceptance Criteria" subtitle="Definition quality and readiness for validation" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Criteria Defined" value={392} suffix="" trend={8.2} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Criteria Approved" value={341} suffix="" trend={6.6} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Coverage %" value={87} trend={2.1} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Validation Status" value={84} trend={1.4} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <DonutChart
              data={[
                { name: 'Validated', value: 84, color: colors.success },
                { name: 'Pending', value: 12, color: colors.warning },
                { name: 'Rework', value: 4, color: colors.critical },
              ]}
              centerLabel="Validation"
              centerValue="84%"
              height={210}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Product Area</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Defined</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Approved</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Coverage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { area: 'Net Banking', defined: 104, approved: 93, coverage: '89%' },
                    { area: 'Mobile Banking', defined: 98, approved: 86, coverage: '88%' },
                    { area: 'Payments', defined: 117, approved: 99, coverage: '85%' },
                    { area: 'Fraud Monitoring', defined: 73, approved: 63, coverage: '86%' },
                  ].map((row) => (
                    <TableRow key={row.area} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.area}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.defined}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.approved}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.coverage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="5. Requirements Traceability" subtitle="End-to-end linkage from requirement to release" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Requirement → Design Coverage" value={91} trend={2.0} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Requirement → Test Coverage" value={88} trend={3.1} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Requirement → Release Coverage" value={83} trend={1.5} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Traceability Score" value={87} trend={2.6} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <HorizontalBarChart
              data={[
                { name: 'Design', value: 91 },
                { name: 'Test', value: 88 },
                { name: 'Release', value: 83 },
              ]}
              height={180}
              barColor={colors.secondary}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Requirement ID</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Design Ref</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Test Ref</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Release Ref</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { id: 'REQ-421', design: 'DES-210', test: 'TST-778', release: 'REL-24.6' },
                    { id: 'REQ-433', design: 'DES-221', test: 'TST-792', release: 'REL-24.7' },
                    { id: 'REQ-447', design: 'DES-236', test: 'TST-804', release: 'REL-24.7' },
                    { id: 'REQ-452', design: 'DES-240', test: 'TST-815', release: 'REL-24.8' },
                  ].map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.id}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.design}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.test}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.release}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <RequirementIntakeWorkflow />
    </Box>
  );
}
