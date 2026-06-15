import { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { Settings, Wrench, Package, List, Plus, Edit, Trash2 } from 'lucide-react';
import { useServices, useBrands } from '../../queries/useDataQueries';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import { toastSuccess } from '../../notifications/toast';
import styles from './Masters.module.css';

const TABS = [
  { key: 'SERVICES', label: 'Services', icon: Wrench },
  { key: 'BRANDS', label: 'Vehicle Brands', icon: Package },
  { key: 'CATEGORIES', label: 'Categories', icon: List },
  { key: 'GENERAL', label: 'General Settings', icon: Settings },
];

export default function MasterSettings() {
  const [activeTab, setActiveTab] = useState('SERVICES');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'SERVICE' | 'BRAND'
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form States
  const [serviceForm, setServiceForm] = useState({ name: '', category: 'Maintenance', price: '', isActive: true });
  const [brandForm, setBrandForm] = useState({ name: '', country: '', isActive: true });

  const { data: servicesData, isLoading: servicesLoading, refetch: refetchServices } = useServices();
  const { data: brandsData, isLoading: brandsLoading, refetch: refetchBrands } = useBrands();

  const handleOpenAdd = () => {
    setEditMode(false);
    setSelectedItem(null);
    if (activeTab === 'SERVICES') {
      setServiceForm({ name: '', category: 'Maintenance', price: '', isActive: true });
      setModalType('SERVICE');
    } else {
      setBrandForm({ name: '', country: '', isActive: true });
      setModalType('BRAND');
    }
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditMode(true);
    setSelectedItem(item);
    if (activeTab === 'SERVICES') {
      setServiceForm({ name: item.name, category: item.category || 'Maintenance', price: item.price, isActive: item.isActive });
      setModalType('SERVICE');
    } else {
      setBrandForm({ name: item.name, country: item.country || '', isActive: item.isActive });
      setModalType('BRAND');
    }
    setShowModal(true);
  };

  const handleDelete = (item) => {
    const itemName = item.name;
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      toastSuccess(`"${itemName}" deleted successfully.`);
      if (activeTab === 'SERVICES') {
        refetchServices();
      } else {
        refetchBrands();
      }
    }
  };

  const handleSave = () => {
    if (modalType === 'SERVICE') {
      if (!serviceForm.name || !serviceForm.price) {
        alert('Please fill out all required fields.');
        return;
      }
      toastSuccess(`Service "${serviceForm.name}" ${editMode ? 'updated' : 'created'} successfully.`);
      refetchServices();
    } else {
      if (!brandForm.name) {
        alert('Please enter a Brand Name.');
        return;
      }
      toastSuccess(`Brand "${brandForm.name}" ${editMode ? 'updated' : 'created'} successfully.`);
      refetchBrands();
    }
    setShowModal(false);
  };

  const serviceColumns = [
    { header: 'Service Name', accessor: 'name', render: (row) => <strong className={styles.itemName}>{row.name}</strong> },
    { header: 'Category', accessor: 'category' },
    { header: 'Base Price', render: (row) => formatCurrency(row.price) },
    { header: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'COMPLETED' : 'DELAYED'} /> },
    {
      header: 'Actions',
      render: (row) => (
        <div className="d-flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" leftIcon={Edit} onClick={() => handleOpenEdit(row)}>Edit</Button>
          <Button size="sm" variant="ghost" className="text-danger" leftIcon={Trash2} onClick={() => handleDelete(row)}></Button>
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
      render: (row) => (
        <div className="d-flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" leftIcon={Edit} onClick={() => handleOpenEdit(row)}>Edit</Button>
          <Button size="sm" variant="ghost" className="text-danger" leftIcon={Trash2} onClick={() => handleDelete(row)}></Button>
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
          (activeTab === 'SERVICES' || activeTab === 'BRANDS') && (
            <Button variant="primary" leftIcon={Plus} onClick={handleOpenAdd}>
              Add {activeTab === 'SERVICES' ? 'Service' : 'Brand'}
            </Button>
          )
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

      {/* Add / Edit Modals */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        title={`${editMode ? 'Edit' : 'Add'} ${modalType === 'SERVICE' ? 'Service Item' : 'Vehicle Brand'}`}
        confirmLabel={editMode ? 'Update' : 'Create'}
        onConfirm={handleSave}
      >
        {modalType === 'SERVICE' ? (
          <div className="d-flex flex-column gap-3">
            <div>
              <label className="form-label fw-bold small text-muted">Service Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Ceramic Coating"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label fw-bold small text-muted">Category</label>
              <select
                className="form-select"
                value={serviceForm.category}
                onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Repair">Repair</option>
                <option value="Body">Body Work</option>
                <option value="Electrical">Electrical</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>
            <div>
              <label className="form-label fw-bold small text-muted">Base Price (₹) *</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 5000"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
              />
            </div>
            <div className="form-check form-switch mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="serviceStatus"
                checked={serviceForm.isActive}
                onChange={(e) => setServiceForm({ ...serviceForm, isActive: e.target.checked })}
              />
              <label className="form-check-label small" htmlFor="serviceStatus">Active Service</label>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            <div>
              <label className="form-label fw-bold small text-muted">Brand Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Ford"
                value={brandForm.name}
                onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label fw-bold small text-muted">Country of Origin</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. USA"
                value={brandForm.country}
                onChange={(e) => setBrandForm({ ...brandForm, country: e.target.value })}
              />
            </div>
            <div className="form-check form-switch mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="brandStatus"
                checked={brandForm.isActive}
                onChange={(e) => setBrandForm({ ...brandForm, isActive: e.target.checked })}
              />
              <label className="form-check-label small" htmlFor="brandStatus">Active Brand</label>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
