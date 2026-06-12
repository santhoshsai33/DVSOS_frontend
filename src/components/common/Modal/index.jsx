import { Modal as BSModal } from 'react-bootstrap';
import Button from '../Button';

// eslint-disable-next-line react/prop-types
export default function Modal({
  show,
  onHide,
  title,
  children,
  footer,
  size = 'md',
  centered = true,
  closeButton = true,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  confirmVariant = 'primary',
  isConfirming = false,
  backdrop = 'static',
}) {
  return (
    <BSModal
      show={show}
      onHide={onHide}
      size={size}
      centered={centered}
      backdrop={backdrop}
    >
      <BSModal.Header closeButton={closeButton} onHide={onHide} className="border-0 pb-0">
        <BSModal.Title className="fw-bold" style={{ fontSize: '1.1rem' }}>
          {title}
        </BSModal.Title>
      </BSModal.Header>
      <BSModal.Body className="pt-3">{children}</BSModal.Body>
      {(footer || onConfirm) && (
        <BSModal.Footer className="border-0 pt-0 gap-2">
          {footer || (
            <>
              <Button variant="secondary" onClick={onHide}>{cancelLabel}</Button>
              <Button variant={confirmVariant} onClick={onConfirm} isLoading={isConfirming}>
                {confirmLabel}
              </Button>
            </>
          )}
        </BSModal.Footer>
      )}
    </BSModal>
  );
}
