import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Plus, Edit, Trash2, Mail, Search, MoreVertical, MapPin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../../../components/common/Button';
import PageHeader from '../../../../components/shared/PageHeader';
import DataTable from '../../../../components/common/DataTable';
import SearchBar from '../../../../components/common/SearchBar';
import { toastSuccess } from '../../../../notifications/toast';
import { ROUTES } from '../../../../config/routes';

const INITIAL_CUSTOMERS = [
  { id: '1', name: 'Ramesh Patel', email: 'ramesh@gmail.com', mobile: '9876543210', address: '45 Green Park, Madurai', visits: 4, status: 'ACTIVE' },
  { id: '2', name: 'Anjali Sharma', email: 'anjali.s@yahoo.com', mobile: '9123456789', address: '88 KK Nagar, Madurai', visits: 2, status: 'ACTIVE' },
  { id: '3', name: 'Balaji Sundar', email: 'balaji@gmail.com', mobile: '9845601234', address: '12 Bypass Road, Madurai', visits: 7, status: 'ACTIVE' },
  { id: '4', name: 'Srinivasan R', email: 'srini@outlook.com', mobile: '9789012345', address: '303 Anna Nagar, Madurai', visits: 1, status: 'INACTIVE' }
];

const CustomToggle = React.forwardRef(({ children, onClick, ...props }, ref) => {
  const cleanedClassName = (props.className || '').replace('dropdown-toggle', '');
  return (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      {...props}
      className={cleanedClassName}
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

export default function CustomerListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('dvsos_customers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CUSTOMERS;
  });

  useEffect(() => {
    localStorage.setItem('dvsos_customers', JSON.stringify(customers));
  }, [customers]);

  const handleStatusChange = (id, newStatus) => {
    const updated = customers.map(c => {
      if (c.id === id) {
        return { ...c, status: newStatus };
      }
      return c;
    });
    setCustomers(updated);
    toastSuccess('Customer status updated successfully!');
  };

  const handleDelete = (customer) => {
    if (window.confirm(`Are you sure you want to delete customer "${customer.name}"?\nThis action cannot be undone.`)) {
      const updated = customers.filter(c => c.id !== customer.id);
      setCustomers(updated);
      toastSuccess(`Customer "${customer.name}" deleted successfully.`);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: 'Customer Name',
      accessor: 'name',
      render: (row) => (
        <Link to={`/customers/${row.id}`} style={{ fontWeight: 600, color: 'var(--color-accent)', textDecoration: 'none' }}>
          {row.name}
        </Link>
      )
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (row) => (
        <a href={`mailto:${row.email}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          <Mail size={12} /> {row.email}
        </a>
      )
    },
    {
      header: 'Mobile',
      accessor: 'mobile',
    },
    {
      header: 'Address',
      accessor: 'address',
      render: (row) => (
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={12} /> {row.address || '-'}
        </span>
      )
    },
    {
      header: 'Total Visits',
      accessor: 'visits',
      render: (row) => <span className="badge bg-light text-dark border">{row.visits || 0} visits</span>
    },
    {
      header: 'Status',
      render: (row) => (
        <select
          className="form-select form-select-sm"
          style={{
            width: '120px',
            fontSize: '0.85rem',
            padding: '0.35rem 0.5rem',
            borderRadius: '6px',
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-bg-card)',
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
              onClick={() => navigate(`/customers/${row.id}/edit`)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              <Edit size={15} style={{ color: 'var(--color-accent)' }} />
              <span>Edit Customer</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Customer Directory"
        breadcrumbs={[{ label: 'Home', path: ROUTES.ADMIN_DASHBOARD }, { label: 'Customers' }]}
      />

      <div className="d-flex mb-4" style={{ gap: '1rem' }}>
        <div style={{ flex: 1, maxWidth: '400px' }}>
          <SearchBar
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={filteredCustomers}
          emptyMessage="No customers found"
        />
      </div>
    </div>
  );
}
