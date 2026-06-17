import { useFormContext, Controller } from 'react-hook-form';
import { TextField, MenuItem, Box, Typography } from '@mui/material';

// eslint-disable-next-line react/prop-types
export default function RHFSelect({
  name,
  label,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  hint,
  className = '',
  sx = {},
  ...props
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ mb: 2 }}>
          {label && (
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75 }}>
              {label} {required && <span style={{ color: '#E11D48' }}>*</span>}
            </Typography>
          )}
          <TextField
            {...field}
            select
            disabled={disabled}
            error={!!error}
            helperText={error ? error.message : hint}
            fullWidth
            className={className}
            sx={{ 
              ...sx,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                bgcolor: '#FFFFFF'
              }
            }}
            SelectProps={{
              displayEmpty: true
            }}
            {...props}
          >
            <MenuItem value="" disabled>
              <span style={{ color: '#94A3B8' }}>{placeholder}</span>
            </MenuItem>
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}
    />
  );
}
