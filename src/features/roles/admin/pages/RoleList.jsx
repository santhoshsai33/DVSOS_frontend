import React from 'react';
import { ShieldCheck, Edit, Trash2, Plus, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import Button from '../../../../components/common/Button';
import PageHeader from '../../../../components/shared/PageHeader';
import DataTable from '../../../../components/common/DataTable';
import StatusBadge from '../../../../components/common/StatusBadge';
import { toastSuccess } from '../../../../notifications/toast';
import { ROUTES } from '../../../../config/routes';

const MOCK_ROLES_LIST = [
  { id: 1, designation: 'Super Admin', roleCode: 'SUPER_ADMIN', accessLevel: 'Full Access', active: true },
  { id: 2, designation: 'General Manager', roleCode: 'MANAGER', accessLevel: 'Custom Access', active: true },
  { id: 3, designation: 'Floor Supervisor', roleCode: 'FLOOR_SUPERVISOR', accessLevel: 'Custom Access', active: true },
  { id: 4, designation: 'Gate Security Executive', roleCode: 'GATE_SECURITY', accessLevel: 'Custom Access', active: true },
  { id: 5, designation: 'CRM Officer', roleCode: 'CRM_TEAM', accessLevel: 'Custom Access', active: true },
  { id: 6, designation: 'Body Shop Lead', roleCode: 'BODY_SHOP_SUPERVISOR', accessLevel: 'Custom Access', active: true },
  { id: 7, designation: 'Water Wash Lead', roleCode: 'WATER_WASH_TEAM', accessLevel: 'Custom Access', active: true },
  { id: 8, designation: 'Managing Director', roleCode: 'MD', accessLevel: 'Custom Access', active: true }
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

export default function RoleList() {
  const navigate = useNavigate();

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete the privileges policy for role "${item.designation}"?`)) {
      toastSuccess(`Role policy for "${item.designation}" removed successfully.`);
    }
  };

  const columns = [
    {
      header: 'Designation Name',
      accessor: 'designation',
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={16} className="text-primary" />
          </div>
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.designation}</strong>
        </div>
      )
    },
    {
      header: 'Role Code',
      accessor: 'roleCode',
      render: (row) => <code style={{ fontSize: '0.85rem' }}>{row.roleCode}</code>
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.active ? 'COMPLETED' : 'DELAYED'} />
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
              onClick={() => navigate(`/admin/roles/privileges/${row.id}/edit`)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              <Edit size={15} style={{ color: 'var(--color-accent)' }} />
              <span>Edit Privileges</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleDelete(row)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-danger)' }}
            >
              <Trash2 size={15} style={{ color: 'red' }} />
              <span>Delete Policy</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Role Management"
        breadcrumbs={[{ label: 'Admin', path: ROUTES.ADMIN_DASHBOARD }, { label: 'Roles' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.ADMIN_ROLE_PRIVILEGES)}>
            Add Role Privileges
          </Button>
        }
      />

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={MOCK_ROLES_LIST}
          emptyMessage="No role policies found"
        />
      </div>
    </div>
  );
}
