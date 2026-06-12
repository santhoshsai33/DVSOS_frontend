import { useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { Settings, Wrench, Package, List, Plus, Edit, Trash2 } from 'lucide-react';
import { useServices, useBrands } from '../../queries/useDataQueries';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import styles from './Masters.module.css';

const TABS = [
  { key: 'SERVICES', label: 'Services', icon: Wrench },
  { key: 'BRANDS', label: 'Vehicle Brands', icon: Package },
  { key: 'CATEGORIES', label: 'Categories', icon: List },
  { key: 'GENERAL', label: 'General Settings', icon: Settings },
];

export default function MasterSettings() {
  const [activeTab, setActiveTab] = useState('SERVICES');

  const { data: servicesData, isLoading: servicesLoading } = useServices();
  const { data: brandsData, isLoading: brandsLoading } = useBrands();

  const serviceColumns = [
    { header: 'Service Name', accessor: 'name', render: (row) => <strong className={styles.itemName}>{row.name}</strong> },
    { header: 'Category', accessor: 'category' },
    { header: 'Base Price', render: (row) => formatCurrency(row.price) },
    { header: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'COMPLETED' : 'DELAYED'} /> },
    {
      header: 'Actions',
      render: () => (
        <div className="d-flex gap-1">
          <Button size="sm" variant="ghost" leftIcon={Edit}>Edit</Button>
          <Button size="sm" variant="ghost" className="text-danger" leftIcon={Trash2}></Button>
        </div>
      ),
    },
  ];

  const brandColumns = [
    { header: 'Brand Name', accessor: 'name', render: (row) => <strong className={styles.itemName}>{row.name}</strong> },
    { header: 'Country of Origin', accessor: 'country' },
    { header: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'COMPLETED' : 'DELAYED'} /> },
    {
      header: 'Actions',
      render: () => (
        <div className="d-flex gap-1">
          <Button size="sm" variant="ghost" leftIcon={Edit}>Edit</Button>
          <Button size="sm" variant="ghost" className="text-danger" leftIcon={Trash2}></Button>
        </div>
      ),
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tableData = activeTab === 'SERVICES' 
    ? (servicesData?.data || []) 
    : (brandsData?.data || []);
  
  const totalPages = Math.ceil(tableData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = tableData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
        {number}
      </Pagination.Item>
    );
  }

  const renderServicesTable = () => (
    <div className="bg-white rounded border overflow-hidden d-flex flex-column" style={{ minHeight: '300px' }}>
      <div className="table-responsive flex-grow-1">
        {servicesLoading ? (
          <div className="p-5 text-center text-muted">Loading data...</div>
        ) : tableData.length === 0 ? (
          <div className="p-5 text-center text-muted">No services found</div>
        ) : (
          <Table striped hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Base Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr key={row.id}>
                  <td className="align-middle"><strong className={styles.itemName}>{row.name}</strong></td>
                  <td className="align-middle">{row.category}</td>
                  <td className="align-middle">{formatCurrency(row.price)}</td>
                  <td className="align-middle"><StatusBadge status={row.isActive ? 'COMPLETED' : 'DELAYED'} /></td>
                  <td className="align-middle">
                    <div className="d-flex gap-1">
                      <Button size="sm" variant="ghost" leftIcon={Edit}>Edit</Button>
                      <Button size="sm" variant="ghost" className="text-danger" leftIcon={Trash2}></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
      
      {!servicesLoading && totalPages > 1 && (
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
  );

  const renderBrandsTable = () => (
    <div className="bg-white rounded border overflow-hidden d-flex flex-column" style={{ minHeight: '300px' }}>
      <div className="table-responsive flex-grow-1">
        {brandsLoading ? (
          <div className="p-5 text-center text-muted">Loading data...</div>
        ) : tableData.length === 0 ? (
          <div className="p-5 text-center text-muted">No brands found</div>
        ) : (
          <Table striped hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Brand Name</th>
                <th>Country of Origin</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr key={row.id}>
                  <td className="align-middle"><strong className={styles.itemName}>{row.name}</strong></td>
                  <td className="align-middle">{row.country}</td>
                  <td className="align-middle"><StatusBadge status={row.isActive ? 'COMPLETED' : 'DELAYED'} /></td>
                  <td className="align-middle">
                    <div className="d-flex gap-1">
                      <Button size="sm" variant="ghost" leftIcon={Edit}>Edit</Button>
                      <Button size="sm" variant="ghost" className="text-danger" leftIcon={Trash2}></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
      
      {!brandsLoading && totalPages > 1 && (
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
  );

  return (
    <div>
      <PageHeader
        title="Master Settings"
        subtitle="Manage core application data and configurations"
        breadcrumbs={[{ label: 'Settings' }, { label: 'Masters' }]}
        actions={
          <Button variant="primary" leftIcon={Plus}>
            Add {activeTab === 'SERVICES' ? 'Service' : activeTab === 'BRANDS' ? 'Brand' : 'New'}
          </Button>
        }
      />

      <div className={styles.layout}>
        {/* Sidebar Nav */}
        <div className={styles.navPanel}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                className={[styles.navItem, activeTab === tab.key ? styles.navActive : ''].join(' ')}
                onClick={() => handleTabChange(tab.key)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className={styles.contentPanel}>
          <div className={styles.contentHeader}>
            <h5 className={styles.contentTitle}>
              {TABS.find((t) => t.key === activeTab)?.label}
            </h5>
          </div>

          <div className={styles.tableWrapper}>
            {activeTab === 'SERVICES' && renderServicesTable()}
            {activeTab === 'BRANDS' && renderBrandsTable()}
            {(activeTab === 'CATEGORIES' || activeTab === 'GENERAL') && (
              <div className={styles.comingSoon}>
                <Settings size={48} className={styles.comingSoonIcon} />
                <p>Module under construction</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
