import React from 'react';
import { Dropdown } from 'react-bootstrap';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { Edit, MoreVertical, Plus } from 'lucide-react';
import useMasterDataStore from '../../store/useMasterDataStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { formatCurrency } from '../../utils/formatters';
import { toastSuccess } from '../../notifications/toast';

const CustomToggle = React.forwardRef(({ children, onClick, ...props }, ref) => {
  const cleanedProps = { ...props };
  if (cleanedProps.className) {
    cleanedProps.className = cleanedProps.className.replace('dropdown-toggle', '');
  }
  return (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      {...cleanedProps}
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
  );
});

export default function ServicePricing() {
  const navigate = useNavigate();
  const { masterServices, updateService } = useMasterDataStore();

  const handleStatusChange = (id, newStatus) => {
    updateService(id, { status: newStatus });
    toastSuccess('Service status updated successfully!');
  };

  const columns = [
    {
      header: 'Service Item Name',
      accessor: 'name',
      render: (row) => <strong style={{ color: 'var(--color-text-primary)' }}>{row.name}</strong>
    },
    { header: 'Category Group', accessor: 'category' },
    {
      header: 'Base Price (₹)',
      accessor: 'price',
      render: (row) => <span className="fw-semibold text-success">{formatCurrency(row.price)}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <select
          className="form-select form-select-sm"
          style={{
            width: '120px',
            fontSize: '0.85rem',
            padding: '0.35rem 0.5rem',
            borderRadius: '6px',
            borderColor: 'var(--color-border)',
            backgroundColor: '#FFFFFF',
            color: 'var(--color-text-primary)',
            fontWeight: 500,
            cursor: 'pointer'
          }}
          value={row.status || 'ACTIVE'}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
          <Dropdown.Toggle as={CustomToggle} id={`dropdown-action-${row.id}`} />
          <Dropdown.Menu
            style={{ padding: '6px', borderRadius: '10px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
          >
            <Dropdown.Item
              onClick={() => navigate(`/admin/master/pricing/${row.id}/edit`)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              <Edit size={15} style={{ color: 'var(--color-accent)' }} />
              <span>Update Price</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Service Pricing Configuration"
        breadcrumbs={[{ label: 'Settings' }, { label: 'Pricing' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.ADMIN_MASTER_PRICING_NEW)}>
            Set Pricing
          </Button>
        }
      />

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={masterServices}
          emptyMessage="No service items to price"
        />
      </div>
    </div>
  );
}
