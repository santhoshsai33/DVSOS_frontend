import React from 'react';
import { Box } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ 
  to, 
  onClick, 
  label = 'Back', 
  sx = {} 
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    else if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <Box
      component="button"
      onClick={handleClick}
      sx={{
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: 1,
        bgcolor: 'transparent', 
        border: 'none', 
        cursor: 'pointer',
        color: 'text.secondary', 
        fontSize: '0.875rem', 
        fontWeight: 500,
        fontFamily: "'Poppins', sans-serif",
        p: 0,
        transition: 'color 0.2s',
        '&:hover': { color: 'text.primary' },
        ...sx
      }}
    >
      <ArrowLeft size={16} /> {label}
    </Box>
  );
}
