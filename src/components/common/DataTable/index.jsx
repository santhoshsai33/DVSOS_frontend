import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
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
  showPagination = true,
  defaultItemsPerPage = 10,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key] ?? '';
    const bValue = b[sortConfig.key] ?? '';
    return String(aValue).localeCompare(String(bValue), undefined, { numeric: true }) * (sortConfig.direction === 'asc' ? 1 : -1);
  });

  // Pagination Logic
  const totalPages = showPagination ? (Math.ceil(sortedData.length / itemsPerPage) || 1) : 1;
  const startIndex = showPagination ? ((currentPage - 1) * itemsPerPage) : 0;
  const paginatedData = showPagination ? sortedData.slice(startIndex, startIndex + itemsPerPage) : sortedData;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (col) => {
    if (!col.accessor || col.sortable === false) return;
    setSortConfig((prev) => ({
      key: col.accessor,
      direction: prev.key === col.accessor && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  };

  if (isLoading) return <Loader text="Loading data..." />;

  if (!data.length) return <EmptyState message={emptyMessage} />;

  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    // Show limited pages if there are many, but keep it simple for now
    paginationItems.push(
      <button
        key={number}
        className={[styles.pageBtn, number === currentPage ? styles.pageBtnActive : ''].join(' ')}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </button>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.scrollContainer}>
        <table className={styles.table} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} style={{ width: col.width }}>
                  <button
                    type="button"
                    className={styles.sortBtn}
                    onClick={() => handleSort(col)}
                    disabled={!col.accessor || col.sortable === false}
                  >
                    {col.header}
                    {col.accessor && col.sortable !== false && sortConfig.key === col.accessor && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} style={{ marginLeft: '4px' }} /> : <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, ri) => (
              <tr
                key={row.id || ri}
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? styles.clickable : ''}
              >
                {columns.map((col, ci) => (
                  <td key={ci}>
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
        </table>
      </div>

      {showPagination && data.length > 0 && (
        <div className={styles.paginationRow}>
          <div className={styles.paginationInfo}>
            <span>
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} entries
            </span>
            <span>
              Show
              <select className={styles.perPageSelect} value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              entries
            </span>
          </div>

          {totalPages > 1 && (
            <div className={styles.paginationControls}>
              <button
                className={[styles.pageBtn, styles.pageBtnIcon].join(' ')}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={14} /> Previous
              </button>

              {paginationItems}

              <button
                className={[styles.pageBtn, styles.pageBtnIcon].join(' ')}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
