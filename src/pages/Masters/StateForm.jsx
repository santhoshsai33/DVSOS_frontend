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

export default function StateForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { masterStates, addState, updateState } = useMasterDataStore();
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      status: 'ACTIVE'
    }
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (isEdit && masterStates.length > 0) {
      const stateToEdit = masterStates.find(s => s.id === id);
      if (stateToEdit) {
        reset({
          name: stateToEdit.name,
          status: stateToEdit.status || 'ACTIVE'
        });
      }
    }
  }, [isEdit, id, masterStates, reset]);

  const onSubmit = (data) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (isEdit) {
        updateState(id, data);
        toastSuccess(`State "${data.name}" updated successfully.`);
      } else {
        addState(data);
        toastSuccess(`State "${data.name}" added successfully.`);
      }
      navigate(ROUTES.ADMIN_MASTER_STATES);
    }, 800);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit' : 'Add'} State
        </Typography>
        <BackButton
          to={ROUTES.ADMIN_MASTER_STATES}
          label="Back to States Master"
        />
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="name"
                label="State Name"
                placeholder="e.g. California"
                required
              />
            </Grid>
          </Grid>

          {/* Footer Actions */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_MASTER_STATES)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={saving}
            >
              {isEdit ? 'Save Changes' : 'Create State'}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
