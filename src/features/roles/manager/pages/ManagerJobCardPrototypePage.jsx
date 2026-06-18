import { Box, Card, Grid, TextField, Typography } from '@mui/material';
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ClipboardList,
  Edit3,
  FileText,
  Printer,
  Save,
  Siren,
  UserRound,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../../components/common/Button';
import PageHeader from '../../../../components/shared/PageHeader';
import { ROUTES } from '../../../../config/routes';

const job = {
  id: 'JC-2025-0041',
  vehicle: 'KA 01 MN 3344',
  customer: 'Anita Nair',
  phone: '+91 87654 32109',
  makeModel: 'Hyundai Creta 2022',
  color: 'White',
  mechanic: 'Ravi Kumar - Bay 1',
  stage: 'Mechanical',
  entryTime: '09:15 AM',
  delivery: 'Today 3:00 PM',
  previousService: '22 Mar 2024',
  total: 'Rs. 3,300',
};

const items = [
  { no: '01', name: 'Brake Pad Replacement', price: 'Rs. 2,500', qty: 'x1', status: 'In Progress', tone: 'info' },
  { no: '02', name: 'Tyre Rotation', price: 'Rs. 800', qty: 'x1', status: 'Pending', tone: 'warning' },
];

const journey = [
  { label: 'Vehicle Entry', time: '09:15 AM - Gate', done: true },
  { label: 'Job Card Created', time: '09:22 AM - Rs. 4,350 est.', done: true },
  { label: 'Mechanical Done', time: '10:45 AM - Ravi Kumar', active: true },
  { label: 'Body Shop', time: 'Not Required' },
  { label: 'Water Wash', time: 'Waiting 22 min - Overdue' },
  { label: 'Vehicle Delivery', time: 'Expected: 5:00 PM' },
];

const toneStyles = {
  info: { bg: '#EFF6FF', border: '#BFDBFE', color: '#2563EB' },
  warning: { bg: '#FFFBEB', border: '#FCD34D', color: '#B7791F' },
  success: { bg: '#ECFDF5', border: '#86EFAC', color: '#047857' },
};

