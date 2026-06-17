import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Grid, Typography } from '@mui/material';
import RHFTextField from '../../components/form/RHFTextField';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import useMasterDataStore from '../../store/useMasterDataStore';

export default function ServiceCenterForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { masterServiceCenters, addServiceCenter, updateServiceCenter } = useMasterDataStore();
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      gstNumber: '',
      contactNumber: '',
      email: '',
      logoUrl: '',
      websiteUrl: '',
      status: 'ACTIVE'
    }
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (isEdit && masterServiceCenters.length > 0) {
      const centerToEdit = masterServiceCenters.find(sc => sc.id === id);
      if (centerToEdit) {
        reset({
          name: centerToEdit.name || '',
          gstNumber: centerToEdit.gstNumber || '',
          contactNumber: centerToEdit.contactNumber || '',
          email: centerToEdit.email || '',
          logoUrl: centerToEdit.logoUrl || '',
          websiteUrl: centerToEdit.websiteUrl || '',
          status: centerToEdit.status || 'ACTIVE'
        });
      }
    }
  }, [isEdit, id, masterServiceCenters, reset]);

  const onSubmit = (data) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (isEdit) {
        updateServiceCenter(id, data);
        toastSuccess(`Service Center "${data.name}" updated successfully.`);
      } else {
        addServiceCenter(data);
        toastSuccess(`Service Center "${data.name}" added successfully.`);
      }
      navigate(ROUTES.ADMIN_SERVICE_CENTERS);
    }, 800);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit' : 'Add'} Service Center
        </Typography>
        <BackButton
          to={ROUTES.ADMIN_SERVICE_CENTERS}
          label="Back to Service Centers Master"
        />
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="name"
                label="Service Center Name"
                placeholder="e.g. DVSOS Main Branch"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="gstNumber"
                label="GST Number"
                placeholder="e.g. 29ABCDE1234F1Z5"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="contactNumber"
                label="Contact Number"
                placeholder="e.g. +91 9876543210"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="email"
                label="Email Address"
                placeholder="e.g. contact@dvsos.com"
                type="email"
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <RHFTextField
                name="logoUrl"
                label="Logo URL"
                placeholder="e.g. https://example.com/logo.png"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="websiteUrl"
                label="Website URL"
                placeholder="e.g. https://www.dvsos.com"
              />
            </Grid>
          </Grid>

          {/* Footer Actions */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_SERVICE_CENTERS)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={saving}
            >
              {isEdit ? 'Save Changes' : 'Create Service Center'}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
