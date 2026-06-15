import { Row, Col } from 'react-bootstrap';
import { ArrowLeft, LogIn, LogOut, Clock } from 'lucide-react';
import Button from '../../../../components/common/Button';
import StatusBadge from '../../../../components/common/StatusBadge';
import { formatDateTime } from '../../../../utils/formatters';
import styles from '../../../../pages/GateEntry/GateEntry.module.css';

export default function GateEntryDetails({ vehicle, onBack }) {
  if (!vehicle) return null;

  return (
    <div style={{ background: '#fff', minHeight: '100%', padding: '2rem 2.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem', color: '#152326' }}>
          Vehicle Pass Details
        </h4>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6B7280', fontSize: '0.875rem', fontWeight: 500,
            padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Back to List
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Vehicle Section */}
        <div>
          <h5 style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem', borderBottom: '1.5px solid var(--color-divider)', paddingBottom: '0.25rem' }}>
            Vehicle Information
          </h5>
          <Row className="g-3">
            <Col md={4}>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Vehicle Number</div>
              <div style={{ marginTop: 4 }}><code className={styles.vehicleNum}>{vehicle.vehicleNumber}</code></div>
            </Col>
            <Col md={4}>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Make & Model</div>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginTop: 4 }}>{vehicle.makeModel}</div>
            </Col>
            <Col md={4}>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Status</div>
              <div style={{ marginTop: 4 }}><StatusBadge status={vehicle.status} /></div>
            </Col>
          </Row>
        </div>

        {/* Owner Section */}
        <div>
          <h5 style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem', borderBottom: '1.5px solid var(--color-divider)', paddingBottom: '0.25rem' }}>
            Owner Information
          </h5>
          <Row className="g-3">
            <Col md={4}>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Owner Name</div>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginTop: 4 }}>{vehicle.ownerName}</div>
            </Col>
            <Col md={4}>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Mobile Number</div>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginTop: 4 }}>{vehicle.mobile}</div>
            </Col>
            <Col md={4}>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Email</div>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginTop: 4 }}>{vehicle.email || '—'}</div>
            </Col>
          </Row>
        </div>

        {/* Operations Logs Section */}
        <div>
          <h5 style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem', borderBottom: '1.5px solid var(--color-divider)', paddingBottom: '0.25rem' }}>
            Entry & Exit Timeline
          </h5>
          <Row className="g-3">
            <Col md={6}>
              <div style={{ padding: '1.25rem', background: '#F0FDF4', borderRadius: '8px', border: '1.5px solid #DCFCE7' }}>
                <div style={{ fontWeight: 700, color: '#15803D', fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <LogIn size={16} /> Entry Logged
                </div>
                <div style={{ fontSize: '0.85rem', color: '#15803D' }}>
                  <strong>Time:</strong> {formatDateTime(vehicle.entryTime)}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#15803D', marginTop: '0.25rem' }}>
                  <strong>By:</strong> {vehicle.entryBy}
                </div>
              </div>
            </Col>
            <Col md={6}>
              {vehicle.status === 'COMPLETED' ? (
                <div style={{ padding: '1.25rem', background: '#FEF2F2', borderRadius: '8px', border: '1.5px solid #FEE2E2' }}>
                  <div style={{ fontWeight: 700, color: '#B91C1C', fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <LogOut size={16} style={{ color: '#B91C1C' }} /> Exit Logged
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#B91C1C' }}>
                    <strong>Time:</strong> {formatDateTime(new Date(new Date(vehicle.entryTime).getTime() + 2 * 60 * 60 * 1000).toISOString())}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#B91C1C', marginTop: '0.25rem' }}>
                    <strong>By:</strong> Gate Guard A
                  </div>
                </div>
              ) : (
                <div style={{ padding: '1.25rem', background: '#FFFBEB', borderRadius: '8px', border: '1.5px solid #FEF3C7', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#D97706', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={16} style={{ color: '#D97706' }} /> Exit Pending
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#D97706', marginTop: '0.25rem' }}>
                    Vehicle is currently inside premises.
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>

    </div>
  );
}
