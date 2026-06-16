import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import Button from '../../components/common/Button';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import useMasterDataStore from '../../store/useMasterDataStore';
import { formatCurrency } from '../../utils/formatters';

export default function ServicePricingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { masterServices, updateService } = useMasterDataStore();
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      serviceId: '',
      price: 0
    }
  });

  const { handleSubmit, reset, setValue, watch } = methods;
  const watchedServiceId = watch('serviceId');

  useEffect(() => {
    if (masterServices.length > 0 && !watchedServiceId) {
      setValue('serviceId', masterServices[0].id);
      setValue('price', masterServices[0].price || 0);
    }
  }, [masterServices, watchedServiceId, setValue]);

  // Update price when selected service changes
  useEffect(() => {
    if (watchedServiceId) {
      const item = masterServices.find(s => s.id === watchedServiceId);
      if (item) {
        setValue('price', item.price || 0);
      }
    }
  }, [watchedServiceId, masterServices, setValue]);

  useEffect(() => {
    if (isEdit && masterServices.length > 0) {
      const item = masterServices.find(s => s.id === id);
      if (item) {
        reset({
          serviceId: item.id,
          price: item.price || 0
        });
      }
    }
  }, [isEdit, id, masterServices, reset]);

  const onSubmit = (data) => {
    const sId = data.serviceId;
    const priceVal = data.price;
    if (!sId || priceVal < 0) {
      alert('Please fill out all required fields with valid pricing.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const selectedItem = masterServices.find(s => s.id === sId);
      updateService(sId, { price: Number(priceVal) });
      toastSuccess(`Pricing for "${selectedItem.name}" set to ${formatCurrency(priceVal)} successfully.`);
      navigate(ROUTES.ADMIN_MASTER_PRICING);
    }, 800);
  };

  const serviceOptions = masterServices.map(s => ({
    value: s.id,
    label: `${s.name} (${s.category})`
  }));

  return (
    <div style={{ background: '#fff', padding: '32px 40px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '21px', color: '#152326' }}>
          {isEdit ? 'Update' : 'Set'} Service Pricing
        </h4>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN_MASTER_PRICING)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6B7280', fontSize: '14px', fontWeight: 500,
            padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Back to Pricing List
        </button>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFSelect
                name="serviceId"
                label="Select Service Item"
                placeholder="Select Service Item"
                options={serviceOptions}
                disabled={isEdit}
                required
              />
            </Col>
            <Col md={6}>
              <RHFTextField
                name="price"
                label="Base Price (₹)"
                type="number"
                placeholder="e.g. 2500"
                required
              />
            </Col>
          </Row>

          {/* Footer Actions */}
          <div style={{
            borderTop: '1px solid #E2E5DC',
            marginTop: '32px', paddingTop: '24px',
            display: 'flex', justifyContent: 'flex-end', gap: '12px',
          }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_MASTER_PRICING)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={saving}
            >
              Set Price
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
