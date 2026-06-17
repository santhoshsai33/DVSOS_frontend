import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox, FormControlLabel, FormControl, FormHelperText } from '@mui/material';

// eslint-disable-next-line react/prop-types
export default function RHFCheckbox({ name, label, hint, disabled = false, className = '', sx = {} }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} component="fieldset" className={className} sx={{ mb: 2, ...sx }}>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={!!field.value}
                disabled={disabled}
                color="primary"
              />
            }
            label={label}
          />
          {(error || hint) && (
            <FormHelperText>{error ? error.message : hint}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
