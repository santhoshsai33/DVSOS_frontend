import {
  AlertCircle,
  BarChart2,
  Bell,
  Car,
  CheckSquare,
  ClipboardList,
  Database,
  Droplets,
  FileText,
  LayoutDashboard,
  LogIn,
  Paintbrush,
  Settings,
  ShieldCheck,
  Truck,
  User,
  Users,
  Wrench,
} from 'lucide-react';
import { ROUTES } from '../config/routes';
import { ROLES } from './roles';

const commonLinks = [
  { label: 'Customers', path: ROUTES.CUSTOMERS, icon: Users },
  { label: 'Vehicles', path: ROUTES.VEHICLES, icon: Car },
  { label: 'Job Cards', path: ROUTES.JOB_CARDS, icon: ClipboardList },
  { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
];

export const SIDEBAR_MENUS = {
  [ROLES.GATE_SECURITY]: [
    { label: 'Gate Dashboard', path: ROUTES.GATE_DASHBOARD, icon: LayoutDashboard },
    { label: 'Vehicle Entry', path: ROUTES.GATE_ENTRY, icon: LogIn },
    { label: 'Vehicle Exit', path: ROUTES.GATE_EXIT, icon: Truck },
    { label: 'Pending Sync', path: ROUTES.GATE_PENDING_SYNC, icon: AlertCircle },
    { label: 'Service History', path: ROUTES.SERVICE_HISTORY, icon: FileText },
  ],

  [ROLES.CRM_TEAM]: [
    { label: 'Job Cards', path: ROUTES.JOB_CARDS, icon: ClipboardList },
    { label: 'Customers', path: ROUTES.CUSTOMERS, icon: Users },
    { label: 'Vehicles', path: ROUTES.VEHICLES, icon: Car },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
  ],

  [ROLES.FLOOR_SUPERVISOR]: [
    { label: 'Mechanical Queue', path: ROUTES.FLOOR_MECHANICAL_QUEUE, icon: Wrench },
    { label: 'Job Cards', path: ROUTES.JOB_CARDS, icon: ClipboardList },
    { label: 'Vehicles', path: ROUTES.VEHICLES, icon: Car },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
  ],

  [ROLES.BODY_SHOP_SUPERVISOR]: [
    { label: 'Body Shop Dashboard', path: ROUTES.BODY_SHOP_DASHBOARD, icon: LayoutDashboard },
    { label: 'Body Shop Queue', path: ROUTES.BODY_SHOP_QUEUE, icon: Paintbrush },
    ...commonLinks,
  ],

  [ROLES.WATER_WASH_TEAM]: [
    { label: 'Water Wash Dashboard', path: ROUTES.WATER_WASH_DASHBOARD, icon: LayoutDashboard },
    { label: 'Water Wash Queue', path: ROUTES.WATER_WASH_QUEUE, icon: Droplets },
    { label: 'Delivery Ready', path: ROUTES.CRM_DELIVERY_READY, icon: Truck },
  ],

  [ROLES.MANAGER]: [
    { label: 'Manager Dashboard', path: ROUTES.MANAGER_DASHBOARD, icon: LayoutDashboard },
    { label: 'Operations Overview', path: ROUTES.MANAGER_OPERATIONS, icon: BarChart2 },
    { label: 'Delayed Jobs', path: ROUTES.MANAGER_DELAYED_JOBS, icon: AlertCircle },
    { label: 'Pending Approvals', path: ROUTES.MANAGER_PENDING_APPROVALS, icon: CheckSquare },
    { label: 'Reports', path: ROUTES.MANAGER_REPORTS, icon: FileText },
    ...commonLinks,
  ],

  [ROLES.MD]: [
    { label: 'MD Dashboard', path: ROUTES.MD_DASHBOARD, icon: LayoutDashboard },
    { label: 'Executive Overview', path: ROUTES.MD_EXECUTIVE_OVERVIEW, icon: BarChart2 },
    { label: 'Performance Report', path: ROUTES.MD_PERFORMANCE_REPORT, icon: FileText },
    { label: 'Service KPI', path: ROUTES.MD_SERVICE_KPI, icon: CheckSquare },
  ],

  [ROLES.SUPER_ADMIN]: [
    { label: 'Admin Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
    { label: 'User Management', path: ROUTES.ADMIN_USERS, icon: Users },
    { label: 'Role Management', path: ROUTES.ADMIN_ROLES, icon: ShieldCheck },
    { label: 'Service Items', path: ROUTES.ADMIN_SERVICE_ITEMS, icon: Database },
    { label: 'System Settings', path: ROUTES.ADMIN_SETTINGS, icon: Settings },
    { label: 'Audit Logs', path: ROUTES.ADMIN_AUDIT_LOGS, icon: FileText },
    ...commonLinks,
  ],
};

