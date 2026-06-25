import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Grid, Typography } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import RHFTextField from '../../components/form/RHFTextField';
import RHFTextarea from '../../components/form/RHFTextarea';
import RHFSelect from '../../components/form/RHFSelect';
import Button from '../../components/common/Button';
import { toastSuccess, toastError } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';


import { useCustomerDetails } from '../../queries/useDataQueries';
import { useUpdateCustomer } from '../../mutations/useDataMutations';

export default function CustomerForm() {
  const navigate = useNavigate();
  const { id, slug } = useParams();
  const identifier = slug || id;
  const isEdit = !!identifier;

  const { data: customerDetails, isLoading } = useCustomerDetails(identifier);
  const updateMutation = useUpdateCustomer();

  const methods = useForm({
    defaultValues: {
      fullName: '',
      emailId: '',
      mobileNo: '',
      alternateMobileNo: '',
      address: ''
    }
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (isEdit && customerDetails?.data) {
      const customer = customerDetails.data;
      reset({
        fullName: customer.fullName || '',
        emailId: customer.emailId || '',
        mobileNo: customer.mobileNo || '',
        alternateMobileNo: customer.alternateMobileNo || '',
        address: customer.address || ''
      });
    }
  }, [isEdit, customerDetails, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: identifier,
          data: {
            fullName: data.fullName,
            emailId: data.emailId,
            mobileNo: data.mobileNo,
            alternateMobileNo: data.alternateMobileNo,
            address: data.address
          }
        });
      } else {
        toastSuccess('Customer creation is managed via Gate Entry and CRM.');
      }
      navigate(ROUTES.CUSTOMERS || '/customers');
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || error?.message || 'An error occurred while updating the customer';
      toastError(message);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit Customer' : 'Add New Customer'}
        </Typography>
        <Box
          component="button"
          onClick={() => navigate(ROUTES.CUSTOMERS)}
          className="back-btn"
        >
          <ArrowLeft size={16} /> Back to List
        </Box>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Section: Customer Information */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Customer Information
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="fullName" label="Customer Full Name" placeholder="Enter full name" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField 
                name="emailId" 
                label="Email Address" 
                type="email" 
                placeholder="Enter email address" 
                required 
                rules={{ 
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField 
                name="mobileNo" 
                label="Mobile Number" 
                placeholder="Enter mobile number" 
                required 
                inputProps={{ maxLength: 10 }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                rules={{ 
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^(?!0{10})\d{10}$/,
                    message: 'Mobile number must be exactly 10 digits and cannot be all zeros'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField 
                name="alternateMobileNo" 
                label="Alternative Mobile Number" 
                placeholder="Enter alternative mobile number" 
                inputProps={{ maxLength: 10 }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                rules={{
                  pattern: {
                    value: /^(?!0{10})\d{10}$/,
                    message: 'Mobile number must be exactly 10 digits and cannot be all zeros'
                  }
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <RHFTextarea name="address" label="Billing Address" placeholder="Enter address details" rows={3} />
            </Grid>
          </Grid>

          {/* Footer Actions */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.CUSTOMERS)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={updateMutation.isPending}
            >
              {isEdit ? 'Save Changes' : 'Submit'}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
