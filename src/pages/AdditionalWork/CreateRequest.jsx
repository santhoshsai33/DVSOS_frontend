import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Send, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { Row, Col } from 'react-bootstrap';
import Button from '../../components/common/Button';
import RHFTextField from '../../components/form/RHFTextField';
import RHFTextarea from '../../components/form/RHFTextarea';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';

export default function CreateRequest() {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      vehicleNumber: '',
      description: '',
      estimatedCost: '',
    }
  });

  const onSubmit = async (data) => {
    // Simulate sending WhatsApp request
    await new Promise(r => setTimeout(r, 800));
    toastSuccess('Approval request sent to customer via WhatsApp');
    navigate(ROUTES.FLOOR_WORK_STATUS);
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%', padding: '2rem 2.5rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem', color: '#152326' }}>
          Request Additional Work
        </h4>
        <button
          type="button"
          onClick={() => navigate(ROUTES.FLOOR_MECHANICAL_QUEUE)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6B7280', fontSize: '0.875rem', fontWeight: 500,
            padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Back to Queue
        </button>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          
          <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
            Work Details
          </p>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="vehicleNumber" label="Vehicle Number / Job Card ID *" placeholder="Enter Vehicle No" required />
            </Col>
            <Col md={6}>
              <RHFTextField name="estimatedCost" label="Estimated Additional Cost (₹) *" placeholder="0.00" type="number" required />
            </Col>
          </Row>
          
          <Row className="g-3 mb-3">
            <Col md={12}>
              <RHFTextarea name="description" label="Additional Work Description *" placeholder="Explain the extra work required..." rows={4} required />
            </Col>
          </Row>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
             <ImageIcon size={16} /> <span>You can attach photos to this request from the mobile/tablet app.</span>
          </div>

          {/* Footer Actions */}
          <div style={{
            borderTop: '1px solid #E2E5DC',
            marginTop: '2rem', paddingTop: '1.5rem',
            display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
          }}>
            <Button variant="secondary" type="button" onClick={() => navigate(ROUTES.FLOOR_MECHANICAL_QUEUE)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" leftIcon={Send} isLoading={methods.formState.isSubmitting}>
              Send WhatsApp Approval
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
