import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Save, Search, MessageCircle, ArrowLeft } from 'lucide-react';
import { jobCardSchema } from '../../validations/jobCardSchema';
import { SERVICE_TYPES } from '../../constants/statuses';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import RHFTextarea from '../../components/form/RHFTextarea';
import Button from '../../components/common/Button';
import { toastSuccess, toastError, toastInfo } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import { formatCurrency } from '../../utils/formatters';
import styles from './JobCards.module.css';
import { useState, useMemo } from 'react';
import useMasterDataStore from '../../store/useMasterDataStore';

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export default function JobCardCreate() {
  const navigate = useNavigate();
  const { masterServices, companySettings } = useMasterDataStore();
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const methods = useForm({
    resolver: zodResolver(jobCardSchema.partial({ services: true })),
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

  const { watch, setValue, handleSubmit, formState } = methods;
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
      toastSuccess('Job Card created successfully!');
      navigate(ROUTES.JOB_CARDS);
    } catch {
      toastError('Failed to create Job Card.');
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%', padding: '2rem 2.5rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem', color: '#152326' }}>
          Create Job Card
        </h4>
        <button
          type="button"
          onClick={() => navigate(ROUTES.JOB_CARDS)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6B7280', fontSize: '0.875rem', fontWeight: 500,
            padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Back to List
        </button>
      </div>

      <Row className="g-4">
        {/* LEFT COLUMN: FORM */}
        <Col lg={8}>
          <FormProvider {...methods}>
            <form id="jobCardForm" onSubmit={handleSubmit(onSubmit)}>
              
              <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
                Vehicle & Customer Information
              </p>
              
              <Row className="g-3 mb-3 align-items-end">
                <Col md={6}>
                  <div className="d-flex gap-2">
                    <div className="flex-grow-1">
                      <RHFTextField name="vehicleNumber" label="Registration Number *" placeholder="TN 01 AB 1234" required />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      className="mb-3"
                      style={{ height: '42px', marginTop: '28px' }}
                      leftIcon={Search}
                      isLoading={isSearching}
                      onClick={handleSearchVehicle}
                    >
                      Search
                    </Button>
                  </div>
                </Col>
                <Col md={6}>
                  <RHFTextField name="makeModel" label="Make & Model *" placeholder="e.g. Hyundai Creta" required />
                </Col>
              </Row>

              <Row className="g-3 mb-3">
                <Col md={6}>
                  <RHFTextField name="ownerName" label="Owner Name *" placeholder="Full name" required />
                </Col>
                <Col md={6}>
                  <RHFTextField name="ownerMobile" label="Mobile Number *" placeholder="10-digit mobile" required />
                </Col>
              </Row>

              <div style={{ borderTop: '1px solid #E2E5DC', margin: '1.5rem 0' }} />

              <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
                Service Configuration
              </p>
              
              <Row className="g-3 mb-3">
                <Col md={4}>
                  <RHFSelect name="serviceType" label="Primary Category *" options={SERVICE_TYPES} placeholder="Select category" required />
                </Col>
                <Col md={4}>
                  <RHFSelect name="priority" label="Priority" options={PRIORITY_OPTIONS} />
                </Col>
                <Col md={4}>
                  <RHFTextField name="deliveryDate" label="Expected Delivery *" type="datetime-local" required />
                </Col>
              </Row>

              <div style={{ borderTop: '1px solid #E2E5DC', margin: '1.5rem 0' }} />

              <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
                Master Service List
              </p>
              
              <div className={styles.serviceGrid}>
                {masterServices.map((service) => {
                  const isSelected = selectedServices.some((s) => s.id === service.id);
                  return (
                    <div
                      key={service.id}
                      className={[styles.serviceItem, isSelected ? styles.selected : ''].join(' ')}
                      onClick={() => toggleService(service)}
                    >
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => { }}
                            style={{ width: 16, height: 16, accentColor: 'var(--color-accent)' }}
                          />
                          <span className={styles.serviceName}>{service.name}</span>
                        </div>
                        <span className={styles.servicePrice}>{formatCurrency(service.price)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '1px solid #E2E5DC', margin: '1.5rem 0' }} />

              <RHFTextarea name="notes" label="Customer Complaints / Notes" placeholder="Enter any specific issues reported by customer..." rows={3} />
            </form>
          </FormProvider>
        </Col>

        {/* RIGHT COLUMN: BILL PREVIEW */}
        <Col lg={4}>
          <div style={{ background: '#F9FAFB', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E5DC', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed #E2E5DC' }}>
              <h5 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: '#152326' }}>Bill Preview</h5>
              <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '12px', fontWeight: 600 }}>Auto-generated</span>
            </div>

            <div style={{ minHeight: '150px', maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
              {selectedServices.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: '#6B7280', fontSize: '0.85rem', fontStyle: 'italic' }}>No services selected</div>
              ) : (
                selectedServices.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontSize: '0.85rem', color: '#152326', fontWeight: 500 }}>{item.name} <small style={{ color: '#6B7280' }}>x1</small></span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#152326' }}>{formatCurrency(item.price)}</span>
                  </div>
                ))
              )}
            </div>

            <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid #E2E5DC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#4B5563' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#4B5563' }}>
                <span>Tax ({companySettings.defaultTaxRate}%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 700, color: '#0F766E', paddingTop: '0.5rem', marginTop: '0.25rem', borderTop: '1px dashed #E2E5DC' }}>
                <span>Grand Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
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
                isLoading={formState.isSubmitting}
              >
                Create Job Card
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
