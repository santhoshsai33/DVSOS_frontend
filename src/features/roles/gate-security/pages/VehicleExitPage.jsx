import { useState } from 'react';
import { Box, Grid, Typography, Divider } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { Search, LogOut, Printer, CheckCircle2, Car, User, Clock, ArrowLeft } from 'lucide-react';
import RHFTextField from '../../../../components/form/RHFTextField';
import RHFSelect from '../../../../components/form/RHFSelect';
import RHFTextarea from '../../../../components/form/RHFTextarea';
import Button from '../../../../components/common/Button';
import { toastSuccess, toastError, toastInfo } from '../../../../notifications/toast';
import { formatDateTime } from '../../../../utils/formatters';
import { ROUTES } from '../../../../config/routes';
import { useNavigate } from 'react-router-dom';

const PAYMENT_OPTIONS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'UPI', label: 'UPI / QR Code' },
  { value: 'CARD', label: 'Card (POS)' },
  { value: 'NETBANKING', label: 'Net Banking' },
  { value: 'CREDIT', label: 'Credit (To be collected)' },
];

const MOCK_VEHICLE = {
  jobCardId: 'JC-1012',
  vehicleNumber: 'TN 01 AB 1234',
  ownerName: 'Ramesh Kumar',
  ownerMobile: '9876543210',
  makeModel: 'Hyundai i20',
  serviceType: 'General Service',
  deliveredBy: 'Rajan M.',
  completedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  amount: '₹3,245',
  status: 'READY_FOR_DELIVERY',
};

export default function VehicleExitPage() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [exitDone, setExitDone] = useState(false);

  const searchMethods = useForm({ defaultValues: { vehicleNumber: '' } });
  const exitMethods = useForm({
    defaultValues: {
      gatePassNumber: `GP-${Date.now().toString().slice(-6)}`,
      exitKmReading: '',
      paymentMode: 'CASH',
      paymentRef: '',
      remarks: '',
    },
  });

  const handleSearch = async (data) => {
    if (!data.vehicleNumber || data.vehicleNumber.length < 4) {
      toastError('Enter a valid vehicle registration number');
      return;
    }
    setIsSearching(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSearching(false);
    setVehicle(MOCK_VEHICLE);
    toastSuccess('Vehicle found and ready for exit!');
  };

  const handleProcessExit = async (data) => {
    if (!vehicle) return;
    try {
      await new Promise((r) => setTimeout(r, 900));
      setExitDone(true);
      toastSuccess(`Vehicle ${vehicle.vehicleNumber} exited successfully. Gate pass ${data.gatePassNumber} generated!`);
    } catch {
      toastError('Failed to process vehicle exit.');
    }
  };

  const handlePrintGatePass = () => {
    toastInfo('Sending to printer...');
    setTimeout(() => toastSuccess('Gate pass printed successfully!'), 1000);
  };

  if (exitDone) {
    return (
      <Box sx={{ bgcolor: 'background.paper', minHeight: '100%', p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'success.50', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
          <CheckCircle2 size={36} color="#10B981" />
        </Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Exit Processed Successfully</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>Vehicle <strong>{vehicle?.vehicleNumber}</strong> has exited the premises.</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Gate pass has been generated and recorded.</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="secondary" leftIcon={Printer} onClick={handlePrintGatePass}>
            Print Gate Pass
          </Button>
          <Button variant="primary" onClick={() => { setVehicle(null); setExitDone(false); searchMethods.reset(); }}>
            New Exit
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100%', p: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          Vehicle Exit
        </Typography>
        <Box
          component="button"
          onClick={() => navigate(ROUTES.GATE_DASHBOARD)}
          className="back-btn"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Box>
      </Box>

      {/* Step 1: Search */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        Step 1 — Find Vehicle
      </Typography>
      <FormProvider {...searchMethods}>
        <form onSubmit={searchMethods.handleSubmit(handleSearch)}>
          <Grid container spacing={3} alignItems="flex-end" sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="vehicleNumber" label="Vehicle Registration Number *" placeholder="e.g. TN 01 AB 1234" required />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="primary" type="submit" leftIcon={Search} isLoading={isSearching} style={{ marginTop: '1.7rem' }}>
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>

      {/* Step 2: Vehicle Info + Exit Form */}
      {vehicle && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" fontWeight={600} color="success.main" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Car size={18} /> Vehicle Ready for Exit
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Job Card</Typography>
              <Typography variant="body1" fontWeight={700}>{vehicle.jobCardId}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Vehicle</Typography>
              <Typography variant="body1" fontWeight={700}>{vehicle.vehicleNumber}</Typography>
              <Typography variant="body2" color="text.secondary">{vehicle.makeModel}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Owner</Typography>
              <Typography variant="body1" fontWeight={600}>{vehicle.ownerName}</Typography>
              <Typography variant="body2" color="text.secondary">{vehicle.ownerMobile}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Bill Amount</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">{vehicle.amount}</Typography>
              <Typography variant="body2" color="text.secondary">Completed: {formatDateTime(vehicle.completedAt)}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            Step 2 — Process Exit
          </Typography>

          <FormProvider {...exitMethods}>
            <form onSubmit={exitMethods.handleSubmit(handleProcessExit)}>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="gatePassNumber" label="Gate Pass Number" readOnly />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="exitKmReading" label="Exit KM Reading" placeholder="Odometer at exit" type="number" />
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <RHFSelect name="paymentMode" label="Payment Mode *" options={PAYMENT_OPTIONS} required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="paymentRef" label="Transaction / Reference No." placeholder="UPI ID, Txn No., etc." />
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <RHFTextarea name="remarks" label="Exit Remarks (Optional)" placeholder="Any notes about vehicle condition at exit..." rows={2} />
                </Grid>
              </Grid>

              {/* Footer Actions */}
              <Box sx={{
                borderTop: '1px solid', borderColor: 'divider',
                mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2,
              }}>
                <Button variant="secondary" leftIcon={Printer} type="button" onClick={handlePrintGatePass}>
                  Print Gate Pass
                </Button>
                <Button variant="primary" leftIcon={LogOut} type="submit" isLoading={exitMethods.formState.isSubmitting}>
                  Confirm Exit
                </Button>
              </Box>
            </form>
          </FormProvider>
        </>
      )}
    </Box>
  );
}
