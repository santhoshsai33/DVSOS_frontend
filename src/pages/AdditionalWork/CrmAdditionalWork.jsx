import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, MessageCircle, ArrowLeft, Plus } from 'lucide-react';
import { Box, Grid, Typography, Card, CardContent, Checkbox, FormControlLabel, Divider, Chip, TextField } from '@mui/material';
import Button from '../../components/common/Button';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import RHFTextarea from '../../components/form/RHFTextarea';
import { toastSuccess, toastError, toastInfo } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import { formatCurrency } from '../../utils/formatters';
import { useState, useMemo, useEffect } from 'react';
import useMasterDataStore from '../../store/useMasterDataStore';
import { useJobCard } from '../../queries/useDataQueries';
import useAuthStore from '../../store/useAuthStore';
import { ROLES } from '../../constants/roles';
import Loader from '../../components/common/Loader';

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export default function CrmAdditionalWork() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobCardId = searchParams.get('jobCardId');
  const { data: jobCard, isLoading: isJobCardLoading } = useJobCard(jobCardId);
  const { masterServices, serviceCategories, companySettings } = useMasterDataStore();
  const [selectedServices, setSelectedServices] = useState([]);
  const [customService, setCustomService] = useState({ name: '', price: '' });

  const { role } = useAuthStore();
  const roleCategoryMap = {
    [ROLES.FLOOR_SUPERVISOR]: 'Mechanical',
    [ROLES.BODY_SHOP_SUPERVISOR]: 'Body Shop',
    [ROLES.WATER_WASH_TEAM]: 'Water Wash',
  };
  const restrictedCategory = roleCategoryMap[role];

  const methods = useForm({
    defaultValues: {
      vehicleNumber: '',
      ownerName: '',
      ownerMobile: '',
      makeModel: '',
      serviceType: '',
      priority: 'NORMAL',
      estimatedCost: '',
      notes: '',
      deliveryDate: '',
      services: [],
    },
  });

  const { handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = methods;

  const selectedCategory = watch('serviceType');

  const filteredServices = useMemo(() => {
    let categoryToFilter = selectedCategory;
    if (restrictedCategory && (!selectedCategory || selectedCategory === 'ALL')) {
      categoryToFilter = restrictedCategory;
    }

    if (!categoryToFilter || categoryToFilter === 'ALL') return masterServices;
    return masterServices.filter(s => s.category?.toLowerCase() === categoryToFilter.toLowerCase());
  }, [masterServices, selectedCategory, restrictedCategory]);

  useEffect(() => {
    if (restrictedCategory) {
      setValue('serviceType', restrictedCategory);
    }
  }, [restrictedCategory, setValue]);

  useEffect(() => {
    if (jobCard) {
      setValue('vehicleNumber', jobCard.vehicleNumber || '');
      setValue('ownerName', jobCard.ownerName || '');
      setValue('ownerMobile', jobCard.ownerMobile || jobCard.mobile || '');
      setValue('makeModel', jobCard.makeModel || '');
      setValue('serviceType', jobCard.serviceType || '');
      setValue('priority', jobCard.priority || 'NORMAL');

      if (jobCard.createdAt) {
        const date = new Date(jobCard.createdAt);
        const formattedDate = date.toISOString().slice(0, 16);
        setValue('deliveryDate', formattedDate);
      }
    }
  }, [jobCard, setValue]);

  const toggleService = (service) => {
    let updated;
    if (selectedServices.find((s) => s.id === service.id)) {
      updated = selectedServices.filter((s) => s.id !== service.id);
    } else {
      updated = [...selectedServices, service];
    }
    setSelectedServices(updated);
    setValue('services', updated.map((s) => s.id));

    const totalCost = updated.reduce((sum, s) => sum + s.price, 0);
    const tax = totalCost * (companySettings.defaultTaxRate / 100);
    setValue('estimatedCost', totalCost + tax);
  };

  const subtotal = useMemo(() => selectedServices.reduce((sum, s) => sum + s.price, 0), [selectedServices]);
  const taxAmount = subtotal * (companySettings.defaultTaxRate / 100);
  const grandTotal = subtotal + taxAmount;

  const handleWhatsAppApproval = async () => {
    if (selectedServices.length === 0) {
      toastError('Please select at least one service');
      return;
    }
    if (!watch('ownerMobile')) {
      toastError('Please enter customer mobile number');
      return;
    }

    try {
      toastInfo('Generating WhatsApp approval link...');
      await new Promise((r) => setTimeout(r, 1000));
      const serviceNames = selectedServices.map(s => s.name).join(', ');
      const message = `Hello ${watch('ownerName') || 'Customer'}, your additional service estimate is ready.\n\nServices: ${serviceNames}\nGrand Total: ${formatCurrency(grandTotal)}.\n\nPlease reply YES to approve.`;
      window.open(`https://wa.me/91${watch('ownerMobile')}?text=${encodeURIComponent(message)}`, '_blank');
      toastSuccess('Estimate sent via WhatsApp successfully!');
    } catch (err) {
      toastError('Failed to send WhatsApp message');
    }
  };

  const onSubmit = async (data) => {
    if (selectedServices.length === 0) {
      toastError('Please select at least one additional service');
      return;
    }
    try {
      await new Promise((r) => setTimeout(r, 800));
      toastSuccess('Additional work request created and saved successfully!');
      navigate(ROUTES.JOB_CARDS);
    } catch {
      toastError('Failed to create additional work request.');
    }
  };

  const CATEGORY_OPTS = useMemo(() => {
    let categories = serviceCategories;
    if (restrictedCategory) {
      categories = serviceCategories.filter(c => c.name === restrictedCategory);
    }

    if (restrictedCategory) {
      return categories.map(c => ({ value: c.name, label: c.name }));
    }

    return [
      { value: 'ALL', label: 'All Categories' },
      ...categories.map(c => ({ value: c.name, label: c.name }))
    ];
  }, [serviceCategories, restrictedCategory]);

  if (isJobCardLoading) {
    return <Loader fullPage text="Loading job card details..." />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%', p: { xs: 2, md: 4 } }}>

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          Create Additional Work Request {jobCardId ? `(#${jobCardId})` : ''}
        </Typography>
        <Box
          component="button"
          onClick={() => navigate(ROUTES.JOB_CARDS)}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            bgcolor: 'transparent', border: 'none', cursor: 'pointer',
            color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500, p: 0,
            '&:hover': { color: 'text.primary' }
          }}
        >
          <ArrowLeft size={16} /> Back to List
        </Box>
      </Box>

      <FormProvider {...methods}>
        <form id="additionalWorkForm" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {/* LEFT COLUMN: FORM */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ borderRadius: 3, boxShadow: 1, p: 3, mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
                  Vehicle & Customer Details
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Registration Number</Typography>
                    <Typography variant="body1" fontWeight={600}>{jobCard?.vehicleNumber || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Make & Model</Typography>
                    <Typography variant="body1" fontWeight={600}>{jobCard?.makeModel || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Owner Name</Typography>
                    <Typography variant="body1" fontWeight={600}>{jobCard?.ownerName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Mobile Number</Typography>
                    <Typography variant="body1" fontWeight={600}>{jobCard?.ownerMobile || jobCard?.mobile || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Card>

              <Card sx={{ borderRadius: 3, boxShadow: 1, p: 3, mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
                  Service Configuration & Master List
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={4}>
                    <RHFSelect name="serviceType" label="Primary Category" options={CATEGORY_OPTS} placeholder="Select category" required />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RHFSelect name="priority" label="Priority" options={PRIORITY_OPTIONS} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RHFTextField name="deliveryDate" label="Expected Delivery" type="datetime-local" required />
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Available Additional Services
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                  {filteredServices.map((service) => {
                    const isSelected = selectedServices.some((s) => s.id === service.id);
                    return (
                      <Box
                        key={service.id}
                        onClick={() => toggleService(service)}
                        sx={{
                          p: 2, borderRadius: 2, border: '1px solid',
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          bgcolor: isSelected ? 'primary.light' : 'background.paper',
                          cursor: 'pointer', transition: 'all 0.2s',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                      >
                        <FormControlLabel
                          control={<Checkbox checked={isSelected} onChange={() => { }} sx={{ p: 0.5 }} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight={600}>{service.name}</Typography>
                              <Chip
                                label={service.category}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.65rem',
                                  bgcolor: isSelected ? 'rgba(255,255,255,0.4)' : 'action.selected',
                                  color: isSelected ? '#000' : 'text.primary',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                          }
                          sx={{ m: 0 }}
                        />
                        <Typography variant="body2" fontWeight={700}>{formatCurrency(service.price)}</Typography>
                      </Box>
                    );
                  })}
                </Box>

              </Card>

              <Card sx={{ borderRadius: 3, boxShadow: 1, p: 3, mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
                  Add Custom Service
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <TextField
                      label="Service Name"
                      fullWidth
                      size="small"
                      value={customService.name}
                      onChange={(e) => setCustomService({ ...customService, name: e.target.value })}
                      placeholder="e.g. Special Engine Polish"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Estimated Price"
                      type="number"
                      fullWidth
                      size="small"
                      value={customService.price}
                      onChange={(e) => setCustomService({ ...customService, price: e.target.value })}
                      placeholder="e.g. 1500"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      type="button"
                      variant="secondary"
                      fullWidth
                      leftIcon={Plus}
                      onClick={() => {
                        if (!customService.name || !customService.price) {
                          toastError("Please enter service name and price");
                          return;
                        }
                        const newService = {
                          id: `custom_${Date.now()}`,
                          name: customService.name,
                          price: Number(customService.price),
                          category: 'Custom'
                        };

                        const updated = [...selectedServices, newService];
                        setSelectedServices(updated);
                        setValue('services', updated.map(s => s.id));

                        const totalCost = updated.reduce((sum, s) => sum + s.price, 0);
                        const tax = totalCost * (companySettings.defaultTaxRate / 100);
                        setValue('estimatedCost', totalCost + tax);

                        toastSuccess("Custom service added to list!");
                        setCustomService({ name: '', price: '' });
                      }}
                    >
                      Add Service
                    </Button>
                  </Grid>
                </Grid>
              </Card>

              <Card sx={{ borderRadius: 3, boxShadow: 1, p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
                  Additional Details
                </Typography>
                <RHFTextarea name="notes" label="Additional Work Notes" rows={3} placeholder="Explain details of the extra work request..." />
              </Card>
            </Grid>

            {/* RIGHT COLUMN: BILL PREVIEW */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 1, position: 'sticky', top: 80 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
                    <Typography variant="h6" fontWeight={700}>Additional Bill</Typography>
                    <Typography variant="caption" sx={{ bgcolor: 'success.light', color: 'success.main', px: 1, py: 0.5, borderRadius: 8, fontWeight: 600 }}>Auto-calculated</Typography>
                  </Box>

                  <Box sx={{ minHeight: 150, maxHeight: 300, overflowY: 'auto', mb: 3 }}>
                    {selectedServices.length === 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                        <Typography color="text.secondary" variant="body2" fontStyle="italic">No additional services selected</Typography>
                      </Box>
                    ) : (
                      selectedServices.map((item) => (
                        <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="body2" fontWeight={500}>{item.name} <Typography component="span" variant="caption" color="text.secondary">x1</Typography></Typography>
                          <Typography variant="body2" fontWeight={600}>{formatCurrency(item.price)}</Typography>
                        </Box>
                      ))
                    )}
                  </Box>

                  <Box sx={{ bgcolor: 'background.default', borderRadius: 2, p: 2, display: 'flex', flexDirection: 'column', gap: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                      <Typography variant="body2" fontWeight={500}>{formatCurrency(subtotal)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Tax ({companySettings.defaultTaxRate}%)</Typography>
                      <Typography variant="body2" fontWeight={500}>{formatCurrency(taxAmount)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" fontWeight={700} color="primary.main">Grand Total</Typography>
                      <Typography variant="subtitle1" fontWeight={700} color="primary.main">{formatCurrency(grandTotal)}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
                    <Button
                      variant="outline"
                      fullWidth
                      leftIcon={MessageCircle}
                      onClick={handleWhatsAppApproval}
                      style={{ borderColor: '#25D366', color: '#25D366' }}
                    >
                      Send via WhatsApp
                    </Button>
                    <Button
                      variant="primary"
                      fullWidth
                      leftIcon={Save}
                      form="additionalWorkForm"
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      Create Additional Work
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Box>
  );
}
