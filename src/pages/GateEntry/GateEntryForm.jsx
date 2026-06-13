import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import { vehicleSchema } from '../../validations/vehicleSchema';
import { SERVICE_TYPES, FUEL_TYPES, VEHICLE_TYPES } from '../../constants/statuses';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import RHFTextarea from '../../components/form/RHFTextarea';
import Button from '../../components/common/Button';
import { toastSuccess, toastError } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import styles from './GateEntry.module.css';

export default function GateEntryForm() {
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicleNumber: '',
      ownerName: '',
      ownerMobile: '',
      makeModel: '',
      vehicleType: '',
      fuelType: '',
      serviceType: '',
      notes: '',
      kmReading: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 800));
      console.log('Gate Entry:', data);
      toastSuccess(`Vehicle ${data.vehicleNumber} registered successfully!`);
      navigate(ROUTES.GATE_DASHBOARD);
    } catch {
      toastError('Failed to register vehicle. Please try again.');
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%', padding: '2rem 2.5rem' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem', color: '#152326' }}>
          New Vehicle Entry
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
          <ArrowLeft size={15} /> Back to List
        </button>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          
          {/* Vehicle Information */}
          <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
            Vehicle Information
          </p>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="vehicleNumber" label="Vehicle Number *" placeholder="TN 01 AB 1234" required />
            </Col>
            <Col md={6}>
              <RHFTextField name="makeModel" label="Make & Model *" placeholder="e.g. Hyundai i20" required />
            </Col>
          </Row>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="kmReading" label="KM Reading" placeholder="Enter odometer reading" type="number" />
            </Col>
            <Col md={6}>
              <RHFSelect name="vehicleType" label="Vehicle Type" options={VEHICLE_TYPES} placeholder="Select type" />
            </Col>
          </Row>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFSelect name="fuelType" label="Fuel Type" options={FUEL_TYPES} placeholder="Select fuel type" />
            </Col>
            <Col md={6}>
              <RHFSelect name="serviceType" label="Service Type *" options={SERVICE_TYPES} placeholder="Select service" required />
            </Col>
          </Row>

          <div style={{ borderTop: '1px solid #E2E5DC', margin: '1.5rem 0' }} />

          {/* Owner Information */}
          <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
            Owner Information
          </p>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="ownerName" label="Owner Name *" placeholder="Full name" required />
            </Col>
            <Col md={6}>
              <RHFTextField name="ownerMobile" label="Mobile Number *" placeholder="10-digit mobile" required />
            </Col>
          </Row>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="ownerEmail" label="Email (Optional)" placeholder="owner@email.com" type="email" />
            </Col>
          </Row>

          <div style={{ borderTop: '1px solid #E2E5DC', margin: '1.5rem 0' }} />

          {/* Vehicle Images */}
          <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
            Vehicle Images
          </p>
          <div className={styles.imageUploadArea}>
            <Upload size={32} className={styles.uploadIcon} />
            <p className={styles.uploadText}>Drag & drop vehicle images or <span>browse</span></p>
            <p className={styles.uploadHint}>Supports JPG, PNG up to 10MB each</p>
            <div className={styles.uploadBtnRow}>
              <Button variant="secondary" size="sm" leftIcon={Upload} type="button">
                Upload Images
              </Button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E2E5DC', margin: '1.5rem 0' }} />

          {/* Notes */}
          <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
            Additional Notes
          </p>
          <Row className="g-3 mb-3">
            <Col md={12}>
              <RHFTextarea name="notes" label="Notes / Observations" placeholder="Enter any special notes or customer complaints..." rows={3} />
            </Col>
          </Row>

          {/* Footer Actions */}
          <div style={{
            borderTop: '1px solid #E2E5DC',
            marginTop: '2rem', paddingTop: '1.5rem',
            display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
          }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.GATE_DASHBOARD)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={methods.formState.isSubmitting}
            >
              Submit
            </Button>
          </div>

        </form>
      </FormProvider>
    </div>
  );
}
