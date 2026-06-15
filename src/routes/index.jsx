import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/AppLayout';
import KioskLayout from '../layouts/KioskLayout/KioskLayout';
import ProtectedRoute from '../components/guards/ProtectedRoute';
import { ROUTES } from '../config/routes';
import { PERMISSIONS } from '../config/permissions';
import { ROLES } from '../constants/roles';
import useAuthStore from '../store/useAuthStore';

import Login from '../features/auth/pages/LoginPage';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import AdminDashboardPage from '../features/roles/admin/pages/AdminDashboardPage';
import UserManagementPage from '../features/roles/admin/pages/UserManagementPage';
import RoleManagementPage from '../features/roles/admin/pages/RoleManagementPage';
import RolePrivilegesForm from '../features/roles/admin/pages/RolePrivilegesForm';
import ServiceCategories from '../pages/Masters/ServiceCategories';
import ServiceCategoryForm from '../pages/Masters/ServiceCategoryForm';
import ServiceItems from '../pages/Masters/ServiceItems';
import ServiceItemForm from '../pages/Masters/ServiceItemForm';
import ServicePricing from '../pages/Masters/ServicePricing';
import ServicePricingForm from '../pages/Masters/ServicePricingForm';
import SystemSettingsPage from '../features/roles/admin/pages/SystemSettingsPage';
import AuditLogsPage from '../features/roles/admin/pages/AuditLogsPage';
import UserForm from '../pages/Users/UserForm';
import GateDashboardPage from '../features/roles/gate-security/pages/GateDashboardPage';
import GateEntryPage from '../features/roles/gate-security/pages/GateEntryPage';
import PendingSyncPage from '../features/roles/gate-security/pages/PendingSyncPage';
import CrmDashboardPage from '../features/roles/crm/pages/CrmDashboardPage';
import CreateJobCardPage from '../features/roles/crm/pages/CreateJobCardPage';
import PendingJobCardsPage from '../features/roles/crm/pages/PendingJobCardsPage';
import ApprovalFollowupPage from '../features/roles/crm/pages/ApprovalFollowupPage';
import DeliveryReadyPage from '../features/roles/crm/pages/DeliveryReadyPage';
import CrmAdditionalWorkPage from '../features/roles/crm/pages/CrmAdditionalWorkPage';
import FloorDashboardPage from '../features/roles/floor-supervisor/pages/FloorDashboardPage';
import MechanicalQueuePage from '../features/roles/floor-supervisor/pages/MechanicalQueuePage';
import AssignMechanicPage from '../features/roles/floor-supervisor/pages/AssignMechanicPage';
import AdditionalWorkRequestPage from '../features/roles/floor-supervisor/pages/AdditionalWorkRequestPage';
import MechanicWorkStatusPage from '../features/roles/floor-supervisor/pages/MechanicWorkStatusPage';
import BodyShopDashboardPage from '../features/roles/body-shop-supervisor/pages/BodyShopDashboardPage';
import BodyShopQueuePage from '../features/roles/body-shop-supervisor/pages/BodyShopQueuePage';
import BodyShopJobDetailPage from '../features/roles/body-shop-supervisor/pages/BodyShopJobDetailPage';
import WaterWashDashboardPage from '../features/roles/water-wash/pages/WaterWashDashboardPage';
import WaterWashQueuePage from '../features/roles/water-wash/pages/WaterWashQueuePage';
import WashJobDetailPage from '../features/roles/water-wash/pages/WashJobDetailPage';
import ManagerDashboardPage from '../features/roles/manager/pages/ManagerDashboardPage';
import OperationsOverviewPage from '../features/roles/manager/pages/OperationsOverviewPage';
import DelayedJobsPage from '../features/roles/manager/pages/DelayedJobsPage';
import PendingApprovalsPage from '../features/roles/manager/pages/PendingApprovalsPage';
import ManagerReportsPage from '../features/roles/manager/pages/ReportsPage';
import MdDashboardPage from '../features/roles/managing-director/pages/MdDashboardPage';
import ExecutiveOverviewPage from '../features/roles/managing-director/pages/ExecutiveOverviewPage';
import PerformanceReportPage from '../features/roles/managing-director/pages/PerformanceReportPage';
import ServiceKpiPage from '../features/roles/managing-director/pages/ServiceKpiPage';
import TvKioskPage from '../features/roles/kiosk/pages/TvKioskPage';
import CustomerListPage from '../features/common/customers/pages/CustomerListPage';
import CustomerDetailPage from '../features/common/customers/pages/CustomerDetailPage';
import VehicleListPage from '../features/common/vehicles/pages/VehicleListPage';
import VehicleDetailPage from '../features/common/vehicles/pages/VehicleDetailPage';
import JobCardListPage from '../features/common/job-cards/pages/JobCardListPage';
import JobCardDetailPage from '../features/common/job-cards/pages/JobCardDetailPage';
import ServiceHistoryPage from '../features/common/service-history/pages/ServiceHistoryPage';
import NotificationsPage from '../features/common/notifications/pages/NotificationsPage';
import ProfilePage from '../features/common/profile/pages/ProfilePage';
import SettingsPage from '../features/common/settings/pages/SettingsPage';
import DeliveredVehicles from '../pages/Delivery/DeliveredVehicles';

