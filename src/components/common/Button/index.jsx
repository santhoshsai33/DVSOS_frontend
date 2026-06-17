import { Button as MuiButton, CircularProgress } from '@mui/material';

// eslint-disable-next-line react/prop-types
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  className = '',
  onClick,
  type = 'button',
  sx = {},
  ...props
}) {
  let muiVariant = 'contained';
  let color = 'primary';

  let baseSx = {};

  switch (variant) {
    case 'primary': 
      muiVariant = 'contained'; 
      color = 'primary'; 
      baseSx = {
        boxShadow: 'none',
        border: '1px solid transparent',
        '&:hover': {
          backgroundColor: 'transparent',
          color: 'primary.main',
          border: '1px solid',
          borderColor: 'primary.main',
          boxShadow: 'none',
        }
      };
      break;
    case 'secondary': 
      muiVariant = 'outlined'; 
      color = 'inherit'; 
      baseSx = {
        color: '#64748B',
        borderColor: '#CBD5E1',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: '#F1F5F9',
          borderColor: 'transparent',
          color: '#0F172A',
          boxShadow: 'none',
        }
      };
      break;
    case 'success': muiVariant = 'contained'; color = 'success'; break;
    case 'danger': muiVariant = 'contained'; color = 'error'; break;
    case 'warning': muiVariant = 'contained'; color = 'warning'; break;
    case 'ghost': muiVariant = 'text'; color = 'inherit'; break;
    case 'outline': muiVariant = 'outlined'; color = 'inherit'; break;
    case 'link': muiVariant = 'text'; color = 'info'; break;
    default: break;
  }

  const muiSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium';

  return (
    <MuiButton
      type={type}
      variant={muiVariant}
      color={color}
      size={muiSize}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={className}
      startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : LeftIcon ? <LeftIcon size={16} /> : null}
      endIcon={!isLoading && RightIcon ? <RightIcon size={16} /> : null}
      sx={{ ...baseSx, ...sx }}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
