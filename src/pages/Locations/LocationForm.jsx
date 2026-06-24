import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid, Typography, Select } from '@mui/material';
import RHFTextField from '../../components/form/RHFTextField';
import RHFTextarea from '../../components/form/RHFTextarea';
import RHFSelect from '../../components/form/RHFSelect';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import { toastSuccess, toastError } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import { createLocationApi, updateLocationApi, getLocationApi } from '../../api/adminLocationApi';
import { getStatesApi } from '../../api/adminStateApi';
import { getDistrictsApi } from '../../api/adminDistrictApi';
import { getServiceCentersApi } from '../../api/adminServiceCenterApi';

const schema = z.object({
  serviceCenterId: z.number({ required_error: 'Service Center is required', invalid_type_error: 'Service Center is required' }).min(1, 'Service Center is required'),
  stateId: z.number({ required_error: 'State is required', invalid_type_error: 'State is required' }).min(1, 'State is required'),
  districtId: z.number({ required_error: 'District is required', invalid_type_error: 'District is required' }).min(1, 'District is required'),
  name: z.string().trim().min(1, 'Location Name is required'),
  phoneNo: z.string().trim().regex(/^[0-9+\s-]+$/, 'Invalid contact number format').optional().or(z.literal('')),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  pincode: z.string().trim().optional().or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
});

export default function LocationForm() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const locationIdentifier = slug;
  const isEdit = !!locationIdentifier;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  const [serviceCenters, setServiceCenters] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceCenterId: '',
      stateId: '',
      districtId: '',
      name: '',
      address: '',
      pincode: '',
      phoneNo: '',
      email: '',
    }
  });

  const { handleSubmit, reset, control, setValue } = methods;

  const selectedStateId = useWatch({ control, name: 'stateId' });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [scRes, stRes, dsRes] = await Promise.all([
          getServiceCentersApi({ limit: 1000 }),
          getStatesApi({ limit: 1000 }),
          getDistrictsApi({ limit: 1000 })
        ]);

        if (scRes?.success) setServiceCenters(scRes.data.serviceCenters || []);
        if (stRes?.success) setStates(stRes.data.states || []);
        if (dsRes?.success) setDistricts(dsRes.data.districts || []);
      } catch (error) {
        toastError('Failed to load dropdown data');
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (selectedStateId && !isEdit) {
      setValue('districtId', '');
    }
  }, [selectedStateId, setValue, isEdit]);

  useEffect(() => {
    if (isEdit) {
      const fetchDetail = async () => {
        try {
          const res = await getLocationApi(locationIdentifier);
          if (res?.success) {
            const loc = res.data.location || res.data;
            reset({
              serviceCenterId: loc.serviceCenterId || '',
              stateId: loc.stateId || '',
              districtId: loc.districtId || '',
              name: loc.locationName || '',
              address: loc.address || '',
              pincode: loc.pincode || '',
              phoneNo: loc.contactPhone || '',
              email: loc.contactEmail || '',
            });

            if (loc.slug && loc.slug !== locationIdentifier) {
              navigate(ROUTES.ADMIN_LOCATIONS_EDIT.replace(':slug', loc.slug), { replace: true });
            }
          }
        } catch (error) {
          toastError('Failed to fetch location details');
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [isEdit, locationIdentifier, reset, navigate]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        serviceCenterId: data.serviceCenterId,
        stateId: data.stateId,
        districtId: data.districtId,
        locationName: data.name,
        locationType: 'BRANCH',
        address: data.address || undefined,
        pincode: data.pincode || undefined,
        contactPhone: data.phoneNo || undefined,
        contactEmail: data.email || undefined,
      };

      if (isEdit) {
        await updateLocationApi(locationIdentifier, payload);
        toastSuccess(`Location "${data.name}" updated successfully.`);
      } else {
        await createLocationApi(payload);
        toastSuccess(`Location "${data.name}" created successfully.`);
      }
      navigate(ROUTES.ADMIN_LOCATIONS);
    } catch (error) {
      toastError(error?.response?.data?.message || 'Failed to save location');
    } finally {
      setSaving(false);
    }
  };

  const availableDistricts = districts.filter(d => d.stateId === Number(selectedStateId));

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit' : 'Add'} Location
        </Typography>
        <BackButton
          to={ROUTES.ADMIN_LOCATIONS}
          label="Back to Locations"
        />
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <RHFSelect
                  name="serviceCenterId"
                  label="Service Center"
                  options={serviceCenters.map(sc => ({ value: sc.id, label: sc.serviceCenterName }))}
                  placeholder="Select a Service Center"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFSelect
                  name="stateId"
                  label="State"
                  options={states.map(s => ({ value: s.id, label: s.stateName }))}
                  placeholder="Select a State"
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>


              <Grid item xs={12} md={6}>
                <RHFSelect
                  name="districtId"
                  label="District"
                  options={availableDistricts.map(d => ({ value: d.id, label: d.districtName }))}
                  placeholder="Select a District"
                  required
                  disabled={!selectedStateId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="name"
                  label="Location Name"
                  placeholder="e.g. T-Nagar Branch"
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>


              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="phoneNo"
                  label="Phone Number"
                  placeholder="e.g. 9876543210"
                  inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="email"
                  label="Email Address"
                  placeholder="e.g. tnagar@dvsos.com"
                  type="email"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="pincode"
                  label="Pincode"
                  placeholder="e.g. 600017"
                />
              </Grid>
              <Grid item xs={12}>
                <RHFTextarea
                  name="address"
                  label="Full Address"
                  placeholder="Enter complete address..."
                  rows={3}
                />
              </Grid>
            </Grid>

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
      )}
    </Box>
  );
}
