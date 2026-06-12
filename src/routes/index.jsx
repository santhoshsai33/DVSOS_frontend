import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout';
import KioskLayout from '../layouts/KioskLayout/KioskLayout';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import { ROLES } from '../constants/roles';

// Pages
import Login from '../pages/Auth/Login';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ManagerDashboard from '../pages/Dashboard/ManagerDashboard';
import MDDashboard from '../pages/Dashboard/MDDashboard';
import VehicleList from '../pages/Vehicles/VehicleList';
import GateEntryList from '../pages/GateEntry/GateEntryList';
import GateEntryForm from '../pages/GateEntry/GateEntryForm';
import JobCardList from '../pages/JobCards/JobCardList';
import JobCardCreate from '../pages/JobCards/JobCardCreate';
import ApprovalQueue from '../pages/Approvals/ApprovalQueue';
import MechanicalQueue from '../pages/WorkQueue/MechanicalQueue';
import BodyShopQueue from '../pages/WorkQueue/BodyShopQueue';
import WaterWashQueue from '../pages/WorkQueue/WaterWashQueue';
import UserList from '../pages/Users/UserList';
import MasterSettings from '../pages/Masters/MasterSettings';
import KioskDisplay from '../pages/Kiosk/KioskDisplay';

// New Imports
import VehicleHistory from '../pages/Vehicles/VehicleHistory';
import CreateRequest from '../pages/AdditionalWork/CreateRequest';
import ApprovalStatus from '../pages/AdditionalWork/ApprovalStatus';
import ReadyForDelivery from '../pages/Delivery/ReadyForDelivery';
import DeliveredVehicles from '../pages/Delivery/DeliveredVehicles';
import OperationsDashboard from '../pages/Dashboard/OperationsDashboard';
import ReportsPage from '../pages/Reports/ReportsPage';
import KPIDashboard from '../pages/Dashboard/KPIDashboard';
import AuditLogs from '../pages/Admin/AuditLogs';

import useAuthStore from '../store/useAuthStore';

// Role Groups
const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.MD, ROLES.MANAGER];
const SHOP_ROLES = [ROLES.FLOOR_SUPERVISOR, ROLES.BODY_SHOP_SUPERVISOR, ROLES.WATER_WASH_TEAM];
const CRM_ROLES = [ROLES.CRM_TEAM, ROLES.MANAGER, ROLES.SUPER_ADMIN];

// Smart redirect based on role
function RootRedirect() {
  const { isAuthenticated, role } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (ADMIN_ROLES.includes(role)) return <Navigate to="/dashboard" replace />;
  if (role === ROLES.GATE_SECURITY) return <Navigate to="/gate-entry" replace />;
  if (role === ROLES.CRM_TEAM) return <Navigate to="/job-cards" replace />;
  if (role === ROLES.FLOOR_SUPERVISOR) return <Navigate to="/work-queue/mechanical" replace />;
  if (role === ROLES.BODY_SHOP_SUPERVISOR) return <Navigate to="/work-queue/body-shop" replace />;
  if (role === ROLES.WATER_WASH_TEAM) return <Navigate to="/work-queue/water-wash" replace />;

  return <Navigate to="/dashboard" replace />;
}

