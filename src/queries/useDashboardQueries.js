import { useQuery } from '@tanstack/react-query';
import {
  getAdminDashboardApi,
  getManagerDashboardApi,
  getMDDashboardApi,
  getSupervisorDashboardApi,
  getQueueSummaryApi
} from '../api/dashboardApi';

// Mock data for offline development
const MOCK_MANAGER_STATS = {
  totalVehiclesToday: 42,
  pendingApprovals: 7,
  completedJobs: 18,
  delayedJobs: 3,
  inProgress: 14,
  bodyShop: 5,
  waterWash: 8,
  readyForDelivery: 4,
  revenueToday: 125000,
  revenueWeek: 680000,
  queueSummary: {
    mechanical: { pending: 8, inProgress: 6, completed: 18 },
    bodyShop: { pending: 3, inProgress: 2, completed: 7 },
    waterWash: { pending: 5, inProgress: 3, completed: 12 },
  },
  weeklyRevenue: [
    { day: 'Mon', revenue: 85000, jobs: 12 },
    { day: 'Tue', revenue: 95000, jobs: 15 },
    { day: 'Wed', revenue: 78000, jobs: 11 },
    { day: 'Thu', revenue: 112000, jobs: 18 },
    { day: 'Fri', revenue: 98000, jobs: 16 },
    { day: 'Sat', revenue: 125000, jobs: 20 },
    { day: 'Sun', revenue: 87000, jobs: 13 },
  ],
  serviceBreakdown: [
    { name: 'General Service', value: 35 },
    { name: 'Body Repair', value: 20 },
    { name: 'Engine Work', value: 18 },
    { name: 'Water Wash', value: 15 },
    { name: 'Others', value: 12 },
  ],
  recentJobs: [
    { id: '1', vehicleNo: 'TN 01 AB 1234', customer: 'Ramesh Kumar', status: 'IN_PROGRESS', stage: 'Mechanical', timeInStage: '2 hrs 15 min' },
    { id: '2', vehicleNo: 'KA 05 XY 9876', customer: 'Priya Singh', status: 'PENDING', stage: 'Gate Entry', timeInStage: '15 mins' },
    { id: '3', vehicleNo: 'MH 12 PQ 4567', customer: 'Arun Patel', status: 'COMPLETED', stage: 'Water Wash', timeInStage: '5 hrs' },
    { id: '4', vehicleNo: 'DL 04 RS 3344', customer: 'Suresh Nair', status: 'DELAYED', stage: 'Body Shop', timeInStage: '1 day 4 hrs' },
    { id: '5', vehicleNo: 'TN 09 LM 8899', customer: 'Deepa Menon', status: 'BODY_SHOP', stage: 'Body Shop', timeInStage: '3 hrs' },
    { id: '6', vehicleNo: 'AP 16 ZZ 7700', customer: 'Kiran Reddy', status: 'WATER_WASH', stage: 'Water Wash', timeInStage: '45 mins' },
  ],
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: async () => {
      const response = await getAdminDashboardApi();
      return response;
    },
    staleTime: 60000,
  });
};

export const useManagerDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'manager'],
    queryFn: async () => {
      try {
        return await getManagerDashboardApi();
      } catch {
        return MOCK_MANAGER_STATS;
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

export const useMDDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'md'],
    queryFn: async () => {
      try {
        return await getMDDashboardApi();
      } catch {
        return {
          ...MOCK_MANAGER_STATS,
          monthlyRevenue: 2850000,
          csat: 4.7,
          avgTurnaroundTime: '3.2 hrs',
          topTechnicians: [
            { name: 'Rajan M.', jobs: 42, rating: 4.9 },
            { name: 'Vikram S.', jobs: 38, rating: 4.8 },
            { name: 'Anand P.', jobs: 35, rating: 4.7 },
          ],
        };
      }
    },
    staleTime: 60000,
  });
};

export const useSupervisorDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'supervisor'],
    queryFn: async () => {
      try {
        return await getSupervisorDashboardApi();
      } catch {
        return MOCK_MANAGER_STATS;
      }
    },
    staleTime: 30000,
    refetchInterval: 30000,
  });
};

export const useQueueSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'queue-summary'],
    queryFn: async () => {
      try {
        return await getQueueSummaryApi();
      } catch {
        return MOCK_MANAGER_STATS.queueSummary;
      }
    },
    staleTime: 15000,
    refetchInterval: 30000,
  });
};
