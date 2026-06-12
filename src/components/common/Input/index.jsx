import { Form } from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
export default function Input({ label, error, helperText, ...props }) {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control isInvalid={!!error} {...props} />
      {error ? (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      ) : helperText ? (
        <Form.Text className="text-muted">{helperText}</Form.Text>
      ) : null}
    </Form.Group>
  );
}
