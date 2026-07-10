import React, { useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, Card, Typography, Divider, Chip } from '@mui/material';
import { ArrowLeft, Car, User, Shield, FileText, AlertTriangle, PlusCircle } from 'lucide-react';
import { useJobCard } from '../../queries/useDataQueries';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { ROUTES } from '../../config/routes';

export default function JobCardDetailPage() {
  const { id, slug } = useParams();
  const jobCardIdentifier = slug || id;
  const navigate = useNavigate();
  const location = useLocation();
  const { data: jobCard, isLoading } = useJobCard(jobCardIdentifier);

  const handleBack = () => {
    if (location.state?.fromVehicleHistory) {
      navigate(-1);
    } else {
      navigate(ROUTES.JOB_CARDS);
    }
  };

  const assignmentDetails = useMemo(() => {
    const assignments = Array.isArray(jobCard?.workAssignments) ? jobCard.workAssignments : [];
    return assignments.filter((assignment) => assignment?.assignedUser || assignment?.jobCardService || assignment?.service);
  }, [jobCard]);

  const getAssignmentStatusCode = (assignment) => {
    return String(assignment?.status?.statusCode || assignment?.status?.code || '').toUpperCase();
  };

  const getAssignmentStatusValue = (assignment) => {
    const statusCode = getAssignmentStatusCode(assignment);
    if (statusCode.includes('COMPLETED')) return 'COMPLETED';
    if (statusCode.includes('IN_PROGRESS')) return 'IN_PROGRESS';
    return 'ASSIGNED';
  };

  const getAssignmentStatusLabel = (assignment) => {
    const statusValue = getAssignmentStatusValue(assignment);
    if (statusValue === 'COMPLETED') return 'Completed';
    if (statusValue === 'IN_PROGRESS') return 'In Progress';
    return 'Assigned';
  };

  const getAssignmentStatusColor = (assignment) => {
    const statusValue = getAssignmentStatusValue(assignment);
    if (statusValue === 'COMPLETED') return 'success';
    if (statusValue === 'IN_PROGRESS') return 'info';
    return 'warning';
  };

  if (isLoading) {
    return <Loader text="Loading job card details..." />;
  }

  if (!jobCard) {
    return (
      <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 3, m: 3 }}>
        <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: 16 }} />
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Job Card Not Found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The job card "{jobCardIdentifier}" could not be located in our records.
        </Typography>
        <Button variant="primary" leftIcon={ArrowLeft} onClick={handleBack}>
          Back to List
        </Button>
      </Box>
    );
  }

  const vehicleBrandModel = [
    jobCard.vehicle?.brand?.name,
    jobCard.vehicle?.model,
    jobCard.vehicle?.variant
  ].filter(Boolean).join(' ');
  const complaintText = String(jobCard.customerComplaint || '').trim();
  const additionalNotesText = String(jobCard.additionalNotes || '').trim();
  const legacyNotesText = !complaintText && !additionalNotesText ? String(jobCard.notes || '').trim() : '';

  // Map API fields to UI fields
  const displayJobCard = {
    ...jobCard,
    id: jobCard.jobCardNo || jobCard.id,
    createdAt: jobCard.createdAt,
    ownerName: jobCard.customer?.fullName || jobCard.ownerName || 'Unknown',
    ownerMobile: jobCard.customer?.mobileNo || jobCard.ownerMobile || jobCard.mobile || '—',
    vehicleNumber: jobCard.vehicle?.registrationNo || jobCard.vehicleNumber || '—',
    serviceType: jobCard.gateEntry?.entryType || jobCard.serviceType || '—',
    vehicleBrandModel: vehicleBrandModel || jobCard.makeModel || jobCard.vehicleModel || '-',
    estimatedCost: jobCard.totalEstimate || jobCard.estimatedCost || 0,
    complaint: complaintText,
    additionalNotes: additionalNotesText,
    notes: legacyNotesText,
    status: jobCard.currentStatus?.statusCode || jobCard.status || 'PENDING',
    services: Array.isArray(jobCard.services) && typeof jobCard.services[0] === 'string'
      ? jobCard.services.map(s => ({ name: s, price: 0, quantity: 1, status: 'PENDING', isAdditional: false }))
      : (jobCard.services?.map(s => ({
        name: s.serviceName || s.serviceItem?.name || 'Unknown Service',
        price: Number(s.price || 0),
        quantity: Number(s.quantity || 1),
        status: s.serviceStatus?.statusCode || 'PENDING',
        isAdditional: !!s.isAdditional
      })) || [])
  };

  // Split services into default and additional
  const allServices = displayJobCard.services || [];
  const defaultServices = allServices.filter(s => !s.isAdditional);
  const additionalServices = allServices.filter(s => s.isAdditional);
  const noteItems = [
    displayJobCard.complaint ? { label: 'Customer Complaint', value: displayJobCard.complaint } : null,
    displayJobCard.additionalNotes ? { label: 'Additional Notes', value: displayJobCard.additionalNotes } : null,
    displayJobCard.notes ? { label: 'Notes', value: displayJobCard.notes } : null
  ].filter(Boolean);

  const taxRate = jobCard.billing?.taxRate ?? jobCard.taxRate ?? 18;
  const subtotal = displayJobCard.estimatedCost / (1 + taxRate / 100);

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
        title={`Job Card: ${displayJobCard.id}`}
        subtitle={`Created on ${formatDateTime(displayJobCard.createdAt)}`}
        breadcrumbs={[{ label: 'Job Cards', path: ROUTES.JOB_CARDS }, { label: 'View Details' }]}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="back" leftIcon={ArrowLeft} onClick={handleBack}>
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
                      {displayJobCard.ownerName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Mobile Number</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {displayJobCard.ownerMobile}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2, mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Registration Number</Typography>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      {displayJobCard.vehicleNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2, mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Brand & Model</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {displayJobCard.vehicleBrandModel}
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
              <Box sx={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 300 }}>
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
                      defaultServices.map((service, index) => (
                        <Box component="tr" key={index} sx={{ borderBottom: index < defaultServices.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                          <Box component="td" sx={{ p: 2, fontWeight: 500 }}>{service.name}</Box>
                          <Box component="td" sx={{ p: 2, textAlign: 'right', color: 'text.secondary' }}>x{service.quantity || 1}</Box>
                          <Box component="td" sx={{ p: 2, textAlign: 'right', fontWeight: 600 }}>
                            {formatCurrency(service.price > 0 ? service.price : (index === 0 ? subtotal * 0.6 : subtotal * 0.4 / (defaultServices.length - 1 || 1)))}
                          </Box>
                        </Box>
                      ))
                    )}
                  </Box>
                </Box>
              </Box>
            </Card>

            {/* Additional Work & Services */}
            {additionalServices.length > 0 && (
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
            )}

            {/* Complaints / Notes */}
            {noteItems.length > 0 && (
              <Card sx={{ borderRadius: 0 }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Shield size={18} color="#0d9488" />
                  <Typography variant="subtitle1" fontWeight={700}>Additional Notes & Complaints</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {noteItems.map((item) => (
                    <Box key={item.label}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            )}

          </Box>
        </Grid>

        {/* Right Column: Invoice stats */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, position: 'sticky', top: 80 }}>

            {/* Status & Estimate Overview */}
            <Card sx={{ borderRadius: 0 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700}>Estimate Summary</Typography>
                <StatusBadge status={displayJobCard.status} />
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
                    <Typography variant="body2" color="text.secondary">Tax ({taxRate}%)</Typography>
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

            <Card sx={{ borderRadius: 0 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" fontWeight={700}>Assigned Mechanical Work</Typography>
                <Chip
                  label={`${assignmentDetails.length} Assignment${assignmentDetails.length === 1 ? '' : 's'}`}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
              <Box sx={{ p: 2 }}>
                {assignmentDetails.length === 0 ? (
                  <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1, p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No mechanical assignment added for this job card yet.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {assignmentDetails.map((assignment) => {
                      const assignedUser = assignment.assignedUser || {};
                      const serviceName = assignment.jobCardService?.serviceName || assignment.service?.serviceName || 'Assigned Service';

                      return (
                        <Box
                          key={assignment.id}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5
                          }}
                        >
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              Assigned User
                            </Typography>
                            <Typography variant="body2" fontWeight={700}>
                              {assignedUser.fullName || 'Unassigned'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {serviceName}
                              {assignedUser.employeeCode ? ` - ${assignedUser.employeeCode}` : ''}
                            </Typography>
                          </Box>

                          <Divider />

                          <Grid container spacing={1.5}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                Start Time
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {assignment.startedAt ? formatDateTime(assignment.startedAt) : '-'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                End Time
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {assignment.completedAt ? formatDateTime(assignment.completedAt) : '-'}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              Status
                            </Typography>
                            <Chip
                              label={getAssignmentStatusLabel(assignment)}
                              color={getAssignmentStatusColor(assignment)}
                              size="small"
                              sx={{ fontWeight: 700 }}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Card>

          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
