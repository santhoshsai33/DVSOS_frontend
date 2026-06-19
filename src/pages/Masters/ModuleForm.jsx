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

export default function ModuleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { masterModules, addModule, updateModule } = useMasterDataStore();
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      description: '',
      status: 'ACTIVE'
    }
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (isEdit && masterModules?.length > 0) {
      const moduleToEdit = masterModules.find(m => m.id === id);
      if (moduleToEdit) {
        reset({
          name: moduleToEdit.name,
          description: moduleToEdit.description || '',
          status: moduleToEdit.status || 'ACTIVE'
        });
      }
    }
  }, [isEdit, id, masterModules, reset]);

  const onSubmit = (data) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (isEdit) {
        updateModule(id, data);
        toastSuccess(`Module "${data.name}" updated successfully.`);
      } else {
        addModule(data);
        toastSuccess(`Module "${data.name}" added successfully.`);
      }
      navigate(ROUTES.ADMIN_MODULES);
    }, 800);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit' : 'Add'} Module
        </Typography>
        <BackButton
          to={ROUTES.ADMIN_MODULES}
          label="Back to Modules"
        />
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="name"
                label="Module Name"
                placeholder="e.g. Sales"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="description"
                label="Description"
                placeholder="Module description"
              />
            </Grid>
          </Grid>

          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_MODULES)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={saving}
            >
              {isEdit ? 'Save Changes' : 'Create Module'}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
