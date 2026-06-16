import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import RHFTextField from '../../components/form/RHFTextField';
import RHFTextarea from '../../components/form/RHFTextarea';
import Button from '../../components/common/Button';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import useMasterDataStore from '../../store/useMasterDataStore';

export default function ServiceCategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { serviceCategories, addCategory, updateCategory } = useMasterDataStore();
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (isEdit && serviceCategories.length > 0) {
      const category = serviceCategories.find(c => c.id === id);
      if (category) {
        reset({
          name: category.name,
          description: category.description || ''
        });
      }
    }
  }, [isEdit, id, serviceCategories, reset]);

  const onSubmit = (data) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (isEdit) {
        updateCategory(id, data);
        toastSuccess(`Category "${data.name}" updated successfully.`);
      } else {
        addCategory(data);
        toastSuccess(`Category "${data.name}" added successfully.`);
      }
      navigate(ROUTES.ADMIN_MASTER_CATEGORIES);
    }, 800);
  };

  return (
    <div style={{ background: '#fff', padding: '32px 40px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '21px', color: '#152326' }}>
          {isEdit ? 'Edit' : 'Add'} Service Category
        </h4>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN_MASTER_CATEGORIES)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6B7280', fontSize: '14px', fontWeight: 500,
            padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Back to Categories
        </button>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <RHFTextField
                name="name"
                label="Category Name"
                placeholder="e.g. Mechanical, Body Shop"
                required
              />
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col md={12}>
              <RHFTextarea
                name="description"
                label="Description"
                rows={4}
                placeholder="Enter category details..."
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
              onClick={() => navigate(ROUTES.ADMIN_MASTER_CATEGORIES)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={saving}
            >
              {isEdit ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
