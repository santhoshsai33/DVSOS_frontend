import {
  AlertCircle,
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
  MapPin,
  Building,
  Monitor,
  Tag,
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
    { label: 'Work Status', path: ROUTES.FLOOR_WORK_STATUS, icon: CheckSquare },
    { label: 'Job Cards', path: ROUTES.JOB_CARDS, icon: ClipboardList },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
  ],

  [ROLES.BODY_SHOP_SUPERVISOR]: [
    { label: 'Dashboard', path: ROUTES.BODY_SHOP_QUEUE, icon: LayoutDashboard },
    { label: 'Assign Mechanic', path: ROUTES.BODY_SHOP_ASSIGN_MECHANIC, icon: User },
    { label: 'Additional Work', path: ROUTES.BODY_SHOP_ADDITIONAL_WORK, icon: AlertCircle },
    { label: 'Work Status', path: ROUTES.BODY_SHOP_WORK_STATUS, icon: CheckSquare },
    { label: 'Job Cards', path: ROUTES.JOB_CARDS, icon: ClipboardList },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
  ],

  [ROLES.WATER_WASH_TEAM]: [
    { label: 'Dashboard', path: ROUTES.WATER_WASH_DASHBOARD, icon: LayoutDashboard },
    { label: 'Assign Member', path: ROUTES.WATER_WASH_ASSIGN_MEMBER, icon: User },
    { label: 'Job Cards', path: ROUTES.JOB_CARDS, icon: ClipboardList },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
  ],

  [ROLES.MANAGER]: [
    { label: 'Manager Dashboard', path: ROUTES.MANAGER_DASHBOARD, icon: LayoutDashboard },
    { label: 'User Management', path: ROUTES.ADMIN_USERS, icon: Users },
    { label: 'TV Display', path: ROUTES.KIOSK_TV, icon: Monitor },
    ...commonLinks,
  ],

  [ROLES.MD]: [
    { label: 'MD Dashboard', path: ROUTES.MD_DASHBOARD, icon: LayoutDashboard },
    { label: 'Stage Schedules', path: ROUTES.MD_STAGE_SCHEDULES, icon: Clock },

    // { label: 'Executive Overview', path: ROUTES.MD_EXECUTIVE_OVERVIEW, icon: BarChart2 },
    // { label: 'Performance Report', path: ROUTES.MD_PERFORMANCE_REPORT, icon: FileText },
    // { label: 'Service KPI', path: ROUTES.MD_SERVICE_KPI, icon: CheckSquare },


    // { label: 'Locations', path: ROUTES.ADMIN_LOCATIONS, icon: MapPin },
    { label: 'Role Management', path: ROUTES.ADMIN_ROLES, icon: ShieldCheck },
    { label: 'User Management', path: ROUTES.ADMIN_USERS, icon: Users },
    { label: 'Customers', path: ROUTES.CUSTOMERS, icon: Users },
    { label: 'Vehicles', path: ROUTES.VEHICLES, icon: Car },
    { label: 'Job Cards', path: ROUTES.JOB_CARDS, icon: ClipboardList },
    { label: 'Vehicle Entry', path: ROUTES.GATE_ENTRY, icon: LogIn },
    { label: 'Audit Logs', path: ROUTES.ADMIN_AUDIT_LOGS, icon: FileText },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
    // { label: 'System Settings', path: ROUTES.ADMIN_SETTINGS, icon: Settings },
    { label: 'TV Display', path: ROUTES.KIOSK_TV, icon: Monitor },
  ],

  [ROLES.SUPER_ADMIN]: [
    { label: 'Admin Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
    // { label: 'TV Display', path: ROUTES.KIOSK_TV, icon: Monitor },
    {
      label: 'Master Menu',
      icon: Database,
      children: [
        { label: 'States', path: ROUTES.ADMIN_MASTER_STATES, icon: MapPin },
        { label: 'Districts', path: ROUTES.ADMIN_MASTER_DISTRICTS, icon: Building },
        { label: 'Service Categories', path: ROUTES.ADMIN_MASTER_CATEGORIES, icon: ClipboardList },
        { label: 'Service Items', path: ROUTES.ADMIN_MASTER_ITEMS, icon: Wrench },
        { label: 'Modules', path: ROUTES.ADMIN_MODULES, icon: Package },
        { label: 'Statuses', path: ROUTES.ADMIN_MASTER_STATUSES, icon: CheckSquare },
        { label: 'Brands', path: ROUTES.ADMIN_MASTER_BRANDS, icon: Tag },
      ]
    },
    { label: 'Service Centers', path: ROUTES.ADMIN_SERVICE_CENTERS, icon: Building },
    { label: 'Locations', path: ROUTES.ADMIN_LOCATIONS, icon: MapPin },
    { label: 'Role Management', path: ROUTES.ADMIN_ROLES, icon: ShieldCheck },
    { label: 'User Management', path: ROUTES.ADMIN_USERS, icon: Users },
  ],
};

