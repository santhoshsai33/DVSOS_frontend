import { useFormContext } from 'react-hook-form';
import styles from './FormField.module.css';

// eslint-disable-next-line react/prop-types
export default function RHFCheckbox({ name, label, hint, disabled = false, className = '' }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className={[styles.group, className].join(' ')}>
      <label className={styles.checkboxGroup}>
        <input
          type="checkbox"
          id={name}
          disabled={disabled}
          {...register(name)}
          className={styles.checkbox}
        />
        <span className={styles.label} style={{ marginBottom: 0 }}>{label}</span>
      </label>
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && <p className={styles.errorMsg}>{error.message}</p>}
    </div>
  );
}
