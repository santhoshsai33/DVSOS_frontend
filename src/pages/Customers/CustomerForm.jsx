import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Grid, Typography } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import RHFTextField from '../../components/form/RHFTextField';
import RHFTextarea from '../../components/form/RHFTextarea';
import RHFSelect from '../../components/form/RHFSelect';
import Button from '../../components/common/Button';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export default function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      address: '',
      status: 'ACTIVE'
    }
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (isEdit) {
      try {
        const saved = JSON.parse(localStorage.getItem('dvsos_customers') || '[]');
        const customer = saved.find(c => String(c.id) === String(id));
        if (customer) {
          reset({
            name: customer.name,
            email: customer.email,
            mobile: customer.mobile,
            address: customer.address || '',
            status: customer.status || 'ACTIVE'
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isEdit, id, reset]);

  const onSubmit = (data) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      try {
        const saved = JSON.parse(localStorage.getItem('dvsos_customers') || '[]');
        if (isEdit) {
          const updated = saved.map(c => String(c.id) === String(id) ? { ...c, ...data } : c);
          localStorage.setItem('dvsos_customers', JSON.stringify(updated));
          toastSuccess(`Customer "${data.name}" updated successfully.`);
        } else {
          const newCustomer = {
            id: `CUST${Date.now()}`,
            ...data,
            visits: 0
          };
          saved.unshift(newCustomer);
          localStorage.setItem('dvsos_customers', JSON.stringify(saved));
          toastSuccess(`Customer "${data.name}" added successfully.`);
        }
      } catch (e) {
        console.error(e);
      }
      navigate(ROUTES.CUSTOMERS);
    }, 800);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100%', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit Customer' : 'Add New Customer'}
        </Typography>
        <Box
          component="button"
          onClick={() => navigate(ROUTES.CUSTOMERS)}
          className="back-btn"
        >
          <ArrowLeft size={16} /> Back to List
        </Box>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Section: Customer Information */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Customer Information
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="name" label="Customer Full Name" placeholder="Enter full name" required />
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
              <RHFSelect name="status" label="Status" options={STATUS_OPTIONS} />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <RHFTextarea name="address" label="Billing Address" placeholder="Enter address details" rows={3} />
            </Grid>
          </Grid>

          {/* Footer Actions */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.CUSTOMERS)}
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
    </Box>
  );
}
