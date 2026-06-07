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
import { HorizontalBarChart } from '../components/charts/HorizontalBarChart';
import { MultiLineChart } from '../components/charts/MultiLineChart';
import { colors } from '../theme/colors';
import { DesignIntakeWorkflow } from '../components/architecture/DesignIntakeWorkflow';
import { AnalyzeWithAIPanel } from '../components/workflow/AnalyzeWithAIPanel';

export function ArchitectureHub() {
  return (
    <Box>
      <AnalyzeWithAIPanel
        phase="architecture"
        title="Architecture Analysis"
        subtitle="Evaluate design patterns and integration risks"
        placeholder="e.g. UPI settlement service redesign, payment gateway migration..."
        glow="blue"
      />

      <AnalyzeWithAIPanel
        phase="design"
        title="Design Analysis"
        subtitle="Solution design, integration points, and security review"
        placeholder="e.g. Merchant settlement HLD, NPCI integration blueprint..."
        glow="blue"
      />

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="1. Enterprise Architecture" subtitle="Portfolio-wide architecture governance and capability mapping" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Applications Assessed" value={62} suffix="" trend={8.7} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Business Capability Mapping" value={89} trend={2.8} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Architecture Compliance %" value={92} trend={1.9} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Technology Standardization Score" value={84} trend={3.2} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <DonutChart
              data={[
                { name: 'Core Banking', value: 18, color: colors.primary },
                { name: 'UPI Platform', value: 12, color: colors.info },
                { name: 'Mobile Banking', value: 10, color: colors.success },
                { name: 'Payments Gateway', value: 9, color: colors.warning },
                { name: 'Loan Origination', value: 7, color: colors.secondary },
                { name: 'KYC Platform', value: 6, color: colors.critical },
              ]}
              centerLabel="Assessed"
              centerValue={62}
              height={210}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Domain</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Apps</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Capability Fit</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Compliance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { domain: 'Core Banking', apps: 18, fit: '91%', compliance: '94%' },
                    { domain: 'UPI Platform', apps: 12, fit: '88%', compliance: '92%' },
                    { domain: 'Mobile Banking', apps: 10, fit: '87%', compliance: '90%' },
                    { domain: 'Loan Origination', apps: 7, fit: '84%', compliance: '89%' },
                  ].map((row) => (
                    <TableRow key={row.domain} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.domain}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.apps}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.fit}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.compliance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="2. Solution Architecture" subtitle="Review lifecycle and design approval velocity" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Solutions Reviewed" value={46} suffix="" trend={10.2} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Approved Designs" value={34} suffix="" trend={6.3} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Pending Reviews" value={8} suffix="" trend={-11.1} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Design Maturity Score" value={86} trend={2.5} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <HorizontalBarChart
              data={[
                { name: 'Approved', value: 74 },
                { name: 'Pending', value: 17 },
                { name: 'Rework', value: 9 },
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
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Solution</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Domain</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Board</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { solution: 'UPI Reconciliation Orchestrator', domain: 'UPI Platform', board: 'ARB-12', status: 'Approved' },
                    { solution: 'Retail Loan Rules Engine', domain: 'Loan Origination', board: 'ARB-13', status: 'Conditional' },
                    { solution: 'Mobile API Gateway Refactor', domain: 'Mobile Banking', board: 'ARB-14', status: 'Pending' },
                  ].map((row) => (
                    <TableRow key={row.solution} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.solution}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.domain}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.board}</TableCell>
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
        <ModuleHeader title="3. Technical Architecture" subtitle="Service and API engineering landscape" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Services Designed" value={128} suffix="" trend={9.4} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="API Inventory" value={286} suffix="" trend={7.1} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Integration Complexity" value={71} trend={-2.0} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Reusability Score" value={79} trend={4.8} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <DonutChart
              data={[
                { name: 'Core Banking', value: 28, color: colors.primary },
                { name: 'Payments Gateway', value: 24, color: colors.info },
                { name: 'Mobile Banking', value: 20, color: colors.success },
                { name: 'KYC Platform', value: 16, color: colors.warning },
                { name: 'Loan Origination', value: 12, color: colors.secondary },
              ]}
              centerLabel="Services"
              centerValue={128}
              height={210}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Platform</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Services</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>APIs</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Complexity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { platform: 'Core Banking', services: 28, apis: 64, complexity: 'High' },
                    { platform: 'UPI Platform', services: 24, apis: 58, complexity: 'High' },
                    { platform: 'Mobile Banking', services: 20, apis: 49, complexity: 'Medium' },
                    { platform: 'KYC Platform', services: 16, apis: 33, complexity: 'Medium' },
                  ].map((row) => (
                    <TableRow key={row.platform} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.platform}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.services}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.apis}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.complexity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="4. Security Architecture" subtitle="Architecture-level security control posture" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Security Reviews Completed" value={39} suffix="" trend={11.4} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Critical Findings" value={5} suffix="" trend={-16.7} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Open Risks" value={11} suffix="" trend={-8.3} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Security Compliance %" value={90} trend={2.1} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MultiLineChart
              data={[
                { month: 'Jan', completed: 20, critical: 9, open: 18 },
                { month: 'Feb', completed: 23, critical: 8, open: 17 },
                { month: 'Mar', completed: 27, critical: 7, open: 16 },
                { month: 'Apr', completed: 31, critical: 7, open: 14 },
                { month: 'May', completed: 35, critical: 6, open: 12 },
                { month: 'Jun', completed: 39, critical: 5, open: 11 },
              ]}
              series={[
                { key: 'completed', color: colors.success, name: 'Reviews Completed' },
                { key: 'critical', color: colors.critical, name: 'Critical Findings' },
                { key: 'open', color: colors.warning, name: 'Open Risks' },
              ]}
              height={200}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Area</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Completed</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Open</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Compliance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { area: 'Core Banking', completed: 9, open: 3, compliance: '92%' },
                    { area: 'UPI Platform', completed: 8, open: 2, compliance: '90%' },
                    { area: 'Mobile Banking', completed: 7, open: 2, compliance: '89%' },
                    { area: 'Payments Gateway', completed: 6, open: 3, compliance: '88%' },
                  ].map((row) => (
                    <TableRow key={row.area} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.area}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.completed}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.open}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.compliance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="5. Architecture Reviews" subtitle="Architecture review board outcomes by domain" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Review Board Decisions" value={52} suffix="" trend={7.1} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Approved" value={36} suffix="" trend={9.1} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Conditional Approvals" value={11} suffix="" trend={-4.3} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Rejected Designs" value={5} suffix="" trend={-16.7} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <HorizontalBarChart
              data={[
                { name: 'Approved', value: 69 },
                { name: 'Conditional', value: 21 },
                { name: 'Rejected', value: 10 },
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
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Design</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Domain</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Decision</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Board Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { design: 'KYC OCR Processing Mesh', domain: 'KYC Platform', decision: 'Approved', boardDate: '14-Jun' },
                    { design: 'Real-time UPI Risk Rules', domain: 'UPI Platform', decision: 'Conditional', boardDate: '11-Jun' },
                    { design: 'Legacy Loan API Adapter', domain: 'Loan Origination', decision: 'Rejected', boardDate: '08-Jun' },
                    { design: 'Payment Switch Failover Layer', domain: 'Payments Gateway', decision: 'Approved', boardDate: '05-Jun' },
                  ].map((row) => (
                    <TableRow key={row.design} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.design}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.domain}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.decision}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.boardDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <DesignIntakeWorkflow />
    </Box>
  );
}
