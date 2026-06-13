import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Save, Search, MessageCircle } from 'lucide-react';
import { jobCardSchema } from '../../validations/jobCardSchema';
import { SERVICE_TYPES } from '../../constants/statuses';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import RHFTextarea from '../../components/form/RHFTextarea';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
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

  // Toggle service selection
  const toggleService = (service) => {
    let updated;
    if (selectedServices.find((s) => s.id === service.id)) {
      updated = selectedServices.filter((s) => s.id !== service.id);
    } else {
      updated = [...selectedServices, service];
    }
    setSelectedServices(updated);
    setValue('services', updated.map((s) => s.id));

    // Auto-calculate estimated cost
    const totalCost = updated.reduce((sum, s) => sum + s.price, 0);
    const tax = totalCost * (companySettings.defaultTaxRate / 100);
    setValue('estimatedCost', totalCost + tax);
  };

  // Mock auto-populate from registration number
  const handleSearchVehicle = async () => {
    if (!vehicleNumber || vehicleNumber.length < 4) {
      toastError('Please enter a valid registration number');
      return;
    }
    setIsSearching(true);
    try {
      // Simulate API call
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

  // Bill calculations
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

      // Mock opening WhatsApp
      window.open(`https://wa.me/91${watch('ownerMobile')}?text=${encodeURIComponent(message)}`, '_blank');
      toastSuccess('Bill sent via WhatsApp successfully!');
    } catch (err) {
      toastError('Failed to send WhatsApp message');
    }
  };

  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 800));
      console.log('Job Card:', { ...data, services: selectedServices, grandTotal });
      toastSuccess('Job Card created successfully!');
      navigate(ROUTES.JOB_CARDS);
    } catch {
      toastError('Failed to create Job Card.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Job Card (Tablet View)"
        subtitle="Search vehicle, select services, and generate bill"
        breadcrumbs={[
          { label: 'Job Cards', path: '/job-cards' },
          { label: 'Create' },
        ]}
      />

      <Row className="g-4">
        {/* LEFT COLUMN: FORM */}
        <Col lg={8}>
          <div className={styles.formCard}>
            <FormProvider {...methods}>
              <form id="jobCardForm" onSubmit={handleSubmit(onSubmit)}>
                {/* Vehicle Details */}
                <div className={styles.sectionHeader}>
                  <h6 className={styles.sectionTitle}>Vehicle & Customer Information</h6>
                </div>
                <Row className="g-3 align-items-end">
                  <Col md={6}>
                    <div className="d-flex gap-2">
                      <div className="flex-grow-1">
                        <RHFTextField name="vehicleNumber" label="Registration Number" placeholder="TN 01 AB 1234" required />
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
                    <RHFTextField name="makeModel" label="Make & Model" placeholder="e.g. Hyundai Creta" required />
                  </Col>
                  <Col md={6}>
                    <RHFTextField name="ownerName" label="Owner Name" placeholder="Full name" required />
                  </Col>
                  <Col md={6}>
                    <RHFTextField name="ownerMobile" label="Mobile Number" placeholder="10-digit mobile" required />
                  </Col>
                </Row>

                <div className={styles.divider} />

                {/* Service Configuration */}
                <div className={styles.sectionHeader}>
                  <h6 className={styles.sectionTitle}>Service Configuration</h6>
                </div>
                <Row className="g-3">
                  <Col md={4}>
                    <RHFSelect name="serviceType" label="Primary Category" options={SERVICE_TYPES} placeholder="Select category" required />
                  </Col>
                  <Col md={4}>
                    <RHFSelect name="priority" label="Priority" options={PRIORITY_OPTIONS} />
                  </Col>
                  <Col md={4}>
                    <RHFTextField name="deliveryDate" label="Expected Delivery" type="datetime-local" required />
                  </Col>
                </Row>

                <div className={styles.divider} />

                {/* Master Services Selection */}
                <div className={styles.sectionHeader}>
                  <h6 className={styles.sectionTitle}>Master Service List</h6>
                </div>
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

                <div className={styles.divider} />

                <RHFTextarea name="notes" label="Customer Complaints / Notes" placeholder="Enter any specific issues reported by customer..." rows={3} />
              </form>
            </FormProvider>
          </div>
        </Col>

        {/* RIGHT COLUMN: BILL PREVIEW */}
        <Col lg={4}>
          <div className={styles.billCard}>
            <div className={styles.billHeader}>
              <h5 className={styles.billTitle}>Bill Preview</h5>
              <span className={styles.billBadge}>Auto-generated</span>
            </div>

            <div className={styles.billItems}>
              {selectedServices.length === 0 ? (
                <div className={styles.emptyBill}>No services selected</div>
              ) : (
                selectedServices.map((item) => (
                  <div key={item.id} className={styles.billItemRow}>
                    <span className={styles.billItemName}>{item.name} <small>x1</small></span>
                    <span className={styles.billItemPrice}>{formatCurrency(item.price)}</span>
                  </div>
                ))
              )}
            </div>

            <div className={styles.billSummary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax ({companySettings.defaultTaxRate}%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className={styles.grandTotalRow}>
                <span>Grand Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <div className="mt-4 d-flex flex-column gap-3">
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
