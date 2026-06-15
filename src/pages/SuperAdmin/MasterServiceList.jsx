import { useState } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { Plus, Edit2, Trash2, Save, Database } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import { toastSuccess } from '../../notifications/toast';
import useMasterDataStore from '../../store/useMasterDataStore';
import { formatCurrency } from '../../utils/formatters';

const CATEGORY_OPTIONS = [
  { value: 'Mechanical', label: 'Mechanical' },
  { value: 'Body Shop', label: 'Body Shop' },
  { value: 'Water Wash', label: 'Water Wash' },
  { value: 'Value Added Service', label: 'Value Added Service' },
];

function ServiceFormModal({ show, onHide, serviceToEdit }) {
  const { addService, updateService } = useMasterDataStore();
  
  const methods = useForm({
    defaultValues: {
      name: serviceToEdit?.name || '',
      price: serviceToEdit?.price || '',
      category: serviceToEdit?.category || 'Mechanical',
    },
  });

  const { handleSubmit, formState: { isSubmitting }, reset } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 500));
      const formattedData = {
        ...data,
        price: parseFloat(data.price),
      };

      if (serviceToEdit) {
        updateService(serviceToEdit.id, formattedData);
        toastSuccess('Service updated successfully!');
      } else {
        addService(formattedData);
        toastSuccess('New service added to master list!');
      }
      onHide();
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold fs-5">
          {serviceToEdit ? 'Edit Service' : 'Add New Service'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormProvider {...methods}>
          <form id="serviceForm" onSubmit={handleSubmit(onSubmit)}>
            <Row className="g-3">
              <Col md={12}>
                <RHFTextField name="name" label="Service Name" placeholder="e.g. Ceramic Coating" required />
              </Col>
              <Col md={12}>
                <RHFSelect name="category" label="Category" options={CATEGORY_OPTIONS} required />
              </Col>
              <Col md={12}>
                <RHFTextField name="price" label="Base Price (₹)" type="number" placeholder="0" required />
              </Col>
            </Row>
          </form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer className="border-top-0 pt-0">
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" form="serviceForm" type="submit" leftIcon={Save} isLoading={isSubmitting}>
          Save Service
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function MasterServiceList() {
  const { masterServices, deleteService } = useMasterDataStore();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const handleEdit = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
      toastSuccess('Service removed from master list');
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id', render: (row) => <strong className="text-muted">{row.id}</strong> },
    { header: 'Service Name', accessor: 'name', render: (row) => <span className="fw-semibold">{row.name}</span> },
    { 
      header: 'Category', 
      accessor: 'category',
      render: (row) => (
        <span className="badge rounded-pill px-3 py-2" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontWeight: 600 }}>
          {row.category}
        </span>
      )
    },
    { header: 'Base Amount', accessor: 'price', render: (row) => <span className="fw-bold">{formatCurrency(row.price)}</span> },
    {
      header: 'Actions',
      render: (row) => (
        <div className="d-flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)} title="Edit">
            <Edit2 size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} title="Delete" style={{ color: '#EF4444' }}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Master Service List"
        subtitle="Manage the global catalog of services and their base amounts"
        breadcrumbs={[
          { label: 'System Settings', path: '/admin/settings' },
          { label: 'Master Services' },
        ]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => { setEditingService(null); setShowModal(true); }}>
            Add Service
          </Button>
        }
      />

      <div className="premium-card">
        <div className="p-4 border-bottom d-flex align-items-center gap-3">
          <div className="icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '0.75rem', borderRadius: '12px' }}>
            <Database size={24} />
          </div>
          <div>
            <h5 className="mb-1 fw-bold">Service Catalog</h5>
            <p className="text-muted mb-0 small">These services will appear in the Job Card Create form for the CRM team.</p>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={masterServices}
          emptyMessage="No master services found. Add one to get started."
        />
      </div>

      {showModal && (
        <ServiceFormModal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          serviceToEdit={editingService} 
        />
      )}
    </div>
  );
}
