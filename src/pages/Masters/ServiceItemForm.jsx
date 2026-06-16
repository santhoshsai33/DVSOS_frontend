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

export default function ServiceItemForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { masterServices, serviceCategories, addService, updateService } = useMasterDataStore();
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      category: '',
      price: 0
    }
  });

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (serviceCategories.length > 0) {
      setValue('category', serviceCategories[0].name);
    }
  }, [serviceCategories, setValue]);

  useEffect(() => {
    if (isEdit && masterServices.length > 0) {
      const item = masterServices.find(s => s.id === id);
      if (item) {
        reset({
          name: item.name,
          category: item.category || '',
          price: item.price || 0
        });
      }
    }
  }, [isEdit, id, masterServices, reset]);

  const onSubmit = (data) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (isEdit) {
        updateService(id, data);
        toastSuccess(`Service Item "${data.name}" updated successfully.`);
      } else {
        addService(data);
        toastSuccess(`Service Item "${data.name}" created successfully.`);
      }
      navigate(ROUTES.ADMIN_MASTER_ITEMS);
    }, 800);
  };

  const categoryOptions = serviceCategories.map(cat => ({
    value: cat.name,
    label: cat.name
  }));

  return (
    <div style={{ background: '#fff', padding: '32px 40px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '21px', color: '#152326' }}>
          {isEdit ? 'Edit' : 'Add'} Service Item
        </h4>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN_MASTER_ITEMS)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6B7280', fontSize: '14px', fontWeight: 500,
            padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Back to Service Items
        </button>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField
                name="name"
                label="Service Item Name"
                placeholder="e.g. Wheel Alignment"
                required
              />
            </Col>
            <Col md={6}>
              <RHFSelect
                name="category"
                label="Category Group"
                placeholder="Select Category Group"
                options={categoryOptions}
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
              onClick={() => navigate(ROUTES.ADMIN_MASTER_ITEMS)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={saving}
            >
              {isEdit ? 'Save Changes' : 'Create Service Item'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
