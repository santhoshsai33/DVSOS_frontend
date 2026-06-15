import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Pagination } from 'react-bootstrap';
import DataTable from '../../components/common/DataTable';
import { Plus, Calendar, LogIn, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/shared/PageHeader';
import { formatDateTime } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import { ROUTES } from '../../config/routes';
import styles from './GateEntry.module.css';

// Mock data
const MOCK_ENTRIES = [
  { id: '1', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', mobile: '9876543210', makeModel: 'Hyundai i20', serviceType: 'General Service', status: 'IN_PROGRESS', entryTime: '2024-06-12T08:00:00Z', entryBy: 'Gate Guard A' },
  { id: '2', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', mobile: '9876543211', makeModel: 'Maruti Swift', serviceType: 'Oil Change', status: 'PENDING', entryTime: '2024-06-12T09:15:00Z', entryBy: 'Gate Guard A' },
  { id: '3', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', mobile: '9876543212', makeModel: 'Honda City', serviceType: 'Body Repair', status: 'COMPLETED', entryTime: '2024-06-12T07:30:00Z', entryBy: 'Gate Guard B' },
  { id: '4', vehicleNumber: 'DL 04 RS 3344', ownerName: 'Suresh Nair', mobile: '9876543213', makeModel: 'Toyota Fortuner', serviceType: 'Engine Repair', status: 'DELAYED', entryTime: '2024-06-11T10:00:00Z', entryBy: 'Gate Guard A' },
  { id: '5', vehicleNumber: 'TN 09 LM 8899', ownerName: 'Deepa Menon', mobile: '9876543214', makeModel: 'Mahindra XUV500', serviceType: 'General Service', status: 'BODY_SHOP', entryTime: '2024-06-12T08:45:00Z', entryBy: 'Gate Guard B' },
];

export default function GateEntryList({ onAddClick }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debSearch = useDebounce(search, 300);

  const filtered = MOCK_ENTRIES.filter(
    (e) =>
      !debSearch ||
      e.vehicleNumber.toLowerCase().includes(debSearch.toLowerCase()) ||
      e.ownerName.toLowerCase().includes(debSearch.toLowerCase()) ||
      e.mobile.includes(debSearch)
  );

  const columns = [
    {
      header: 'Vehicle Number',
      sortable: false,
      render: (row) => <code className={styles.vehicleNum}>{row.vehicleNumber}</code>,
    },
    { header: 'Owner Name', accessor: 'ownerName', sortable: false },
    { header: 'Mobile', accessor: 'mobile', sortable: false },
    { header: 'Make & Model', accessor: 'makeModel', sortable: false },
    { header: 'Service Type', accessor: 'serviceType', sortable: false },
    { header: 'Status', sortable: false, render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Entry Time', sortable: false, render: (row) => formatDateTime(row.entryTime) },
    { header: 'Entry By', accessor: 'entryBy', sortable: false },
  ];

  return (
    <div>
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

      <div className={styles.filterBar}>
        <SearchBar
          placeholder="Search by vehicle number, owner, mobile..."
          value={search}
          onChange={setSearch}
          className={styles.searchBox}
        />
        <Button variant="secondary" size="sm" leftIcon={Calendar}>
          Today
        </Button>
      </div>

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No gate entries found"
          showPagination={true}
          defaultItemsPerPage={3}
        />
      </div>
    </div>
  );
}
