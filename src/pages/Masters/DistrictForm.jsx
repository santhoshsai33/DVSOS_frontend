import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Grid, Typography, Select } from '@mui/material';
import RHFTextField from '../../components/form/RHFTextField';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import useMasterDataStore from '../../store/useMasterDataStore';



export default function DistrictForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { masterStates, masterDistricts, addDistrict, updateDistrict } = useMasterDataStore();
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      stateId: '',
      status: 'ACTIVE'
    }
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (isEdit && masterDistricts.length > 0) {
      const districtToEdit = masterDistricts.find(d => d.id === id);
      if (districtToEdit) {
        reset({
          name: districtToEdit.name,
          stateId: districtToEdit.stateId,
          status: districtToEdit.status || 'ACTIVE'
        });
      }
    }
  }, [isEdit, id, masterDistricts, reset]);

  const onSubmit = (data) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (isEdit) {
        updateDistrict(id, data);
        toastSuccess(`District "${data.name}" updated successfully.`);
      } else {
        addDistrict(data);
        toastSuccess(`District "${data.name}" added successfully.`);
      }
      navigate(ROUTES.ADMIN_MASTER_DISTRICTS);
    }, 800);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit' : 'Add'} District
        </Typography>
        <BackButton
          to={ROUTES.ADMIN_MASTER_DISTRICTS}
          label="Back to Districts Master"
        />
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

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
              <RHFTextField
                name="name"
                label="District Name"
                placeholder="e.g. Chennai"
                required
              />
            </Grid>
          </Grid>



          {/* Footer Actions */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_MASTER_DISTRICTS)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={saving}
            >
              {isEdit ? 'Save Changes' : 'Create District'}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
