import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import {
  ClipboardList, Plus, Clock, Package, CheckCircle2,
  AlertCircle, ArrowRight, MessageCircle, Car, User
} from 'lucide-react';
import Button from '../../../../components/common/Button';
import PageHeader from '../../../../components/shared/PageHeader';
import { formatDateTime, formatCurrency } from '../../../../utils/formatters';
import { ROUTES } from '../../../../config/routes';
import useAuthStore from '../../../../store/useAuthStore';

const MOCK_PENDING_JOBS = [
  { id: 'JC-1014', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', serviceType: 'Engine Repair', stage: 'Mechanical', estimatedCost: 4500, status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: 'JC-1013', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', serviceType: 'Oil Change', stage: 'Approval Pending', estimatedCost: 1800, status: 'PENDING', createdAt: new Date(Date.now() - 1.5 * 3600000).toISOString() },
  { id: 'JC-1011', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', serviceType: 'Body Repair', stage: 'Body Shop', estimatedCost: 7200, status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
];

const MOCK_READY = [
  { id: 'JC-1009', vehicleNumber: 'TN 02 CD 5566', ownerName: 'Vinoth Kumar', serviceType: 'General Service', amount: 2800, readySince: new Date(Date.now() - 40 * 60000).toISOString() },
  { id: 'JC-1007', vehicleNumber: 'DL 04 RS 3344', ownerName: 'Suresh Nair', serviceType: 'Full Service', amount: 5400, readySince: new Date(Date.now() - 90 * 60000).toISOString() },
];

const STAGE_COLORS = {
  'Mechanical': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  'Body Shop': { bg: 'rgba(245,158,11,0.1)', color: '#B7791F' },
  'Water Wash': { bg: 'rgba(59,130,246,0.1)', color: '#2563EB' },
  'Approval Pending': { bg: 'rgba(139,92,246,0.1)', color: '#7C3AED' },
  'Ready': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
};

function StagePill({ stage }) {
  const s = STAGE_COLORS[stage] || { bg: '#F1F5F9', color: '#64748B' };
  return (
    <span style={{ background: s.bg, color: s.color, fontWeight: 600, fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px' }}>
      {stage}
    </span>
  );
}

export default function CrmDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const greeting = new Date().getHours() < 12 ? 'Good Morning' : 'Good Afternoon';

  const kpis = [
    { label: "Today's Job Cards", value: MOCK_PENDING_JOBS.length + MOCK_READY.length + 3, icon: ClipboardList, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', path: ROUTES.JOB_CARDS },
    { label: 'Pending Approvals', value: 2, icon: Clock, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', path: ROUTES.CRM_APPROVAL_FOLLOWUP },
    { label: 'Ready for Delivery', value: MOCK_READY.length, icon: Package, color: '#10B981', bg: 'rgba(16,185,129,0.08)', path: ROUTES.CRM_DELIVERY_READY },
    { label: 'Completed Today', value: 5, icon: CheckCircle2, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', path: ROUTES.JOB_CARDS },
  ];

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ')[0] || 'Team'} 👋`}
        subtitle="Your CRM operations overview for today"

      />

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              onClick={() => navigate(k.path)}
              style={{
                background: k.bg, border: `1.5px solid ${k.color}25`,
                borderRadius: '14px', padding: '1.1rem 1.25rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
                cursor: 'pointer', transition: 'transform 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: k.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} style={{ color: k.color }} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginTop: 4 }}>{k.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Row className="g-4">
        {/* Active Job Cards */}
        <Col lg={7}>
          <div className="premium-card">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <ClipboardList size={16} style={{ color: 'var(--color-primary)' }} />
                Active Job Cards
              </h6>
              <Button variant="ghost" size="sm" rightIcon={ArrowRight} onClick={() => navigate(ROUTES.JOB_CARDS)}>
                View All
              </Button>
            </div>
            <div>
              {MOCK_PENDING_JOBS.map((job, i) => (
                <div
                  key={job.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.875rem 1.25rem',
                    borderBottom: i < MOCK_PENDING_JOBS.length - 1 ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Car size={16} style={{ color: '#3B82F6' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <code style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)' }}>{job.id}</code>
                      <StagePill stage={job.stage} />
                    </div>
                    <div style={{ fontSize: '0.82rem' }}><strong>{job.vehicleNumber}</strong> — {job.ownerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {job.serviceType} • Est. {formatCurrency(job.estimatedCost)} • {formatDateTime(job.createdAt)}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" rightIcon={ArrowRight} onClick={() => navigate(`${ROUTES.JOB_CARDS}/${job.id}`)}>
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Ready for Delivery Panel */}
        <Col lg={5}>
          <div className="premium-card" style={{ border: '1.5px solid rgba(16,185,129,0.25)' }}>
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ color: '#10B981' }}>
                <Package size={16} />
                Ready for Delivery
              </h6>
              <Button variant="ghost" size="sm" rightIcon={ArrowRight} onClick={() => navigate(ROUTES.CRM_DELIVERY_READY)}>
                All Ready
              </Button>
            </div>
            <div>
              {MOCK_READY.map((item, i) => (
                <div
                  key={item.id}
                  style={{ padding: '0.875rem 1.25rem', borderBottom: i < MOCK_READY.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <code style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)' }}>{item.id}</code>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', marginTop: 2 }}>{item.vehicleNumber}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{item.ownerName} • {item.serviceType}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#10B981', fontSize: '1rem' }}>{formatCurrency(item.amount)}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Ready {formatDateTime(item.readySince)}</div>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="ghost" leftIcon={MessageCircle} style={{ color: '#25D366', borderColor: '#25D366', fontSize: '0.75rem' }}
                      onClick={() => window.open(`https://wa.me/91${item.ownerMobile}`, '_blank')}>
                      WhatsApp
                    </Button>
                    <Button size="sm" variant="primary" style={{ fontSize: '0.75rem' }} onClick={() => navigate(ROUTES.CRM_DELIVERY_READY)}>
                      Confirm Delivery
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Alert: Pending Approvals */}
          <div style={{
            marginTop: '1rem', background: 'rgba(139,92,246,0.07)',
            border: '1.5px solid rgba(139,92,246,0.2)', borderRadius: '14px', padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <AlertCircle size={24} style={{ color: '#8B5CF6', flexShrink: 0 }} />
            <div className="flex-grow-1">
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#6D28D9' }}>2 Approvals Awaiting</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Customers haven't responded to estimates yet</div>
            </div>
            <Button size="sm" variant="outline" style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
              onClick={() => navigate(ROUTES.CRM_APPROVAL_FOLLOWUP)}>
              Follow Up
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}
