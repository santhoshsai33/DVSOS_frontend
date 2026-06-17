import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, Typography, Divider, Card, CardContent, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { Save, Search, MessageCircle, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import RHFTextarea from '../../components/form/RHFTextarea';
import { toastSuccess, toastError, toastInfo } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import { formatCurrency } from '../../utils/formatters';
import { useState, useMemo, useEffect } from 'react';
import useMasterDataStore from '../../store/useMasterDataStore';
import { useJobCard } from '../../queries/useDataQueries';

import Loader from '../../components/common/Loader';

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export default function JobCardCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { data: jobCard, isLoading: isJobCardLoading } = useJobCard(id);
  const { masterServices, serviceCategories, companySettings } = useMasterDataStore();
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const methods = useForm({
    defaultValues: {
      vehicleId: '',
      vehicleNumber: '',
      ownerName: '',
      ownerMobile: '',
      makeModel: '',
      serviceType: '',
      priority: 'NORMAL',
      estimatedCost: '',
      technician: '',
      notes: '',
      deliveryDate: '',
      services: [],
    },
  });

  const { handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = methods;

  const selectedCategory = watch('serviceType');

  const filteredServices = useMemo(() => {
    if (!selectedCategory) return masterServices;
    return masterServices.filter(s => s.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [masterServices, selectedCategory]);

  useEffect(() => {
    if (isEditMode && jobCard) {
      setValue('vehicleNumber', jobCard.vehicleNumber || '');
      setValue('ownerName', jobCard.ownerName || '');
      setValue('ownerMobile', jobCard.ownerMobile || jobCard.mobile || '');
      setValue('makeModel', jobCard.makeModel || '');
      setValue('serviceType', jobCard.serviceType || '');
      setValue('priority', jobCard.priority || 'NORMAL');
      setValue('estimatedCost', jobCard.estimatedCost || '');
      setValue('technician', jobCard.technician || '');
      setValue('notes', jobCard.notes || '');
      if (jobCard.createdAt) {
        const date = new Date(jobCard.createdAt);
        const formattedDate = date.toISOString().slice(0, 16);
        setValue('deliveryDate', formattedDate);
      }
      
      if (jobCard.services && masterServices.length > 0) {
         const mappedServices = masterServices.filter(s => 
          jobCard.services.includes(s.name) || jobCard.services.includes(s.id)
        );
        setSelectedServices(mappedServices);
        setValue('services', mappedServices.map(s => s.id));
      }
    }
  }, [jobCard, isEditMode, setValue, masterServices]);

  const subtotal = useMemo(() => selectedServices.reduce((sum, s) => sum + s.price, 0), [selectedServices]);

  if (isEditMode && isJobCardLoading) {
    return <Loader fullPage text="Loading job card details..." />;
  }

  const vehicleNumber = watch('vehicleNumber');

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

  const handleSearchVehicle = async () => {
    if (!vehicleNumber || vehicleNumber.length < 4) {
      toastError('Please enter a valid registration number');
      return;
    }
    setIsSearching(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setValue('ownerName', 'Rajesh Kumar');
      setValue('ownerMobile', '9876543210');
      setValue('makeModel', 'Hyundai Creta');
      toastSuccess('Vehicle details fetched from service history!');
    } catch (err) {
      toastError('Could not fetch vehicle details');
    } finally {
      setIsSearching(false);
    }
  };
  
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
      const message = `Hello ${watch('ownerName') || 'Customer'}, your vehicle service estimate is ready. Grand Total: ${formatCurrency(grandTotal)}. Please reply YES to approve work.`;
      window.open(`https://wa.me/91${watch('ownerMobile')}?text=${encodeURIComponent(message)}`, '_blank');
      toastSuccess('Bill sent via WhatsApp successfully!');
    } catch (err) {
      toastError('Failed to send WhatsApp message');
    }
  };

  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 800));
      toastSuccess(isEditMode ? 'Job Card updated successfully!' : 'Job Card created successfully!');
      navigate(ROUTES.JOB_CARDS);
    } catch {
      toastError(isEditMode ? 'Failed to update Job Card.' : 'Failed to create Job Card.');
    }
  };

  const CATEGORY_OPTS = serviceCategories.map(c => ({ value: c.name, label: c.name }));

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%', p: { xs: 2, md: 4 } }}>
      
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEditMode ? 'Edit Job Card' : 'Create Job Card'}
        </Typography>
        <BackButton 
          to={ROUTES.JOB_CARDS} 
          label="Back to List" 
        />
      </Box>

      <FormProvider {...methods}>
        <form id="jobCardForm" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {/* LEFT COLUMN: FORM */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ borderRadius: 3, boxShadow: 1, p: 3, mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
                  Vehicle & Customer Information
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <RHFTextField name="vehicleNumber" label="Registration Number" placeholder="TN 01 AB 1234" required />
                      </Box>
                      <Button
                        type="button"
                        variant="secondary"
                        leftIcon={Search}
                        isLoading={isSearching}
                        onClick={handleSearchVehicle}
                        style={{ height: '40px', marginTop: '24px' }}
                      >
                        Search
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="makeModel" label="Make & Model" placeholder="e.g. Hyundai Creta" required />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="ownerName" label="Owner Name" placeholder="Full name" required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="ownerMobile" label="Mobile Number" placeholder="10-digit mobile" required />
                  </Grid>
                </Grid>
              </Card>

              <Card sx={{ borderRadius: 3, boxShadow: 1, p: 3, mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
                  Service Configuration
                </Typography>
                
                <Grid container spacing={3}>
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
              </Card>

              <Card sx={{ borderRadius: 3, boxShadow: 1, p: 3, mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
                  Master Service List
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
                          control={<Checkbox checked={isSelected} onChange={() => {}} sx={{ p: 0.5 }} />}
                          label={<Typography variant="body2" fontWeight={600}>{service.name}</Typography>}
                          sx={{ m: 0 }}
                        />
                        <Typography variant="body2" fontWeight={700}>{formatCurrency(service.price)}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Card>

              <Card sx={{ borderRadius: 3, boxShadow: 1, p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
                  Additional Details
                </Typography>
                <RHFTextarea name="notes" label="Customer Complaints / Notes" rows={3} placeholder="Enter any specific issues reported by customer..." />
              </Card>
            </Grid>

            {/* RIGHT COLUMN: BILL PREVIEW */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 1, position: 'sticky', top: 80 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
                    <Typography variant="h6" fontWeight={700}>Bill Preview</Typography>
                    <Typography variant="caption" sx={{ bgcolor: 'success.light', color: 'success.main', px: 1, py: 0.5, borderRadius: 8, fontWeight: 600 }}>Auto-generated</Typography>
                  </Box>

                  <Box sx={{ minHeight: 150, maxHeight: 300, overflowY: 'auto', mb: 3 }}>
                    {selectedServices.length === 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                        <Typography color="text.secondary" variant="body2" fontStyle="italic">No services selected</Typography>
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
                      form="jobCardForm"
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      {isEditMode ? 'Update Job Card' : 'Create Job Card'}
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
