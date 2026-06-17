import React from 'react';
import { Box } from '@mui/material';

export default function VehicleNumberPlate({ vehicleNumber, size = 'md' }) {
  if (!vehicleNumber) return null;

  const py = size === 'sm' ? 0.25 : 0.5;
  const px = size === 'sm' ? 1 : 1.5;
  const fontSize = size === 'sm' ? '0.75rem' : '0.85rem';

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 800,
        fontSize,
        color: '#0F172A',
        bgcolor: '#FFFFFF',
        px,
        py,
        borderRadius: 1, // Slate 700 border for strong license plate look
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        whiteSpace: 'nowrap'
      }}
    >
      {vehicleNumber}
    </Box>
  );
}
