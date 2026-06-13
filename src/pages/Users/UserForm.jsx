import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Row, Col } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import Button from '../../components/common/Button';
import { toastSuccess, toastError } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import { ROLE_LABELS, ROLES } from '../../constants/roles';

const ROLE_OPTIONS = Object.entries(ROLE_LABELS)
  .filter(([val]) => val !== ROLES.SUPER_ADMIN)
  .map(([value, label]) => ({ value, label }));

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const MOCK_USER = {
  name: 'Rajan Kumar',
  email: 'rajan@dvsos.com',
  mobile: '9876543210',
  role: ROLES.FLOOR_SUPERVISOR,
  status: 'ACTIVE',
};

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const methods = useForm({
    defaultValues: isEdit
      ? MOCK_USER
      : { name: '', email: '', mobile: '', role: '', status: 'ACTIVE', password: '', confirmPassword: '' },
  });

  const { handleSubmit, formState } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 800));
      toastSuccess(isEdit ? `User "${data.name}" updated!` : `User "${data.name}" created!`);
      navigate(ROUTES.ADMIN_USERS);
    } catch {
      toastError('Failed to save. Please try again.');
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%', padding: '2rem 2.5rem' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem', color: '#152326' }}>
          {isEdit ? 'Edit User' : 'Add New User'}
        </h4>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN_USERS)}
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
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Section: User Information */}
          <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
            User Information
          </p>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="name" label="Full Name *" placeholder="Enter full name" required />
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
              <RHFSelect name="role" label="Role *" options={ROLE_OPTIONS} placeholder="Select role" required />
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFSelect name="status" label="Account Status" options={STATUS_OPTIONS} />
            </Col>
          </Row>

          {/* Password — only on Add */}
          {!isEdit && (
            <>
              <div style={{ borderTop: '1px solid #E2E5DC', margin: '1.5rem 0' }} />
              <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
                Security
              </p>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <RHFTextField name="password" label="Temporary Password *" type="password" placeholder="Enter temporary password" required />
                </Col>
                <Col md={6}>
                  <RHFTextField name="confirmPassword" label="Confirm Password *" type="password" placeholder="Re-enter password" required />
                </Col>
              </Row>
            </>
          )}

          {/* Footer Actions */}
          <div style={{
            borderTop: '1px solid #E2E5DC',
            marginTop: '2rem', paddingTop: '1.5rem',
            display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
          }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_USERS)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={formState.isSubmitting}
            >
              {isEdit ? 'Save Changes' : 'Submit'}
            </Button>
          </div>

        </form>
      </FormProvider>
    </div>
  );
}
