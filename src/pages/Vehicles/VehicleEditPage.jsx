import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Card, Grid, Typography } from '@mui/material';
import { Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import Loader from '../../components/common/Loader';
import { toastSuccess } from '../../notifications/toast';
import { useVehicle } from '../../queries/useDataQueries';
import { FUEL_TYPES, VEHICLE_TYPES } from '../../constants/statuses';
import { ROUTES } from '../../config/routes';

export default function VehicleEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(id);
  const methods = useForm({
    defaultValues: {
      vehicleNumber: '',
      ownerName: '',
      mobile: '',
      makeModel: '',
      type: '',
      fuelType: '',
    },
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  useEffect(() => {
    if (vehicle) {
      reset({
        vehicleNumber: vehicle.vehicleNumber || '',
        ownerName: vehicle.ownerName || '',
        mobile: vehicle.mobile || '',
        makeModel: vehicle.makeModel || '',
        type: vehicle.type || '',
        fuelType: vehicle.fuelType || '',
      });
    }
  }, [reset, vehicle]);

  if (isLoading) return <Loader fullPage text="Loading vehicle..." />;

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toastSuccess('Vehicle details updated successfully.');
    navigate(`${ROUTES.VEHICLES}/${id}`);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Edit Vehicle"
        breadcrumbs={[{ label: 'Vehicles', path: ROUTES.VEHICLES }, { label: 'Edit' }]}
      />

      <Card sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3 }}>Vehicle Information</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <RHFTextField name="vehicleNumber" label="Registration Number" required />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField name="makeModel" label="Make & Model" required />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFSelect name="type" label="Vehicle Type" options={VEHICLE_TYPES} placeholder="Select type" />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFSelect name="fuelType" label="Fuel Type" options={FUEL_TYPES} placeholder="Select fuel" />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 4, mb: 3 }}>Owner Information</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <RHFTextField name="ownerName" label="Owner Name" required />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField name="mobile" label="Mobile Number" required />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 4 }}>
              <Button variant="secondary" onClick={() => navigate(`${ROUTES.VEHICLES}/${id}`)}>Cancel</Button>
              <Button variant="primary" leftIcon={Save} type="submit" isLoading={isSubmitting}>Save Changes</Button>
            </Box>
          </form>
        </FormProvider>
      </Card>
    </Box>
  );
}
