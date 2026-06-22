import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Card, Typography, Divider } from '@mui/material';
import { ArrowLeft, Car, User, Shield, FileText, AlertTriangle, PlusCircle } from 'lucide-react';
import { useJobCard } from '../../queries/useDataQueries';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { ROUTES } from '../../config/routes';

export default function JobCardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: jobCard, isLoading } = useJobCard(id);

  if (isLoading) {
    return <Loader fullPage text="Loading job card details..." />;
  }

  if (!jobCard) {
    return (
      <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 3, m: 3 }}>
        <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: 16 }} />
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Job Card Not Found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The job card with ID "{id}" could not be located in our records.
        </Typography>
        <Button variant="primary" leftIcon={ArrowLeft} onClick={() => navigate(ROUTES.JOB_CARDS)}>
          Back to List
        </Button>
      </Box>
    );
  }

  // Calculate dummy invoice summary values
  const defaultServices = jobCard.services || [];
  const taxRate = 18; // Default mock tax
  const subtotal = jobCard.estimatedCost / (1 + taxRate / 100);

  const additionalServices = jobCard.additionalServices || [
    { name: 'Wheel Alignment & Balancing', price: 1200, status: 'APPROVED', date: jobCard.createdAt },
    { name: 'Rear Bumper Touch-up', price: 2500, status: 'PENDING', date: jobCard.createdAt }
  ];

  const approvedAdditionalTotal = additionalServices
    .filter(s => s.status === 'APPROVED')
    .reduce((sum, s) => sum + s.price, 0);

  const totalSubtotal = subtotal + approvedAdditionalTotal;
  const totalTaxAmount = totalSubtotal * (taxRate / 100);
  const totalGrandTotal = totalSubtotal + totalTaxAmount;

  return (
    <Box sx={{ minHeight: '100%', p: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <PageHeader
        title={`Job Card: #${jobCard.id}`}
        subtitle={`Created on ${formatDateTime(jobCard.createdAt)}`}
        breadcrumbs={[{ label: 'Job Cards', path: ROUTES.JOB_CARDS }, { label: 'View Details' }]}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate(ROUTES.JOB_CARDS)}>
              Back
            </Button>
          </Box>
        }
      />

      <Grid container spacing={3}>
        {/* Left Column: Information details */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Customer & Vehicle Info */}
            <Card sx={{ borderRadius: 0 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Car size={18} color="#0d9488" />
                <Typography variant="subtitle1" fontWeight={700}>Vehicle & Owner Details</Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Owner Name</Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <User size={15} color="#6b7280" />
                      {jobCard.ownerName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Mobile Number</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {jobCard.ownerMobile || jobCard.mobile || '—'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2, mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Registration Number</Typography>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      {jobCard.vehicleNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2, mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Service Category</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {jobCard.serviceType?.replace('_', ' ') || '—'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Card>

            {/* Selected Work Items */}
            <Card sx={{ borderRadius: 0 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileText size={18} color="#0d9488" />
                <Typography variant="subtitle1" fontWeight={700}>Selected Services</Typography>
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <Box component="thead">
                    <Box component="tr" sx={{ bgcolor: 'rgba(18, 52, 59, 0.02)', borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Box component="th" sx={{ p: 2, fontWeight: 600, textAlign: 'left', color: 'text.secondary' }}>Service Description</Box>
                      <Box component="th" sx={{ p: 2, fontWeight: 600, textAlign: 'right', color: 'text.secondary', width: 120 }}>Quantity</Box>
                      <Box component="th" sx={{ p: 2, fontWeight: 600, textAlign: 'right', color: 'text.secondary', width: 150 }}>Rate</Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {defaultServices.length === 0 ? (
                      <Box component="tr">
                        <Box component="td" colSpan="3" sx={{ p: 3, textAlign: 'center', fontStyle: 'italic', color: 'text.disabled' }}>
                          No service items registered.
                        </Box>
                      </Box>
                    ) : (
                      defaultServices.map((serviceName, index) => (
                        <Box component="tr" key={index} sx={{ borderBottom: index < defaultServices.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                          <Box component="td" sx={{ p: 2, fontWeight: 500 }}>{serviceName}</Box>
                          <Box component="td" sx={{ p: 2, textAlign: 'right', color: 'text.secondary' }}>x1</Box>
                          <Box component="td" sx={{ p: 2, textAlign: 'right', fontWeight: 600 }}>
                            {formatCurrency(index === 0 ? subtotal * 0.6 : subtotal * 0.4 / (defaultServices.length - 1 || 1))}
                          </Box>
                        </Box>
                      ))
                    )}
                  </Box>
                </Box>
              </Box>
            </Card>

            {/* Additional Work & Services */}
            <Card sx={{ borderRadius: 0 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                <PlusCircle size={18} color="#0d9488" />
                <Typography variant="subtitle1" fontWeight={700}>Additional Work & Services</Typography>
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <Box component="thead">
                    <Box component="tr" sx={{ bgcolor: 'rgba(18, 52, 59, 0.02)', borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Box component="th" sx={{ p: 2, fontWeight: 600, textAlign: 'left', color: 'text.secondary' }}>Service Description</Box>
                      <Box component="th" sx={{ p: 2, fontWeight: 600, textAlign: 'center', color: 'text.secondary', width: 120 }}>Status</Box>
                      <Box component="th" sx={{ p: 2, fontWeight: 600, textAlign: 'right', color: 'text.secondary', width: 150 }}>Rate</Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {additionalServices.length === 0 ? (
                      <Box component="tr">
                        <Box component="td" colSpan="3" sx={{ p: 3, textAlign: 'center', fontStyle: 'italic', color: 'text.disabled' }}>
                          No additional services registered.
                        </Box>
                      </Box>
                    ) : (
                      additionalServices.map((service, index) => (
                        <Box component="tr" key={index} sx={{ borderBottom: index < additionalServices.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                          <Box component="td" sx={{ p: 2, fontWeight: 500 }}>{service.name}</Box>
                          <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                            <StatusBadge status={service.status} />
                          </Box>
                          <Box component="td" sx={{ p: 2, textAlign: 'right', fontWeight: 600 }}>
                            {formatCurrency(service.price)}
                          </Box>
                        </Box>
                      ))
                    )}
                  </Box>
                </Box>
              </Box>
            </Card>

            {/* Complaints / Notes */}
            <Card sx={{ borderRadius: 0 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Shield size={18} color="#0d9488" />
                <Typography variant="subtitle1" fontWeight={700}>Additional Notes & Complaints</Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: jobCard.notes ? 'normal' : 'italic' }}>
                  {jobCard.notes || 'No notes or special instructions provided by the customer.'}
                </Typography>
              </Box>
            </Card>

          </Box>
        </Grid>

        {/* Right Column: Invoice stats */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, position: 'sticky', top: 80 }}>

            {/* Status & Estimate Overview */}
            <Card sx={{ borderRadius: 0 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700}>Estimate Summary</Typography>
                <StatusBadge status={jobCard.status} />
              </Box>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Base Subtotal</Typography>
                    <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
                  </Box>
                  {approvedAdditionalTotal > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Additional Work (Approved)</Typography>
                      <Typography variant="body2">{formatCurrency(approvedAdditionalTotal)}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Tax (18%)</Typography>
                    <Typography variant="body2">{formatCurrency(totalTaxAmount)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'primary.main' }}>
                    <Typography variant="subtitle1" fontWeight={800}>Grand Total</Typography>
                    <Typography variant="subtitle1" fontWeight={800}>{formatCurrency(totalGrandTotal)}</Typography>
                  </Box>
                </Box>
              </Box>
            </Card>

          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
