import { useForm, FormProvider } from 'react-hook-form';
import { Row, Col } from 'react-bootstrap';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RHFTextField from '../../components/form/RHFTextField';
import Button from '../../components/common/Button';
import { toastSuccess } from '../../notifications/toast';
import useMasterDataStore from '../../store/useMasterDataStore';
import { ROUTES } from '../../config/routes';

export default function CompanySettings() {
  const navigate = useNavigate();
  const { companySettings, updateCompanySettings } = useMasterDataStore();

  const methods = useForm({
    defaultValues: {
      companyName: companySettings.companyName || '',
      address: companySettings.address || '',
      phone: companySettings.phone || '',
      email: companySettings.email || '',
      gstNumber: companySettings.gstNumber || '',
      defaultTaxRate: companySettings.defaultTaxRate || 18,
    },
  });

  const { handleSubmit, formState } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 600)); // Simulating API call
      updateCompanySettings(data);
      toastSuccess('Company settings updated successfully!');
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%', padding: '2rem 2.5rem' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem', color: '#152326' }}>
          Company Settings
        </h4>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6B7280', fontSize: '0.875rem', fontWeight: 500,
            padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </button>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
            Company Profile
          </p>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="companyName" label="Company Name *" placeholder="e.g. DVSOS Auto Services" required />
            </Col>
            <Col md={6}>
              <RHFTextField name="address" label="Registered Address *" placeholder="Full address" required />
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="phone" label="Contact Phone *" placeholder="e.g. +91 98765 43210" required />
            </Col>
            <Col md={6}>
              <RHFTextField name="email" label="Contact Email *" type="email" placeholder="e.g. info@company.com" required />
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField name="gstNumber" label="GST Number *" placeholder="Enter GSTIN" required />
            </Col>
            <Col md={6}>
              <RHFTextField name="defaultTaxRate" label="Default Tax Rate (%) *" type="number" required />
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
              onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              isLoading={formState.isSubmitting}
            >
              Submit
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
