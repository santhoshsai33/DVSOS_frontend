import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Grid, Typography } from '@mui/material';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import useMasterDataStore from '../../store/useMasterDataStore';

export default function ServiceItemForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { masterServices, serviceCategories, addService, updateService } = useMasterDataStore();
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      estimatedMinutes: 0
    }
  });

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (serviceCategories.length > 0) {
      setValue('category', serviceCategories[0].name);
    }
  }, [serviceCategories, setValue]);

  useEffect(() => {
    if (isEdit && masterServices.length > 0) {
      const item = masterServices.find(s => s.id === id);
      if (item) {
        reset({
          name: item.name,
          category: item.category || '',
          price: item.price || 0,
          estimatedMinutes: item.estimatedMinutes || 0
        });
      }
    }
  }, [isEdit, id, masterServices, reset]);

  const onSubmit = (data) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const formattedData = {
        ...data,
        price: parseFloat(data.price) || 0,
        estimatedMinutes: parseInt(data.estimatedMinutes, 10) || 0
      };
      if (isEdit) {
        updateService(id, formattedData);
        toastSuccess(`Service Item "${data.name}" updated successfully.`);
      } else {
        addService(formattedData);
        toastSuccess(`Service Item "${data.name}" created successfully.`);
      }
      navigate(ROUTES.ADMIN_MASTER_ITEMS);
    }, 800);
  };

  const categoryOptions = serviceCategories.map(cat => ({
    value: cat.name,
    label: cat.name
  }));

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit' : 'Add'} Service Item
        </Typography>
        <BackButton
          to={ROUTES.ADMIN_MASTER_ITEMS}
          label="Back to Service Items"
        />
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="category"
                label="Category Group"
                placeholder="Select Category Group"
                options={categoryOptions}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="name"
                label="Service Item Name"
                placeholder="e.g. Wheel Alignment"
                required
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="price"
                type="number"
                label="Base Price (₹)"
                placeholder="e.g. 1500"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="estimatedMinutes"
                type="number"
                label="Estimated Duration (Mins)"
                placeholder="e.g. 45"
                required
              />
            </Grid>
          </Grid>

          {/* Footer Actions */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_MASTER_ITEMS)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={saving}
            >
              {isEdit ? 'Save Changes' : 'Create Service Item'}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
