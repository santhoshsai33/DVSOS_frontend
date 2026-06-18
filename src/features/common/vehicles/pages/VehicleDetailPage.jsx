import { Box, Card, Grid, Typography } from '@mui/material';
import { ArrowLeft, Car, Clock, Edit3, Fuel, History, Phone, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../../components/common/Button';
import PageHeader from '../../../../components/shared/PageHeader';
import StatusBadge from '../../../../components/common/StatusBadge';
import VehicleNumberPlate from '../../../../components/common/VehicleNumberPlate';
import Loader from '../../../../components/common/Loader';
import { useVehicle } from '../../../../queries/useDataQueries';
import { formatDateTime } from '../../../../utils/formatters';
import { ROUTES } from '../../../../config/routes';

function DetailItem({ icon: Icon, label, value }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
      <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon size={17} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.25 }}>
          {value || '-'}
        </Typography>
      </Box>
    </Box>
  );
}

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(id);

  if (isLoading) return <Loader fullPage text="Loading vehicle details..." />;

  if (!vehicle) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Vehicle not found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>The selected vehicle could not be located.</Typography>
          <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate(ROUTES.VEHICLES)}>Back to Vehicles</Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Vehicle Details"
        breadcrumbs={[{ label: 'Vehicles', path: ROUTES.VEHICLES }, { label: 'Details' }]}
        actions={
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="secondary" leftIcon={History} onClick={() => navigate(`${ROUTES.VEHICLES}/${id}/history`)}>
              Service History
            </Button>
            <Button variant="primary" leftIcon={Edit3} onClick={() => navigate(`${ROUTES.VEHICLES}/${id}/edit`)}>
              Edit Vehicle
            </Button>
          </Box>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Registration</Typography>
                <Box sx={{ mt: 1 }}>
                  <VehicleNumberPlate vehicleNumber={vehicle.vehicleNumber} />
                </Box>
              </Box>
              <StatusBadge status={vehicle.status} />
            </Box>
            <Typography variant="h6" fontWeight={800}>{vehicle.makeModel}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {vehicle.type} / {vehicle.fuelType}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><DetailItem icon={User} label="Owner Name" value={vehicle.ownerName} /></Grid>
            <Grid item xs={12} md={6}><DetailItem icon={Phone} label="Mobile" value={vehicle.mobile} /></Grid>
            <Grid item xs={12} md={6}><DetailItem icon={Car} label="Make & Model" value={vehicle.makeModel} /></Grid>
            <Grid item xs={12} md={6}><DetailItem icon={Fuel} label="Fuel Type" value={vehicle.fuelType} /></Grid>
            <Grid item xs={12} md={6}><DetailItem icon={Car} label="Vehicle Type" value={vehicle.type} /></Grid>
            <Grid item xs={12} md={6}><DetailItem icon={Clock} label="Last Entry Time" value={formatDateTime(vehicle.entryTime)} /></Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
