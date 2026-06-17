import { useForm, FormProvider } from 'react-hook-form';
import { Box, Grid, Typography } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RHFTextField from '../../../../components/form/RHFTextField';
import Button from '../../../../components/common/Button';
import { toastSuccess, toastError } from '../../../../notifications/toast';

export default function SettingsPage() {
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit, formState: { isSubmitting }, reset } = methods;

  const onSubmit = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toastError('New passwords do not match');
        return;
      }
      await new Promise((r) => setTimeout(r, 800)); // Simulate API call
      toastSuccess('Password changed successfully!');
      reset();
    } catch {
      toastError('Failed to change password.');
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          Change Password
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

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Security Settings
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="currentPassword" label="Current Password" type="password" placeholder="Enter current password" required />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="newPassword" label="New Password" type="password" placeholder="Enter new password" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="confirmPassword" label="Confirm New Password" type="password" placeholder="Re-enter new password" required />
            </Grid>
          </Grid>

          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="secondary" type="button" onClick={() => reset()}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Update Password
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
