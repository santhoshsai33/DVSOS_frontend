import { Box, Card, Grid, Typography } from '@mui/material';
import { ArrowLeft, Calendar, Camera, CheckCircle2, FileText, IndianRupee, Wrench } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { ROUTES } from '../../config/routes';
import { useVehicleHistory } from '../../queries/useDataQueries';
import Loader from '../../components/common/Loader';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Box sx={{ color: 'text.secondary', display: 'flex' }}><Icon size={15} /></Box>
      <Typography variant="caption" sx={{ width: 60, color: 'text.secondary', fontWeight: 800 }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>{value}</Typography>
    </Box>
  );
}

export default function VehicleHistory() {
  const { slug, id } = useParams();
  const identifier = slug || id;
  const navigate = useNavigate();
  const { data: history = [], isLoading } = useVehicleHistory(identifier);

  if (isLoading) return <Loader fullPage text="Loading service history..." />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Service History"
        subtitle={identifier ? `Viewing history for vehicle ${identifier}` : 'Vehicle service records and previous job cards'}
        breadcrumbs={[{ label: 'Vehicles', path: ROUTES.VEHICLES }, { label: 'History' }]}
        actions={
          identifier && (
            <Button variant="back" leftIcon={ArrowLeft} onClick={() => navigate(`${ROUTES.VEHICLES}`)}>
              Back to Vehicle List
            </Button>
          )
        }
      />

      <Box sx={{ display: 'grid', gap: 2 }}>
        {history.length === 0 && (
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="body1" color="text.secondary">No service history found for this vehicle.</Typography>
          </Card>
        )}
        {history.map((job) => (
          <Card key={job.id} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Box sx={{ px: 2.5, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <FileText size={20} color="#2563EB" />
                <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 900 }}>{job.id}</Typography>
              </Box>
              <StatusBadge status={job.status} />
            </Box>

            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}><InfoRow icon={Calendar} label="Date" value={job.date} /></Grid>
                <Grid item xs={12} md={6}><InfoRow icon={Wrench} label="Services" value={job.services?.length ? job.services.join(', ') : 'No Services'} /></Grid>
                <Grid item xs={12} md={3}><InfoRow icon={IndianRupee} label="Cost" value={`Rs. ${job.cost.toLocaleString('en-IN')}`} /></Grid>
              </Grid>

            </Box>

            <Box sx={{ px: 2.5, py: 1.75, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
              <Button size="sm" variant="outline" leftIcon={FileText} onClick={() => navigate(`/job-cards/view/${job.slug || job.id}`)}>
                View Full Job Card
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
