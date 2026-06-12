const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_BASE = BASE_URL;

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },

  // Vehicles
  VEHICLES: {
    LIST: '/vehicles',
    DETAIL: (id) => `/vehicles/${id}`,
    CREATE: '/vehicles',
    UPDATE: (id) => `/vehicles/${id}`,
    DELETE: (id) => `/vehicles/${id}`,
    HISTORY: (id) => `/vehicles/${id}/history`,
    SEARCH: '/vehicles/search',
  },

  // Gate Entry
  GATE_ENTRY: {
    LIST: '/gate-entries',
    CREATE: '/gate-entries',
    DETAIL: (id) => `/gate-entries/${id}`,
    UPDATE: (id) => `/gate-entries/${id}`,
    TODAY: '/gate-entries/today',
  },

  // Job Cards
  JOB_CARDS: {
    LIST: '/job-cards',
    CREATE: '/job-cards',
    DETAIL: (id) => `/job-cards/${id}`,
    UPDATE: (id) => `/job-cards/${id}`,
    DELETE: (id) => `/job-cards/${id}`,
    PENDING: '/job-cards?status=PENDING',
  },

  // Approvals
  APPROVALS: {
    LIST: '/approvals',
    PENDING: '/approvals?status=PENDING',
    APPROVE: (id) => `/approvals/${id}/approve`,
    REJECT: (id) => `/approvals/${id}/reject`,
    DETAIL: (id) => `/approvals/${id}`,
  },

  // Work Queues
  QUEUES: {
    MECHANICAL: '/queues/mechanical',
    BODY_SHOP: '/queues/body-shop',
    WATER_WASH: '/queues/water-wash',
    UPDATE_STATUS: (id) => `/queues/${id}/status`,
    ASSIGN: (id) => `/queues/${id}/assign`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    MANAGER: '/dashboard/manager',
    MD: '/dashboard/md',
    SUPERVISOR: '/dashboard/supervisor',
    RECENT_JOBS: '/dashboard/recent-jobs',
    QUEUE_SUMMARY: '/dashboard/queue-summary',
  },

  // Reports
  REPORTS: {
    DAILY: '/reports/daily',
    WEEKLY: '/reports/weekly',
    MONTHLY: '/reports/monthly',
    CUSTOM: '/reports/custom',
    EXPORT: '/reports/export',
  },

  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    DETAIL: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    CHANGE_PASSWORD: '/users/change-password',
  },

  // Masters
  MASTERS: {
    SERVICES: '/masters/services',
    SERVICE_DETAIL: (id) => `/masters/services/${id}`,
    BRANDS: '/masters/brands',
    BRAND_DETAIL: (id) => `/masters/brands/${id}`,
    MODELS: '/masters/models',
    MODEL_DETAIL: (id) => `/masters/models/${id}`,
    PRICING: '/masters/pricing',
    PRICING_DETAIL: (id) => `/masters/pricing/${id}`,
  },

  // Kiosk
  KIOSK: {
    DISPLAY: '/kiosk/display',
  },
};
