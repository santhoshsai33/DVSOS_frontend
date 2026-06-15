import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Pagination, Modal, Form, Row, Col, Dropdown } from 'react-bootstrap';
import DataTable from '../../components/common/DataTable';
import { Plus, Calendar, LogIn, Clock, CheckCircle2, AlertTriangle, LogOut, Eye, MoreVertical } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/shared/PageHeader';
import { formatDateTime } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import { ROUTES } from '../../config/routes';
import { toastSuccess } from '../../notifications/toast';
import styles from './GateEntry.module.css';

// Mock data
const MOCK_ENTRIES = [
  { id: '1', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', mobile: '9876543210', makeModel: 'Hyundai i20', serviceType: 'General Service', status: 'IN_PROGRESS', entryTime: '2024-06-12T08:00:00Z', entryBy: 'Gate Guard A' },
  { id: '2', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', mobile: '9876543211', makeModel: 'Maruti Swift', serviceType: 'Oil Change', status: 'PENDING', entryTime: '2024-06-12T09:15:00Z', entryBy: 'Gate Guard A' },
  { id: '3', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', mobile: '9876543212', makeModel: 'Honda City', serviceType: 'Body Repair', status: 'COMPLETED', entryTime: '2024-06-12T07:30:00Z', entryBy: 'Gate Guard B' },
  { id: '4', vehicleNumber: 'DL 04 RS 3344', ownerName: 'Suresh Nair', mobile: '9876543213', makeModel: 'Toyota Fortuner', serviceType: 'Engine Repair', status: 'DELAYED', entryTime: '2024-06-11T10:00:00Z', entryBy: 'Gate Guard A' },
  { id: '5', vehicleNumber: 'TN 09 LM 8899', ownerName: 'Deepa Menon', mobile: '9876543214', makeModel: 'Mahindra XUV500', serviceType: 'General Service', status: 'BODY_SHOP', entryTime: '2024-06-12T08:45:00Z', entryBy: 'Gate Guard B' },
];

const CustomToggle = React.forwardRef(({ children, onClick, ...props }, ref) => (
  <button
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    {...props}
    style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      color: 'var(--color-text-secondary)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      transition: 'background 0.2s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
  >
    <MoreVertical size={18} />
  </button>
));

export default function GateEntryList({ onAddClick, onViewClick, onEntryClick }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debSearch = useDebounce(search, 300);

  const [showExitModal, setShowExitModal] = useState(false);
  const [exitVehicle, setExitVehicle] = useState(null);
  const [exitDate, setExitDate] = useState(new Date().toISOString().split('T')[0]);
  const [exitTime, setExitTime] = useState(new Date().toTimeString().split(' ')[0].slice(0, 5));

  const handleExitSubmit = (e) => {
    e.preventDefault();
    if (!exitVehicle) return;
    toastSuccess(`Vehicle ${exitVehicle.vehicleNumber} exit registered at ${exitDate} ${exitTime} successfully!`);
    setShowExitModal(false);
    setExitVehicle(null);
  };

  const filtered = MOCK_ENTRIES.filter(
    (e) =>
      !debSearch ||
      e.vehicleNumber.toLowerCase().includes(debSearch.toLowerCase()) ||
      e.ownerName.toLowerCase().includes(debSearch.toLowerCase()) ||
      e.mobile.includes(debSearch)
  );

  const columns = [
    {
      header: 'Vehicle Number',
      sortable: false,
      render: (row) => <code className={styles.vehicleNum}>{row.vehicleNumber}</code>,
    },
    { header: 'Owner Name', accessor: 'ownerName', sortable: false },
    { header: 'Mobile', accessor: 'mobile', sortable: false },
    { header: 'Make & Model', accessor: 'makeModel', sortable: false },
    { header: 'Status', sortable: false, render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Action',
      sortable: false,
      render: (row) => (
        <Dropdown align="end">
          <Dropdown.Toggle as={CustomToggle} id={`dropdown-action-${row.id}`} className={styles.dropdownToggleNoCaret} />
          <Dropdown.Menu
            style={{ padding: '6px', borderRadius: '10px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
          >
            <Dropdown.Item
              onClick={() => onViewClick && onViewClick(row)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500 }}
            >
              <Eye size={15} style={{ color: 'var(--color-primary)' }} />
              <span>View</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => onEntryClick && onEntryClick(row)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500 }}
            >
              <LogIn size={15} style={{ color: 'var(--color-accent)' }} />
              <span>Entry</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => { setExitVehicle(row); setShowExitModal(true); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--bs-danger)' }}
            >
              <LogOut size={15} style={{ color: 'var(--bs-danger)' }} />
              <span>Exit</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Vehicle Entry"
        breadcrumbs={[{ label: 'Vehicle Entry' }]}
        actions={
          onAddClick && (
            <Button variant="primary" leftIcon={Plus} onClick={onAddClick}>
              New Entry
            </Button>
          )
        }
      />

      <div className={styles.filterBar}>
        <SearchBar
          placeholder="Search by vehicle number, owner, mobile..."
          value={search}
          onChange={setSearch}
          className={styles.searchBox}
        />
        <Button variant="secondary" size="sm" leftIcon={Calendar}>
          Today
        </Button>
      </div>

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No gate entries found"
          showPagination={true}
          defaultItemsPerPage={3}
        />
      </div>

      {/* Exit Modal */}
      <Modal show={showExitModal} onHide={() => setShowExitModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: '1px solid var(--color-divider)' }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: '1.25rem', color: '#152326' }}>
            Vehicle Exit Registration
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleExitSubmit}>
          <Modal.Body style={{ padding: '1.5rem' }}>
            {exitVehicle && (
              <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Vehicle Details</div>
                <div style={{ fontWeight: 700, color: '#152326', fontSize: '1.05rem', marginTop: 2 }}>{exitVehicle.vehicleNumber}</div>
                <div style={{ fontSize: '0.85rem', color: '#4B5563', marginTop: 2 }}>{exitVehicle.makeModel} • {exitVehicle.ownerName}</div>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Exit Date *</Form.Label>
              <Form.Control
                type="date"
                required
                value={exitDate}
                onChange={(e) => setExitDate(e.target.value)}
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Exit Time *</Form.Label>
              <Form.Control
                type="time"
                required
                value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ borderTop: '1px solid var(--color-divider)', gap: '0.5rem' }}>
            <Button variant="secondary" type="button" onClick={() => setShowExitModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Confirm Exit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
