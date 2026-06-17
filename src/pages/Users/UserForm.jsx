import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Grid, Typography, Divider, IconButton } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import Button from '../../components/common/Button';
import { toastSuccess, toastError } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import { ROLE_LABELS, ROLES } from '../../constants/roles';

const ROLE_OPTIONS = Object.entries(ROLE_LABELS)
  .filter(([val]) => val !== ROLES.SUPER_ADMIN)
  .map(([value, label]) => ({ value, label }));

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const MOCK_USER = {
  name: 'Rajan Kumar',
  email: 'rajan@dvsos.com',
  mobile: '9876543210',
  role: ROLES.FLOOR_SUPERVISOR,
  status: 'ACTIVE',
};

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const methods = useForm({
    defaultValues: isEdit
      ? MOCK_USER
      : { name: '', email: '', mobile: '', role: '', status: 'ACTIVE', password: '', confirmPassword: '' },
  });

  const { handleSubmit, formState } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 800));
      toastSuccess(isEdit ? `User "${data.name}" updated!` : `User "${data.name}" created!`);
      navigate(ROUTES.ADMIN_USERS);
    } catch {
      toastError('Failed to save. Please try again.');
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100%', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit User' : 'Add New User'}
        </Typography>
        <Box
          component="button"
          onClick={() => navigate(ROUTES.ADMIN_USERS)}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            bgcolor: 'transparent', border: 'none', cursor: 'pointer',
            color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500, p: 0,
            '&:hover': { color: 'text.primary' }
          }}
        >
          <ArrowLeft size={16} /> Back to List
        </Box>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Section: User Information */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
            User Information
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
              <RHFTextField name="mobile" label="Mobile Number" placeholder="Enter mobile number" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFSelect name="role" label="Role" options={ROLE_OPTIONS} placeholder="Select role" required />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFSelect name="status" label="Account Status" options={STATUS_OPTIONS} />
            </Grid>
          </Grid>

          {/* Password — only on Add */}
          {!isEdit && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
                Security
              </Typography>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="password" label="Temporary Password" type="password" placeholder="Enter temporary password" required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="confirmPassword" label="Confirm Password" type="password" placeholder="Re-enter password" required />
                </Grid>
              </Grid>
            </>
          )}

          {/* Footer Actions */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_USERS)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={formState.isSubmitting}
            >
              {isEdit ? 'Save Changes' : 'Submit'}
            </Button>
          </Box>

        </form>
      </FormProvider>
    </Box>
  );
}
