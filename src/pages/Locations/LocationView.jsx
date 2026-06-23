import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Grid, Skeleton } from '@mui/material';
import BackButton from '../../components/common/BackButton';
import { ROUTES } from '../../config/routes';
import { getLocationApi } from '../../api/adminLocationApi';
import { toastError } from '../../notifications/toast';

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant="body2" fontWeight={600} sx={{ width: '40%', color: 'text.primary' }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ width: '60%', color: 'text.secondary' }}>
      {value || '-'}
    </Typography>
  </Box>
);

export default function LocationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await getLocationApi(id);
        if (res?.success) {
          setLocation(res.data.location || res.data);
        }
      } catch (error) {
        toastError(error?.message || 'Failed to fetch location details');
        navigate(ROUTES.ADMIN_LOCATIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Card sx={{ p: 4, borderRadius: 1, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>Location Details</Typography>
        <BackButton to={ROUTES.ADMIN_LOCATIONS} label="Back to Locations" />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 1, boxShadow: 'none', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                Location Information
              </Typography>
            </Box>
            <Box sx={{ px: 2, pb: 1 }}>
              <DetailRow label="Location Name" value={location?.locationName} />
              <DetailRow label="Location Code" value={location?.locationCode} />
              <DetailRow 
                label="Status" 
                value={
                  <Typography variant="caption" fontWeight={700} color={location?.isActive ? 'success.main' : 'error.main'}>
                    {location?.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </Typography>
                } 
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 1, boxShadow: 'none', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                System Details
              </Typography>
            </Box>
            <Box sx={{ px: 2, pb: 1 }}>
              <DetailRow label="Created On" value={location?.createdAt ? new Date(location.createdAt).toLocaleDateString() : 'N/A'} />
              <DetailRow label="Last Updated" value={location?.updatedAt ? new Date(location.updatedAt).toLocaleDateString() : 'N/A'} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
