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

export default function ServiceCategories() {
  const navigate = useNavigate();
  const { serviceCategories, deleteCategory, updateCategory } = useMasterDataStore();

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete category "${item.name}"?`)) {
      deleteCategory(item.id);
      toastSuccess(`Category "${item.name}" deleted successfully.`);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateCategory(id, { status: newStatus });
    toastSuccess('Category status updated successfully!');
  };

  const columns = [
    {
      header: 'Category Name',
      accessor: 'name',
      render: (row) => <strong style={{ color: 'var(--color-text-primary)' }}>{row.name}</strong>
    },
    { header: 'Description', accessor: 'description' },
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
              onClick={() => navigate(`/admin/master/categories/${row.id}/edit`)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              <Edit size={15} style={{ color: 'var(--color-accent)' }} />
              <span>Edit Category</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleDelete(row)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-danger)' }}
            >
              <Trash2 size={15} style={{ color: 'red' }} />
              <span>Delete Category</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Service Categories"
        breadcrumbs={[{ label: 'Settings' }, { label: 'Categories' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.ADMIN_MASTER_CATEGORIES_NEW)}>
            Add Category
          </Button>
        }
      />

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={serviceCategories}
          emptyMessage="No service categories found"
        />
      </div>
    </div>
  );
}
