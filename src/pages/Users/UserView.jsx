import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Grid, Skeleton } from '@mui/material';
import BackButton from '../../components/common/BackButton';
import { ROUTES } from '../../config/routes';
import { getUserApi } from '../../api/userApi';
import { toastError } from '../../notifications/toast';

const DetailRow = ({ label, value, isLast = false }) => (
  <Box sx={{ display: 'flex', py: 1.5, borderBottom: isLast ? 'none' : '1px solid', borderColor: 'divider' }}>
    <Typography variant="body2" fontWeight={600} sx={{ width: '40%', color: 'text.primary' }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ width: '60%', color: 'text.secondary', wordBreak: 'break-word' }}>
      {value || '-'}
    </Typography>
  </Box>
);

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserApi(id);
        if (res?.success) {
          setUser(res.data.user || res.data);
        }
      } catch (error) {
        toastError(error?.message || 'Failed to fetch user details');
        navigate(ROUTES.ADMIN_USERS);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
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
        <Typography variant="h5" fontWeight={700}>User Details</Typography>
        <BackButton to={ROUTES.ADMIN_USERS} label="Back to Users" />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 1, boxShadow: 'none', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                User Information
              </Typography>
            </Box>
            <Box sx={{ px: 2, pb: 1 }}>
              <DetailRow label="Full Name" value={user?.fullName} />
              <DetailRow label="Email" value={user?.email || user?.emailId} />
              <DetailRow label="Mobile" value={user?.mobile || user?.mobileNo} />
              <DetailRow label="Location" value={user?.location?.locationName || user?.locationName} />
              <DetailRow label="Role" value={user?.role?.name} />
              <DetailRow 
                label="Status" 
                isLast={true}
                value={
                  <Typography variant="caption" fontWeight={700} color={user?.isActive ? 'success.main' : 'error.main'}>
                    {user?.isActive ? 'ACTIVE' : 'INACTIVE'}
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
              <DetailRow label="Created On" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} />
              <DetailRow label="Last Updated" value={user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'} isLast={true} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
