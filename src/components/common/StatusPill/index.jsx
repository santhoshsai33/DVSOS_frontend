import { Typography } from '@mui/material';

const STATUS_COLORS = {
  PENDING: { bg: 'warning.light', color: 'warning.main' },
  IN_PROGRESS: { bg: 'info.light', color: 'info.main' },
  COMPLETED: { bg: 'success.light', color: 'success.main' },
  DELAYED: { bg: 'error.light', color: 'error.main' },
  REJECTED: { bg: 'error.light', color: 'error.main' },
  APPROVED: { bg: 'success.light', color: 'success.main' },
  BODY_SHOP: { bg: 'primary.light', color: 'primary.main' },
  WATER_WASH: { bg: 'primary.light', color: 'primary.main' },
};

// eslint-disable-next-line react/prop-types
export default function StatusPill({ status }) {
  const variant = STATUS_COLORS[status] || { bg: 'grey.200', color: 'grey.700' };
  return (
    <Typography
      variant="caption"
      sx={{
        bgcolor: variant.bg,
        color: variant.color,
        px: 1.5,
        py: 0.5,
        borderRadius: 8,
        fontWeight: 600,
        textTransform: 'uppercase',
        display: 'inline-block',
      }}
    >
      {status.replace('_', ' ')}
    </Typography>
  );
}
