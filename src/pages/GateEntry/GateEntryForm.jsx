import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Save, RotateCcw, Upload } from 'lucide-react';
import { vehicleSchema } from '../../validations/vehicleSchema';
import { SERVICE_TYPES, FUEL_TYPES, VEHICLE_TYPES } from '../../constants/statuses';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import RHFTextarea from '../../components/form/RHFTextarea';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
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
    <div>
      <PageHeader
        title="New Vehicle Entry"
        subtitle="Register a new vehicle at the gate"
        breadcrumbs={[
          { label: 'Gate Entry', path: ROUTES.GATE_DASHBOARD },
          { label: 'New Entry' },
        ]}
      />

      <div className={styles.formCard}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Vehicle Information */}
            <div className={styles.sectionHeader}>
              <h6 className={styles.sectionTitle}>Vehicle Information</h6>
            </div>
            <Row className="g-3">
              <Col md={4}>
                <RHFTextField name="vehicleNumber" label="Vehicle Number" placeholder="TN 01 AB 1234" required />
              </Col>
              <Col md={4}>
                <RHFTextField name="makeModel" label="Make & Model" placeholder="e.g. Hyundai i20" required />
              </Col>
              <Col md={4}>
                <RHFTextField name="kmReading" label="KM Reading" placeholder="Enter odometer reading" type="number" />
              </Col>
              <Col md={4}>
                <RHFSelect name="vehicleType" label="Vehicle Type" options={VEHICLE_TYPES} placeholder="Select type" />
              </Col>
              <Col md={4}>
                <RHFSelect name="fuelType" label="Fuel Type" options={FUEL_TYPES} placeholder="Select fuel type" />
              </Col>
              <Col md={4}>
                <RHFSelect name="serviceType" label="Service Type" options={SERVICE_TYPES} placeholder="Select service" required />
              </Col>
            </Row>

            <div className={styles.divider} />

            {/* Owner Information */}
            <div className={styles.sectionHeader}>
              <h6 className={styles.sectionTitle}>Owner Information</h6>
            </div>
            <Row className="g-3">
              <Col md={4}>
                <RHFTextField name="ownerName" label="Owner Name" placeholder="Full name" required />
              </Col>
              <Col md={4}>
                <RHFTextField name="ownerMobile" label="Mobile Number" placeholder="10-digit mobile" required />
              </Col>
              <Col md={4}>
                <RHFTextField name="ownerEmail" label="Email (Optional)" placeholder="owner@email.com" type="email" />
              </Col>
            </Row>

            <div className={styles.divider} />

            {/* Vehicle Images */}
            <div className={styles.sectionHeader}>
              <h6 className={styles.sectionTitle}>Vehicle Images</h6>
            </div>
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

            <div className={styles.divider} />

            {/* Notes */}
            <div className={styles.sectionHeader}>
              <h6 className={styles.sectionTitle}>Additional Notes</h6>
            </div>
            <RHFTextarea name="notes" label="Notes / Observations" placeholder="Enter any special notes or customer complaints..." rows={3} />

            {/* Actions */}
            <div className={styles.formActions}>
              <Button variant="secondary" leftIcon={RotateCcw} onClick={() => methods.reset()} type="button">
                Reset
              </Button>
              <Button variant="secondary" onClick={() => navigate(ROUTES.GATE_DASHBOARD)} type="button">
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={Save}
                type="submit"
                isLoading={methods.formState.isSubmitting}
              >
                Register Vehicle
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
