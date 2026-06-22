import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
  Pagination,
  Paper
} from '@mui/material';
import Loader from '../Loader';
import EmptyState from '../EmptyState';

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
  showPagination = true,
  defaultItemsPerPage = 10,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultItemsPerPage);

  if (isLoading) return <Loader text="Loading data..." />;
  if (!data.length) return <EmptyState message={emptyMessage} />;

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = showPagination
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : data;

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#FFFFFF',
          borderRadius: 0,
          border: 'none',
          boxShadow: 'none',
          overflow: 'hidden'
        }}
      >
        <TableContainer>
          <Table
            sx={{
              borderCollapse: 'separate',
              borderSpacing: 0,
              '& .MuiButton-root': {
                width: 'auto',
                minWidth: 'max-content',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              },
              '& .MuiButton-startIcon, & .MuiButton-endIcon': {
                flexShrink: 0,
              },
            }}
          >
            <TableHead>
              <TableRow>
                {columns.map((col, index) => {
                  const isActionColumn = String(col.header || '').toLowerCase().includes('action');

                  return (
                    <TableCell
                      key={index}
                      sx={{
                        bgcolor: '#e0e2e6ff',
                        color: '#000000',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderBottom: 'none',
                        py: 2,
                        px: 3,
                        whiteSpace: 'nowrap',
                        width: isActionColumn ? '1%' : col.width || 'auto',
                        '&:first-of-type': { pl: 4 },
                        '&:last-of-type': { pr: 4 }
                      }}
                      width={isActionColumn ? '1%' : col.width || 'auto'}
                    >
                      {col.header}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  onClick={() => onRowClick && onRowClick(row)}
                  sx={{
                    bgcolor: '#FFFFFF',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: '#F8FAFC',
                    },
                    '& td': {
                      borderBottom: index === paginatedData.length - 1 ? 'none' : '1px dashed #CBD5E1',
                    }
                  }}
                >
                  {columns.map((col, colIndex) => {
                    const isActionColumn = String(col.header || '').toLowerCase().includes('action');

                    return (
                      <TableCell
                        key={colIndex}
                        sx={{
                          py: 2.25,
                          px: 3,
                          color: '#334155',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          whiteSpace: isActionColumn ? 'nowrap' : 'normal',
                          width: isActionColumn ? '1%' : col.width || 'auto',
                          '&:first-of-type': { pl: 4 },
                          '&:last-of-type': { pr: 4 }
                        }}
                      >
                        {col.render
                          ? col.render(row)
                          : (row[col.accessor] !== undefined && row[col.accessor] !== null ? row[col.accessor] : '—')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {showPagination && data.length > 0 && (
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            p: 2,
            px: 3,
            gap: { xs: 2, sm: 0 },
            borderTop: '1px solid #E2E8F0',
            // bgcolor: '#FAFAFA'
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Select
                size="small"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(0);
                }}
                sx={{
                  fontSize: '0.875rem',
                  color: '#334155',
                  fontWeight: 600,
                  bgcolor: '#FFFFFF',
                  fieldset: { borderColor: '#E2E8F0', borderRadius: 2 },
                  '&:hover fieldset': { borderColor: '#CBD5E1 !important' },
                  height: 36
                }}
              >
                {[10, 25, 50].map((num) => (
                  <MenuItem key={num} value={num} sx={{ fontSize: '0.875rem' }}>{num}</MenuItem>
                ))}
              </Select>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
                Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, data.length)} of {data.length}
              </Typography>
            </Stack>

            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(e, value) => setPage(value - 1)}
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                  color: '#475569',
                  border: '1px solid transparent',
                  '&:hover': {
                    bgcolor: '#F1F5F9',
                  }
                },
                '& .Mui-selected': {
                  bgcolor: '#FFFFFF !important',
                  color: '#0F766E', // Brand teal
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  '&:hover': {
                    bgcolor: '#F8FAFC !important',
                  }
                }
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
