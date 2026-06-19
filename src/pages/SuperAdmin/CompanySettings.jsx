import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, IconButton, Divider } from '@mui/material';
import RHFTextField from '../../components/form/RHFTextField';
import Button from '../../components/common/Button';
import { toastSuccess } from '../../notifications/toast';
import useMasterDataStore from '../../store/useMasterDataStore';
import { ROUTES } from '../../config/routes';

export default function CompanySettings() {
  const navigate = useNavigate();
  const { companySettings, updateCompanySettings } = useMasterDataStore();

  const methods = useForm({
    defaultValues: {
      companyName: companySettings.companyName || '',
      address: companySettings.address || '',
      phone: companySettings.phone || '',
      email: companySettings.email || '',
      gstNumber: companySettings.gstNumber || '',
      defaultTaxRate: companySettings.defaultTaxRate || 18,
      intervals: companySettings.intervals || [{ type: '', time: '' }],
    },
  });

  const { handleSubmit, formState, control } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'intervals',
  });

  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 600)); // Simulating API call
      updateCompanySettings(data);
      toastSuccess('Company settings updated successfully!');
      navigate(ROUTES.MD_DASHBOARD);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100%', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          Company Settings
        </Typography>
        {/* <Box
          component="button"
          onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            bgcolor: 'transparent', border: 'none', cursor: 'pointer',
            color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500, p: 0,
            '&:hover': { color: 'text.primary' }
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Box> */}
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="companyName" label="Company Name" placeholder="e.g. DVSOS Auto Services" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="address" label="Registered Address" placeholder="Full address" required />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="phone" label="Contact Phone" placeholder="e.g. +91 98765 43210" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="email" label="Contact Email" type="email" placeholder="e.g. info@company.com" required />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="gstNumber" label="GST Number" placeholder="Enter GSTIN" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="defaultTaxRate" label="Default Tax Rate (%)" type="number" required />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Stage Alert Intervals
            </Typography>
          </Box>

          {fields.map((field, index) => {
            const isLast = index === fields.length - 1;
            return (
              <Grid container spacing={3} sx={{ mb: 3, alignItems: 'center' }} key={field.id}>
                <Grid item xs={12} md={5}>
                  <RHFTextField
                    name={`intervals.${index}.type`}
                    placeholder="Interval Type (e.g. Break, Service)"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <RHFTextField
                    name={`intervals.${index}.time`}
                    type="number"
                    placeholder="Time in Mins (e.g. 15)"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={2} sx={{ display: 'flex', gap: 1, pt: '2px !important' }}>
                  {isLast && (
                    <IconButton
                      onClick={() => append({ type: '', time: '' })}
                      sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, width: 38, height: 38, borderRadius: '4px' }}
                    >
                      <Plus size={18} strokeWidth={3} />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    sx={{ border: '1px solid', borderColor: 'error.main', color: 'error.main', width: 38, height: 38, borderRadius: '4px' }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Grid>
              </Grid>
            );
          })}

          {/* Footer Actions */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.MD_DASHBOARD)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={formState.isSubmitting}
            >
              Submit
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
