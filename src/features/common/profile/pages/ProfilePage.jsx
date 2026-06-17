import { useForm, FormProvider } from 'react-hook-form';
import { Box, Grid, Typography, Avatar } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RHFTextField from '../../../../components/form/RHFTextField';
import Button from '../../../../components/common/Button';
import useAuthStore from '../../../../store/useAuthStore';
import { toastSuccess } from '../../../../notifications/toast';
import { ROLE_LABELS } from '../../../../constants/roles';
import { getInitials, avatarColor } from '../../../../utils/helpers';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, role, setUser } = useAuthStore();

  const methods = useForm({
    defaultValues: {
      name: user?.name || 'User',
      email: user?.email || 'user@dvsos.com',
      phone: user?.phone || '+91 98765 43210',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 800)); // Simulate API call
      setUser({ ...user, ...data });
      toastSuccess('Profile updated successfully!');
    } catch {
      toastSuccess('Failed to update profile.');
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, minHeight: '100%', borderRadius: 3, m: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          Profile & Settings
        </Typography>
        <Box
          component="button"
          onClick={() => navigate(-1)}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            bgcolor: 'transparent', border: 'none', cursor: 'pointer',
            color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500, p: 0,
            '&:hover': { color: 'text.primary' }
          }}
        >
          <ArrowLeft size={16} /> Back
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Avatar
          sx={{
            width: 80, height: 80, bgcolor: avatarColor(user?.name),
            fontSize: '24px', fontWeight: 'bold'
          }}
        >
          {getInitials(user?.name || 'U')}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>{user?.name || 'User'}</Typography>
          <Typography variant="body2" color="text.secondary">{ROLE_LABELS[role] || role}</Typography>
        </Box>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Personal Information
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="name" label="Full Name" placeholder="Enter full name" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="email" label="Email Address" type="email" placeholder="Enter email address" required />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="phone" label="Phone Number" placeholder="Enter phone number" required />
            </Grid>
          </Grid>

          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="secondary" type="button" onClick={() => methods.reset()}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
