import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format a date string to display format
 */
export const formatDate = (date, fmt = 'dd MMM yyyy') => {
  if (!date) return '—';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsed) ? format(parsed, fmt) : '—';
  } catch {
    return '—';
  }
};

/**
 * Format datetime
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'dd MMM yyyy, hh:mm a');
};

/**
 * Time ago
 */
export const timeAgo = (date) => {
  if (!date) return '—';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsed) ? formatDistanceToNow(parsed, { addSuffix: true }) : '—';
  } catch {
    return '—';
  }
};

/**
 * Format currency (INR)
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format vehicle number (uppercase with spaces)
 */
export const formatVehicleNumber = (num) => {
  if (!num) return '—';
  return num.toUpperCase().replace(/\s+/g, ' ').trim();
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '—';
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 ? `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}` : phone;
};

/**
 * Truncate text
 */
export const truncate = (text, maxLength = 40) => {
  if (!text) return '—';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

/**
 * Capitalize first letter of each word
 */
export const titleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

/**
 * Snake to label
 */
export const snakeToLabel = (str) => {
  if (!str) return '';
  return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};
