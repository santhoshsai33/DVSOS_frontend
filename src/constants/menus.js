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
  LogOut,
  Paintbrush,
  Plus,
  Settings,
  ShieldCheck,
  Truck,
  User,
  Users,
  Wrench,
  Clock,
  Package,
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
  ],

  [ROLES.CRM_TEAM]: [
    { label: 'CRM Dashboard', path: ROUTES.CRM_DASHBOARD, icon: LayoutDashboard },
    { label: 'Job Cards', path: ROUTES.JOB_CARDS, icon: ClipboardList },
    { label: 'Pending Approvals', path: ROUTES.CRM_APPROVAL_FOLLOWUP, icon: Clock },
    { label: 'Delivery Ready', path: ROUTES.CRM_DELIVERY_READY, icon: Package },
    { label: 'Customers', path: ROUTES.CUSTOMERS, icon: Users },
    { label: 'Vehicles', path: ROUTES.VEHICLES, icon: Car },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
  ],

  [ROLES.FLOOR_SUPERVISOR]: [
    { label: 'Floor Dashboard', path: ROUTES.FLOOR_DASHBOARD, icon: LayoutDashboard },
    { label: 'Assign Mechanic', path: ROUTES.FLOOR_ASSIGN_MECHANIC, icon: User },
    { label: 'Additional Work', path: ROUTES.FLOOR_ADDITIONAL_WORK, icon: AlertCircle },
    { label: 'Job Cards', path: ROUTES.JOB_CARDS, icon: ClipboardList },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
  ],

  [ROLES.BODY_SHOP_SUPERVISOR]: [
    { label: 'Body Shop Queue', path: ROUTES.BODY_SHOP_QUEUE, icon: Paintbrush },
    { label: 'Job Cards', path: ROUTES.JOB_CARDS, icon: ClipboardList },
    { label: 'Vehicles', path: ROUTES.VEHICLES, icon: Car },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
  ],

  [ROLES.WATER_WASH_TEAM]: [
    { label: 'Water Wash Queue', path: ROUTES.WATER_WASH_QUEUE, icon: Droplets },
    { label: 'Job Cards', path: ROUTES.JOB_CARDS, icon: ClipboardList },
    { label: 'Vehicles', path: ROUTES.VEHICLES, icon: Car },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
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
    {
      label: 'Master Menu',
      icon: Database,
      children: [
        { label: 'Service Categories', path: ROUTES.ADMIN_MASTER_CATEGORIES, icon: ClipboardList },
        { label: 'Service Items', path: ROUTES.ADMIN_MASTER_ITEMS, icon: Wrench }
      ]
    },
    { label: 'Role Management', path: ROUTES.ADMIN_ROLES, icon: ShieldCheck },
    { label: 'User Management', path: ROUTES.ADMIN_USERS, icon: Users },
    { label: 'Customers', path: ROUTES.CUSTOMERS, icon: Users },
    { label: 'Vehicles', path: ROUTES.VEHICLES, icon: Car },
    { label: 'Job Cards', path: ROUTES.JOB_CARDS, icon: ClipboardList },
    { label: 'Gate Security Form', path: ROUTES.GATE_ENTRY, icon: LogIn },
    { label: 'Audit Logs', path: ROUTES.ADMIN_AUDIT_LOGS, icon: FileText },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
    { label: 'System Settings', path: ROUTES.ADMIN_SETTINGS, icon: Settings },
  ],
};

