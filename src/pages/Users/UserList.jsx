import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Plus, Edit, Trash2, Mail, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../queries/useDataQueries';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/common/DataTable';
import { formatDateTime } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import { ROLE_LABELS } from '../../constants/roles';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import styles from './Users.module.css';

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

export default function UserList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const debSearch = useDebounce(search, 300);

  const { data, isLoading } = useUsers({ search: debSearch, role: roleFilter });

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to remove "${user.name}"?\nThis action cannot be undone.`)) {
      toastSuccess(`User "${user.name}" removed successfully.`);
    }
  };

  const tableData = data?.data || [];

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div className={styles.avatar}>{row.name.charAt(0)}</div>
          <span className={styles.userName}>{row.name}</span>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (row) => (
        <a href={`mailto:${row.email}`} className={styles.emailLink}>
          <Mail size={12} className="me-1" /> {row.email}
        </a>
      ),
    },
    { header: 'Mobile', accessor: 'mobile' },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span className={styles.roleBadge}>{ROLE_LABELS[row.role] || row.role}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <StatusBadge status={row.status === 'ACTIVE' ? 'COMPLETED' : 'DELAYED'} />
      ),
    },
    {
      header: 'Last Login',
      accessor: 'lastLogin',
      render: (row) => formatDateTime(row.lastLogin),
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
              onClick={() => navigate(`/admin/users/${row.id}/edit`)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              <Edit size={15} style={{ color: 'var(--color-accent)' }} />
              <span>Edit User</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleDeleteUser(row)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-danger)' }}
            >
              <Trash2 size={15} style={{ color: 'red' }} />
              <span>Delete User</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle={`Manage access and roles for ${data?.total ?? 0} team members`}
        breadcrumbs={[{ label: 'Settings' }, { label: 'Users' }]}
        actions={
          <Button
            variant="primary"
            leftIcon={Plus}
            onClick={() => navigate(ROUTES.ADMIN_USER_NEW)}
          >
            Add User
          </Button>
        }
      />

      <div className={styles.filterBar}>
        <SearchBar
          placeholder="Search by name, email, or mobile..."
          value={search}
          onChange={setSearch}
          className={styles.searchBox}
        />
        <select
          className={styles.filterSelect}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          {Object.entries(ROLE_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={tableData}
          isLoading={isLoading}
          emptyMessage="No users found"
        />
      </div>
    </div>
  );
}
