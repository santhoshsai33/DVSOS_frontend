import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Row, Col } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import RHFTextField from '../../../../components/form/RHFTextField';
import RHFTextarea from '../../../../components/form/RHFTextarea';
import RHFSelect from '../../../../components/form/RHFSelect';
import Button from '../../../../components/common/Button';
import { toastSuccess } from '../../../../notifications/toast';
import { ROUTES } from '../../../../config/routes';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export default function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      address: '',
      status: 'ACTIVE'
    }
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (isEdit) {
      try {
        const saved = JSON.parse(localStorage.getItem('dvsos_customers') || '[]');
        const customer = saved.find(c => String(c.id) === String(id));
        if (customer) {
          reset({
            name: customer.name,
            email: customer.email,
            mobile: customer.mobile,
            address: customer.address || '',
            status: customer.status || 'ACTIVE'
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isEdit, id, reset]);

  const onSubmit = (data) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      try {
        const saved = JSON.parse(localStorage.getItem('dvsos_customers') || '[]');
        if (isEdit) {
          const updated = saved.map(c => String(c.id) === String(id) ? { ...c, ...data } : c);
          localStorage.setItem('dvsos_customers', JSON.stringify(updated));
          toastSuccess(`Customer "${data.name}" updated successfully.`);
        } else {
          const newCustomer = {
            id: `CUST${Date.now()}`,
            ...data,
            visits: 0
          };
          saved.unshift(newCustomer);
          localStorage.setItem('dvsos_customers', JSON.stringify(saved));
          toastSuccess(`Customer "${data.name}" added successfully.`);
        }
      } catch (e) {
        console.error(e);
      }
      navigate(ROUTES.CUSTOMERS);
    }, 800);
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%', padding: '2rem 2.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '20px', color: '#152326' }}>
          {isEdit ? 'Edit Customer' : 'Add New Customer'}
        </h4>
        <button
          type="button"
          onClick={() => navigate(ROUTES.CUSTOMERS)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6B7280', fontSize: '14px', fontWeight: 500,
            padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Back to List
        </button>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Section: Customer Information */}
          <p style={{ fontWeight: 600, fontSize: '16px', color: '#152326', marginBottom: '1.25rem' }}>
            Customer Information
          </p>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="name" label="Customer Full Name *" placeholder="Enter full name" required />
            </Col>
            <Col md={6}>
              <RHFTextField name="email" label="Email Address *" type="email" placeholder="Enter email address" required />
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="mobile" label="Mobile Number *" placeholder="Enter mobile number" required />
            </Col>
            <Col md={6}>
              <RHFSelect name="status" label="Status" options={STATUS_OPTIONS} />
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col md={12}>
              <RHFTextarea name="address" label="Billing Address" placeholder="Enter address details" rows={3} />
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
              onClick={() => navigate(ROUTES.CUSTOMERS)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={saving}
            >
              {isEdit ? 'Save Changes' : 'Submit'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
