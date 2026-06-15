import { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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

  const [serviceId, setServiceId] = useState('');
  const [price, setPrice] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (masterServices.length > 0 && !serviceId) {
      setServiceId(masterServices[0].id);
      setPrice(masterServices[0].price || 0);
    }
  }, [masterServices, serviceId]);

  useEffect(() => {
    if (isEdit && masterServices.length > 0) {
      const item = masterServices.find(s => s.id === id);
      if (item) {
        setServiceId(item.id);
        setPrice(item.price || 0);
      }
    }
  }, [isEdit, id, masterServices]);

  const handleServiceChange = (e) => {
    const sId = e.target.value;
    setServiceId(sId);
    const item = masterServices.find(s => s.id === sId);
    if (item) {
      setPrice(item.price || 0);
    }
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!serviceId || price < 0) {
      alert('Please fill out all required fields with valid pricing.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const selectedItem = masterServices.find(s => s.id === serviceId);
      updateService(serviceId, { price: Number(price) });
      toastSuccess(`Pricing for "${selectedItem.name}" set to ${formatCurrency(price)} successfully.`);
      navigate(ROUTES.ADMIN_MASTER_PRICING);
    }, 800);
  };

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

      <Form onSubmit={handleSave}>
        {/* Pricing Details */}
        <p style={{ fontWeight: 600, fontSize: '16px', color: '#152326', marginBottom: '20px' }}>
          Pricing Details
        </p>

        <Row className="g-3 mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Select Service Item *
              </Form.Label>
              <Form.Select
                style={{ borderRadius: '8px' }}
                value={serviceId}
                onChange={handleServiceChange}
                disabled={isEdit}
                required
              >
                {masterServices.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Base Price (₹) *
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g. 2500"
                style={{ borderRadius: '8px' }}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                required
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
      </Form>
    </div>
  );
}
