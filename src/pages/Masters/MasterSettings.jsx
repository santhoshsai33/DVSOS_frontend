import { useState } from 'react';
import DataTable from '../../components/common/DataTable';
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

  const tableData = activeTab === 'SERVICES'
    ? (servicesData?.data || [])
    : (brandsData?.data || []);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const renderServicesTable = () => (
    <div className="premium-card d-flex flex-column">
      <DataTable
        columns={serviceColumns}
        data={tableData}
        isLoading={servicesLoading}
        emptyMessage="No services found"
      />
    </div>
  );

  const renderBrandsTable = () => (
    <div className="premium-card d-flex flex-column">
      <DataTable
        columns={brandColumns}
        data={tableData}
        isLoading={brandsLoading}
        emptyMessage="No brands found"
      />
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
