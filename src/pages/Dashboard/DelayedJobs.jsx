import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { AlertTriangle, Clock, Car, Wrench, PhoneCall, ChevronRight } from 'lucide-react';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import DataTable from '../../components/common/DataTable';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDateTime } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { toastInfo } from '../../notifications/toast';

const now = Date.now();

const MOCK_DELAYED = [
  {
    id: 'JC-1012', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', mobile: '9876543210',
    makeModel: 'Hyundai i20', serviceType: 'Engine Repair', stage: 'Mechanical',
    promisedDelivery: new Date(now - 5 * 3600000).toISOString(),
    delayHours: 5.2, priority: 'HIGH',
  },
  {
    id: 'JC-1008', vehicleNumber: 'DL 04 RS 3344', ownerName: 'Suresh Nair', mobile: '9876543213',
    makeModel: 'Toyota Fortuner', serviceType: 'Full Service', stage: 'Body Shop',
    promisedDelivery: new Date(now - 2.5 * 3600000).toISOString(),
    delayHours: 2.5, priority: 'URGENT',
  },
  {
    id: 'JC-1003', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', mobile: '9876543212',
    makeModel: 'Honda City', serviceType: 'Body Repair', stage: 'Water Wash',
    promisedDelivery: new Date(now - 1.2 * 3600000).toISOString(),
    delayHours: 1.2, priority: 'NORMAL',
  },
  {
    id: 'JC-0998', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', mobile: '9876543211',
    makeModel: 'Maruti Swift', serviceType: 'Oil Change', stage: 'Mechanical',
    promisedDelivery: new Date(now - 8 * 3600000).toISOString(),
    delayHours: 8, priority: 'HIGH',
  },
  {
    id: 'JC-0991', vehicleNumber: 'TN 09 LM 8899', ownerName: 'Deepa Menon', mobile: '9876543214',
    makeModel: 'Mahindra XUV500', serviceType: 'Brake Service', stage: 'Approval Pending',
    promisedDelivery: new Date(now - 3 * 3600000).toISOString(),
    delayHours: 3, priority: 'HIGH',
  },
];

const PRIORITY_COLORS = { URGENT: '#EF4444', HIGH: '#F59E0B', NORMAL: '#3B82F6', LOW: '#10B981' };

function DelayBadge({ hours }) {
  const color = hours >= 6 ? '#EF4444' : hours >= 3 ? '#F59E0B' : '#3B82F6';
  return (
    <span style={{
      background: color + '15', color, fontWeight: 700, fontSize: '0.75rem',
      padding: '3px 10px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px'
    }}>
      <Clock size={11} /> {hours.toFixed(1)} hrs late
    </span>
  );
}

function StageBadge({ stage }) {
  const colors = {
    'Mechanical': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
    'Body Shop': { bg: 'rgba(245,158,11,0.1)', color: '#B7791F' },
    'Water Wash': { bg: 'rgba(59,130,246,0.1)', color: '#2563EB' },
    'Approval Pending': { bg: 'rgba(139,92,246,0.1)', color: '#7C3AED' },
  };
  const style = colors[stage] || { bg: '#F1F5F9', color: '#64748B' };
  return (
    <span style={{ background: style.bg, color: style.color, fontWeight: 600, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px' }}>
      {stage}
    </span>
  );
}

export default function DelayedJobs() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debSearch = useDebounce(search, 300);

  const filtered = MOCK_DELAYED.filter(
    (d) =>
      !debSearch ||
      d.vehicleNumber.toLowerCase().includes(debSearch.toLowerCase()) ||
      d.ownerName.toLowerCase().includes(debSearch.toLowerCase()) ||
      d.id.toLowerCase().includes(debSearch.toLowerCase())
  ).sort((a, b) => b.delayHours - a.delayHours);

  const critical = filtered.filter(d => d.delayHours >= 6).length;
  const warning = filtered.filter(d => d.delayHours >= 3 && d.delayHours < 6).length;

  const columns = [
    {
      header: 'Job Card',
      render: (row) => (
        <div>
          <code style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)' }}>{row.id}</code>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{row.serviceType}</div>
        </div>
      ),
    },
    {
      header: 'Vehicle',
      render: (row) => (
        <div>
          <code style={{ fontSize: '0.82rem', fontWeight: 700 }}>{row.vehicleNumber}</code>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{row.makeModel}</div>
        </div>
      ),
    },
    {
      header: 'Customer',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{row.ownerName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{row.mobile}</div>
        </div>
      ),
    },
    { header: 'Stage', render: (row) => <StageBadge stage={row.stage} /> },
    { header: 'Promised Delivery', render: (row) => <span style={{ fontSize: '0.82rem' }}>{formatDateTime(row.promisedDelivery)}</span> },
    { header: 'Delay', render: (row) => <DelayBadge hours={row.delayHours} /> },
    {
      header: 'Priority',
      render: (row) => (
        <span style={{ color: PRIORITY_COLORS[row.priority], fontWeight: 700, fontSize: '0.78rem' }}>
          {row.priority}
        </span>
      ),
    },
    {
      header: 'Action',
      render: (row) => (
        <div className="d-flex gap-2">
          <Button
            size="sm" variant="ghost"
            leftIcon={PhoneCall}
            onClick={() => toastInfo(`Calling ${row.ownerName} at ${row.mobile}...`)}
          >
            Call
          </Button>
          <Button
            size="sm" variant="outline"
            rightIcon={ChevronRight}
            onClick={() => navigate(`${ROUTES.JOB_CARDS}/${row.id}`)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Delayed Jobs"
        subtitle={`${filtered.length} vehicles past promised delivery time`}
        breadcrumbs={[
          { label: 'Manager', path: ROUTES.MANAGER_DASHBOARD },
          { label: 'Delayed Jobs' },
        ]}
      />

      {/* Summary Alerts */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AlertTriangle size={28} style={{ color: '#EF4444', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#DC2626' }}>{critical}</div>
              <div style={{ fontSize: '0.8rem', color: '#7F1D1D', fontWeight: 600 }}>Critical (6+ hrs overdue)</div>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Clock size={28} style={{ color: '#F59E0B', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#D97706' }}>{warning}</div>
              <div style={{ fontSize: '0.8rem', color: '#78350F', fontWeight: 600 }}>Warning (3–6 hrs overdue)</div>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div style={{ background: 'var(--color-bg-card)', border: '1.5px solid var(--color-border)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Car size={28} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-primary)' }}>{filtered.length}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Delayed Vehicles</div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filter Bar */}
      <div className="mb-3">
        <SearchBar
          placeholder="Search by job card, vehicle number, owner..."
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Table */}
      <div className="premium-card">
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No delayed vehicles. Great job! 🎉"
        />
      </div>
    </div>
  );
}
