import { Box, Card, Grid, Typography } from '@mui/material';
import { ArrowLeft, Car, Clock, Edit3, Fuel, History, Phone, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import { useVehicle } from '../../queries/useDataQueries';
import { formatDateTime } from '../../utils/formatters';
import { ROUTES } from '../../config/routes';
import VehicleImageSlider from '../../components/common/VehicleImageSlider';

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

      <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Grid container>
          {/* Left Panel */}
          <Grid item xs={12} md={7} sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  color: '#2563EB',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  Registration
                </Box>
                <StatusBadge status={vehicle.status} />
              </Box>

              <Typography variant="h3" sx={{
                fontWeight: 800,
                color: '#2563EB',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.02em',
                mb: 2,
                fontSize: { xs: '1.75rem', sm: '2.25rem' }
              }}>
                {vehicle.vehicleNumber}
              </Typography>

              <Typography variant="h5" sx={{
                fontWeight: 800,
                color: '#0F172A',
                fontFamily: "'Inter', sans-serif', sans-serif",
                mb: 0.5
              }}>
                {vehicle.makeModel}
              </Typography>

              <Typography variant="body2" sx={{
                fontWeight: 700,
                color: '#64748B',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                mb: 4
              }}>
                {vehicle.type} • {vehicle.fuelType}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, borderTop: '1px solid #E2E8F0', mt: 2 }}>
              {/* Item 1 */}
              <Box sx={{ p: 2.5, borderBottom: '1px solid #F1F5F9', borderRight: { sm: '1px solid #F1F5F9' }, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: '#EFF6FF', color: '#3B82F6', display: 'grid', placeItems: 'center' }}>
                  <User size={20} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', fontSize: '0.65rem' }}>Owner Name</Typography>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, fontSize: '0.875rem' }}>{vehicle.ownerName}</Typography>
                </Box>
              </Box>
              {/* Item 2 */}
              <Box sx={{ p: 2.5, borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: '#EFF6FF', color: '#3B82F6', display: 'grid', placeItems: 'center' }}>
                  <Phone size={20} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', fontSize: '0.65rem' }}>Mobile</Typography>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, fontSize: '0.875rem' }}>{vehicle.mobile}</Typography>
                </Box>
              </Box>
              {/* Item 3 */}
              <Box sx={{ p: 2.5, borderBottom: '1px solid #F1F5F9', borderRight: { sm: '1px solid #F1F5F9' }, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: '#EFF6FF', color: '#3B82F6', display: 'grid', placeItems: 'center' }}>
                  <Car size={20} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', fontSize: '0.65rem' }}>Make & Model</Typography>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, fontSize: '0.875rem' }}>{vehicle.makeModel}</Typography>
                </Box>
              </Box>
              {/* Item 4 */}
              <Box sx={{ p: 2.5, borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: '#EFF6FF', color: '#3B82F6', display: 'grid', placeItems: 'center' }}>
                  <Fuel size={20} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', fontSize: '0.65rem' }}>Fuel Type</Typography>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, fontSize: '0.875rem' }}>{vehicle.fuelType}</Typography>
                </Box>
              </Box>
              {/* Item 5 */}
              <Box sx={{ p: 2.5, borderBottom: { xs: '1px solid #F1F5F9', sm: 'none' }, borderRight: { sm: '1px solid #F1F5F9' }, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: '#EFF6FF', color: '#3B82F6', display: 'grid', placeItems: 'center' }}>
                  <Car size={20} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', fontSize: '0.65rem' }}>Vehicle Type</Typography>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, fontSize: '0.875rem' }}>{vehicle.type}</Typography>
                </Box>
              </Box>
              {/* Item 6 */}
              <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: '#EFF6FF', color: '#3B82F6', display: 'grid', placeItems: 'center' }}>
                  <Clock size={20} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', fontSize: '0.65rem' }}>Last Entry Time</Typography>
                  <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 800, fontSize: '0.875rem' }}>{formatDateTime(vehicle.entryTime)}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Panel */}
          <Grid item xs={12} md={5} sx={{
            bgcolor: '#EEF2FF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            position: 'relative',
            p: 0,
            overflow: 'hidden',
            minHeight: 512
          }}>
            {/* Soft decorative circles/glow */}
            <Box sx={{
              position: 'absolute',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(238,242,255,1) 0%, rgba(219,234,254,0.6) 100%)',
              zIndex: 1,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }} />

            {/* Subtle dots pattern for tech texture */}
            <Box sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 100,
              height: 100,
              opacity: 0.1,
              backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)',
              backgroundSize: '10px 10px',
              zIndex: 1
            }} />

            <VehicleImageSlider />
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
