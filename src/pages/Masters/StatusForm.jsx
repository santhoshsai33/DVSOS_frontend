import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Grid, Typography } from '@mui/material';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import { toastSuccess, toastError } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import useMasterDataStore from '../../store/useMasterDataStore';

export default function StatusForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { masterStatuses, masterModules, addStatus, updateStatus } = useMasterDataStore();
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      moduleId: '',
      name: '',
      description: '',
      status: 'ACTIVE'
    }
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (isEdit && masterStatuses?.length > 0) {
      const statusToEdit = masterStatuses.find(s => s.id === id);
      if (statusToEdit) {
        reset({
          moduleId: statusToEdit.moduleId || '',
          name: statusToEdit.name,
          description: statusToEdit.description || '',
          status: statusToEdit.status || 'ACTIVE'
        });
      }
    }
  }, [isEdit, id, masterStatuses, reset]);

  const onSubmit = (data) => {
    if (!data.moduleId) {
      toastError('Please select a module');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (isEdit) {
        updateStatus(id, data);
        toastSuccess(`Status "${data.name}" updated successfully.`);
      } else {
        addStatus(data);
        toastSuccess(`Status "${data.name}" added successfully.`);
      }
      navigate(ROUTES.ADMIN_MASTER_STATUSES);
    }, 800);
  };

  const activeModules = masterModules?.filter(m => m.status === 'ACTIVE') || [];
  const moduleOptions = activeModules.map(m => ({ label: m.name, value: m.id }));

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit' : 'Add'} Status
        </Typography>
        <BackButton
          to={ROUTES.ADMIN_MASTER_STATUSES}
          label="Back to Statuses"
        />
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="moduleId"
                label="Module"
                options={moduleOptions}
                placeholder="Select a module"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="name"
                label="Status Name"
                placeholder="e.g. Pending"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="description"
                label="Description"
                placeholder="Status description"
              />
            </Grid>
          </Grid>

          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_MASTER_STATUSES)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={saving}
            >
              {isEdit ? 'Save Changes' : 'Create Status'}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
