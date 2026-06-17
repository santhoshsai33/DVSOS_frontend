import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { Box, Grid, Typography, Select } from '@mui/material';
import RHFTextField from '../../components/form/RHFTextField';
import RHFTextarea from '../../components/form/RHFTextarea';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import useMasterDataStore from '../../store/useMasterDataStore';
import { useUsers } from '../../queries/useDataQueries';

export default function LocationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const { masterStates, masterDistricts, masterServiceCenters, locations, addLocation, updateLocation } = useMasterDataStore();
  const { data: usersData } = useUsers();
  const mdUsers = usersData?.data?.filter(user => user.role === 'MD') || [];

  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      serviceCenterId: '',
      stateId: '',
      district: '',
      mdId: '',
      name: '',
      address: '',
      pincode: '',
      phoneNo: '',
      email: '',
      status: 'ACTIVE'
    }
  });

  const { handleSubmit, reset, control } = methods;

  // Watch state to filter districts
  const selectedStateId = useWatch({ control, name: 'stateId' });
  const availableDistricts = masterDistricts.filter(d => d.stateId === selectedStateId);

  // Clear district if state changes
  useEffect(() => {
    if (selectedStateId && !isEdit) {
      methods.setValue('district', '');
    }
  }, [selectedStateId, methods, isEdit]);

  useEffect(() => {
    if (isEdit && locations.length > 0) {
      const locationToEdit = locations.find(loc => loc.id === id);
      if (locationToEdit) {
        reset({
          serviceCenterId: locationToEdit.serviceCenterId || '',
          stateId: locationToEdit.stateId || '',
          district: locationToEdit.district || '',
          mdId: locationToEdit.mdId || '',
          name: locationToEdit.name || '',
          address: locationToEdit.address || '',
          pincode: locationToEdit.pincode || '',
          phoneNo: locationToEdit.phoneNo || '',
          email: locationToEdit.email || '',
          status: locationToEdit.status || 'ACTIVE'
        });
      }
    }
  }, [isEdit, id, locations, reset]);

  const onSubmit = (data) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (isEdit) {
        updateLocation(id, data);
        toastSuccess(`Location "${data.name}" updated successfully.`);
      } else {
        addLocation(data);
        toastSuccess(`Location "${data.name}" added successfully.`);
      }
      navigate(ROUTES.ADMIN_LOCATIONS);
    }, 800);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit' : 'Add'} Location
        </Typography>
        <BackButton 
          to={ROUTES.ADMIN_LOCATIONS} 
          label="Back to Locations" 
        />
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* First Row: Service Center & MD */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                Service Center <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <Select
                native
                fullWidth
                {...methods.register('serviceCenterId')}
                sx={{ borderRadius: 2 }}
                required
              >
                <option value="" disabled>Select a Service Center</option>
                {masterServiceCenters.map(sc => (
                  <option key={sc.id} value={sc.id}>{sc.name}</option>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                Managing Director <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <Select
                native
                fullWidth
                {...methods.register('mdId')}
                sx={{ borderRadius: 2 }}
                required
              >
                <option value="" disabled>Select Managing Director</option>
                {mdUsers.map(md => (
                  <option key={md.id} value={md.id}>{md.name}</option>
                ))}
              </Select>
            </Grid>
          </Grid>

          {/* Second Row: State & District */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                State <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <Select
                native
                fullWidth
                {...methods.register('stateId')}
                sx={{ borderRadius: 2 }}
                required
              >
                <option value="" disabled>Select a State</option>
                {masterStates.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                District <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <Select
                native
                fullWidth
                {...methods.register('district')}
                sx={{ borderRadius: 2 }}
                required
                disabled={!selectedStateId}
              >
                <option value="" disabled>Select a District</option>
                {availableDistricts.map(district => (
                  <option key={district.id} value={district.name}>{district.name}</option>
                ))}
              </Select>
            </Grid>
          </Grid>

          {/* Third Row: Location Name & Phone */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="name"
                label="Location Name"
                placeholder="e.g. T-Nagar Branch"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="phoneNo"
                label="Phone Number"
                placeholder="e.g. +91 9876543210"
              />
            </Grid>
          </Grid>

          {/* Fourth Row: Email & Pincode */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="email"
                label="Email Address"
                placeholder="e.g. tnagar@dvsos.com"
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="pincode"
                label="Pincode"
                placeholder="e.g. 600017"
              />
            </Grid>
          </Grid>

          {/* Fifth Row: Address */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <RHFTextarea
                name="address"
                label="Full Address"
                placeholder="Enter complete address..."
                rows={3}
              />
            </Grid>
          </Grid>

          {/* Footer Actions */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_LOCATIONS)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={saving}
            >
              {isEdit ? 'Save Changes' : 'Create Location'}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
