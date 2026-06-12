import {
  LayoutDashboard,
  LogIn,
  Car,
  FileText,
  CheckSquare,
  Wrench,
  Paintbrush,
  Droplets,
  Truck,
  BarChart2,
  Users,
  Settings,
  Database,
  ShieldCheck,
  TrendingUp,
  Clock,
  Package,
  Tag,
  Layers,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ListChecks,
} from 'lucide-react';
import { ROLES } from './roles';

export const SIDEBAR_MENUS = {
  [ROLES.GATE_SECURITY]: [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Gate Entry',
      icon: LogIn,
      children: [
        { label: 'New Vehicle Entry', path: '/gate-entry/new', icon: Car },
        { label: "Today's Entries", path: '/gate-entry', icon: ListChecks },
      ],
    },
    {
      label: 'Vehicles',
      icon: Car,
      children: [
        { label: 'Search Vehicle', path: '/vehicles', icon: Car },
        { label: 'Service History', path: '/vehicles/history', icon: Clock },
      ],
    },
  ],

  [ROLES.CRM_TEAM]: [
    // { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    {
      label: 'Job Cards',
      icon: FileText,
      children: [
        { label: 'Create Job Card', path: '/job-cards/create', icon: FileText },
        { label: 'Job Card List', path: '/job-cards', icon: ClipboardList },
        { label: 'Pending Job Cards', path: '/job-cards?status=PENDING', icon: Clock },
      ],
    },
    {
      label: 'Customer Approvals',
      icon: CheckSquare,
      children: [
        { label: 'Pending', path: '/approvals?tab=PENDING', icon: AlertCircle },
        { label: 'Approved', path: '/approvals?tab=APPROVED', icon: CheckCircle2 },
        { label: 'Rejected', path: '/approvals?tab=REJECTED', icon: XCircle },
      ],
    },
    {
      label: 'Vehicles',
      icon: Car,
      children: [
        { label: 'Vehicle Search', path: '/vehicles', icon: Car },
        { label: 'Service History', path: '/vehicles/history', icon: Clock },
      ],
    },
    {
      label: 'Delivery Management',
      icon: Truck,
      children: [
        { label: 'Ready For Delivery', path: '/delivery/ready', icon: Package },
        { label: 'Delivered Vehicles', path: '/delivery/delivered', icon: CheckCircle2 },
      ],
    },
  ],

  [ROLES.FLOOR_SUPERVISOR]: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    {
      label: 'Mechanical Queue',
      icon: Wrench,
      children: [
        { label: 'Pending', path: '/work-queue/mechanical?tab=PENDING', icon: AlertCircle },
        { label: 'Assigned', path: '/work-queue/mechanical?tab=ASSIGNED', icon: ClipboardList },
        { label: 'In Progress', path: '/work-queue/mechanical?tab=IN_PROGRESS', icon: Clock },
        { label: 'Completed', path: '/work-queue/mechanical?tab=COMPLETED', icon: CheckCircle2 },
      ],
    },
    {
      label: 'Additional Work',
      icon: ListChecks,
      children: [
        { label: 'Create Request', path: '/additional-work/create', icon: FileText },
        { label: 'Approval Status', path: '/additional-work/status', icon: CheckSquare },
      ],
    },
    { label: 'Vehicles', path: '/vehicles', icon: Car },
    { label: 'Job Cards', path: '/job-cards', icon: FileText },
  ],

  [ROLES.BODY_SHOP_SUPERVISOR]: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    {
      label: 'Body Shop Queue',
      icon: Paintbrush,
      children: [
        { label: 'Pending', path: '/work-queue/body-shop?tab=PENDING', icon: AlertCircle },
        { label: 'In Progress', path: '/work-queue/body-shop?tab=IN_PROGRESS', icon: Clock },
        { label: 'Completed', path: '/work-queue/body-shop?tab=COMPLETED', icon: CheckCircle2 },
      ],
    },
    { label: 'Vehicles', path: '/vehicles', icon: Car },
    { label: 'Job Cards', path: '/job-cards', icon: FileText },
  ],

  [ROLES.WATER_WASH_TEAM]: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    {
      label: 'Water Wash Queue',
      icon: Droplets,
      children: [
        { label: 'Pending', path: '/work-queue/water-wash?tab=PENDING', icon: AlertCircle },
        { label: 'In Progress', path: '/work-queue/water-wash?tab=IN_PROGRESS', icon: Clock },
        { label: 'Completed', path: '/work-queue/water-wash?tab=COMPLETED', icon: CheckCircle2 },
      ],
    },
    { label: 'Ready For Delivery', path: '/delivery/ready', icon: Truck },
  ],

  [ROLES.MANAGER]: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Operations', path: '/operations', icon: Layers },
    { label: 'Vehicle Tracking', path: '/vehicles', icon: Car },
    { label: 'Delayed Vehicles', path: '/vehicles?status=DELAYED', icon: AlertCircle },
    { label: 'Job Cards', path: '/job-cards', icon: FileText },
    { label: 'Approvals', path: '/approvals', icon: CheckSquare },
    { label: 'Mechanical Queue', path: '/work-queue/mechanical', icon: Wrench },
    { label: 'Body Shop Queue', path: '/work-queue/body-shop', icon: Paintbrush },
    { label: 'Water Wash Queue', path: '/work-queue/water-wash', icon: Droplets },
    { label: 'Reports', path: '/reports', icon: BarChart2 },
    { label: 'Users', path: '/users', icon: Users },
  ],

  [ROLES.MD]: [
    { label: 'Executive Dashboard', path: '/dashboard', icon: TrendingUp },
    { label: 'KPI Dashboard', path: '/kpi-dashboard', icon: BarChart2 },
    { label: 'Operations Monitoring', path: '/operations', icon: Layers },
    { label: 'Reports', path: '/reports', icon: BarChart2 },
    { label: 'Users', path: '/users', icon: Users },
  ],

  [ROLES.SUPER_ADMIN]: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Vehicles', path: '/vehicles', icon: Car },
    { label: 'Job Cards', path: '/job-cards', icon: FileText },
    { label: 'Approvals', path: '/approvals', icon: CheckSquare },
    { label: 'Mechanical Queue', path: '/work-queue/mechanical', icon: Wrench },
    { label: 'Body Shop Queue', path: '/work-queue/body-shop', icon: Paintbrush },
    { label: 'Water Wash Queue', path: '/work-queue/water-wash', icon: Droplets },
    { label: 'Reports', path: '/reports', icon: BarChart2 },
    { label: 'Users', path: '/users', icon: Users },
    {
      label: 'Masters',
      icon: Database,
      children: [
        { label: 'Services', path: '/masters/services', icon: Package },
        { label: 'Vehicle Brands', path: '/masters/brands', icon: Car },
        { label: 'Vehicle Models', path: '/masters/models', icon: Car },
        { label: 'Pricing', path: '/masters/pricing', icon: Tag },
      ],
    },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Audit Logs', path: '/audit-logs', icon: ShieldCheck },
  ],
};
