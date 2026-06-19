import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Plus, Edit2, Trash2, Save, Database } from 'lucide-react';
import { Box, Card, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton, Typography } from '@mui/material';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import { toastSuccess } from '../../notifications/toast';
import useMasterDataStore from '../../store/useMasterDataStore';
import { formatCurrency } from '../../utils/formatters';
import ConfirmDeleteDialog from '../../components/common/ConfirmDeleteDialog';

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
    <Dialog open={show} onClose={onHide} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {serviceToEdit ? 'Edit Service' : 'Add New Service'}
      </DialogTitle>
      <DialogContent dividers>
        <FormProvider {...methods}>
          <form id="serviceForm" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RHFTextField name="name" label="Service Name" placeholder="e.g. Ceramic Coating" required />
              </Grid>
              <Grid item xs={12}>
                <RHFSelect name="category" label="Category" options={CATEGORY_OPTIONS} required />
              </Grid>
              <Grid item xs={12}>
                <RHFTextField name="price" label="Base Price (₹)" type="number" placeholder="0" required />
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" form="serviceForm" type="submit" leftIcon={Save} isLoading={isSubmitting}>
          Save Service
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function MasterServiceList() {
  const { masterServices, deleteService } = useMasterDataStore();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const handleEdit = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleDelete = (service) => {
    setDeleteItem(service);
  };

  const confirmDelete = () => {
    if (deleteItem) {
      deleteService(deleteItem.id);
      toastSuccess('Service removed from master list');
      setDeleteItem(null);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id', render: (row) => <Typography variant="body2" color="text.secondary" fontWeight={600}>{row.id}</Typography> },
    { header: 'Service Name', accessor: 'name', render: (row) => <Typography variant="body2" fontWeight={600}>{row.name}</Typography> },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <Typography variant="caption" sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 600, py: 0.5, px: 1.5, borderRadius: 8 }}>
          {row.category}
        </Typography>
      )
    },
    { header: 'Base Amount', accessor: 'price', render: (row) => <Typography variant="body2" fontWeight={700}>{formatCurrency(row.price)}</Typography> },
    {
      header: 'Actions',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={() => handleEdit(row)} title="Edit">
            <Edit2 size={16} />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(row)} title="Delete" sx={{ color: 'error.main' }}>
            <Trash2 size={16} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
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

      <Card sx={{ borderRadius: 0 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ bgcolor: 'primary.light', color: 'primary.main', p: 1.5, borderRadius: 2, display: 'flex' }}>
            <Database size={24} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>Service Catalog</Typography>
            <Typography variant="body2" color="text.secondary">These services will appear in the Job Card Create form for the CRM team.</Typography>
          </Box>
        </Box>
        <DataTable
          columns={columns}
          data={masterServices}
          emptyMessage="No master services found. Add one to get started."
        />
      </Card>

      {showModal && (
        <ServiceFormModal
          show={showModal}
          onHide={() => setShowModal(false)}
          serviceToEdit={editingService}
        />
      )}

      <ConfirmDeleteDialog
        open={!!deleteItem}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteItem?.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </Box>
  );
}
