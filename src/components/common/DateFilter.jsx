import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

export default function DateFilter({ fromDate, toDate, onChange, sx = {} }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', ...sx }}>
      <TextField
        type="date"
        size="small"
        label="From Date"
        value={fromDate || ''}
        onChange={(e) => onChange && onChange('from', e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{
          width: 150,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            borderRadius: '24px',
            fontSize: '0.875rem',
            '& fieldset': { borderColor: '#E2E8F0' },
            '&:hover fieldset': { borderColor: '#CBD5E1' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1px' },
          }
        }}
      />
      <Typography variant="body2" color="text.secondary">to</Typography>
      <TextField
        type="date"
        size="small"
        label="To Date"
        value={toDate || ''}
        onChange={(e) => onChange && onChange('to', e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{
          width: 150,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            borderRadius: '24px',
            fontSize: '0.875rem',
            '& fieldset': { borderColor: '#E2E8F0' },
            '&:hover fieldset': { borderColor: '#CBD5E1' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1px' },
          }
        }}
      />
    </Box>
  );
}
