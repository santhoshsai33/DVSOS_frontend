import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Send, Image as ImageIcon } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/common/Button';
import RHFTextField from '../../components/form/RHFTextField';
import RHFTextarea from '../../components/form/RHFTextarea';
import { toastSuccess } from '../../notifications/toast';

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
    navigate('/additional-work/status');
  };

  return (
    <div>
      <PageHeader
        title="Request Additional Work"
        subtitle="Log repair needs beyond original scope and seek customer WhatsApp approval"
        breadcrumbs={[{ label: 'Additional Work' }, { label: 'Create Request' }]}
      />

      <div style={{ background: 'var(--color-bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <RHFTextField name="vehicleNumber" label="Vehicle Number / Job Card ID" placeholder="Enter Vehicle No" required />
            <RHFTextarea name="description" label="Additional Work Description" placeholder="Explain the extra work required..." rows={4} required />
            <RHFTextField name="estimatedCost" label="Estimated Additional Cost (₹)" placeholder="0.00" type="number" required />
            
            <div className="d-flex align-items-center gap-2 mt-2 mb-3 text-muted" style={{ fontSize: '0.85rem' }}>
               <ImageIcon size={16} /> <span>You can attach photos to this request from the mobile/tablet app.</span>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
              <Button variant="secondary" type="button" onClick={() => navigate('/work-queue/mechanical')}>Cancel</Button>
              <Button variant="primary" type="submit" leftIcon={Send} isLoading={methods.formState.isSubmitting}>
                Send WhatsApp Approval
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
