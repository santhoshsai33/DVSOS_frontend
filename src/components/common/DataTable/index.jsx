import { useState, useMemo } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import Loader from '../Loader';
import EmptyState from '../EmptyState';
import styles from './DataTable.module.css';

// eslint-disable-next-line react/prop-types
export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
  striped = true,
  compact = false,
  itemsPerPage = 10,
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (col) => {
    if (!col.accessor) return;
    if (sortKey === col.accessor) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.accessor);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  // Pagination Logic
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sorted.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const SortIcon = ({ col }) => {
    if (!col.accessor) return null;
    if (sortKey !== col.accessor) return <ChevronsUpDown size={13} className="text-muted ms-1" />;
    return sortDir === 'asc' ? <ChevronUp size={13} className="text-primary ms-1" /> : <ChevronDown size={13} className="text-primary ms-1" />;
  };

  if (isLoading) return <Loader text="Loading data..." />;

  if (!data.length) return <EmptyState message={emptyMessage} />;

  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div className="bg-white rounded border overflow-hidden d-flex flex-column" >
      <div className="table-responsive flex-grow-1">
        <Table striped={striped} hover size={compact ? 'sm' : undefined} className="mb-0" style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
          <thead className="table-light">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  style={{ width: col.width, cursor: col.accessor ? 'pointer' : 'default' }}
                  onClick={() => handleSort(col)}
                  className="text-nowrap"
                >
                  <div className="d-flex align-items-center">
                    {col.header}
                    <SortIcon col={col} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, ri) => (
              <tr
                key={row.id || ri}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col, ci) => (
                  <td key={ci} className="align-middle">
                    {col.render
                      ? col.render(row, ri)
                      : col.accessor
                        ? (row[col.accessor] ?? '—')
                        : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="p-3 border-top d-flex justify-content-between align-items-center bg-light">
          <small className="text-muted">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sorted.length)} of {sorted.length} entries
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
}
