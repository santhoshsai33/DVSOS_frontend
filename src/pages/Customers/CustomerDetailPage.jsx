import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Grid, Skeleton } from '@mui/material';
import BackButton from '../../components/common/BackButton';
import { ROUTES } from '../../config/routes';
import { useCustomerDetails } from '../../queries/useDataQueries';

const DetailRow = ({ label, value, isLast = false }) => (
  <Box sx={{ display: 'flex', py: 1.5, borderBottom: isLast ? 'none' : '1px solid', borderColor: 'divider' }}>
    <Typography variant="body2" fontWeight={600} sx={{ width: '40%', color: 'text.primary' }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ width: '60%', color: 'text.secondary', wordBreak: 'break-word' }}>
      {value || '-'}
    </Typography>
  </Box>
);

export default function CustomerDetailPage() {
  const { id, slug } = useParams();
  const navigate = useNavigate();

  const identifier = slug || id;
  const { data: response, isLoading } = useCustomerDetails(identifier);
  const customer = response?.data;

  // We are waiting for backend integration of service history.
  // We can show the job cards array from customer relation if available.
  const history = customer?.jobCards || [];

  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Card sx={{ p: 4, borderRadius: 1, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
        </Card>
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" fontWeight={700}>Customer Details</Typography>
          <BackButton to={ROUTES.CUSTOMERS} label="Back to Customers" />
        </Box>
        <Card sx={{ p: 4, borderRadius: 1, boxShadow: 'none', border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">Customer not found.</Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>Customer Details</Typography>
        <BackButton to={ROUTES.CUSTOMERS} label="Back to Customers" />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 1, boxShadow: 'none', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                Customer Information
              </Typography>
            </Box>
            <Box sx={{ px: 2, pb: 1 }}>
              <DetailRow label="Full Name" value={customer?.fullName} />
              <DetailRow label="Email" value={customer?.emailId} />
              <DetailRow label="Mobile" value={customer?.mobileNo} />
              <DetailRow label="Alternative Mobile" value={customer?.alternateMobileNo} />
              <DetailRow
                label="Status"
                value={
                  <Typography variant="caption" fontWeight={700} color={customer?.isActive ? 'success.main' : 'error.main'}>
                    {customer?.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </Typography>
                }
                isLast={true}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 1, boxShadow: 'none', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                System & Address Details
              </Typography>
            </Box>
            <Box sx={{ px: 2, pb: 1 }}>
              <DetailRow label="Created On" value={customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'} />
              <DetailRow label="Last Updated" value={customer?.updatedAt ? new Date(customer.updatedAt).toLocaleDateString() : 'N/A'} />
              <DetailRow label="Total Service Visits" value={`${history.length || 0} visits`} />
              <DetailRow label="Address" value={customer?.address} isLast={true} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
