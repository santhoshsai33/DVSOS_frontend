import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
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
      <div style={{ background: '#fff', minHeight: '100%', padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle2 size={36} style={{ color: '#10B981' }} />
        </div>
        <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#152326' }}>Exit Processed Successfully</h4>
        <p style={{ color: '#6B7280', marginBottom: '0.25rem' }}>Vehicle <strong>{vehicle?.vehicleNumber}</strong> has exited the premises.</p>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Gate pass has been generated and recorded.</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" leftIcon={Printer} onClick={handlePrintGatePass}>
            Print Gate Pass
          </Button>
          <Button variant="primary" onClick={() => { setVehicle(null); setExitDone(false); searchMethods.reset(); }}>
            New Exit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', minHeight: '100%', padding: '2rem 2.5rem' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem', color: '#152326' }}>
          Vehicle Exit
        </h4>
        <button
          type="button"
          onClick={() => navigate(ROUTES.GATE_DASHBOARD)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6B7280', fontSize: '0.875rem', fontWeight: 500,
            padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </button>
      </div>

      {/* Step 1: Search */}
      <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        Step 1 — Find Vehicle
      </p>
      <FormProvider {...searchMethods}>
        <form onSubmit={searchMethods.handleSubmit(handleSearch)}>
          <Row className="g-3 align-items-end mb-4">
            <Col md={6}>
              <RHFTextField name="vehicleNumber" label="Vehicle Registration Number *" placeholder="e.g. TN 01 AB 1234" required />
            </Col>
            <Col md={3}>
              <Button variant="primary" type="submit" leftIcon={Search} isLoading={isSearching} style={{ marginTop: '1.7rem' }}>
                Search
              </Button>
            </Col>
          </Row>
        </form>
      </FormProvider>

      {/* Step 2: Vehicle Info + Exit Form */}
      {vehicle && (
        <>
          <div style={{ borderTop: '1px solid #E2E5DC', margin: '1.5rem 0' }} />
          
          <p style={{ fontWeight: 600, fontSize: '1rem', color: '#10B981', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Car size={18} /> Vehicle Ready for Exit
          </p>
          
          <Row className="g-3 mb-4">
            <Col md={3}>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: 4 }}>Job Card</div>
              <div style={{ fontWeight: 700, color: '#152326' }}>{vehicle.jobCardId}</div>
            </Col>
            <Col md={3}>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: 4 }}>Vehicle</div>
              <div style={{ fontWeight: 700, color: '#152326' }}>{vehicle.vehicleNumber}</div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{vehicle.makeModel}</div>
            </Col>
            <Col md={3}>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: 4 }}>Owner</div>
              <div style={{ fontWeight: 600, color: '#152326' }}>{vehicle.ownerName}</div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{vehicle.ownerMobile}</div>
            </Col>
            <Col md={3}>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: 4 }}>Bill Amount</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F766E' }}>{vehicle.amount}</div>
              <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>Completed: {formatDateTime(vehicle.completedAt)}</div>
            </Col>
          </Row>

          <div style={{ borderTop: '1px solid #E2E5DC', margin: '1.5rem 0' }} />

          <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Step 2 — Process Exit
          </p>

          <FormProvider {...exitMethods}>
            <form onSubmit={exitMethods.handleSubmit(handleProcessExit)}>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <RHFTextField name="gatePassNumber" label="Gate Pass Number" readOnly />
                </Col>
                <Col md={6}>
                  <RHFTextField name="exitKmReading" label="Exit KM Reading" placeholder="Odometer at exit" type="number" />
                </Col>
              </Row>

              <Row className="g-3 mb-3">
                <Col md={6}>
                  <RHFSelect name="paymentMode" label="Payment Mode *" options={PAYMENT_OPTIONS} required />
                </Col>
                <Col md={6}>
                  <RHFTextField name="paymentRef" label="Transaction / Reference No." placeholder="UPI ID, Txn No., etc." />
                </Col>
              </Row>

              <Row className="g-3 mb-3">
                <Col md={12}>
                  <RHFTextarea name="remarks" label="Exit Remarks (Optional)" placeholder="Any notes about vehicle condition at exit..." rows={2} />
                </Col>
              </Row>

              {/* Footer Actions */}
              <div style={{
                borderTop: '1px solid #E2E5DC',
                marginTop: '2rem', paddingTop: '1.5rem',
                display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
              }}>
                <Button variant="secondary" leftIcon={Printer} type="button" onClick={handlePrintGatePass}>
                  Print Gate Pass
                </Button>
                <Button variant="primary" leftIcon={LogOut} type="submit" isLoading={exitMethods.formState.isSubmitting}>
                  Confirm Exit
                </Button>
              </div>
            </form>
          </FormProvider>
        </>
      )}
    </div>
  );
}
