import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Box, Typography } from '@mui/material';

// eslint-disable-next-line react/prop-types
export default function RHFTextField({
  name,
  label,
  placeholder,
  type = 'text',
  hint,
  required = false,
  disabled = false,
  readOnly = false,
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
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            InputProps={{
              readOnly: readOnly,
            }}
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
            {...props}
          />
        </Box>
      )}
    />
  );
}
