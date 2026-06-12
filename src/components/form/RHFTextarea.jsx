import { useFormContext } from 'react-hook-form';
import styles from './FormField.module.css';

// eslint-disable-next-line react/prop-types
export default function RHFTextarea({
  name,
  label,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  hint,
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
      <textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        {...register(name)}
        className={[styles.textarea, error ? styles.error : ''].join(' ')}
        aria-invalid={!!error}
      />
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && (
        <p className={styles.errorMsg} role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
