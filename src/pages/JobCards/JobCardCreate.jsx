import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Save, RotateCcw } from 'lucide-react';
import { jobCardSchema } from '../../validations/jobCardSchema';
import { SERVICE_TYPES, FUEL_TYPES } from '../../constants/statuses';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import RHFTextarea from '../../components/form/RHFTextarea';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { toastSuccess, toastError } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import styles from './JobCards.module.css';
import { useState } from 'react';

const AVAILABLE_SERVICES = [
  'Oil Change', 'Brake Service', 'AC Service', 'Tyre Rotation',
  'Engine Check', 'Battery Service', 'Body Repair', 'Paint Work',
  'Water Wash', 'Full Inspection', 'Wheel Alignment', 'Suspension Check',
];

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export default function JobCardCreate() {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);

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
      services: [],
    },
  });

  const toggleService = (service) => {
    const updated = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];
    setSelectedServices(updated);
    methods.setValue('services', updated);
  };

  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 800));
      console.log('Job Card:', { ...data, services: selectedServices });
      toastSuccess('Job Card created successfully!');
      navigate(ROUTES.JOB_CARDS);
    } catch {
      toastError('Failed to create Job Card.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Job Card"
        subtitle="Fill in the details to create a new service job card"
        breadcrumbs={[
          { label: 'Job Cards', path: '/job-cards' },
          { label: 'Create' },
        ]}
      />

      <div className={styles.formCard}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Vehicle Details */}
            <div className={styles.sectionHeader}>
              <h6 className={styles.sectionTitle}>Vehicle Information</h6>
            </div>
            <Row className="g-3">
              <Col md={4}>
                <RHFTextField name="vehicleNumber" label="Vehicle Number" placeholder="TN 01 AB 1234" required />
              </Col>
              <Col md={4}>
                <RHFTextField name="ownerName" label="Owner Name" placeholder="Full name" required />
              </Col>
              <Col md={4}>
                <RHFTextField name="ownerMobile" label="Mobile Number" placeholder="10-digit mobile" required />
              </Col>
              <Col md={4}>
                <RHFTextField name="makeModel" label="Make & Model" placeholder="e.g. Hyundai i20" required />
              </Col>
              <Col md={4}>
                <RHFSelect name="serviceType" label="Primary Service" options={SERVICE_TYPES} placeholder="Select service type" required />
              </Col>
              <Col md={4}>
                <RHFSelect name="priority" label="Priority" options={PRIORITY_OPTIONS} />
              </Col>
            </Row>

            <div className={styles.divider} />

            {/* Services */}
            <div className={styles.sectionHeader}>
              <h6 className={styles.sectionTitle}>Services Required</h6>
            </div>
            <div className={styles.serviceGrid}>
              {AVAILABLE_SERVICES.map((service) => (
                <div
                  key={service}
                  className={[styles.serviceItem, selectedServices.includes(service) ? styles.selected : ''].join(' ')}
                  onClick={() => toggleService(service)}
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => {}}
                    style={{ width: 16, height: 16, accentColor: 'var(--color-accent)' }}
                  />
                  {service}
                </div>
              ))}
            </div>

            <div className={styles.divider} />

            {/* Cost & Assignment */}
            <div className={styles.sectionHeader}>
              <h6 className={styles.sectionTitle}>Cost & Assignment</h6>
            </div>
            <Row className="g-3">
              <Col md={4}>
                <RHFTextField name="estimatedCost" label="Estimated Cost (₹)" placeholder="Enter estimated cost" type="number" />
              </Col>
              <Col md={4}>
                <RHFTextField name="technician" label="Assign Technician" placeholder="Technician name" />
              </Col>
            </Row>

            <div className={styles.divider} />

            <RHFTextarea name="notes" label="Notes / Customer Complaints" placeholder="Enter special instructions or complaints..." rows={3} />

            <div className={styles.formActions}>
              <Button variant="secondary" leftIcon={RotateCcw} onClick={() => { methods.reset(); setSelectedServices([]); }} type="button">
                Reset
              </Button>
              <Button variant="secondary" onClick={() => navigate(ROUTES.JOB_CARDS)} type="button">
                Cancel
              </Button>
              <Button variant="primary" leftIcon={Save} type="submit" isLoading={methods.formState.isSubmitting}>
                Create Job Card
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
