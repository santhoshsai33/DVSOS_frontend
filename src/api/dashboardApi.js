import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export const getDashboardStatsApi = () => axiosInstance.get(ENDPOINTS.DASHBOARD.STATS);
export const getAdminDashboardApi = () => axiosInstance.get(ENDPOINTS.DASHBOARD.ADMIN);
export const getManagerDashboardApi = () => axiosInstance.get(ENDPOINTS.DASHBOARD.MANAGER);
export const getMDDashboardApi = () => axiosInstance.get(ENDPOINTS.DASHBOARD.MD);
export const getSupervisorDashboardApi = () => axiosInstance.get(ENDPOINTS.DASHBOARD.SUPERVISOR);
export const getRecentJobsApi = () => axiosInstance.get(ENDPOINTS.DASHBOARD.RECENT_JOBS);
export const getQueueSummaryApi = () => axiosInstance.get(ENDPOINTS.DASHBOARD.QUEUE_SUMMARY);
