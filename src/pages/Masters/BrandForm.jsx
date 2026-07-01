import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Grid, Typography } from '@mui/material';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RHFTextField from '../../components/form/RHFTextField';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import { toastSuccess, toastError } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';

const schema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Brand name is required')
});

const DEFAULT_BRANDS = [
  { id: 'b-1', name: 'Hyundai', country: 'South Korea', slug: 'hyundai', isActive: true },
  { id: 'b-2', name: 'Maruti Suzuki', country: 'India', slug: 'maruti-suzuki', isActive: true },
  { id: 'b-3', name: 'Honda', country: 'Japan', slug: 'honda', isActive: true },
  { id: 'b-4', name: 'Toyota', country: 'Japan', slug: 'toyota', isActive: true },
  { id: 'b-5', name: 'Mahindra', country: 'India', slug: 'mahindra', isActive: true },
  { id: 'b-6', name: 'Tata', country: 'India', slug: 'tata', isActive: true },
];

export default function BrandForm() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const brandIdentifier = slug;
  const isEdit = !!brandIdentifier;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: ''
    }
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      const stored = localStorage.getItem('mock_brands');
      const brands = stored ? JSON.parse(stored) : DEFAULT_BRANDS;
      const brand = brands.find(b => b.slug === brandIdentifier || b.id === brandIdentifier);

      if (brand) {
        reset({
          name: brand.name
        });
      } else {
        toastError('Brand not found');
        navigate(ROUTES.ADMIN_MASTER_BRANDS);
      }
      setLoading(false);
    }
  }, [isEdit, brandIdentifier, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const stored = localStorage.getItem('mock_brands');
      const brands = stored ? JSON.parse(stored) : [...DEFAULT_BRANDS];

      if (isEdit) {
        const updated = brands.map(b => {
          if (b.slug === brandIdentifier || b.id === brandIdentifier) {
            const updatedSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            return {
              ...b,
              name: data.name,
              slug: updatedSlug
            };
          }
          return b;
        });
        localStorage.setItem('mock_brands', JSON.stringify(updated));
        toastSuccess(`Brand "${data.name}" updated successfully.`);
      } else {
        const newSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const newBrand = {
          id: `b-${Date.now()}`,
          name: data.name,
          slug: newSlug,
          isActive: true
        };
        brands.push(newBrand);
        localStorage.setItem('mock_brands', JSON.stringify(brands));
        toastSuccess(`Brand "${data.name}" added successfully.`);
      }
      navigate(ROUTES.ADMIN_MASTER_BRANDS);
    } catch (error) {
      toastError('Failed to save brand');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit' : 'Add'} Brand
        </Typography>
        <BackButton
          to={ROUTES.ADMIN_MASTER_BRANDS}
          label="Back to Brand Master"
        />
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="name"
                  label="Brand Name"
                  placeholder="e.g. Hyundai"
                  required
                />
              </Grid>
            </Grid>

            {/* Footer Actions */}
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate(ROUTES.ADMIN_MASTER_BRANDS)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={saving}
              >
                {isEdit ? 'Save Changes' : 'Create Brand'}
              </Button>
            </Box>
          </form>
        </FormProvider>
      )}
    </Box>
  );
}
