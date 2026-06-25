import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Card, IconButton, Menu, MenuItem, Modal, Typography, TextField, Grid, Select } from '@mui/material';
import DataTable from '../../components/common/DataTable';
import { Plus, LogIn, Eye, LogOut, MoreVertical } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/shared/PageHeader';
import VehicleNumberPlate from '../../components/common/VehicleNumberPlate';
import { useDebounce } from '../../hooks/useDebounce';
import { toastSuccess } from '../../notifications/toast';
import { gateEntryApi } from '../../api/gateEntryApi';

export default function GateEntryList({ onAddClick, onViewClick, onEntryClick }) {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [showExitModal, setShowExitModal] = useState(false);
  const [exitVehicle, setExitVehicle] = useState(null);
  const [exitDate, setExitDate] = useState(new Date().toISOString().split('T')[0]);
  const [exitTime, setExitTime] = useState(new Date().toTimeString().split(' ')[0].slice(0, 5));

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedEntry(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEntry(null);
  };

  const handleExitSubmit = (e) => {
    e.preventDefault();
    if (!exitVehicle) return;
    toastSuccess(`Vehicle ${exitVehicle.vehicleNumber} exit registered at ${exitDate} ${exitTime} successfully!`);
    setShowExitModal(false);
    setExitVehicle(null);
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await gateEntryApi.list({
        page,
        limit,
        search: debSearch,
        status: statusFilter,
        serviceType: serviceTypeFilter
      });
      setEntries(res.data || []);
      setTotal(res.meta?.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [page, limit, debSearch, statusFilter, serviceTypeFilter]);

  const columns = [
    {
      header: 'Vehicle Number',
      sortable: false,
      render: (row) => (
        <Link to={`/gate-entry/view/${row.slug || row.id}`} style={{ textDecoration: 'none' }}>
          <VehicleNumberPlate vehicleNumber={row.vehicleNumber} />
        </Link>
      ),
    },
    { header: 'Owner Name', accessor: 'ownerName', sortable: false },
    { header: 'Mobile', accessor: 'mobile', sortable: false },
    { header: 'Make & Model', accessor: 'makeModel', sortable: false },
    { header: 'Status', sortable: false, render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Action',
      sortable: false,
      render: (row) => (
        <IconButton size="small" onClick={(e) => handleMenuClick(e, row)}>
          <MoreVertical size={18} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Vehicle Entry"
        breadcrumbs={[{ label: 'Vehicle Entry' }]}
        actions={
          onAddClick && (
            <Button variant="primary" leftIcon={Plus} onClick={onAddClick}>
              New Entry
            </Button>
          )
        }
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search by vehicle number, owner, mobile..."
            value={search}
            onChange={setSearch}
          />
        </Box>
        <Select
          size="small"
          displayEmpty
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{
            width: { xs: '100%', sm: 180 },
            bgcolor: 'background.paper',
            borderRadius: '24px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '1px' },
          }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
          <MenuItem value="DELAYED">Delayed</MenuItem>
          <MenuItem value="BODY_SHOP">Body Shop</MenuItem>
        </Select>

        <Select
          size="small"
          displayEmpty
          value={serviceTypeFilter}
          onChange={(e) => setServiceTypeFilter(e.target.value)}
          sx={{
            width: { xs: '100%', sm: 180 },
            bgcolor: 'background.paper',
            borderRadius: '24px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '1px' },
          }}
        >
          <MenuItem value="">All Service Types</MenuItem>
          <MenuItem value="General Service">General Service</MenuItem>
          <MenuItem value="Oil Change">Oil Change</MenuItem>
          <MenuItem value="Body Repair">Body Repair</MenuItem>
          <MenuItem value="Engine Repair">Engine Repair</MenuItem>
        </Select>
      </Box>

      <Card sx={{ borderRadius: 0, }}>
        <DataTable
          columns={columns}
          data={entries}
          loading={loading}
          emptyMessage="No gate entries found"
          showPagination={true}
          defaultItemsPerPage={limit}
          totalItems={total}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { width: 160, borderRadius: 2, mt: 0.5 } }}
      >
        <MenuItem onClick={() => { 
          const idOrSlug = selectedEntry?.slug || selectedEntry?.id;
          handleMenuClose(); 
          if(idOrSlug) navigate(`/gate-entry/view/${idOrSlug}`); 
        }}>
          <Eye size={16} className="mr-3 text-primary" />
          View
        </MenuItem>
        <MenuItem onClick={() => { 
          const entry = selectedEntry;
          handleMenuClose(); 
          if(onEntryClick) onEntryClick(entry); 
        }}>
          <LogIn size={16} className="mr-3 text-warning" />
          Entry
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); setExitVehicle(selectedEntry); setShowExitModal(true); }} sx={{ color: 'error.main' }}>
          <LogOut size={16} className="mr-3" />
          Exit
        </MenuItem>
      </Menu>

      <Modal open={showExitModal} onClose={() => setShowExitModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 24, outline: 'none' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={700}>Vehicle Exit Registration</Typography>
          </Box>
          <form onSubmit={handleExitSubmit}>
            <Box sx={{ p: 3 }}>
              {exitVehicle && (
                <Box sx={{ mb: 3, p: 2, bgcolor: '#F9FAFB', borderRadius: 2, border: '1px solid #E5E7EB' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>Vehicle Details</Typography>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 0.5 }}>{exitVehicle.vehicleNumber}</Typography>
                  <Typography variant="body2" color="text.secondary">{exitVehicle.makeModel} • {exitVehicle.ownerName}</Typography>
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Exit Date *"
                    type="date"
                    required
                    fullWidth
                    value={exitDate}
                    onChange={(e) => setExitDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Exit Time *"
                    type="time"
                    required
                    fullWidth
                    value={exitTime}
                    onChange={(e) => setExitTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="secondary" type="button" onClick={() => setShowExitModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Confirm Exit</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
