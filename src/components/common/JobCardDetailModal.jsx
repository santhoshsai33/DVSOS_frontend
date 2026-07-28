import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Card,
  Divider,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import {
  X,
  Car,
  User,
  FileText,
  PlusCircle,
  Shield,
  ExternalLink,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useJobCard } from '../../queries/useDataQueries';
import StatusBadge from './StatusBadge';
import Loader from './Loader';
import Button from './Button';
import VehicleNumberPlate from './VehicleNumberPlate';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { ROUTES } from '../../config/routes';

export default function JobCardDetailModal({
  isOpen,
  onClose,
  jobCardId,
  onAssign
}) {
  const navigate = useNavigate();
  const { data: jobCard, isLoading } = useJobCard(jobCardId);

  if (!isOpen) return null;

  const handleOpenFullPage = () => {
    onClose();
    navigate(`${ROUTES.JOB_CARDS}/view/${jobCard?.slug || jobCard?.id || jobCardId}`);
  };

  const vehicleBrandModel = jobCard?.vehicle
    ? [jobCard.vehicle.brand?.name, jobCard.vehicle.model, jobCard.vehicle.variant].filter(Boolean).join(' ')
    : jobCard?.makeModel || jobCard?.vehicleModel || '—';

  const customerName = jobCard?.customer?.fullName || jobCard?.ownerName || 'Unknown';
  const customerMobile = jobCard?.customer?.mobileNo || jobCard?.ownerMobile || jobCard?.mobile || '—';
  const vehicleNumber = jobCard?.vehicle?.registrationNo || jobCard?.vehicleNumber || '—';
  const complaintText = String(jobCard?.customerComplaint || '').trim();
  const additionalNotesText = String(jobCard?.additionalNotes || '').trim();
  const legacyNotesText = !complaintText && !additionalNotesText ? String(jobCard?.notes || '').trim() : '';

  const services = Array.isArray(jobCard?.services) && typeof jobCard.services[0] === 'string'
    ? jobCard.services.map(s => ({ name: s, price: 0, quantity: 1, status: 'PENDING', isAdditional: false }))
    : (jobCard?.services?.map(s => ({
        name: s.serviceName || s.serviceItem?.name || 'Unknown Service',
        price: Number(s.price || 0),
        quantity: Number(s.quantity || 1),
        status: s.serviceStatus?.statusCode || 'PENDING',
        isAdditional: !!s.isAdditional
      })) || []);

  const defaultServices = services.filter(s => !s.isAdditional);
  const additionalServices = services.filter(s => s.isAdditional);

  const taxRate = jobCard?.billing?.taxRate ?? jobCard?.taxRate ?? 18;
  const totalSubtotal = jobCard?.billing?.serviceSubtotal ?? jobCard?.serviceSubtotal ?? ((jobCard?.totalEstimate || 0) / (1 + taxRate / 100));
  const approvedAdditionalTotal = additionalServices
    .filter(s => s.status !== 'REJECTED')
    .reduce((sum, s) => sum + s.price, 0);

  const discountAmount = jobCard?.billing?.discountAmount ?? jobCard?.discountAmount ?? 0;
  const taxableAmount = Math.max(0, totalSubtotal - discountAmount);
  const totalTaxAmount = (taxableAmount * (taxRate / 100));
  const totalGrandTotal = taxableAmount + totalTaxAmount;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Modal Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5,
          bgcolor: '#0F172A',
          color: '#FFFFFF',
          borderBottom: '1px solid #1E293B'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.02em', color: '#F8FAFC' }}>
            {jobCard?.jobCardNo || `Job Card #${jobCardId}`}
          </Typography>
          {jobCard?.currentStatus?.statusCode && (
            <StatusBadge status={jobCard.currentStatus.statusCode} />
          )}
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#94A3B8',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      {/* Modal Content */}
      <DialogContent sx={{ p: 3, bgcolor: '#F8FAFC', overflowY: 'auto' }}>
        {isLoading ? (
          <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
            <Loader text="Loading job card details..." />
          </Box>
        ) : !jobCard ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Could not load job card details.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Vehicle and Customer Info Card */}
            <Card sx={{ borderRadius: 2.5, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#F1F5F9' }}>
                <Car size={18} color="#0D9488" />
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#0F172A' }}>
                  Vehicle & Owner Details
                </Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                      Registration Number
                    </Typography>
                    <VehicleNumberPlate vehicleNumber={vehicleNumber} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                      Brand & Model
                    </Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ color: '#1E293B' }}>
                      {vehicleBrandModel}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ borderTop: '1px solid #F1F5F9', pt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                      Customer Name
                    </Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1E293B' }}>
                      <User size={15} color="#64748B" />
                      {customerName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ borderTop: '1px solid #F1F5F9', pt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                      Mobile Number
                    </Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ color: '#1E293B' }}>
                      {customerMobile}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ borderTop: '1px solid #F1F5F9', pt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                      Expected Delivery Date
                    </Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0D9488' }}>
                      <Clock size={15} color="#0D9488" />
                      {jobCard?.expectedDeliveryAt ? formatDateTime(jobCard.expectedDeliveryAt) : jobCard?.expectedDeliveryDate ? formatDateTime(jobCard.expectedDeliveryDate) : '—'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ borderTop: '1px solid #F1F5F9', pt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                      Service Type
                    </Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ color: '#1E293B' }}>
                      {jobCard?.gateEntry?.entryType || jobCard?.serviceType || 'Regular Service'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Card>

            {/* Customer Complaint & Notes */}
            {(complaintText || additionalNotesText || legacyNotesText) && (
              <Card sx={{ borderRadius: 2.5, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#F1F5F9' }}>
                  <Shield size={18} color="#0D9488" />
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#0F172A' }}>
                    Customer Complaint & Notes
                  </Typography>
                </Box>
                <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {complaintText && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                        Customer Complaint
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1E293B', bgcolor: '#F8FAFC', p: 1.5, borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                        {complaintText}
                      </Typography>
                    </Box>
                  )}
                  {additionalNotesText && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                        Additional Notes
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1E293B', bgcolor: '#F8FAFC', p: 1.5, borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                        {additionalNotesText}
                      </Typography>
                    </Box>
                  )}
                  {legacyNotesText && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                        Notes
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1E293B', bgcolor: '#F8FAFC', p: 1.5, borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                        {legacyNotesText}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Card>
            )}

            {/* Selected Services Table */}
            <Card sx={{ borderRadius: 2.5, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#F1F5F9' }}>
                <FileText size={18} color="#0D9488" />
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#0F172A' }}>
                  Selected Services ({defaultServices.length})
                </Typography>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Service Description</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Qty</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {defaultServices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.disabled', fontStyle: 'italic' }}>
                        No standard service items registered.
                      </TableCell>
                    </TableRow>
                  ) : (
                    defaultServices.map((service, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontWeight: 600, color: '#1E293B' }}>{service.name}</TableCell>
                        <TableCell align="right" sx={{ color: '#64748B' }}>x{service.quantity || 1}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#0F172A' }}>
                          {formatCurrency(service.price)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            {/* Additional Work & Services */}
            {additionalServices.length > 0 && (
              <Card sx={{ borderRadius: 2.5, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#F1F5F9' }}>
                  <PlusCircle size={18} color="#0D9488" />
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#0F172A' }}>
                    Additional Work & Services ({additionalServices.length})
                  </Typography>
                </Box>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Description</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {additionalServices.map((service, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontWeight: 600, color: '#1E293B' }}>{service.name}</TableCell>
                        <TableCell align="center">
                          <StatusBadge status={service.status} />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#0F172A' }}>
                          {formatCurrency(service.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* Estimate Summary Box */}
            <Card sx={{ borderRadius: 2.5, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  Estimated Total
                </Typography>
                <Typography variant="h6" fontWeight={800} sx={{ color: '#0F172A' }}>
                  {formatCurrency(totalGrandTotal || jobCard?.totalEstimate || 0)}
                </Typography>
              </Box>
            </Card>
          </Box>
        )}
      </DialogContent>

      {/* Modal Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Button
          variant="outlined"
          size="sm"
          leftIcon={ExternalLink}
          onClick={handleOpenFullPage}
          sx={{ textTransform: 'none', fontWeight: 700 }}
        >
          Open Full Page
        </Button>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            sx={{ textTransform: 'none', fontWeight: 600, color: '#64748B' }}
          >
            Close
          </Button>
          {onAssign && (
            <Button
              variant="primary"
              size="sm"
              rightIcon={ArrowRight}
              onClick={() => {
                onClose();
                onAssign();
              }}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Assign Work
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
