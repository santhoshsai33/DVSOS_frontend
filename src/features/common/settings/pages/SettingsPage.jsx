import { useForm, FormProvider } from 'react-hook-form';
import { Row, Col } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RHFTextField from '../../../../components/form/RHFTextField';
import Button from '../../../../components/common/Button';
import { toastSuccess, toastError } from '../../../../notifications/toast';

export default function SettingsPage() {
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit, formState: { isSubmitting }, reset } = methods;

  const onSubmit = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toastError('New passwords do not match');
        return;
      }
      await new Promise((r) => setTimeout(r, 800)); // Simulate API call
      toastSuccess('Password changed successfully!');
      reset();
    } catch {
      toastError('Failed to change password.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '2rem 2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem', color: '#152326' }}>
          Change Password
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

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
            Security Settings
          </p>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="currentPassword" label="Current Password" type="password" placeholder="Enter current password" required />
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="newPassword" label="New Password" type="password" placeholder="Enter new password" required />
            </Col>
            <Col md={6}>
              <RHFTextField name="confirmPassword" label="Confirm New Password" type="password" placeholder="Re-enter new password" required />
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
              Update Password
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => reset()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
