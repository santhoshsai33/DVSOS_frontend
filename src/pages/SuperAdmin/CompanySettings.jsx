import { useForm, FormProvider } from 'react-hook-form';
import { Row, Col } from 'react-bootstrap';
import { Save, Building2 } from 'lucide-react';
import RHFTextField from '../../components/form/RHFTextField';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { toastSuccess } from '../../notifications/toast';
import useMasterDataStore from '../../store/useMasterDataStore';

export default function CompanySettings() {
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <PageHeader
        title="Company Settings"
        subtitle="Manage overall company information and defaults"
        breadcrumbs={[
          { label: 'System Settings', path: '/admin/settings' },
          { label: 'Company Settings' },
        ]}
      />

      <div className="premium-card p-4 mx-auto" style={{ maxWidth: '800px' }}>
        <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
          <div className="icon-wrapper" style={{ background: 'var(--color-primary)', color: '#fff', padding: '0.75rem', borderRadius: '12px' }}>
            <Building2 size={24} />
          </div>
          <div>
            <h5 className="mb-1 fw-bold">Company Profile</h5>
            <p className="text-muted mb-0 small">This information is used on job cards and billing.</p>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row className="g-4">
              <Col md={12}>
                <RHFTextField name="companyName" label="Company Name" placeholder="e.g. DVSOS Auto Services" required />
              </Col>
              <Col md={6}>
                <RHFTextField name="phone" label="Contact Phone" placeholder="e.g. +91 98765 43210" required />
              </Col>
              <Col md={6}>
                <RHFTextField name="email" label="Contact Email" type="email" placeholder="e.g. info@company.com" required />
              </Col>
              <Col md={12}>
                <RHFTextField name="address" label="Registered Address" placeholder="Full address" required />
              </Col>
              <Col md={6}>
                <RHFTextField name="gstNumber" label="GST Number" placeholder="Enter GSTIN" required />
              </Col>
              <Col md={6}>
                <RHFTextField name="defaultTaxRate" label="Default Tax Rate (%)" type="number" required />
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4 pt-3 border-top">
              <Button 
                variant="primary" 
                type="submit" 
                leftIcon={Save} 
                isLoading={formState.isSubmitting}
              >
                Save Settings
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
