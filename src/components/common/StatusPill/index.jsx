import { Badge } from 'react-bootstrap';

const STATUS_COLORS = {
  PENDING: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  DELAYED: 'danger',
  REJECTED: 'danger',
  APPROVED: 'success',
  BODY_SHOP: 'primary',
  WATER_WASH: 'primary',
};

// eslint-disable-next-line react/prop-types
export default function StatusPill({ status }) {
  const variant = STATUS_COLORS[status] || 'secondary';
  return (
    <Badge bg={variant} pill className="px-3 py-2 fw-medium">
      {status.replace('_', ' ')}
    </Badge>
  );
}
