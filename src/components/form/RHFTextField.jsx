import { useFormContext, Controller } from 'react-hook-form';
import styles from './FormField.module.css';

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
}) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className={[styles.group, className].join(' ')}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        {...register(name)}
        className={[styles.input, error ? styles.error : ''].join(' ')}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && (
        <p id={`${name}-error`} className={styles.errorMsg} role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
