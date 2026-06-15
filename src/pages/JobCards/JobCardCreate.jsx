import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Form } from 'react-bootstrap';
import { Save, Search, MessageCircle, ArrowLeft } from 'lucide-react';
import { SERVICE_TYPES } from '../../constants/statuses';
import Button from '../../components/common/Button';
import { toastSuccess, toastError, toastInfo } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import { formatCurrency } from '../../utils/formatters';
import styles from './JobCards.module.css';
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

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
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
      // Format datetime-local value (YYYY-MM-DDTHH:mm)
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
      toastSuccess(isEditMode ? 'Job Card updated successfully!' : 'Job Card created successfully!');
      navigate(ROUTES.JOB_CARDS);
    } catch {
      toastError(isEditMode ? 'Failed to update Job Card.' : 'Failed to create Job Card.');
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%', padding: '32px 40px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '21px', color: '#152326' }}>
          {isEditMode ? 'Edit Job Card' : 'Create Job Card'}
        </h4>
        <button
          type="button"
          onClick={() => navigate(ROUTES.JOB_CARDS)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6B7280', fontSize: '14px', fontWeight: 500,
            padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Back to List
        </button>
      </div>

      <Row className="g-4">
        {/* LEFT COLUMN: FORM */}
        <Col lg={8}>
          <Form id="jobCardForm" onSubmit={handleSubmit(onSubmit)}>
            
            <p style={{ fontWeight: 600, fontSize: '16px', color: '#152326', marginBottom: '20px' }}>
              Vehicle & Customer Information
            </p>
            
            <Row className="g-3 mb-3 align-items-end">
              <Col md={6}>
                <div className="d-flex gap-2">
                  <div className="flex-grow-1">
                    <Form.Group>
                      <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Registration Number *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="TN 01 AB 1234"
                        isInvalid={!!errors.vehicleNumber}
                        style={{ borderRadius: '8px' }}
                        {...register("vehicleNumber", { required: "Registration number is required" })}
                      />
                      {errors.vehicleNumber && <Form.Control.Feedback type="invalid">{errors.vehicleNumber.message}</Form.Control.Feedback>}
                    </Form.Group>
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
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Make & Model *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Hyundai Creta"
                    isInvalid={!!errors.makeModel}
                    style={{ borderRadius: '8px' }}
                    {...register("makeModel", { required: "Make & model is required" })}
                  />
                  {errors.makeModel && <Form.Control.Feedback type="invalid">{errors.makeModel.message}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Owner Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Full name"
                    isInvalid={!!errors.ownerName}
                    style={{ borderRadius: '8px' }}
                    {...register("ownerName", { required: "Owner name is required" })}
                  />
                  {errors.ownerName && <Form.Control.Feedback type="invalid">{errors.ownerName.message}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Mobile Number *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="10-digit mobile"
                    isInvalid={!!errors.ownerMobile}
                    style={{ borderRadius: '8px' }}
                    {...register("ownerMobile", { required: "Mobile number is required" })}
                  />
                  {errors.ownerMobile && <Form.Control.Feedback type="invalid">{errors.ownerMobile.message}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>

            <div style={{ borderTop: '1px solid #E2E5DC', margin: '24px 0' }} />

            <p style={{ fontWeight: 600, fontSize: '16px', color: '#152326', marginBottom: '20px' }}>
              Service Configuration
            </p>
            
            <Row className="g-3 mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Primary Category *</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.serviceType}
                    style={{ borderRadius: '8px' }}
                    {...register("serviceType", { required: "Service category is required" })}
                  >
                    <option value="">Select category</option>
                    {serviceCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </Form.Select>
                  {errors.serviceType && <Form.Control.Feedback type="invalid">{errors.serviceType.message}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Priority</Form.Label>
                  <Form.Select
                    style={{ borderRadius: '8px' }}
                    {...register("priority")}
                  >
                    {PRIORITY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Expected Delivery *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    isInvalid={!!errors.deliveryDate}
                    style={{ borderRadius: '8px' }}
                    {...register("deliveryDate", { required: "Delivery date is required" })}
                  />
                  {errors.deliveryDate && <Form.Control.Feedback type="invalid">{errors.deliveryDate.message}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>

            <div style={{ borderTop: '1px solid #E2E5DC', margin: '24px 0' }} />

            <p style={{ fontWeight: 600, fontSize: '16px', color: '#152326', marginBottom: '20px' }}>
              Master Service List
            </p>
            
            <div className={styles.serviceGrid}>
              {filteredServices.map((service) => {
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

            <div style={{ borderTop: '1px solid #E2E5DC', margin: '24px 0' }} />

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Customer Complaints / Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter any specific issues reported by customer..."
                style={{ borderRadius: '8px' }}
                {...register("notes")}
              />
            </Form.Group>
          </Form>
        </Col>

          {/* RIGHT COLUMN: BILL PREVIEW */}
          <Col lg={4}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #E2E5DC', position: 'sticky', top: '80px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed #E2E5DC' }}>
                <h5 style={{ margin: 0, fontWeight: 700, fontSize: '18px', color: '#152326' }}>Bill Preview</h5>
                <span style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '12px', fontWeight: 600 }}>Auto-generated</span>
              </div>

              <div style={{ minHeight: '150px', maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                {selectedServices.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: '#6B7280', fontSize: '14px', fontStyle: 'italic' }}>No services selected</div>
                ) : (
                  selectedServices.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                      <span style={{ fontSize: '14px', color: '#152326', fontWeight: 500 }}>{item.name} <small style={{ color: '#6B7280' }}>x1</small></span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#152326' }}>{formatCurrency(item.price)}</span>
                    </div>
                  ))
                )}
              </div>

              <div style={{ background: '#fff', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #E2E5DC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B5563' }}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B5563' }}>
                  <span>Tax ({companySettings.defaultTaxRate}%)</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: 700, color: '#0F766E', paddingTop: '8px', marginTop: '4px', borderTop: '1px dashed #E2E5DC' }}>
                  <span>Grand Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
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
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
}
