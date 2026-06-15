import React from 'react';
import { Dropdown } from 'react-bootstrap';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import useMasterDataStore from '../../store/useMasterDataStore';
import { toastSuccess } from '../../notifications/toast';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

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

export default function ServiceItems() {
  const navigate = useNavigate();
  const { masterServices, deleteService } = useMasterDataStore();

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete service "${item.name}"?`)) {
      deleteService(item.id);
      toastSuccess(`Service "${item.name}" deleted successfully.`);
    }
  };

  const columns = [
    {
      header: 'Service Item Name',
      accessor: 'name',
      render: (row) => <strong style={{ color: 'var(--color-text-primary)' }}>{row.name}</strong>
    },
    { header: 'Category Group', accessor: 'category' },
    {
      header: 'Actions',
      render: (row) => (
        <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
          <Dropdown.Toggle as={CustomToggle} id={`dropdown-action-${row.id}`} />
          <Dropdown.Menu
            style={{ padding: '6px', borderRadius: '10px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
          >
            <Dropdown.Item
              onClick={() => navigate(`/admin/master/items/${row.id}/edit`)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              <Edit size={15} style={{ color: 'var(--color-accent)' }} />
              <span>Edit Service</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleDelete(row)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-danger)' }}
            >
              <Trash2 size={15} style={{ color: 'red' }} />
              <span>Delete Service</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Service Items"
        breadcrumbs={[{ label: 'Settings' }, { label: 'Service Items' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.ADMIN_MASTER_ITEMS_NEW)}>
            Add Service Item
          </Button>
        }
      />

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={masterServices}
          emptyMessage="No service items found"
        />
      </div>
    </div>
  );
}
