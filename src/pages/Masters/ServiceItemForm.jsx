import { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import useMasterDataStore from '../../store/useMasterDataStore';

export default function ServiceItemForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { masterServices, serviceCategories, addService, updateService } = useMasterDataStore();

  const [form, setForm] = useState({ name: '', category: '', price: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (serviceCategories.length > 0 && !form.category) {
      setForm(prev => ({ ...prev, category: serviceCategories[0].name }));
    }
  }, [serviceCategories, form.category]);

  useEffect(() => {
    if (isEdit && masterServices.length > 0) {
      const item = masterServices.find(s => s.id === id);
      if (item) {
        setForm({ name: item.name, category: item.category || '', price: item.price || 0 });
      }
    }
  }, [isEdit, id, masterServices]);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!form.name || !form.category) {
      alert('Please fill out all required fields.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (isEdit) {
        updateService(id, form);
        toastSuccess(`Service Item "${form.name}" updated successfully.`);
      } else {
        addService(form);
        toastSuccess(`Service Item "${form.name}" created successfully.`);
      }
      navigate(ROUTES.ADMIN_MASTER_ITEMS);
    }, 800);
  };

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

      <Form onSubmit={handleSave}>
        {/* Service Item Information */}
        <p style={{ fontWeight: 600, fontSize: '16px', color: '#152326', marginBottom: '20px' }}>
          Service Item Information
        </p>

        <Row className="g-3 mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Service Item Name *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Wheel Alignment"
                style={{ borderRadius: '8px' }}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Category Group *
              </Form.Label>
              <Form.Select
                style={{ borderRadius: '8px' }}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                {serviceCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </Form.Select>
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
      </Form>
    </div>
  );
}
