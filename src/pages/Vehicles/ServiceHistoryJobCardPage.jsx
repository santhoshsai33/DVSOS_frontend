import { Box, Card, Grid, Typography } from '@mui/material';
import { ArrowLeft, Calendar, Car, CheckCircle2, ClipboardList, FileText, IndianRupee, User, Wrench } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import VehicleNumberPlate from '../../components/common/VehicleNumberPlate';
import { ROUTES } from '../../config/routes';
const SERVICE_HISTORY_ITEMS = [
  {
    id: 'JC-1001',
    date: '2024-05-15',
    vehicleNumber: 'TN 01 AB 1234',
    customerName: 'Ramesh Kumar',
    services: ['General Service', 'Oil Change'],
    cost: 4500,
    status: 'COMPLETED',
    technician: 'Rajan M.',
    approvals: ['Brake Pad Replacement approved via WhatsApp'],
    complaint: 'Customer reported brake noise and regular service due.',
    notes: 'Oil changed, brake inspection completed, brake pad replacement approved.',
  }
];

const fallbackJob = SERVICE_HISTORY_ITEMS[0];

function DetailRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1, borderBottom: '1px dashed', borderColor: 'divider' }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'right' }}>{value}</Typography>
    </Box>
  );
}

export default function ServiceHistoryJobCardPage() {
  const { jobCardId } = useParams();
  const navigate = useNavigate();
  const job = SERVICE_HISTORY_ITEMS.find((item) => item.id === jobCardId) || fallbackJob;
  const itemAmount = Math.round(job.cost / Math.max(job.services.length, 1));

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title={`Job Card ${job.id}`}
        subtitle={`${job.vehicleNumber} - ${job.customerName}`}
        breadcrumbs={[
          { label: 'Vehicles', path: ROUTES.VEHICLES },
          { label: 'History', path: ROUTES.SERVICE_HISTORY },
          { label: job.id },
        ]}
        actions={
          <Button variant="back" leftIcon={ArrowLeft} onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <ClipboardList size={22} color="#2563EB" />
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>{job.id}</Typography>
                </Box>
                <StatusBadge status={job.status} />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
                    <Car size={18} color="#64748B" />
                    <VehicleNumberPlate vehicleNumber={job.vehicleNumber} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
                    <User size={18} color="#64748B" />
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{job.customerName}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
                    <Calendar size={18} color="#64748B" />
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{job.date}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
                    <Wrench size={18} color="#64748B" />
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{job.technician}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>

            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>Service Items</Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box component="table" sx={{ width: '100%', minWidth: 560, borderCollapse: 'collapse' }}>
                  <Box component="thead">
                    <Box component="tr" sx={{ bgcolor: '#F8FAFC' }}>
                      {['#', 'Service', 'Qty', 'Amount'].map((header) => (
                        <Box component="th" key={header} sx={{ p: 1.5, textAlign: 'left', fontSize: 12, color: '#64748B', textTransform: 'uppercase' }}>{header}</Box>
                      ))}
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {job.services.map((service, index) => (
                      <Box component="tr" key={service} sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                        <Box component="td" sx={{ p: 1.5, fontWeight: 800 }}>{String(index + 1).padStart(2, '0')}</Box>
                        <Box component="td" sx={{ p: 1.5 }}>{service}</Box>
                        <Box component="td" sx={{ p: 1.5 }}>x1</Box>
                        <Box component="td" sx={{ p: 1.5, fontWeight: 800 }}>Rs. {itemAmount.toLocaleString('en-IN')}</Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Card>

            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>Complaint & Notes</Typography>
              <DetailRow label="Customer Complaint" value={job.complaint} />
              <DetailRow label="Technician Notes" value={job.notes} />
              {job.approvals.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 900, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <CheckCircle2 size={16} color="#0F766E" /> {job.approvals.join(', ')}
                  </Typography>
                </Box>
              )}
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, borderRadius: 2, position: { lg: 'sticky' }, top: { lg: 88 } }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>Estimate Summary</Typography>
            <DetailRow label="Services" value={job.services.length} />
            <DetailRow label="Subtotal" value={`Rs. ${job.cost.toLocaleString('en-IN')}`} />
            <DetailRow label="Tax" value="Included" />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, color: 'primary.main' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IndianRupee size={18} /> Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>Rs. {job.cost.toLocaleString('en-IN')}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
