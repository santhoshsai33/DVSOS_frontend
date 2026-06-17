import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Divider } from '@mui/material';
import { ArrowLeft, Upload } from 'lucide-react';
import { FUEL_TYPES, VEHICLE_TYPES } from '../../constants/statuses';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import RHFTextarea from '../../components/form/RHFTextarea';
import { toastSuccess, toastError } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';

export default function GateEntryForm({ onCancel, onSuccess }) {
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      vehicleNumber: '',
      ownerName: '',
      ownerMobile: '',
      makeModel: '',
      vehicleType: '',
      fuelType: '',
      notes: '',
      kmReading: '',
      ownerEmail: '',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 800));
      console.log('Gate Entry:', data);
      toastSuccess(`Vehicle ${data.vehicleNumber} registered successfully!`);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(ROUTES.GATE_DASHBOARD);
      }
    } catch {
      toastError('Failed to register vehicle. Please try again.');
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          New Vehicle Entry
        </Typography>
        <BackButton
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              navigate(ROUTES.GATE_DASHBOARD);
            }
          }}
          label="Back to List"
        />
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Vehicle Information */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
            Vehicle Information
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="vehicleNumber" label="Vehicle Number" placeholder="TN 01 AB 1234" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="makeModel" label="Make & Model" placeholder="e.g. Hyundai i20" required />
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="kmReading" label="KM Reading" type="number" placeholder="Enter odometer reading" />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFSelect name="vehicleType" label="Vehicle Type" options={VEHICLE_TYPES} placeholder="Select type" />
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <RHFSelect name="fuelType" label="Fuel Type" options={FUEL_TYPES} placeholder="Select fuel type" />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Owner Information */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
            Owner Information
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="ownerName" label="Owner Name" placeholder="Full name" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="ownerMobile" label="Mobile Number" placeholder="10-digit mobile" required />
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="ownerEmail" label="Email (Optional)" type="email" placeholder="owner@email.com" />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Vehicle Images */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
            Vehicle Images
          </Typography>
          <Box sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 3, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.default' }}>
            <Upload size={32} className="text-muted mb-3" />
            <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>Drag & drop vehicle images or <span className="text-teal cursor-pointer">browse</span></Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 3 }}>Supports JPG, PNG up to 10MB each</Typography>
            <Button variant="secondary" size="sm" leftIcon={Upload} type="button">
              Upload Images
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Notes */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
            Additional Notes
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <RHFTextarea name="notes" label="Notes / Observations" rows={3} placeholder="Enter any special notes or customer complaints..." />
            </Grid>
          </Grid>

          {/* Footer Actions */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                if (onCancel) {
                  onCancel();
                } else {
                  navigate(ROUTES.GATE_DASHBOARD);
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </Box>

        </form>
      </FormProvider>
    </Box>
  );
}