const roleHome = {
  [ROLES.GATE_SECURITY]: ROUTES.GATE_DASHBOARD,
  [ROLES.CRM_TEAM]: ROUTES.CRM_DASHBOARD,
  [ROLES.FLOOR_SUPERVISOR]: ROUTES.FLOOR_DASHBOARD,
  [ROLES.BODY_SHOP_SUPERVISOR]: ROUTES.BODY_SHOP_DASHBOARD,
  [ROLES.WATER_WASH_TEAM]: ROUTES.WATER_WASH_DASHBOARD,
  [ROLES.MANAGER]: ROUTES.MANAGER_DASHBOARD,
  [ROLES.MD]: ROUTES.MD_DASHBOARD,
  [ROLES.SUPER_ADMIN]: ROUTES.ADMIN_DASHBOARD,
};

function RootRedirect() {
  const { isAuthenticated, role } = useAuthStore();
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return <Navigate to={roleHome[role] || ROUTES.MANAGER_DASHBOARD} replace />;
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    element: <KioskLayout />,
    children: [
      { path: 'kiosk/tv', element: <TvKioskPage /> },
      { path: 'display', element: <Navigate to={ROUTES.KIOSK_TV} replace /> },
      { path: 'kiosk', element: <Navigate to={ROUTES.KIOSK_TV} replace /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <RootRedirect /> },
      {
        element: <DashboardLayout />,
        children: [
          {
            element: <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />,
            children: [
              { path: 'admin/dashboard', element: <AdminDashboardPage /> },
              { path: 'admin/users', element: <UserManagementPage /> },
              { path: 'admin/users/new', element: <UserForm /> },
              { path: 'admin/users/:id/edit', element: <UserForm /> },
              { path: 'admin/roles', element: <RoleManagementPage /> },
              { path: 'admin/roles/privileges', element: <RolePrivilegesForm /> },
              { path: 'admin/roles/privileges/:id/edit', element: <RolePrivilegesForm /> },
              { path: 'admin/master/categories', element: <ServiceCategories /> },
              { path: 'admin/master/categories/new', element: <ServiceCategoryForm /> },
              { path: 'admin/master/categories/:id/edit', element: <ServiceCategoryForm /> },
              { path: 'admin/master/items', element: <ServiceItems /> },
              { path: 'admin/master/items/new', element: <ServiceItemForm /> },
              { path: 'admin/master/items/:id/edit', element: <ServiceItemForm /> },
              { path: 'admin/master/pricing', element: <ServicePricing /> },
              { path: 'admin/master/pricing/new', element: <ServicePricingForm /> },
              { path: 'admin/master/pricing/:id/edit', element: <ServicePricingForm /> },
              { path: 'admin/settings', element: <SystemSettingsPage /> },
              { path: 'admin/audit-logs', element: <AuditLogsPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_GATE} />,
            children: [
              { path: 'gate/dashboard', element: <GateDashboardPage /> },
              { path: 'gate/entry', element: <GateEntryPage /> },
              { path: 'gate/pending-sync', element: <PendingSyncPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_CRM} />,
            children: [
              { path: 'crm/dashboard', element: <CrmDashboardPage /> },
              { path: 'crm/job-cards/create', element: <CreateJobCardPage /> },
              { path: 'crm/job-cards/pending', element: <PendingJobCardsPage /> },
              { path: 'crm/approvals/followup', element: <ApprovalFollowupPage /> },
              { path: 'crm/delivery-ready', element: <DeliveryReadyPage /> },
              { path: 'crm/additional-work', element: <CrmAdditionalWorkPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_FLOOR} />,
            children: [
              { path: 'floor/dashboard', element: <FloorDashboardPage /> },
              { path: 'floor/mechanical-queue', element: <MechanicalQueuePage /> },
              { path: 'floor/assign-mechanic', element: <AssignMechanicPage /> },
              { path: 'floor/additional-work', element: <AdditionalWorkRequestPage /> },
              { path: 'floor/work-status', element: <MechanicWorkStatusPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_BODY_SHOP} />,
            children: [
              { path: 'body-shop/dashboard', element: <BodyShopDashboardPage /> },
              { path: 'body-shop/queue', element: <BodyShopQueuePage /> },
              { path: 'body-shop/jobs/:id', element: <BodyShopJobDetailPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_WATER_WASH} />,
            children: [
              { path: 'water-wash/dashboard', element: <WaterWashDashboardPage /> },
              { path: 'water-wash/queue', element: <WaterWashQueuePage /> },
              { path: 'water-wash/jobs/:id', element: <WashJobDetailPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_MANAGEMENT} />,
            children: [
              { path: 'manager/dashboard', element: <ManagerDashboardPage /> },
              { path: 'manager/operations', element: <OperationsOverviewPage /> },
              { path: 'manager/delayed-jobs', element: <DelayedJobsPage /> },
              { path: 'manager/pending-approvals', element: <PendingApprovalsPage /> },
              { path: 'manager/reports', element: <ManagerReportsPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_EXECUTIVE} />,
            children: [
              { path: 'md/dashboard', element: <MdDashboardPage /> },
              { path: 'md/executive-overview', element: <ExecutiveOverviewPage /> },
              { path: 'md/performance-report', element: <PerformanceReportPage /> },
              { path: 'md/service-kpi', element: <ServiceKpiPage /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={PERMISSIONS.VIEW_COMMON} />,
            children: [
              { path: 'customers', element: <CustomerListPage title="Customers" /> },
              { path: 'customers/:id', element: <CustomerDetailPage title="Customer Detail" /> },
              { path: 'vehicles', element: <VehicleListPage /> },
              { path: 'vehicles/:id', element: <VehicleDetailPage /> },
              { path: 'job-cards', element: <JobCardListPage /> },
              { path: 'job-cards/create', element: <CreateJobCardPage /> },
              { path: 'job-cards/:id', element: <JobCardDetailPage title="Job Card Detail" /> },
              { path: 'job-cards/:id/edit', element: <CreateJobCardPage /> },
              { path: 'service-history', element: <ServiceHistoryPage /> },
              { path: 'notifications', element: <NotificationsPage title="Notifications" /> },
              { path: 'profile', element: <ProfilePage title="Profile" /> },
              { path: 'settings', element: <SettingsPage /> },
            ],
          },

          { path: 'dashboard', element: <Navigate to={ROUTES.MANAGER_DASHBOARD} replace /> },
          { path: 'operations', element: <Navigate to={ROUTES.MANAGER_OPERATIONS} replace /> },
          { path: 'gate-entry', element: <Navigate to={ROUTES.GATE_DASHBOARD} replace /> },
          { path: 'gate-entry/new', element: <Navigate to={ROUTES.GATE_ENTRY} replace /> },
          { path: 'work-queue/mechanical', element: <Navigate to={ROUTES.FLOOR_MECHANICAL_QUEUE} replace /> },
          { path: 'work-queue/body-shop', element: <Navigate to={ROUTES.BODY_SHOP_QUEUE} replace /> },
          { path: 'work-queue/water-wash', element: <Navigate to={ROUTES.WATER_WASH_QUEUE} replace /> },
          { path: 'approvals', element: <Navigate to={ROUTES.MANAGER_PENDING_APPROVALS} replace /> },
          { path: 'reports', element: <Navigate to={ROUTES.MANAGER_REPORTS} replace /> },
          { path: 'users', element: <Navigate to={ROUTES.ADMIN_USERS} replace /> },
          { path: 'audit-logs', element: <Navigate to={ROUTES.ADMIN_AUDIT_LOGS} replace /> },
          { path: 'kpi-dashboard', element: <Navigate to={ROUTES.MD_SERVICE_KPI} replace /> },
          { path: 'executive-dashboard', element: <Navigate to={ROUTES.MD_EXECUTIVE_OVERVIEW} replace /> },
          { path: 'delivery/ready', element: <Navigate to={ROUTES.CRM_DELIVERY_READY} replace /> },
          { path: 'delivery/delivered', element: <DeliveredVehicles /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
