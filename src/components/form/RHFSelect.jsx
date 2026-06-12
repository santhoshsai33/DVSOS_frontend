import { useFormContext } from 'react-hook-form';
import styles from './FormField.module.css';

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
      <select
        id={name}
        disabled={disabled}
        {...register(name)}
        className={[styles.select, error ? styles.error : ''].join(' ')}
        aria-invalid={!!error}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && (
        <p className={styles.errorMsg} role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
