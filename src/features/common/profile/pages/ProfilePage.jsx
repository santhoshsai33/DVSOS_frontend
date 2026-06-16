import { useForm, FormProvider } from 'react-hook-form';
import { Row, Col } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RHFTextField from '../../../../components/form/RHFTextField';
import Button from '../../../../components/common/Button';
import useAuthStore from '../../../../store/useAuthStore';
import { toastSuccess } from '../../../../notifications/toast';
import { ROLE_LABELS } from '../../../../constants/roles';
import { getInitials, avatarColor } from '../../../../utils/helpers';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, role, setUser } = useAuthStore();

  const methods = useForm({
    defaultValues: {
      name: user?.name || 'User',
      email: user?.email || 'user@dvsos.com',
      phone: user?.phone || '+91 98765 43210',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 800)); // Simulate API call
      setUser({ ...user, ...data });
      toastSuccess('Profile updated successfully!');
    } catch {
      toastSuccess('Failed to update profile.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '2rem 2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem', color: '#152326' }}>
          Profile & Settings
        </h4>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6B7280', fontSize: '0.875rem', fontWeight: 500,
            padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2rem' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: avatarColor(user?.name), color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', fontWeight: 'bold'
        }}>
          {getInitials(user?.name || 'U')}
        </div>
        <div>
          <h4 style={{ margin: 0 }}>{user?.name || 'User'}</h4>
          <p className="text-muted" style={{ margin: 0 }}>{ROLE_LABELS[role] || role}</p>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
            Personal Information
          </p>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="name" label="Full Name" placeholder="Enter full name" required />
            </Col>
            <Col md={6}>
              <RHFTextField name="email" label="Email Address" type="email" placeholder="Enter email address" required />
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="phone" label="Phone Number" placeholder="Enter phone number" required />
            </Col>
          </Row>

          <div style={{
            borderTop: '1px solid #E2E5DC',
            marginTop: '2rem', paddingTop: '1.5rem',
            display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
          }}>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => methods.reset()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
