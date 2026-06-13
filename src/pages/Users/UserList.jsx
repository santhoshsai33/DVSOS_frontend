import { useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { Plus, Edit, Trash2, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../queries/useDataQueries';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/shared/PageHeader';
import { formatDateTime } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import { ROLE_LABELS } from '../../constants/roles';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import styles from './Users.module.css';

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tableData = data?.data || [];
  const totalPages = Math.ceil(tableData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = tableData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
        {number}
      </Pagination.Item>
    );
  }

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
        <div className="table-responsive flex-grow-1">
          {isLoading ? (
            <div className="p-5 text-center text-muted">Loading data...</div>
          ) : tableData.length === 0 ? (
            <div className="p-5 text-center text-muted">No users found</div>
          ) : (
            <Table striped hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td className="align-middle">
                      <div className="d-flex align-items-center gap-2">
                        <div className={styles.avatar}>{row.name.charAt(0)}</div>
                        <span className={styles.userName}>{row.name}</span>
                      </div>
                    </td>
                    <td className="align-middle">
                      <a href={`mailto:${row.email}`} className={styles.emailLink}>
                        <Mail size={12} className="me-1" /> {row.email}
                      </a>
                    </td>
                    <td className="align-middle">{row.mobile}</td>
                    <td className="align-middle">
                      <span className={styles.roleBadge}>{ROLE_LABELS[row.role] || row.role}</span>
                    </td>
                    <td className="align-middle">
                      <StatusBadge status={row.status === 'ACTIVE' ? 'COMPLETED' : 'DELAYED'} />
                    </td>
                    <td className="align-middle">{formatDateTime(row.lastLogin)}</td>
                    <td className="align-middle">
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={Edit}
                          onClick={() => navigate(`/admin/users/${row.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-danger"
                          leftIcon={Trash2}
                          onClick={() => handleDeleteUser(row)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center bg-light">
            <small className="text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, tableData.length)} of {tableData.length} entries
            </small>
            <Pagination className="mb-0" size="sm">
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {paginationItems}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