function StatusPill({ tone = 'info', children }) {
  const style = toneStyles[tone];
  return (
    <Box component="span" sx={{ border: '1px solid', borderColor: style.border, bgcolor: style.bg, color: style.color, borderRadius: '999px', px: 1, py: 0.35, fontSize: 11, fontWeight: 800 }}>
      {children}
    </Box>
  );
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #D8E2F3', pb: 1.5, mb: 2 }}>
      <Icon size={16} color="#64748B" />
      <Typography variant="caption" sx={{ color: '#8A9AB5', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {children}
      </Typography>
    </Box>
  );
}

export default function ManagerJobCardPrototypePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#EEF4FF', minHeight: '100%' }}>
      <PageHeader
        title={`${job.vehicle} - ${job.customer}`}
        subtitle={`Job Card: ${id || job.id} - ${job.makeModel}`}
        breadcrumbs={[
          { label: 'Manager', path: ROUTES.MANAGER_DASHBOARD },
          { label: 'Job Card Detail' },
        ]}
        actions={
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <StatusPill>{job.stage}</StatusPill>
            <Button variant="secondary" size="sm" leftIcon={Printer}>Print</Button>
            <Button variant="secondary" size="sm" leftIcon={Edit3}>Edit Job Card</Button>
          </Box>
        }
      />

      <Grid container spacing={2}>
        <Grid item xs={12} lg={9}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Card sx={{ borderRadius: 2, border: '1px solid #D8E2F3', p: 2.25 }}>
              <SectionTitle icon={UserRound}>Vehicle and customer details</SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} sx={{ borderRight: { md: '1px solid #D8E2F3' } }}>
                  <Typography variant="caption" sx={{ color: '#8A9AB5', fontWeight: 900, textTransform: 'uppercase' }}>Customer</Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', my: 2 }}>
                    <Box sx={{ width: 42, height: 42, borderRadius: '50%', bgcolor: '#F97316', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 900 }}>
                      AN
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 900 }}>{job.customer}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>{job.phone}</Typography>
                    </Box>
                  </Box>
                  {[
                    ['Job Card', job.id],
                    ['Entry Time', job.entryTime],
                    ['Est. Delivery', job.delivery],
                    ['Prev. Service', job.previousService],
                  ].map(([label, value]) => (
                    <Box key={label} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Typography variant="caption" sx={{ width: 110, color: '#8A9AB5', fontWeight: 700 }}>{label}:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>{value}</Typography>
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" sx={{ color: '#8A9AB5', fontWeight: 900, textTransform: 'uppercase' }}>Vehicle</Typography>
                  <Typography variant="h5" sx={{ my: 2, fontFamily: 'monospace', color: '#1D4ED8', fontWeight: 900, letterSpacing: '0.08em' }}>{job.vehicle}</Typography>
                  {[
                    ['Make/Model', job.makeModel],
                    ['Colour', job.color],
                    ['Mechanic', job.mechanic],
                  ].map(([label, value]) => (
                    <Box key={label} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Typography variant="caption" sx={{ width: 110, color: '#8A9AB5', fontWeight: 700 }}>{label}:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>{value}</Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </Card>

            <Card sx={{ borderRadius: 2, border: '1px solid #D8E2F3', p: 2.25 }}>
              <SectionTitle icon={ClipboardList}>Job card items</SectionTitle>
              <Box sx={{ overflowX: 'auto' }}>
                <Box component="table" sx={{ width: '100%', minWidth: 660, borderCollapse: 'collapse' }}>
                  <Box component="thead">
                    <Box component="tr" sx={{ bgcolor: '#F8FAFC' }}>
                      {['#', 'Service Item', 'Price', 'Qty', 'Status'].map((head) => (
                        <Box component="th" key={head} sx={{ p: 1.5, textAlign: 'left', fontSize: 11, color: '#8A9AB5', textTransform: 'uppercase' }}>{head}</Box>
                      ))}
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {items.map((item) => (
                      <Box component="tr" key={item.no} sx={{ borderTop: '1px solid #D8E2F3' }}>
                        <Box component="td" sx={{ p: 1.5, fontFamily: 'monospace', fontWeight: 800 }}>{item.no}</Box>
                        <Box component="td" sx={{ p: 1.5 }}>{item.name}</Box>
                        <Box component="td" sx={{ p: 1.5, fontWeight: 700 }}>{item.price}</Box>
                        <Box component="td" sx={{ p: 1.5 }}>{item.qty}</Box>
                        <Box component="td" sx={{ p: 1.5 }}><StatusPill tone={item.tone}>{item.status}</StatusPill></Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1.5 }}>
                <Typography variant="body2">Total:</Typography>
                <Typography variant="h6" sx={{ color: '#2563EB', fontWeight: 900 }}>{job.total}</Typography>
              </Box>
            </Card>

            <Card sx={{ borderRadius: 2, border: '1px solid #D8E2F3', p: 2.25 }}>
              <SectionTitle icon={AlertTriangle}>Pending actions and alerts</SectionTitle>
              <Box sx={{ bgcolor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 1, p: 1.5, display: 'flex', gap: 1.25, flexWrap: 'wrap', alignItems: 'center' }}>
                <AlertTriangle size={18} color="#B7791F" />
                <Typography variant="body2" sx={{ flex: 1, minWidth: 240 }}>
                  Additional work pending customer approval: <strong>Bearing Replacement - Rs. 1,800</strong>
                </Typography>
                <Button variant="success" size="sm">Override Approve</Button>
                <Button variant="secondary" size="sm">Resend WhatsApp</Button>
              </Box>
            </Card>

            <Card sx={{ borderRadius: 2, border: '1px solid #D8E2F3', p: 2.25 }}>
              <SectionTitle icon={Edit3}>Manager notes and actions</SectionTitle>
              <TextField
                multiline
                minRows={3}
                fullWidth
                placeholder="Add manager observations or escalation notes..."
                sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button variant="secondary" size="sm" leftIcon={Save}>Save Notes</Button>
                <Button variant="secondary" size="sm" leftIcon={Siren}>Escalate to MD</Button>
                <Button variant="secondary" size="sm" leftIcon={Edit3}>Edit Job Card</Button>
                <Button variant="ghost" size="sm" leftIcon={ArrowLeft} onClick={() => navigate(ROUTES.MANAGER_DASHBOARD)}>Back</Button>
              </Box>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Card sx={{ borderRadius: 2, border: '1px solid #D8E2F3', p: 2.25 }}>
              <SectionTitle icon={FlagIcon}>Full job journey</SectionTitle>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                {journey.map((step) => (
                  <Box key={step.label} sx={{ display: 'flex', gap: 1.25 }}>
                    <Box sx={{ width: 12, height: 12, mt: 0.35, borderRadius: '50%', bgcolor: step.done ? '#10B981' : step.active ? '#2563EB' : '#CBD5E1', border: '2px solid #DBEAFE', flexShrink: 0 }} />
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 900 }}>{step.label}</Typography>
                      <Typography variant="caption" sx={{ color: step.time.includes('Overdue') ? '#B42318' : '#64748B' }}>{step.time}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>

            <Card sx={{ borderRadius: 2, border: '1px solid #D8E2F3', p: 2.25 }}>
              <SectionTitle icon={ClockIcon}>SLA and time tracking</SectionTitle>
              {[
                ['Total in workshop', '2h 08m', '#EA580C'],
                ['Promised delivery', '5:00 PM', '#2563EB'],
                ['Time remaining', '6h 52m', '#059669'],
              ].map(([label, value, color]) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #D8E2F3', py: 1 }}>
                  <Typography variant="caption" sx={{ color: '#8A9AB5', fontWeight: 700 }}>{label}</Typography>
                  <Typography variant="caption" sx={{ color, fontWeight: 900 }}>{value}</Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#8A9AB5', fontWeight: 700 }}>SLA Status</Typography>
                <StatusPill tone="info">On Track</StatusPill>
              </Box>
            </Card>

            <Card sx={{ borderRadius: 2, border: '1px solid #D8E2F3', p: 2.25 }}>
              <SectionTitle icon={Camera}>Photos on file</SectionTitle>
              <Grid container spacing={1}>
                {['Front', 'Rear', 'Add', 'Add'].map((label) => (
                  <Grid item xs={6} key={label}>
                    <Box sx={{ height: 92, border: '1px dashed #93C5FD', bgcolor: label === 'Add' ? '#F8FAFC' : '#ECFDF5', borderRadius: 1, display: 'grid', placeItems: 'center', color: '#64748B' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Camera size={16} />
                        <Typography variant="caption" sx={{ display: 'block', fontSize: 10 }}>{label}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function FlagIcon(props) {
  return <FileText {...props} />;
}

function ClockIcon(props) {
  return <CheckCircle2 {...props} />;
}
