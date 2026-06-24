import { Box, Card, Grid, Typography } from '@mui/material';
import { ArrowLeft, Calendar, Camera, CheckCircle2, FileText, IndianRupee, Wrench } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { ROUTES } from '../../config/routes';

export const SERVICE_HISTORY_ITEMS = [
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
  },
  {
    id: 'JC-0842',
    date: '2023-11-20',
    vehicleNumber: 'TN 01 AB 1234',
    customerName: 'Ramesh Kumar',
    services: ['Body Repair', 'Paint Work'],
    cost: 12000,
    status: 'COMPLETED',
    technician: 'Vikram S.',
    approvals: [],
    complaint: 'Rear bumper dent and paint scratches.',
    notes: 'Body repair completed and paint matched with vehicle color.',
  },
];

function InfoRow({ icon: Icon, label, value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Box sx={{ color: 'text.secondary', display: 'flex' }}><Icon size={15} /></Box>
      <Typography variant="caption" sx={{ width: 90, color: 'text.secondary', fontWeight: 800 }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
}

export default function VehicleHistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Service History"
        subtitle={id ? `Viewing history for vehicle ${id}` : 'Vehicle service records and previous job cards'}
        breadcrumbs={[{ label: 'Vehicles', path: ROUTES.VEHICLES }, { label: 'History' }]}
        actions={
          id && (
            <Button variant="back" leftIcon={ArrowLeft} onClick={() => navigate(`${ROUTES.VEHICLES}/${id}`)}>
              Back to Vehicle Details
            </Button>
          )
        }
      />

      <Box sx={{ display: 'grid', gap: 2 }}>
        {SERVICE_HISTORY_ITEMS.map((job) => (
          <Card key={job.id} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ px: 2.5, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, bgcolor: '#F8FAFC', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <FileText size={20} color="#2563EB" />
                <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 900 }}>{job.id}</Typography>
              </Box>
              <StatusBadge status={job.status} />
            </Box>

            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}><InfoRow icon={Calendar} label="Date" value={job.date} /></Grid>
                <Grid item xs={12} md={4}><InfoRow icon={Wrench} label="Services" value={job.services.join(', ')} /></Grid>
                <Grid item xs={12} md={4}><InfoRow icon={IndianRupee} label="Cost" value={`Rs. ${job.cost.toLocaleString('en-IN')}`} /></Grid>
              </Grid>

              {job.approvals.length > 0 && (
                <Box sx={{ mt: 2.5, p: 2, border: '1px solid #A7F3D0', bgcolor: '#ECFDF5', borderRadius: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 900, mb: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <CheckCircle2 size={16} color="#0F766E" /> Approvals
                  </Typography>
                  {job.approvals.map((approval) => (
                    <Typography key={approval} variant="body2" color="text.secondary" sx={{ pl: 3 }}>
                      {approval}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>

            <Box sx={{ px: 2.5, py: 1.75, bgcolor: '#F8FAFC', borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
              <Button size="sm" variant="outline" leftIcon={FileText} onClick={() => navigate(`/service-history/job-cards/${job.id}`)}>
                View Full Job Card
              </Button>
              <Button size="sm" variant="outline" leftIcon={Camera}>
                View Photos
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
