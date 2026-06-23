import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid, Typography, Divider, IconButton } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import RHFSwitch from '../../components/form/RHFSwitch';
import Button from '../../components/common/Button';
import { toastSuccess, toastError } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import { createUserApi, updateUserApi, getUserApi } from '../../api/userApi';
import { getRolesApi } from '../../api/roleApi';

const schema = z.object({
  fullName: z.string().trim().min(1, 'Full Name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email format'),
  mobile: z.string().trim().regex(/^\+?[0-9]{10,15}$/, 'Invalid mobile number format').optional().or(z.literal('')),
  roleId: z.number().min(1, 'Role is required'),
  password: z.string().optional(),
  status: z.string().optional()
});

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [roles, setRoles] = useState([]);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      roleId: '',
      password: '',
      status: 'ACTIVE',
    },
  });

  const { handleSubmit, reset, formState } = methods;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getRolesApi({ limit: 100 });
        if (res?.success) {
          const fetchedRoles = res.data.roles || [];
          setRoles(fetchedRoles.map(r => ({ value: r.id, label: r.name })));
        }
      } catch (error) {
        toastError('Failed to fetch roles');
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchUser = async () => {
        try {
          const res = await getUserApi(id);
          if (res?.success) {
            const user = res.data.user || res.data;
            reset({
              fullName: user.fullName || '',
              email: user.email || user.emailId || '',
              mobile: user.mobile || user.mobileNo || '',
              roleId: user.role?.id || user.roleId || '',
              status: user.isActive ? 'ACTIVE' : 'INACTIVE',
            });
          }
        } catch (error) {
          toastError('Failed to fetch user details');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile || undefined,
        roleId: data.roleId,
        password: isEdit ? undefined : (data.password || undefined),
        isActive: data.status === 'ACTIVE'
      };

      if (isEdit) {
        await updateUserApi(id, payload);
        toastSuccess(`User "${data.fullName}" updated!`);
      } else {
        await createUserApi(payload);
        toastSuccess(`User "${data.fullName}" created!`);
      }
      navigate(ROUTES.ADMIN_USERS);
    } catch (error) {
      toastError(error?.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit User' : 'Add New User'}
        </Typography>
        <Box
          component="button"
          onClick={() => navigate(ROUTES.ADMIN_USERS)}
          className="back-btn"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, background: 'none', border: 'none', cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
        >
          <ArrowLeft size={16} /> Back to List
        </Box>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
              User Information
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <RHFTextField name="fullName" label="Full Name" placeholder="Enter full name" required />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField name="email" label="Email Address" type="email" placeholder="Enter email address" required />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <RHFTextField 
                  name="mobile" 
                  label="Mobile Number" 
                  placeholder="Enter 10-digit mobile number" 
                  inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFSelect name="roleId" label="Role" options={roles} placeholder="Select role" required />
              </Grid>
            </Grid>

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
                isLoading={saving}
              >
                {isEdit ? 'Save Changes' : 'Submit'}
              </Button>
            </Box>
          </form>
        </FormProvider>
      )}
    </Box>
  );
}
