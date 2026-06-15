import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form } from 'react-bootstrap';
import { ArrowLeft, Upload } from 'lucide-react';
import { FUEL_TYPES, VEHICLE_TYPES } from '../../constants/statuses';
import Button from '../../components/common/Button';
import { toastSuccess, toastError } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import styles from './GateEntry.module.css';

export default function GateEntryForm({ onCancel, onSuccess }) {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      vehicleNumber: '',
      ownerName: '',
      ownerMobile: '',
      makeModel: '',
      vehicleType: '',
      fuelType: '',
      notes: '',
      kmReading: '',
      ownerEmail: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 800));
      console.log('Gate Entry:', data);
      toastSuccess(`Vehicle ${data.vehicleNumber} registered successfully!`);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(ROUTES.GATE_DASHBOARD);
      }
    } catch {
      toastError('Failed to register vehicle. Please try again.');
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%', padding: '32px 40px' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '21px', color: '#152326' }}>
          New Vehicle Entry
        </h4>
        <button
          type="button"
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              navigate(ROUTES.GATE_DASHBOARD);
            }
          }}
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

      <Form onSubmit={handleSubmit(onSubmit)}>

        {/* Vehicle Information */}
        <p style={{ fontWeight: 600, fontSize: '16px', color: '#152326', marginBottom: '20px' }}>
          Vehicle Information
        </p>
        <Row className="g-3 mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Vehicle Number *</Form.Label>
              <Form.Control
                type="text"
                placeholder="TN 01 AB 1234"
                isInvalid={!!errors.vehicleNumber}
                style={{ borderRadius: '8px' }}
                {...register("vehicleNumber", { required: "Vehicle number is required" })}
              />
              {errors.vehicleNumber && <Form.Control.Feedback type="invalid">{errors.vehicleNumber.message}</Form.Control.Feedback>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Make & Model *</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Hyundai i20"
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
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>KM Reading</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter odometer reading"
                style={{ borderRadius: '8px' }}
                {...register("kmReading")}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Vehicle Type</Form.Label>
              <Form.Select
                style={{ borderRadius: '8px' }}
                {...register("vehicleType")}
              >
                <option value="">Select type</option>
                {VEHICLE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className="g-3 mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Fuel Type</Form.Label>
              <Form.Select
                style={{ borderRadius: '8px' }}
                {...register("fuelType")}
              >
                <option value="">Select fuel type</option>
                {FUEL_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div style={{ borderTop: '1px solid #E2E5DC', margin: '24px 0' }} />

        {/* Owner Information */}
        <p style={{ fontWeight: 600, fontSize: '16px', color: '#152326', marginBottom: '20px' }}>
          Owner Information
        </p>
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
        <Row className="g-3 mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Email (Optional)</Form.Label>
              <Form.Control
                type="email"
                placeholder="owner@email.com"
                style={{ borderRadius: '8px' }}
                {...register("ownerEmail")}
              />
            </Form.Group>
          </Col>
        </Row>

        <div style={{ borderTop: '1px solid #E2E5DC', margin: '24px 0' }} />

        {/* Vehicle Images */}
        <p style={{ fontWeight: 600, fontSize: '16px', color: '#152326', marginBottom: '20px' }}>
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

        <div style={{ borderTop: '1px solid #E2E5DC', margin: '24px 0' }} />

        {/* Notes */}
        <p style={{ fontWeight: 600, fontSize: '16px', color: '#152326', marginBottom: '20px' }}>
          Additional Notes
        </p>
        <Row className="g-3 mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Notes / Observations</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter any special notes or customer complaints..."
                style={{ borderRadius: '8px' }}
                {...register("notes")}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Footer Actions */}
        <div style={{
          borderTop: '1px solid #E2E5DC',
          marginTop: '32px', paddingTop: '24px',
          display: 'flex', justifyContent: 'flex-end', gap: '12px',
        }}>
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                navigate(ROUTES.GATE_DASHBOARD);
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
          >
            Submit
          </Button>
        </div>

      </Form>
    </div>
  );
}
