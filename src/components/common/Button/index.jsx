import styles from './Button.module.css';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: styles.primary,
  secondary: styles.secondary,
  success: styles.success,
  danger: styles.danger,
  warning: styles.warning,
  ghost: styles.ghost,
  outline: styles.outline,
  link: styles.link,
};

const SIZES = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

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
  ...props
}) {
  return (
    <button
      type={type}
      className={[
        styles.btn,
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        fullWidth ? styles.fullWidth : '',
        isLoading ? styles.loading : '',
        className,
      ].join(' ')}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && <Loader2 size={16} className={styles.spinner} />}
      {!isLoading && LeftIcon && <LeftIcon size={16} />}
      <span>{children}</span>
      {!isLoading && RightIcon && <RightIcon size={16} />}
    </button>
  );
}
