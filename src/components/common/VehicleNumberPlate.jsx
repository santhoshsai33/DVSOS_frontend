import React from 'react';
import { Box } from '@mui/material';

const PLATE_COLORS = [
  '#1E40AF', // dark blue
  '#991B1B', // dark red
  '#3730A3', // dark indigo
  '#065F46', // dark emerald
  '#92400E', // dark amber
  '#5B21B6', // dark violet
  '#9D174D', // dark pink
  '#155E75', // dark cyan
  '#115E59', // dark teal
  '#9A3412', // dark orange
  '#166534'  // dark green
];

export default function VehicleNumberPlate({ vehicleNumber, size = 'md' }) {
  if (!vehicleNumber) return null;

  const fontSize = size === 'sm' ? '0.75rem' : '0.85rem';

  // Compute a simple hash from vehicleNumber to select a color from the list
  let hash = 0;
  for (let i = 0; i < vehicleNumber.length; i++) {
    hash = vehicleNumber.charCodeAt(i) + ((hash << 5) - hash);
  }
  const textColor = PLATE_COLORS[Math.abs(hash) % PLATE_COLORS.length];

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 800,
        fontSize,
        color: textColor,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        whiteSpace: 'nowrap'
      }}
    >
      {vehicleNumber}
    </Box>
  );
}
