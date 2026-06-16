import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Clock, Car } from 'lucide-react';
import { Row, Col, Card } from 'react-bootstrap';
import PageHeader from '../../../../components/shared/PageHeader';
import Button from '../../../../components/common/Button';
import { ROUTES } from '../../../../config/routes';

// Mock service history for customers
const MOCK_SERVICE_HISTORY = {
  '1': [
    { jobCardId: 'JC-1001', vehicle: 'TN 58 AB 1234 (Swift)', date: '2026-05-12', service: 'Oil Change, Brake Pad Replacement', cost: 3000, status: 'Completed' },
    { jobCardId: 'JC-1002', vehicle: 'TN 58 AB 1234 (Swift)', date: '2026-03-22', service: 'General Service', cost: 2500, status: 'Completed' }
  ],
  '2': [
    { jobCardId: 'JC-1003', vehicle: 'TN 57 XY 9876 (i20)', date: '2026-06-02', service: 'Premium Water Wash', cost: 600, status: 'Completed' }
  ],
  '3': [
    { jobCardId: 'JC-1004', vehicle: 'TN 59 MM 5555 (Innova)', date: '2026-06-10', service: 'Interior Detailing, AC Servicing', cost: 3000, status: 'Completed' },
    { jobCardId: 'JC-1005', vehicle: 'TN 59 MM 5555 (Innova)', date: '2026-04-18', service: 'Body Dent & Paint', cost: 12000, status: 'Completed' }
  ],
  '4': []
};

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('dvsos_customers') || '[]');
      const found = saved.find(c => String(c.id) === String(id));
      setCustomer(found || null);
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  if (!customer) {
    return (
      <div className="p-4 text-center">
        <h5 className="text-muted">Customer not found</h5>
        <Button variant="primary" className="mt-3" onClick={() => navigate(ROUTES.CUSTOMERS)}>
          Back to Directory
        </Button>
      </div>
    );
  }

  const history = MOCK_SERVICE_HISTORY[customer.id] || [];

  return (
    <div>
      <PageHeader
        title="Customer Profile"
        breadcrumbs={[{ label: 'Customers', path: ROUTES.CUSTOMERS }, { label: customer.name }]}
        actions={
          <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate(ROUTES.CUSTOMERS)}>
            Back to Directory
          </Button>
        }
      />

      <Row className="g-4">
        {/* Profile Info */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '12px', height: '100%' }}>
            <div className="text-center mb-4">
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
                color: '#fff',
                fontSize: '2rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)'
              }}>
                {customer.name.charAt(0)}
              </div>
              <h5 style={{ fontWeight: 700, margin: '0 0 4px 0' }}>{customer.name}</h5>
              <span className={`badge ${customer.status === 'ACTIVE' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'}`}>
                {customer.status}
              </span>
            </div>

            <hr style={{ borderStyle: 'dashed', color: '#CBD5E0' }} />

            <div className="d-flex flex-column gap-3 mt-2">
              <div className="d-flex align-items-center gap-3">
                <Mail size={18} className="text-muted" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Email Address</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{customer.email}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <Phone size={18} className="text-muted" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Mobile Number</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{customer.mobile}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <MapPin size={18} className="text-muted" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Address</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{customer.address || '-'}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <Calendar size={18} className="text-muted" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Service Visits</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{customer.visits || 0} visits</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Service History */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '12px', height: '100%' }}>
            <h5 className="mb-4 fs-6 fw-bold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} className="text-primary" /> Service History & Job Cards
            </h5>

            {history.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <Car size={36} className="mb-2 text-muted opacity-50" />
                <p style={{ fontSize: '0.9rem' }}>No past service visits recorded for this customer.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr style={{ background: '#F8F9FA' }}>
                      <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', padding: '12px' }}>Job Card</th>
                      <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', padding: '12px' }}>Vehicle</th>
                      <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', padding: '12px' }}>Date</th>
                      <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', padding: '12px' }}>Services Rendered</th>
                      <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', padding: '12px' }}>Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i}>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{h.jobCardId}</span>
                        </td>
                        <td style={{ fontSize: '0.875rem', fontWeight: 500, padding: '12px' }}>{h.vehicle}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', padding: '12px' }}>{h.date}</td>
                        <td style={{ fontSize: '0.85rem', padding: '12px' }}>{h.service}</td>
                        <td style={{ fontSize: '0.875rem', fontWeight: 600, padding: '12px' }}>₹{h.cost.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