export const router = createBrowserRouter([
  // Public / Auth Routes
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ],
  },

  // Kiosk / Display Route (No Auth Required for Kiosk to easily cast to TVs)
  {
    element: <KioskLayout />,
    children: [
      { path: 'display', element: <KioskDisplay /> },
    ],
  },

  // Protected App Routes
  {
    path: '/',
    element: <ProtectedRoute />, // Base protection
    children: [
      { index: true, element: <RootRedirect /> },
      {
        element: <DashboardLayout />,
        children: [
          // Dashboards
          {
            element: <ProtectedRoute allowedRoles={[...ADMIN_ROLES, ROLES.FLOOR_SUPERVISOR]} />,
            children: [
              { path: 'dashboard', element: <ManagerDashboard /> },
              { path: 'operations', element: <OperationsDashboard /> },
            ]
          },
          {
            element: <ProtectedRoute allowedRoles={[ROLES.MD, ROLES.SUPER_ADMIN]} />,
            children: [
              { path: 'executive-dashboard', element: <MDDashboard /> },
              { path: 'kpi-dashboard', element: <KPIDashboard /> },
            ]
          },

          // Vehicles
          {
            path: 'vehicles',
            element: <ProtectedRoute allowedRoles={[...CRM_ROLES, ROLES.GATE_SECURITY, ...SHOP_ROLES]} />,
            children: [
              { index: true, element: <VehicleList /> },
              { path: 'history', element: <VehicleHistory /> },
              { path: ':id/history', element: <VehicleHistory /> },
            ]
          },

          // Gate Entry
          {
            path: 'gate-entry',
            element: <ProtectedRoute allowedRoles={[ROLES.GATE_SECURITY, ...ADMIN_ROLES]} />,
            children: [
              { index: true, element: <GateEntryList /> },
              { path: 'new', element: <GateEntryForm /> },
            ]
          },

          // Job Cards
          {
            path: 'job-cards',
            element: <ProtectedRoute allowedRoles={[...CRM_ROLES, ...SHOP_ROLES]} />,
            children: [
              { index: true, element: <JobCardList /> },
              { path: 'create', element: <JobCardCreate /> },
            ]
          },

          // Approvals
          {
            path: 'approvals',
            element: <ProtectedRoute allowedRoles={[...CRM_ROLES, ...SHOP_ROLES]} />,
            children: [
              { index: true, element: <ApprovalQueue /> },
            ]
          },

          // Work Queues
          {
            path: 'work-queue',
            children: [
              {
                path: 'mechanical',
                element: <ProtectedRoute allowedRoles={[ROLES.FLOOR_SUPERVISOR, ...ADMIN_ROLES]} />,
                children: [{ index: true, element: <MechanicalQueue /> }]
              },
              {
                path: 'body-shop',
                element: <ProtectedRoute allowedRoles={[ROLES.BODY_SHOP_SUPERVISOR, ...ADMIN_ROLES]} />,
                children: [{ index: true, element: <BodyShopQueue /> }]
              },
              {
                path: 'water-wash',
                element: <ProtectedRoute allowedRoles={[ROLES.WATER_WASH_TEAM, ...ADMIN_ROLES]} />,
                children: [{ index: true, element: <WaterWashQueue /> }]
              },
            ]
          },

          // Additional Work
          {
            path: 'additional-work',
            element: <ProtectedRoute allowedRoles={[...SHOP_ROLES, ...CRM_ROLES, ...ADMIN_ROLES]} />,
            children: [
              { path: 'create', element: <CreateRequest /> },
              { path: 'status', element: <ApprovalStatus /> },
            ]
          },

          // Delivery
          {
            path: 'delivery',
            element: <ProtectedRoute allowedRoles={[...CRM_ROLES, ...ADMIN_ROLES, ROLES.WATER_WASH_TEAM]} />,
            children: [
              { path: 'ready', element: <ReadyForDelivery /> },
              { path: 'delivered', element: <DeliveredVehicles /> },
            ]
          },

          // Settings & Admin
          {
            path: 'settings',
            element: <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.MD]} />,
            children: [
              { path: 'users', element: <UserList /> },
              { path: 'masters', element: <MasterSettings /> },
            ]
          },

          // Reports
          {
            path: 'reports',
            element: <ProtectedRoute allowedRoles={ADMIN_ROLES} />,
            children: [{ index: true, element: <ReportsPage /> }]
          },

          // Audit Logs
          {
            path: 'audit-logs',
            element: <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />,
            children: [{ index: true, element: <AuditLogs /> }]
          },
        ],
      },
    ],
  },

  // Fallback
  { path: '*', element: <Navigate to="/" replace /> },
]);
