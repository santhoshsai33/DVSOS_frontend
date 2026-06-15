import { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import useMasterDataStore from '../../store/useMasterDataStore';

export default function ServiceCategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { serviceCategories, addCategory, updateCategory } = useMasterDataStore();

  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && serviceCategories.length > 0) {
      const category = serviceCategories.find(c => c.id === id);
      if (category) {
        setForm({ name: category.name, description: category.description || '' });
      }
    }
  }, [isEdit, id, serviceCategories]);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!form.name) {
      alert('Please enter a category name.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (isEdit) {
        updateCategory(id, form);
        toastSuccess(`Category "${form.name}" updated successfully.`);
      } else {
        addCategory(form);
        toastSuccess(`Category "${form.name}" added successfully.`);
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

      <Form onSubmit={handleSave}>
        {/* Category Information */}
        <p style={{ fontWeight: 600, fontSize: '16px', color: '#152326', marginBottom: '20px' }}>
          Category Information
        </p>

        <Row className="g-3 mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Category Name *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Mechanical, Body Shop"
                style={{ borderRadius: '8px' }}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="g-3 mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter category details..."
                style={{ borderRadius: '8px' }}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Form.Group>
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
      </Form>
    </div>
  );
}

